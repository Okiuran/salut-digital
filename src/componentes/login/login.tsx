import React, { useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { auth, db } from '../../firebase-config.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


const LoginPage: React.FC = () => {
  const { language } = useLanguage();
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
                // Esto lo que hace es que si te acabas de registrar o no tienes perfil sale el email pero si ya tienes perfil con nombre añadido saldrá este
            }
        } catch (fetchError) {
            console.error('Error fetching user profile:', fetchError);
        }

        // Mensaje mostrando email o nombre
        const welcomeMessage = userName
            ? (language === 'es'
                ? `Bienvenido/a, ${userName}`
                : `Benvingut, ${userName}`)
            : (language === 'es'
                ? `Bienvenido/a, ${user.email}`
                : `Benvingut, ${user.email}`);

        setModalTitle(language === 'es' ? 'Inicio de sesión con éxito' : 'Inici de sessió amb èxit');
        setModalMessage(welcomeMessage);
        setShowModal(true);

        // Redirige al inicio
        setTimeout(() => {
            setShowModal(false);
            navigate('/');
        }, 3000);
    } catch (error) {
        setModalTitle(language === 'es' ? 'Error con el inicio de sesión' : 'Error amb l\'inici de sessió');
        setModalMessage(
            language === 'es'
                ? 'Error al iniciar sesión. Por favor, verifica tus credenciales y que la cuenta esté ya creada.'
                : 'Error en iniciar sessió. Si us plau, verifica les teves credencials i que el compte estigui ja fet.'
        );
        setShowModal(true);
        console.error(error);
    }
};

  return (
    <div>
      <h2>{language === 'es' ? 'Iniciar sesión' : 'Iniciar sessió'}</h2>
      <Form onSubmit={handleLogin}>
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
        <Button variant="primary" type="submit">
          {language === 'es' ? 'Iniciar sesión' : 'Iniciar sessió'}
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
            {language === 'es' ? 'Cerrar' : 'Tancar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="secondary" onClick={() => navigate('/')}>
        {language === 'es' ? 'Volver al inicio' : 'Tornar a l\'inici'}
      </Button>

      <div className="mt-3">
        <p>
            {language === 'es'
            ? '¿Olvidaste tu contraseña?'
            : 'Has oblidat la teva contrasenya?'}
        </p>
        <Button variant="success" onClick={() => navigate('/reset-password')}>
            {language === 'es' ? 'Restablecer contraseña' : 'Restablir contrasenya'}
        </Button>
    </div>

</div>
  );
};

export default LoginPage;
