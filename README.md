![Aragon](https://res.cloudinary.com/dacofvu8m/image/upload/v1677638385/Aragon%20CodeArena/aragon-logo-navy_gyr2qt.png)

# Aragon OSx SDK Demo

This project is a dApp showcasing some of what's possible with the [Aragon OSx SDK](https://github.com/aragon/sdk).

It shows how to:
- Set up the Aragon SDK in a React project
- Get a DAO's details
- Deposit ETH into a DAO
- Get members from a DAO
- Display proposals published in a DAO
- Vote in a DAO's proposals

To find additional documentation on the [Aragon OSx SDK, go here](https://devs.aragon.org/docs/sdk).

## Quickstart

There's 2 ways to go around this repository:

1. You can clone it and build on top of it. At which point, you merely want to fork it and run:

```bash
npm install && npm run start
```

2. You want to use it as a tutorial, at which point, follow the flow below 🙂. You can tap into each step through going into the branches.

## Setup

1. Bootstrap the project by using Create React App with Typescript
```bash
npx create-react-app aragon-sdk-demo --template typescript
```

2. Install Rainbowkit, Wagmi, and Ethers to bootstrap connecting to the blockchain
```bash
npm install @rainbow-me/rainbowkit wagmi ethers
```

3. Set up RainbowKit providers and blockchain config
```typescript
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import App from './App';
import reportWebVitals from './reportWebVitals';

const { chains, provider } = configureChains(
  // Determine which chains you want for your app
  [goerli],
  [
    // Make sure to get your own API Key from Alchemy itself and store it within your .env file: https://dashboard.alchemy.com/
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_GOERLI_KEY || '' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Aragon SDK demo',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

reportWebVitals();
```

## Install the Aragon SDK

In your terminal, install the [Aragon SDK](https://github.com/aragon/sdk).

```bash
npm install @aragon/sdk-client
```

## Set up the Aragon SDK in context

We want to create a context hook for the Aragon SDK so that we have access to it throughout the entire app.

1. Let's create the context folder within the root of our app.

```bash
mkdir src/context && touch src/context/AragonSDK.tsx
```

2. Inside the `AragonSDK.tsx` file, let's add the following code:

```typescript
// src/context/AragonSDK.tsx

import { createContext, useEffect, useContext, useState } from 'react';

import { useSigner } from 'wagmi';
import { Context, ContextParams } from '@aragon/sdk-client';

const AragonSDKContext = createContext({});

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const signer = useSigner().data || undefined;

  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: 'goerli', // mainnet, mumbai, etc
      signer,
      daoFactoryAddress: '0x16B6c6674fEf5d29C9a49EA68A19944f5a8471D3', // the DAO Factory contract address from the Goerli network. You can find the daoFactoryAddress you need from the active_contracts file within the osx repository here: https://github.com/aragon/osx/blob/develop/active_contracts.json
      web3Providers: ['https://rpc.ankr.com/eth_goerli'], // feel free to use the provider of your choosing: Alchemy, Infura, etc.
      ipfsNodes: [
        {
          url: 'https://testing-ipfs-0.aragon.network/api/v0',
          headers: { 'X-API-KEY': process.env.REACT_APP_IPFS_KEY || '' } // make sure you have the key for your IPFS node within your .env file
        },
      ],
      graphqlNodes: [
        {
          url:
            'https://subgraph.satsuma-prod.com/aragon/osx-goerli/api' // this will change based on the chain you're using (osx-mainnet alternatively)
        },
      ],
    };

    setContext(new Context(aragonSDKContextParams));
  }, [signer]);

  return (
    <AragonSDKContext.Provider value={{ context }}>
      {children}
    </AragonSDKContext.Provider>
  )
}

export function useAragonSDKContext(): any {
  return useContext(AragonSDKContext);
}
```

3. Then, in your `src/index.tsx` file, add the context hook provider for the Aragon SDK so you have access to it everywhere in your application.

```typescript
// src/index.tsx

// import rainbowkit provider, wagmi config, other providers, etc..
import { AragonSDKWrapper } from './context/AragonSDK';

// ......<Setup section above, Step 3>

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AragonSDKWrapper> // Adding the AragonSDKWrapper for the context hook
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AragonSDKWrapper>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
```

> **CAREFUL:_** Webpack 5 doesn’t have the polyfill node needed to run several crypto packages, so if you started your app with create-react-app or similar, you may stumble upon a polyfill problem. In order to solve it, follow [this tutorial](https://www.alchemy.com/blog/how-to-polyfill-node-core-modules-in-webpack-5) or start your app with a tool like [Vite.js](https://vitejs.dev/) instead.

## Set up a basic front-end to use the SDK

1. Firstly, I will install a CSS Framework to bootstrap front-end components, as well as set up the CSS in JS framework. I will use [React-Bootstrap](https://react-bootstrap.github.io/) and [Aphrodite](https://github.com/Khan/aphrodite) for this.

```bash
npm install react-bootstrap bootstrap aphrodite
```

In this basic front-end, we'll set up 4 main `components`:

1. `Navbar`
Contains the `ConnectButton` enabling users to connect their wallet into the dapp.

2. `DepositETH`
A `Form` enabling users to input the amount of ETH they want to deposit into the DAO.

3. `MembersList`
A table displaying all DAO token-holders.
This is how we'll see the the address who deposited the ETH becoming a DAO member.

4. `DisplayProposals`
Cards displaying the proposals for that specific DAO.
As a member, token-holders can now vote on these proposals.

Keep in mind, that we assume throughout this process that an Aragon DAO already exists. If you don't have one, feel free to [create one here](https://app.aragon.org) or [create one through the SDK](https://github.com/aragon/sdk).

You can run ```npm run start``` in your terminal to see the code in the browser.

## Using the SDK

### Deposit ETH

Within the `DepositETH` component, we want to use the SDK so a user can deposit ETH into a DAO.

```typescript
// src/components/DepositETH/index.tsx

import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Client, DaoDepositSteps, DepositParams, TokenType } from '@aragon/sdk-client';

import { ETHToWei } from '../../helpers/crypto';
import { useAragonSDKContext } from '../../context/AragonSDK';
import { formatEther } from 'ethers/lib/utils.js';

export default function DepositETH(): JSX.Element {
  const [amountOfETH, setAmountOfETH] = useState<number>(0);

  const { context } = useAragonSDKContext();

  async function depositEthToDao() {
    const client = new Client(context);

    const depositParams: DepositParams = {
      type: TokenType.NATIVE, // means ETH
      amount: BigInt(ETHToWei(amountOfETH)), // amount is always in wei
      daoAddressOrEns: '0xff25e3d89995ea3b97cede27f00ec2281a89e960' // my-dao.dao.eth
    }

    const steps = client.methods.deposit(depositParams);

    for await (const step of steps) {
      try {
        switch(step.key) {
          case DaoDepositSteps.DEPOSITING:
            alert(`Depositing ETH into DAO... here's your transaction: https://goerli.etherscan.io/tx/${step.txHash}`);
            break;
          case DaoDepositSteps.DONE:
            alert(`Deposit of ${formatEther(amountOfETH)} ETH into DAO complete!`);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    //.... front-end deposit form
  )
}
```

### List all members

We want to display all members for our DAO. Members are defined as addresses who have interacted at least once with the specified DAO.

In order to do this, we will call into the `getMembers` function of the SDK, store the addresses on a state variable, then use that to map over it and return rows in a table.

However, in order to call `getMembers`, we need the plugin address we're getting our members from. One DAO may have several plugins installed with many different members within it, so we want to make sure we pick the plugin that works for our use case. The best way to do this is calling `getDAO` to get our DAO details, this will include the plugins we have installed.

Then, we can either iterate over them finding the one we need, OR simply calling it directly if we know what we want (as is the case below for simplicity).

```typescript
// src/components/MembersList/index.tsx

import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Client, ContextPlugin, DaoDetails, TokenVotingClient } from '@aragon/sdk-client';
import { useAragonSDKContext } from '../../context/AragonSDK';

export default function MembersList(): JSX.Element {
  const [members, setMembers] = useState<string[]>([]);

  const { context } = useAragonSDKContext();

  useEffect(() => {
    async function getDaoMembers() {
      const client = new Client(context); // general purpose client allowing us to call getDao
      const daoAddressOrEns: string = '0xff25e3d89995ea3b97cede27f00ec2281a89e960'; // or my-dao.dao.eth

      const dao: DaoDetails | null = await client.methods.getDao(daoAddressOrEns); // returns details about our DAO
      const pluginAddress: string = dao?.plugins[0].instanceAddress || ''; // returns the pluginAddress we have installed

      const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context); // enables us to create a TokenVotingClient so we can get our members
      const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

      const daoMembers: string[] | undefined = await tokenVotingClient.methods.getMembers(pluginAddress) || [];
      setMembers(daoMembers);
    };
    getDaoMembers();
  }, [context]);

  return (
    <>
      <h3 className="text-center pt-5">DAO Members</h3>
      <p className="text-center">AKA - anyone who owns a $PARK token.</p>
      <Table striped bordered hover className="mx-auto" style={{ width: '800px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
        // We use the members state variable we just populated with members from the DAO
          {members.map((member, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{member}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
```

### Display and vote on proposals

Lastly, we want to display all proposals a specific DAO has and enable users to vote on them if they're able.

We do this by calling on the `getProposals` function, as well as the `voteProposal` function. Additionally, we could add a check `canVote` which verifies if the signer is able to vote in a specific proposal. However for simplicity, we won't do this here.

```typescript
// src/components/DisplayProposals

import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row } from 'react-bootstrap';
import { ContextPlugin, IVoteProposalParams, TokenVotingClient, TokenVotingProposalListItem, VoteProposalStep, VoteValues } from '@aragon/sdk-client';

import { useAragonSDKContext } from '../../context/AragonSDK';

export default function DisplayProposals() {
  const [proposals, setProposals] = useState<TokenVotingProposalListItem[]>([]);

  const { context } = useAragonSDKContext();
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

  useEffect(() => {
    async function fetchProposals() {
      const daoProposals: TokenVotingProposalListItem[] = await tokenVotingClient.methods.getProposals({ daoAddressOrEns: '0xff25e3d89995ea3b97cede27f00ec2281a89e960' });
      setProposals(daoProposals);
    }
    fetchProposals();
  });

  async function vote(proposalId: string, voteInput: VoteValues) {
    const voteParams: IVoteProposalParams = {
      proposalId,
      vote: voteInput
    };

    const steps = tokenVotingClient.methods.voteProposal(voteParams);

    for await (const step of steps) {
      try {
        switch (step.key) {
          case VoteProposalStep.VOTING:
            alert(`Voting... Review your transaction here: https://goerli.etherscan.io/tx/${step.txHash}`);
            break;
          case VoteProposalStep.DONE:
            alert(`Vote casted for proposal ${proposalId}!`);
            break;
        }
      } catch (err) {
        alert(err);
      }
    }
  }

  return (
    <Container className="mx-auto">
      <h3 className="text-center pt-5 pb-3">DAO Proposals</h3>
      <Row>
        // Display all proposals retrieved
        {proposals.map((proposal, index) => {
          const { id, metadata } = proposal;
          return (
            <Card border="success" className="mx-3 mb-5" style={{ width: 'auto' }} key={index}>
              <Card.Body>
                <Card.Title>{metadata.title}</Card.Title>
                <Card.Text>
                  {metadata.summary}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  // Vote on the proposals
                  <Button variant="primary" onClick={() => vote(id, VoteValues.YES)}>Yay</Button>
                  <Button variant="warning" onClick={() => vote(id, VoteValues.NO)}>Nay</Button>
                </div>
              </Card.Body>
            </Card>
          )
          })}
      </Row>
    </Container>
  )
}
```

## Learn more

Hope that helps you get started with using the [Aragon OSx SDK](https://github.com/aragon/sdk)!

If you want to read more on the SDK functionality, feel free to head over to Aragon's [Developer Portal](https://devs.aragon.org), Aragon's [Discord server](https://discord.gg/Wpk36QRdMN) to interact with the vibrant Developer community  or reach out to me directly through [email](mailto:juliette@aragon.org).

Excited to see what you build!!

### Stack
- [Aragon SDK](https://github.com/aragon/sdk)
- [Create React App](https://github.com/facebook/create-react-app)
- [Typescript](https://www.typescriptlang.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Ethers Library](https://docs.ethers.org/v5/)
- [Wagmi Library](https://wagmi.sh/)
- [React-Boostrap CSS Framework](react-bootstrap.github.io/)
- [Aphrodite CSS Framework](https://github.com/Khan/aphrodite)

### Additional available scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
