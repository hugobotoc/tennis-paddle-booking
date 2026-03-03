import { MOCK_PADDLES, type Paddle } from './paddles';

export interface CreatePaddleInput {
  name: string;
  brand: string;
  model: string;
  description: string;
  weight: string;
  grip_type: string;
  material: string;
  frame_thickness: string;
  price_per_hour: number;
  condition: 'excellent' | 'good' | 'fair';
  available_now: boolean;
  image_url: string;
}

export interface EditPaddleInput extends CreatePaddleInput {
  id: string;
}

export function getAllPaddles(): Paddle[] {
  return [...MOCK_PADDLES];
}

export function getPaddleById(id: string): Paddle | undefined {
  return MOCK_PADDLES.find(p => p.id === id);
}

export function createPaddle(input: CreatePaddleInput): Paddle {
  if (!input.name || !input.brand) {
    throw new Error('Name and brand are required');
  }
  if (input.price_per_hour < 0) {
    throw new Error('Price must be non-negative');
  }

  const newPaddle: Paddle = {
    id: `paddle-${Date.now()}`,
    ...input,
    avg_rating: 0
  };

  MOCK_PADDLES.push(newPaddle);
  console.log('[Paddle Created]', newPaddle);
  return newPaddle;
}

export function updatePaddle(id: string, input: CreatePaddleInput): Paddle {
  const paddle = MOCK_PADDLES.find(p => p.id === id);
  if (!paddle) {
    throw new Error('Paddle not found');
  }

  if (!input.name || !input.brand) {
    throw new Error('Name and brand are required');
  }
  if (input.price_per_hour < 0) {
    throw new Error('Price must be non-negative');
  }

  Object.assign(paddle, input);
  console.log('[Paddle Updated]', paddle);
  return paddle;
}

export function deletePaddle(id: string): boolean {
  const index = MOCK_PADDLES.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Paddle not found');
  }

  MOCK_PADDLES.splice(index, 1);
  console.log('[Paddle Deleted]', id);
  return true;
}

export function validatePaddleInput(input: Partial<CreatePaddleInput>): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim() === '') {
    errors.push('Paddle name is required');
  }
  if (!input.brand || input.brand.trim() === '') {
    errors.push('Brand is required');
  }
  if (!input.price_per_hour || input.price_per_hour < 0) {
    errors.push('Price must be a positive number');
  }
  if (!input.condition || !['excellent', 'good', 'fair'].includes(input.condition)) {
    errors.push('Condition must be excellent, good, or fair');
  }

  return errors;
}
