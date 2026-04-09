import { motion, useMotionValue, animate } from 'motion/react';
import { useEffect, useRef } from 'react';

interface JoystickProps {
  label: string;
  axis: 'x' | 'y';
  onChange: (value: number) => void;
}

export function Joystick({ label, axis, onChange }: JoystickProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = 60;

  useEffect(() => {
    const unsubscribe = (axis === 'x' ? x : y).on('change', (v) => {
      const normalized = axis === 'y' ? -(v / radius) : (v / radius);
      onChange(Number(normalized.toFixed(2)));
    });
    return () => unsubscribe();
  }, [axis, onChange, x, y]);

  const handleDragEnd = () => {
    animate(x, 0, { type: 'spring', damping: 15, stiffness: 200 });
    animate(y, 0, { type: 'spring', damping: 15, stiffness: 200 });
    onChange(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={containerRef}
        className="relative w-40 h-40 rounded-full bg-slate-800/50 border-2 border-slate-700 flex items-center justify-center shadow-inner"
      >
        {/* Axis Guides */}
        <div className={`absolute ${axis === 'x' ? 'w-full h-0.5' : 'h-full w-0.5'} bg-slate-700/30`} />
        
        <motion.div
          drag
          dragConstraints={{ 
            left: axis === 'x' ? -radius : 0, 
            right: axis === 'x' ? radius : 0, 
            top: axis === 'y' ? -radius : 0, 
            bottom: axis === 'y' ? radius : 0 
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ x, y }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 border-2 border-slate-300 shadow-xl cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5" />
        </motion.div>
        
        {/* Decorative Ring */}
        <div className="absolute inset-4 rounded-full border border-slate-600/20 pointer-events-none" />
      </div>
      <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">{label}</span>
    </div>
  );
}
