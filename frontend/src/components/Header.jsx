import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // stato per ottenere i dati dell'utente

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
      className={`hidden sm:flex p-4 gap-4 justify-between items-center 
        ${isHome ? "bg-blue-500 text-white" : "bg-transparent text-white"}`}>
      <h1 className="font-bold text-3xl underline">TravelDiary</h1>
      <div className="flex gap-6">
        {isHome && (
          <Link
            to="/loginregister"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <span><i className="fa-solid fa-user"></i></span>
            {/* queste classi mi permettono di avere una underline animata da destra a sinistra*/}
            <span className="relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-current 
               after:transition-all after:duration-300 
               hover:after:w-full">Area Personale
            </span>
          </Link>
        )}

        {!isHome && !isProfile && user && (
          <Link
            to="/profile"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <img
              src={user.photo || "/default-avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border-3 border-white"
            />
            <span className="relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-current 
               after:transition-all after:duration-300 
               hover:after:w-full">
              {user.name}
            </span>
          </Link>
        )}

        {!isHome && !isTravels && (
          <Link
            to="/travels"
            className="flex items-center gap-2 px-4 py-2 font-semibold">
            <span><i className="fa-solid fa-globe"></i></span>
            <span
              className="relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-current 
               after:transition-all after:duration-300 
               hover:after:w-full">
              I miei viaggi
            </span>
          </Link>
        )}

        {!isHome && !isAdd && (
          <Link
            to="/add"
            className="px-4 py-2 flex items-center gap-2 font-semibold">
            <span><i className="fa-solid fa-plus"></i></span>
            <span className="relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-current 
               after:transition-all after:duration-300 
               hover:after:w-full">Aggiungi Viaggio
            </span>
          </Link>
        )}

        {!isHome && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 flex items-center gap-2 font-semibold cursor-pointer">
            <span><i className="fa-solid fa-right-from-bracket"></i></span>
            <span className="relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-current 
               after:transition-all after:duration-300 
               hover:after:w-full">Esci
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
