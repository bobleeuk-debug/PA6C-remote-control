import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, Square, RefreshCcw } from 'lucide-react';
import { RobotState } from '../types';
import { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Language, translations } from '../i18n';

interface ControlPanelProps {
  state: RobotState;
  onCommand: (type: string, payload?: any) => void;
  language: Language;
}

export function ControlPanel({ state, onCommand, language }: ControlPanelProps) {
  const t = translations[language];
  const [confirmType, setConfirmType] = useState<'front' | 'left' | 'right' | null>(null);
  const isProcessing = state.status === 'entering' || state.status === 'exiting';

  const handleCommandWithConfirm = (type: 'enter_front' | 'enter_left' | 'enter_right') => {
    const map = {
      enter_front: 'front',
      enter_left: 'left',
      enter_right: 'right'
    } as const;
    setConfirmType(map[type]);
  };

  const confirmAndSend = () => {
    if (confirmType) {
      const commandMap = {
        front: 'enter_front',
        left: 'enter_left',
        right: 'enter_right'
      } as const;
      onCommand(commandMap[confirmType]);
      setConfirmType(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Placeholder for Video */}
      <div className="absolute inset-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center -z-10">
        <div className="text-slate-700 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-slate-600 animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Video Stream Placeholder</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-2xl z-20"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                {state.status === 'entering' ? t.entering : t.exiting}
              </h3>
              <span className="text-slate-500 text-[10px] font-mono uppercase">{t.step}: {state.process_step}</span>
            </div>

            <div className="space-y-4">
              {/* Simple Progress Bar */}
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-500"
                  animate={{ width: '60%' }} // Mock progress
                />
              </div>

              <div className="flex items-center gap-3 text-cyan-400">
                <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span className="text-sm font-medium">{state.process_step || t.initializing}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 w-full max-w-xl z-10"
          >
            {/* Main Action Buttons */}
            <button 
              onClick={() => handleCommandWithConfirm('enter_front')}
              className="col-span-2 h-24 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-8 h-8 text-slate-900 fill-slate-900" />
              <span className="text-slate-900 font-black uppercase tracking-widest text-sm">{t.enterFront}</span>
            </button>

            <button 
              onClick={() => onCommand('exit_car')}
              className="h-20 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-amber-500/20"
            >
              <ChevronRight className="w-6 h-6 text-slate-900 rotate-180" />
              <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">{t.exit}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleCommandWithConfirm('enter_left')}
                className="h-20 bg-slate-700 hover:bg-slate-600 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <span className="text-cyan-400 font-bold uppercase tracking-tighter text-[10px]">{t.enterLeft}</span>
              </button>
              <button 
                onClick={() => handleCommandWithConfirm('enter_right')}
                className="h-20 bg-slate-700 hover:bg-slate-600 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <span className="text-cyan-400 font-bold uppercase tracking-tighter text-[10px]">{t.enterRight}</span>
              </button>
            </div>

            <div className="col-span-2 flex gap-4 mt-4">
               <button 
                onClick={() => onCommand('stop')}
                className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Square className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">{t.stop}</span>
              </button>
              <button 
                onClick={() => onCommand('reset')}
                className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCcw className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">{t.reset}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmType && (
          <ConfirmationModal
            type={confirmType}
            onConfirm={confirmAndSend}
            onCancel={() => setConfirmType(null)}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
