import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
  createClub,
  authenticateClub,
  validateClubSignup,
  getClubById,
  updateClubProfile,
  type ClubSignupInput
} from '$lib/data/clubs';

export const POST: RequestHandler = async ({ request, url }) => {
  const path = url.pathname;

  // POST /api/club/signup
  if (path === '/api/club/signup') {
    try {
      const body = await request.json();
      const input: ClubSignupInput = {
        name: body.name,
        email: body.email,
        password: body.password,
        phone: body.phone,
        location: body.location,
        city: body.city,
        currency: body.currency || 'SEK'
      };

      // Validate input
      const errors = validateClubSignup(input);
      if (errors.length > 0) {
        return json({ message: errors[0], errors }, { status: 400 });
      }

      // Create club
      const club = createClub(input);

      // Return club (without password hash)
      return json(
        {
          id: club.id,
          name: club.name,
          email: club.email,
          phone: club.phone,
          location: club.location,
          city: club.city,
          currency: club.currency,
          currency_symbol: club.currency_symbol,
          subscription_tier: club.subscription_tier
        },
        { status: 201 }
      );
    } catch (error) {
      return json(
        { message: error instanceof Error ? error.message : 'Signup failed' },
        { status: 500 }
      );
    }
  }

  // POST /api/club/login
  if (path === '/api/club/login') {
    try {
      const body = await request.json();
      const club = authenticateClub(body.email, body.password);

      if (!club) {
        return json({ message: 'Invalid email or password' }, { status: 401 });
      }

      // Return club (without password hash)
      return json({
        id: club.id,
        name: club.name,
        email: club.email,
        phone: club.phone,
        location: club.location,
        city: club.city,
        currency: club.currency,
        currency_symbol: club.currency_symbol,
        subscription_tier: club.subscription_tier,
        booker_visibility: club.booker_visibility
      });
    } catch (error) {
      return json(
        { message: error instanceof Error ? error.message : 'Login failed' },
        { status: 500 }
      );
    }
  }

  // POST /api/club/logout
  if (path === '/api/club/logout') {
    return json({ message: 'Logged out' });
  }

  return json({ message: 'Not found' }, { status: 404 });
};

export const GET: RequestHandler = async ({ url }) => {
  const pathParts = url.pathname.split('/');
  const clubId = pathParts[3]; // /api/club/{clubId}

  if (!clubId || clubId === 'signup' || clubId === 'login' || clubId === 'logout') {
    return json({ message: 'Not found' }, { status: 404 });
  }

  try {
    const club = getClubById(clubId);

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

export const PUT: RequestHandler = async ({ request, url }) => {
  const pathParts = url.pathname.split('/');
  const clubId = pathParts[3]; // /api/club/{clubId}

  if (!clubId) {
    return json({ message: 'Club ID required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = updateClubProfile(clubId, body);

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
