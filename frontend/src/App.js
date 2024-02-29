import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavbarComponent from "./components/NavbarComponent";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <div className="App">
      <Router>
        <NavbarComponent />
        <div className="pages">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
