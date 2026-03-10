export interface VehiclePricing {
  vehicleId: string
  pricePerKm: number
  pricePerMinute: number
  pricePerHour: number
  tourBasePrice: number
  minimumTransferPrice?: number
  lowSeasonPricePerKm?: number
  lowSeasonPricePerMinute?: number
  lowSeasonPricePerHour?: number
  lowSeasonTourBasePrice?: number
  lowSeasonMinimumTransferPrice?: number
}

export interface PricingSettings {
  roundToWholeEuro: boolean
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
    vehicleId: 'eco',
    pricePerKm: 1.5,
    pricePerMinute: 0.5,
    pricePerHour: 30,
    tourBasePrice: 150,
    minimumTransferPrice: 40,
    lowSeasonPricePerKm: 1.2,
    lowSeasonPricePerMinute: 0.4,
    lowSeasonPricePerHour: 25,
    lowSeasonTourBasePrice: 120,
    lowSeasonMinimumTransferPrice: 35
  },
  {
    vehicleId: 'business',
    pricePerKm: 2.0,
    pricePerMinute: 0.8,
    pricePerHour: 45,
    tourBasePrice: 250,
    minimumTransferPrice: 60,
    lowSeasonPricePerKm: 1.6,
    lowSeasonPricePerMinute: 0.65,
    lowSeasonPricePerHour: 38,
    lowSeasonTourBasePrice: 200,
    lowSeasonMinimumTransferPrice: 50
  },
  {
    vehicleId: 'van',
    pricePerKm: 2.5,
    pricePerMinute: 1.0,
    pricePerHour: 55,
    tourBasePrice: 300,
    minimumTransferPrice: 75,
    lowSeasonPricePerKm: 2.0,
    lowSeasonPricePerMinute: 0.85,
    lowSeasonPricePerHour: 45,
    lowSeasonTourBasePrice: 240,
    lowSeasonMinimumTransferPrice: 60
  },
  {
    vehicleId: 'first',
    pricePerKm: 3.5,
    pricePerMinute: 1.5,
    pricePerHour: 80,
    tourBasePrice: 500,
    minimumTransferPrice: 100,
    lowSeasonPricePerKm: 2.8,
    lowSeasonPricePerMinute: 1.2,
    lowSeasonPricePerHour: 65,
    lowSeasonTourBasePrice: 400,
    lowSeasonMinimumTransferPrice: 80
  }
]

export const DEFAULT_OPTIONS: ServiceOption[] = [
  {
    id: 'child-seat',
    name: 'Siège Enfant',
    description: 'Siège auto pour enfant (précisez l\'âge)',
    price: 10
  },
  {
    id: 'booster-seat',
    name: 'Rehausseur',
    description: 'Rehausseur pour enfant',
    price: 8
  },
  {
    id: 'water-bottles',
    name: 'Bouteilles d\'eau',
    description: 'Pack de bouteilles d\'eau',
    price: 5
  },
  {
    id: 'wifi',
    name: 'Wi-Fi à bord',
    description: 'Connexion Wi-Fi pendant le trajet',
    price: 15
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
