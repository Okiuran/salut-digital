import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { auth } from '../../firebase-config.ts';
import { sendPasswordResetEmail } from 'firebase/auth';

import '../../utils/auth.css';
import '../../utils/button.css';

const ResetPassword: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  // Modal bootstrap
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);

      setModalTitle(language === 'es' ? 'Correo enviado' : 'Correu enviat');
      setModalMessage(
        language === 'es'
          ? 'Hemos enviado un enlace a tu correo para establecer la contraseña.'
          : "Hem enviat un enllaç al teu correu per restablir la contrasenya."
      );
      setShowModal(true);
    } catch (error) {
      setModalTitle(language === 'es' ? 'Error' : 'Error');
      setModalMessage(
        language === 'es'
          ? 'Hubo un problema al intentar restablecer la contraseña. Verifica que el correo sea válido.'
          : "Hi ha hagut un problema en intentar restablir la contrasenya. Verifica que el correu sigui vàlid."
      );
      setShowModal(true);
      console.error(error);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">
            {language === 'es' ? 'Restablecer contraseña' : 'Restablir contrasenya'}
          </h2>
          <Form onSubmit={handlePasswordReset}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>
                {language === 'es' ? 'Correo electrónico' : 'Correu electrònic'}
              </Form.Label>
              <Form.Control
                type="email"
                placeholder={
                  language === 'es'
                    ? 'Introduce tu correo electrónico'
                    : 'Introdueix el teu correu electrònic'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 custom-submit-button">
              {language === 'es' ? 'Enviar enlace' : 'Enviar enllaç'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              {language === 'es' ? 'Volver al inicio' : "Tornar a l'inici"}
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
            {language === 'es' ? 'Cerrar' : 'Tancar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResetPassword;
