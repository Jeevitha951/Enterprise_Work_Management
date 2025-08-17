import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store/store.js'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard.jsx'

jest.mock('../store/projectsSlice', () => ({
  selectProjects: () => ({
    projects: [{ id: 1, name: 'Test Project' }]
  })
}))

jest.mock('../store/tasksSlice', () => ({
  selectTasks: () => ({
    tasks: [
      { id: 1, status: 'Done', projectId: 1 },
      { id: 2, status: 'Pending', projectId: 1 }
    ]
  })
}))

jest.mock('../store/notificationsSlice', () => ({
  selectNotifications: () => ({
    items: [
      { id: 1, message: 'Task completed', time: Date.now() },
      { id: 2, message: 'New task assigned', time: Date.now() }
    ]
  }),
  startRealtime: jest.fn()
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      </Provider>
    )
  })

  test('renders metrics cards', () => {
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  test('renders activity list', () => {
    expect(screen.getByText(/Task completed/)).toBeInTheDocument()
    expect(screen.getByText(/New task assigned/)).toBeInTheDocument()
  })

  test('renders notifications panel', () => {
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })
})
