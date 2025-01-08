import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitlistForm } from '../WaitlistForm';

describe('WaitlistForm', () => {
  it('renders form correctly', () => {
    render(<WaitlistForm />);
    
    expect(screen.getByLabelText(/el. pašto adresas/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(/prisijungti prie laukiančiųjų sąrašo/i);
  });

  it('shows error for invalid email', async () => {
    render(<WaitlistForm />);
    
    const emailInput = screen.getByLabelText(/el. pašto adresas/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/neteisingas el. pašto formatas/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful submission', async () => {
    render(<WaitlistForm />);
    
    const emailInput = screen.getByLabelText(/el. pašto adresas/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/ačiū už registraciją!/i)).toBeInTheDocument();
    });
  });

  it('disables form submission while submitting', async () => {
    render(<WaitlistForm />);
    
    const emailInput = screen.getByLabelText(/el. pašto adresas/i);
    const submitButton = screen.getByRole('button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(submitButton);

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });
});
