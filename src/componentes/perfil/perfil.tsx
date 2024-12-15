import React, { useEffect, useState, useCallback } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { auth, db } from '../../firebase-config.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { validateNombre, validateApellidos, validateTarjetaSanitaria, validateDNI } from '../../utils/validaciones.ts';

const PerfilUsuario: React.FC = () => {
  const { language } = useLanguage();
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
      setModalMessage(
        language === 'es'
          ? 'Corrige los errores en el formulario.'
          : 'Corregeix els errors en el formulari.'
      );
      setShowModal(true);
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
      setModalMessage(
        language === 'es'
          ? 'Perfil actualizado con éxito.'
          : 'Perfil actualitzat amb èxit.'
      );
      setShowModal(true);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage(
        language === 'es'
          ? 'Error al actualizar el perfil.'
          : 'Error en actualitzar el perfil.'
      );
      setShowModal(true);
    }
  };

  if (loading) {
    return <p>{language === 'es' ? 'Cargando...' : 'Carregant...'}</p>;
  }

  return (
    <div>
      <h2>{language === 'es' ? 'Perfil del usuario' : "Perfil de l'usuari"}</h2>
      {editing ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>{language === 'es' ? 'Nombre' : 'Nom'}</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={profile.nombre}
              onChange={handleChange}
              placeholder={language === 'es' ? 'Introduce tu nombre' : 'Introdueix el teu nom'}
              isInvalid={!!errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>{language === 'es' ? 'Apellidos' : 'Cognoms'}</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              value={profile.apellidos}
              onChange={handleChange}
              placeholder={language === 'es' ? 'Introduce tus apellidos' : 'Introdueix els teus cognoms'}
              isInvalid={!!errors.apellidos}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBirthDate">
            <Form.Label>
              {language === 'es' ? 'Fecha de nacimiento' : 'Data de naixement'}
            </Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={profile.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHealthCardNumber">
            <Form.Label>
              {language === 'es' ? 'Número de tarjeta sanitaria' : 'Número de targeta sanitària'}
            </Form.Label>
            <Form.Control
              type="text"
              name="tarjetaSanitaria"
              value={profile.tarjetaSanitaria}
              onChange={handleChange}
              placeholder={
                language === 'es' ? 'Introduce el número de tarjeta' : 'Introdueix el número de targeta'
              }
              isInvalid={!!errors.tarjetaSanitaria}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.tarjetaSanitaria}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDNI">
            <Form.Label>{'DNI'}</Form.Label>
            <Form.Control
              type="text"
              name="dni"
              value={profile.dni}
              onChange={handleChange}
              placeholder={language === 'es' ? 'Introduce tu DNI' : 'Introdueix el teu DNI'}
              isInvalid={!!errors.dni}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.dni}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            {language === 'es' ? 'Actualizar perfil' : 'Actualitzar perfil'}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)}>
            {language === 'es' ? 'Cancelar' : 'Cancel·lar'}
          </Button>
        </Form>
      ) : (
        <div>
          <p>
            <strong>{language === 'es' ? 'Nombre:' : 'Nom:'}</strong> {profile.nombre}
          </p>
          <p>
            <strong>{language === 'es' ? 'Apellidos:' : 'Cognoms:'}</strong>{' '}
            {profile.apellidos}
          </p>
          <p>
            <strong>{language === 'es' ? 'Fecha de nacimiento:' : 'Data de naixement:'}</strong>{' '}
            {profile.fechaNacimiento}
          </p>
          <p>
            <strong>{language === 'es' ? 'Tarjeta sanitaria:' : 'Targeta sanitària:'}</strong>{' '}
            {profile.tarjetaSanitaria}
          </p>
          <p>
            <strong>{language === 'es' ? 'DNI:' : 'DNI:'}</strong> {profile.dni}
          </p>
          <Button variant="primary" onClick={() => setEditing(true)}>
            {language === 'es' ? 'Editar perfil' : 'Editar perfil'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            {language === 'es' ? 'Volver al inicio' : "Torna a l'inici"}
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'es' ? 'Mensaje' : 'Missatge'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {language === 'es' ? 'Cerrar' : 'Tancar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PerfilUsuario;
