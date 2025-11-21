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
import ChatAI from "./pages/ChatAI"; // pagina Chat AI 

function Layout({ children }) {
  const location = useLocation();

  return (
    <div
      className={`overflow-y-auto h-screen bg-linear-to-br from-blue-600 to-orange-600 dark:from-slate-900 dark:to-slate-500 transition-colors duration-300 scrollbar `}>
      {/* Sidebar sempre visibile */}
      {location.pathname !== "/loginregister" && <Sidebar />}

      {/* Header visibile solo se NON sono nella rotta /loginregister */}
      {location.pathname !== "/loginregister" && <Header />}

      {/* Contenuto pagina */}
      <div className="flex-1">{children}</div>

      {/* Footer scompare a 576px e non appare in HomePage, LoginRegisterPage e ChatAI */}
      {location.pathname !== "/loginregister" &&
        location.pathname !== "/" &&
        location.pathname !== "/chat" && <Footer className="hidden sm:flex" />}
    </div>
  );
}

{ /* Rotte delle pagine */ }
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
          <Route path="/chat" element={<ChatAI />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


