import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { ContextPlugin, TokenVotingClient } from '@aragon/sdk-client';
import { useAragonSDKContext } from '../../context/AragonSDK';

export default function MembersList(): JSX.Element {
  const [members, setMembers] = useState<string[]>([]);

  const { context } = useAragonSDKContext();

  useEffect(() => {
    async function getDaoMembers() {
      const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);
      const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

      const daoAddressorEns: string = "0x16c6e7a2082e5f4f9fb96415b748ec7e20b9da87"; // or my-dao.dao.eth
      const daoMembers: string[] = await tokenVotingClient.methods.getMembers(daoAddressorEns);
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
