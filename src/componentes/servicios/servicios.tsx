import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config.ts';

const Servicios: React.FC = () => {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Si hay usuario, está logueado
    });
    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Container>
      <h2>{language === 'es' ? 'Nuestros servicios' : 'Els nostres serveis'}</h2>

      {/* Galería de servicios */}
      <Carousel activeIndex={index} onSelect={handleSelect} className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x300?text=Consultar+citas"
            alt="Consultar citas"
          />
          <Carousel.Caption>
            <h3>{language === 'es' ? 'Consultar tus citas médicas' : 'Consultar les teves cites mèdiques'}</h3>
            <p>{language === 'es' ? 'Accede a todas tus citas de manera fácil y rápida.' : 'Accedeix a totes les teves cites de manera fàcil i ràpida.'}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x300?text=Pedir+cita"
            alt="Pedir cita"
          />
          <Carousel.Caption>
            <h3>{language === 'es' ? 'Pedir cita online' : 'Demanar cita online'}</h3>
            <p>{language === 'es' ? 'Solicita una nueva cita médica desde tu cuenta.' : 'Sol·licita una nova cita mèdica des del teu compte.'}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x300?text=Acceso+a+historial"
            alt="Acceso a historial"
          />
          <Carousel.Caption>
            <h3>{language === 'es' ? 'Acceso a tu historial médico' : 'Accés al teu historial mèdic'}</h3>
            <p>{language === 'es' ? 'Consulta tus informes y resultados médicos.' : 'Consulta els teus informes i resultats mèdics.'}</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Registro e inicio de sesión */}
      {!isLoggedIn && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Button variant="primary" className="mx-2" onClick={() => navigate('/register')}>
              {language === 'es' ? 'Registrarse' : 'Registrar-se'}
            </Button>
            <Button variant="secondary" className="mx-2" onClick={() => navigate('/login')}>
              {language === 'es' ? 'Iniciar sesión' : 'Iniciar sessió'}
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Servicios;
