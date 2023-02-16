import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import DepositETH from './components/DepositETH';
import MembersList from './components/MembersList';
import NavBar from './components/Navbar';
import DisplayProposals from './components/DisplayProposals';

function App() {
  return (
    <>
      <NavBar />
      <Container className="text-center" style={{ paddingTop: '2%' }}>
        <h1>ParksDAO🌳</h1>
        <DepositETH />
        <MembersList />
        <DisplayProposals />
      </Container>
    </>
  );
}

export default App;
