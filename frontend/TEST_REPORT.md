# NutriSnap Authentication Test Report

## Automated verification

- TypeScript production build: PASS
- Vite production bundle: PASS
- ESLint: PASS

## Authentication behavior implemented

- Login stores access and refresh tokens.
- Login normalizes email without modifying the password.
- Protected routes redirect unauthenticated users to `/login`.
- Authenticated users are redirected from `/login` to `/dashboard`.
- Browser refresh restores the session through `/auth/me`.
- A 401 from a protected endpoint triggers one refresh request.
- Rotated access and refresh tokens are stored after refresh.
- Concurrent 401 responses share one refresh operation.
- Failed refresh clears the session and redirects to login.
- Logout revokes the refresh token through `/auth/logout` and clears local state even if the API is unavailable.

## Local integration checks

1. Log in and verify navigation to `/dashboard`.
2. Refresh the browser and verify the dashboard remains visible.
3. Open `/login` while authenticated and verify redirect to `/dashboard`.
4. Log out and verify redirect to `/login`.
5. Open `/dashboard` after logout and verify redirect to `/login`.
6. Enter an invalid password and verify the backend error appears without navigation.
