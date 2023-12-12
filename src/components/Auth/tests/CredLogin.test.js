import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import UserAuthentication from './UserAuthentication'; 
describe('UserAuthentication Component', () => {
  test('renders login form', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <UserAuthentication onUserLogin={() => {}} />
      </BrowserRouter>
    );

    expect(getByText('Hello There, Sign In')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Log In')).toBeInTheDocument();
  });

  test('handles login and displays success message', async () => {
    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <UserAuthentication onUserLogin={() => {}} />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'yash' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '12345' } });
    fireEvent.click(getByText('Log In'));

    try {
      await waitFor(() => {
        expect(screen.queryByText('Signup successful!')).toBeInTheDocument(); // Correct the expected text
      }, { timeout: 5000 });
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('handles login failure and displays error message', async () => {
    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <UserAuthentication onUserLogin={() => {}} />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'invalid-username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'invalid-password' } });
    fireEvent.click(getByText('Log In'));

    try {
      await waitFor(() => {
        expect(screen.queryByText('Please Enter Correct Username and Password.')).toBeInTheDocument(); 
      }, { timeout: 5000 });
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
