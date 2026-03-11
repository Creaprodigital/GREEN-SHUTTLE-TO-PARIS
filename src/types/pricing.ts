export interface VehiclePricing {
  vehicleId: string
  pricePerKm: number
  pricePerMinute: number
  tourBasePrice: number
  lowSeasonPricePerKm?: number
  lowSeasonPricePerMinute?: number
  lowSeasonTourBasePrice?: number
}

export interface PricingSettings {
  roundToWholeEuro: boolean
}

export interface PricingZone {
  id: string
  name: string
  color: string
  polygon: { lat: number; lng: number }[]
  description?: string
}

export interface ZonePricing {
  id: string
  fromZoneId: string
  toZoneId: string
  vehicleId: string
  fixedPrice: number
  createdAt: string
}

export interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  icon?: string
}

export const DEFAULT_PRICING: VehiclePricing[] = [
  {
    vehicleId: 'berline',
    pricePerKm: 2,
    pricePerMinute: 0.30,
    tourBasePrice: 350,
    lowSeasonPricePerKm: 2,
    lowSeasonPricePerMinute: 0.30,
    lowSeasonTourBasePrice: 350
  },
  {
    vehicleId: 'business',
    pricePerKm: 2,
    pricePerMinute: 0.30,
    tourBasePrice: 350,
    lowSeasonPricePerKm: 2,
    lowSeasonPricePerMinute: 0.30,
    lowSeasonTourBasePrice: 350
  },
  {
    vehicleId: 'van',
    pricePerKm: 2,
    pricePerMinute: 0.30,
    tourBasePrice: 350,
    lowSeasonPricePerKm: 2,
    lowSeasonPricePerMinute: 0.30,
    lowSeasonTourBasePrice: 350
  },
  {
    vehicleId: 'first',
    pricePerKm: 2,
    pricePerMinute: 0.30,
    tourBasePrice: 350,
    lowSeasonPricePerKm: 2,
    lowSeasonPricePerMinute: 0.30,
    lowSeasonTourBasePrice: 350
  }
]

export const DEFAULT_OPTIONS: ServiceOption[] = [
  {
    id: 'child-seat',
    name: 'Siège Enfant',
    description: 'Siège auto pour enfant (précisez l\'âge)',
    price: 0
  },
  {
    id: 'booster-seat',
    name: 'Rehausseur',
    description: 'Rehausseur pour enfant',
    price: 0
  },
  {
    id: 'water-bottles',
    name: 'Bouteilles d\'eau',
    description: 'Pack de bouteilles d\'eau',
    price: 0
  },
  {
    id: 'wifi',
    name: 'Wi-Fi à bord',
    description: 'Connexion Wi-Fi pendant le trajet',
    price: 0
  },
  {
    id: 'phone-charger',
    name: 'Chargeur téléphone',
    description: 'Chargeur USB disponible',
    price: 0
  },
  {
    id: 'newspapers',
    name: 'Journaux',
    description: 'Sélection de journaux du jour',
    price: 0
  }
]

