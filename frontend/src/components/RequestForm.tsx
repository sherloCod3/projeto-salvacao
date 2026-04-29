'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, Send } from 'lucide-react';
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
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-full text-red-600">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.form.heading}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.title.label}</label>
          <input 
            required
            type="text" 
            placeholder={t.form.fields.title.placeholder}
            className="w-full px-4 py-2 rounded-xl glass-input"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.type.label}</label>
          <select 
            className="w-full px-4 py-2 rounded-xl glass-input appearance-none"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="SHELTER">{t.form.fields.type.options.SHELTER}</option>
            <option value="RESCUE">{t.form.fields.type.options.RESCUE}</option>
            <option value="SUPPLIES">{t.form.fields.type.options.SUPPLIES}</option>
            <option value="MEDICAL">{t.form.fields.type.options.MEDICAL}</option>
            <option value="OTHER">{t.form.fields.type.options.OTHER}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.description.label}</label>
          <textarea 
            required
            rows={3}
            placeholder={t.form.fields.description.placeholder}
            className="w-full px-4 py-2 rounded-xl glass-input resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.latitude.label}</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl glass-input"
              value={formData.latitude}
              onChange={(e) => setFormData({...formData, latitude: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.form.fields.longitude.label}</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl glass-input"
              value={formData.longitude}
              onChange={(e) => setFormData({...formData, longitude: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleLocation}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <MapPin size={16} /> {t.form.actions.getLocation}
        </button>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? t.form.actions.submitting : <><Send size={18} /> {t.form.actions.submit}</>}
        </button>
      </form>
    </motion.div>
  );
}
