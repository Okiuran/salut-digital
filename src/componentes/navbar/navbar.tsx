import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { auth, db } from '../../firebase-config.ts';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const MyNavbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Manejar datos del usuario logueado
  const [user, setUser] = useState<null | { email: string; nombre?: string; apellidos?: string }>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = { email: currentUser.email || '' };
        try {
          // Consulta Firestore para obtener nombre y apellidos
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setUser({
              email: userData.email,
              nombre: profileData.nombre,
              apellidos: profileData.apellidos,
            });
          } else {
            setUser(userData); // Si no hay perfil, solo muestra el email
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
          setUser(userData); // Manejo de errores, solo muestra email
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        {'SalutDigital'}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            {language === 'es' ? 'Inicio' : 'Inici'}
          </Nav.Link>
          <Nav.Link as={Link} to="/profile">
            {'Perfil'}
          </Nav.Link>
          <Nav.Link as={Link} to="/servicios">
            {language === 'es' ? 'Servicios' : 'Serveis'}
          </Nav.Link>
          <Nav.Link onClick={() => setLanguage(language === 'es' ? 'ca' : 'es')}>
            {language === 'es' ? 'Cambiar a catalán' : 'Canviar a castellà'}
          </Nav.Link>
        </Nav>
        <Nav>
          {user ? (
            <NavDropdown
              title={
                user.nombre && user.apellidos
                  ? `${user.nombre} ${user.apellidos}` // Muestra nombre y apellidos
                  : user.email // Si no hay nombre, muestra email
              }
              id="user-menu"
              align="end" // Ajustado menú para que no se corte el texto
            >
              <NavDropdown.Item as={Link} to="/buscar-centros">
  {language === 'es' ? 'Buscar centros de salud' : 'Cercar centres de salut'}
</NavDropdown.Item>

              <NavDropdown.Item
                href="https://sem.gencat.cat/ca/061-salut-respon/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {'061 Salut Respon'}
              </NavDropdown.Item>

        <NavDropdown.Item onClick={() => navigate('/historial-medico')}>
          {'Historial'}
        </NavDropdown.Item>

              <NavDropdown.Item onClick={handleLogout}>
                {language === 'es' ? 'Cerrar sesión' : 'Tancar sessió'}
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
