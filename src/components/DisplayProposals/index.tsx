import React from 'react';
import { Button, Card, Container, Row } from 'react-bootstrap';

export default function DisplayProposals() {
  return (
    <Container className="mx-auto">
      <h3 className="text-center pt-5 pb-3">DAO Proposals</h3>
      <Row>
        <Card border="success" className="mx-3 mb-5" style={{ width: 'auto' }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Proposal Name</Card.Title>
            <Card.Text>
              Proposal Description
            </Card.Text>
            <div className="d-flex justify-content-between">
              <Button variant="primary">Yay</Button>
              <Button variant="warning">Nay</Button>
            </div>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
