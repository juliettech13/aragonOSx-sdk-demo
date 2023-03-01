import React from 'react';
import { Table } from 'react-bootstrap';

const members = [
  "0x0000000",
  "0x0000001"
]

export default function MembersList(): JSX.Element {
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
