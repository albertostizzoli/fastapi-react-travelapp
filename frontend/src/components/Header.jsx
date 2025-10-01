import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/";
  const isTravels = path === "/travels";
  const isAdd = path === "/add";

  return (
    <nav
      className={`hidden sm:flex p-4 gap-4 justify-between items-center 
        ${isHome ? "bg-blue-400 text-white" : "bg-transparent text-white"}`}>
      <h1 className="font-bold text-3xl underline">Travel App</h1>
      <div className="flex gap-3">
        {/* Area Personale solo in Home */}
        {isHome && (
          <Link
            to="/user"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-user"></i></span>
            Area Personale
          </Link>
        )}

        {/* I miei viaggi ovunque tranne in Home e in /travels */}
        {!isHome && !isTravels && (
          <Link
            to="/travels"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-globe"></i></span>
            I miei viaggi
          </Link>
        )}

        {/* Aggiungi Viaggio ovunque tranne in Home e in /add */}
        {!isHome && !isAdd && (
          <Link
            to="/add"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-plus"></i></span>
            Aggiungi Viaggio
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
