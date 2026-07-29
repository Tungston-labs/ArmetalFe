import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Adjust the path to import your actual reducer if needed
const mockStore = configureStore({
  reducer: {
    // employee: employeeReducer,
  },
});

// Import the component to be tested
import BasicLevel from '../Pages/employee/BasicLevel';

const renderWithProviders = (ui, { store = mockStore, ...renderOptions } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
    renderOptions
  );
};

describe('BasicLevel Component', () => {
  it('renders employee basic details page without crashing', () => {
    // Normally you would mock API calls or services here before rendering
    renderWithProviders(<BasicLevel />);

    // Add your assertions based on the UI elements expected
    // expect(screen.getByText(/Basic Details/i)).toBeInTheDocument();
  });
});
