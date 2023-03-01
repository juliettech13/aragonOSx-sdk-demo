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
      const daoProposals: TokenVotingProposalListItem[] = await tokenVotingClient.methods.getProposals({ daoAddressOrEns: "0xff25e3d89995ea3b97cede27f00ec2281a89e960" });
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
