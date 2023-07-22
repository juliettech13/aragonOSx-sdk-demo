import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Client, CreateDaoParams, DaoCreationSteps, DaoMetadata, TokenVotingClient, TokenVotingPluginInstall, VotingMode } from '@aragon/sdk-client';

import { useAragonSDKContext } from '../../context/AragonSDK';

export default function CreateDao(): JSX.Element {
  const { context } = useAragonSDKContext();

  async function createDao() {
    const client = new Client(context);

    const metadata: DaoMetadata = {
      name: "My DAO",
      description: "This is a description",
      avatar: "image-url",
      links: [{
        name: "Web site",
        url: "https://aragon.org",
      }],
    };

// Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/
    const metadataUri = await client.methods.pinMetadata(metadata);

    const tokenVotingPluginInstallParams: TokenVotingPluginInstall = {
      votingSettings: {
        minDuration: 60 * 60 * 24 * 2, // seconds (minimum amount is 3600)
        minParticipation: 0.25, // 25%
        supportThreshold: 0.5, // 50%
        minProposerVotingPower: BigInt("5000"), // default 0
        votingMode: VotingMode.STANDARD, // default standard, other options: EARLY_EXECUTION, VOTE_REPLACEMENT
      },
      newToken: {
        name: "Token", // the name of your token
        symbol: "TOK", // the symbol for your token. shouldn't be more than 5 letters
        decimals: 18, // the number of decimals your token uses
        balances: [
          { // Defines the initial balances of the new token
            address: "0x43804905C02f551ec5420A88005Bc66a1BAF3ab0", // address of the account to receive the newly minted tokens
            balance: BigInt(10), // amount of tokens that address should receive
          },
        ],
      },
    };

    const tokenVotingInstallItem = TokenVotingClient.encoding
      .getPluginInstallItem(tokenVotingPluginInstallParams);

    const createDaoParams: CreateDaoParams = {
      metadataUri,
      ensSubdomain: "crazyyydaooooo", // my-org.dao.eth
      plugins: [tokenVotingInstallItem], // plugin array cannot be empty or the transaction will fail. you need at least one governance mechanism to create your DAO.
    };

    const steps = client.methods.createDao(createDaoParams);

    for await (const step of steps) {
      try {
        switch (step.key) {
          case DaoCreationSteps.CREATING:
            console.log({ txHash: step.txHash });
            break;
          case DaoCreationSteps.DONE:
            console.log({
              daoAddress: step.address,
              pluginAddresses: step.pluginAddresses,
            });
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <Container className="mx-auto row g-3" style={{ width: '800px' }}>
      <Button className="btn-success" onClick={createDao}>
        Create DAO
      </Button>
    </Container>
  );
}
