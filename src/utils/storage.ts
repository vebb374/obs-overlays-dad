import { useOverlayStore } from '../state/useOverlayStore';

export const exportConfig = () => {
  const state = useOverlayStore.getState();
  const config = {
    components: state.components,
    activeThemeId: state.activeThemeId,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    version: 1,
  };
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trident-overlay-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importConfig = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.version === 1) {
          useOverlayStore.setState({
             components: config.components,
             activeThemeId: config.activeThemeId,
             canvasWidth: config.canvasWidth || 1920,
             canvasHeight: config.canvasHeight || 1080,
          });
          resolve();
        } else {
          reject(new Error('Unknown config version'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

