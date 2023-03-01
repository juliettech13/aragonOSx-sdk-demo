import React from 'react';
import { Button, Card, Container, Row } from 'react-bootstrap';

const proposals = [
  {
    id: '0x0000000',
    metadata: {
      title: 'Proposal 1',
      summary: 'This is the summary of proposal 1',
    },
  },
  {
    id: '0x0000001',
    metadata: {
      title: 'Proposal 2',
      summary: 'This is the summary of proposal 2',
    },
  }
];

export default function DisplayProposals() {

  return (
    <Container className="mx-auto">
      <h3 className="text-center pt-5 pb-3">DAO Proposals</h3>
      <Row>
        {proposals.map((proposal, index) => {
          const { title, summary } = proposal.metadata;
          return (
            <Card border="success" className="mx-3 mb-5" style={{ width: 'auto' }} key={index}>
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                  {summary}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary">Yay</Button>
                  <Button variant="warning">Nay</Button>
                </div>
              </Card.Body>
            </Card>
          )
          })}
      </Row>
    </Container>
  )
}
