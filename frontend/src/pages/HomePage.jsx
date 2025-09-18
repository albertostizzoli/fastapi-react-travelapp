import { motion } from "framer-motion";

function HomePage() {
    return (
        <div className="bg-gradient-to-b from-blue-400 via-white to-orange-400 font-sans">
            {/* Section 1 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <div>
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">
                        Conserva i tuoi ricordi di viaggio
                    </h2>
                    <p className="text-gray-700 mb-4 text-justify">
                        Un viaggio non è solo una serie di <strong>tappe</strong>, ma un insieme di emozioni e
                        momenti unici che meritano di essere custoditi. Con la nostra app,
                        puoi creare un vero e proprio <strong>diario digitale</strong> in cui ogni tappa
                        diventa un <strong>capitolo</strong> della tua storia. <strong>Fotografie, descrizioni,
                        sensazioni</strong>: tutto viene raccolto in un luogo speciale, sempre <strong>accessibile</strong> e
                        pronto a farti rivivere i tuoi ricordi.
                    </p>
                </div>
                <img
                    src="/images/monte_fuji.jpg"
                    alt="Monte Fuji"
                    className="rounded-2xl shadow-lg"
                />
            </section>

            {/* Section 2 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <img
                    src="/images/amalfi.jpg"
                    alt="Costiera Amalfitana"
                    className="rounded-2xl shadow-lg"
                />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Aggiungi le tue tappe
                    </h2>
                    <p className="text-gray-700 mb-4 text-justify">
                        Ogni viaggio può essere suddiviso in tappe, così da ricordare in modo
                        <strong> dettagliato</strong> ogni singolo momento. Puoi <strong>annotare</strong> i luoghi visitati,
                        <strong> inserire</strong> pensieri personali, <strong>arricchire</strong> le tue pagine con foto e
                        <strong> creare</strong> un racconto autentico e vivido. In questo modo il tuo diario
                        diventa una <strong>mappa emotiva</strong> che ti accompagnerà per sempre.
                    </p>
                </div>
            </section>

            {/* Section 3 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Un diario solo per te
                    </h2>
                    <p className="text-gray-700 mb-4 text-justify">
                        Questo non è un semplice elenco di luoghi, ma uno <strong>spazio</strong> intimo in cui
                        custodire <strong>emozioni</strong> e <strong>pensieri</strong> personali. Ogni tappa racconta una
                        parte di te: i <strong>sorrisi</strong>, le <strong>sfide</strong>, le <strong>scoperte</strong>. 
                        Il diario diventa così un compagno di viaggio che ti permette di fermare il <strong>tempo</strong> e di
                        rileggere le tue <strong>esperienze</strong> con occhi nuovi.
                    </p>
                </div>
                <img
                    src="/images/tempio_agrigento.jpg"
                    alt="Tempio di Agrigento"
                    className="rounded-2xl shadow-lg"
                />
            </section>

            {/* Section 4 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <img
                    src="/images/hollywood.jpg"
                    alt="Hollywood"
                    className="rounded-2xl shadow-lg"
                />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Il prossimo viaggio scelto per te
                    </h2>
                    <p className="text-gray-700 mb-4 text-justify">
                        Grazie all’<strong>intelligenza artificiale</strong>, l’app può suggerirti la prossima
                        <strong> destinazione</strong> ideale in base ai tuoi viaggi passati, preferenze e interessi.
                         Immagina di scoprire luoghi nuovi e sorprendenti, personalizzati
                        per te, senza dover fare ricerche infinite. Il consiglio dell’AI
                        trasforma la tua esperienza di viaggio in un’avventura sempre <strong>unica e stimolante.</strong>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
