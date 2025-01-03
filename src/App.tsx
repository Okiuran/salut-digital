import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNavbar from './componentes/navbar/navbar.tsx';
import HomePage from './componentes/homepage/homepage.tsx';
import RegisterPage from './componentes/registro/registro.tsx';
import LoginPage from './componentes/login/login.tsx';
import Servicios from './componentes/servicios/servicios.tsx';
import { LanguageProvider } from './idioma/preferencia-idioma.tsx';
import ResetPassword from './componentes/reset-password/reset-password.tsx';
import PerfilUsuario from './componentes/perfil/perfil.tsx';
import PedirCita from './componentes/cita-previa/pedir-cita.tsx';
import BuscarCentros from './componentes/buscar-centro/buscar-centro.tsx';
import ModificarCita from './componentes/cita-previa/modificar-cita.tsx';
import SaludMentalYOtros from './componentes/salud-mental/salud-mental.tsx';

import HistorialMedico from './componentes/historial-medico/historial-medico.tsx';

import Footer from './componentes/footer/footer.tsx';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<PerfilUsuario />} />
          <Route path="/pedir-cita" element={<PedirCita /> } />
          <Route path="/buscar-centros" element={<BuscarCentros />} />
          <Route path="/modificar-cita" element={<ModificarCita />} />
          <Route path="/historial-medico" element={<HistorialMedico />} />
          <Route path="/salud-mental" element={<SaludMentalYOtros />} />

        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
};

export default App;
