import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faUser, faGlobe, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // stato per ottenere i dati dell'utente

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

  // Rotte dinamiche della navbar
  const path = location.pathname;
  const isHome = path === "/";
  const isTravels = path === "/travels";
  const isAdd = path === "/add";
  const isProfile = path === "/profile";


  // prendo l'id e il token dell'utente del LocalStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // carico i dati dal backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // funzione di Logout
  const handleLogout = () => {
    // rimuovo il token e l'id utente dal LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/"); // reindirizza alla HomePage
  };

  return (
    <nav
      className={`hidden sm:flex p-4 gap-4 justify-between items-center transition-colors duration-300
    ${isHome
          ? "bg-blue-500 text-white dark:bg-slate-900 dark:text-gray-200"
          : "bg-transparent text-white dark:text-gray-200"
        }`}>
      <h1 className="font-bold text-3xl underline">TravelDiary</h1>

      <div className="flex gap-6 items-center">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative w-14 h-7 flex items-center justify-between rounded-full border border-gray-400 dark:border-gray-600 
          transition-all duration-300 cursor-pointer"
          title="Cambia tema">

          {/* Icone */}
          <span className="text-sm ml-1"><FontAwesomeIcon icon={faMoon} /></span>
          <span className="text-sm mr-1"><FontAwesomeIcon icon={faSun} /></span>

          {/* Pallina */}
          <span
            className={`absolute w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300
        ${theme === "dark" ? "translate-x-7" : "translate-x-0"}`}
          ></span>
        </button>

        {/*  AREA PERSONALE SE SEI IN HOME */}
        {isHome && (
          <Link
            to="/loginregister"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <FontAwesomeIcon icon={faUser} />
            <span className="relative inline-block
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-0 after:h-0.5 after:bg-current
            after:transition-all after:duration-300
            hover:after:w-full">
              Area Personale
            </span>
          </Link>
        )}

        {/*  LINK PROFILO */}
        {!isHome && !isProfile && user && (
          <Link
            to="/profile"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <img
              src={user.photo || "/default-avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border-2 border-current"
            />
            <span className="relative inline-block
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-0 after:h-0.5 after:bg-current
            after:transition-all after:duration-300
            hover:after:w-full">
              {user.name}
            </span>
          </Link>
        )}

        {/*  LINK VIAGGI */}
        {!isHome && !isTravels && (
          <Link
            to="/travels"
            className="flex items-center gap-2 px-4 py-2 font-semibold">
            <FontAwesomeIcon icon={faGlobe} />
            <span className="relative inline-block
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-0 after:h-0.5 after:bg-current
            after:transition-all after:duration-300
            hover:after:w-full">
              I miei viaggi
            </span>
          </Link>
        )}

        {/*  LINK AGGIUNGI */}
        {!isHome && !isAdd && (
          <Link
            to="/add"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <FontAwesomeIcon icon={faPlus} />
            <span className="relative inline-block
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-0 after:h-0.5 after:bg-current
            after:transition-all after:duration-300
            hover:after:w-full">
              Aggiungi Viaggio
            </span>
          </Link>
        )}

        {/*  LOGOUT */}
        {!isHome && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 flex items-center gap-2 font-semibold cursor-pointer">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span className="relative inline-block
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-0 after:h-0.5 after:bg-current
            after:transition-all after:duration-300
            hover:after:w-full">
              Esci
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
