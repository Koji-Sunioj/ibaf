import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

const NavBar = () => (
  <Navbar variant="dark" style={{ backgroundColor: "#5c1919" }}>
    <Container>
      <Navbar.Brand
        as={Link}
        to="/"
        style={{ textAlign: "center", overflow: "hidden" }}
      >
        <img
          src="/logo.png"
          style={{ height: "30px", paddingRight: "5px" }}
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        Couvent dominicain Saint-Etienne de Jérusalem
      </Navbar.Brand>
    </Container>
  </Navbar>
);

export default NavBar;
