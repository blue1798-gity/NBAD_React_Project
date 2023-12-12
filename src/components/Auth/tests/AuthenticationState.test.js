import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { UserAuthProvider, useUserAuth } from './AuthenticationState';
import authService from '../services/authService';

jest.mock('../services/authService', () => ({
  refreshUserAccessToken: jest.fn(),
}));

function renderWithProvider(ui) {
  return renderHook(() => useUserAuth(), { wrapper: UserAuthProvider });
}

describe('AuthenticationState component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides initial context values', () => {
    const { result } = renderWithProvider();

    expect(result.current.isUserLoggedIn).toBe(false);
    expect(result.current.token).toBe(null);
  });

  test('logs in and out a user', () => {
    const { result } = renderWithProvider();

    act(() => {
      result.current.userLogin('mockedToken');
    });

    expect(result.current.isUserLoggedIn).toBe(true);
    expect(result.current.token).toBe('mockedToken');

    act(() => {
      result.current.userLogout();
    });

    expect(result.current.isUserLoggedIn).toBe(false);
    expect(result.current.token).toBe(null);
  });

  test('refreshes user access token', async () => {
    const { result } = renderWithProvider();

    authService.refreshUserAccessToken.mockResolvedValue('newToken');

    await act(async () => {
      await result.current.refreshUserAccessToken();
    });

    expect(authService.refreshUserAccessToken).toHaveBeenCalled();
    expect(result.current.token).toBe('newToken');
  });
});
