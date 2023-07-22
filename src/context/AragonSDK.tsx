import { createContext, useContext, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { Context, ContextParams } from '@aragon/sdk-client';
import { SupportedNetwork } from '@aragon/sdk-client-common';

const AragonSDKContext = createContext({});

export const daoENS: string = 'parks.dao.eth';

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const signer = useSigner().data || undefined;

  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: SupportedNetwork.POLYGON,
      signer,
      web3Providers: ['https://polygon.llamarpc.com'],
      ipfsNodes: [{
        url: "https://test.ipfs.aragon.network/api/v0",
        headers: {
          "X-API-KEY": "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt",
        },
      }]
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
