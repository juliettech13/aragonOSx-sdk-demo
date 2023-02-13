# aragonOSx SDK Basic Demo

This project is a basic demo using the [aragonOSx SDK](https://github.com/aragon/sdk).

## Stack
- [Create React App](https://github.com/facebook/create-react-app)
- [Typescript](https://www.typescriptlang.org/)
- [Aragon SDK](https://github.com/aragon/sdk)
- [RainbowKit](https://www.rainbowkit.com/)
- [Ethers](https://docs.ethers.org/v5/)
- [Wagmi](https://wagmi.sh/)

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
mkdir src/context && touch src/context/aragon-sdk.tsx
```

2. Inside the `aragon-sdk.tsx` file, let's add the following code:

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
import { AragonSDKWrapper } from './context/aragon-sdk';

// setting up all chains, wallet, and provider config..
// const { chains, provider } = configureChains(
//   [mainnet, goerli],
//   [
//     alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_GOERLI_KEY || '' }),
//     publicProvider()
//   ]
// );

// const { connectors } = getDefaultWallets({
//   appName: 'aragonOSx demo',
//   chains
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider
// })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      // Adding the AragonSDKWrapper for the context hook
        <AragonSDKWrapper>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AragonSDKWrapper>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
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
