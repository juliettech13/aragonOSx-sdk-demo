import React from 'react';
import { Button, Container } from 'react-bootstrap';

export default function DepositETH(): JSX.Element {
  return (
    <>
      <Container className="mx-auto row g-3" style={{ width: '800px' }}>
        <h3 className="pt-4 text-center">Deposit ETH into ParksDAO</h3>

        <input type="number" min="0" step=".01" id="amountOfETH" className="form-control" aria-describedby="helpInline" />

        <div className="col-auto mx-auto">
          <span id="helpInline" className="form-text">
            You will get 1 $PARK token for every time you deposit ETH into the DAO.
          </span>
        </div>
        <Button className="btn-success">
          Deposit
        </Button>
      </Container>
    </>
  );
}
