import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store/authSlice.js'

export default function RoleGuard({ roles = [] }) {
  const { user } = useSelector(selectAuth)

  // If the user's role is not in the allowed roles, redirect to dashboard
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  // Otherwise, render nested routes
  return <Outlet />
}
