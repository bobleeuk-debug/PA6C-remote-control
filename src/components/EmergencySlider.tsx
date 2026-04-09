import { motion, useMotionValue, useTransform } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n';

interface EmergencySliderProps {
  onConfirm: () => void;
  language: Language;
}

export function EmergencySlider({ onConfirm, language }: EmergencySliderProps) {
  const t = translations[language];
  const x = useMotionValue(0);
  const width = 200;
  const handleWidth = 60;
  const threshold = width - handleWidth - 10;
  
  const opacity = useTransform(x, [0, threshold], [1, 0]);
  const bgOpacity = useTransform(x, [0, threshold], [0.1, 0.3]);

  return (
    <div className="relative w-[200px] h-14 bg-red-950/20 border border-red-900/30 rounded-full overflow-hidden flex items-center px-1">
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-red-500/60 text-[10px] font-bold uppercase tracking-tighter">{t.slideStop}</span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: width - handleWidth - 8 }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={() => {
          if (x.get() >= threshold) {
            onConfirm();
          }
          x.set(0);
        }}
        style={{ x }}
        className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
      >
        <AlertTriangle className="text-white w-6 h-6" />
      </motion.div>
      
      <motion.div 
        style={{ width: x, opacity: bgOpacity }}
        className="absolute left-0 top-0 bottom-0 bg-red-600 rounded-l-full"
      />
    </div>
  );
}
