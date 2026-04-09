import { motion } from 'motion/react';
import { Check, X, Info } from 'lucide-react';
import { Language, translations } from '../i18n';

interface ConfirmationModalProps {
  type: 'front' | 'left' | 'right';
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}

export function ConfirmationModal({ type, onConfirm, onCancel, language }: ConfirmationModalProps) {
  const t = translations[language];
  const config = {
    front: {
      title: t.confirmFront,
      desc: t.descFront,
      diagram: (
        <svg viewBox="0 0 200 120" className="w-full h-32">
          {/* Car */}
          <rect x="40" y="20" width="120" height="40" rx="4" className="fill-slate-700 stroke-slate-500" />
          <rect x="50" y="15" width="20" height="10" rx="2" className="fill-slate-600" />
          <rect x="130" y="15" width="20" height="10" rx="2" className="fill-slate-600" />
          <rect x="50" y="55" width="20" height="10" rx="2" className="fill-slate-600" />
          <rect x="130" y="55" width="20" height="10" rx="2" className="fill-slate-600" />
          
          {/* Robot */}
          <rect x="85" y="90" width="30" height="20" rx="2" className="fill-cyan-500/40 stroke-cyan-400 animate-pulse" />
          
          {/* Distance Line */}
          <line x1="100" y1="65" x2="100" y2="85" className="stroke-cyan-400 stroke-1 stroke-dasharray-[2,2]" />
          <text x="105" y="80" className="fill-cyan-400 text-[8px] font-mono">1.5m - 2m</text>
        </svg>
      )
    },
    left: {
      title: t.confirmLeft,
      desc: t.descLeft,
      diagram: (
        <svg viewBox="0 0 200 120" className="w-full h-32">
          {/* Car */}
          <rect x="80" y="20" width="80" height="80" rx="4" className="fill-slate-700 stroke-slate-500" />
          <rect x="75" y="30" width="10" height="20" rx="2" className="fill-slate-600" />
          <rect x="75" y="70" width="10" height="20" rx="2" className="fill-slate-600" />
          
          {/* Robot */}
          <rect x="25" y="50" width="20" height="30" rx="2" className="fill-cyan-500/40 stroke-cyan-400 animate-pulse" />
          
          {/* Distance Line */}
          <line x1="50" y1="65" x2="70" y2="65" className="stroke-cyan-400 stroke-1 stroke-dasharray-[2,2]" />
          <text x="52" y="60" className="fill-cyan-400 text-[8px] font-mono">50cm</text>
          
          {/* Alignment Line */}
          <line x1="20" y1="65" x2="180" y2="65" className="stroke-slate-500/30 stroke-1 stroke-dasharray-[4,4]" />
        </svg>
      )
    },
    right: {
      title: t.confirmRight,
      desc: t.descRight,
      diagram: (
        <svg viewBox="0 0 200 120" className="w-full h-32">
          {/* Car */}
          <rect x="40" y="20" width="80" height="80" rx="4" className="fill-slate-700 stroke-slate-500" />
          <rect x="115" y="30" width="10" height="20" rx="2" className="fill-slate-600" />
          <rect x="115" y="70" width="10" height="20" rx="2" className="fill-slate-600" />
          
          {/* Robot */}
          <rect x="155" y="50" width="20" height="30" rx="2" className="fill-cyan-500/40 stroke-cyan-400 animate-pulse" />
          
          {/* Distance Line */}
          <line x1="130" y1="65" x2="150" y2="65" className="stroke-cyan-400 stroke-1 stroke-dasharray-[2,2]" />
          <text x="132" y="60" className="fill-cyan-400 text-[8px] font-mono">50cm</text>
          
          {/* Alignment Line */}
          <line x1="20" y1="65" x2="180" y2="65" className="stroke-slate-500/30 stroke-1 stroke-dasharray-[4,4]" />
        </svg>
      )
    }
  };

  const current = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white text-xs font-bold uppercase tracking-wider">{current.title}</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-2">
            {current.diagram}
          </div>
          
          <p className="text-slate-300 text-xs leading-relaxed text-center">
            {current.desc}
          </p>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" /> {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-slate-900 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Check className="w-3 h-3" /> {t.confirmStart}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
