/**
 * @jest-environment node
 */

import { loginAction, logoutAction } from '../auth-actions';

// Mock dependencies
jest.mock('@/app/config', () => ({
  getServerAuthClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url) => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(() => []),
  })),
}));

import { getServerAuthClient } from '@/app/config';
import { redirect } from 'next/navigation';

describe('Auth Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginAction', () => {
    it('should return error when email is missing', async () => {
      const formData = new FormData();
      formData.append('password', 'password123');

      const result = await loginAction(formData, false);

      expect(result).toEqual({
        errors: ['Email and password are required'],
      });
    });

    it('should return error when password is missing', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await loginAction(formData, false);

      expect(result).toEqual({
        errors: ['Email and password are required'],
      });
    });

    it('should call signIn with correct credentials', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({
        data: { token: 'test-token', refreshToken: 'test-refresh-token' },
        error: null,
      });

      (getServerAuthClient as jest.Mock).mockResolvedValue({
        signIn: mockSignIn,
      });

      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      try {
        await loginAction(formData, false);
      } catch (error: any) {
        // Expect redirect to throw
        expect(error.message).toBe('NEXT_REDIRECT');
      }

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return error when signIn fails', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      (getServerAuthClient as jest.Mock).mockResolvedValue({
        signIn: mockSignIn,
      });

      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'wrong-password');

      const result = await loginAction(formData, false);

      expect(result).toEqual({
        errors: ['Invalid credentials'],
      });
    });

    it('should redirect to account page on successful login', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({
        data: { token: 'test-token', refreshToken: 'test-refresh-token' },
        error: null,
      });

      (getServerAuthClient as jest.Mock).mockResolvedValue({
        signIn: mockSignIn,
      });

      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      try {
        await loginAction(formData, false);
      } catch (error: any) {
        expect(error.message).toBe('NEXT_REDIRECT');
      }

      expect(redirect).toHaveBeenCalledWith('/channel-pln/account');
    });
  });

  describe('logoutAction', () => {
    it('should call signOut and redirect to home', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);

      (getServerAuthClient as jest.Mock).mockResolvedValue({
        signOut: mockSignOut,
      });

      try {
        await logoutAction();
      } catch (error: any) {
        expect(error.message).toBe('NEXT_REDIRECT');
      }

      expect(mockSignOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/channel-pln/');
    });

    it('should handle errors gracefully', async () => {
      const mockSignOut = jest.fn().mockRejectedValue(new Error('Signout failed'));

      (getServerAuthClient as jest.Mock).mockResolvedValue({
        signOut: mockSignOut,
      });

      const result = await logoutAction();

      expect(result).toEqual({
        errors: ['Logout failed. Please try again.'],
      });
    });
  });
});
