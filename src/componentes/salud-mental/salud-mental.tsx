import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';

const SaludMental: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{translate('saludMental.title')}</h1>

      <section>
        <h2>{translate('saludMental.attentionProcesses.title')}</h2>
        <ListGroup className="mb-4">
          <ListGroup.Item>
            <strong>{translate('saludMental.attentionProcesses.referral')}</strong> {translate('saludMental.attentionProcesses.referralDescription')}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>{translate('saludMental.attentionProcesses.psychiatricEmergencies')}</strong> {translate('saludMental.attentionProcesses.psychiatricEmergenciesDescription')}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>{translate('saludMental.attentionProcesses.followUp')}</strong> {translate('saludMental.attentionProcesses.followUpDescription')}
          </ListGroup.Item>
        </ListGroup>
      </section>

      <section>
        <h2>{translate('saludMental.roles.title')}</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{translate('saludMental.roles.psychiatrist.title')}</Card.Title>
                <Card.Text>{translate('saludMental.roles.psychiatrist.description')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{translate('saludMental.roles.psychologist.title')}</Card.Title>
                <Card.Text>{translate('saludMental.roles.psychologist.description')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{translate('saludMental.roles.nurse.title')}</Card.Title>
                <Card.Text>{translate('saludMental.roles.nurse.description')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <h2>{translate('saludMental.resources.title')}</h2>
        <ListGroup className="mb-4">
          <ListGroup.Item>
            <strong>{translate('saludMental.resources.contactPhones')}</strong>
            {translate('saludMental.resources.suicidePrevention')} <a href="tel:024">024</a>.
            {translate('saludMental.resources.mentalHealthLine')} <a href="tel:900123456">900 123 456</a>.
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>{translate('saludMental.resources.specializedLinks')}</strong>
            <ul>
              <li><a href="https://medlineplus.gov/spanish/mentalhealth.html" target="_blank" rel="noopener noreferrer">{translate('saludMental.resources.moreInfo')}</a></li>
              <li><a href="https://www.psiquiatria.com" target="_blank" rel="noopener noreferrer">{translate('saludMental.resources.psychiatryPortal')}</a></li>
            </ul>
          </ListGroup.Item>
        </ListGroup>
      </section>
    </Container>
  );
};

export default SaludMental;
