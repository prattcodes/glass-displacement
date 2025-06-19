# Glass Displacement Effect

A modern React application showcasing advanced glass displacement effects with SVG filters. This project demonstrates how to create beautiful, interactive glass morphism effects with configurable controls.

https://github.com/user-attachments/assets/47d711c6-16d8-4bd8-a318-fbd803bbdb1f

## Features

- 🎨 Multiple preset modes: Dock, Pill, Bubble, and Free
- 🔄 Real-time configuration controls
- 🖱️ Draggable glass panels
- 🌓 Light/Dark theme support
- 🎛️ Advanced SVG displacement filters
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Getting Started

1. Clone this repository or create a new React project:

```bash
# Using Vite
npm create vite@latest my-glass-effect -- --template react-ts

# Navigate to project directory
cd my-glass-effect
```

2. Install dependencies:

```bash
npm install gsap tweakpane
```

3. Set up the project structure:

```
src/
  ├── components/
  │   ├── BubbleComponent.tsx
  │   ├── ControlPanel.tsx
  │   ├── DisplacementFilter.tsx
  │   ├── DockComponent.tsx
  │   ├── FreeComponent.tsx
  │   └── PillComponent.tsx
  ├── styles/
  │   └── app.css
  ├── App.tsx
  └── main.tsx
```

## Implementation Guide

### 1. Set up the Displacement Filter

Create `DisplacementFilter.tsx`:

```tsx
import React from 'react';

const DisplacementFilter: React.FC = () => {
  return (
    <svg className="filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="filter" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="map" href="" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="redchannel" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
          <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="greenchannel" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
          <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="bluechannel" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
          <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur in="output" stdDeviation="0.7" />
        </filter>
      </defs>
    </svg>
  );
};

export default DisplacementFilter;
```

### 2. Create the Control Panel

Create `ControlPanel.tsx`:

```tsx
import React, { useEffect, useRef } from 'react';
import { Pane } from 'tweakpane';

interface ControlPanelProps {
  config: any;
  setConfig: (config: any) => void;
  presets: any;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, presets }) => {
  const paneContainerRef = useRef<HTMLDivElement>(null);
  const settingsFolderRef = useRef<any>(null);
  const paneRef = useRef<any>(null);

  useEffect(() => {
    if (paneContainerRef.current && !paneRef.current) {
      const pane = new Pane({
        title: 'Glass Controls',
        expanded: true,
        container: paneContainerRef.current,
      });

      paneRef.current = pane;

      const sync = () => {
        setConfig((prevConfig: any) => ({ ...prevConfig }));
      };

      // Add basic controls
      pane.addBinding(config, 'debug').on('change', sync);
      pane.addBinding(config, 'top').on('change', sync);
      pane.addBinding(config, 'preset', {
        label: 'mode',
        options: { dock: 'dock', pill: 'pill', bubble: 'bubble', free: 'free' },
      }).on('change', (ev: { value: string }) => {
        const newPreset = ev.value as keyof typeof presets;
        setConfig((prev: any) => ({ ...prev, ...presets[newPreset], preset: newPreset }));
      });

      // Add advanced settings
      const settings = pane.addFolder({
        title: 'settings',
        disabled: config.preset !== 'free',
        expanded: config.preset === 'free'
      });

      // Add all the configuration options
      settings.addBinding(config, 'frost', { min: 0, max: 1, step: 0.01 }).on('change', sync);
      settings.addBinding(config, 'icons').on('change', sync);
      settings.addBinding(config, 'width', { min: 80, max: 500, step: 1 }).on('change', sync);
      settings.addBinding(config, 'height', { min: 35, max: 500, step: 1 }).on('change', sync);
      // ... add other settings as needed
    }
  }, []);

  return <div ref={paneContainerRef} id="pane-container"></div>;
};

export default ControlPanel;
```

### 3. Implement the Main Component

Create `App.tsx`:

```tsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import DockComponent from './components/DockComponent';
import ControlPanel from './components/ControlPanel';
import DisplacementFilter from './components/DisplacementFilter';
import './styles/app.css';

gsap.registerPlugin(Draggable);

const DisplacementEffect = () => {
  const [config, setConfig] = useState({
    icons: true,
    scale: -180,
    radius: 16,
    border: 0.07,
    lightness: 50,
    displace: 0.2,
    blend: 'difference',
    x: 'R',
    y: 'B',
    alpha: 0.93,
    blur: 11,
    width: 336,
    height: 96,
    frost: 0.05,
    theme: 'system',
    debug: false,
    top: false,
    preset: 'dock',
  });

  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buildDisplacementImage = () => {
      const border = Math.min(config.width, config.height) * (config.border * 0.5);
      const svgMarkup = `<svg class="displacement-image" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${config.width}" height="${config.height}" fill="black"></rect>
        <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#red)" />
        <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#blue)" style="mix-blend-mode: ${config.blend}" />
        <rect x="${border}" y="${border}" width="${config.width - border * 2}" height="${config.height - border * 2}" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${config.alpha})" style="filter:blur(${config.blur}px)" />
      </svg>`;
      const dataUri = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;
      gsap.set('.filter feImage', { attr: { href: dataUri } });
    };

    buildDisplacementImage();
    
    if (effectRef.current) {
      Draggable.create(effectRef.current, { type: 'x,y' });
    }
  }, [config]);

  return (
    <>
      <ControlPanel config={config} setConfig={setConfig} presets={presets} />
      <div ref={effectRef} className="effect">
        <DockComponent config={config} />
        <DisplacementFilter />
      </div>
    </>
  );
};

export default DisplacementEffect;
```

### 4. Add Styles

Create `app.css`:

```css
.effect {
  height: var(--height);
  width: var(--width);
  border-radius: var(--radius);
  position: fixed;
  z-index: 999999;
  background: light-dark(
    hsl(0 0% 100% / var(--frost, 0)),
    hsl(0 0% 0% / var(--frost, 0))
  );
  backdrop-filter: url(#filter);
  box-shadow: 
    0 0 2px 1px light-dark(
      color-mix(in oklch, canvasText, #0000 85%),
      color-mix(in oklch, canvasText, #0000 65%)
    ) inset,
    0 0 10px 4px light-dark(
      color-mix(in oklch, canvasText, #0000 90%),
      color-mix(in oklch, canvasText, #0000 85%)
    ) inset;
  opacity: 0;
  transition: opacity 0.26s ease-out;
}

.filter {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.nav-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add other styles as needed */
```

### 5. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Key Concepts

1. **SVG Displacement Filter**: The core of the effect uses SVG filters to create the glass displacement effect. The filter combines displacement maps with color matrices to achieve the chromatic aberration effect.

2. **Dynamic SVG Generation**: The displacement image is generated dynamically based on the configuration, allowing real-time updates to the effect's appearance.

3. **GSAP Integration**: The GreenSock Animation Platform (GSAP) is used for smooth animations and draggable functionality.

4. **Tweakpane Controls**: The control panel is built using Tweakpane, providing an intuitive interface for adjusting the effect's parameters.

## Customization

You can customize the effect by:

1. Modifying the preset values in `App.tsx`
2. Adding new control parameters in `ControlPanel.tsx`
3. Creating new component variants (similar to Dock, Pill, Bubble)
4. Adjusting the CSS styles in `app.css`

## Browser Support

The glass displacement effect works best in Chromium-based browsers (Chrome, Edge, etc.) as it relies on `backdrop-filter: url()` which is not fully supported in Firefox or Safari.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this in your projects!

## Credits

This project is inspired by [Jhey's Glass Displacement Effect](https://codepen.io/jh3y/pen/EajLxJV) on CodePen. Check out more of [Jhey's amazing work](https://codepen.io/jh3y)! 
