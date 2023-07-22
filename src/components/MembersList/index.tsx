// import React, { useEffect, useState } from 'react';
// import { Table } from 'react-bootstrap';
// import { Client, DaoDetails, TokenVotingClient, TokenVotingMember } from '@aragon/sdk-client';
// import { daoENS, useAragonSDKContext } from '../../context/AragonSDK';

// const divider: number = 1000000000000000000;

// export default function MembersList(): JSX.Element {
//   const [members, setMembers] = useState<TokenVotingMember[]>([]);

//   const { context } = useAragonSDKContext();

//   useEffect(() => {
//     async function getDaoMembers() {
//       const client = new Client(context);

//       const dao: DaoDetails | null = await client.methods.getDao(daoENS);
//       const pluginAddress: string = dao?.plugins[0].instanceAddress || '';

//       const tokenVotingClient: TokenVotingClient = new TokenVotingClient(context);

//       const daoMembers: TokenVotingMember[] | undefined = await tokenVotingClient.methods.getMembers(pluginAddress) || [];
//       setMembers(daoMembers);
//     };
//     getDaoMembers();
//   }, [context]);

//   return (
//     <>
//       <h3 className="text-center pt-5">DAO Members</h3>
//       <p className="text-center">AKA - anyone who owns a $PARK token.</p>
//       <Table striped bordered hover className="mx-auto" style={{ width: '800px' }}>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Address</th>
//             <th>Balance</th>
//             <th>Voting Power</th>
//           </tr>
//         </thead>
//         <tbody>
//           {members.map((member, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{member.address}</td>
//               <td>{Number(member.balance) / divider}</td>
//               <td>{Number(member.votingPower) / divider}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   )
// }
