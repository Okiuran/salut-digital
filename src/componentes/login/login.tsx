import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { auth, db } from '../../firebase-config.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import '../../utils/button.css';
import '../../utils/auth.css';

const LoginPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Modal bootstrap
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el nombre del usuario desde Firestore
      let userName = '';
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          userName = userData.nombre || ''; // Obtiene el campo "nombre" si existe
        }
      } catch (fetchError) {
        console.error('Error fetching user profile:', fetchError);
      }

      // Mensaje mostrando email o nombre
      const welcomeMessage = userName
  ? `${translate('login.modalMessageSuccess')} ${userName}`
  : `${translate('login.modalMessageSuccess')} ${user.email}`;


      setModalTitle(translate('login.modalTitleSuccess'));
      setModalMessage(welcomeMessage);
      setShowModal(true);

      // Redirige al inicio
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      setModalTitle(translate('login.modalTitleError'));
      setModalMessage(translate('login.modalMessageError'));
      setShowModal(true);
      console.error(error);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">{translate('login.title')}</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>{translate('login.emailLabel')}</Form.Label>
              <Form.Control
                type="email"
                placeholder={translate('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>{translate('login.passwordLabel')}</Form.Label>
              <Form.Control
                type="password"
                placeholder={translate('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 custom-submit-button">
              {translate('login.loginButton')}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              {translate('login.goBackButton')}
            </Button>
          </div>

          <div className="text-center mt-3">
        <p>{translate('login.forgotPassword')}</p>
        <Button variant="warning" onClick={() => navigate('/reset-password')}>
          {translate('login.resetPasswordButton')}
        </Button>
      </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate('login.closeModalButton')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginPage;
