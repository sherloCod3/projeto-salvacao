import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RequestForm from '../RequestForm';
import { ptBr } from '@/i18n/dictionaries/pt-br';

describe('RequestForm Component', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Check main heading
    expect(screen.getByText(ptBr.form.heading)).toBeInTheDocument();
    
    // Check input fields
    expect(screen.getByPlaceholderText(ptBr.form.fields.title.placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(ptBr.form.fields.description.placeholder)).toBeInTheDocument();
    
    // Check select field (Type)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Submit button should be present
    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    expect(submitBtn).toBeInTheDocument();
    // It should be disabled initially because latitude/longitude are missing
    expect(submitBtn).toBeDisabled();
  });

  it('allows user to input data into the form', async () => {
    const user = userEvent.setup();
    render(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);
    
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
    
    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => 
        Promise.resolve(success({
          coords: {
            latitude: -30.0346,
            longitude: -51.2177
          }
        }))
      )
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });

    render(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const locationBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.getLocation, 'i') });
    await user.click(locationBtn);
    
    // Expect the geolocation to be called
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    
    // After location is captured, the button should change to "Atualizar" or similar
    await waitFor(() => {
      expect(screen.getByText(/Localização Capturada/i)).toBeInTheDocument();
    });
    
    // Now submit button should be enabled
    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    expect(submitBtn).not.toBeDisabled();
  });

  it('submits the form with correct payload', async () => {
    const user = userEvent.setup();
    
    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => 
        Promise.resolve(success({
          coords: {
            latitude: -30.0346,
            longitude: -51.2177
          }
        }))
      )
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });

    render(<RequestForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Fill form
    const titleInput = screen.getByPlaceholderText(ptBr.form.fields.title.placeholder);
    const descriptionInput = screen.getByPlaceholderText(ptBr.form.fields.description.placeholder);
    
    await user.type(titleInput, 'Preciso de resgate');
    await user.type(descriptionInput, 'Água subiu muito rápido');
    
    // Get location
    const locationBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.getLocation, 'i') });
    await user.click(locationBtn);
    
    // Wait for submit to be enabled
    const submitBtn = screen.getByRole('button', { name: new RegExp(ptBr.form.actions.submit, 'i') });
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
    
    // Submit form
    await user.click(submitBtn);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Preciso de resgate',
      description: 'Água subiu muito rápido',
      type: 'SHELTER', // default
      latitude: -30.0346,
      longitude: -51.2177
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    // Assuming latitude is set so we can see if spinner is shown on a normally enabled button
    // But button disabled state handles loading. We can just check the DOM.
    const { container } = render(<RequestForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    // Find spinner by its class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // The submit button exists, but no longer contains the submit text
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    
    expect(screen.queryByText(ptBr.form.actions.submit)).not.toBeInTheDocument();
  });
});
