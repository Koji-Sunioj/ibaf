import { Routes, Route, BrowserRouter } from "react-router-dom";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import Testing from "./pages/Testing";
import PhotoPage from "./pages/PhotoPage";
import SearchResults from "./pages/SearchResults";
import Collections from "./pages/Collections";

import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/testing" element={<Testing />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/photo/:photoId" element={<PhotoPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
