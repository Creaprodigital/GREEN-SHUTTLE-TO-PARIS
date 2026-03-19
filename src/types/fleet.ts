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
    order: 1
  },
  {
    id: 'first',
    title: 'FIRST CLASS',
    description: 'SUV de luxe spacieux et raffiné. Le summum du confort et de l\'élégance pour une expérience premium.',
    image: '',
    order: 2
  },
  {
    id: 'van',
    title: 'VAN CLASS',
    description: 'Van premium spacieux jusqu\'à 7 passagers. Parfait pour les groupes, familles et déplacements avec bagages volumineux.',
    image: '',
    order: 3
  }
]
