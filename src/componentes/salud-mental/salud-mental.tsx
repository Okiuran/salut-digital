import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { useLanguage } from '../../idioma/preferencia-idioma.tsx';

const SaludMental: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <Container className="mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-secondary">{translate('saludMental.title')}</h1>
        <hr className="w-50 mx-auto" />
      </div>

      <section className="mb-5">
        <h2 className="text-secondary mb-3">{translate('saludMental.attentionProcesses.title')}</h2>
        <ListGroup>
          <ListGroup.Item className="py-3">
            <strong>{translate('saludMental.attentionProcesses.referral')}</strong> {translate('saludMental.attentionProcesses.referralDescription')}
          </ListGroup.Item>
          <ListGroup.Item className="py-3">
            <strong>{translate('saludMental.attentionProcesses.psychiatricEmergencies')}</strong> {translate('saludMental.attentionProcesses.psychiatricEmergenciesDescription')}
          </ListGroup.Item>
          <ListGroup.Item className="py-3">
            <strong>{translate('saludMental.attentionProcesses.followUp')}</strong> {translate('saludMental.attentionProcesses.followUpDescription')}
          </ListGroup.Item>
        </ListGroup>
      </section>

      <section className="mb-5">
        <h2 className="text-secondary mb-3">{translate('saludMental.roles.title')}</h2>
        <Row>
          {['psychiatrist', 'psychologist', 'nurse'].map((role) => (
            <Col md={4} key={role}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-secondary">{translate(`saludMental.roles.${role}.title`)}</Card.Title>
                  <Card.Text>{translate(`saludMental.roles.${role}.description`)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h2 className="text-secondary mb-3">{translate('saludMental.resources.title')}</h2>
        <ListGroup>
          <ListGroup.Item className="py-3">
            <strong>{translate('saludMental.resources.contactPhones')}</strong><br />
            {translate('saludMental.resources.suicidePrevention')} <a href="tel:024" className="text-secondary">024</a>.<br />
            {translate('saludMental.resources.mentalHealthLine')} <a href="tel:900123456" className="text-secondary">900 123 456</a>.
          </ListGroup.Item>
          <ListGroup.Item className="py-3">
            <strong>{translate('saludMental.resources.specializedLinks')}</strong>
            <ul className="mt-2">
              <li><a href="https://medlineplus.gov/spanish/mentalhealth.html" target="_blank" rel="noopener noreferrer" className="text-secondary">{translate('saludMental.resources.moreInfo')}</a></li>
              <li><a href="https://www.psiquiatria.com" target="_blank" rel="noopener noreferrer" className="text-secondary">{translate('saludMental.resources.psychiatryPortal')}</a></li>
            </ul>
          </ListGroup.Item>
        </ListGroup>
      </section>
    </Container>
  );
};

export default SaludMental;
