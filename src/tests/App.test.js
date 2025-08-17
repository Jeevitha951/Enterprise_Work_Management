import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

test('renders login page for unauthenticated users', () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    </Provider>
  )
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
})

test('renders dashboard when authenticated', async () => {
  store.dispatch({ type: 'auth/login/fulfilled', payload: { user: { id:1, name:'Test', role:'Employee', email:'test@test.com' }, token:'abc' } })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    </Provider>
  )

  expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument()
})
