import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
  createCourtBlock,
  getCourtBlocksByClub,
  updateCourtBlock,
  deleteCourtBlock,
  toggleCourtBlockActive,
  validateCourtBlockInput
} from '$lib/data/court-blocking';

// GET /api/club/{id}/block - Fetch all blocks for a club
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ message: 'Club ID required' }, { status: 400 });
    }

    const blocks = getCourtBlocksByClub(id);

    return json(blocks);
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
};

// POST /api/club/{id}/block - Create a new block
export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ message: 'Club ID required' }, { status: 400 });
    }

    const body = await request.json();
    const input = {
      club_id: id,
      court_id: body.court_id,
      name: body.name,
      description: body.description,
      block_type: body.block_type,
      start_date: body.start_date,
      end_date: body.end_date,
      start_time: body.start_time,
      end_time: body.end_time,
      recurrence: body.recurrence,
      reason: body.reason,
      created_by: body.created_by
    };

    // Validate input
    const errors = validateCourtBlockInput(input);
    if (errors.length > 0) {
      return json({ message: errors[0], errors }, { status: 400 });
    }

    // Create block
    const block = createCourtBlock(input);

    return json(block, { status: 201 });
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to create block' },
      { status: 500 }
    );
  }
};

// PUT /api/club/{id}/block/{blockId} - Update a block
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const { id, blockId } = params;

    if (!id || !blockId) {
      return json({ message: 'Club ID and Block ID required' }, { status: 400 });
    }

    const body = await request.json();
    const updates = {
      court_id: body.court_id,
      name: body.name,
      description: body.description,
      block_type: body.block_type,
      start_date: body.start_date,
      end_date: body.end_date,
      start_time: body.start_time,
      end_time: body.end_time,
      recurrence: body.recurrence,
      reason: body.reason,
      created_by: body.created_by
    };

    // Validate input
    const errors = validateCourtBlockInput({
      club_id: id,
      ...updates
    });
    if (errors.length > 0) {
      return json({ message: errors[0], errors }, { status: 400 });
    }

    const block = updateCourtBlock(blockId, updates);
    if (!block) {
      return json({ message: 'Block not found' }, { status: 404 });
    }

    return json(block);
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to update block' },
      { status: 500 }
    );
  }
};

// DELETE /api/club/{id}/block/{blockId} - Delete a block
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id, blockId } = params;

    if (!id || !blockId) {
      return json({ message: 'Club ID and Block ID required' }, { status: 400 });
    }

    const success = deleteCourtBlock(blockId);
    if (!success) {
      return json({ message: 'Block not found' }, { status: 404 });
    }

    return json({ message: 'Block deleted successfully' });
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to delete block' },
      { status: 500 }
    );
  }
};

// PATCH /api/club/{id}/block/{blockId}/toggle - Toggle block active state
export const PATCH: RequestHandler = async ({ params }) => {
  try {
    const { id, blockId } = params;

    if (!id || !blockId) {
      return json({ message: 'Club ID and Block ID required' }, { status: 400 });
    }

    const block = toggleCourtBlockActive(blockId);
    if (!block) {
      return json({ message: 'Block not found' }, { status: 404 });
    }

    return json(block);
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to toggle block' },
      { status: 500 }
    );
  }
};
