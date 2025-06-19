import React, { useEffect, useRef } from 'react';
import { Pane } from 'tweakpane';

interface Config {
  debug: boolean;
  top: boolean;
  preset: string;
  theme: string;
  frost: number;
  icons: boolean;
  width: number;
  height: number;
  radius: number;
  border: number;
  alpha: number;
  lightness: number;
  blur: number;
  displace: number;
  x: string;
  y: string;
  blend: string;
  scale: number;
  r: number;
  g: number;
  b: number;
}

interface ControlPanelProps {
  config: Config;
  setConfig: (config: Config | ((prev: Config) => Config)) => void;
  presets: Record<string, Partial<Config>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, presets }) => {
  const paneContainerRef = useRef<HTMLDivElement>(null);
  const settingsFolderRef = useRef<any>(null);
  const paneRef = useRef<Pane | null>(null);

  useEffect(() => {
    // Only create the pane if it doesn't exist yet
    if (paneContainerRef.current && !paneRef.current) {
      const pane = new Pane({
        title: 'Glass Controls',
        expanded: true,
        container: paneContainerRef.current,
      });

      paneRef.current = pane;

      // Add basic controls
      pane.addBinding(config, 'debug').on('change', ({ value }: { value: boolean }) => {
        setConfig(prev => ({ ...prev, debug: value }));
      });

      pane.addBinding(config, 'top').on('change', ({ value }: { value: boolean }) => {
        setConfig(prev => ({ ...prev, top: value }));
      });

      pane.addBinding(config, 'preset', {
        label: 'mode',
        options: { dock: 'dock', pill: 'pill', bubble: 'bubble', free: 'free' },
      }).on('change', (ev: { value: string }) => {
        const newPreset = ev.value as keyof typeof presets;
        setConfig((prev: Config) => ({ ...prev, ...presets[newPreset], preset: newPreset }));
      });

      pane.addBinding(config, 'theme', {
        label: 'theme',
        options: { system: 'system', light: 'light', dark: 'dark' },
      }).on('change', ({ value }: { value: string }) => {
        setConfig(prev => ({ ...prev, theme: value }));
      });

      const settings = pane.addFolder({
        title: 'settings',
        expanded: true
      });
      settingsFolderRef.current = settings;

      // Add all the configuration options with individual change handlers
      settings.addBinding(config, 'frost', { label: 'frost', min: 0, max: 1, step: 0.01 })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, frost: value })));

      settings.addBinding(config, 'icons')
        .on('change', ({ value }: { value: boolean }) => setConfig(prev => ({ ...prev, icons: value })));

      settings.addBinding(config, 'width', { min: 80, max: 500, step: 1, label: 'width (px)' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, width: value })));

      settings.addBinding(config, 'height', { min: 35, max: 500, step: 1, label: 'height (px)' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, height: value })));

      settings.addBinding(config, 'radius', { min: 0, max: 500, step: 1, label: 'radius (px)' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, radius: value })));

      settings.addBinding(config, 'border', { min: 0, max: 1, step: 0.01, label: 'border' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, border: value })));

      settings.addBinding(config, 'alpha', { min: 0, max: 1, step: 0.01, label: 'alpha' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, alpha: value })));

      settings.addBinding(config, 'lightness', { min: 0, max: 100, step: 1, label: 'lightness' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, lightness: value })));

      settings.addBinding(config, 'blur', { min: 0, max: 20, step: 1, label: 'input blur' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, blur: value })));

      settings.addBinding(config, 'displace', { min: 0, max: 5, step: 0.1, label: 'output blur' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, displace: value })));

      settings.addBinding(config, 'x', { label: 'channel x', options: { r: 'R', g: 'G', b: 'B' } })
        .on('change', ({ value }: { value: string }) => setConfig(prev => ({ ...prev, x: value })));

      settings.addBinding(config, 'y', { label: 'channel y', options: { r: 'R', g: 'G', b: 'B' } })
        .on('change', ({ value }: { value: string }) => setConfig(prev => ({ ...prev, y: value })));

      settings.addBinding(config, 'blend', {
        options: {
          normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay',
          darken: 'darken', lighten: 'lighten', 'color-dodge': 'color-dodge',
          'color-burn': 'color-burn', 'hard-light': 'hard-light', 'soft-light': 'soft-light',
          difference: 'difference', exclusion: 'exclusion', hue: 'hue', saturation: 'saturation',
          color: 'color', luminosity: 'luminosity'
        },
        label: 'blend',
      }).on('change', ({ value }: { value: string }) => setConfig(prev => ({ ...prev, blend: value })));

      settings.addBinding(config, 'scale', { min: -1000, max: 1000, step: 1, label: 'scale' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, scale: value })));

      const chromatic = settings.addFolder({ title: 'chromatic', expanded: true });
      chromatic.addBinding(config, 'r', { min: -100, max: 100, step: 1, label: 'red' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, r: value })));

      chromatic.addBinding(config, 'g', { min: -100, max: 100, step: 1, label: 'green' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, g: value })));

      chromatic.addBinding(config, 'b', { min: -100, max: 100, step: 1, label: 'blue' })
        .on('change', ({ value }: { value: number }) => setConfig(prev => ({ ...prev, b: value })));
    }
  }, []);

  return <div ref={paneContainerRef} id="pane-container"></div>;
};

export default ControlPanel;