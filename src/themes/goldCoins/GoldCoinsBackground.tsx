import React from 'react';
import './animations.css';

interface GoldCoinsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showCoins?: boolean; // Kept for interface compatibility but unused
  showSparkles?: boolean; // Kept for interface compatibility but unused
  coinCount?: number; // Kept for interface compatibility but unused
}

export const GoldCoinsBackground: React.FC<GoldCoinsBackgroundProps> = ({
  children,
  className = '',
}) => {
  // Dimensions for the frame
  const sidebarWidth = '40px';
  const bottomBarHeight = '60px';
  const topBarHeight = '40px';

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      
      {/* --- Elegant Dark Frame Layout --- */}
      
      {/* Left Sidebar */}
      <div 
        className="absolute left-0 top-0 bottom-0 gold-sidebar-bg z-0"
        style={{ width: sidebarWidth }}
      />

      {/* Right Sidebar */}
      <div 
        className="absolute right-0 top-0 bottom-0 gold-sidebar-bg-right z-0"
        style={{ width: sidebarWidth }}
      />

      {/* Bottom Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 gold-bottom-bar z-0"
        style={{ height: bottomBarHeight }}
      />

      {/* Top Bar */}
      <div 
        className="absolute top-0 left-0 right-0 gold-top-bar z-0"
        style={{ height: topBarHeight }}
      />

      {/* --- The Metallic Borders --- */}
      
      {/* Outer Border Frame */}
      <div className="absolute inset-0 border border-[#996515] pointer-events-none z-10 opacity-50" />

      {/* Inner Frame Border (The "Hole" for Display Capture) */}
      <div 
        className="absolute z-20 pointer-events-none gold-frame-border"
        style={{
          top: topBarHeight,
          bottom: bottomBarHeight,
          left: sidebarWidth,
          right: sidebarWidth,
          background: 'transparent', // The center is clear
          boxShadow: 'inset 0 0 0 1px #D4AF37, 0 0 15px rgba(0,0,0,0.8)' // Metallic rim
        }}
      >
        {/* Minimal Corner Accents on the Inner Frame */}
        <div className="gold-corner-deco gold-corner-tl" />
        <div className="gold-corner-deco gold-corner-tr" />
        <div className="gold-corner-deco gold-corner-bl" />
        <div className="gold-corner-deco gold-corner-br" />
      </div>

      {/* --- Content Layer --- */}
      {/* 
          The content (Marquee, Journal) renders on top of the frame background 
          but the user must position them within the bars or sidebars if they want them there.
          We use z-30 to ensure they are clickable.
      */}
      <div className="relative z-30 w-full h-full pointer-events-none">
         {children}
      </div>
      
    </div>
  );
};
