// storage utilities
import { useOverlayStore, type OverlayState } from '../state/useOverlayStore';
import type { OverlayComponent } from '../types/overlay';
import type { Theme } from '../types/theme';

const SCENE_VERSION = 1;

export interface SceneConfig {
  version: number;
  updatedAt?: number;
  components: OverlayComponent[];
  activeThemeId: string;
  themeOverrides?: Partial<Theme['colors']>;
  canvasWidth: number;
  canvasHeight: number;
}

export const createSceneSnapshot = (state?: OverlayState): SceneConfig => {
  const snapshot = state ?? useOverlayStore.getState();
  return {
    version: SCENE_VERSION,
    updatedAt: Date.now(),
    components: snapshot.components,
    activeThemeId: snapshot.activeThemeId,
    themeOverrides: snapshot.themeOverrides,
    canvasWidth: snapshot.canvasWidth,
    canvasHeight: snapshot.canvasHeight,
  };
};

export const applySceneConfig = (config: SceneConfig) => {
  useOverlayStore.setState({
    components: Array.isArray(config.components) ? config.components : [],
    activeThemeId: config.activeThemeId ?? 'dark-modern',
    themeOverrides: config.themeOverrides ?? {},
    canvasWidth: config.canvasWidth ?? 1920,
    canvasHeight: config.canvasHeight ?? 1080,
  });
};

export const normalizeConfig = (value: unknown): SceneConfig => {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid scene file');
  }

  const candidate = value as Partial<SceneConfig>;
  if (candidate.version !== SCENE_VERSION) {
    throw new Error(`Unsupported scene version: ${candidate.version}`);
  }

  if (!Array.isArray(candidate.components)) {
    throw new Error('Scene file is missing components');
  }

  return {
    version: SCENE_VERSION,
    updatedAt: typeof candidate.updatedAt === 'number' ? candidate.updatedAt : undefined,
    components: candidate.components,
    activeThemeId:
      typeof candidate.activeThemeId === 'string' && candidate.activeThemeId.length > 0
        ? candidate.activeThemeId
        : 'dark-modern',
    themeOverrides: typeof candidate.themeOverrides === 'object' ? candidate.themeOverrides : {},
    canvasWidth: typeof candidate.canvasWidth === 'number' ? candidate.canvasWidth : 1920,
    canvasHeight: typeof candidate.canvasHeight === 'number' ? candidate.canvasHeight : 1080,
  };
};

export const exportConfig = () => {
  const config = createSceneSnapshot();
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trident-overlay-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importConfig = async (file: File) => {
  const text = await file.text();
  const parsed = normalizeConfig(JSON.parse(text));
  applySceneConfig(parsed);
};

export const importConfigFromText = (text: string) => {
  const parsed = normalizeConfig(JSON.parse(text));
  applySceneConfig(parsed);
  return parsed;
};

export const loadSceneFromUrl = async (sceneUrl: string, init?: RequestInit) => {
  const response = await fetch(sceneUrl, { cache: 'no-store', ...init });
  if (!response.ok) {
    throw new Error(`Unable to load scene file (${response.status})`);
  }

  const parsed = normalizeConfig(await response.json());
  applySceneConfig(parsed);
  return parsed;
};

export const saveSceneToBackend = async () => {
  const config = createSceneSnapshot();
  // Update timestamp for this save
  config.updatedAt = Date.now();

  const response = await fetch('/api/scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to save scene');
  }

  return config;
};
