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
