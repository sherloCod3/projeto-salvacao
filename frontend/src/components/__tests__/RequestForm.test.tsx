import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RequestForm from '../RequestForm';
import { ptBr } from '@/i18n/dictionaries/pt-br';
import { ToastProvider } from '@/contexts/ToastContext';

// Helper — wraps RequestForm with the required ToastProvider context
const renderWithToast = (ui: React.ReactElement) =>
  render(<ToastProvider>{ui}</ToastProvider>);

describe('RequestForm Component', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    renderWithToast(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Check main heading
    expect(screen.getByText(ptBr.form.heading)).toBeInTheDocument();

    // Check input fields
    expect(screen.getByPlaceholderText(ptBr.form.fields.title.placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(ptBr.form.fields.description.placeholder)).toBeInTheDocument();

    // Check select field (Type)
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // Submit button should be present and disabled (no location yet)
    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('allows user to input data into the form', async () => {
    const user = userEvent.setup();
    renderWithToast(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);

    const titleInput = screen.getByPlaceholderText(ptBr.form.fields.title.placeholder);
    const descriptionInput = screen.getByPlaceholderText(ptBr.form.fields.description.placeholder);
    const typeSelect = screen.getByRole('combobox');

    await user.type(titleInput, 'Preciso de resgate');
    await user.type(descriptionInput, 'Água subiu muito rápido');
    await user.selectOptions(typeSelect, 'RESCUE');

    expect(titleInput).toHaveValue('Preciso de resgate');
    expect(descriptionInput).toHaveValue('Água subiu muito rápido');
    expect(typeSelect).toHaveValue('RESCUE');
  });

  it('captures geolocation when button is clicked and enables submit', async () => {
    const user = userEvent.setup();

    // Mock navigator.geolocation — synchronous call so React state updates happen within act()
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: { latitude: -30.0346, longitude: -51.2177, accuracy: 5 },
          timestamp: Date.now()
        });
      })
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation, configurable: true
    });

    renderWithToast(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);

    const locationBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.getLocation, 'i') });
    await user.click(locationBtn);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);

    // Coordinates should be displayed (may appear in form + toast)
    await waitFor(() => {
      const matches = screen.getAllByText(/Localização Capturada/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    // Coords display with copy button should appear
    const copyBtn = screen.getByRole('button', { name: /copiar/i });
    expect(copyBtn).toBeInTheDocument();

    // Submit button should now be enabled
    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    expect(submitBtn).not.toBeDisabled();
  });

  it('submits the form with correct payload', async () => {
    const user = userEvent.setup();

    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        Promise.resolve(success({
          coords: { latitude: -30.0346, longitude: -51.2177, accuracy: 10 },
          timestamp: Date.now()
        }))
      )
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation, configurable: true
    });

    renderWithToast(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);

    await user.type(screen.getByPlaceholderText(ptBr.form.fields.title.placeholder), 'Preciso de resgate');
    await user.type(screen.getByPlaceholderText(ptBr.form.fields.description.placeholder), 'Água subiu muito rápido');

    const locationBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.getLocation, 'i') });
    await user.click(locationBtn);

    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Preciso de resgate',
      description: 'Água subiu muito rápido',
      type: 'SHELTER',
      latitude: -30.0346,
      longitude: -51.2177,
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = renderWithToast(<RequestForm onSubmit={mockOnSubmit} isLoading={true} />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    expect(screen.queryByText(ptBr.form.actions.submit)).not.toBeInTheDocument();
  });
});
