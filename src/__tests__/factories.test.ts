import { describe, it, expect } from 'vitest';
import { createOverlayComponent } from '../state/factories/overlayComponentFactory';
import type { OverlayComponent } from '../types/overlay';

describe('OverlayComponentFactory', () => {
  it('should create a marquee component with correct defaults', () => {
    const components: OverlayComponent[] = [];
    const component = createOverlayComponent('marquee', components, 1920, 1080);

    expect(component.type).toBe('marquee');
    expect(component.width).toBe(1920);
    expect(component.height).toBe(60);
    expect(component.props).toHaveProperty('text');
    expect(component.loop).toBe(true);
  });

  it('should offset new components if one exists', () => {
    const existing: OverlayComponent = {
        id: '1',
        type: 'marquee',
        name: 'M1',
        x: 0, y: 0, width: 100, height: 100, zIndex: 1, loop: true,
        props: { text: 'test', speed: 50 }
    };
    
    const component = createOverlayComponent('marquee', [existing], 1920, 1080);
    
    // Base calc: (1920/2 - 1920/2) + 20 = 0 + 20 = 20
    // Wait, default marquee width is 1920. 1920/2 - 1920/2 = 0.
    // Offset is count * 20. count=1. so x should be 20.
    expect(component.x).toBe(20);
  });

  it('should create journal component', () => {
    const components: OverlayComponent[] = [];
    const component = createOverlayComponent('journal', components, 1920, 1080);
    
    expect(component.type).toBe('journal');
    expect(component.props).toHaveProperty('data');
    expect(Array.isArray((component.props as any).data)).toBe(true);
  });
});


