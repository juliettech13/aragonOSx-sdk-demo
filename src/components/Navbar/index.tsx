import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Aragon SDK Demo</Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <div className="justify-content-end">
            <ConnectButton />
        </div>
      </Container>
    </Navbar>
  )
}
