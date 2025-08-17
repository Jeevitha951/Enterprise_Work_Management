import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store/store.js'
import { MemoryRouter } from 'react-router-dom'
import EmployeeDashboard from '../pages/EmployeeDashboard.jsx'

// Mock Redux slices
jest.mock('../store/tasksSlice', () => ({
  selectTasks: () => ({
    tasks: [
      { id: 1, status: 'Done', assignedTo: 'employee@test.com' },
      { id: 2, status: 'Pending', assignedTo: 'employee@test.com' },
      { id: 3, status: 'Pending', assignedTo: 'other@test.com' }
    ]
  })
}))

jest.mock('../store/notificationsSlice', () => ({
  selectNotifications: () => ({
    items: [
      { id: 1, message: 'Task completed', assignedTo: 'employee@test.com', time: Date.now() },
      { id: 2, message: 'New task assigned', assignedTo: 'employee@test.com', time: Date.now() },
      { id: 3, message: 'Other notification', assignedTo: 'other@test.com', time: Date.now() }
    ]
  }),
  startRealtime: jest.fn()
}))

describe('EmployeeDashboard', () => {
  beforeEach(() => {
    localStorage.setItem('email', 'employee@test.com')

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeeDashboard />
        </MemoryRouter>
      </Provider>
    )
  })

  test('renders metrics cards', () => {
    expect(screen.getByText('Assigned Tasks')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  test('renders notifications panel', () => {
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText(/Task completed/i)).toBeInTheDocument()
    expect(screen.getByText(/New task assigned/i)).toBeInTheDocument()
  })
})
