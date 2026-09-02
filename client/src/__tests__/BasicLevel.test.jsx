// import { render, screen } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import React from 'react';
// import { vi } from 'vitest';

// // vi.mock('../Redux/employeeSlice', () => ({
// //   submitEmployee: vi.fn((payload) => ({ type: 'employee/submitEmployee', payload })),
// //   setEmployeeId: vi.fn((payload) => ({ type: 'employee/setEmployeeId', payload })),
// //   setBasicFormData: vi.fn((payload) => ({ type: 'employee/setBasicFormData', payload })),
// // }));

// vi.mock('../Redux/departmentSlice', () => ({
//   getDepartments: vi.fn((payload) => ({ type: 'departments/getDepartments', payload })),
// }));

// const mockStore = configureStore({
//   reducer: {
//     employee: (state = { formData: {} }) => state,
//     departments: (state = { list: [] }) => state,
//   },
// });

// import BasicLevel from '../Pages/employee/BasicLevel';

// const renderWithProviders = (ui, { store = mockStore, ...renderOptions } = {}) => {
//   return render(
//     <Provider store={store}>
//       <BrowserRouter>{ui}</BrowserRouter>
//     </Provider>,
//     renderOptions
//   );
// };

// describe('BasicLevel Component', () => {
//   it('renders employee basic details page without crashing', () => {
//     // Normally you would mock API calls or services here before rendering
//     renderWithProviders(<BasicLevel />);

//     // Add your assertions based on the UI elements expected
//     // expect(screen.getByText(/Basic Details/i)).toBeInTheDocument();
//   });
// });
