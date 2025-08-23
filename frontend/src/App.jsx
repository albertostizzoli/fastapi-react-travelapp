import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";       // ✅ importa Home
import AddTravel from "./pages/AddTravel"; // ✅ importa AddTravel

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/">🏠 Home</Link>
        <Link to="/add">➕ Aggiungi viaggio</Link>
      </nav>

      {/* Rotte */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTravel />} />
      </Routes>
    </BrowserRouter>
  );
}

// punto di ingresso React
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

export default App;


