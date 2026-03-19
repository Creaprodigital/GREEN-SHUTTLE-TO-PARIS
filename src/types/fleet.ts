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
    id: 'berline',
    title: 'BERLINE',
    description: 'Berline confortable pour vos déplacements professionnels et personnels. Idéale pour 1 à 3 passagers avec bagages.',
    image: '',
    order: 1
  },
  {
    id: 'van',
    title: 'VAN',
    description: 'Van spacieux jusqu\'à 7 passagers. Parfait pour les groupes, familles et déplacements avec bagages volumineux.',
    image: '',
    order: 2
  },
  {
    id: 'business',
    title: 'BUSINESS CLASS',
    description: 'Véhicule haut de gamme pour vos rendez-vous d\'affaires. Confort et élégance pour une expérience premium.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    order: 3
  },
  {
    id: 'first',
    title: 'FIRST CLASS',
    description: 'Le summum du luxe et du raffinement. Service VIP avec véhicules d\'exception pour une expérience inoubliable.',
    image: '',
    order: 4
  }
]
