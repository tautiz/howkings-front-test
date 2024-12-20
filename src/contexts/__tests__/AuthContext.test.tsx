/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { act } from 'react';
import { analyticsService } from '../../services/analyticsService';

// Mock'inam API servisą
jest.mock('../../services/api', () => ({
  login: jest.fn(),
  logout: jest.fn()
}));

// Mock'inam analytics servisą
jest.mock('../../services/analyticsService', () => ({
  analyticsService: {
    initializeAnalytics: jest.fn(),
    trackFormInteraction: jest.fn(),
    setUserProperties: jest.fn(),
    trackEvent: jest.fn(),
    isInitialized: jest.fn().mockReturnValue(true)
  }
}));

describe('AuthContext Unit Tests', () => {
  beforeEach(() => {
    // Valome localStorage prieš kiekvieną testą
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('turėtų pradžioje būti neprisijungęs', () => {
    const TestComponent = () => {
      const { isAuthenticated } = useAuth();
      return <div>{isAuthenticated ? 'prisijungęs' : 'neprisijungęs'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('neprisijungęs')).toBeInTheDocument();
    expect(analyticsService.initializeAnalytics).toHaveBeenCalled();
  });

  test('turėtų sėkmingai prisijungti', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    };

    const mockTokens = {
      access_token: 'fake_access_token',
      refresh_token: 'fake_refresh_token'
    };

    // Mock'inam sėkmingą prisijungimą
    require('../../services/api').login.mockResolvedValueOnce({
      data: {
        status: 'success',
        data: {
          user: mockUser,
          tokens: mockTokens
        }
      }
    });

    const TestComponent = () => {
      const { login, isAuthenticated } = useAuth();
      return (
        <div>
          <button onClick={() => login('test@example.com', 'password')}>
            Prisijungti
          </button>
          <div>{isAuthenticated ? 'prisijungęs' : 'neprisijungęs'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Prisijungti');
    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText('prisijungęs')).toBeInTheDocument();
    });

    expect(analyticsService.trackEvent).toHaveBeenCalledWith({
      action: 'login',
      category: 'auth',
      label: 'success'
    });
  });

  test('turėtų teisingai tvarkyti prisijungimo klaidas', async () => {
    // Mock'inam nesėkmingą prisijungimą
    require('../../services/api').login.mockRejectedValueOnce({
      response: {
        data: {
          status: 'error',
          message: 'Invalid credentials'
        }
      }
    });

    let errorMessage: string | null = null;

    const TestComponent = () => {
      const { login, isAuthenticated, error } = useAuth();
      return (
        <div>
          <button
            onClick={async () => {
              try {
                await login('bad@example.com', 'wrong');
              } catch (err: any) {
                errorMessage = err.response?.data?.message || 'Unknown error';
              }
            }}
          >
            Prisijungti
          </button>
          <div>{isAuthenticated ? 'prisijungęs' : 'neprisijungęs'}</div>
          {error && <div>Klaida: {error}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Prisijungti');
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText('neprisijungęs')).toBeInTheDocument();
      expect(screen.getByText(/klaida/i)).toBeInTheDocument();
      expect(errorMessage).toBe('Invalid credentials');
    });

    expect(analyticsService.trackEvent).toHaveBeenCalledWith({
      action: 'login',
      category: 'auth',
      label: 'error'
    });
  });
});
