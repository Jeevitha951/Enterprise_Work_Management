# Enterprise Work Management System 

## Overview
Vite + React demo implementing auth, roles, projects & tasks with Kanban, reporting, real-time notifications (mock), theming, and testing.

## Tech Stack
- React 18 (Hooks) + React Router v6
- Redux Toolkit + RTK-style slices
- TailwindCSS (dark/light theme with `localStorage`)
- React Hook Form + Yup
- Axios (in real projects; here a `mockApi` simulates calls)
- `@hello-pangea/dnd` (drag & drop Kanban)
- Chart.js (`react-chartjs-2`)
- Toasts with `react-toastify`
- Jest + React Testing Library

  ## Features
- **Dashboard:** View metrics for projects, tasks, completed and pending tasks.
- **Task Tracking:** Real-time notifications for tasks and project activities.
- **Charts:** Visualize task completion and tasks per project using Bar and Doughnut charts.
- **User Management (Admin only):** Add, delete, and toggle status of users.
- **Settings:** Theme toggle and user preferences.
- **Responsive Design:** Mobile and desktop friendly layout with Tailwind CSS.


## Installation
- Clone the repository
- git clone <your-repo-url>
- cd <your-repo-folder>

# Create React App using vite tool
npm craete vite@latest ewms-frontend
cd ewms-frontend

# Install node modules
npm install

## Install dependencies:
- npm install react react-dom
- npm install react-router-dom
- npm install @reduxjs/toolkit react-redux
- npm install chart.js react-chartjs-2
- npm install tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- npm install --save-dev jest
- npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user    event
- npm install --save-dev babel-jest @babel/preset-env @babel/preset-react
- npm install --save-dev vitest

# run dev
npm run dev

# tests
npm test

## Usage

- Navigate to the dashboard to view project/task metrics.
- Admin users can manage other users in the Users section.
- Managers can track tasks and view project-specific notifications.
- Toggle between light and dark themes using the ThemeToggle component.
- Charts update automatically as tasks are updated.

## Notes
- This is **frontend only**. `src/utils/mockApi.js` simulates a backend using `localStorage` with small delays.
- File uploads are not implemented; attachments can be added as metadata in a real backend.
- WebSocket notifications are simulated via a timer in `notificationsSlice.startRealtime`.

## Structure (major)
src/
 - components/       # Layout, ThemeToggle
 - hooks/            # useBootstrapData
 - pages/            # Login, Dashboard, Projects, ProjectDetail, Users, Reports, Settings
 - routes/           # ProtectedRoute, RoleGuard
 - store/            # auth, projects, tasks, users, notifications
 - utils/            # mockApi (localStorage-based)
 - styles/           # Tailwind index.css

## Deployment
- Build: `npm run build`
- Host the `dist/` folder on Vercel/Netlify (SPA with fallback to `index.html`).
