import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation(); // hook per ottenere il percorso corrente
  const isHome = location.pathname === "/"; // controlla se siamo nella Home

  return (
    <nav
      className={`hidden sm:flex p-4 gap-4 justify-between items-center 
        ${isHome ? "bg-blue-400 text-white" : "bg-transparent text-white"}`}> 
      <h1 className="font-bold text-3xl underline">Travel App</h1>
      <div className="flex gap-3">
        {/* Mostra il link solo se NON siamo già su "/" */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className="px-4 py-2 flex items-center gap-2 font-medium hover:underline">
            <span><i className="fa-solid fa-home"></i></span>
            Home
          </Link>
        )}
        {/* Mostra il link solo se NON siamo già su "/travels" */}
        {location.pathname !== "/travels" && (
          <Link
            to="/travels"
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

