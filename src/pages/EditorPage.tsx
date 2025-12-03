import React from 'react';
import { Canvas } from '../components/editor/Canvas';
import { Inspector } from '../components/editor/Inspector';

export const EditorPage: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <Canvas />
      <div className="w-80 border-l border-neutral-800 bg-neutral-900 p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4 text-sm tracking-wider text-neutral-500 uppercase">Properties</h2>
        <Inspector />
      </div>
    </div>
  );
};
