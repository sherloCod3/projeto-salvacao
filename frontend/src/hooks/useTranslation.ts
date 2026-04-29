import { ptBr } from '../i18n/dictionaries/pt-br';

// MVP: Hardcoded to pt-br. In the future, this can read from a Context or next-intl.
export function useTranslation() {
  return { t: ptBr };
}
