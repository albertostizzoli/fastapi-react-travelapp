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
        ${isHome ? "bg-blue-400 text-white" : "bg-transparent text-white"}`}>
      <h1 className="font-bold text-3xl underline">Travel App</h1>
      <div className="flex gap-3">
        {isHome && (
          <Link
            to="/user"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-user"></i></span>
            Area Personale
          </Link>
        )}

        {!isHome && !isProfile && user && (
          <Link
            to="/profile"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <img
              src={user.photo || "/default-avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-white"
            />
            <span>{user.name}</span>
          </Link>
        )}

        {!isHome && !isTravels && (
          <Link
            to="/travels"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-globe"></i></span>
            I miei viaggi
          </Link>
        )}

        {!isHome && !isAdd && (
          <Link
            to="/add"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-plus"></i></span>
            Aggiungi Viaggio
          </Link>
        )}

        {!isHome && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline cursor-pointer">
            <span><i className="fa-solid fa-right-from-bracket"></i></span>
            Esci
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
