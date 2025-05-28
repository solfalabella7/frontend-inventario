import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MyNevBar.css';

const MyNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/"></Navbar.Brand>
        <Nav className="nav-container justify-content-evenly">
          <Nav.Item>
            <Link to="/" style={{color:'#fff', textDecoration: 'none'}}> Home </Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;