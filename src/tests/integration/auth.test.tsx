/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import * as api from '../../services/api';
import { analyticsService } from '../../services/analyticsService';

// Mock'inam API
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

// Mock'inam window.location
const mockLocation = {
  href: ''
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('Auth Integration Tests', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  test('pilnas prisijungimo procesas', async () => {
    // Mock'inam API atsakymus
    (api.login as jest.Mock).mockResolvedValueOnce({
      data: {
        status: 'success',
        data: {
          user: mockUser,
          tokens: {
            access_token: 'fake_access_token',
            refresh_token: 'fake_refresh_token'
          }
        }
      }
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm onClose={() => {}} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Tikrinam ar matomi formos laukai
    const emailInput = screen.getByPlaceholderText(/el\. paštas/i);
    const passwordInput = screen.getByPlaceholderText(/slaptažodis/i);
    const submitButton = screen.getByRole('button', { name: /prisijungti/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(analyticsService.initializeAnalytics).toHaveBeenCalled();

    // Įvedam duomenis
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Siunčiam formą
    fireEvent.click(submitButton);

    // Tikrinam ar išsaugoti duomenys localStorage
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(localStorage.getItem('access_token')).toBeTruthy();
    });

    // Tikrinam analytics įvykius
    expect(analyticsService.trackFormInteraction).toHaveBeenCalledWith(
      'login_form',
      'submit',
      'success'
    );
  });

  test('turėtų teisingai tvarkyti prisijungimo klaidas', async () => {
    // Mock'inam nesėkmingą prisijungimą
    (api.login as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          status: 'error',
          message: 'Invalid credentials'
        }
      }
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm onClose={() => {}} />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/el\. paštas/i);
    const passwordInput = screen.getByPlaceholderText(/slaptažodis/i);
    const submitButton = screen.getByRole('button', { name: /prisijungti/i });

    fireEvent.change(emailInput, { target: { value: 'bad@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/įvyko klaida/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();

    // Tikrinam analytics įvykius
    expect(analyticsService.trackFormInteraction).toHaveBeenCalledWith(
      'login_form',
      'submit',
      'error'
    );
  });

  test('turėtų nukreipti į Facebook prisijungimą', async () => {
    process.env.VITE_API_URL = 'http://test-api.example.com';

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm onClose={() => {}} />
        </AuthProvider>
      </BrowserRouter>
    );

    const facebookButton = screen.getByRole('button', {
      name: /prisijungti su facebook/i
    });

    fireEvent.click(facebookButton);

    expect(mockLocation.href).toBe(
      'http://test-api.example.com/auth/facebook'
    );
  });
});
