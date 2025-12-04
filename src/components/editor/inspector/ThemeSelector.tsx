import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Palette, RotateCcw, Save, X } from 'lucide-react';
import { getAllThemes } from '../../../themes';
import { useThemeSelectors } from '../../../state/selectors';
import type { Theme } from '../../../types/theme';
import { useOverlayStore } from '../../../state/useOverlayStore';

export const ThemeSelector: React.FC = () => {
  const { activeThemeId, setTheme, getActiveTheme, setThemeOverride, resetThemeOverrides } = useThemeSelectors();
  const [themeSearch, setThemeSearch] = useState('');
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [previewOverrides, setPreviewOverrides] = useState<Partial<Theme['colors']>>({});
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Store original overrides to revert on cancel
  const [originalOverrides, setOriginalOverrides] = useState<Partial<Theme['colors']>>({});

  const activeTheme = getActiveTheme();
  
  // Merge preview overrides on top of active theme for display
  const previewTheme = {
    ...activeTheme,
    colors: {
      ...activeTheme.colors,
      ...previewOverrides
    }
  };

  const filteredThemes = getAllThemes().filter(t => 
    t.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  const colorFields: (keyof Theme['colors'])[] = [
    'text', 'accent', 'secondary', 'border', 'surface', 'positive', 'negative', 'background'
  ];

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    // Update local preview state
    const newOverrides = { ...previewOverrides, [key]: value };
    setPreviewOverrides(newOverrides);
    
    // Also immediately update the global store for real-time preview
    // This satisfies "see the color change when i am editing in real time"
    setThemeOverride(key, value);
  };
  
  const handleStartEditing = () => {
    const currentOverrides = useOverlayStore.getState().themeOverrides;
    setOriginalOverrides(currentOverrides);
    setPreviewOverrides(currentOverrides);
    setIsEditingColors(true);
  };

  const handleCancel = useCallback(() => {
    // Revert to original state
    resetThemeOverrides();
    Object.entries(originalOverrides).forEach(([key, value]) => {
       if (value) setThemeOverride(key as keyof Theme['colors'], value);
    });
    setIsEditingColors(false);
  }, [resetThemeOverrides, originalOverrides, setThemeOverride]);

  const handleSave = useCallback(() => {
    // Changes are already in store (real-time preview), so just exit mode
    setIsEditingColors(false);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    if (!isEditingColors) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        // Clicked outside - act as Save (keep changes and close)
        handleSave();
      }
    };

    // Use capture phase to detect clicks even if components like Canvas stop propagation
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isEditingColors, handleSave]);

  const renderColorPicker = (key: keyof Theme['colors']) => (
    <div key={key} className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-700">
      <span className="text-xs capitalize text-neutral-300">{key}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500">{previewTheme.colors[key]}</span>
        <input 
          type="color"
          value={previewTheme.colors[key]}
          onChange={(e) => handleColorChange(key, e.target.value)}
          className="w-6 h-6 rounded overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4" ref={editorRef}>
      <div className="flex justify-between items-center">
         <label className="block text-xs font-medium text-neutral-400 uppercase">Theme</label>
         {!isEditingColors && (
             <button 
                onClick={handleStartEditing}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800"
             >
                <Palette size={12} />
                Edit Colors
             </button>
         )}
      </div>

      {isEditingColors ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-neutral-800">
                <span>Customizing {activeTheme.name}</span>
                <button 
                  onClick={() => {
                      resetThemeOverrides();
                      setPreviewOverrides({});
                  }}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  title="Reset all color overrides"
                >
                    <RotateCcw size={10} /> Reset
                </button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {colorFields.map(renderColorPicker)}
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-neutral-800">
                <button 
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition-colors"
                >
                    <X size={14} />
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white shadow-sm transition-colors"
                >
                    <Save size={14} />
                    Save
                </button>
            </div>
        </div>
      ) : (
        <>
            <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                value={themeSearch}
                onChange={(e) => setThemeSearch(e.target.value)}
                placeholder="Search themes..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-full pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredThemes.map(theme => (
                <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    onDoubleClick={() => {
                      setTheme(theme.id);
                      handleStartEditing();
                    }}
                    className={`flex items-center p-2 rounded border text-left transition-all group ${
                    activeThemeId === theme.id 
                        ? 'bg-violet-900/20 border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.1)]' 
                        : 'bg-neutral-800 border-neutral-700/50 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-750'
                    }`}
                >
                    <div className="w-10 h-10 rounded mr-3 shadow-sm flex items-center justify-center text-xs font-bold relative overflow-hidden" style={{ backgroundColor: theme.colors.surface }}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: theme.colors.secondary }}></div>
                        <span style={{ color: theme.colors.accent, position: 'relative' }}>Ag</span>
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${activeThemeId === theme.id ? 'text-violet-300' : 'text-neutral-300 group-hover:text-white'}`}>{theme.name}</div>
                    <div className="flex gap-1.5 mt-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-black/20" style={{ backgroundColor: theme.colors.accent }} />
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-black/20" style={{ backgroundColor: theme.colors.secondary }} />
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-black/20" style={{ backgroundColor: theme.colors.surface }} />
                    </div>
                    </div>
                    {activeThemeId === theme.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 ml-2"></div>
                    )}
                </button>
                ))}
            </div>
        </>
      )}
    </div>
  );
};
