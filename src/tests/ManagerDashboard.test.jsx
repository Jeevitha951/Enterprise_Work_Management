import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManagerDashboard from '../pages/ManagerDashboard';

import * as reactRedux from 'react-redux';

jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => {
  if (selector.name === 'selectProjects') return { projects: [] };
  if (selector.name === 'selectTasks') return { tasks: [] };
  if (selector.name === 'selectNotifications') return { items: [] };
  if (selector.name === 'selectAuth') return { user: { name: 'Test User' } };
  return {};
});

jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(jest.fn());

test('renders ManagerDashboard without crashing', () => {
  render(
    <MemoryRouter>
      <ManagerDashboard />
    </MemoryRouter>
  );
});
