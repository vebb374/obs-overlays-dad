import { v4 as uuidv4 } from 'uuid';
import type { ComponentType } from '../../types/theme';
import type { OverlayComponent } from '../../types/overlay';

export const createOverlayComponent = (
  type: ComponentType, 
  existingComponents: OverlayComponent[], 
  canvasWidth: number, 
  canvasHeight: number,
  name?: string
): OverlayComponent => {
  const id = uuidv4();
  
  // Calculate safe offset based on existing components of same type
  const existingCount = existingComponents.filter(c => c.type === type).length;
  const offset = existingCount * 20;
  
  const defaultSize = type === 'marquee'
      ? { width: 1920, height: 60 }
      : type === 'media' ? { width: 400, height: 300 }
      : { width: 300, height: 400 };
  
  const defaultDuration = type === 'marquee' ? 20000 : 5000;

  // Position center-ish with offset
  const startX = (canvasWidth / 2 - defaultSize.width / 2) + offset;
  const startY = (canvasHeight / 2 - defaultSize.height / 2) + offset;
  
  // Determine max zIndex
  const maxZ = existingComponents.length > 0 ? Math.max(...existingComponents.map(c => c.zIndex)) : 0;
  
  const baseComponent = {
    id,
    name: name ?? `${type.charAt(0).toUpperCase() + type.slice(1)} ${existingCount + 1}`,
    x: startX,
    y: startY,
    zIndex: maxZ + 1,
    duration: defaultDuration,
    ...defaultSize,
    loop: true, // Default loop to true
  };
  
  if (type === 'marquee') {
    return {
      ...baseComponent,
      type: 'marquee',
      onscreenDuration: 20000, // Default 20s onscreen
      offscreenDuration: 5000, // Default 5s offscreen
      props: {
        text: 'New Marquee Text',
        speed: 50,
        separator: ' • ',
        fontFamily: 'inherit'
      }
    };
  } else if (type === 'journal') {
    return {
      ...baseComponent,
      type: 'journal',
      onscreenDuration: 10000, // Default 10s onscreen
      offscreenDuration: 5000, // Default 5s offscreen
      props: {
        heading: 'Weekly Journal',
        subHeading: 'Week ' + (existingCount + 1),
        data: [
          { day: 'Mon', profit: 0 },
          { day: 'Tue', profit: 0 },
          { day: 'Wed', profit: 0 },
          { day: 'Thu', profit: 0 },
          { day: 'Fri', profit: 0 },
        ],
        showTotal: true,
        fontFamily: 'inherit'
      }
    };
  } else {
    return {
      ...baseComponent,
      type: 'media',
      props: {
        src: '',
        objectFit: 'contain' as const
      }
    };
  }
};

export const INITIAL_COMPONENTS: OverlayComponent[] = [
  {
    id: 'default-marquee',
    type: 'marquee',
    name: 'Disclaimer',
    x: 0,
    y: 1020, // Bottom of 1080p screen
    width: 1920,
    height: 60,
    zIndex: 1,
    duration: 20000,
    loop: true,
    onscreenDuration: 20000,
    offscreenDuration: 5000,
    props: { 
      text: 'DISCLAIMER: Not financial advice. For educational purposes only.', 
      speed: 50, 
      separator: ' • ',
      fontFamily: 'inherit'
    }
  },
  {
    id: 'default-journal',
    type: 'journal',
    name: 'Weekly Journal',
    x: 50,
    y: 50,
    width: 300,
    height: 400,
    zIndex: 2,
    duration: 5000,
    loop: true,
    onscreenDuration: 10000,
    offscreenDuration: 5000,
    props: { 
      heading: 'Weekly Journal',
      subHeading: 'Current Week',
      data: [
        { day: 'Mon', profit: 110 },
        { day: 'Tue', profit: 913 },
        { day: 'Wed', profit: 0 },
        { day: 'Thu', profit: 0 },
        { day: 'Fri', profit: 0 },
      ],
      showTotal: true,
      fontFamily: 'inherit'
    }
  }
];

