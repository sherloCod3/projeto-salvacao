import { describe, it, expect } from 'vitest';
import { calculatePriority } from '../utils/priority';

describe('calculatePriority', () => {
  it('should return CRITICAL if type is RESCUE', () => {
    expect(calculatePriority('alguma descrição', 'RESCUE')).toBe('CRITICAL');
  });

  it('should return CRITICAL if description contains "vida"', () => {
    expect(calculatePriority('correndo risco de vida', 'OTHER')).toBe('CRITICAL');
  });

  it('should return CRITICAL if description contains "urgente"', () => {
    expect(calculatePriority('socorro urgente', 'SHELTER')).toBe('CRITICAL');
  });

  it('should return CRITICAL if description contains "preso"', () => {
    expect(calculatePriority('estou preso no telhado', 'OTHER')).toBe('CRITICAL');
  });

  it('should return CRITICAL if description contains "encurralado"', () => {
    expect(calculatePriority('encurralado pela agua', 'OTHER')).toBe('CRITICAL');
  });

  it('should return URGENT if type is MEDICAL', () => {
    expect(calculatePriority('preciso de ajuda', 'MEDICAL')).toBe('URGENT');
  });

  it('should return URGENT if description contains "ferido"', () => {
    expect(calculatePriority('temos um ferido', 'OTHER')).toBe('URGENT');
  });

  it('should return URGENT if description contains "sangrando"', () => {
    expect(calculatePriority('ele esta sangrando', 'OTHER')).toBe('URGENT');
  });

  it('should return URGENT if description contains "remédio"', () => {
    expect(calculatePriority('preciso de remédio para pressao', 'OTHER')).toBe('URGENT');
  });

  it('should return URGENT if description contains "machucado"', () => {
    expect(calculatePriority('estou muito machucado', 'OTHER')).toBe('URGENT');
  });

  it('should return MODERATE for other cases', () => {
    expect(calculatePriority('precisamos de cobertores', 'SUPPLIES')).toBe('MODERATE');
    expect(calculatePriority('alguem pode ajudar', 'SHELTER')).toBe('MODERATE');
  });

  it('should return CRITICAL even if MEDICAL keywords are present if type is RESCUE', () => {
    // CRITICAL trumps URGENT because it returns early in the logic
    expect(calculatePriority('estou ferido e preciso de resgate', 'RESCUE')).toBe('CRITICAL');
  });
});
