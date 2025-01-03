import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { auth } from '../../firebase-config.ts';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { validatePassword } from '../../utils/validaciones.ts';

const RegisterPage: React.FC = () => {
  const { language, translate } = useLanguage();
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
      setModalTitle(translate('register.modalTitleError'));
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
      setModalTitle(translate('register.modalTitleError'));
      setModalMessage(translate('register.passwordsMismatch'));
      setShowModal(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enviar correo de verificación
      await sendEmailVerification(user);
      setModalTitle(translate('register.modalTitleSuccess'));
      setModalMessage(translate('register.modalMessageSuccess'));
      setShowModal(true);

      // Redirigir a inicio después del registro
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setModalTitle(translate('register.modalTitleError'));
      setModalMessage(translate('register.modalMessageError'));
      setShowModal(true);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{translate('register.title')}</h2>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formEmail">
          <Form.Label>{translate('register.emailLabel')}</Form.Label>
          <Form.Control
            type="email"
            placeholder={translate('register.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>{translate('register.passwordLabel')}</Form.Label>
          <Form.Control
            type="password"
            placeholder={translate('register.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>{translate('register.confirmPasswordLabel')}</Form.Label>
          <Form.Control
            type="password"
            placeholder={translate('register.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isInvalid={password !== '' && confirmPassword !== '' && password !== confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {translate('register.passwordsMismatch')}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          {translate('register.registerButton')}
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate('register.closeModalButton')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="secondary" onClick={() => navigate('/')}>
        {translate('register.goBackButton')}
      </Button>
    </div>
  );
};

export default RegisterPage;
