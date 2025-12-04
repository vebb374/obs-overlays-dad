import React from 'react';
import { Link } from 'lucide-react';
import { useCanvasSelectors } from '../../../state/selectors';
import { ThemeSelector } from './ThemeSelector';

export const GlobalSettings: React.FC = () => {
  const { width, height, setCanvasSize } = useCanvasSelectors();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-neutral-400 uppercase">Canvas Size</label>
        <div className="grid grid-cols-2 gap-2">
           <div>
              <span className="text-xs text-neutral-500">Width</span>
              <input 
                type="number" 
                value={width}
                onChange={(e) => setCanvasSize(Number(e.target.value), height)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
              />
           </div>
           <div>
              <span className="text-xs text-neutral-500">Height</span>
              <input 
                type="number" 
                value={height}
                onChange={(e) => setCanvasSize(width, Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
              />
           </div>
        </div>
      </div>

      <ThemeSelector />
      
      <div className="pt-4 border-t border-neutral-800">
        <a 
           href="/preview" 
           target="_blank"
           className="flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm font-medium transition-colors"
        >
          <Link size={14} />
          Open Preview
        </a>
        <p className="mt-2 text-xs text-neutral-500 text-center">
          Use the URL of the preview page as a &quot;Browser Source&quot; in OBS.
        </p>
      </div>
    </div>
  );
};

