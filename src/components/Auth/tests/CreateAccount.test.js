import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountCreation from './AccountCreation'; 

jest.mock('../services/authService', () => ({
  userRegistration: jest.fn(),
}));

describe('AccountCreation component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form', () => {
    render(<AccountCreation />);
    const signUpHeading = screen.getByText('Welcome!! Register Here');
    const fullNameInput = screen.getByLabelText('User\'s Full Name:');
    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Pass code:');
    const signUpButton = screen.getByRole('button', { name: 'Register' });

    expect(signUpHeading).toBeInTheDocument();
    expect(fullNameInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test('handles signup and displays success message', async () => {
    const mockUserRegistration = jest.fn();
    mockUserRegistration.mockResolvedValue('Success');
    require('../services/authService').userRegistration = mockUserRegistration;

    render(<AccountCreation />);
    userEvent.type(screen.getByLabelText('User\'s Full Name:'), 'John Doe');
    userEvent.type(screen.getByLabelText('Username:'), 'johndoe');
    userEvent.type(screen.getByLabelText('Pass code:'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Signup successful!')).toBeInTheDocument();
    });
  });

  test('handles signup failure and displays error message', async () => {
    const mockUserRegistration = jest.fn();
    mockUserRegistration.mockRejectedValue(new Error('Registration failed'));
    require('../services/authService').userRegistration = mockUserRegistration;

    render(<AccountCreation />);
    userEvent.type(screen.getByLabelText('User\'s Full Name:'), 'John Doe');
    userEvent.type(screen.getByLabelText('Username:'), 'johndoe');
    userEvent.type(screen.getByLabelText('Pass code:'), 'invalidpassword');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Sorry, Signup Failed. Please Give It Another Try')).toBeInTheDocument();
    });
  });
});
