import React from 'react';
import type { Child } from '../../types';
import { motion } from 'framer-motion';
import { Gift, X } from 'lucide-react';

interface BirthdayBannerProps {
  child: Child;
  onDismiss: () => void;
}

const confettiColors = ['#4A90E2', '#50E3C2', '#F5A623', '#F87171', '#A78BFA'];

const ConfettiPiece: React.FC<{ i: number }> = ({ i }) => {
  const xStart = Math.random() * 100;
  const xEnd = xStart + (Math.random() - 0.5) * 80;
  const yEnd = 150 + Math.random() * 50;
  const duration = 3 + Math.random() * 2;
  const delay = Math.random() * 1.5;
  const rotation = Math.random() * 360;
  const color = confettiColors[i % confettiColors.length];

  return (
    <motion.div
      className="absolute top-0"
      style={{
        left: `${xStart}%`,
        backgroundColor: color,
        width: Math.random() > 0.5 ? '8px' : '10px',
        height: Math.random() > 0.5 ? '8px' : '5px',
        borderRadius: Math.random() > 0.5 ? '999px' : '2px',
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: yEnd, opacity: 0, rotate: rotation }}
      transition={{ duration, delay, ease: 'easeOut' }}
    />
  );
};

const BirthdayBanner: React.FC<BirthdayBannerProps> = ({ child, onDismiss }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, padding: 0, margin: 0, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative bg-gradient-to-br from-primary to-secondary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} i={i} />)}
      </div>

      <div className="relative z-10 flex items-center space-x-4">
        <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
          <Gift className="h-7 w-7 text-white" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg">Joyeux Anniversaire, {child.name} !</h3>
          <p className="text-sm font-light">Nous vous souhaitons une merveilleuse journée !</p>
        </div>
        <button
          onClick={onDismiss}
          className="self-start p-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default BirthdayBanner;
