import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config.ts';

import imagen1 from '../../assets/consultar-citas.png'
import imagen2 from '../../assets/pedir-citas.webp'
import imagen3 from '../../assets/historial-medico.png'
import imagen4 from '../../assets/salud-mental.jpg'
import './servicios.css'

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
            src={imagen1}
            alt="Consultar citas"
          />
          <Carousel.Caption>
            <div className="caption-container">
              <h3>{language === 'es' ? 'Consultar tus citas médicas' : 'Consultar les teves cites mèdiques'}</h3>
              <p>{language === 'es' ? 'Accede a todas tus citas de manera fácil y rápida.' : 'Accedeix a totes les teves cites de manera fàcil i ràpida.'}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen2}
            alt="Pedir cita"
          />
          <Carousel.Caption>
            <div className="caption-container">
              <h3>{language === 'es' ? 'Pedir cita online' : 'Demanar cita online'}</h3>
              <p>{language === 'es' ? 'Solicita nuevas citas desde tu cuenta.' : 'Sol·licita noves cites des del teu compte.'}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen3}
            alt="Acceso a historial"
          />
          <Carousel.Caption>
            <div className="caption-container">
              <h3>{language === 'es' ? 'Acceso a tu historial médico' : 'Accés al teu historial mèdic'}</h3>
              <p>{language === 'es' ? 'Consulta tus informes y resultados médicos.' : 'Consulta els teus informes i resultats mèdics.'}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen4}
            alt="Otros especialistas"
          />
          <Carousel.Caption>
            <div className="caption-container">
              <h3>{language === 'es' ? 'Información a tu alcance' : 'Informació al teu abast'}</h3>
              <p>{language === 'es' ? 'Todo sobre otras especializaciones como nutrición, salud mental, etc.' : 'Tot sobre altres especialitzacions com nutrició, salut mental, etc.'}</p>
            </div>
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
