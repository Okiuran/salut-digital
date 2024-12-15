import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { db, auth } from '../../firebase-config.ts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import canvg from 'canvg';

interface Appointment {
  id: string;
  profesional: string;
  presencial: boolean;
  motivo: string;
  fecha: string;
  hora: string;
  medicacion?: string;
}

const HistorialMedico: React.FC = () => {
  const { language } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (auth.currentUser) {
        try {
          const userId = auth.currentUser.uid; // Obtener el ID del usuario desde Firebase
          const appointmentsRef = collection(db, 'appointments');
          const q = query(appointmentsRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const appointmentsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const appointmentData = { id: doc.id, ...doc.data() } as Appointment;

            // Obtener medicación asociada a la cita
            const medicationsRef = collection(db, 'medications');
            const medicationsQuery = query(medicationsRef, where('appointmentId', '==', doc.id));
            const medicationsSnapshot = await getDocs(medicationsQuery);

            const medications = medicationsSnapshot.docs.map((medDoc) => medDoc.data().medicacion).join(', '); // Unir medicaciones en un string
            appointmentData.medicacion = medications || 'No precisa'; // Si no hay medicación, hacer constancia de ello (pendiente de mejorar)

            return appointmentData;
          }));

          setAppointments(appointmentsData);
        } catch (error) {
          console.error('Error al cargar las citas:', error);
        }
      }
    };

    fetchAppointments();
  }, []);

  const downloadPDF = (appointment: Appointment) => {
    const doc = new jsPDF();

    // Convertir SVG a PNG
    const svgElement = document.getElementById('logo');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (svgElement && ctx) {
      canvg(canvas, svgElement.outerHTML); // Renderizar SVG
      const imgData = canvas.toDataURL('image/png');

      doc.addImage(imgData, 'PNG', 10, 10, 30, 30);
    }

    doc.setFontSize(16);
    doc.text(
      language === 'es' ? 'Plan de Medicación' : 'Pla de Medicació',
      80,
      20
    );

    doc.setFontSize(12);
    doc.text(
      `${language === 'es' ? 'Fecha:' : 'Data:'} ${appointment.fecha}`,
      10,
      50
    );
    doc.text(
      `${'Hora'} ${appointment.hora}`,
      10,
      60
    );
    doc.text(
      `${
        language === 'es' ? 'Profesional:' : 'Professional:'
      } ${appointment.profesional}`,
      10,
      70
    );
    doc.text(
      `${
        language === 'es' ? 'Motivo:' : 'Motiu:'
      } ${appointment.motivo}`,
      10,
      80
    );

    if (appointment.medicacion) {
        const medicaciones = appointment.medicacion.split(',');
        let yPosition = 100;

        doc.text(
          `${language === 'es' ? 'Medicación:' : 'Medicació:'}`,
          10,
          yPosition
        );
        yPosition += 10;

        medicaciones.forEach((med, index) => {
          doc.text(`· ${med.trim()}`, 10, yPosition + (index * 10)); // Mostrar cada medicamento en una línea
        });
      }

      doc.save(`${language === 'es' ? 'Plan_Medicacion' : 'Pla_Medicació'}.pdf`);
  };

  return (
    <div className="container mt-5">
      <h2>{'Historial'}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{language === 'es' ? 'Fecha' : 'Data'}</th>
            <th>{'Hora'}</th>
            <th>{language === 'es' ? 'Profesional' : 'Professional'}</th>
            <th>{language === 'es' ? 'Motivo' : 'Motiu'}</th>
            <th>{language === 'es' ? 'Plan de medicación' : 'Pla de medicació'}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.fecha}</td>
              <td>{appointment.hora}</td>
              <td>{appointment.profesional}</td>
              <td>{appointment.motivo}</td>
              <td>
                <Button variant="primary" onClick={() => downloadPDF(appointment)}>
                  {language === 'es' ? 'Descargar PDF' : 'Descarregar PDF'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default HistorialMedico;
