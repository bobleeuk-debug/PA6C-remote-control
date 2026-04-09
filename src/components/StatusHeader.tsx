import { Battery, Wifi, WifiOff, AlertCircle, Languages } from 'lucide-react';
import { RobotState } from '../types';
import { Language, translations } from '../i18n';

interface StatusHeaderProps {
  isConnected: boolean;
  state: RobotState;
  alarm: string | null;
  onConnect: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export function StatusHeader({ isConnected, state, alarm, onConnect, language, onToggleLanguage }: StatusHeaderProps) {
  const t = translations[language];

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onConnect}>
          {isConnected ? (
            <Wifi className="w-4 h-4 text-cyan-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
          )}
          <span className={`text-[10px] font-mono uppercase tracking-widest ${isConnected ? 'text-cyan-400' : 'text-red-500'}`}>
            {isConnected ? t.connected : t.disconnected}
          </span>
        </div>
        
        <div className="h-4 w-px bg-slate-800" />
        
        <div className="flex items-center gap-2">
          <Battery className={`w-4 h-4 ${state.battery < 20 ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
          <span className="text-[10px] font-mono text-slate-300">{state.battery}%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {alarm && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded animate-pulse">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-[10px] text-red-500 font-bold uppercase">{alarm}</span>
          </div>
        )}

        <button 
          onClick={onToggleLanguage}
          className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
        >
          <Languages className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-bold text-slate-300 uppercase">{language === 'zh' ? 'EN' : '中文'}</span>
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase">{t.robotStatus}</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              {state.status === 'idle' ? t.idle : state.status === 'entering' ? t.entering : state.status === 'exiting' ? t.exiting : state.status === 'stopped' ? t.stopped : state.status}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase">{t.gear}</span>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
              {state.gear === 'low' ? t.low : state.gear === 'mid' ? t.mid : t.high}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
