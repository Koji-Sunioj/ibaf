import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import { Link } from "react-router-dom";

const NavBar = () => (
  <Navbar variant="dark" style={{ backgroundColor: "#5c1919" }} expand="md">
    <Container>
      <Navbar.Brand as={Link} to="/">
        <img
          src="/logo.png"
          style={{ height: "30px", paddingRight: "5px" }}
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        <span className="hide-large-text">
          Couvent dominicain Saint-Etienne de Jérusalem
        </span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link as={Link} to="/collections">
            Collections
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavBar;
