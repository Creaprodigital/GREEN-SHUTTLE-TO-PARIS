export interface ImageSettings {
  fit: 'cover' | 'contain' | 'fill'
  positionX: number
  positionY: number
}

export interface VehicleClass {
  id: string
  title: string
  description: string
  image: string
  imageSettings?: ImageSettings
  order: number
}

export const DEFAULT_FLEET: VehicleClass[] = [
  {
    id: 'business',
    title: 'BUSINESS CLASS',
    description: 'Berline premium confortable pour vos déplacements professionnels et personnels. Idéale pour 1 à 3 passagers avec bagages.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 1
  },
  {
    id: 'first',
    title: 'FIRST CLASS',
    description: 'SUV de luxe spacieux et raffiné. Le summum du confort et de l\'élégance pour une expérience premium.',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 40
    },
    order: 2
  },
  {
    id: 'van',
    title: 'VAN CLASS',
    description: 'Van premium spacieux jusqu\'à 7 passagers. Parfait pour les groupes, familles et déplacements avec bagages volumineux.',
    image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 3
  },
  {
    id: 'luxury-sedan',
    title: 'LUXURY SEDAN',
    description: 'Mercedes Classe S ou équivalent. Luxe absolu avec sièges en cuir, système audio premium et toutes les technologies de confort.',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 45
    },
    order: 4
  },
  {
    id: 'executive-suv',
    title: 'EXECUTIVE SUV',
    description: 'BMW X7, Audi Q7 ou Range Rover. Espace et prestige combinés pour un voyage exceptionnel jusqu\'à 6 passagers.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 5
  },
  {
    id: 'prestige',
    title: 'PRESTIGE CLASS',
    description: 'Véhicules d\'exception : BMW Série 7, Audi A8. Pour les clients exigeants recherchant l\'excellence et le raffinement ultime.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 6
  },
  {
    id: 'minibus',
    title: 'MINIBUS PREMIUM',
    description: 'Mercedes Sprinter ou Vito aménagé luxe. Jusqu\'à 8 passagers avec espace bagages. Idéal pour groupes et événements.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 7
  },
  {
    id: 'electric-luxury',
    title: 'ELECTRIC LUXURY',
    description: 'Tesla Model S ou équivalent électrique premium. Transport écologique sans compromis sur le luxe et les performances.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 50
    },
    order: 8
  },
  {
    id: 'wedding-luxury',
    title: 'WEDDING CLASS',
    description: 'Véhicules de prestige pour mariages : Rolls-Royce, Bentley ou Mercedes Maybach. Élégance intemporelle pour votre jour unique.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    imageSettings: {
      fit: 'cover',
      positionX: 50,
      positionY: 45
    },
    order: 9
  }
]
