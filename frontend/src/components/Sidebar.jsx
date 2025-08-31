import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="sm:hidden"> {/* visibile solo su mobile */}
            <nav className="p-4 bg-transparent text-white flex justify-between items-center">
                {/* Bottone hamburger */}
                <button
                    onClick={toggleSidebar}
                    aria-label="Apri il menu"
                    className="text-white text-3xl font-bold p-2">
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h1 className="font-bold text-3xl underline">Travel App</h1>
            </nav>

            {/* Sidebar vera e propria */}
            {isSidebarOpen && (
                <div className="fixed top-0 left-0 w-64 h-full bg-black bg-opacity-90 p-6 z-50 flex flex-col gap-6">
                    <button
                        onClick={toggleSidebar}
                        aria-label="Chiudi il menu"
                        className="text-white text-2xl self-end">
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <Link
                        to="/"
                        onClick={toggleSidebar}
                        className="text-white text-lg font-medium hover:underline">
                        <i className="fa-solid fa-globe mr-2"></i>
                        I miei viaggi
                    </Link>

                    <Link
                        to="/add"
                        onClick={toggleSidebar}
                        className="text-white text-lg font-medium hover:underline">
                        <i className="fa-solid fa-plus mr-2"></i>
                        Aggiungi Viaggio
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
