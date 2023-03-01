import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function DepositETH(): JSX.Element {
  const [amountOfETH, setAmountOfETH] = useState(0);

  function depositEthToDao() {
    setAmountOfETH(0);
  }

  return (
    <Container className="mx-auto row g-3" style={{ width: '800px' }}>
      <h3 className="pt-4 text-center">Deposit ETH into ParksDAO</h3>

      <input
        type="number"
        min="0"
        step=".01"
        value={amountOfETH}
        className="form-control"
        aria-describedby="amountOfETH"
        onChange={(e) => setAmountOfETH(Number(e.target.value))}
      />

      <Button className="btn-success" onClick={depositEthToDao}>
        Deposit
      </Button>
    </Container>
  );
}
