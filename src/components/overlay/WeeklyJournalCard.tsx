import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../../state/useOverlayStore';
import { cn } from '../../utils/cn';
import { useTimedVisibility } from '../../hooks/useTimedVisibility';

interface JournalData {
  day: string;
  profit: number;
}

interface WeeklyJournalCardProps {
  data: JournalData[];
  heading?: string;
  subHeading?: string;
  showTotal?: boolean;
  theme: Theme;
  width: number;
  height: number;
  fontFamily?: string;
  duration?: number;
  onscreenDuration?: number;
  offscreenDuration?: number;
  loop?: boolean;
}

export const WeeklyJournalCard: React.FC<WeeklyJournalCardProps> = ({
  data,
  heading = 'Weekly Journal',
  subHeading = 'Current Week',
  showTotal = true,
  theme,
  width,
  height,
  fontFamily,
  duration,
  onscreenDuration,
  offscreenDuration,
  loop = true
}) => {
  const total = data.reduce((acc, curr) => acc + curr.profit, 0);

  const formatCurrency = (val: number) => {
    return val > 0 ? `+${val}` : `${val}`;
  };

  // Visibility State Logic
  const isVisible = useTimedVisibility({
    duration: onscreenDuration ?? 0, // 0 means stay visible if logic inside hook handles it, but my hook logic treats >0 as timeout. 
                                     // If onscreenDuration is undefined, we probably want to stay visible unless loop is on?
                                     // The previous logic was: if onscreenDuration is set, hide after it. Else stay.
                                     // My hook logic: if duration > 0, hide after duration.
                                     // So if onscreenDuration is undefined (or 0), it stays visible. Correct.
    offscreenDuration,
    loop
  });


  const defaultContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: (duration ? duration / 1000 : 0.3)
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const defaultItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    },
    exit: { x: -20, opacity: 0, transition: { duration: 0.2 } }
  };

  const containerVariants = theme.animations?.journal?.container ?? defaultContainerVariants;
  const itemVariants = theme.animations?.journal?.item ?? defaultItemVariants;

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence mode="wait">
     {isVisible && (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={cn("flex flex-col overflow-hidden rounded-lg shadow-2xl backdrop-blur-sm")}
      style={{
        width,
        height, 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        fontFamily: fontFamily === 'inherit' ? theme.fontFamily : fontFamily,
        boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px ${theme.colors.border} inset`
      }}
    >
      {/* Header */}
      <motion.div 
        variants={headerVariants}
        className="text-center py-3 font-bold uppercase tracking-widest text-lg relative overflow-hidden"
        style={{ 
            backgroundColor: theme.colors.accent,
            color: theme.colors.background === 'rgba(0, 0, 0, 0)' ? '#ffffff' : theme.colors.background 
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
        <span className="relative z-10 drop-shadow-md">
          {heading}
        </span>
      </motion.div>
      
      {/* Date Range Subheader */}
      <motion.div 
        variants={headerVariants}
        className="text-center py-1.5 text-xs font-bold uppercase tracking-wider border-b"
        style={{ 
          backgroundColor: theme.colors.background === 'rgba(0, 0, 0, 0)' ? 'rgba(0,0,0,0.8)' : theme.colors.secondary, 
          color: theme.colors.text,
          borderColor: theme.colors.border
        }}
      >
        {subHeading}
      </motion.div>

      <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto no-scrollbar">
        {data.map((item, idx) => (
          <motion.div 
            key={`${idx}-${item.day}`}
            variants={itemVariants}
            className="flex justify-between items-center px-4 py-2.5 rounded-md relative group overflow-hidden transition-colors duration-200"
            style={{ 
              backgroundColor: `${theme.colors.border}40`, // 25% opacity
            }}
          >
              {/* Hover/Active indicator line */}
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: theme.colors.accent }} />
              
              <div className="flex items-center gap-3 pl-2">
                <span 
                  className="font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-sm"
                  style={{ 
                    backgroundColor: theme.colors.secondary, 
                    color: '#ffffff' 
                  }}
                >
                  {idx + 1}
                </span>
                <span className="font-bold uppercase text-sm tracking-wide" style={{ color: theme.colors.text }}>
                  {item.day}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="font-bold text-lg tabular-nums"
                  style={{ 
                    color: item.profit >= 0 ? theme.colors.positive : theme.colors.negative,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {formatCurrency(item.profit)}
                </span>
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider" style={{ color: theme.colors.text }}>PIPS</span>
            </div>
          </motion.div>
        ))}

        {showTotal && (
           <motion.div 
             variants={itemVariants}
             className="flex justify-between items-center px-4 py-3 mt-auto rounded-md shadow-lg relative overflow-hidden"
             style={{ 
               backgroundColor: theme.colors.accent,
               background: `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.secondary} 100%)`
             }}
           >
            <div className="absolute inset-0 bg-black/10" />
            <div className="flex items-center gap-3 relative z-10">
               <span className="font-bold w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white text-xs backdrop-blur-sm border border-white/20">
                 T
               </span>
               <span className="font-bold uppercase text-sm text-white tracking-wider">
                 Total
               </span>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="font-bold text-xl text-white drop-shadow-md tabular-nums">
                 {formatCurrency(total)}
              </span>
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">PIPS</span>
            </div>
           </motion.div>
        )}
      </div>
    </motion.div>
     )}
    </AnimatePresence>
  );
};
