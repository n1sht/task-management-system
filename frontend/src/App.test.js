import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';

const mockStore = configureStore([]);

test('renders login page when not authenticated', () => {
  const store = mockStore({
    auth: { token: null, user: null },
    tasks: { tasks: [], loading: false, error: null, totalPages: 0, currentPage: 0 },
    users: { users: [], loading: false, error: null, totalPages: 0, currentPage: 0 },
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
});
