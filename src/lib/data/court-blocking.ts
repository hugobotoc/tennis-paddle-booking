export type BlockType = 'maintenance' | 'event' | 'special_occasion' | 'holiday';
export type Recurrence = 'none' | 'weekly' | 'monthly' | 'yearly';

export interface CourtBlock {
  id: string;
  club_id: string;
  court_id: string | null; // null = all courts in club
  name: string;
  description: string;
  block_type: BlockType;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  recurrence: Recurrence;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  reason: string;
  created_by: string; // club admin or system
}

export interface CreateCourtBlockInput {
  club_id: string;
  court_id: string | null;
  name: string;
  description: string;
  block_type: BlockType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  recurrence: Recurrence;
  reason: string;
  created_by: string;
}

// Mock storage
// eslint-disable-next-line prefer-const
export let MOCK_COURT_BLOCKS: CourtBlock[] = [
  // Downtown Tennis Club - Maintenance
  {
    id: 'block-001',
    club_id: 'club-001',
    court_id: null,
    name: 'Court Maintenance',
    description: 'Annual maintenance for all courts',
    block_type: 'maintenance',
    start_date: '2026-03-15',
    end_date: '2026-03-15',
    start_time: '08:00',
    end_time: '12:00',
    recurrence: 'none',
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
    reason: 'Annual maintenance',
    created_by: 'admin@downtowntennisclub.com'
  },
  // Downtown Tennis Club - Special Event
  {
    id: 'block-002',
    club_id: 'club-001',
    court_id: 'court-001',
    name: 'Tournament Day',
    description: 'Weekly tennis tournament',
    block_type: 'event',
    start_date: '2026-03-05',
    end_date: '2026-03-05',
    start_time: '14:00',
    end_time: '18:00',
    recurrence: 'weekly',
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
    reason: 'Weekly tournament',
    created_by: 'admin@downtowntennisclub.com'
  },
  // Padel Paradise - Holiday
  {
    id: 'block-003',
    club_id: 'club-002',
    court_id: null,
    name: 'Christmas Holiday',
    description: 'Closed for Christmas',
    block_type: 'holiday',
    start_date: '2026-12-25',
    end_date: '2026-12-25',
    start_time: '00:00',
    end_time: '23:59',
    recurrence: 'none',
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
    reason: 'Christmas closure',
    created_by: 'admin@padelparadise.com'
  }
];

// CRUD Operations
export function createCourtBlock(input: CreateCourtBlockInput): CourtBlock {
  const id = `block-${Date.now()}`;
  const block: CourtBlock = {
    id,
    ...input,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_COURT_BLOCKS.push(block);
  return block;
}

export function getCourtBlockById(id: string): CourtBlock | undefined {
  return MOCK_COURT_BLOCKS.find(b => b.id === id);
}

export function getCourtBlocksByClub(clubId: string): CourtBlock[] {
  return MOCK_COURT_BLOCKS.filter(b => b.club_id === clubId && b.is_active);
}

export function updateCourtBlock(id: string, updates: Partial<CreateCourtBlockInput>): CourtBlock | null {
  const block = getCourtBlockById(id);
  if (!block) return null;

  Object.assign(block, updates, { updated_at: new Date().toISOString() });
  return block;
}

export function deleteCourtBlock(id: string): boolean {
  const index = MOCK_COURT_BLOCKS.findIndex(b => b.id === id);
  if (index === -1) return false;

  MOCK_COURT_BLOCKS.splice(index, 1);
  return true;
}

export function toggleCourtBlockActive(id: string): CourtBlock | null {
  const block = getCourtBlockById(id);
  if (!block) return null;

  block.is_active = !block.is_active;
  block.updated_at = new Date().toISOString();
  return block;
}

// Check if a court is blocked at a specific time
export function isCourtBlocked(
  clubId: string,
  courtId: string,
  date: string, // YYYY-MM-DD
  startTime: string, // HH:MM
  endTime: string // HH:MM
): CourtBlock | null {
  const blocks = getCourtBlocksByClub(clubId);

  for (const block of blocks) {
    // Check if block applies to this court (null = all courts, or specific court)
    if (block.court_id !== null && block.court_id !== courtId) continue;

    // Check if block date range includes the booking date
    if (date < block.start_date || date > block.end_date) continue;

    // Check if block time range overlaps with booking time range
    const blockStart = `${block.start_date}T${block.start_time}:00`;
    const blockEnd = `${block.end_date}T${block.end_time}:00`;
    const bookingStart = `${date}T${startTime}:00`;
    const bookingEnd = `${date}T${endTime}:00`;

    // If booking starts before block ends AND booking ends after block starts
    if (bookingStart < blockEnd && bookingEnd > blockStart) {
      return block;
    }
  }

  return null;
}

export function validateCourtBlockInput(input: CreateCourtBlockInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Block name must be at least 2 characters');
  }

  if (!input.start_date) {
    errors.push('Start date is required');
  }

  if (!input.end_date) {
    errors.push('End date is required');
  }

  if (input.start_date > input.end_date) {
    errors.push('Start date cannot be after end date');
  }

  if (!input.start_time || !input.end_time) {
    errors.push('Start and end times are required');
  }

  if (input.start_time >= input.end_time) {
    errors.push('Start time cannot be after or equal to end time');
  }

  if (!input.reason || input.reason.trim().length < 5) {
    errors.push('Reason must be at least 5 characters');
  }

  return errors;
}

export function getAllCourtBlocks(): CourtBlock[] {
  return MOCK_COURT_BLOCKS;
}
