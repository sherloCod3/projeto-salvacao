import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from '../Logo';

describe('Logo Component', () => {
  it('should render the main typography elements', () => {
    render(<Logo />);
    
    // Check main heading text content (split across elements)
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('SalvAção');
    
    // Check subtitle
    const subtitle = screen.getByText(/Plataforma de Coordenação/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('should render the visual SVG mark', () => {
    const { container } = render(<Logo />);
    
    // The component should contain exactly one SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Verify it contains the defined gradients
    const waterRescueGradient = container.querySelector('#waterRescue');
    expect(waterRescueGradient).toBeInTheDocument();
  });
});
