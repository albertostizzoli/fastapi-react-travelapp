import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaMoon, FaSun, FaTimes, FaUser, FaGlobe, FaPlus, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // stato per aprire / chiudere la sidebar
  const [user, setUser] = useState(null); // stato per ottenere i dati dell'utente
  const location = useLocation(); // per la pagina corrente
  const navigate = useNavigate(); // stato per la navigazione sul browser
  const currentYear = new Date().getFullYear(); // prendo l'anno corrente


  // stato per la dark mode con salvattaggio in localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // useEffect per applicare la dark mode
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

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
        className={`p-4 flex justify-between items-center transition-colors duration-300
          ${isHome
          ? "text-white dark:text-gray-200"
          : "bg-transparent text-white dark:text-gray-200"
        }`}>
        <button
          onClick={toggleSidebar}
          aria-label="Apri il menu"
          className="text-white text-3xl font-bold p-2 cursor-pointer">
          <FaBars size={30} />
        </button>
        <h1 className="font-bold text-3xl underline">TravelDiary</h1>
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
              className="fixed inset-0  z-9998"
            />

            {/* Sidebar full-screen */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 140, damping: 30 }}
              className={`fixed top-0 left-0 w-full h-full z-9999 flex flex-col justify-between p-6 transition-colors duration-300
                ${isHome
                  ? "bg-linear-to-br from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500"
                  : "backdrop-blur-xl bg-linear-to-br from-blue-500 to-orange-500 text-white dark:from-slate-900 dark:to-slate-500 dark:text-gray-200"}`}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">

                  { /* Pulsante Dark Mode */}
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative w-14 h-7 py-2 flex items-center justify-between rounded-full text-white border border-white 
                  transition-all duration-300 cursor-pointer"
                    title="Cambia tema">

                    {/* Icone */}
                    <span className="text-sm ml-1"><FaMoon size={20} /></span>
                    <span className="text-sm mr-1"><FaSun size={20} className="text-yellow-400" /></span>

                    {/* Pallina */}
                    <span
                      className={`absolute w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300
                  ${theme === "dark" ? "translate-x-7" : "translate-x-0"}`}
                    ></span>
                  </button>

                  {/* Pulsante Chiudi Sidebar */}
                  <button
                    onClick={toggleSidebar}
                    aria-label="Chiudi il menu"
                    className="text-white text-2xl self-end cursor-pointer">
                    <FaTimes size={30} />
                  </button>
                </div>

                {/* Area Personale */}
                {isHome && (
                  <Link
                    to="/loginregister"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <FaUser size={20} />
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-0.5 after:bg-current 
                    after:transition-all after:duration-500 
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
                    after:w-0 after:h-0.5 after:bg-current 
                    after:transition-all after:duration-500 
                    hover:after:w-full">{user.name}
                    </span>
                  </Link>
                )}

                {/* I tuoi viaggi */}
                {!isHome && !isTravels && !isProfile && (
                  <Link
                    to="/travels"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <FaGlobe size={20} />
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-0.5 after:bg-current 
                    after:transition-all after:duration-500 
                    hover:after:w-full">I tuoi viaggi
                    </span>
                  </Link>
                )}

                {/* Aggiungi viaggio */}
                {!isHome && !isAdd && !isProfile && !isTravels && (
                  <Link
                    to="/add"
                    onClick={toggleSidebar}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <FaPlus size={20} />
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-0.5 after:bg-current 
                    after:transition-all after:duration-500 
                    hover:after:w-full">Aggiungi Viaggio
                    </span>
                  </Link>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 border-t border-white/30 pt-4 flex flex-col gap-4">
                {!isHome && !isProfile && (
                  <button
                    onClick={handleLogout}
                    className="text-white text-lg px-4 py-2 flex items-center gap-2 font-semibold">
                    <FaSignOutAlt size={20} />
                    <span className="relative inline-block
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-0 after:h-0.5 after:bg-current 
                    after:transition-all after:duration-500 
                    hover:after:w-full">Esci
                    </span>
                  </button>
                )}

                {/* Link fittizi raggruppati */}
                <div className="flex flex-wrap gap-4 mt-2">

                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Privacy Policy</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Supporto</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Contatti</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Assistenza</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Condizioni d'uso</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Copyright</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Accessibilità</a>
                  <a href="#" className="text-white text-sm opacity-80 hover:underline w-[calc(33%-1rem)]">Chi Siamo</a>
                </div>

                {/* Copyright */}
                <span className="text-white text-xl mt-4">
                  &copy; {currentYear} TravelDiary. Tutti i diritti riservati
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
