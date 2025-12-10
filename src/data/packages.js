// Paquetes/Viajes específicos - Cada uno está asociado a una experiencia
// Contienen itinerario, precios, fechas específicas

export const packages = [
    // --- HUT 2 HUT ---
    {
        id: 1,
        experienceSlug: "hut-2-hut", // Referencia a la experiencia
        title: "Hut 2 Hut - Dolomitas Clásico",
        slug: "hut-2-hut-dolomitas-clasico",
        location: "Cortina d'Ampezzo, Dolomitas",
        price: "MXN 25,000",
        duration: "5 Días",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920",
        tags: ["Trekking", "Aventura"],
        hasDiscount: false,
        season: "verano",
        description: "La ruta clásica de las Tre Cime di Lavaredo. 5 días de travesía por los refugios más emblemáticos.",
        itinerary: [
            {
                day: 1,
                title: "Llegada a Cortina",
                description: "Llegada a Cortina d'Ampezzo y briefing de bienvenida. Primer tramo hacia el refugio Auronzo con vistas a las Tre Cime.",
                image: "https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=800"
            },
            {
                day: 2,
                title: "Tre Cime di Lavaredo",
                description: "Caminata icónica alrededor de las Tre Cime. Aproximadamente 10km con vistas que quitan el aliento.",
                image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
            },
            {
                day: 3,
                title: "Lago di Braies",
                description: "Travesía hacia el Lago di Braies, uno de los lagos más fotografiados de los Dolomitas.",
                image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"
            },
            {
                day: 4,
                title: "Paso Giau",
                description: "Cruce del Paso Giau con panorámicas de 360°. Noche en refugio con cena especial.",
                image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800"
            },
            {
                day: 5,
                title: "Descenso y Despedida",
                description: "Último tramo descendiendo al valle. Llegada a Cortina y despedida del grupo.",
                image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800"
            }
        ],
        includes: [
            { label: "Guía UIAGM", detail: "Guía de montaña certificado UIAGM con más de 10 años de experiencia en los Dolomitas." },
            { label: "Alojamiento en refugios", detail: "4 noches en refugios de montaña tradicionales con habitaciones compartidas." },
            { label: "Media pensión", detail: "Desayuno buffet y cena de 3 tiempos cada día en el refugio." },
            { label: "Transporte de equipaje", detail: "Tu maleta principal se transporta de refugio a refugio. Solo cargas tu mochila de día." }
        ],
        notIncludes: ["Vuelos internacionales", "Almuerzos", "Seguro de viaje", "Propinas"],
        difficulty: "Intermedio",
        groupSize: "4-8 personas",
        startDates: ["15 Jun 2025", "22 Jun 2025", "6 Jul 2025", "20 Jul 2025"]
    },
    {
        id: 2,
        experienceSlug: "hut-2-hut",
        title: "Hut 2 Hut - Alta Via 1",
        slug: "hut-2-hut-alta-via-1",
        location: "Dolomitas Centrales",
        price: "MXN 32,000",
        originalPrice: "MXN 35,000",
        duration: "7 Días",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920",
        tags: ["Trekking", "Expedición"],
        hasDiscount: true,
        season: "verano",
        description: "La legendaria Alta Via 1, la travesía más famosa de los Dolomitas. 7 días de aventura pura.",
        itinerary: [
            { day: 1, title: "Lago di Braies", description: "Inicio en el icónico Lago di Braies. Primera etapa hacia refugio Biella.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Fanes", description: "Travesía por el altiplano de Fanes con vistas espectaculares.", image: "https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Lagazuoi", description: "Ascenso al Lagazuoi con túneles de la Primera Guerra Mundial.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Cinque Torri", description: "Paso por las icónicas Cinque Torri.", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800" },
            { day: 5, title: "Nuvolau", description: "Ascenso al Nuvolau con 360° de panorámicas.", image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800" },
            { day: 6, title: "Civetta", description: "Travesía hacia la imponente pared del Civetta.", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800" },
            { day: 7, title: "Alleghe", description: "Descenso final a Alleghe. Celebración y despedida.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Guía experto", detail: "Guía certificado especializado en la Alta Via 1." },
            { label: "6 noches en refugios", detail: "Alojamiento en los refugios más emblemáticos de la ruta." },
            { label: "Media pensión", detail: "Desayuno y cena incluidos cada día." },
            { label: "Transporte de equipaje", detail: "Servicio de transporte de tu equipaje principal." }
        ],
        notIncludes: ["Vuelos", "Almuerzos", "Seguro", "Propinas"],
        difficulty: "Avanzado",
        groupSize: "4-6 personas",
        startDates: ["1 Jul 2025", "15 Jul 2025", "1 Ago 2025"]
    },

    // --- HIKING ---
    {
        id: 3,
        experienceSlug: "hiking",
        title: "Hiking - Lagos Alpinos",
        slug: "hiking-lagos-alpinos",
        location: "Tirol del Sur",
        price: "MXN 18,500",
        duration: "4 Días",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920",
        tags: ["Senderismo", "Lagos"],
        hasDiscount: false,
        season: "verano",
        description: "Descubre los lagos más cristalinos de los Alpes. Rutas suaves con paisajes increíbles.",
        itinerary: [
            { day: 1, title: "Llegada", description: "Check-in en hotel y caminata de bienvenida.", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Lago di Carezza", description: "Ruta al famoso lago arcoíris de los Dolomitas.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Lago di Anterselva", description: "Caminata alrededor del lago más grande del Tirol.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Despedida", description: "Última caminata suave y regreso.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Guía local", detail: "Guía de senderismo con conocimiento especializado de la zona." },
            { label: "Hotel 3*", detail: "3 noches en hotel de montaña con spa." },
            { label: "Desayunos", detail: "Desayuno buffet cada mañana." },
            { label: "Transporte", detail: "Traslados a los puntos de inicio de cada ruta." }
        ],
        notIncludes: ["Vuelos", "Comidas principales", "Seguro"],
        difficulty: "Fácil",
        groupSize: "4-12 personas",
        startDates: ["1 May 2025", "15 May 2025", "1 Sep 2025"]
    },

    // --- CITY LIGHTS ---
    {
        id: 4,
        experienceSlug: "city-lights",
        title: "City Lights - Norte de Italia",
        slug: "city-lights-norte-italia",
        location: "Milán, Verona, Venecia",
        price: "MXN 22,000",
        duration: "5 Días",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1920",
        tags: ["Cultura", "Ciudades"],
        hasDiscount: false,
        season: "verano",
        description: "El tour clásico por las joyas del norte italiano.",
        itinerary: [
            { day: 1, title: "Milán", description: "Llegada. Duomo, Galleria Vittorio Emanuele.", image: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Milán - Moda", description: "Quadrilatero della Moda y Navigli.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Verona", description: "Arena de Verona, casa de Julieta.", image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Venecia", description: "Plaza San Marco, paseo en góndola.", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800" },
            { day: 5, title: "Murano y Burano", description: "Islas de cristal y colores. Despedida.", image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Tours guiados", detail: "Guías locales en cada ciudad." },
            { label: "Hoteles céntricos", detail: "4 noches en hoteles boutique." },
            { label: "Transporte", detail: "Tren de alta velocidad entre ciudades." },
            { label: "Desayunos", detail: "Desayuno italiano cada mañana." }
        ],
        notIncludes: ["Vuelos", "Comidas", "Entradas a museos"],
        difficulty: "Fácil",
        groupSize: "6-14 personas",
        startDates: ["1 Jun 2025", "15 Jun 2025", "1 Sep 2025"]
    },

    // --- SKI PULL ---
    {
        id: 5,
        experienceSlug: "ski-pull",
        title: "Ski Pull - Cortina Classic",
        slug: "ski-pull-cortina-classic",
        location: "Cortina d'Ampezzo",
        price: "MXN 35,000",
        duration: "5 Días",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920",
        tags: ["Esquí", "Aventura"],
        hasDiscount: false,
        season: "invierno",
        description: "Esquí en las pistas olímpicas de Cortina con guía experto.",
        itinerary: [
            { day: 1, title: "Llegada", description: "Check-in y reconocimiento del resort.", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Tofana", description: "Esquí en el área de Tofana.", image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Lagazuoi", description: "Descenso legendario del Lagazuoi.", image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Cinque Torri", description: "Esquí con vistas a las Cinque Torri.", image: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?auto=format&fit=crop&q=80&w=800" },
            { day: 5, title: "Día Libre", description: "Esquí libre o spa. Cena de despedida.", image: "https://images.unsplash.com/photo-1610389051254-64849803c8fd?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Ski pass Dolomiti Superski", detail: "Pase de 5 días con acceso a 1,200km de pistas." },
            { label: "Hotel con spa", detail: "4 noches en hotel 4* con spa y piscina." },
            { label: "Media pensión", detail: "Desayuno y cena gourmet." },
            { label: "Guía de esquí", detail: "Instructor para mejorar tu técnica." }
        ],
        notIncludes: ["Vuelos", "Equipamiento de esquí", "Seguro"],
        difficulty: "Intermedio-Avanzado",
        groupSize: "4-8 personas",
        startDates: ["15 Dic 2025", "5 Ene 2026", "1 Feb 2026"]
    },

    // --- SKI FAMILY ---
    {
        id: 6,
        experienceSlug: "ski-family",
        title: "Ski Family - Val Gardena",
        slug: "ski-family-val-gardena",
        location: "Val Gardena",
        price: "MXN 28,000",
        duration: "5 Días",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920",
        tags: ["Familia", "Esquí"],
        hasDiscount: false,
        season: "invierno",
        description: "Vacaciones de esquí perfectas para toda la familia.",
        itinerary: [
            { day: 1, title: "Instalación", description: "Llegada al hotel familiar.", image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Clases", description: "Clases de esquí para todos.", image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Esquí Familiar", description: "Día de esquí en familia.", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Aventuras", description: "Trineos y actividades de nieve.", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800" },
            { day: 5, title: "Despedida", description: "Último día y entrega de diplomas.", image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Hotel familiar", detail: "4 noches con habitaciones familiares y kids club." },
            { label: "Ski pass familiar", detail: "Pases para toda la familia." },
            { label: "Clases niños", detail: "3 días de clases para los pequeños." },
            { label: "Pensión completa", detail: "Todas las comidas incluidas." }
        ],
        notIncludes: ["Vuelos", "Equipamiento", "Extras"],
        difficulty: "Todos los niveles",
        groupSize: "Familias",
        startDates: ["20 Dic 2025", "26 Dic 2025", "1 Feb 2026"]
    },

    // --- NAVIDAD ---
    {
        id: 7,
        experienceSlug: "navidad",
        title: "Navidad - Mercados de Bolzano",
        slug: "navidad-mercados-bolzano",
        location: "Bolzano, Tirol del Sur",
        originalPrice: "MXN 32,000",
        price: "MXN 28,999",
        duration: "5 Días",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920",
        tags: ["Navidad", "Mercados"],
        hasDiscount: true,
        season: "invierno",
        description: "La magia de los mercados navideños del Tirol del Sur.",
        itinerary: [
            { day: 1, title: "Bolzano", description: "Llegada y primer mercado navideño.", image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800" },
            { day: 2, title: "Mercados", description: "Tour por los mercados de Bolzano.", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?auto=format&fit=crop&q=80&w=800" },
            { day: 3, title: "Merano", description: "Mercado flotante de Merano.", image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=800" },
            { day: 4, title: "Bressanone", description: "Mercado de Bressanone y cena tradicional.", image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&q=80&w=800" },
            { day: 5, title: "Despedida", description: "Últimas compras y brunch.", image: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=800" }
        ],
        includes: [
            { label: "Hotel 4*", detail: "4 noches en hotel boutique navideño." },
            { label: "Desayunos", detail: "Desayuno buffet con productos locales." },
            { label: "Tours guiados", detail: "Guía experto en tradiciones navideñas." },
            { label: "Degustaciones", detail: "Vino caliente, strudel y productos típicos." }
        ],
        notIncludes: ["Vuelos", "Comidas no especificadas", "Compras"],
        difficulty: "Fácil",
        groupSize: "6-14 personas",
        startDates: ["1 Dic 2025", "8 Dic 2025", "15 Dic 2025"]
    }
];

// Funciones de utilidad
export const getPackagesBySeason = (season) => {
    if (season === 'ambas' || !season) {
        return packages;
    }
    return packages.filter(pkg => pkg.season === season);
};

export const getPackageBySlug = (slug) => {
    return packages.find(pkg => pkg.slug === slug);
};

export const getPackageById = (id) => {
    return packages.find(pkg => pkg.id === parseInt(id));
};

export const getPackagesByExperience = (experienceSlug) => {
    return packages.filter(pkg => pkg.experienceSlug === experienceSlug);
};
