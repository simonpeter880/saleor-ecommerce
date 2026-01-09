import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleSignInButton } from '../GoogleSignInButton';

describe('GoogleSignInButton', () => {
  it('renders with default text', () => {
    const mockOnSignIn = jest.fn();
    render(<GoogleSignInButton onSignIn={mockOnSignIn} />);

    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const mockOnSignIn = jest.fn();
    render(<GoogleSignInButton onSignIn={mockOnSignIn} text="Sign up with Google" />);

    expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
  });

  it('calls onSignIn when clicked', async () => {
    const mockOnSignIn = jest.fn().mockResolvedValue(undefined);
    render(<GoogleSignInButton onSignIn={mockOnSignIn} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when signing in', async () => {
    const mockOnSignIn = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<GoogleSignInButton onSignIn={mockOnSignIn} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });

  it('disables button during loading', async () => {
    const mockOnSignIn = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<GoogleSignInButton onSignIn={mockOnSignIn} />);

    const button = screen.getByRole('button') as HTMLButtonElement;
    fireEvent.click(button);

    await waitFor(() => {
      expect(button.disabled).toBe(true);
    });
  });

  it('handles errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockOnSignIn = jest.fn().mockRejectedValue(new Error('Sign-in failed'));
    render(<GoogleSignInButton onSignIn={mockOnSignIn} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('applies custom className', () => {
    const mockOnSignIn = jest.fn();
    render(<GoogleSignInButton onSignIn={mockOnSignIn} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
