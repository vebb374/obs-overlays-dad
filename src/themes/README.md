# Theme System

The trident-obs-overlay system supports a flexible theming architecture that allows for simple color customization as well as complex, fully custom visual overlays with React components and animations.

## Creating a New Theme

1.  **Create a Theme Directory**: Create a new directory in `src/themes/` (e.g., `src/themes/myNewTheme/`).
2.  **Create an Index File**: Create `index.ts` in your new directory. This will export your theme configuration.
3.  **Register the Theme**: Import and add your theme to the `THEMES` registry in `src/themes/index.ts`.

### Basic Theme Structure

A minimal theme only requires defining colors and fonts:

```typescript
// src/themes/myNewTheme/index.ts
import type { Theme } from '../../types/theme';

export const myNewTheme: Theme = {
  id: 'my-new-theme',
  name: 'My New Theme',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#ffffff',
    accent: '#3b82f6',
    secondary: '#1f2937',
    border: '#374151',
    surface: '#111827',
    positive: '#10b981',
    negative: '#ef4444',
  },
  fontFamily: 'Inter, sans-serif',
};
```

## Advanced Theming

For elaborate themes like "Gold Coins" or "Cyberpunk", you can add custom assets, CSS, and wrapper components.

### 1. Custom Assets and CSS

*   Place SVGs, images, and CSS files in your theme directory.
*   Import CSS files in your components or `index.ts`.
*   Create React components for custom visual elements (e.g., `AnimatedCoin.tsx`).

### 2. Wrapper Components

You can wrap the entire overlay (and editor canvas) with a custom React component. This is perfect for:
*   Animated backgrounds (particles, video loops).
*   Foreground overlays (frames, screen effects).
*   Global layout changes.

**How to use:**

1.  Create a wrapper component (e.g., `MyBackground.tsx`) that accepts `children`.
2.  Add it to your theme definition using the `wrapperComponent` property.

```typescript
// src/themes/myNewTheme/MyBackground.tsx
import React from 'react';
import './styles.css'; // Custom animations

export const MyBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="my-custom-background">
      <div className="animated-particles" />
      <div className="content-layer">
        {children}
      </div>
    </div>
  );
};
```

```typescript
// src/themes/myNewTheme/index.ts
import { MyBackground } from './MyBackground';

export const myNewTheme: Theme = {
  // ... properties ...
  wrapperComponent: MyBackground,
};
```

### 3. Animation Overrides

You can customize Framer Motion animations for standard components (Marquee, Journal, Media) by providing `animations` presets in the theme object.

```typescript
animations: {
  journal: {
    container: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0 }
    },
    item: { /* ... */ }
  }
}
```

## Best Practices

*   **Scoped CSS**: Use unique class names (e.g., prefix with `theme-name-`) or CSS Modules to avoid conflicts.
*   **Performance**: Avoid heavy computations in the main render loop. Use `React.memo` and `useMemo` for complex animations.
*   **Assets**: Keep assets lightweight (optimized SVGs, compressed images) as they load in the browser source.


