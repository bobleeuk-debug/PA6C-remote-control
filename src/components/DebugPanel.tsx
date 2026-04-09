import { motion, AnimatePresence } from 'motion/react';
import { Bug, X, Unlock, ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { useState } from 'react';
import { Language, translations } from '../i18n';

interface DebugPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onCommand: (type: string, payload?: any) => void;
  language: Language;
}

type MachineType = 'master' | 'slave' | 'dual';

export function DebugPanel({ isOpen, onToggle, onCommand, language }: DebugPanelProps) {
  const t = translations[language];
  const [isFrontArmOpen, setIsFrontArmOpen] = useState(false);
  const [isRearArmOpen, setIsRearArmOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineType>('dual');

  const handleFrontArm = (open: boolean) => {
    if (!open && isRearArmOpen) return; // Cannot close front if rear is open
    setIsFrontArmOpen(open);
    onCommand('debug_front_arm', { state: open });
  };

  const handleRearArm = (open: boolean) => {
    if (open && !isFrontArmOpen) return; // Cannot open rear if front is closed
    setIsRearArmOpen(open);
    onCommand('debug_rear_arm', { state: open });
  };

  const handleMachineSelect = (type: MachineType) => {
    setSelectedMachine(type);
    onCommand('debug_machine_select', { type });
  };

  return (
    <>
      <button 
        onClick={onToggle}
        className="absolute bottom-6 left-[calc(50%+4rem)] -translate-x-1/2 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg z-30 hover:bg-slate-700 transition-colors"
      >
        <Bug className={`w-6 h-6 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-12' : ''}`} />
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
              <h2 className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">{t.debugMode}</h2>
              <button onClick={onToggle} className="p-2 text-slate-500 hover:text-white"><X /></button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Arm Controls */}
              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" /> {t.openFrontArm} / {t.openRearArm}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Front Arm Controls */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleFrontArm(true)}
                      disabled={isFrontArmOpen}
                      className={`h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        isFrontArmOpen 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400/50 cursor-not-allowed' 
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">{t.openFrontArm}</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => handleFrontArm(false)}
                        disabled={!isFrontArmOpen || isRearArmOpen}
                        className={`w-full h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          !isFrontArmOpen
                            ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed'
                            : isRearArmOpen
                              ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">{t.closeFrontArm}</span>
                      </button>
                      {isFrontArmOpen && isRearArmOpen && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white text-[7px] px-1.5 py-0.5 rounded uppercase font-bold z-10">
                          {t.armConstraintClose}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rear Arm Controls */}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <button
                        onClick={() => handleRearArm(true)}
                        disabled={!isFrontArmOpen || isRearArmOpen}
                        className={`w-full h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          !isFrontArmOpen
                            ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed'
                            : isRearArmOpen
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400/50 cursor-not-allowed'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500'
                        }`}
                      >
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">{t.openRearArm}</span>
                      </button>
                      {!isFrontArmOpen && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white text-[7px] px-1.5 py-0.5 rounded uppercase font-bold z-10">
                          {t.armConstraintOpen}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRearArm(false)}
                      disabled={!isRearArmOpen}
                      className={`h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        !isRearArmOpen
                          ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">{t.closeRearArm}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Machine Selection */}
              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" /> {t.machineSelect}
                </label>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  {(['master', 'slave', 'dual'] as MachineType[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleMachineSelect(m)}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        selectedMachine === m ? 'bg-cyan-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {m === 'master' ? t.master : m === 'slave' ? t.slave : t.dual}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => onCommand('dual_unlock')}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-3 transition-colors group"
                >
                  <Unlock className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">{t.dualUnlock}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
