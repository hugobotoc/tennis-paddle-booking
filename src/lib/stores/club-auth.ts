import { writable } from 'svelte/store';
import type { Club } from '$lib/data/clubs';

export const clubStore = writable<Club | null>(null);

export async function clubLogin(email: string, password: string) {
  // In production, this would be a server call
  const response = await fetch('/api/club/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const club = await response.json();
  clubStore.set(club);
  return club;
}

export async function clubSignup(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  city: string;
  currency: string;
}) {
  const response = await fetch('/api/club/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  const club = await response.json();
  clubStore.set(club);
  return club;
}

export async function clubLogout() {
  await fetch('/api/club/logout', { method: 'POST' });
  clubStore.set(null);
}

export async function getClubProfile(clubId: string) {
  const response = await fetch(`/api/club/${clubId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch club profile');
  }
  return response.json();
}

export async function updateClubProfile(
  clubId: string,
  data: {
    name: string;
    phone: string;
    location: string;
    city: string;
    logo_url: string;
    description: string;
    booker_visibility: boolean;
  }
) {
  const response = await fetch(`/api/club/${clubId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  const club = await response.json();
  clubStore.set(club);
  return club;
}
