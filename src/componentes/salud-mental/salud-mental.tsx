import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';

const SaludMental: React.FC = () => {
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Salud Mental</h1>

      <section>
        <h2>Procesos de Atención en Salud Mental</h2>
        <ListGroup className="mb-4">
          <ListGroup.Item>
            <strong>Derivación desde Atención Primaria a Psiquiatría:</strong> El médico de cabecera evalúa la necesidad de una consulta especializada y realiza la derivación correspondiente a la Unidad de Salud Mental.
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Urgencias Psiquiátricas:</strong> Las urgencias de salud mental se gestionan en servicios hospitalarios especializados que cuentan con personal capacitado para atender crisis inmediatas.
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Seguimiento en Consultas Ambulatorias:</strong> Después de una evaluación inicial, los pacientes pueden ser seguidos en consultas programadas con especialistas en salud mental para continuar con su tratamiento.
          </ListGroup.Item>
        </ListGroup>
      </section>

      <section>
        <h2>Roles en las Unidades de Salud Mental</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Psiquiatra</Card.Title>
                <Card.Text>
                  Médico especialista en salud mental que diagnostica y trata trastornos psiquiátricos, incluyendo la prescripción de medicamentos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Psicólogo</Card.Title>
                <Card.Text>
                  Profesional que realiza evaluaciones psicológicas, terapia individual o grupal y estrategias de apoyo emocional.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Enfermero/a</Card.Title>
                <Card.Text>
                  Apoya en la gestión de tratamientos, seguimiento de pacientes y educación sobre la salud mental.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <h2>Recursos</h2>
        <ListGroup className="mb-4">
          <ListGroup.Item>
            <strong>Teléfonos de contacto:</strong> Teléfono nacional de atención al suicidio: <a href="tel:024">024</a>. Línea de ayuda en salud mental: <a href="tel:900123456">900 123 456</a>.
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Enlaces a servicios especializados:</strong>
            <ul>
              <li><a href="https://medlineplus.gov/spanish/mentalhealth.html" target="_blank" rel="noopener noreferrer">Información sobre salud mental</a></li>
              <li><a href="https://www.psiquiatria.com" target="_blank" rel="noopener noreferrer">Portal de Psiquiatría</a></li>
            </ul>
          </ListGroup.Item>
        </ListGroup>
      </section>
    </Container>
  );
};

export default SaludMental;
