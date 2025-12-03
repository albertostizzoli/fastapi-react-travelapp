import Select from "react-select"; // importo il componente Select da react-select
import { motion } from "framer-motion";

function YearSelect({ selectedYear, setSelectedYear, yearOptions }) {
  
  // customStyles spostato qui
  const customStyles = {
    control: (provided) => ({ // stile del controllo principale
      ...provided, // mantiene gli stili di default
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '9999px',
      borderColor: 'rgba(255,255,255,0.25)',
      padding: '0.16rem',
      color: 'white',
      cursor: 'pointer'
    }),
    option: (provided, state) => { // stile delle opzioni nel menu a tendina
      const isDark = document.documentElement.classList.contains('dark'); // verifica se la modalità scura è attiva
      return {
        ...provided, // mantiene gli stili di default
        backgroundColor: state.isFocused // stile quando l'opzione è evidenziata
          ? (isDark ? '#475569' : '#1E40AF')
          : (isDark ? '#64748B' : '#2563EB'),
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
      };
    },
    singleValue: (p) => ({ ...p, color: "white" }), // stile del valore selezionato
    placeholder: (p) => ({ ...p, color: "white", opacity: 1 }), // stile del placeholder
    menu: (p) => { // stile del menu a tendina
      const isDark = document.documentElement.classList.contains('dark');
      return {
        ...p, // mantiene gli stili di default
        zIndex: 3000,
        backgroundColor: isDark ? "#334155" : "#1E3A8A",
        borderRadius: "1rem",
        overflow: "hidden",
      };
    },
    menuList: (p) => ({ // stile della lista delle opzioni
      ...p,
      padding: 0,
      maxHeight: "200px",
      overflowY: "auto",
    }),
  };

  return (
    <motion.div
      className="sm:ml-auto sm:w-auto w-full"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}>
      <Select
        value={selectedYear !== null ? { value: selectedYear, label: selectedYear.toString() } : null} // valore selezionato
        onChange={(option) => setSelectedYear(option ? option.value : null)} // gestore del cambiamento
        options={[ { value: null, label: "Tutti i viaggi" }, ...yearOptions ]} // opzioni del selettore
        styles={customStyles} // stili personalizzati
        isSearchable={false} // Disabilita la ricerca
        classNamePrefix="custom" // Prefisso per le classi personalizzate
        menuPortalTarget={document.body} // Rende il menu un portale al body
        menuPosition="fixed" // Posizione fissa del menu
        placeholder="Filtra per anni"
      />
    </motion.div>
  );
}

export default YearSelect;
