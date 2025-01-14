import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal } from 'react-bootstrap';
import { auth, db } from '../../firebase-config.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

import imagen1 from '../../assets/pedir-cita.png';
import imagen2 from '../../assets/consultar-cita.png';

import './homepage.css';
import '../../utils/button.css';

import Swal from 'sweetalert2';

interface Appointment {
  profesional: string;
  presencial: boolean;
  motivo: string;
  fecha: string;
  hora: string;
}

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Estados
  const [user, setUser] = useState<null | { email: string; nombre?: string; apellidos?: string }>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);

  // Autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = { email: currentUser.email || '' };
        try {
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
            setUser(userData); // Si no hay datos en firestore, solo muestra el email
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cargar citas del usuario
  const fetchAppointments = async () => {
    if (user) {
      try {
        const q = query(collection(db, 'appointments'), where('userId', '==', auth.currentUser?.uid));
        const querySnapshot = await getDocs(q);

        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Obtener id del documento (equivalente a la tabla de una base de datos) a actualizar
          ...doc.data() as Appointment,
        }));
        setAppointments(appointmentsList);
        setShowAppointmentsModal(true);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    }
  };

  const handleCancelAppointment = async (index: number) => {
    const appointmentToCancel = appointments[index];

    Swal.fire({
      title: language === 'es' ? '¿Estás seguro de que quieres cancelar la cita?' : 'Estàs segur de que vols cancel·lar la cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: language === 'es' ? 'Sí, cancelar' : 'Sí, cancel·lar',
      cancelButtonText: language === 'es' ? 'No, mantener' : 'No, mantenir',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const q = query(
            collection(db, 'appointments'),
            where('userId', '==', auth.currentUser?.uid),
            where('fecha', '==', appointmentToCancel.fecha),
            where('hora', '==', appointmentToCancel.hora),
            where('profesional', '==', appointmentToCancel.profesional)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            await deleteDoc(doc(db, 'appointments', docId));

            setAppointments((prev) => prev.filter((_, i) => i !== index));

            Swal.fire({
              title: language === 'es' ? 'Tu cita ha sido cancelada.' : 'La teva cita ha estat cancel·lada.',
              icon: 'success',
            });
          }
        } catch (error) {
          console.error('Error al cancelar la cita:', error);
          Swal.fire({
            title: language === 'es' ? 'Error' : 'Error',
            text:
              language === 'es'
                ? 'Hubo un problema al intentar cancelar la cita.'
                : 'Hi ha hagut un problema en cancel·lar la cita.',
            icon: 'error',
          });
        }
      }
    });
  };

  return (
    <div className="homepage-container text-center d-flex flex-column justify-content-center align-items-center">
      <h1 className="homepage-title">SalutDigital</h1>
      <br />
      <p className="homepage-description">
        {language === 'es'
          ? 'Gestiona tus citas médicas de manera sencilla y segura.'
          : 'Gestiona les teves cites mèdiques de manera senzilla i segura.'}
      </p>
      <p className="homepage-description">
      {language === 'es'
          ? 'Puedes acceder desde el mismo navegador o aplicación web de móvil.'
          : 'Pots accedir des del mateix navegador o aplicació web de mòbil.'}
      </p>
      <div className="mt-4">
        {!user ? (
          <>
            <Button variant="outline-dark" onClick={() => navigate('/register')}>
              {language === 'es' ? 'Registrarse' : 'Registrar-se'}
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => navigate('/login')}
              className="ms-2"
            >
              {language === 'es' ? 'Iniciar sesión' : 'Iniciar sessió'}
            </Button>
          </>
        ) : (
          <Card className="mt-3">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-center mt-4">
  {/* Opción 1: Pedir cita */}
  <Card
    className="m-3"
    style={{ width: '18rem', cursor: 'pointer' }}
    onClick={() => navigate('/pedir-cita')}
  >
    <Card.Img
      variant="top"
      src={imagen1}
      alt={language === 'es' ? 'Pedir cita' : 'Pedir cita'}
    />
    <Card.Body className="text-center">
      <Card.Title>{language === 'es' ? 'Pedir cita' : 'Demanar cita'}</Card.Title>
      <Card.Text>
        {language === 'es'
          ? 'Solicitar cita previa.'
          : 'Demanar cita prèvia.'}
      </Card.Text>
    </Card.Body>
  </Card>

  {/* Opción 2: Consultar citas */}
  <Card
    className="m-3"
    style={{ width: '18rem', cursor: 'pointer' }}
    onClick={fetchAppointments}
  >
    <Card.Img
      variant="top"
      src={imagen2}
      alt={language === 'es' ? 'Consultar otras citas' : 'Consultar altres cites'}
    />
    <Card.Body className="text-center">
      <Card.Title>
        {language === 'es' ? 'Consultar otras citas' : 'Consultar altres cites'}
      </Card.Title>
      <Card.Text>
        {language === 'es'
          ? 'Revisa tus citas programadas.'
          : 'Consulta les teves cites programades.'}
      </Card.Text>
    </Card.Body>
  </Card>
</div>

            </Card.Body>
          </Card>
        )}
      </div>

      {/* Modal para mostrar las citas */}
      <Modal show={showAppointmentsModal} onHide={() => setShowAppointmentsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'es' ? 'Tus citas' : 'Les teves cites'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {appointments.length > 0 ? (
    appointments.map((appointment, index) => (
      <Card key={index} className="mb-2">
        <Card.Body>
          <p>
            <strong>{language === 'es' ? 'Profesional:' : 'Professional:'}</strong>{' '}
            {appointment.profesional}
          </p>
          <p>
            <strong>{language === 'es' ? 'Presencial:' : 'Presencial:'}</strong>{' '}
            {appointment.presencial ? 'Sí' : 'No'}
          </p>
          <p>
            <strong>{language === 'es' ? 'Motivo:' : 'Motiu:'}</strong>{' '}
            {appointment.motivo}
          </p>
          <p>
            <strong>{language === 'es' ? 'Fecha y hora:' : 'Data i hora:'}</strong>{' '}
            {appointment.fecha} {appointment.hora}
          </p>
          <Button
            variant="danger"
            onClick={() => handleCancelAppointment(index)}
          >
            {language === 'es' ? 'Cancelar cita' : 'Cancel·lar cita'}
          </Button>
          <Button
  variant="outline-dark"
  onClick={() => navigate('/modificar-cita', { state: { appointment: appointment } })}
>
  {language === 'es' ? 'Modificar cita' : 'Modificar cita'}
</Button>

        </Card.Body>
      </Card>
    ))
  ) : (
    <p>{language === 'es' ? 'No tienes citas registradas.' : 'No tens cites registrades.'}</p>
  )}
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentsModal(false)}>
            {language === 'es' ? 'Cerrar' : 'Tancar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
