# SIH Backend (Express + MongoDB)

## Quick start

1. Install dependencies

2. Create `.env` from `.env.example`:

3. Run:

4. API endpoints
- GET  /api/health
- GET  /api/users
- POST /api/users/register   (body: { name, email, password })

5. Notes
- The backend serves static frontend files from the parent folder by default.
- Passwords are stored in plaintext in this demo. **DO NOT** use plaintext passwords in production. Use bcrypt to hash passwords and implement authentication & validation.
