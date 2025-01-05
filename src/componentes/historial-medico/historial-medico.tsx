import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';
import { db, auth } from '../../firebase-config.ts';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Canvg } from 'canvg';
import logo from '../../assets/logo.svg';

// Define las interfaces para los datos
interface Appointment {
  id: string;
  profesional: string;
  presencial: boolean;
  motivo: string;
  fecha: string;
  hora: string;
  medicacion?: string[];
}

interface UserData {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  tarjetaSanitaria: string;
  dni: string;
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
            querySnapshot.docs.map(async (docSnapshot) => {
              const appointmentData = { id: docSnapshot.id, ...docSnapshot.data() } as Appointment;

              // Obtener medicación asociada a la cita
              const medicationsRef = collection(db, 'medications');
              const medicationsQuery = query(medicationsRef, where('appointmentId', '==', docSnapshot.id));
              const medicationsSnapshot = await getDocs(medicationsQuery);

              const medications = medicationsSnapshot.docs
                .map((medDoc) => medDoc.data().medicacion)
                .flat();
              appointmentData.medicacion = medications.length > 0 ? medications : undefined;

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
    const pdfDoc = new jsPDF();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Obtener información del usuario actual desde Firebase
    const userId = auth.currentUser?.uid;
    let userName = '';
    let userLastName = '';
    let userBirthDate = '';
    let userDni = '';
    let userHealthCard = '';

    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId); // Acceder directamente al documento del usuario
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as UserData;
          userName = userData.nombre;
          userLastName = userData.apellidos;
          userBirthDate = userData.fechaNacimiento;
          userDni = userData.dni;
          userHealthCard = userData.tarjetaSanitaria;
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }

    if (ctx) {
      const response = await fetch(logo);
      const svgContent = await response.text();

      const v = await Canvg.from(ctx, svgContent);
      await v.render();

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdfDoc.internal.pageSize.getWidth();
      const logoWidth = 40;
      const logoHeight = 20;

      pdfDoc.addImage(imgData, 'PNG', pageWidth - logoWidth - 10, 10, logoWidth, logoHeight);
    }

    // Añadir información del usuario al PDF
    pdfDoc.setFontSize(16);
    pdfDoc.text(language === 'es' ? 'Información' : 'Informació', 10, 20);
    pdfDoc.setFontSize(12);
    pdfDoc.text(`${language === 'es' ? 'Nombre:' : 'Nom:'} ${userName}`, 10, 30);
    pdfDoc.text(`${language === 'es' ? 'Apellidos:' : 'Cognoms:'} ${userLastName}`, 10, 40);
    pdfDoc.text(`${language === 'es' ? 'Fecha de nacimiento:' : 'Data de naixement:'} ${userBirthDate}`, 10, 50);
    pdfDoc.text(`${language === 'es' ? 'DNI:' : 'DNI:'} ${userDni}`, 10, 60);
    pdfDoc.text(`${language === 'es' ? 'Tarjeta sanitaria:' : 'Targeta sanitària:'} ${userHealthCard}`, 10, 70);

    pdfDoc.setFontSize(16);
    pdfDoc.text(language === 'es' ? 'Plan de medicación' : 'Pla de medicació', 10, 90);

    const tableData = [
      [
        appointment.fecha,
        appointment.hora,
        appointment.profesional,
        appointment.motivo,
        ...(appointment.medicacion ? appointment.medicacion.map((med) => med) : ['No precisa']),
      ],
    ];

    const headers = [
      language === 'es' ? 'Fecha' : 'Data',
      language === 'es' ? 'Hora' : 'Hora',
      language === 'es' ? 'Profesional' : 'Professional',
      language === 'es' ? 'Motivo' : 'Motiu',
      language === 'es' ? 'Medicación' : 'Medicació',
    ];

    // Generar tabla con los datos de la cita
    pdfDoc.autoTable({
      head: [headers],
      body: tableData,
      startY: 100,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      theme: 'striped',
    });

    pdfDoc.save(`${language === 'es' ? 'Plan_Medicacion' : 'Pla_Medicació'}.pdf`);
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
