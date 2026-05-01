import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../useTranslation';
import { ptBr } from '@/i18n/dictionaries/pt-br';

describe('useTranslation Hook', () => {
  it('should return the ptBr dictionary by default', () => {
    const { result } = renderHook(() => useTranslation());
    
    // Verify it returns the translation object `t`
    expect(result.current.t).toBeDefined();
    
    // Verify it matches the ptBr dictionary structure and values
    expect(result.current.t).toBe(ptBr);
    expect(result.current.t.form.heading).toBe('Pedir Ajuda');
  });
});
