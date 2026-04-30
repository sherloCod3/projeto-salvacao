'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, Send, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface RequestFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function RequestForm({ onSubmit, isLoading }: RequestFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SHELTER',
    latitude: '',
    longitude: ''
  });

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
      });
    } else {
      alert(t.form.actions.geolocationNotSupported);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-6 w-full max-w-md mx-auto relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.form.heading}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Envie um pedido de ajuda urgente.</p>
          </div>
        </div>
        
        <a 
          href="tel:193" 
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[56px] bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/30 hover:bg-red-600 hover:scale-105 transition-all active:scale-95"
          aria-label="Ligar Bombeiros 193"
        >
          <Phone size={20} className="animate-pulse mb-1" />
          <span className="text-[11px] font-bold leading-none">193</span>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.title.label}</label>
          <input 
            required
            type="text" 
            placeholder={t.form.fields.title.placeholder}
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.type.label}</label>
          <select 
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input appearance-none cursor-pointer"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="SHELTER">{t.form.fields.type.options.SHELTER}</option>
            <option value="RESCUE">{t.form.fields.type.options.RESCUE}</option>
            <option value="SUPPLIES">{t.form.fields.type.options.SUPPLIES}</option>
            <option value="MEDICAL">{t.form.fields.type.options.MEDICAL}</option>
            <option value="COMMUNITY_WARNING">⚠️ Aviso da Comunidade (Proativo)</option>
            <option value="OTHER">{t.form.fields.type.options.OTHER}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.description.label}</label>
          <textarea 
            required
            rows={3}
            placeholder={t.form.fields.description.placeholder}
            className="w-full px-4 py-2 min-h-[44px] rounded-xl glass-input resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Localização</label>
          {formData.latitude && formData.longitude ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
                <MapPin size={18} />
                Localização Capturada
              </div>
              <button
                type="button"
                onClick={handleLocation}
                className="text-xs text-green-600 dark:text-green-500 underline hover:text-green-800"
              >
                Atualizar
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={handleLocation}
              className="w-full flex items-center justify-center gap-2 py-2 min-h-[44px] text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-dashed border-slate-300 dark:border-slate-600"
            >
              <MapPin size={18} /> {t.form.actions.getLocation}
            </button>
          )}
          {/* Hidden inputs to maintain form functionality if needed by parent, though we send from state */}
          <input type="hidden" required value={formData.latitude} />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !formData.latitude}
          className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] mt-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> {t.form.actions.submit}</>
          )}
        </button>
      </form>
    </motion.div>
  );
}
