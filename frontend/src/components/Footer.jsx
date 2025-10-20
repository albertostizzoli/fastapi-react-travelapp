function Footer({ className = ""}) {

    return (
        <div className={`flex flex-wrap justify-around gap-4 mt-4 pt-2 bg-white/20 backdrop-blur-xl p-4 ${className}`}>

            <a href="#" className="text-white text-sm opacity-80 hover:underline">Privacy Policy</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Supporto</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Contatti</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Assistenza</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Condizioni d'uso</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Copyright</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Accessibilità</a>
            <a href="#" className="text-white text-sm opacity-80 hover:underline">Chi Siamo</a>

            <span className="w-full text-white text-center text-xl mt-4 block">
                &copy; 2025 TravelDiary. Tutti i diritti riservati
            </span>
        </div>
    );
}

export default Footer;
