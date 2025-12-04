import type { Variants } from "framer-motion";
import type { ComponentType as ReactComponentType, ReactNode } from "react";

export type ComponentType = 'marquee' | 'journal' | 'media';

export interface JournalData {
  day: string;
  profit: number;
}

export interface MarqueeProps {
  text: string;
  speed: number;
  separator?: string;
  fontFamily?: string;
}

export interface JournalProps {
  heading?: string;
  subHeading?: string;
  data: JournalData[];
  showTotal?: boolean;
  fontFamily?: string;
}

export interface MediaProps {
  src?: string;
  fileName?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
}

export type ComponentProps = MarqueeProps | JournalProps | MediaProps;

export interface AnimationPreset {
  container?: Variants;
  item?: Variants;
  exit?: Variants;
  transition?: Record<string, unknown>;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string; // transparent for OBS usually
    text: string;
    accent: string;
    secondary: string;
    border: string;
    surface: string;
    positive: string;
    negative: string;
  };
  fontFamily: string;
  
  // Assets
  assets?: {
    background?: string; // URL or base64
    overlay?: string;
  };

  // Animation overrides
  animations?: {
    journal?: AnimationPreset;
    marquee?: AnimationPreset;
    media?: AnimationPreset;
  };

  // Component overrides
  wrapperComponent?: ReactComponentType<{ children: ReactNode }>;
}
