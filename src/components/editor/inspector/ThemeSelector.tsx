import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { getAllThemes } from '../../../themes';
import { useThemeSelectors } from '../../../state/selectors';

export const ThemeSelector: React.FC = () => {
  const { activeThemeId, setTheme } = useThemeSelectors();
  const [themeSearch, setThemeSearch] = useState('');

  const filteredThemes = getAllThemes().filter(t => 
    t.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
         <label className="block text-xs font-medium text-neutral-400 uppercase">Theme</label>
         <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
               value={themeSearch}
               onChange={(e) => setThemeSearch(e.target.value)}
               placeholder="Search themes..."
               className="bg-neutral-800 border border-neutral-700 rounded-full pl-6 pr-2 py-0.5 text-xs w-32 focus:w-40 transition-all"
            />
         </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`flex items-center p-2 rounded border text-left transition-all ${
              activeThemeId === theme.id 
                ? 'bg-violet-900/30 border-violet-500 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-750'
            }`}
          >
            <div className="w-8 h-8 rounded mr-3 shadow-inner flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}>
               <span style={{ color: theme.colors.accent }}>Ag</span>
            </div>
            <div className="flex-1">
               <div className="text-sm font-medium">{theme.name}</div>
               <div className="flex gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.positive }} />
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

