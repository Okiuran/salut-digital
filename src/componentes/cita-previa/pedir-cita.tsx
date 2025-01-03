import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { db, auth } from '../../firebase-config.ts';
import { addDoc, collection } from 'firebase/firestore';

const PedirCita: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [profesional, setProfesional] = useState('');
  const [presencial, setPresencial] = useState('');
  const [motivo, setMotivo] = useState('');
  const [subMotivo, setSubMotivo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
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

  const opcionesPresencial = [
    language === 'es' ? 'Presencial' : 'Presencial',
    language === 'es' ? 'No presencial' : 'No presencial',
  ];

  const motivosConsulta = {
    general: language === 'es' ? 'Consulta general' : 'Consulta general',
    receta: {
      label: language === 'es' ? 'Receta médica' : 'Recepta mèdica',
      subMotivos: [
        language === 'es' ? 'Crónico' : 'Crònic',
        language === 'es' ? 'A demanda' : 'A demanda',
        language === 'es' ? 'Otros' : 'Altres',
      ],
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profesional || !presencial || (!motivo && !subMotivo) || !fecha || !hora) {
      setError(
        language === 'es'
          ? 'Por favor, completa todos los campos.'
          : 'Si us plau, omple tots els camps.'
      );
      return;
    }

    const selectedDate = new Date(fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError(
        language === 'es'
          ? 'La fecha seleccionada no puede ser anterior a hoy.'
          : 'La data seleccionada no pot ser anterior a avui.'
      );
      return;
    }

    setError('');

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError(
          language === 'es'
            ? 'Debes estar autenticado para pedir una cita.'
            : 'Has d\'estar autenticat per demanar una cita.'
        );
        return;
      }

      const appointmentData = {
        userId,
        profesional,
        presencial: presencial === 'Presencial',
        motivo: subMotivo || motivo,
        fecha,
        hora,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setSuccess(true);

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      setError(
        language === 'es'
          ? 'Hubo un error al guardar la cita. Inténtalo nuevamente.'
          : 'Hi ha hagut un error al guardar la cita. Torna-ho a intentar.'
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>{language === 'es' ? 'Pedir cita' : 'Demanar cita'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          {language === 'es'
            ? 'Cita registrada, redirigiendo al inicio'
            : 'Cita registrada, redirigint a l\'inici...'}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="profesional">
          <Form.Label>{language === 'es' ? 'Profesional' : 'Professional'}</Form.Label>
          <Form.Select
            value={profesional}
            onChange={(e) => setProfesional(e.target.value)}
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
            value={presencial}
            onChange={(e) => setPresencial(e.target.value)}
          >
            <option value="">
              {language === 'es'
                ? 'Selecciona el tipo de cita'
                : 'Selecciona el tipus de cita'}
            </option>
            {opcionesPresencial.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="motivo">
          <Form.Label>{language === 'es' ? 'Motivo de consulta' : 'Motiu de consulta'}</Form.Label>
          <Form.Select
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setSubMotivo('');
            }}
          >
            <option value="">
              {language === 'es' ? 'Selecciona un motivo de consulta' : 'Selecciona un motiu de consulta'}
            </option>
            <option value="general">{motivosConsulta.general}</option>
            <optgroup label={motivosConsulta.receta.label}>
              {motivosConsulta.receta.subMotivos.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </optgroup>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="fecha">
          <Form.Label>{language === 'es' ? 'Fecha' : 'Data'}</Form.Label>
          <Form.Control
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="hora">
          <Form.Label>{'Hora'}</Form.Label>
          <Form.Control
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {language === 'es' ? 'Solicitar cita' : 'Sol·licitar cita'}
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

export default PedirCita;
