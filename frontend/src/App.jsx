import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";       // pagina Home Principale
import AddTravel from "./pages/AddTravel"; //  pagina Aggiungi Viaggio
import AddDay from "./pages/AddDay"; // pagina Aggiungi Giorno
import TravelDays from "./pages/TravelDays"; // pagina Dettagli Viaggio
import EditTravel from "./pages/EditTravel"; // pagina Modifica Viaggio

function Layout({ children }) {
  const location = useLocation();

  // immagini diverse per ogni rotta
  const backgrounds = {
    "/": "url('/images/colosseo.jpg')",
    "/add": "url('/images/giappone.jpg')",
    "/addDay": "url('/images/newyork.jpg')",
  };

  // gestiamo anche rotte dinamiche
  if (location.pathname.includes("/travels") && location.pathname.includes("/days")) {
    backgrounds[location.pathname] = "url('/images/paris.jpg')";
  }
  if (location.pathname.includes("/travels") && location.pathname.includes("/edit")) {
    backgrounds[location.pathname] = "url('/images/london.jpg')";
  }

  const bgImage = backgrounds[location.pathname];

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: bgImage }}
    >
      {/* Navbar solo nella Home */}
      {location.pathname === "/" && (
        <nav className="p-4 bg-transparent text-white flex gap-4 justify-end">
          <Link to="/add">➕ Aggiungi viaggio</Link>
        </nav>
      )}

      {/* Contenuto pagina */}
      <div className="p-8">{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/* Rotte */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTravel />} />
          <Route path="/addDay" element={<AddDay />} />
          <Route path="/travels/:id/days" element={<TravelDays />} />
          <Route path="/travels/:id/edit" element={<EditTravel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// punto di ingresso React
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

export default App;


