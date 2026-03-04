export type Currency = 'USD' | 'EUR' | 'SEK' | 'GBP' | 'NOK' | 'DKK' | 'CHF';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Season = 'all' | 'summer' | 'winter' | 'spring' | 'fall';

export interface PricingRule {
  id: string;
  club_id: string;
  court_id: string | null; // null = applies to all courts in club
  name: string;
  days: DayOfWeek[]; // which days this rule applies
  start_hour: number; // 0-23
  start_minute: number; // 0-59
  end_hour: number; // 0-23
  end_minute: number; // 0-59
  price: number; // in cents: 5000 = $50.00
  season: Season;
  priority: number; // higher = takes precedence
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePricingRuleInput {
  club_id: string;
  court_id: string | null;
  name: string;
  days: DayOfWeek[];
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  price: number;
  season: Season;
  priority: number;
}

export interface PricingTemplate {
  id: string;
  name: string;
  description: string;
  court_types: string[]; // e.g., ['tennis_indoor_hard', 'padel_indoor']
  rules: Omit<PricingRule, 'id' | 'club_id' | 'court_id' | 'created_at' | 'updated_at'>[];
  is_default: boolean;
}

export interface BookingPriceDetail {
  base_price: number; // from rule
  rule_id: string;
  rule_name: string;
  season: Season;
  currency: Currency;
  final_price: number; // after adjustments (if any)
}

const dayOfWeekMap: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

// Mock pricing rules storage
// eslint-disable-next-line prefer-const
export let MOCK_PRICING_RULES: PricingRule[] = [
  // Downtown Tennis Club (club-001) - Morning off-peak
  {
    id: 'rule-001',
    club_id: 'club-001',
    court_id: null, // applies to all courts
    name: 'Morning Off-Peak',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_hour: 8,
    start_minute: 0,
    end_hour: 12,
    end_minute: 0,
    price: 3500, // $35
    season: 'all',
    priority: 10,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  // Downtown Tennis Club - Midday standard
  {
    id: 'rule-002',
    club_id: 'club-001',
    court_id: null,
    name: 'Midday Standard',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_hour: 12,
    start_minute: 0,
    end_hour: 17,
    end_minute: 0,
    price: 5000, // $50
    season: 'all',
    priority: 20,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  // Downtown Tennis Club - Evening peak
  {
    id: 'rule-003',
    club_id: 'club-001',
    court_id: null,
    name: 'Evening Peak',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_hour: 17,
    start_minute: 0,
    end_hour: 22,
    end_minute: 0,
    price: 7500, // $75
    season: 'all',
    priority: 30,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  // Downtown Tennis Club - Late night
  {
    id: 'rule-004',
    club_id: 'club-001',
    court_id: null,
    name: 'Late Night',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_hour: 22,
    start_minute: 0,
    end_hour: 23,
    end_minute: 59,
    price: 4000, // $40
    season: 'all',
    priority: 15,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  // Downtown Tennis Club - Weekend
  {
    id: 'rule-005',
    club_id: 'club-001',
    court_id: null,
    name: 'Weekend All-Day',
    days: ['saturday', 'sunday'],
    start_hour: 8,
    start_minute: 0,
    end_hour: 23,
    end_minute: 59,
    price: 6000, // $60
    season: 'all',
    priority: 25,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  // Downtown Tennis Club - Summer premium
  {
    id: 'rule-006',
    club_id: 'club-001',
    court_id: null,
    name: 'Summer Premium',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    start_hour: 0,
    start_minute: 0,
    end_hour: 23,
    end_minute: 59,
    price: 9000, // Base price + $15 = $90 for peak hours
    season: 'summer',
    priority: 40,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },

  // Padel Paradise (club-002) - Simple flat rate with weekend premium
  {
    id: 'rule-007',
    club_id: 'club-002',
    court_id: null,
    name: 'Weekday Standard',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_hour: 0,
    start_minute: 0,
    end_hour: 23,
    end_minute: 59,
    price: 4500, // $45
    season: 'all',
    priority: 10,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'rule-008',
    club_id: 'club-002',
    court_id: null,
    name: 'Weekend Premium',
    days: ['saturday', 'sunday'],
    start_hour: 0,
    start_minute: 0,
    end_hour: 23,
    end_minute: 59,
    price: 5500, // $55
    season: 'all',
    priority: 20,
    is_active: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  }
];

// Pricing templates (suggestions for clubs)
export const PRICING_TEMPLATES: PricingTemplate[] = [
  {
    id: 'template-001',
    name: 'Peak/Off-Peak (Standard Tennis)',
    description: 'Best for indoor hard/clay courts with predictable demand',
    court_types: ['tennis_indoor_hard', 'tennis_indoor_clay'],
    rules: [
      {
        name: 'Off-Peak',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start_hour: 6,
        start_minute: 0,
        end_hour: 10,
        end_minute: 0,
        price: 3500,
        season: 'all',
        priority: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Standard',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start_hour: 10,
        start_minute: 0,
        end_hour: 17,
        end_minute: 0,
        price: 5000,
        season: 'all',
        priority: 20,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Peak Hours',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start_hour: 17,
        start_minute: 0,
        end_hour: 22,
        end_minute: 0,
        price: 7500,
        season: 'all',
        priority: 30,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Weekend',
        days: ['saturday', 'sunday'],
        start_hour: 0,
        start_minute: 0,
        end_hour: 23,
        end_minute: 59,
        price: 6000,
        season: 'all',
        priority: 25,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    is_default: true
  },
  {
    id: 'template-002',
    name: 'Simple Flat Rate',
    description: 'Best for new clubs or predictable demand',
    court_types: ['padel_indoor', 'padel_outdoor'],
    rules: [
      {
        name: 'Standard Rate',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        start_hour: 0,
        start_minute: 0,
        end_hour: 23,
        end_minute: 59,
        price: 5000,
        season: 'all',
        priority: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    is_default: false
  }
];

// CRUD Operations
export function createPricingRule(input: CreatePricingRuleInput): PricingRule {
  const id = `rule-${Date.now()}`;
  const rule: PricingRule = {
    id,
    ...input,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_PRICING_RULES.push(rule);
  return rule;
}

export function getPricingRuleById(id: string): PricingRule | undefined {
  return MOCK_PRICING_RULES.find(r => r.id === id);
}

export function getPricingRulesByClub(clubId: string): PricingRule[] {
  return MOCK_PRICING_RULES.filter(r => r.club_id === clubId && r.is_active).sort(
    (a, b) => b.priority - a.priority
  );
}

export function updatePricingRule(id: string, updates: Partial<CreatePricingRuleInput>): PricingRule | null {
  const rule = getPricingRuleById(id);
  if (!rule) return null;

  Object.assign(rule, updates, { updated_at: new Date().toISOString() });
  return rule;
}

export function deletePricingRule(id: string): boolean {
  const index = MOCK_PRICING_RULES.findIndex(r => r.id === id);
  if (index === -1) return false;

  MOCK_PRICING_RULES.splice(index, 1);
  return true;
}

export function togglePricingRuleActive(id: string): PricingRule | null {
  const rule = getPricingRuleById(id);
  if (!rule) return null;

  rule.is_active = !rule.is_active;
  rule.updated_at = new Date().toISOString();
  return rule;
}

// Calculate price for a specific booking time
export function calculateBookingPrice(
  clubId: string,
  courtId: string,
  bookingDate: string,
  startTime: string,
  _endTime: string
): BookingPriceDetail | null {
  const rules = getPricingRulesByClub(clubId);

  if (rules.length === 0) {
    return null; // No pricing rules configured
  }

  // Parse booking date and time
  const date = new Date(bookingDate);
  const dayOfWeek = Object.keys(dayOfWeekMap).find(key => dayOfWeekMap[key as DayOfWeek] === date.getDay()) as DayOfWeek;

  // Get current season (simplified: based on month)
  const month = date.getMonth();
  let season: Season = 'all';
  if (month >= 4 && month <= 7) season = 'summer';
  else if (month >= 11 || month <= 2) season = 'winter';
  else if (month === 2 || month === 3) season = 'spring';
  else if (month === 8 || month === 9) season = 'fall';

  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);

  // Find matching rule (highest priority that matches)
  for (const rule of rules) {
    // Check if rule applies to this court (null = all courts, or specific court)
    if (rule.court_id !== null && rule.court_id !== courtId) continue;

    // Check if rule applies to this day
    if (!rule.days.includes(dayOfWeek)) continue;

    // Check if rule applies to this season (season 'all' matches everything)
    if (rule.season !== 'all' && rule.season !== season) continue;

    // Check if rule applies to this time
    const startMinutes = rule.start_hour * 60 + rule.start_minute;
    const endMinutes = rule.end_hour * 60 + rule.end_minute;
    const bookingMinutes = startHour * 60 + startMinute;

    if (bookingMinutes >= startMinutes && bookingMinutes < endMinutes) {
      // Found matching rule
      return {
        base_price: rule.price,
        rule_id: rule.id,
        rule_name: rule.name,
        season,
        currency: 'SEK', // TODO: get from club object
        final_price: rule.price
      };
    }
  }

  return null; // No matching rule found
}

export function validatePricingRuleInput(input: CreatePricingRuleInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Rule name must be at least 2 characters');
  }

  if (!input.days || input.days.length === 0) {
    errors.push('At least one day must be selected');
  }

  if (input.start_hour < 0 || input.start_hour > 23) {
    errors.push('Start hour must be between 0 and 23');
  }

  if (input.end_hour < 0 || input.end_hour > 23) {
    errors.push('End hour must be between 0 and 23');
  }

  if (input.start_hour > input.end_hour) {
    errors.push('Start time cannot be after end time');
  }

  if (input.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (input.priority < 0 || input.priority > 100) {
    errors.push('Priority must be between 0 and 100');
  }

  return errors;
}

export function getAllPricingRules(): PricingRule[] {
  return MOCK_PRICING_RULES;
}
