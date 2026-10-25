export const PRODUCTS = [
  {
    id: 'art-3',
    name: 'Luxury Croco Bag',
    category: 'maroquinerie',
    categoryLabel: 'Maroquinerie & Voyage',
    sub: 'Bleu Océan Profond & Finitions Or',
    price: 120000,
    originalPrice: 145000,
    image: '/images/SAC.jpg',
    video: '/videos/SAC.mp4',
    badge: 'Bestseller',
    rating: 4.9,
    reviewsCount: 52,
    tag: 'Cuir de Crocodile Véritable',
    description: "Sac de voyage et porte-documents exécutif façonné en cuir exotique d'exception. Bouclerie en laiton massif poli or, compartiment renforcé pour ordinateur 15\" et bandoulière amovible doublée.",
    materials: [
      'Cuir de Crocodile Pleine Fleur',
      'Cuir Vachette Italien Souple',
      'Finition Noir Mat & Palladium'
    ],
    sizes: [
      'Format Standard (38 x 28 x 8 cm)',
      'Format Voyage Exécutif (44 x 32 x 12 cm)'
    ],
    colors: [
      { name: 'Bleu Nuit Impérial', hex: '#162842', bgClass: 'bg-[#162842]' },
      { name: 'Noir Obsidienne', hex: '#0B0D13', bgClass: 'bg-[#0B0D13]' },
      { name: 'Brun Havane', hex: '#3E2416', bgClass: 'bg-[#3E2416]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Ex: V.A. ou vos initiales',
    paintBgShape: 'bg-gradient-to-tr from-[#D1B992]/35 to-[#162842]',
    accentGlow: '#D1B992',
    featured: true,
    featureTagline: "L'Autorité Silencieuse du Cuir Exotique",
    featureQuote: "Une silhouette sculpturale réservée aux hommes d'influence. Présence instantanée garantie dans chaque salon exécutif."
  },
  {
    id: 'art-7',
    name: 'Mocassins Bicolores Sartorial',
    category: 'souliers',
    categoryLabel: 'Souliers & Maroquinerie',
    sub: 'Cuir Noir Nappa & Empiècement Craie',
    price: 95000,
    originalPrice: 125000,
    image: '/images/chaussure.jpg',
    video: '/videos/chaussure.mp4',
    badge: 'Édition Sartoriale',
    rating: 5.0,
    reviewsCount: 47,
    tag: 'Cousu Trépointe & Cuir Italien',
    description: "Mocassins d'apparat au design bicolore audace et intemporel. Façonnés en cuir de veau pleine fleur, semelle cuir biseautée cousue main et finitions haute précision pour une démarche d'exception.",
    materials: [
      'Cuir de Veau Pleine Fleur & Nappa',
      'Semelle Cuir Véritable Cousu Trépointe',
      'Doublure Cuir Respirant Tannage Végétal'
    ],
    sizes: [
      'Pointure 40 (25.5 cm)',
      'Pointure 41 (26.2 cm)',
      'Pointure 42 Standard (27.0 cm)',
      'Pointure 43 (27.8 cm)',
      'Pointure 44 (28.5 cm)',
      'Pointure 45 (29.2 cm)'
    ],
    colors: [
      { name: 'Noir & Craie Sartorial', hex: '#EBEBEB', bgClass: 'bg-gradient-to-r from-black to-[#EBEBEB]' },
      { name: 'Noir Pur Ébène', hex: '#0B0D13', bgClass: 'bg-[#0B0D13]' },
      { name: 'Havane & Crème', hex: '#8B5A2B', bgClass: 'bg-[#8B5A2B]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Initiales sur semelle intérieure (ex: D.M.)',
    paintBgShape: 'bg-gradient-to-tr from-[#D1B992]/40 to-[#2A2B35]',
    accentGlow: '#D1B992',
    featured: true,
    featureTagline: "L'Allure Distinguée à Chaque Pas",
    featureQuote: "L'accord parfait entre le cuir ébène et le contraste blanc pur. Une signature sartoriale d'un raffinement absolu."
  },
  {
    id: 'art-1',
    name: 'Bracelet à Clou Royal',
    category: 'bracelets',
    categoryLabel: 'Bracelets & Parures',
    sub: 'Luxe Doré 18K & Titane Argenté',
    price: 25000,
    originalPrice: 32000,
    image: '/images/bracelet-clou.jpg',
    badge: 'Iconique',
    rating: 5.0,
    reviewsCount: 84,
    tag: 'Acier Chirurgical 316L & Or',
    description: "Inspiré des plus grandes maisons de joaillerie masculine. Une silhouette courbée affirmée, usinée en acier 316L chirurgical hypoallergénique avec placage ionique haute résistance aux éraflures.",
    materials: [
      'Acier Inoxydable 316L & Or 18K',
      'Titane Noir Carbone & Or',
      'Argent Brossé Satiné'
    ],
    sizes: [
      'Taille S (Poignet 15-16 cm)',
      'Taille M Standard (Poignet 17-18 cm)',
      'Taille L (Poignet 19-20 cm)',
      'Taille XL (Poignet 21+ cm)'
    ],
    colors: [
      { name: 'Bicolore Or & Argent', hex: '#D4AF37', bgClass: 'bg-gradient-to-r from-[#D4AF37] to-[#C0C0C0]' },
      { name: 'Or Jaune 18K Pur', hex: '#E5C158', bgClass: 'bg-[#E5C158]' },
      { name: 'Argent Titane', hex: '#A8B2C1', bgClass: 'bg-[#A8B2C1]' },
      { name: 'Noir Carbone DLC', hex: '#1C1C1E', bgClass: 'bg-[#1C1C1E]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Initiales sur la tête du clou (ex: L.M.)',
    paintBgShape: 'bg-gradient-to-tr from-[#D4AF37]/40 to-[#8A6A1C]',
    accentGlow: '#D4AF37',
    featured: true,
    featureTagline: "Le Symbole Éternel de l'Ancrage Masculin",
    featureQuote: "Plus qu'un bijou, une déclaration d'indépendance. La fusion parfaite entre l'or chaud et le titane brut."
  },
  {
    id: 'art-6',
    name: 'Montre Rectangulaire VIRIL Tank',
    category: 'horlogerie',
    categoryLabel: 'Horlogerie de Prestige',
    sub: 'Boîtier Rectangulaire Acier & Cuir Vert Sauge',
    price: 110000,
    originalPrice: 135000,
    image: '/images/montre.jpg',
    video: '/videos/montre.mp4',
    badge: 'Haute Horlogerie',
    rating: 5.0,
    reviewsCount: 41,
    tag: 'Boîtier Acier Biseauté & Verre Saphir',
    description: "L'élégance géométrique absolue. Boîtier rectangulaire en acier 316L poli miroir, cadran noir ébène minimaliste signature VIRIL et bracelet en cuir pleine fleur vert sauge façonné à la main.",
    materials: [
      'Acier Inoxydable 316L Poli Miroir',
      'Verre Saphir Inrayable Biseauté',
      'Cuir Grainé Pleine Fleur Vert Sauge'
    ],
    sizes: [
      'Format Standard Homme (31 x 40 mm)',
      'Format Grand Modèle (34 x 44 mm)'
    ],
    colors: [
      { name: 'Vert Sauge & Acier Poli', hex: '#636F57', bgClass: 'bg-[#636F57]' },
      { name: 'Noir Ébène & Acier', hex: '#0D0E12', bgClass: 'bg-[#0D0E12]' },
      { name: 'Brun Havane & Acier', hex: '#4B3022', bgClass: 'bg-[#4B3022]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Gravure au dos du boîtier en acier',
    paintBgShape: 'bg-gradient-to-tr from-[#636F57]/40 to-[#D1B992]/30',
    accentGlow: '#D1B992',
    featured: true,
    featureTagline: "L'Harmonie du Temps et de la Géométrie",
    featureQuote: "Une silhouette rectangulaire affirmée au poignet des esthètes. Précision haute horlogerie et cuir d'exception."
  },
  {
    id: 'art-2',
    name: 'CEO Viril Wallet',
    category: 'portefeuilles',
    categoryLabel: 'Petite Maroquinerie',
    sub: 'Cuir Saffiano & Fibre de Carbone',
    price: 35000,
    originalPrice: 45000,
    image: '/images/porte-monnaie.jpg',
    video: '/videos/porte-monnaie.mp4',
    badge: 'Exclusivité',
    rating: 4.9,
    reviewsCount: 67,
    tag: 'Protection Anti-RFID & Cuir Italien',
    description: "L'accessoire de poche indispensable pour le leader contemporain. Alliance de cuir Saffiano traité anti-rayures et d'un tissage en véritable fibre de carbone 3K, doublé d'un bouclier bloquant 100% des scans RFID.",
    materials: [
      'Cuir Saffiano Italien & Fibre de Carbone 3K',
      'Cuir Vachette Lisse Nappa',
      'Cuir Grainé Ébène Pleine Fleur'
    ],
    sizes: [
      'Format Slim 8 Cartes + Billets Dépliés',
      'Format Exécutif 12 Cartes + Zip Monnaie'
    ],
    colors: [
      { name: 'Noir Carbone Mat', hex: '#14151B', bgClass: 'bg-[#14151B]' },
      { name: 'Bleu Nuit Carbone', hex: '#121F33', bgClass: 'bg-[#121F33]' },
      { name: 'Brun Cognac', hex: '#4A2A18', bgClass: 'bg-[#4A2A18]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Initiales gravées or sur cuir intérieur',
    paintBgShape: 'bg-gradient-to-tr from-[#D1B992]/30 to-[#121522]',
    accentGlow: '#D1B992',
    featured: true,
    featureTagline: "La Puissance Discrète dans la Poche",
    featureQuote: "Dégainez votre moyen de paiement avec une prestance inébranlable. Cuir inrayable et sécurité RFID militaire."
  },
  {
    id: 'art-4',
    name: 'Pochette Croco Aventus',
    category: 'maroquinerie',
    categoryLabel: 'Maroquinerie & Voyage',
    sub: 'Noir Ébène & Serrure Palladium',
    price: 90000,
    originalPrice: 115000,
    image: '/images/croco-clutch.jpg',
    badge: 'Nouveauté 2026',
    rating: 4.8,
    reviewsCount: 29,
    tag: 'Dragonne Amovible & Finition Mat',
    description: "La pochette de main urbaine par excellence. Relief écailles profondes, serrure à cliquet palladium haute précision, doublure suédine anti-poussière et dragonne de sécurité.",
    materials: [
      'Cuir Crocodile Mat Texturé',
      'Cuir Pleine Fleur Grainé',
      'Cuir Vachette Lisse Nappa'
    ],
    sizes: [
      'Taille Unique Exécutive (25 x 17 x 5 cm)'
    ],
    colors: [
      { name: 'Noir Profond', hex: '#0D0E12', bgClass: 'bg-[#0D0E12]' },
      { name: 'Brun Cigar', hex: '#3D281C', bgClass: 'bg-[#3D281C]' },
      { name: 'Vert Forêt Royal', hex: '#162C20', bgClass: 'bg-[#162C20]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Initiales sur la languette de cuir',
    paintBgShape: 'bg-gradient-to-tr from-white/20 to-[#1A1C24]',
    accentGlow: '#FFFFFF',
    featured: false,
    featureTagline: "Le Raffinement Porté Main",
    featureQuote: "L'accessoire idéal pour vos rendez-vous d'affaires et soirées sélects à Yaoundé et Douala."
  },
  {
    id: 'art-5',
    name: 'Boss Viril Wallet Prestige',
    category: 'portefeuilles',
    categoryLabel: 'Petite Maroquinerie',
    sub: 'Cuir Grainé & Éjection Instantanée',
    price: 45000,
    originalPrice: 58000,
    image: '/images/ceo-wallet.jpg',
    video: '/videos/portefeuille.mp4',
    badge: 'Édition Spéciale',
    rating: 4.9,
    reviewsCount: 38,
    tag: 'Porte-cartes Magnétique Éjection Rapide',
    description: "Innovation et tradition réunies. Mécanisme breveté d'éjection des cartes d'un seul geste, habillage en cuir pleine fleur premium cousu main avec coutures sellier renforcées.",
    materials: [
      'Cuir Grainé Italien & Boîtier Aluminium Aéro',
      'Cuir Mat Carbone 3K',
      'Cuir Vintage Patiné main'
    ],
    sizes: [
      'Format Compact Poche Avant (10 x 6.5 cm)',
      'Format Portefeuille Double Volet'
    ],
    colors: [
      { name: 'Noir Pur & Accent Or Champagne', hex: '#D1B992', bgClass: 'bg-[#0D0E15]' },
      { name: 'Marron Châtaigne', hex: '#4B3022', bgClass: 'bg-[#4B3022]' }
    ],
    allowsEngraving: true,
    engravingPlaceholder: 'Gravure laser sur le boîtier aluminium',
    paintBgShape: 'bg-gradient-to-tr from-[#D1B992]/25 to-[#0A0F1D]',
    accentGlow: '#D1B992',
    featured: false,
    featureTagline: "L'Efficacité Mécanique et le Style",
    featureQuote: "Un bouton poussoir ergonomique, des cartes présentées en éventail parfait en un quart de seconde."
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Toutes les créations', icon: 'Sparkles' },
  { id: 'maroquinerie', label: 'Maroquinerie & Sacs', icon: 'Briefcase' },
  { id: 'souliers', label: 'Souliers & Mocassins', icon: 'Footprints' },
  { id: 'bracelets', label: 'Bracelets & Parures', icon: 'Gem' },
  { id: 'portefeuilles', label: 'Portefeuilles CEO', icon: 'Wallet' },
  { id: 'horlogerie', label: 'Horlogerie & Montres', icon: 'Watch' }
];
