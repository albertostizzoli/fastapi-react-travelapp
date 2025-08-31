import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false); // stato per aprire/chiudere la SideBar

    // funzione per aprire / chiudere la sidebar
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
                    className="text-white text-3xl font-bold p-2 cursor-pointer">
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h1 className="font-bold text-3xl underline">Travel App</h1>
            </nav>

            {/* Sidebar  */}
            {isSidebarOpen && (
                <motion.div
                    // animazione di apertura / chiusura della sidebar
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 140, damping: 30 }}
                    className="fixed top-0 left-0 w-64 h-full backdrop-blur-xl p-6 z-50 flex flex-col gap-6">
                    <button
                        onClick={toggleSidebar}
                        aria-label="Chiudi il menu"
                        className="text-white text-2xl self-end cursor-pointer">
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
                </motion.div>
            )}
        </div>
    );
}

export default Sidebar;
