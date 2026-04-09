import { useState, useEffect } from 'react';
import { useRobotSocket } from './hooks/useRobotSocket';
import { Joystick } from './components/Joystick';
import { StatusHeader } from './components/StatusHeader';
import { ControlPanel } from './components/ControlPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { DebugPanel } from './components/DebugPanel';
import { EmergencySlider } from './components/EmergencySlider';
import { QrCode, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Language, translations } from './i18n';

export default function App() {
  const { 
    isConnected, 
    isConnecting,
    robotState, 
    lastAlarm, 
    connect, 
    sendCommand, 
    updateJoystick,
    url
  } = useRobotSocket();

  const [language, setLanguage] = useState<Language>('zh');
  const t = translations[language];

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(true);
  const [connError, setConnError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws-mock`;
  });

  useEffect(() => {
    if (isConnected) {
      setShowConnectDialog(false);
      setConnError(null);
    }
  }, [isConnected]);

  const handleConnect = () => {
    setConnError(null);
    connect(inputUrl);
    
    // Check if still connecting after 6s
    setTimeout(() => {
      if (!isConnected) {
        setConnError(t.connFailed);
      }
    }, 6000);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-slate-200 flex flex-col overflow-hidden select-none font-sans">
      {/* Landscape Orientation Warning (CSS only) */}
      <div className="portrait:flex hidden fixed inset-0 z-[100] bg-slate-900 flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 border-4 border-cyan-500 rounded-xl animate-pulse flex items-center justify-center mb-6">
          <div className="w-12 h-6 border-2 border-cyan-500 rounded rotate-90" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">{t.rotateDevice}</h1>
        <p className="text-slate-400 text-sm">{t.landscapeOnly}</p>
      </div>

      <StatusHeader 
        isConnected={isConnected} 
        state={robotState} 
        alarm={lastAlarm}
        onConnect={() => setShowConnectDialog(true)}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="flex-1 flex relative">
        {/* Left Joystick Column */}
        <div className="w-64 flex items-center justify-center p-4 border-r border-slate-800/50 bg-slate-900/20">
          <Joystick 
            label={t.moveY} 
            axis="y" 
            onChange={(v) => updateJoystick({ move: v })} 
          />
        </div>

        {/* Center Control Area */}
        <ControlPanel 
          state={robotState} 
          onCommand={sendCommand} 
          language={language}
        />

        {/* Right Joystick Column */}
        <div className="w-64 flex flex-col items-center justify-center p-4 border-l border-slate-800/50 bg-slate-900/20 relative">
          <Joystick 
            label={t.turnX} 
            axis="x" 
            onChange={(v) => updateJoystick({ turn: v })} 
          />
          
          {/* Emergency Slider fixed at bottom right */}
          <div className="absolute bottom-6 right-6">
            <EmergencySlider 
              onConfirm={() => sendCommand('emergency_stop')} 
              language={language}
            />
          </div>
        </div>

        <SettingsPanel 
          isOpen={isSettingsOpen}
          onToggle={() => {
            setIsSettingsOpen(!isSettingsOpen);
            setIsDebugOpen(false);
          }}
          gear={robotState.gear}
          onGearChange={(g) => sendCommand('speed_gear', { gear: g })}
          onCommand={sendCommand}
          language={language}
        />

        <DebugPanel
          isOpen={isDebugOpen}
          onToggle={() => {
            setIsDebugOpen(!isDebugOpen);
            setIsSettingsOpen(false);
          }}
          onCommand={sendCommand}
          language={language}
        />
      </main>

      {/* Connection Dialog Overlay */}
      {showConnectDialog && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <QrCode className="text-cyan-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t.connectToRobot}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{t.softRemote}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.wsAddress}</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="ws://192.168.1.100:8080"
                  />
                </div>
              </div>

              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl text-slate-900 font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3"
              >
                {isConnecting && <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />}
                {isConnecting ? t.connecting : t.establishConnection}
              </button>

              {connError && (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase">{connError}</span>
                </div>
              )}

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[10px] text-slate-600 uppercase font-bold">{t.orScanQr}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors">
                <QrCode className="w-4 h-4" />
                {t.scanRobotQr}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Orientation */}
      <style>{`
        @media (orientation: portrait) {
          body { overflow: hidden; }
        }
      `}</style>
    </div>
  );
}
