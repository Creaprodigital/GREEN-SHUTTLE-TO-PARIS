export interface VehicleClass {
  id: string
  title: string
  description: string
  image: string
  order: number
}

export type VehicleClassType = 'eco' | 'business' | 'van' | 'first'

export const DEFAULT_FLEET: Record<VehicleClassType, VehicleClass> = {
  eco: {
    id: 'eco',
    title: 'ECO',
    description: 'Confortable et économique, parfait pour vos trajets quotidiens en ville.',
    image: '',
    order: 1
  },
  business: {
    id: 'business',
    title: 'BUSINESS CLASS',
    description: 'Élégance et confort pour vos déplacements professionnels.',
    image: '',
    order: 2
  },
  van: {
    id: 'van',
    title: 'VAN CLASS',
    description: 'Spacieux et pratique pour les groupes et les familles.',
    image: '',
    order: 3
  },
  first: {
    id: 'first',
    title: 'FIRST CLASS',
    description: 'Le summum du luxe et du raffinement pour une expérience exceptionnelle.',
    image: '',
    order: 4
  }
}
