import React, { useState, useCallback, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Plus, Download, Upload, ChevronDown, Image, Type, List } from 'lucide-react';
import { useOverlayStore } from '../state/useOverlayStore';
import { exportConfig, importConfig } from '../utils/storage';

export const EditorLayout: React.FC = () => {
  const { addComponent } = useOverlayStore();
  const [toast, setToast] = useState<{ message: string, id: number } | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 3000);
  }, []);

  const handleAddComponent = (type: 'marquee' | 'journal' | 'media') => {
    addComponent(type);
    showToast(`Added new ${type} component`);
    setIsAddMenuOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    void (async () => {
      try {
        await importConfig(file);
        showToast('Configuration imported successfully');
      } catch (err) {
        showToast('Failed to import configuration');
        console.error(err);
      }
    })();
    
    // Reset input
    e.target.value = '';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    // If dropped a JSON file, try to import config
    const jsonFile = files.find(f => f.name.endsWith('.json'));
    if (jsonFile) {
       void (async () => {
         try {
           await importConfig(jsonFile);
           showToast('Configuration imported from dropped file');
         } catch (err) {
           // If import fails, continue to check for media
           console.error(err);
         }
       })();
       return;
    }

    // Handle media files
    let mediaCount = 0;
    for (const file of files) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
         const reader = new FileReader();
         reader.onload = (event) => {
            const result = event.target?.result as string;
            const id = addComponent('media');
            // Need to update the newly added component with the source
            // Since addComponent returns ID, we can do this via a custom action or direct store update if exposed.
            // Wait, my store's addComponent returns ID.
            if (id && result) {
                useOverlayStore.getState().updateComponent(id, { 
                   props: { 
                     src: result, 
                     objectFit: 'contain' 
                   },
                   name: file.name
                });
            }
         };
         reader.readAsDataURL(file);
         mediaCount++;
      }
    }

    if (mediaCount > 0) {
       showToast(`Imported ${mediaCount} media file(s)`);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen w-screen bg-neutral-900 text-white overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
       <header className="h-14 border-b border-neutral-800 flex items-center px-4 justify-between shrink-0 bg-neutral-950 relative z-50">
         <div className="flex items-center gap-6">
             <Link to="/" className="font-bold text-xl tracking-tight text-violet-400 hover:text-violet-300 transition-colors">Trident OBS Builder</Link>
             <div className="border-l border-neutral-800 pl-6 relative">
                <button 
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded text-sm transition-colors font-medium"
                >
                  <Plus size={16} />
                  <span>Add Widget</span>
                  <ChevronDown size={14} className={`transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isAddMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsAddMenuOpen(false)}
                    />
                    <div className="absolute top-full left-6 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button 
                        onClick={() => handleAddComponent('marquee')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-neutral-800 text-left transition-colors"
                      >
                        <Type size={16} className="text-blue-400" />
                        <div>
                          <div className="font-medium">Marquee Text</div>
                          <div className="text-xs text-neutral-500">Scrolling ticker</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => handleAddComponent('journal')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-neutral-800 text-left transition-colors"
                      >
                        <List size={16} className="text-yellow-400" />
                         <div>
                          <div className="font-medium">Weekly Journal</div>
                          <div className="text-xs text-neutral-500">Profit table</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => handleAddComponent('media')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-neutral-800 text-left transition-colors"
                      >
                        <Image size={16} className="text-purple-400" />
                         <div>
                          <div className="font-medium">Media</div>
                          <div className="text-xs text-neutral-500">Image or Video</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
             </div>
         </div>
         
         <div className="flex items-center gap-2">
             <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title="Import JSON Config"
             >
                <Upload size={14} />
                <span>Import</span>
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept=".json"
               onChange={handleFileImport}
             />
             
             <button 
                onClick={exportConfig}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title="Export JSON Config"
             >
                <Download size={14} />
                <span>Export</span>
             </button>
         </div>
       </header>
       
       <div className="flex flex-1 overflow-hidden relative">
         <Outlet />
         
         {/* Toast Notification */}
         {toast && (
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white px-4 py-2 rounded-full shadow-lg border border-neutral-700 text-sm animate-in fade-in slide-in-from-bottom-4 z-50">
             {toast.message}
           </div>
         )}
       </div>
    </div>
  );
};
