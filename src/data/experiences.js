// Experiencias - Tipos de actividades (informativo)
// Cada experiencia puede tener múltiples paquetes/viajes

export const experiences = [
    // --- VERANO ---
    {
        id: 1,
        title: "Hut 2 Hut",
        slug: "hut-2-hut",
        season: "verano",
        tags: ["Trekking", "Aventura"],
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Travesía de refugio a refugio por los senderos más icónicos de los Dolomitas.",
        longDescription: "Una aventura única de refugio en refugio (Hut to Hut) a través de los paisajes más impresionantes de los Alpes. Camina por senderos legendarios, duerme en refugios tradicionales de montaña y disfruta de la gastronomía alpina auténtica en cada parada. Esta es la forma más inmersiva de experimentar las montañas.",
        highlights: [
            "Travesía por senderos legendarios de alta montaña",
            "Noches en refugios tradicionales alpinos",
            "Gastronomía local en cada parada",
            "Vistas panorámicas incomparables"
        ],
        whatToExpect: "Caminarás entre 4-6 horas diarias por senderos marcados. El equipaje principal se transporta de refugio a refugio, solo llevas tu mochila de día. Cada noche disfrutarás de cenas típicas y el ambiente único de los refugios de montaña.",
        difficulty: "Intermedio",
        bestFor: "Senderistas con experiencia que buscan una aventura inmersiva"
    },
    {
        id: 2,
        title: "Hiking",
        slug: "hiking",
        season: "verano",
        tags: ["Senderismo", "Naturaleza"],
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Descubre los senderos más hermosos de los Alpes italianos.",
        longDescription: "Programa de senderismo diseñado para disfrutar de la naturaleza alpina a tu ritmo. Desde senderos panorámicos hasta rutas a través de bosques, lagos cristalinos y praderas de alta montaña. Perfecto para quienes quieren explorar la montaña sin el compromiso de largas travesías.",
        highlights: [
            "Rutas para todos los niveles",
            "Lagos alpinos cristalinos",
            "Bosques y praderas de montaña",
            "Regreso al hotel cada noche"
        ],
        whatToExpect: "Caminatas diarias de 3-5 horas con posibilidad de adaptar la dificultad. Regreso al hotel cada noche para descansar cómodamente. Transporte incluido a los puntos de inicio de cada ruta.",
        difficulty: "Fácil-Intermedio",
        bestFor: "Familias y grupos que quieren disfrutar la montaña con comodidad"
    },
    {
        id: 3,
        title: "City Lights",
        slug: "city-lights",
        season: "verano",
        tags: ["Cultura", "Ciudades"],
        image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Explora las ciudades más emblemáticas del norte de Italia.",
        longDescription: "Un viaje cultural por las luces de las ciudades italianas más icónicas. Desde la moda de Milán hasta los canales de Venecia, pasando por la romántica Verona. Arte, arquitectura, gastronomía y vida nocturna en un solo viaje.",
        highlights: [
            "Arte y arquitectura de clase mundial",
            "Gastronomía italiana auténtica",
            "Compras en las mejores boutiques",
            "Experiencias nocturnas únicas"
        ],
        whatToExpect: "Tours guiados por el día con tiempo libre para explorar. Traslados cómodos entre ciudades. Hoteles céntricos para que puedas disfrutar de la vida nocturna.",
        difficulty: "Fácil",
        bestFor: "Amantes de la cultura, el arte y la vida urbana"
    },

    // --- INVIERNO ---
    {
        id: 4,
        title: "Ski Pull",
        slug: "ski-pull",
        season: "invierno",
        tags: ["Esquí", "Aventura"],
        image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Esquí de alto nivel en las mejores pistas de los Dolomitas.",
        longDescription: "Una experiencia de esquí intensiva en las legendarias pistas de Cortina d'Ampezzo y el dominio de Dolomiti Superski. Más de 1,200km de pistas te esperan con guías expertos que te llevarán a descubrir los descensos más espectaculares.",
        highlights: [
            "Acceso a Dolomiti Superski",
            "Pistas legendarias de competición",
            "Guías de esquí expertos",
            "Descensos panorámicos únicos"
        ],
        whatToExpect: "Esquí intensivo de 5-6 horas diarias. Guía que optimizará tu tiempo en pistas evitando colas. Almuerzo en refugios de montaña con gastronomía local.",
        difficulty: "Intermedio-Avanzado",
        bestFor: "Esquiadores experimentados que buscan nuevos desafíos"
    },
    {
        id: 5,
        title: "Ski Family",
        slug: "ski-family",
        season: "invierno",
        tags: ["Familia", "Esquí"],
        image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Vacaciones de esquí perfectas para toda la familia.",
        longDescription: "Programa diseñado especialmente para familias con niños. Resorts con pistas para todos los niveles, escuelas de esquí especializadas para pequeños y actividades après-ski que disfrutarán tanto padres como hijos.",
        highlights: [
            "Escuelas de esquí para niños",
            "Pistas verdes y azules",
            "Actividades de nieve para toda la familia",
            "Hoteles con servicios familiares"
        ],
        whatToExpect: "Los niños disfrutarán de clases con instructores especializados mientras los padres esquían. Actividades familiares por la tarde. Hoteles con habitaciones familiares y menú infantil.",
        difficulty: "Todos los niveles",
        bestFor: "Familias con niños que quieren vacaciones de nieve"
    },
    {
        id: 6,
        title: "Navidad",
        slug: "navidad",
        season: "invierno",
        tags: ["Navidad", "Mercados"],
        image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
        heroImage: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920",
        shortDescription: "Vive la magia de los mercados navideños de Europa.",
        longDescription: "Sumérgete en el espíritu navideño del Tirol del Sur y los Alpes. Visita los famosos Christkindlmärkte con sus luces, artesanías y vino caliente. Tradiciones centenarias en un ambiente mágico que te hará sentir la Navidad como nunca antes.",
        highlights: [
            "Mercados navideños tradicionales",
            "Vino caliente y gastronomía festiva",
            "Artesanías únicas",
            "Ambiente mágico y festivo"
        ],
        whatToExpect: "Tours por los mejores mercados con tiempo libre para compras. Degustaciones de productos típicos navideños. Experiencias culturales y tradicionales.",
        difficulty: "Fácil",
        bestFor: "Quienes quieren vivir la Navidad europea auténtica"
    }
];

// Funciones de utilidad
export const getExperiencesBySeason = (season) => {
    if (season === 'ambas' || !season) {
        return experiences;
    }
    return experiences.filter(exp => exp.season === season);
};

export const getExperienceBySlug = (slug) => {
    return experiences.find(exp => exp.slug === slug);
};

export const getExperienceById = (id) => {
    return experiences.find(exp => exp.id === parseInt(id));
};
