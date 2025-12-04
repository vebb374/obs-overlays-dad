import React, { useEffect } from 'react';
import { useSelectedComponent, useComponentSelectors } from '../../state/selectors';
import { GlobalSettings } from './inspector/GlobalSettings';
import { ComponentProperties } from './inspector/ComponentProperties';

export const Inspector: React.FC = () => {
  const selectedComponent = useSelectedComponent();
  const { removeComponent, selectedComponentId } = useComponentSelectors();
  
  // Global Delete key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedComponentId) return;
      // Check if focus is in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeComponent(selectedComponentId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, removeComponent]);

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="font-bold text-sm text-neutral-300 uppercase tracking-wider">
          {selectedComponent ? 'Properties' : 'Settings'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
        {selectedComponent ? <ComponentProperties /> : <GlobalSettings />}
      </div>
    </div>
  );
};
