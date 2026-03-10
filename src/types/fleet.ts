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
    id: 'eco',
    title: 'ECO',
    description: 'Confortable et économique, parfait pour vos trajets quotidiens en ville.',
    image: '',
    order: 1
  },
  {
    id: 'business',
    title: 'BUSINESS CLASS',
    description: 'Élégance et confort pour vos déplacements professionnels.',
    image: '',
    order: 2
  },
  {
    id: 'van',
    title: 'VAN CLASS',
    description: 'Spacieux et pratique pour les groupes et les familles.',
    image: '',
    order: 3
  },
  {
    id: 'first',
    title: 'FIRST CLASS',
    description: 'Le summum du luxe et du raffinement pour une expérience exceptionnelle.',
    image: '',
    order: 4
  }
]
