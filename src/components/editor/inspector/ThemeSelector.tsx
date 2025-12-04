import React, { useState } from 'react';
import { Search, Palette, RotateCcw } from 'lucide-react';
import { getAllThemes } from '../../../themes';
import { useThemeSelectors } from '../../../state/selectors';
import type { Theme } from '../../../types/theme';

export const ThemeSelector: React.FC = () => {
  const { activeThemeId, setTheme, getActiveTheme, setThemeOverride, resetThemeOverrides } = useThemeSelectors();
  const [themeSearch, setThemeSearch] = useState('');
  const [isEditingColors, setIsEditingColors] = useState(false);
  
  const activeTheme = getActiveTheme();

  const filteredThemes = getAllThemes().filter(t => 
    t.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  const colorFields: (keyof Theme['colors'])[] = [
    'text', 'accent', 'secondary', 'border', 'surface', 'positive', 'negative', 'background'
  ];

  const renderColorPicker = (key: keyof Theme['colors']) => (
    <div key={key} className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-700">
      <span className="text-xs capitalize text-neutral-300">{key}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500">{activeTheme.colors[key]}</span>
        <input 
          type="color"
          value={activeTheme.colors[key]}
          onChange={(e) => setThemeOverride(key, e.target.value)}
          className="w-6 h-6 rounded overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <label className="block text-xs font-medium text-neutral-400 uppercase">Theme</label>
         <button 
            onClick={() => setIsEditingColors(!isEditingColors)}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors ${
                isEditingColors ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
         >
            <Palette size={12} />
            {isEditingColors ? 'Select Theme' : 'Edit Colors'}
         </button>
      </div>

      {isEditingColors ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-neutral-800">
                <span>Customizing {activeTheme.name}</span>
                <button 
                  onClick={resetThemeOverrides}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  title="Reset all color overrides"
                >
                    <RotateCcw size={10} /> Reset
                </button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {colorFields.map(renderColorPicker)}
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
