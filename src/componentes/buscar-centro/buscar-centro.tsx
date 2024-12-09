import React from 'react';
import MapComponent from '../../api/map.tsx';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';

const BuscarCentros: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div>
      <h1>
        {language === 'es' ? 'Buscar Centros de Salud' : 'Cercar Centres de Salut'}
      </h1>
      <p>
        {language === 'es'
          ? 'Introduce un código postal para buscar centros de salud cercanos.'
          : 'Introdueix un codi postal per cercar centres de salut propers.'}
      </p>
      <MapComponent />
    </div>
  );
};

export default BuscarCentros;