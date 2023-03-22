import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const NavBar = () => (
  <Navbar variant="dark" style={{ backgroundColor: "#5c1919" }}>
    <Container>
      <Navbar.Brand href="#home">Ecole Biblique Photo Archive</Navbar.Brand>
    </Container>
  </Navbar>
);

export default NavBar;
