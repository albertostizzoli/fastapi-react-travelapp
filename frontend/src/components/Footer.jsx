function Footer({ className = "" }) {

    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={`flex flex-col items-center justify-between gap-2 backdrop-blur-sm ${className}`}>

            <img
                src="/images/footer_logo.png"
                alt="TravelDiary Logo"
                className="h-33 w-auto mx-auto"
            />

            <div className="flex flex-wrap justify-between w-full max-w-5xl mx-auto">
                <a href="#" className="text-white text-sm hover:underline">
                    Privacy Policy
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Supporto
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Contatti
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Assistenza
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Condizioni d'uso
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Copyright
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Accessibilità
                </a>
                <a href="#" className="text-white text-sm hover:underline">
                    Chi Siamo
                </a>
            </div>

            <span className="text-white text-center text-sm mt-6">
                &copy; {currentYear} <strong>TravelDiary</strong>. Tutti i diritti riservati.
            </span>
        </footer>
    );
}

export default Footer;
