'use client';

import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 mb-8 mt-4">
      {/* Visual Logo Mark */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative flex items-center justify-center w-28 h-28"
      >
        {/* Deep pulse glow */}
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute inset-2 bg-sky-400 rounded-full blur-xl opacity-40 mix-blend-screen"></div>
        
        {/* Core SVG */}
        <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waterRescue" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" /> {/* sky-400 */}
              <stop offset="1" stopColor="#1e3a8a" /> {/* blue-900 */}
            </linearGradient>
            <linearGradient id="shieldAccent" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0ea5e9" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Droplet/Shield Base */}
          <path 
            d="M50 5 C75 35 90 60 90 75 C90 97 70 95 50 95 C30 95 10 97 10 75 C10 60 25 35 50 5 Z" 
            fill="url(#waterRescue)" 
            filter="url(#glass)"
          />
          
          {/* Glass/Reflective Overlay Path */}
          <path 
            d="M50 8 C72 36 86 60 86 75 C86 93 70 91 50 91 C30 91 14 93 14 75 C14 60 28 36 50 8 Z" 
            fill="url(#shieldAccent)" 
            className="mix-blend-overlay"
          />

          {/* Core Action Icon (Upward Arrow / Rescue Lift) */}
          <path 
            d="M50 30 L70 55 L60 55 L60 78 L40 78 L40 55 L30 55 Z" 
            fill="white" 
            className="opacity-95"
          />
        </svg>
      </motion.div>

      {/* Typography Mark */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col items-center leading-none text-center"
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-800 dark:text-white">
          Salv<span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-sky-400">Ação</span>
        </h1>
        <p className="mt-3 text-xs md:text-sm font-bold tracking-[0.25em] text-slate-400 uppercase">
          Plataforma de Coordenação
        </p>
      </motion.div>
    </div>
  );
}
