import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { login, signup, selectAuth } from '../store/authSlice.js'
import { setCurrentUser } from '../store/usersSlice.js'
import { Navigate, useLocation } from 'react-router-dom'

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(4).required()
})

const signupSchema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
  role: yup.string().oneOf(['Admin', 'Manager', 'Employee']).required()
})

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const dispatch = useDispatch()
  const { isAuthenticated, status, error, user } = useSelector(selectAuth)
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(mode === 'login' ? loginSchema : signupSchema)
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setCurrentUser(user))
    }
  }, [isAuthenticated, user, dispatch])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = (data) => {
    mode === 'login' ? dispatch(login(data)) : dispatch(signup(data))
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-6 space-y-6">
        <div className="flex justify-around border-b pb-2">
          <button 
            onClick={() => setMode('login')}
            className={`px-4 py-2 ${mode==='login' ? 'font-bold border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`px-4 py-2 ${mode==='signup' ? 'font-bold border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === 'signup' && (
            <>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700">Name</label>
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="John Doe" {...register('name')} />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700">Role</label>
                <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('role')}>
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Email</label>
            <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@company.com" {...register('email')} />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Password</label>
            <input type="password" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('password')} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50" 
            disabled={status==='loading'}
          >
            {status==='loading' ? (mode==='login' ? 'Signing in...' : 'Signing up...') : (mode==='login' ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  )
}
