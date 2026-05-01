import { type Priority, type RequestType } from '@prisma/client';

/**
 * Calcula a prioridade de um pedido com base em heurísticas de texto e tipo de emergência.
 * Utilizado como mecanismo de triagem automática (MVP) para priorizar resgates sem intervenção manual.
 */
export function calculatePriority(description: string | undefined, type: RequestType): Priority {
  const desc = (description || '').toLowerCase();

  // Verifica palavras críticas: vida, encurralado, preso, urgente
  if (type === 'RESCUE' || desc.includes('vida') || desc.includes('urgente') || desc.includes('preso') || desc.includes('encurralado')) {
    return 'CRITICAL';
  }

  // Verifica palavras médicas: machucado, ferido, sangrando, remédio
  if (type === 'MEDICAL' || desc.includes('ferido') || desc.includes('sangrando') || desc.includes('remédio') || desc.includes('machucado')) {
    return 'URGENT';
  }

  return 'MODERATE';
}
