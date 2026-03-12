# Deployment

## Frontend (Vercel)

- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://your-backend-service.onrender.com`
  - `VITE_SOCKET_URL=https://your-backend-service.onrender.com`

## Backend (Render)

- Root directory: `Backend`
- Build command: `npm run build`
- Start command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `PORT=8080`
  - `MONGODB_URL=...`
  - `JWT_SECRET=...`
  - `CLIENT_URL=https://your-frontend-app.vercel.app`
  - `COOKIE_SAME_SITE=none`
  - `COOKIE_SECURE=true`
  - `SERVE_FRONTEND=false`
  - `GEMINI_API_KEY=...` (optional)
  - `GEMINI_MODEL=gemini-2.5-flash` (optional)

## Notes

- `CLIENT_URL` can contain multiple comma-separated origins if you need previews, for example:
  - `https://your-frontend-app.vercel.app,https://your-frontend-git-main.vercel.app`
- Cross-site auth between Vercel and Render requires `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true`.
- If you ever host frontend and backend on the same origin again, you can switch `SERVE_FRONTEND=true` and build the frontend separately.
