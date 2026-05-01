'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, Send, Phone, Copy, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/contexts/ToastContext';

interface RequestFormProps {
  onSubmit: (data: FormPayload) => Promise<void>;
  isLoading: boolean;
}

export interface FormPayload {
  title: string;
  description: string;
  type: string;
  latitude: number;
  longitude: number;
}

/**
 * RequestForm — allows victims to submit a geo-tagged help request.
 * Features:
 * - High-accuracy GPS capture with error feedback
 * - Coords display with one-click copy (lat, lng format)
 * - Dual-layer toast notifications (user-friendly + dev detail)
 */
export default function RequestForm({ onSubmit, isLoading }: RequestFormProps) {
  const { t } = useTranslation();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SHELTER',
    latitude: '',
    longitude: ''
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // ── Location Capture ──────────────────────────────────────────────────────

  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error({
        user: t.form.actions.geolocationNotSupported,
        dev: 'navigator.geolocation is undefined — browser does not support Geolocation API.',
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
        setIsLocating(false);
        toast.success({
          user: 'Localização capturada com sucesso!',
          dev: `GPS OK | lat=${latitude.toFixed(6)}, lng=${longitude.toFixed(6)} | accuracy=${accuracy.toFixed(1)}m | timestamp=${new Date(position.timestamp).toISOString()}`,
        });
      },
      (error) => {
        setIsLocating(false);
        const messages: Record<number, string> = {
          1: 'Permissão de localização negada pelo usuário.',
          2: 'Posição indisponível — GPS sem sinal ou conexão instável.',
          3: 'Tempo esgotado ao tentar obter localização.',
        };
        toast.error({
          user: 'Não foi possível capturar a localização. Verifique se o GPS está ativo e se o navegador tem permissão.',
          dev: `GeolocationPositionError | code=${error.code} | message="${messages[error.code] ?? error.message}" | HTTPS=${location.protocol === 'https:'}`,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ── Copy Coordinates ──────────────────────────────────────────────────────

  const handleCopyCoords = async () => {
    const coords = `${parseFloat(formData.latitude).toFixed(6)}, ${parseFloat(formData.longitude).toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(coords);
      setIsCopied(true);
      toast.success({
        user: 'Coordenadas copiadas!',
        dev: `Clipboard write OK | value="${coords}"`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error({
        user: 'Não foi possível copiar. Selecione manualmente.',
        dev: `Clipboard API error: ${String(err)}`,
      });
    }
  };

  // ── Form Submit ───────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    });
  };

  const hasLocation = Boolean(formData.latitude && formData.longitude);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-6 w-full max-w-md mx-auto relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />

      {/* Header — simplified to single-direction flex, never competes for horizontal space */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white truncate">{t.form.heading}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Envie um pedido de ajuda urgente.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t.form.fields.title.label}
          </label>
          <input
            required
            type="text"
            placeholder={t.form.fields.title.placeholder}
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t.form.fields.type.label}
          </label>
          <select
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input appearance-none cursor-pointer"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="SHELTER">{t.form.fields.type.options.SHELTER}</option>
            <option value="RESCUE">{t.form.fields.type.options.RESCUE}</option>
            <option value="SUPPLIES">{t.form.fields.type.options.SUPPLIES}</option>
            <option value="MEDICAL">{t.form.fields.type.options.MEDICAL}</option>
            <option value="COMMUNITY_WARNING">⚠️ Aviso da Comunidade (Proativo)</option>
            <option value="OTHER">{t.form.fields.type.options.OTHER}</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t.form.fields.description.label}
          </label>
          <textarea
            required
            rows={3}
            placeholder={t.form.fields.description.placeholder}
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="pt-2 space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Localização
          </label>

          {hasLocation ? (
            <>
              {/* Captured state */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
                  <MapPin size={18} />
                  Localização Capturada
                </div>
                <button
                  type="button"
                  onClick={handleLocation}
                  className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                  disabled={isLocating}
                >
                  <RefreshCw size={12} className={isLocating ? 'animate-spin' : ''} />
                  Atualizar
                </button>
              </div>

              {/* Coordinates display + copy */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <code className="flex-1 text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                  {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                </code>
                <motion.button
                  type="button"
                  onClick={handleCopyCoords}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Copiar coordenadas"
                  className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all
                    ${isCopied
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  {isCopied ? 'Copiado' : 'Copiar'}
                </motion.button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 py-2 min-h-[44px] text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-dashed border-slate-300 dark:border-slate-600 disabled:opacity-60"
            >
              {isLocating ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <MapPin size={18} />
              )}
              {isLocating ? 'Obtendo localização...' : t.form.actions.getLocation}
            </button>
          )}

          {/* Hidden required guard so HTML5 validation blocks submit without location */}
          <input type="hidden" required value={formData.latitude} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !hasLocation}
          className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] mt-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> {t.form.actions.submit}</>
          )}
        </button>

        {/* Emergency call — always full-width below submit, never competes for space */}
        <a
          href="tel:193"
          aria-label="Ligar Bombeiros 193"
          className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors active:scale-[0.98]"
        >
          <Phone size={16} className="animate-pulse shrink-0" />
          <span>Emergência? Ligue <strong>193</strong> (Bombeiros)</span>
        </a>
      </form>
    </motion.div>
  );
}
