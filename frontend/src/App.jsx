import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header"; // componente Header
import Sidebar from "./components/Sidebar"; // componente Sidebar
import Travels from "./pages/Travels";       // pagina Viaggi
import AddTravel from "./pages/AddTravel"; //  pagina Aggiungi Viaggio
import AddDay from "./pages/AddDay"; // pagina Aggiungi Giorno
import TravelDays from "./pages/TravelDays"; // pagina Dettagli Viaggio
import EditTravel from "./pages/EditTravel"; // pagina Modifica Viaggio
import EditDay from "./pages/EditDay"; // pagina Modifica Giorno
import HomePage from "./pages/HomePage"; // pagina Home
import User from "./pages/User"; // pagina di Login e Registrazione
import ProfilePage from "./pages/ProfilePage"; // pagina Profilo Utente

function Layout({ children }) {
  const location = useLocation();

  // immagini diverse per ogni rotta
  const backgrounds = {
    "/profile": "url('/images/golden_gate.jpg')",
    "/travels": "url('/images/colosseo.jpg')",
    "/add": "url('/images/giappone.jpg')",
    "/addDay": "url('/images/newyork.jpg')",
  };

  // gestisco anche le rotte dinamiche
  if (location.pathname.includes("/travels") && location.pathname.includes("/days")) {
    backgrounds[location.pathname] = "url('/images/paris.jpg')";
  }
  if (location.pathname.includes("/travels") && location.pathname.includes("/edit")) {
    backgrounds[location.pathname] = "url('/images/london.jpg')";
  }
  if (location.pathname.includes("/days") && location.pathname.includes("/edit")) {
    backgrounds[location.pathname] = "url('/images/miami.jpg')";
  }

  const bgImage = backgrounds[location.pathname];

  return (
    <div className="bg-cover bg-center scrollbar overflow-y-auto h-screen" style={{ backgroundImage: bgImage }}>
      {/* Sidebar sempre visibile */}
      {location.pathname !== "/user" && <Sidebar />}

      {/* Header visibile solo se NON sono nella rotta /user */}
      {location.pathname !== "/user" && <Header />}

      {/* Contenuto pagina */}
      <div>{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/* Rotte */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<User />} />
          <Route path="/travels" element={<Travels />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add" element={<AddTravel />} />
          <Route path="/addDay" element={<AddDay />} />
          <Route path="/travels/:id/days" element={<TravelDays />} />
          <Route path="/travels/:id/edit" element={<EditTravel />} />
          <Route path="/days/:id/edit" element={<EditDay />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


