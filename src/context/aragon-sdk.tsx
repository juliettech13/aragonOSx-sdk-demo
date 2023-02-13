import { createContext, useEffect, useContext, useState } from 'react';

import { useSigner } from 'wagmi';
import { Client, Context, ContextParams } from '@aragon/sdk-client';

const AragonSDKContext = createContext({});

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const signer = useSigner().data || undefined;

  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: 'goerli',
      signer,
      daoFactoryAddress: '0x66DBb74f6cADD2486CBFf0b9DF211e3D7961eBf9',
      web3Providers: ['https://rpc.ankr.com/eth_goerli'],
      ipfsNodes: [
        {
          url: 'https://testing-ipfs-0.aragon.network/api/v0',
          headers: { 'X-API-KEY': process.env.REACT_APP_IPFS_KEY || '' },
        },
      ],
      graphqlNodes: [
        {
          url:
            'https://subgraph.satsuma-prod.com/aragon/core-goerli/api'
        },
      ],
    };

    const context = new Context(aragonSDKContextParams);
    setClient(new Client(context));
  }, [signer]);

  return (
    <AragonSDKContext.Provider value={{ client }}>
      {children}
    </AragonSDKContext.Provider>
  )
}

export function useAragonSDKContext(): any {
  return useContext(AragonSDKContext);
}
