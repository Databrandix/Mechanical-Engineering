import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

// Mounts the Better Auth catch-all:
//   POST /api/auth/sign-in/email    — credentials sign-in
//   POST /api/auth/sign-out          — sign out (revokes session)
//   GET  /api/auth/get-session       — current user + session
//   POST /api/auth/change-password   — logged-in user changes own password
//
// All other Better Auth endpoints (sign-up, verify-email, OAuth callbacks,
// magic-link, etc.) are mounted but inert in our config:
//   - sign-up returns 400 (`emailAndPassword.disableSignUp: true`)
//   - verify-email / magic-link / OAuth never get a valid token
//
export const { GET, POST } = toNextJsHandler(auth);