export const PREDEFINED_ZONES: PricingZone[] = [
  {
    id: 'zone-cdg',
    name: 'Aéroport CDG',
    description: 'Aéroport Charles de Gaulle - Tous terminaux',
    color: '#4ECDC4',
    polygon: [
      { lat: 49.020, lng: 2.540 },
      { lat: 49.020, lng: 2.590 },
      { lat: 48.995, lng: 2.590 },
      { lat: 48.995, lng: 2.540 }
    ]
  },
  {
    id: 'zone-orly',
    name: 'Aéroport Orly',
    description: 'Aéroport d\'Orly - Tous terminaux',
    color: '#45B7D1',
    polygon: [
      { lat: 48.735, lng: 2.355 },
      { lat: 48.735, lng: 2.385 },
      { lat: 48.715, lng: 2.385 },
      { lat: 48.715, lng: 2.355 }
    ]
  },
  {
    id: 'zone-beauvais',
    name: 'Aéroport Beauvais',
    description: 'Aéroport Beauvais-Tillé',
    color: '#FFA07A',
    polygon: [
      { lat: 49.460, lng: 2.105 },
      { lat: 49.460, lng: 2.125 },
      { lat: 49.445, lng: 2.125 },
      { lat: 49.445, lng: 2.105 }
    ]
  },
  {
    id: 'zone-paris-centre',
    name: 'Paris Centre',
    description: 'Centre de Paris (1er - 8e arrondissements)',
    color: '#FF6B6B',
    polygon: [
      { lat: 48.875, lng: 2.295 },
      { lat: 48.875, lng: 2.355 },
      { lat: 48.855, lng: 2.355 },
      { lat: 48.855, lng: 2.295 }
    ]
  },
  {
    id: 'zone-la-defense',
    name: 'La Défense',
    description: 'Quartier d\'affaires de La Défense',
    color: '#98D8C8',
    polygon: [
      { lat: 48.895, lng: 2.225 },
      { lat: 48.895, lng: 2.250 },
      { lat: 48.885, lng: 2.250 },
      { lat: 48.885, lng: 2.225 }
    ]
  },
  {
    id: 'zone-gare-nord',
    name: 'Gare du Nord',
    description: 'Gare du Nord et environs',
    color: '#F7DC6F',
    polygon: [
      { lat: 48.883, lng: 2.350 },
      { lat: 48.883, lng: 2.365 },
      { lat: 48.878, lng: 2.365 },
      { lat: 48.878, lng: 2.350 }
    ]
  },
  {
    id: 'zone-gare-lyon',
    name: 'Gare de Lyon',
    description: 'Gare de Lyon et environs',
    color: '#BB8FCE',
    polygon: [
      { lat: 48.848, lng: 2.370 },
      { lat: 48.848, lng: 2.385 },
      { lat: 48.843, lng: 2.385 },
      { lat: 48.843, lng: 2.370 }
    ]
  },
  {
    id: 'zone-gare-montparnasse',
    name: 'Gare Montparnasse',
    description: 'Gare Montparnasse et environs',
    color: '#85C1E2',
    polygon: [
      { lat: 48.843, lng: 2.315 },
      { lat: 48.843, lng: 2.330 },
      { lat: 48.838, lng: 2.330 },
      { lat: 48.838, lng: 2.315 }
    ]
  },
  {
    id: 'zone-disneyland',
    name: 'Disneyland Paris',
    description: 'Parc Disneyland et complexe hôtelier',
    color: '#F8B739',
    polygon: [
      { lat: 48.875, lng: 2.770 },
      { lat: 48.875, lng: 2.790 },
      { lat: 48.860, lng: 2.790 },
      { lat: 48.860, lng: 2.770 }
    ]
  },
  {
    id: 'zone-versailles',
    name: 'Versailles',
    description: 'Château de Versailles et centre-ville',
    color: '#52B788',
    polygon: [
      { lat: 48.810, lng: 2.115 },
      { lat: 48.810, lng: 2.145 },
      { lat: 48.795, lng: 2.145 },
      { lat: 48.795, lng: 2.115 }
    ]
  }
]

export const PREDEFINED_ZONE_PRICINGS: Omit<ZonePricing, 'id' | 'createdAt'>[] = [
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },
  
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-cdg', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-cdg', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-cdg', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-cdg', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-orly', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-orly', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-orly', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-orly', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-orly', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-beauvais', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-beauvais', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-beauvais', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-beauvais', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-beauvais', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-beauvais', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-beauvais', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-beauvais', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-cdg', toZoneId: 'zone-la-defense', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-la-defense', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-la-defense', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-la-defense', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-cdg', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-cdg', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-cdg', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-cdg', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-gare-nord', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-nord', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-nord', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-nord', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-nord', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-nord', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-nord', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-nord', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-gare-lyon', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-lyon', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-lyon', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-lyon', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-lyon', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-lyon', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-lyon', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-lyon', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-gare-montparnasse', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-montparnasse', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-montparnasse', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-gare-montparnasse', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-montparnasse', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-montparnasse', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-montparnasse', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-gare-montparnasse', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-cdg', toZoneId: 'zone-disneyland', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-disneyland', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-disneyland', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-disneyland', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-cdg', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-cdg', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-cdg', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-cdg', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-disneyland', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-disneyland', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-disneyland', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-disneyland', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-disneyland', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-versailles', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-versailles', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-versailles', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-versailles', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-versailles', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-cdg', toZoneId: 'zone-orly', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-orly', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-orly', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-orly', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-orly', toZoneId: 'zone-cdg', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-cdg', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-cdg', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-cdg', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-paris-centre', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-paris-centre', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-paris-centre', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-la-defense', toZoneId: 'zone-paris-centre', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-la-defense', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-la-defense', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-la-defense', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-paris-centre', toZoneId: 'zone-la-defense', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-cdg', toZoneId: 'zone-versailles', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-versailles', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-versailles', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-cdg', toZoneId: 'zone-versailles', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-versailles', toZoneId: 'zone-cdg', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-cdg', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-cdg', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-cdg', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-orly', toZoneId: 'zone-versailles', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-versailles', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-versailles', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-orly', toZoneId: 'zone-versailles', vehicleId: 'first', fixedPrice: 0 },

  { fromZoneId: 'zone-versailles', toZoneId: 'zone-orly', vehicleId: 'berline', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-orly', vehicleId: 'business', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-orly', vehicleId: 'van', fixedPrice: 0 },
  { fromZoneId: 'zone-versailles', toZoneId: 'zone-orly', vehicleId: 'first', fixedPrice: 0 }
]
