import { protectRoute } from '$lib/auth-guard';

export function load() {
  protectRoute();
}
