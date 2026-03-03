import { MOCK_COURTS, type Court } from '$lib/data/courts';

export interface CreateCourtInput {
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

export interface EditCourtInput extends CreateCourtInput {
  id: string;
}

export function getAllCourts(): Court[] {
  return [...MOCK_COURTS];
}

export function getCourtById(id: string): Court | undefined {
  return MOCK_COURTS.find(p => p.id === id);
}

export function createCourt(input: CreateCourtInput): Court {
  if (!input.name || !input.location) {
    throw new Error('Name and location are required');
  }
  if (input.hourly_rate < 0) {
    throw new Error('Hourly rate must be non-negative');
  }

  const newCourt: Court = {
    id: `court-${Date.now()}`,
    ...input
  };

  MOCK_COURTS.push(newCourt);
  console.log('[Court Created]', newCourt);
  return newCourt;
}

export function updateCourt(id: string, input: CreateCourtInput): Court {
  const court = MOCK_COURTS.find(p => p.id === id);
  if (!court) {
    throw new Error('Court not found');
  }

  if (!input.name || !input.location) {
    throw new Error('Name and location are required');
  }
  if (input.hourly_rate < 0) {
    throw new Error('Hourly rate must be non-negative');
  }

  Object.assign(court, input);
  console.log('[Court Updated]', court);
  return court;
}

export function deleteCourt(id: string): boolean {
  const index = MOCK_COURTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Court not found');
  }

  MOCK_COURTS.splice(index, 1);
  console.log('[Court Deleted]', id);
  return true;
}

export function validateCourtInput(input: Partial<CreateCourtInput>): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim() === '') {
    errors.push('Court name is required');
  }
  if (!input.location || input.location.trim() === '') {
    errors.push('Location is required');
  }
  if (!input.hourly_rate || input.hourly_rate < 0) {
    errors.push('Hourly rate must be a positive number');
  }
  if (!input.type || !['tennis', 'padel'].includes(input.type)) {
    errors.push('Type must be tennis or padel');
  }

  return errors;
}
