import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Client, DaoDepositSteps, DepositParams, TokenType } from '@aragon/sdk-client';

import { ETHToWei } from '../../helpers/crypto';
import { useAragonSDKContext } from '../../context/AragonSDK';

export default function DepositETH(): JSX.Element {
  const [amountOfETH, setAmountOfETH] = useState<number>(0);

  const { context } = useAragonSDKContext();

  async function depositEthToDao() {
    const client = new Client(context);

    const depositParams: DepositParams = {
      daoAddressOrEns: '0xff25e3d89995ea3b97cede27f00ec2281a89e960',
      amount: BigInt(ETHToWei(amountOfETH)),
      type: TokenType.NATIVE
    }

    const steps = client.methods.deposit(depositParams);

    for await (const step of steps) {
      try {
        switch(step.key) {
          case DaoDepositSteps.DEPOSITING:
            alert(`Depositing ETH into DAO... here's your transaction: https://goerli.etherscan.io/tx/${step.txHash}`);
            break;
          case DaoDepositSteps.DONE:
            alert(`Deposit of ${step.amount} ETH into DAO complete!`);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
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

      <div className="col-auto mx-auto">
        <span id="helpInline" className="form-text">
          You will get 1 $PARK token for every time you deposit ETH into the DAO.
        </span>
      </div>
      <Button className="btn-success" onClick={depositEthToDao}>
        Deposit
      </Button>
    </Container>
  );
}
