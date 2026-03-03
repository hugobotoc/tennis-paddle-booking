export interface Court {
  id: string;
  name: string;
  location: string;
  type: 'tennis' | 'padel';
  surface: string;
  hourly_rate: number;
  total_slots: number;
  available_now: boolean;
  image_url: string;
  description: string;
}

export const MOCK_COURTS: Court[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Central Court 1',
    location: '123 Sports Lane, Downtown',
    type: 'tennis',
    surface: 'Hard Court',
    hourly_rate: 25,
    total_slots: 8,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Tennis+Court+1',
    description: 'Professional tennis court with LED lighting'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Central Court 2',
    location: '123 Sports Lane, Downtown',
    type: 'tennis',
    surface: 'Clay',
    hourly_rate: 30,
    total_slots: 8,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Tennis+Court+2',
    description: 'Premium clay court for advanced players'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Padel Court A',
    location: '456 Racket Avenue, Midtown',
    type: 'padel',
    surface: 'Synthetic',
    hourly_rate: 20,
    total_slots: 10,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Padel+Court+A',
    description: 'Modern padel court with wall protection'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Padel Court B',
    location: '456 Racket Avenue, Midtown',
    type: 'padel',
    surface: 'Synthetic',
    hourly_rate: 20,
    total_slots: 10,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Padel+Court+B',
    description: 'Modern padel court with wall protection'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Sunset Court',
    location: '789 Valley Road, Suburbs',
    type: 'tennis',
    surface: 'Grass',
    hourly_rate: 35,
    total_slots: 6,
    available_now: false,
    image_url: 'https://via.placeholder.com/400x300?text=Grass+Court',
    description: 'Premium grass court (seasonal availability)'
  }
];

export function getCourtById(id: string): Court | undefined {
  return MOCK_COURTS.find(c => c.id === id);
}

export function getCourtsByType(type: 'tennis' | 'padel'): Court[] {
  return MOCK_COURTS.filter(c => c.type === type);
}

export function getAllCourts(): Court[] {
  return [...MOCK_COURTS];
}
