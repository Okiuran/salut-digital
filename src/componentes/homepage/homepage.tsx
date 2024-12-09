import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal } from 'react-bootstrap';
import { auth, db } from '../../firebase-config.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

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

  // Manejo de autenticación
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

        const appointmentsList = querySnapshot.docs.map((doc) => doc.data() as Appointment);
        setAppointments(appointmentsList);
        setShowAppointmentsModal(true);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    }
  };

  const handleCancelAppointment = async (index: number) => {
    // Mostrar confirmación
    const confirmCancel = window.confirm(
      language === 'es'
        ? '¿Estás seguro de que deseas cancelar esta cita?'
        : 'Estàs segur que vols cancel·lar aquesta cita?'
    );

    if (!confirmCancel) {
      return; // Si el usuario cancela, se sale de la función
    }

    try {
      const appointmentToCancel = appointments[index];

      // Encuentra el documento en firebase
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', auth.currentUser?.uid),
        where('fecha', '==', appointmentToCancel.fecha),
        where('hora', '==', appointmentToCancel.hora),
        where('profesional', '==', appointmentToCancel.profesional)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Recoge el primer documento que coincide
        await deleteDoc(doc(db, 'appointments', docId)); // Lo elimina de firebase

        // Actualiza el estado local
        setAppointments((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
    }
  };


  return (
    <div className="text-center">
      <h1>{language === 'es' ? 'Bienvenido a SalutDigital' : 'Benvingut a SalutDigital'}</h1>
      <p>
        {language === 'es'
          ? 'Aquí puedes gestionar tus citas médicas de manera sencilla y segura.'
          : 'Aquí pots gestionar les teves cites mèdiques de manera senzilla i segura.'}
      </p>
      <div>
        {!user ? (
          <>
            <Button variant="primary" onClick={() => navigate('/register')}>
              {language === 'es' ? 'Registrarse' : 'Registrar-se'}
            </Button>
            <Button
              variant="primary"
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
      src="https://via.placeholder.com/150"
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
      src="https://via.placeholder.com/150"
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
