export type CourtType = 
  | 'tennis_indoor_hard'
  | 'tennis_indoor_clay'
  | 'tennis_outdoor_hard'
  | 'tennis_outdoor_clay'
  | 'padel_indoor'
  | 'padel_outdoor';

export interface Court {
  id: string;
  club_id: string; // NEW: belongs to a club
  name: string;
  location: string;
  court_type: CourtType; // NEW: detailed type
  surface: string;
  total_slots: number;
  available_now: boolean;
  image_url: string;
  description: string;
}

export interface CreateCourtInput {
  club_id: string; // NEW
  name: string;
  location: string;
  court_type: CourtType; // NEW
  surface: string;
  total_slots: number;
  description: string;
}

// eslint-disable-next-line prefer-const
export let MOCK_COURTS: Court[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    club_id: 'club-001', // Downtown Tennis Club
    name: 'Central Court 1',
    location: '123 Sports Lane, Downtown',
    court_type: 'tennis_indoor_hard',
    surface: 'Hard Court (acrylic)',
    total_slots: 8,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Tennis+Court+1',
    description: 'Professional tennis court with LED lighting'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    club_id: 'club-001', // Downtown Tennis Club
    name: 'Central Court 2',
    location: '123 Sports Lane, Downtown',
    court_type: 'tennis_indoor_clay',
    surface: 'Synthetic Clay',
    total_slots: 8,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Tennis+Court+2',
    description: 'Premium clay court for advanced players'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    club_id: 'club-002', // Padel Paradise
    name: 'Padel Court A',
    location: '456 Racket Avenue, Midtown',
    court_type: 'padel_indoor',
    surface: 'Synthetic Grass with walls',
    total_slots: 10,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Padel+Court+A',
    description: 'Modern padel court with wall protection'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    club_id: 'club-002', // Padel Paradise
    name: 'Padel Court B',
    location: '456 Racket Avenue, Midtown',
    court_type: 'padel_indoor',
    surface: 'Synthetic Grass with walls',
    total_slots: 10,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Padel+Court+B',
    description: 'Modern padel court with wall protection'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    club_id: 'club-001', // Downtown Tennis Club
    name: 'Sunset Court',
    location: '789 Valley Road, Suburbs',
    court_type: 'tennis_outdoor_clay',
    surface: 'Red Clay',
    total_slots: 6,
    available_now: false,
    image_url: 'https://via.placeholder.com/400x300?text=Grass+Court',
    description: 'Premium clay court (seasonal availability)'
  }
];

export function getCourtById(id: string): Court | undefined {
  return MOCK_COURTS.find(c => c.id === id);
}

export function getCourtsByType(type: string): Court[] {
  return MOCK_COURTS.filter(c => {
    if (type === 'tennis') return c.court_type.startsWith('tennis_');
    if (type === 'padel') return c.court_type.startsWith('padel_');
    return c.court_type === type;
  });
}

export function getCourtsByClub(clubId: string): Court[] {
  return MOCK_COURTS.filter(c => c.club_id === clubId);
}

export function getAllCourts(): Court[] {
  return [...MOCK_COURTS];
}

export function createCourt(input: CreateCourtInput): Court {
  const newCourt: Court = {
    id: `court-${Date.now()}`,
    ...input,
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(input.name)
  };
  MOCK_COURTS.push(newCourt);
  return newCourt;
}

export function updateCourt(id: string, input: Partial<CreateCourtInput>): Court {
  const court = MOCK_COURTS.find(c => c.id === id);
  if (!court) {
    throw new Error(`Court ${id} not found`);
  }
  Object.assign(court, input);
  return court;
}

export function deleteCourt(id: string): void {
  const index = MOCK_COURTS.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Court ${id} not found`);
  }
  MOCK_COURTS.splice(index, 1);
}

export function validateCourtInput(input: Partial<CreateCourtInput>): string[] {
  const errors: string[] = [];
  if (!input.name?.trim()) errors.push('Court name is required');
  if (!input.location?.trim()) errors.push('Location is required');
  if (!input.type) errors.push('Type (tennis or padel) is required');
  if (!input.surface?.trim()) errors.push('Surface type is required');
  if (typeof input.hourly_rate !== 'number' || input.hourly_rate <= 0) errors.push('Hourly rate must be greater than 0');
  if (typeof input.total_slots !== 'number' || input.total_slots <= 0) errors.push('Total slots must be greater than 0');
  return errors;
}
