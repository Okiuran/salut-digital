import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { auth, db } from '../../firebase-config.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    <div>
      <h2>{translate('login.title')}</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail">
          <Form.Label>{translate('login.emailLabel')}</Form.Label>
          <Form.Control
            type="email"
            placeholder={translate('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>{translate('login.passwordLabel')}</Form.Label>
          <Form.Control
            type="password"
            placeholder={translate('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {translate('login.loginButton')}
        </Button>
      </Form>

      {/* Modal para mostrar mensajes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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

      <Button variant="secondary" onClick={() => navigate('/')}>
        {translate('login.goBackButton')}
      </Button>

      <div className="mt-3">
        <p>{translate('login.forgotPassword')}</p>
        <Button variant="success" onClick={() => navigate('/reset-password')}>
          {translate('login.resetPasswordButton')}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
