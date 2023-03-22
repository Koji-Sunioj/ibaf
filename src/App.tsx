import { Routes, Route, BrowserRouter } from "react-router-dom";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";

import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
