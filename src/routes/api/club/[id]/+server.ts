import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getClubById, updateClubProfile } from '$lib/data/clubs';

// GET /api/club/{id} - Fetch club profile
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ message: 'Club ID required' }, { status: 400 });
    }

    const club = getClubById(id);

    if (!club) {
      return json({ message: 'Club not found' }, { status: 404 });
    }

    return json({
      id: club.id,
      name: club.name,
      email: club.email,
      phone: club.phone,
      location: club.location,
      city: club.city,
      logo_url: club.logo_url,
      description: club.description,
      currency: club.currency,
      currency_symbol: club.currency_symbol,
      subscription_tier: club.subscription_tier,
      booker_visibility: club.booker_visibility,
      created_at: club.created_at,
      updated_at: club.updated_at
    });
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Failed to fetch club' },
      { status: 500 }
    );
  }
};

// PUT /api/club/{id} - Update club profile
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ message: 'Club ID required' }, { status: 400 });
    }

    const body = await request.json();
    const updated = updateClubProfile(id, body);

    if (!updated) {
      return json({ message: 'Club not found' }, { status: 404 });
    }

    return json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      location: updated.location,
      city: updated.city,
      logo_url: updated.logo_url,
      description: updated.description,
      currency: updated.currency,
      currency_symbol: updated.currency_symbol,
      subscription_tier: updated.subscription_tier,
      booker_visibility: updated.booker_visibility,
      updated_at: updated.updated_at
    });
  } catch (error) {
    return json(
      { message: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
};
