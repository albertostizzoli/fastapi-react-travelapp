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
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Un viaggio non è solo una serie di tappe, ma un insieme di emozioni e
                        momenti unici che meritano di essere custoditi. Con la nostra app,
                        puoi creare un vero e proprio diario digitale in cui ogni tappa
                        diventa un capitolo della tua storia. Fotografie, descrizioni,
                        sensazioni: tutto viene raccolto in un luogo speciale, sempre
                        accessibile e pronto a farti rivivere i tuoi ricordi.
                    </p>
                </div>
                <img
                    src="/images/beach.jpg"
                    alt="Spiaggia tropicale"
                    className="rounded-2xl shadow-lg"
                />
            </section>

            {/* Section 2 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <img
                    src="/images/street.jpg"
                    alt="Strada nel deserto"
                    className="rounded-2xl shadow-lg"
                />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Aggiungi le tue tappe
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Ogni viaggio può essere suddiviso in tappe, così da ricordare in modo
                        dettagliato ogni singolo momento. Puoi annotare i luoghi visitati,
                        inserire pensieri personali, arricchire le tue pagine con foto e
                        creare un racconto autentico e vivido. In questo modo il tuo diario
                        diventa una mappa emotiva che ti accompagnerà per sempre.
                    </p>
                </div>
            </section>

            {/* Section 3 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Un diario solo per te
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Questo non è un semplice elenco di luoghi, ma uno spazio intimo in cui
                        custodire emozioni e pensieri personali. Ogni tappa racconta una
                        parte di te: i sorrisi, le sfide, le scoperte. Il diario diventa così
                        un compagno di viaggio che ti permette di fermare il tempo e di
                        rileggere le tue esperienze con occhi nuovi.
                    </p>
                </div>
                <img
                    src="/images/mountain.jpg"
                    alt="Montagna con diario di viaggio"
                    className="rounded-2xl shadow-lg"
                />
            </section>

            {/* Section 4 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 items-center">
                <img
                    src="/images/wood.jpg"
                    alt="Foresta"
                    className="rounded-2xl shadow-lg"
                />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        Il prossimo viaggio scelto per te
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Grazie all’intelligenza artificiale, l’app può suggerirti la prossima
                        destinazione ideale in base ai tuoi viaggi passati, preferenze e
                        interessi. Immagina di scoprire luoghi nuovi e sorprendenti, personalizzati
                        per te, senza dover fare ricerche infinite. Il consiglio dell’AI
                        trasforma la tua esperienza di viaggio in un’avventura sempre unica e
                        stimolante.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
