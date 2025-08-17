import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAuth } from '../store/authSlice.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)

  const menu = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
    { to: '/reports', label: 'Reports' },
    ...(user?.role === 'Admin' ? [{ to: '/users', label: 'Users' }] : []),
    { to: '/settings', label: 'Settings' }
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-full md:w-60 p-6 bg-white dark:bg-gray-800 shadow-md md:shadow-none flex-shrink-0 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">E-WMS</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Hello, <span className="font-medium">{user?.name}</span>
          </p>

          <nav className="flex flex-col space-y-2">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <ThemeToggle />
          <button
            onClick={() => {
              dispatch(logout())
              navigate('/login')
            }}
            className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
