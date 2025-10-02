# TODO: Fix Login Errors

## Issues Identified
- CSRF cookie request to `/api/sanctum/csrf-cookie` returns 404 (wrong URL)
- CSRF cookie request to `/sanctum/csrf-cookie` returns 500 (server error)
- Login POST to `/api/login` returns 401 (likely due to missing CSRF token)

## Plan
1. Fix CSRF cookie URL in Admin/src/context/AuthProvider.tsx to remove '/api' prefix
2. Remove duplicate CSRF cookie fetch in AuthProvider.tsx since apiService.login already does it
3. Investigate and fix 500 error on /sanctum/csrf-cookie in backend
4. Update CORS config to allow Admin frontend origin
5. Test login flow

## Files to Edit
- Admin/src/context/AuthProvider.tsx
- backend/config/cors.php (if needed)
- backend/config/sanctum.php (check session config)

## Followup
- Check backend logs for 500 error details
- Verify session and cookie settings
- Test authentication flow
