import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // stato per aprire / chiudere la sidebar
  const [user, setUser] = useState(null); // stato per ottenere i dati dell'utente
  const location = useLocation(); // per la pagina corrente
  const navigate = useNavigate(); // stato per la navigazione sul browser

  // Rotte dinamiche nella sidebar
  const path = location.pathname;
  const isHome = path === "/";
  const isTravels = path === "/travels";
  const isAdd = path === "/add";
  const isProfile = path === "/profile";

  // prendo l'id utente e il token dal Local Storage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // carico i dati dal backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Errore HTTP:", res.status);
        }
      } catch (error) {
        console.error("Errore nel recupero utente:", error);
      }
    };

    if (token && userId) fetchUser();
  }, [token, userId]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen); // per aprire / chiudere la sidebar

  // chiude la sidebar al cambio pagina
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Funzione di Logout
  const handleLogout = () => {
    // rimuovo il token e l'id utente dal LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/"); // reindirizza alla Home Page
  };

  return (
    <div className="sm:hidden">
      {/* Navbar mobile */}
      <nav
        className={`p-4 flex justify-between items-center ${isHome ? "bg-blue-400 text-white" : "bg-transparent text-white"
          }`}>
        <button
          onClick={toggleSidebar}
          aria-label="Apri il menu"
          className="text-white text-3xl font-bold p-2 cursor-pointer">
          <i className="fa-solid fa-bars"></i>
        </button>
        <h1 className="font-bold text-3xl underline">Travel App</h1>
      </nav>

      {/* Sidebar + overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay scuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-blue-400 z-[9998]"
            />

            {/* Sidebar full-screen */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 140, damping: 30 }}
              className={`fixed top-0 left-0 w-full h-full z-[9999] flex flex-col justify-between p-6
                ${isHome ? "bg-blue-400" : "backdrop-blur-xl bg-white/10 text-white"}`}>
              <div className="flex flex-col gap-6">
                {/* Chiudi */}
                <button
                  onClick={toggleSidebar}
                  aria-label="Chiudi il menu"
                  className="text-white text-2xl self-end cursor-pointer">
                  <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Area Personale */}
                {isHome && (
                  <Link
                    to="/user"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <i className="fa-solid fa-user"></i>
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-[2px] after:bg-current 
                    after:transition-all after:duration-300 
                    hover:after:w-full">Area Personale
                    </span>
                  </Link>
                )}

                {/* Profilo */}
                {!isHome && !isProfile && user && (
                  <Link
                    to="/profile"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <img
                      src={user.photo || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-3 border-white"
                    />
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-[2px] after:bg-current 
                    after:transition-all after:duration-300 
                    hover:after:w-full">{user.name}
                    </span>
                  </Link>
                )}

                {/* I miei viaggi */}
                {!isHome && !isTravels && (
                  <Link
                    to="/travels"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <i className="fa-solid fa-globe"></i>
                     <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-[2px] after:bg-current 
                    after:transition-all after:duration-300 
                    hover:after:w-full">I tuoi viaggi
                    </span>
                  </Link>
                )}

                {/* Aggiungi viaggio */}
                {!isHome && !isAdd && (
                  <Link
                    to="/add"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <i className="fa-solid fa-plus"></i>
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-[2px] after:bg-current 
                    after:transition-all after:duration-300 
                    hover:after:w-full">Aggiungi Viaggio
                    </span>
                  </Link>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 border-t border-white/30 pt-4 flex flex-col gap-4">
                {!isHome && (
                  <button
                    onClick={handleLogout}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-[2px] after:bg-current 
                    after:transition-all after:duration-300 
                    hover:after:w-full">Esci
                    </span>
                  </button>
                )}

                {/* Link fittizi raggruppati */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Privacy Policy
                  </Link>
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Supporto
                  </Link>
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Contatti
                  </Link>

                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Assistenza
                  </Link>
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Condizioni d'uso
                  </Link>
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Copyright
                  </Link>

                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Accessibilità
                  </Link>
                  <Link to="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">
                    Chi Siamo
                  </Link>
                </div>

                {/* Copyright */}
                <span className="text-white text-xl mt-4">
                  &copy; 2025 Travel App. Tutti i diritti riservati
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sidebar;
