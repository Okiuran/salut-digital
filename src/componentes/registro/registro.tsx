import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { auth } from '../../firebase-config.ts';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { validateEmail, validatePassword } from '../../utils/validaciones.ts';

import '../../utils/button.css';
import '../../utils/auth.css';

const RegisterPage: React.FC = () => {
  const { language, translate } = useLanguage();
  const navigate = useNavigate();

  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const validationMessage = validateEmail(inputEmail, language);
    setIsEmailValid(validationMessage === '');
    setEmailErrorMessage(validationMessage);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid) {
      setModalTitle(translate('register.modalTitleError'));
      setModalMessage(translate('register.invalidEmailError'));
      setShowModal(true);
      return;
    }

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

    if (password !== confirmPassword) {
      setModalTitle(translate('register.modalTitleError'));
      setModalMessage(translate('register.passwordsMismatch'));
      setShowModal(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setModalTitle(translate('register.modalTitleSuccess'));
      setModalMessage(translate('register.modalMessageSuccess'));
      setShowModal(true);

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
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center">{translate('register.title')}</h2>
          <Form onSubmit={handleRegister} className="auth-form">
            <Form.Group controlId="formEmail">
              <Form.Label>{translate('register.emailLabel')}</Form.Label>
              <Form.Control
                type="email"
                placeholder={translate('register.emailPlaceholder')}
                value={email}
                onChange={handleEmailChange}
                isInvalid={!isEmailValid}
                required
              />
              <Form.Control.Feedback type="invalid">
                {translate('register.invalidEmailMessage')}
              </Form.Control.Feedback>
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
            <Button variant="primary" type="submit" className="custom-submit-button w-100">
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

          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="mt-3 w-100"
          >
            {translate('register.goBackButton')}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
