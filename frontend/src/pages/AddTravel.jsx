import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // use Navigate serve per il reindirizzamento fra le pagine
import axios from "axios";
import { motion } from "framer-motion";

function AddTravel() {

  const navigate = useNavigate(); // inizializzo useNavigate
  const [message, setMessage] = useState(""); // stato per mostrare messaggi di conferma/errore

  // stato del form con tutti i campi del viaggio
  const [form, setForm] = useState({
    town: "",
    city: "",
    year: "",
    start_date: "",
    end_date: "",
    cibo: "",
    relax: "",
    prezzo: "",
    attività: "",
    paesaggio: "",
  });

  // gestisce il cambiamento dei campi input del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // aggiorna il campo specifico
  };

  // calcolo la media dei voti 
  const calculateGeneralVote = () => {
    const votes = ["cibo", "relax", "prezzo", "attività", "paesaggio"] // campi da considerare
      .map((field) => parseFloat(form[field])) // converto in numeri
      .filter((v) => !isNaN(v)); // filtro quelli validi

    if (votes.length === 0) return null; // nessun voto valido

    const avg = votes.reduce((a, b) => a + b, 0) / votes.length; // calcolo la media
    return avg.toFixed(1); // restituisce una stringa con 1 decimale, es. "3.6"
  };


  // gestisce l’invio del form e salva un nuovo viaggio nel backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    try {
      // calcolo il voto generale come media
      const general_vote = calculateGeneralVote() // se c’è almeno un voto
        ? parseFloat(calculateGeneralVote()) // lo converto in numero
        : null; // altrimenti null

      const token = localStorage.getItem("token"); //  prendo il token

      // creo l'oggetto viaggio da inviare al backend
      const newTravel = {
        town: form.town,
        city: form.city,
        year: parseInt(form.year), // converto in numero
        start_date: form.start_date,
        end_date: form.end_date,
        general_vote: general_vote, // calcolato
        votes: {
          cibo: form.cibo ? parseInt(form.cibo) : null,
          relax: form.relax ? parseInt(form.relax) : null,
          prezzo: form.prezzo ? parseInt(form.prezzo) : null,
          attività: form.attività ? parseInt(form.attività) : null,
          paesaggio: form.paesaggio ? parseInt(form.paesaggio) : null,
        }
      };

      // invio al backend
      await axios.post("http://127.0.0.1:8000/travels", newTravel, {
        headers: { Authorization: `Bearer ${token}` }, //  aggiungo token
      });
      setMessage("✅ Viaggio aggiunto!");

      // il form si resetta dopo l'invio
      setForm({
        town: "",
        city: "",
        year: "",
        start_date: "",
        end_date: "",
        cibo: "",
        relax: "",
        prezzo: "",
        attività: "",
        paesaggio: "",
      });

      // reindirizzo alla pagina dei viaggi
      setTimeout(() => {
        setMessage(""); // fa sparire il modale
        navigate("/travels");
      }, 2000);


    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del viaggio.");
    }
  };

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-linear-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-linear-to-br from-white/20 via-white/10 to-transparent rounded-3xl p-6 
        w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">

        {/* Sfere animate di sfondo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-md h-112 bg-linear-to-br from-blue-500/20 to-orange-400/10 rounded-full 
              blur-3xl top-10 left-10" />
          <div className="absolute w-lg h-128 bg-linear-to-br from-orange-500/20 to-blue-400/10 rounded-full 
              blur-3xl bottom-10 right-10" />
        </div>

        {/* INTESTAZIONE */}
        <div className="absolute top-0 left-0 w-full backdrop-blur-2xl bg-linear-to-r from-black/10 to-transparent 
            border-b border-white/20 px-6 py-4 rounded-t-3xl flex justify-between items-center">

          <Link
            to="/travels"
            className="font-semibold px-4 py-2 flex items-center justify-center gap-2 bg-linear-to-r from-red-600 to-rose-500 
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-150 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-arrow-left"></i>
            Torna ai Viaggi
          </Link>

          <h2 className="text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] text-center">
            Aggiungi un nuovo viaggio
          </h2>

          <p className="text-sm italic text-white">* Il campo è obbligatorio</p>
        </div>

        {/* Divider verticale desktop */}
        <div className="hidden md:block absolute left-1/2 top-24 bottom-6 w-0.5 bg-linear-to-b from-transparent via-white/40 
            to-transparent rounded-full pointer-events-none" />

        {/* COLONNA SINISTRA */}
        <div className="flex flex-col gap-6 mt-24">
          {/* Paese */}
          <div>
            <label className="block font-bold text-white mb-2">Paese *</label>
            <input
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Città */}
          <div>
            <label className="block font-bold text-white mb-2">Città *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Anno */}
          <div>
            <label className="block font-bold text-white mb-2">Anno *</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Data inizio */}
          <div>
            <label className="block font-bold text-white mb-2">Data Inizio *</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 focus:border-transparent transition scheme-dark"
            />
          </div>

          {/* Data fine */}
          <div>
            <label className="block font-bold text-white mb-2">Data Fine *</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 focus:border-transparent transition scheme-dark"
            />
          </div>
        </div>

        {/* COLONNA DESTRA */}
        <div className="flex flex-col gap-8 sm:mt-24">
          {/* Voti */}
          <div>
            <h3 className="font-bold mb-4 text-white text-center text-xl">Voti *</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {["cibo", "relax", "prezzo", "attività", "paesaggio"].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <label className="capitalize mb-1 font-bold text-white text-center">{field}</label>
                  <input
                    type="number"
                    name={field}
                    min="1"
                    max="5"
                    value={form[field]}
                    onChange={handleChange}
                    className="w-20 font-semibold p-2 border border-white/40 bg-white/10 text-white rounded-full text-center 
                    focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Media voto */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <label className="font-bold text-white mb-1">Media Voti</label>
              <input
                type="text"
                value={calculateGeneralVote() ?? "-"}
                readOnly
                className="w-20 p-2 font-semibold border border-white/40 bg-white/10 text-white rounded-full text-center"
              />
            </div>
          </div>

          { /* Azione */ }
          <div className="flex justify-end mt-20">
            <button
              type="submit"
              className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-teal-500 
              backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <i className="fa-solid fa-plus"></i>
              Aggiungi Viaggio
            </button>
          </div>
        </div>
      </form>


      {/* Modale conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-xl border border-white/40 text-white px-6 py-3 rounded-full 
          shadow-lg z-9999 bg-linear-to-r from-blue-500 to-orange-500">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default AddTravel;
