import React, { useRef, useEffect } from 'react';
import { useOverlayStore, DEFAULT_THEMES } from '../../state/useOverlayStore';
import { Trash2, Link, MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine, Upload } from 'lucide-react';

export const Inspector: React.FC = () => {
  const { 
    components, 
    selectedComponentId, 
    updateComponent, 
    removeComponent, 
    activeThemeId, 
    setTheme,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    reorderComponent
  } = useOverlayStore();
  
  const selectedComponent = components.find(c => c.id === selectedComponentId);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  
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

  const handlePropChange = (key: string, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!selectedComponent) return;
    updateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [key]: value }
    });
  };
  
  const handleJournalDataChange = (index: number, field: 'day' | 'profit', value: string) => {
    if (!selectedComponent) return;
    const currentData = [...selectedComponent.props.data];
    if (field === 'profit') {
        currentData[index] = { ...currentData[index], profit: value === '' ? 0 : Number(value) }; 
    } else {
        currentData[index] = { ...currentData[index], day: value };
    }
    handlePropChange('data', currentData);
  };

  const handleNumericLayoutChange = (key: 'x' | 'y' | 'width' | 'height', value: string) => {
    if (!selectedComponent) return;
    if (value === '' || value === '-') return;
    const numVal = parseInt(value);
    if (!isNaN(numVal)) {
        updateComponent(selectedComponent.id, { [key]: numVal });
    }
  };

  const handleMediaFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedComponent) return;

    // For local session display, we could use blob URL: URL.createObjectURL(file)
    // But for persistence/export we need base64.
    // To solve the "why data:image..." complaint, we will still store base64 
    // (so export works) but SHOW the filename in the UI.
    // We can store the filename in props.fileName
    const reader = new FileReader();
    reader.onload = (event) => {
       const result = event.target?.result as string;
       if (result) {
           updateComponent(selectedComponent.id, {
               props: { 
                   ...selectedComponent.props, 
                   src: result,
                   fileName: file.name // Store filename for display
               },
               name: file.name
           });
       }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!selectedComponent) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-400 uppercase">Canvas Size</label>
          <div className="grid grid-cols-2 gap-2">
             <div>
                <span className="text-xs text-neutral-500">Width</span>
                <input 
                  type="number" 
                  value={canvasWidth}
                  onChange={(e) => setCanvasSize(Number(e.target.value), canvasHeight)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
                />
             </div>
             <div>
                <span className="text-xs text-neutral-500">Height</span>
                <input 
                  type="number" 
                  value={canvasHeight}
                  onChange={(e) => setCanvasSize(canvasWidth, Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
                />
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-400 uppercase">Theme</label>
          <div className="grid grid-cols-1 gap-2">
            {DEFAULT_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex items-center p-2 rounded border text-left ${
                  activeThemeId === theme.id 
                    ? 'bg-violet-900/30 border-violet-500 text-violet-200' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: theme.colors.accent }} />
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
        
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
            Use the URL of the preview page as a "Browser Source" in OBS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
         <div className="flex flex-col w-full mr-4">
           <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Component Name</label>
           <input 
             value={selectedComponent.name}
             onChange={(e) => updateComponent(selectedComponent.id, { name: e.target.value })}
             className="text-sm bg-neutral-800 border border-neutral-700 rounded px-2 py-1 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 w-full text-white"
             placeholder="Component Name"
           />
         </div>
         <button 
           onClick={() => removeComponent(selectedComponent.id)}
           className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-400/10 self-end mb-0.5"
           title="Delete Component"
         >
           <Trash2 size={16} />
         </button>
      </div>

      <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400 uppercase">Layer Order</label>
          <div className="flex gap-1">
              <button onClick={() => reorderComponent(selectedComponent.id, 'bottom')} className="flex-1 bg-neutral-800 hover:bg-neutral-700 p-1 rounded flex justify-center" title="Send to Back">
                  <ArrowDownToLine size={14} />
              </button>
               <button onClick={() => reorderComponent(selectedComponent.id, 'down')} className="flex-1 bg-neutral-800 hover:bg-neutral-700 p-1 rounded flex justify-center" title="Send Backward">
                  <MoveDown size={14} />
              </button>
               <button onClick={() => reorderComponent(selectedComponent.id, 'up')} className="flex-1 bg-neutral-800 hover:bg-neutral-700 p-1 rounded flex justify-center" title="Bring Forward">
                  <MoveUp size={14} />
              </button>
               <button onClick={() => reorderComponent(selectedComponent.id, 'top')} className="flex-1 bg-neutral-800 hover:bg-neutral-700 p-1 rounded flex justify-center" title="Bring to Front">
                  <ArrowUpToLine size={14} />
              </button>
          </div>
      </div>

      <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400 uppercase">Font</label>
          <select 
            value={selectedComponent.props.fontFamily || 'inherit'} 
            onChange={(e) => handlePropChange('fontFamily', e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm"
          >
            <option value="inherit">Theme Default</option>
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
          </select>
      </div>

      {selectedComponent.type === 'marquee' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Disclaimer Text</label>
            <textarea
              value={selectedComponent.props.text}
              onChange={(e) => handlePropChange('text', e.target.value)}
              className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm resize-none"
            />
          </div>
           <div className="space-y-1">
            <label className="text-xs text-neutral-400">Speed ({selectedComponent.props.speed})</label>
            <input
              type="range"
              min="10"
              max="200"
              value={selectedComponent.props.speed}
              onChange={(e) => handlePropChange('speed', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {selectedComponent.type === 'journal' && (
        <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-xs text-neutral-400 uppercase">Headings</label>
             <div className="grid grid-cols-1 gap-2">
                <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">Main Heading</span>
                    <input 
                        placeholder="Weekly Journal"
                        value={selectedComponent.props.heading || 'Weekly Journal'}
                        onChange={(e) => handlePropChange('heading', e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">Sub Heading</span>
                    <input 
                        placeholder="Current Week"
                        value={selectedComponent.props.subHeading || 'Current Week'}
                        onChange={(e) => handlePropChange('subHeading', e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
                    />
                </div>
             </div>
           </div>

           <div className="flex items-center gap-2 pt-2">
             <input
               type="checkbox"
               checked={selectedComponent.props.showTotal}
               onChange={(e) => handlePropChange('showTotal', e.target.checked)}
             />
             <label className="text-sm text-neutral-300">Show Weekly Total</label>
           </div>
           
           <div className="space-y-2">
             <label className="text-xs text-neutral-400 uppercase">Daily Profit</label>
             <div className="space-y-2">
               {selectedComponent.props.data.map((row: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                 <div key={idx} className="flex gap-2 items-center">
                   <input
                      className="w-12 bg-neutral-800 border border-neutral-700 rounded px-1 py-1 text-sm text-center"
                      value={row.day}
                      onChange={(e) => handleJournalDataChange(idx, 'day', e.target.value)}
                   />
                   <input
                      type="number"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
                      value={row.profit}
                      onChange={(e) => handleJournalDataChange(idx, 'profit', e.target.value)}
                   />
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {selectedComponent.type === 'media' && (
        <div className="space-y-4">
           <div className="space-y-1">
             <div className="flex justify-between items-center mb-1">
                 <label className="text-xs text-neutral-400">Source</label>
                 <button 
                   onClick={() => mediaInputRef.current?.click()}
                   className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 uppercase font-medium"
                 >
                    <Upload size={10} /> Upload File
                 </button>
                 <input 
                   type="file"
                   ref={mediaInputRef}
                   className="hidden"
                   accept="image/*,video/*"
                   onChange={handleMediaFileSelect}
                 />
             </div>
             
             {/* If it's a data URL, show the filename or "Image Data" instead of the raw string */}
             <input 
                value={selectedComponent.props.src?.startsWith('data:') 
                    ? (selectedComponent.props.fileName ? `Local File: ${selectedComponent.props.fileName}` : 'Embedded Image Data') 
                    : (selectedComponent.props.src || '')}
                onChange={(e) => {
                    // Allow pasting URL, but if it was data URL and they edit it, it resets
                    handlePropChange('src', e.target.value);
                    // Clear filename if manually edited
                    handlePropChange('fileName', undefined);
                }}
                placeholder="https://example.com/image.png"
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-neutral-300 truncate"
                // Make read-only if it's a local file to prevent confusion, or allow clearing?
                // Let's allow editing (e.g. clearing) but show the "friendly" name
             />
             <p className="text-[10px] text-neutral-500">
                {selectedComponent.props.src?.startsWith('data:') 
                    ? 'Image is embedded in configuration.' 
                    : 'Enter URL or upload file'}
             </p>
           </div>
           
           <div className="space-y-1">
             <label className="text-xs text-neutral-400">Fit Mode</label>
             <select 
               value={selectedComponent.props.objectFit || 'contain'}
               onChange={(e) => handlePropChange('objectFit', e.target.value)}
               className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm"
             >
               <option value="contain">Contain</option>
               <option value="cover">Cover</option>
               <option value="fill">Fill</option>
             </select>
           </div>
        </div>
      )}
      
      <div className="pt-4 border-t border-neutral-800 space-y-2">
          <label className="block text-xs font-medium text-neutral-400 uppercase">Layout</label>
           <div className="grid grid-cols-2 gap-2 text-xs">
             <div className="flex items-center gap-2">
                <span className="text-neutral-500 w-4">X</span>
                <input 
                  type="number" 
                  value={Math.round(selectedComponent.x)} 
                  onChange={(e) => handleNumericLayoutChange('x', e.target.value)}
                  className="bg-neutral-800 rounded px-1 py-0.5 w-full"
                />
             </div>
             <div className="flex items-center gap-2">
                <span className="text-neutral-500 w-4">Y</span>
                <input 
                  type="number" 
                  value={Math.round(selectedComponent.y)} 
                  onChange={(e) => handleNumericLayoutChange('y', e.target.value)}
                  className="bg-neutral-800 rounded px-1 py-0.5 w-full"
                />
             </div>
             <div className="flex items-center gap-2">
                <span className="text-neutral-500 w-4">W</span>
                <input 
                  type="number" 
                  value={Math.round(selectedComponent.width)} 
                  onChange={(e) => handleNumericLayoutChange('width', e.target.value)}
                  className="bg-neutral-800 rounded px-1 py-0.5 w-full"
                />
             </div>
             <div className="flex items-center gap-2">
                <span className="text-neutral-500 w-4">H</span>
                <input 
                  type="number" 
                  value={Math.round(selectedComponent.height)} 
                  onChange={(e) => handleNumericLayoutChange('height', e.target.value)}
                  className="bg-neutral-800 rounded px-1 py-0.5 w-full"
                />
             </div>
           </div>
      </div>
    </div>
  );
};
