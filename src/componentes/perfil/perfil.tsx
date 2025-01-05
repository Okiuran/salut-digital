import React, { useEffect, useState, useCallback } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { auth, db } from '../../firebase-config.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { validateNombre, validateApellidos, validateTarjetaSanitaria, validateDNI } from '../../utils/validaciones.ts';
import './perfil.css';

const PerfilUsuario: React.FC = () => {
  const { language, translate } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    tarjetaSanitaria: '',
    dni: '',
  });
  const [errors, setErrors] = useState({
    nombre: '',
    apellidos: '',
    tarjetaSanitaria: '',
    dni: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as typeof profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email || '' });
        await fetchProfile(currentUser.uid);
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [fetchProfile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      nombre: validateNombre(profile.nombre, language),
      apellidos: validateApellidos(profile.apellidos, language),
      tarjetaSanitaria: validateTarjetaSanitaria(profile.tarjetaSanitaria, language),
      dni: validateDNI(profile.dni, language),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validate()) {
      setModalMessage(translate('profile.formError'));
      setShowModal(true);
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
      setModalMessage(translate('profile.successUpdateProfile'));
      setShowModal(true);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage(translate('profile.errorUpdateProfile'));
      setShowModal(true);
    }
  };

  if (loading) {
    return <p>{translate('profile.loading')}</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{translate('profile.title')}</h2>
      </div>
      {editing ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>{translate('profile.name')}</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={profile.nombre}
              onChange={handleChange}
              placeholder={translate('profile.namePlaceholder')}
              isInvalid={!!errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>{translate('profile.lastName')}</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              value={profile.apellidos}
              onChange={handleChange}
              placeholder={translate('profile.lastNamePlaceholder')}
              isInvalid={!!errors.apellidos}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBirthDate">
            <Form.Label>{translate('profile.birthDate')}</Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={profile.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHealthCardNumber">
            <Form.Label>{translate('profile.healthCard')}</Form.Label>
            <Form.Control
              type="text"
              name="tarjetaSanitaria"
              value={profile.tarjetaSanitaria}
              onChange={handleChange}
              placeholder={translate('profile.healthCardPlaceholder')}
              isInvalid={!!errors.tarjetaSanitaria}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.tarjetaSanitaria}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDNI">
            <Form.Label>{translate('profile.dni')}</Form.Label>
            <Form.Control
              type="text"
              name="dni"
              value={profile.dni}
              onChange={handleChange}
              placeholder={translate('profile.dniPlaceholder')}
              isInvalid={!!errors.dni}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.dni}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="custom-submit-button">
            {translate('profile.updateButton')}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)}>
            {translate('profile.cancelButton')}
          </Button>
        </Form>
      ) : (
        <div className="profile-details">
          <p>
            <strong>{translate('profile.name')}:</strong> {profile.nombre}
          </p>
          <p>
            <strong>{translate('profile.lastName')}:</strong> {profile.apellidos}
          </p>
          <p>
            <strong>{translate('profile.birthDate')}:</strong> {profile.fechaNacimiento}
          </p>
          <p>
            <strong>{translate('profile.healthCard')}:</strong> {profile.tarjetaSanitaria}
          </p>
          <p>
            <strong>{translate('profile.dni')}:</strong> {profile.dni}
          </p>
          <Button variant="dark" onClick={() => setEditing(true)}>
            {translate('profile.editButton')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            {translate('profile.backButton')}
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translate('profile.modalTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate('profile.modalCloseButton')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PerfilUsuario;
