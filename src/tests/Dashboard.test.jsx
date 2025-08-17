import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Dashboard from '../pages/Dashboard.jsx';

jest.mock('../pages/AdminDashboard.jsx', () => () => <div>Admin Dashboard</div>);
jest.mock('../pages/ManagerDashboard.jsx', () => () => <div>Manager Dashboard</div>);
jest.mock('../pages/EmployeeDashboard.jsx', () => () => <div>Employee Dashboard</div>);

const mockStore = configureStore([]);

describe('Dashboard Component', () => {
  test('renders AdminDashboard for admin', () => {
    const store = mockStore({ auth: { user: { role: 'Admin' } } });
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  test('renders ManagerDashboard for manager', () => {
    const store = mockStore({ auth: { user: { role: 'Manager' } } });
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument();
  });

  test('renders EmployeeDashboard for employee', () => {
    const store = mockStore({ auth: { user: { role: 'Employee' } } });
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByText(/Employee Dashboard/i)).toBeInTheDocument();
  });

  test('renders loading state if user is null', () => {
    const store = mockStore({ auth: { user: null } });
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
