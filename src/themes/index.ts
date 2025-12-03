import type { Theme } from '../types/theme';
import { darkModern } from './darkModern';
import { neonCyber } from './neonCyber';
import { cleanLight } from './cleanLight';
import { midnightBlue } from './midnightBlue';
import { forestGlass } from './forestGlass';
import { crimsonEsports } from './crimsonEsports';
import { royalGold } from './royalGold';
import { slateMinimalist } from './slateMinimalist';
import { retroWave } from './retroWave';
import { broadcastSports } from './broadcastSports';

// Registry
export const THEMES: Record<string, Theme> = {
  [darkModern.id]: darkModern,
  [neonCyber.id]: neonCyber,
  [cleanLight.id]: cleanLight,
  [midnightBlue.id]: midnightBlue,
  [forestGlass.id]: forestGlass,
  [crimsonEsports.id]: crimsonEsports,
  [royalGold.id]: royalGold,
  [slateMinimalist.id]: slateMinimalist,
  [retroWave.id]: retroWave,
  [broadcastSports.id]: broadcastSports,
};

export const registerTheme = (theme: Theme) => {
  THEMES[theme.id] = theme;
};

export const getTheme = (id: string): Theme => {
  return THEMES[id] || darkModern;
};

export const getAllThemes = (): Theme[] => {
  return Object.values(THEMES);
};
