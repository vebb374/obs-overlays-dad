import React from 'react';
import { Canvas } from '../components/editor/Canvas';
import { Inspector } from '../components/editor/Inspector';

export const EditorPage: React.FC = () => {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <Canvas />
      <Inspector />
    </div>
  );
};
