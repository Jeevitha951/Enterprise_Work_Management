import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
        <p className="text-gray-500 text-lg">Oops! The page you are looking for doesn’t exist.</p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
