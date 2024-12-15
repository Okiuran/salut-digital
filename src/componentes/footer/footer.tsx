import React from 'react';
import logo from '../../assets/logo.svg';
import icon061 from '../../assets/061.png';
import icon112 from '../../assets/112.png';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-icon">
            <img src={icon061} alt="061 Icono" width="30" />
              061 Consultes urgents
          </div>
          <div className="footer-icon">
            <img src={icon112} alt="112 Icono" width="30" />
            <span>112 Emergències</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="https://web.gencat.cat/" target="_blank" rel="noopener noreferrer">
            Generalitat de Catalunya
          </a>
          <a href="https://salut.gencat.cat/" target="_blank" rel="noopener noreferrer">
            Departament de Salut
          </a>
        </div>

        <div className="footer-right">
          <img src={logo} alt="Logotipo Generalitat" className="footer-logo" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>2024 SalutDigital</p>
        <p>
          © <a href="https://lamevasalut.gencat.cat/" target="_blank" rel="noopener noreferrer">La Meva Salut</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
