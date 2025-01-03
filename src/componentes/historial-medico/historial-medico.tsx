import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { db, auth } from '../../firebase-config.ts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Canvg } from 'canvg';
import logo from '../../assets/logo.svg';

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
          const appointmentsData = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const appointmentData = { id: doc.id, ...doc.data() } as Appointment;

              const medicationsRef = collection(db, 'medications');
              const medicationsQuery = query(medicationsRef, where('appointmentId', '==', doc.id));
              const medicationsSnapshot = await getDocs(medicationsQuery);

              const medications = medicationsSnapshot.docs
                .map((medDoc) => medDoc.data().medicacion)
                .join(', '); // Unir medicaciones en un string
              appointmentData.medicacion = medications || 'No precisa'; // Si no hay medicación, hacer constancia de ello (pendiente de mejorar)

              return appointmentData;
            })
          );

          setAppointments(appointmentsData);
        } catch (error) {
          console.error('Error al cargar las citas:', error);
        }
      }
    };

    fetchAppointments();
  }, []);

  const downloadPDF = async (appointment: Appointment) => {
    const doc = new jsPDF();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Obtener información del usuario actual desde Firebase
    const userId = auth.currentUser?.uid;
    let userName = '';
    let userBirthDate = '';

    if (userId) {
      const userRef = collection(db, 'users');
      const userQuery = query(userRef, where('id', '==', userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        userName = userData.name || 'Usuario desconocido';
        userBirthDate = userData.birthDate || 'No especificada';
      }
    }

    if (ctx) {
      const response = await fetch(logo);
      const svgContent = await response.text();

      const v = await Canvg.from(ctx, svgContent);
      await v.render();

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 40;
      const logoHeight = 20;

      doc.addImage(imgData, 'PNG', pageWidth - logoWidth - 10, 10, logoWidth, logoHeight);
    }

    doc.setFontSize(16);
    doc.text(language === 'es' ? 'Información' : 'Informació', 10, 20);
    doc.setFontSize(12);
    doc.text(`${language === 'es' ? 'Nombre:' : 'Nom:'} ${userName}`, 10, 30);
    doc.text(`${language === 'es' ? 'Fecha de Nacimiento:' : 'Data de Naixement:'} ${userBirthDate}`, 10, 40);

    doc.setFontSize(16);
    doc.text(language === 'es' ? 'Plan de Medicación' : 'Pla de Medicació', 10, 60);

    // Generar tabla con los datos de la cita
    const tableData = [
      [
        appointment.fecha,
        appointment.hora,
        appointment.profesional,
        appointment.medicacion || (language === 'es' ? 'No precisa' : 'No precisa'),
      ],
    ];

    const headers = [
      language === 'es' ? 'Fecha' : 'Data',
      language === 'es' ? 'Hora' : 'Hora',
      language === 'es' ? 'Profesional' : 'Professional',
      language === 'es' ? 'Medicación' : 'Medicació',
    ];

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
    });

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
