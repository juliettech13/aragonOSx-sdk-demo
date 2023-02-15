import React from 'react';
import { Table } from 'react-bootstrap';

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
          <tr>
            <td>1</td>
            <td>Mark</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}
