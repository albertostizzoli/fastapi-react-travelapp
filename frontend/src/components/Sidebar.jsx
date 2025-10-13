import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // per la navigazione
  const path = location.pathname;

  const isHome = path === "/";
  const isTravels = path === "/travels";
  const isAdd = path === "/add";
  const isProfile = path === "/profile";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // funzione per il logout
  const handleLogout = () => {
    localStorage.removeItem('user');

    // Reindirizza alla Home Page
    navigate('/');
  };

  return (
    <div className="sm:hidden">
      {/* Navbar mobile */}
      <nav
        className={`p-4 flex justify-between items-center 
          ${isHome ? "bg-blue-400 text-white" : "bg-transparent text-white"}`}>
        <button
          onClick={toggleSidebar}
          aria-label="Apri il menu"
          className="text-white text-3xl font-bold p-2 cursor-pointer">
          <i className="fa-solid fa-bars"></i>
        </button>

        <h1 className="font-bold text-3xl underline">Travel App</h1>
      </nav>

      {/* Sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 140, damping: 30 }}
          className={`fixed top-0 left-0 w-64 h-full p-6 z-[9999] flex flex-col gap-6 
            ${isHome ? "bg-blue-400" : "backdrop-blur-xl bg-transparent"}`}>
          <button
            onClick={toggleSidebar}
            aria-label="Chiudi il menu"
            className="text-white text-2xl self-end cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Area Personale solo in Home */}
          {isHome && (
            <Link
              to="/user"
              onClick={toggleSidebar}
              className="text-white text-lg px-4 py-2 flex items-center gap-2 font-medium hover:underline">
              <span><i className="fa-solid fa-user"></i></span>
              Area Personale
            </Link>
          )}

          {/* Profilo ovunque tranne in Home e /profile */}
          {!isHome && !isProfile && (
            <Link
              to="/profile"
              className="text-white text-lg px-4 py-2 flex items-center gap-2 font-medium hover:underline">
              <span><i className="fa-solid fa-user"></i></span>
              Profilo
            </Link>
          )}

          {/* I miei viaggi ovunque tranne in Home e /travels */}
          {!isHome && !isTravels && (
            <Link
              to="/travels"
              onClick={toggleSidebar}
              className="text-white text-lg px-4 py-2 flex items-center gap-2 font-medium hover:underline">
              <i className="fa-solid fa-globe"></i>
              I miei viaggi
            </Link>
          )}

          {/* Aggiungi Viaggio ovunque tranne in Home e /add */}
          {!isHome && !isAdd && (
            <Link
              to="/add"
              onClick={toggleSidebar}
              className="text-white text-lg px-4 py-2 flex items-center gap-2 font-medium hover:underline">
              <i className="fa-solid fa-plus"></i>
              Aggiungi Viaggio
            </Link>
          )}

          { /* Pulsante Esci ovunque tranne in Home */}
          {!isHome && (
            <button
              onClick={handleLogout}
              className="text-white text-lg px-4 py-2 flex items-center gap-2 font-medium hover:underline">
              <span><i className="fa-solid fa-right-from-bracket"></i></span>
              Esci
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Sidebar;
