import type { MarqueeProps, JournalProps, MediaProps } from './theme';

export interface BaseOverlayComponent {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  duration?: number; // Animation loop duration in ms
  loop: boolean;
}

export interface MarqueeComponent extends BaseOverlayComponent {
  type: 'marquee';
  props: MarqueeProps;
  onscreenDuration?: number; // ms
  offscreenDuration?: number; // ms
}

export interface JournalComponent extends BaseOverlayComponent {
  type: 'journal';
  props: JournalProps;
  onscreenDuration?: number; // ms
  offscreenDuration?: number; // ms
}

export interface MediaComponent extends BaseOverlayComponent {
  type: 'media';
  props: MediaProps;
}

export type OverlayComponent = MarqueeComponent | JournalComponent | MediaComponent;


