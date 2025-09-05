import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation(); // ottengo la rotta attuale

  return (
    <nav className="hidden sm:flex p-4 bg-transparent text-white gap-4 justify-between items-center">
      <h1 className="font-bold text-3xl underline">Travel App</h1>
      <div className="flex gap-3">
        {/* Mostra il link solo se NON siamo già su "/" */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-globe"></i></span>
            I miei viaggi
          </Link>
        )}

        {/* Mostra il link solo se NON siamo già su "/add" */}
        {location.pathname !== "/add" && (
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

