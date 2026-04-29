export const ptBr = {
  common: {
    loading: 'Carregando...',
  },
  layout: {
    title: 'Centro de Emergência - Enchentes',
    description: 'Plataforma em tempo real para coordenação de resgates e pedidos de ajuda em emergências climáticas.',
  },
  home: {
    title: 'Centro de Emergência de Enchentes',
    subtitle: 'Plataforma de coordenação em tempo real. Peça ajuda ou encontre pessoas precisando de assistência na sua região.',
  },
  map: {
    priorities: {
      CRITICAL: 'Crítico',
      URGENT: 'Urgente',
      MODERATE: 'Moderado',
    },
    types: {
      SHELTER: 'Abrigo',
      RESCUE: 'Resgate',
      SUPPLIES: 'Suprimentos',
      MEDICAL: 'Médico',
      OTHER: 'Outro',
    }
  },
  form: {
    heading: 'Pedir Ajuda',
    fields: {
      title: {
        label: 'Título',
        placeholder: 'Ex: Preciso de resgate na Rua Principal',
      },
      type: {
        label: 'Tipo de Necessidade',
        options: {
          SHELTER: 'Abrigo necessário',
          RESCUE: 'Resgate Imediato',
          SUPPLIES: 'Comida/Água/Suprimentos',
          MEDICAL: 'Assistência Médica',
          OTHER: 'Outro',
        }
      },
      description: {
        label: 'Descrição',
        placeholder: 'Por favor, descreva a situação...',
      },
      latitude: { label: 'Latitude' },
      longitude: { label: 'Longitude' },
    },
    actions: {
      getLocation: 'Pegar Minha Localização',
      geolocationNotSupported: 'Geolocalização não é suportada por este navegador.',
      submit: 'Enviar Pedido',
      submitting: 'Enviando...',
    }
  }
};

export type Dictionary = typeof ptBr;
