# Enterprise Work Management System 

Vite + React demo implementing auth, roles, projects & tasks with Kanban, reporting, real-time notifications (mock), theming, and testing.

## Tech
- React 18 (Hooks) + React Router v6
- Redux Toolkit + RTK-style slices
- TailwindCSS (dark/light theme with `localStorage`)
- React Hook Form + Yup
- Axios (in real projects; here a `mockApi` simulates calls)
- `@hello-pangea/dnd` (drag & drop Kanban)
- Chart.js (`react-chartjs-2`)
- Toasts with `react-toastify`
- Jest + React Testing Library

## Getting Started
# Create React App using vite tool
npm craete vite@latest ewms-frontend
cd ewms-frontend

# Install node modules
npm install

# run dev
npm run dev

# tests
npm test

## Notes
- This is **frontend only**. `src/utils/mockApi.js` simulates a backend using `localStorage` with small delays.
- File uploads are not implemented; attachments can be added as metadata in a real backend.
- WebSocket notifications are simulated via a timer in `notificationsSlice.startRealtime`.

## Structure (major)
src/
  components/       # Layout, ThemeToggle
  hooks/            # useBootstrapData
  pages/            # Login, Dashboard, Projects, ProjectDetail, Users, Reports, Settings
  routes/           # ProtectedRoute, RoleGuard
  store/            # auth, projects, tasks, users, notifications
  utils/            # mockApi (localStorage-based)
  styles/           # Tailwind index.css

## Deployment
- Build: `npm run build`
- Host the `dist/` folder on Vercel/Netlify (SPA with fallback to `index.html`).

## Libraries Used


