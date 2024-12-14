import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { auth } from '../../firebase-config.ts';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { validatePassword } from '../../utils/validaciones.ts';

const RegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Modal bootstrap
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar requisitos de la contraseña
    if (!validatePassword(password)) {
      setModalTitle(language === 'es' ? 'Error' : 'Error');
      setModalMessage(
        language === 'es'
          ? 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.'
          : 'La contrasenya ha de tenir almenys 8 caràcters, incloure una majúscula, una minúscula, un número i un caràcter especial.'
      );
      setShowModal(true);
      return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setModalTitle(language === 'es' ? 'Error' : 'Error');
      setModalMessage(language === 'es' ? 'Las contraseñas no coinciden' : 'Les contrasenyes no coincideixen');
      setShowModal(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enviar correo de verificación
      await sendEmailVerification(user);
      setModalTitle(language === 'es' ? 'Registro con éxito.' : 'Registre amb èxit');
      setModalMessage(
        language === 'es'
          ? 'Se ha enviado un correo de verificación.'
          : "S'ha enviat un correu de verificació."
      );
      setShowModal(true);

      // Redirigir a inicio después del registro
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setModalTitle(language === 'es' ? 'Error en el registro' : 'Error amb el registre');
      setModalMessage(language === 'es' ? 'Se ha notificado un error en el registro' : "S'ha notificat un error al registre");
      setShowModal(true);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{language === 'es' ? 'Registro' : 'Registre'}</h2>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formEmail">
          <Form.Label>{language === 'es' ? 'Correo electrónico' : 'Correu electrònic'}</Form.Label>
          <Form.Control
            type="email"
            placeholder={language === 'es' ? 'Introduce tu correo electrónico' : 'Introdueix el teu correu electrònic'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>{language === 'es' ? 'Contraseña' : 'Contrasenya'}</Form.Label>
          <Form.Control
            type="password"
            placeholder={language === 'es' ? 'Introduce tu contraseña' : 'Introdueix la teva contrasenya'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>{language === 'es' ? 'Confirma tu contraseña' : 'Confirma la teva contrasenya'}</Form.Label>
          <Form.Control
            type="password"
            placeholder={language === 'es' ? 'Confirma tu contraseña' : 'Confirma la teva contrasenya'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isInvalid={password !== '' && confirmPassword !== '' && password !== confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {language === 'es' ? 'Las contraseñas no coinciden' : 'Les contrasenyes no coincideixen'}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          {language === 'es' ? 'Registrarse' : 'Registrar-se'}
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {language === 'es' ? 'Cerrar' : 'Tancar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="secondary" onClick={() => navigate('/')}>
        {language === 'es' ? 'Volver al inicio' : "Tornar a l'inici"}
      </Button>
    </div>
  );
};

export default RegisterPage;
