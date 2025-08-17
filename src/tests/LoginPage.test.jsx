import { render, screen } from '@testing-library/react'
import LoginPage from '../pages/LoginPage.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import auth from '../store/authSlice.js'
import { MemoryRouter } from 'react-router-dom'

test('renders login form', () => {
  const store = configureStore({ reducer: { auth } })
  render(<Provider store={store}><MemoryRouter><LoginPage /></MemoryRouter></Provider>)
  expect(screen.getByText(/Sign in/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument()
})
