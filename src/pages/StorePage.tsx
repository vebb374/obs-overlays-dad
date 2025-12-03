import React from 'react';
import { useOverlayStore } from '../state/useOverlayStore';
import { Trash2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StorePage: React.FC = () => {
  const { 
    components, 
    removeComponent, 
    addComponent, 
    updateComponent
  } = useOverlayStore();
  
  const duplicateComponent = (id: string) => {
    const comp = components.find(c => c.id === id);
    if (comp) {
      const newId = addComponent(comp.type, `${comp.name} (Copy)`);
      // Copy props manually since addComponent uses defaults
      updateComponent(newId, { 
        props: JSON.parse(JSON.stringify(comp.props)) as typeof comp.props,
        width: comp.width,
        height: comp.height
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-neutral-800 pb-6">
          <div>
             <h1 className="text-3xl font-bold text-violet-400">Overlay Store</h1>
             <p className="text-neutral-400 mt-2">Manage your library of overlay components</p>
          </div>
          <div className="flex gap-4">
             <Link to="/" className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors">
               Back to Editor
             </Link>
             <Link to="/preview" target="_blank" className="px-4 py-2 bg-violet-600 rounded hover:bg-violet-500 transition-colors">
               Live Preview
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map(comp => (
            <div key={comp.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col gap-4 hover:border-violet-500/50 transition-colors group">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${
                       comp.type === 'marquee' ? 'bg-blue-500/20 text-blue-400' :
                       comp.type === 'journal' ? 'bg-yellow-500/20 text-yellow-400' :
                       'bg-purple-500/20 text-purple-400'
                    }`}>
                       {comp.type === 'marquee' && 'M'}
                       {comp.type === 'journal' && 'J'}
                       {comp.type === 'media' && 'Img'}
                    </div>
                    <div>
                       <h3 className="font-semibold">{comp.name}</h3>
                       <span className="text-xs text-neutral-500 uppercase tracking-wider">{comp.type}</span>
                    </div>
                 </div>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => duplicateComponent(comp.id)}
                      className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                      title="Duplicate"
                    >
                       <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => removeComponent(comp.id)}
                      className="p-2 hover:bg-red-900/30 rounded text-neutral-400 hover:text-red-400"
                      title="Delete"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              
              <div className="bg-neutral-950 rounded p-3 text-xs text-neutral-500 space-y-1 font-mono">
                 <div>ID: {comp.id.slice(0, 8)}...</div>
                 <div>Pos: {Math.round(comp.x)}, {Math.round(comp.y)}</div>
                 <div>Size: {Math.round(comp.width)}x{Math.round(comp.height)}</div>
                 <div>Z-Index: {comp.zIndex}</div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-neutral-800 flex justify-between items-center">
                 <span className="text-xs text-neutral-400">
                    {comp.type === 'marquee' ? 'Text content...' : 
                     comp.type === 'journal' ? `${comp.props.data.length} entries` :
                     'Media source'}
                 </span>
                 <Link 
                   to={`/?select=${comp.id}`}
                   className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
                 >
                   Edit in Canvas
                 </Link>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <div className="border border-dashed border-neutral-800 rounded-lg p-4 flex flex-col justify-center items-center gap-4 min-h-[200px] hover:bg-neutral-900/50 transition-colors text-neutral-500 hover:text-neutral-300">
             <span className="text-sm">Add new component via Editor</span>
             <Link to="/" className="px-4 py-2 bg-neutral-800 rounded text-white text-sm">Go to Editor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
