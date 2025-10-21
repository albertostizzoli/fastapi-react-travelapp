import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header"; // componente Header
import Sidebar from "./components/Sidebar"; // componente Sidebar
import Footer from "./components/Footer"; // componente Footer
import HomePage from "./pages/HomePage"; // pagina Home
import LoginRegisterPage from "./pages/LoginRegisterPage"; // pagina di Login e Registrazione
import ProfilePage from "./pages/ProfilePage"; // pagina Profilo Utente
import Travels from "./pages/Travels";       // pagina Viaggi
import AddTravel from "./pages/AddTravel"; //  pagina Aggiungi Viaggio
import EditTravel from "./pages/EditTravel"; // pagina Modifica Viaggio
import TravelDays from "./pages/TravelDays"; // pagina Tappe
import AddDay from "./pages/AddDay"; // pagina Aggiungi Tappe
import EditDay from "./pages/EditDay"; // pagina Modifica Tappe

function Layout({ children }) {
  const location = useLocation();

  // immagini diverse per ogni rotta
  const backgrounds = {
    "/profile": "url('/images/golden_gate.jpg')",
    "/travels": "url('/images/colosseo.jpg')",
    "/add": "url('/images/tokyo.jpeg')",
    "/addDay": "url('/images/newyork.jpg')",
  };

  // gestisco anche le rotte dinamiche
  if (location.pathname.includes("/travels") && location.pathname.includes("/days")) {
    backgrounds[location.pathname] = "url('/images/paris.jpeg')";
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
      {location.pathname !== "/loginregister" && <Sidebar />}

      {/* Header visibile solo se NON sono nella rotta /user */}
      {location.pathname !== "/loginregister" && <Header />}

      {/* Contenuto pagina */}
      <div className="flex-1">{children}</div>
      {/* Footer scompare a 576px e non appare in HomePage e LoginRegisterPage */}
      {location.pathname !== "/loginregister" && location.pathname !== "/" && <Footer className="hidden sm:flex" />}

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
          <Route path="/loginregister" element={<LoginRegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/travels" element={<Travels />} />
          <Route path="/add" element={<AddTravel />} />
          <Route path="/travels/:id/edit" element={<EditTravel />} />
          <Route path="/travels/:id/days" element={<TravelDays />} />
          <Route path="/addDay" element={<AddDay />} />
          <Route path="/days/:id/edit" element={<EditDay />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


