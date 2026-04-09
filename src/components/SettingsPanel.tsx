import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Power, Shield, Zap, AlertCircle } from 'lucide-react';
import { Gear } from '../types';
import { Language, translations } from '../i18n';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  gear: Gear;
  onGearChange: (gear: Gear) => void;
  onCommand: (type: string, payload?: any) => void;
  language: Language;
}

export function SettingsPanel({ isOpen, onToggle, gear, onGearChange, onCommand, language }: SettingsPanelProps) {
  const t = translations[language];
  return (
    <>
      <button 
        onClick={onToggle}
        className="absolute bottom-6 left-[calc(50%-4rem)] -translate-x-1/2 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg z-30 hover:bg-slate-700 transition-colors"
      >
        <Settings className={`w-6 h-6 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 h-2/3 bg-slate-900 border-t border-slate-800 rounded-t-[2rem] z-40 p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">{t.systemSettings}</h2>
              <button onClick={onToggle} className="p-2 text-slate-500 hover:text-white"><X /></button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Gear Selection */}
              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> {t.speedGear}
                </label>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  {(['low', 'mid', 'high'] as Gear[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => onGearChange(g)}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        gear === g ? 'bg-cyan-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {g === 'low' ? t.low : g === 'mid' ? t.mid : t.high}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => onCommand('obstacle_avoidance', { state: true })}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <span className="text-[10px] text-slate-300 font-bold uppercase">{t.obstacleAvoid}</span>
                </button>
                <button 
                  onClick={() => onCommand('power', { state: true })}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors"
                >
                  <Power className="w-6 h-6 text-red-500" />
                  <span className="text-[10px] text-slate-300 font-bold uppercase">{t.systemPower}</span>
                </button>
              </div>

              {/* Dangerous Actions */}
              <div className="col-span-2 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => onCommand('emergency_enter')}
                  className="w-full py-4 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center justify-center gap-3 hover:bg-red-600/20 transition-colors group"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-red-500 font-black uppercase tracking-widest text-xs">{t.emergencyEnter}</span>
                </button>
                <p className="text-[9px] text-slate-600 mt-2 text-center italic">{t.emergencyWarning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
