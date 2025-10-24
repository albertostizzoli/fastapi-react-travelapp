const travellers = [
  {
    category: "Avventura",
    description: "Esperienze adrenaliniche e a contatto con la natura.",
    experiences: [
      "Trekking & Escursionismo",
      "Camping Selvaggio",
      "Arrampicata",
      "Rafting",
      "Kayak",
      "Parapendio",
      "Immersioni Subacquee",
      "Speleologia",
      "Quad & Offroad",
      "Safari",
      "Viaggi Avventura",
      "Overlanding",
      "Deserti & Oasi",
      "Astroturismo",
      "Canyoning",
      "Surf & Kite Surf",
      "Mountain Biking",
      "Snowboarding & Sci Estremo"
    ]
  },
  {
    category: "Cultura",
    description: "Scopri storia, arte, tradizioni e patrimonio locale.",
    experiences: [
      "Città Storiche",
      "Musei & Gallerie",
      "Arte & Architettura",
      "Borghi Antichi",
      "Tour Letterari",
      "Tour Cinematografici",
      "Percorsi Religiosi",
      "Festival Tradizionali",
      "Viaggi Storici",
      "Spettacoli Teatrali",
      "Incontri con le Popolazioni Locali",
      "Tour Archeologici",
      "Visite a Siti Patrimonio UNESCO",
      "Laboratori Artigianali",
      "Festival Musicali Tradizionali"
    ]
  },
  {
    category: "Cibo & Vino",
    description: "Esperienze gastronomiche e degustazioni locali.",
    experiences: [
      "Cucina Locale",
      "Street Food Experience",
      "Degustazione Vini",
      "Mercati Gastronomici",
      "Festival del Gusto",
      "Corsi di Cucina",
      "Tour Enogastronomici",
      "Degustazione Birre Artigianali",
      "Tour di Cioccolato & Dolci",
      "Esperienze di Pesca & Cucina Locale"
    ]
  },
  {
    category: "Natura",
    description: "Connessione con la natura, paesaggi e benessere all’aperto.",
    experiences: [
      "Natura & Paesaggi",
      "Birdwatching",
      "Fotografia Naturalistica",
      "Eco-Lodge",
      "Turismo Lento",
      "Viaggi Sostenibili",
      "Isole Remote",
      "Destinazioni Artiche",
      "Ritiri Benessere",
      "Yoga nella Natura",
      "Trekking Botanico",
      "Safari Fotografico",
      "Osservazione Vulcani & Geoturismo",
      "Bagni di Foresta (Shinrin-Yoku)"
    ]
  },
  {
    category: "Romantico",
    description: "Esperienze da condividere in coppia.",
    experiences: [
      "Viaggi Romantici",
      "Resort sul Mare",
      "Spa di Lusso",
      "Crociere Esclusive",
      "Suite Panoramiche",
      "Glamping di Coppia",
      "Cene al Tramonto",
      "Castelli & Ville Storiche",
      "Picnic Gourmet",
      "Viaggi in Treno Panoramico"
    ]
  },
  {
    category: "Città",
    description: "Esplora metropoli, musei, locali e vita urbana.",
    experiences: [
      "Tour nelle Capitali",
      "Vita Notturna",
      "Shopping Metropolitano",
      "Mercati Urbani",
      "Street Art",
      "Musei Contemporanei",
      "Caffè Letterari",
      "Eventi Musicali",
      "Coworking City",
      "Architettura Moderna",
      "Tour Gastronomici Urbani",
      "Festival di Design & Moda",
      "Passeggiate Fotografiche"
    ]
  },
  {
    category: "Nomade Digitale",
    description: "Viaggia lavorando e scopri posti stimolanti.",
    experiences: [
      "Workation Spots",
      "Comunità Remote Worker",
      "Solo Travel",
      "Van Life",
      "Couchsurfing",
      "Backpacking Globale",
      "Turismo Lento Digitale",
      "Coworking Retreat",
      "Reti Digitali Locali",
      "Residenze Creative"
    ]
  },
  {
    category: "Famiglia",
    description: "Esperienze pensate per grandi e piccini.",
    experiences: [
      "Vacanze in Famiglia",
      "Resort per Bambini",
      "Natura Interattiva",
      "Villaggi Turistici",
      "Esperienze Educative",
      "Road Trip Familiare",
      "Mini Crociere",
      "Parchi Tematici & Acquatici",
      "Zoo & Aquari",
      "Vacanze in Fattoria"
    ]
  },
  {
    category: "Volontariato",
    description: "Viaggi per aiutare e restituire valore alle comunità.",
    experiences: [
      "Volontariato Ambientale",
      "Viaggi Etici",
      "Eco-Turismo Solidale",
      "Turismo Responsabile",
      "Progetti Umanitari",
      "Conservazione della Fauna",
      "Insegnamento & Mentoring",
      "Agricoltura Sostenibile"
    ]
  },
  {
    category: "Benessere",
    description: "Viaggi dedicati al relax, rigenerazione e salute mentale.",
    experiences: [
      "Spa & Centri Termali",
      "Meditazione e Yoga Retreat",
      "Vacanze Detox",
      "Ritiri di Mindfulness",
      "Resort Benessere",
      "Bagni Termali Naturali",
      "Percorsi di Rigenerazione in Natura"
    ]
  },
  {
    category: "Esperienziale",
    description: "Viaggi unici per imparare o vivere esperienze particolari.",
    experiences: [
      "Corsi d'Arte e Artigianato",
      "Esperienze Musicali",
      "Tour di Fotografia",
      "Immersioni Culturali Locali",
      "Esperienze Avventurose Tematiche",
      "Workshop di Sopravvivenza",
      "Stage Linguistici"
    ]
  },
  {
    category: "Estremo & Insolito",
    description: "Esperienze uniche, insolite e ad alto tasso di adrenalina.",
    experiences: [
      "Viaggi Polari & Ghiacciai",
      "Sopravvivenza in Natura Selvaggia",
      "Caccia all’Aurora Boreale",
      "Volare in Mongolfiera su Paesaggi Inesplorati",
      "Sottomarini Turistici",
      "Escursioni nei Vulcani Attivi",
      "Tour di Luoghi Abbandonati (Urban Exploration)",
      "Paracadutismo Estremo",
      "Caving Estremo",
      "Traversate Desertiche & Dune Giganti",
      "Esperienze in Isolamento Totale",
      "Viaggi su Rotte Estreme e Rare"
    ]
  }

];

export default travellers;
