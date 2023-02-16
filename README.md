# aragonOSx SDK Basic Demo

This project is a basic demo using the [aragonOSx SDK](https://github.com/aragon/sdk).

## Stack
- [Aragon SDK](https://github.com/aragon/sdk)
- [Create React App](https://github.com/facebook/create-react-app)
- [Typescript](https://www.typescriptlang.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Ethers Library](https://docs.ethers.org/v5/)
- [Wagmi Library](https://wagmi.sh/)
- [React-Boostrap CSS Framework](react-bootstrap.github.io/)
- [Aphrodite CSS Framework](https://github.com/Khan/aphrodite)

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
import { mainnet, goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import App from './App';
import reportWebVitals from './reportWebVitals';

const { chains, provider } = configureChains(
  // Determine which chains you want for your app
  [mainnet, goerli],
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
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
      daoFactoryAddress: '0x66DBb74f6cADD2486CBFf0b9DF211e3D7961eBf9', // the DAO Factory contract address from the Goerli network
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
            'https://subgraph.satsuma-prod.com/aragon/core-goerli/api' // this will change based on the chain you're using
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
// import rainbowkit provider, wagmi config, other providers, etc..
import { AragonSDKWrapper } from './context/AragonSDK';

// setting up all chains, wallet, and provider config..
// const { chains, provider } = configureChains(
//   [mainnet, goerli],
//   [
//     alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_GOERLI_KEY || '' }),
//     publicProvider()
//   ]
// );

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
Those who deposit any amoount, will receive a DAO token in return.

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
import { Client, DaoDepositSteps, DepositParams, TokenType } from '@aragon/sdk-client';

import { useAragonSDKContext } from '../../context/AragonSDK';
import { ETHToWei } from '../../helpers/crypto';

export default function DepositETH(): JSX.Element {
  const [amountOfETH, setAmountOfETH] = useState<number>(0); // we can use this React hook within a form input to set the amount of ETH a user wants to deposit.

  const { context } = useAragonSDKContext();

  async function depositEthToDao() {
    const client = new Client(context);

    const depositParams: DepositParams = {
      daoAddressOrEns: '0xae8586ee1ef50544683b6d9d608ff920ab081357',
      amount: BigInt(ETHToWei(amountOfETH)),
      type: TokenType.NATIVE
    }

    const steps = client.methods.deposit(depositParams);

    for await (const step of steps) {
      try {
        switch(step.key) {
          case DaoDepositSteps.DEPOSITING:
            console.log(step.txHash);
            break;
          case DaoDepositSteps.DONE:
            console.log(step.amount);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    //.... front-end form
  )
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn about the Aragon SDK, check out the [Aragon documentation here](https://devs.aragon.org).
