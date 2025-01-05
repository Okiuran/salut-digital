import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { db, auth } from '../../firebase-config.ts';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

import Swal from 'sweetalert2';

interface Appointment {
  profesional: string;
  presencial: boolean;
  motivo: string;
  categoria: string;
  subcategoria: string;
  fecha: string;
  hora: string;
  id: string;
}

const ModificarCita: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const profesionales = [
    language === 'es' ? 'Médico de cabecera' : 'Metge de capçalera',
    language === 'es' ? 'Enfermero/a' : 'Infermer/a',
    'Matrona',
    language === 'es' ? 'Extracciones' : 'Extraccions',
    language === 'es' ? 'Vacuna gripe/covid' : 'Vacuna grip/covid',
    'Dentista',
    'Higienista dental',
    language === 'es' ? 'Nutrición' : 'Nutrició',
    language === 'es' ? 'Farmacia' : 'Farmàcia',
    language === 'es' ? 'Trabajadora social' : 'Treballadora social',
    language === 'es' ? 'Otros' : 'Altres',
  ];

  const categoriasMotivo = [
    language === 'es' ? 'Consulta general' : 'Consulta general',
    language === 'es' ? 'Receta médica' : 'Recepta mèdica',
  ];

  const subcategoriasMotivo: { [key: string]: string[] } = {
    'Consulta general': [],
    [language === 'es' ? 'Receta médica' : 'Recepta mèdica']: [
      language === 'es' ? 'Crónico' : 'Crònic',
      language === 'es' ? 'A demanda' : 'A demanda',
      language === 'es' ? 'Otros' : 'Altres',
    ],
  };

  useEffect(() => {
    const stateAppointment = location.state?.appointment;
    if (stateAppointment) {
      setAppointment({ ...stateAppointment, motivo: stateAppointment.motivo || '' });
    } else {
      setError(
        language === 'es'
          ? 'No se ha encontrado la cita para modificar.'
          : 'No s\'ha trobat la cita per modificar.'
      );
    }
  }, [location.state, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointment?.profesional || !appointment.presencial === undefined || !appointment?.categoria || !appointment?.fecha || !appointment?.hora) {
      setError(
        language === 'es'
          ? 'Por favor, completa todos los campos.'
          : 'Si us plau, omple tots els camps.'
      );
      return;
    }

    setError('');

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError(
          language === 'es'
            ? 'Debes estar autenticado para modificar una cita.'
            : 'Has d\'estar autenticat per modificar una cita.'
        );
        return;
      }

      const appointmentRef = doc(db, 'appointments', appointment.id);

      const updateData: any = {
        profesional: appointment.profesional,
        presencial: appointment.presencial,
        categoria: appointment.categoria,
        subcategoria: appointment.subcategoria,
        motivo: appointment.motivo || '',
        fecha: appointment.fecha,
        hora: appointment.hora,
    };

      if (!appointment.subcategoria) {
        updateData.subcategoria = deleteField();
      }
      if (!appointment.motivo) {
        updateData.motivo = deleteField();
      }

      // Actualizar el documento en Firebase
      await updateDoc(appointmentRef, updateData);

      Swal.fire({
        title: language === 'es' ? '¡Cita modificada!' : 'Cita modificada!',
        text: language === 'es' ? 'Redirigiendo al inicio...' : 'Redirigint a l\'inici...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate('/'),
      });
    } catch (error) {
      console.error('Error al modificar la cita:', error);
      setError(
        language === 'es'
          ? 'Hubo un error al modificar la cita. Inténtalo nuevamente.'
          : 'Hi ha hagut un error al modificar la cita. Torna-ho a intentar.'
      );
    }
  };

  if (!appointment) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{language === 'es' ? 'Modificar cita' : 'Modificar cita'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="profesional">
          <Form.Label>{language === 'es' ? 'Profesional' : 'Professional'}</Form.Label>
          <Form.Select
            value={appointment.profesional}
            onChange={(e) => setAppointment({ ...appointment, profesional: e.target.value })}
          >
            <option value="">
              {language === 'es' ? 'Selecciona un profesional' : 'Selecciona un professional'}
            </option>
            {profesionales.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="presencial">
          <Form.Label>{language === 'es' ? 'Tipo de cita' : 'Tipus de cita'}</Form.Label>
          <Form.Select
            value={appointment.presencial ? 'Presencial' : 'No presencial'}
            onChange={(e) => setAppointment({ ...appointment, presencial: e.target.value === 'Presencial' })}
          >
            <option value="Presencial">{language === 'es' ? 'Presencial' : 'Presencial'}</option>
            <option value="No presencial">{language === 'es' ? 'No presencial' : 'No presencial'}</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="categoria">
          <Form.Label>{language === 'es' ? 'Categoría' : 'Categoria'}</Form.Label>
          <Form.Select
            value={appointment.categoria}
            onChange={(e) => setAppointment({ ...appointment, categoria: e.target.value, subcategoria: '' })}
          >
            <option value="">
              {language === 'es' ? 'Selecciona una categoría' : 'Selecciona una categoria'}
            </option>
            {categoriasMotivo.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {appointment.categoria && subcategoriasMotivo[appointment.categoria]?.length > 0 && (
        <Form.Group className="mb-3" controlId="subcategoria">
          <Form.Label>{language === 'es' ? 'Subcategoría' : 'Subcategoria'}</Form.Label>
          <Form.Select
            value={appointment.subcategoria}
            onChange={(e) => setAppointment({ ...appointment, subcategoria: e.target.value })}
          >
            <option value="">
              {language === 'es' ? 'Selecciona una subcategoría' : 'Selecciona una subcategoria'}
            </option>
            {subcategoriasMotivo[appointment.categoria]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

        <Form.Group className="mb-3" controlId="motivo">
          <Form.Label>
            {language === 'es' ? 'Motivo de consulta' : 'Motiu de consulta'}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={
              language === 'es'
                ? 'Escribe el motivo de tu consulta aquí...'
                : 'Escriu el motiu de la teva consulta aquí...'
            }
            value={appointment.motivo}
            onChange={(e) => setAppointment({ ...appointment, motivo: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="fecha">
          <Form.Label>{language === 'es' ? 'Fecha' : 'Data'}</Form.Label>
          <Form.Control
            type="date"
            value={appointment.fecha}
            onChange={(e) => setAppointment({ ...appointment, fecha: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="hora">
          <Form.Label>{'Hora'}</Form.Label>
          <Form.Control
            type="time"
            value={appointment.hora}
            onChange={(e) => setAppointment({ ...appointment, hora: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {language === 'es' ? 'Modificar cita' : 'Modificar cita'}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate('/')}
        >
          {language === 'es' ? 'Cancelar' : 'Cancel·lar'}
        </Button>
      </Form>
</div>
  );
};

export default ModificarCita;
