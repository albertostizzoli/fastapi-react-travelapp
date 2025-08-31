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
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: bgImage }}>
      {/* Navbar */}
      <nav className="p-4 bg-transparent text-white flex gap-4 justify-between items-center">
        <h1 className="text-white font-bold text-3xl">Travel App</h1>
        <div className="flex gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105">
            Home
          </Link>
          <Link
            to="/add"
            className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105">
            Aggiungi Viaggio
          </Link>
        </div>
      </nav>


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


