import React from 'react';
import { useThemeContext } from './ThemeProvider';
import { Button } from './ui/button';

const TestColorTheme = () => {
  const { 
    colorScheme, 
    setColorScheme,
    primaryColor, 
    secondaryColor, 
    accentColor,
    setPrimaryColor, 
    setSecondaryColor, 
    setAccentColor,
    colors
  } = useThemeContext();

  // Color palette buttons
  const colorPalettes = [
    { name: 'Modern', value: 'modern' },
    { name: 'Purple', value: 'purple' },
    { name: 'Teal', value: 'teal' },
    { name: 'Warm', value: 'warm' },
    { name: 'Night', value: 'night' }
  ];

  return (
    <div className="p-6 border rounded-lg mt-8 mx-auto max-w-4xl glass">
      <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Modern Theme System</h2>
      
      {/* Color palette selector */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Color Palettes</h3>
        <div className="flex flex-wrap gap-2">
          {colorPalettes.map(palette => (
            <Button 
              key={palette.value}
              onClick={() => setColorScheme(palette.value)}
              className={`${colorScheme === palette.value ? 'ring-2 ring-offset-2' : ''}`}
            >
              {palette.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Color preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <h3 className="text-md font-medium">Primary Color</h3>
          <div 
            className="h-12 rounded-md shadow-sm" 
            style={{ backgroundColor: primaryColor }}
          ></div>
          <div className="font-mono text-sm text-neutral-color">{primaryColor}</div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-md font-medium">Secondary Color</h3>
          <div 
            className="h-12 rounded-md shadow-sm" 
            style={{ backgroundColor: secondaryColor }}
          ></div>
          <div className="font-mono text-sm text-neutral-color">{secondaryColor}</div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-md font-medium">Accent Color</h3>
          <div 
            className="h-12 rounded-md shadow-sm" 
            style={{ backgroundColor: accentColor }}
          ></div>
          <div className="font-mono text-sm text-neutral-color">{accentColor}</div>
        </div>
      </div>
      
      {/* Utility colors */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Utility Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-success text-white rounded">Success</div>
          <div className="p-3 bg-warning text-white rounded">Warning</div>
          <div className="p-3 bg-error text-white rounded">Error</div>
          <div className="p-3 bg-info text-white rounded">Info</div>
        </div>
      </div>
      
      {/* Gradients */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Gradients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-primary text-white rounded shadow-sm">
            Primary Gradient
          </div>
          <div className="p-4 bg-gradient-accent text-white rounded shadow-sm">
            Accent Gradient
          </div>
        </div>
      </div>
      
      {/* Component examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Button Examples</h3>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button className="bg-primary">Primary</Button>
              <Button className="bg-secondary">Secondary</Button>
              <Button className="bg-accent">Accent</Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button className="bg-white border border-primary text-primary">
                Outlined
              </Button>
              <Button className="bg-gradient-primary">
                Gradient
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Text Examples</h3>
          <div className="space-y-3">
            <p className="text-primary">Primary text</p>
            <p className="text-secondary">Secondary text</p>
            <p className="text-accent">Accent text</p>
            <p className="text-gradient-primary font-bold">Gradient text</p>
            <p className="text-gradient-accent font-bold">Accent gradient text</p>
          </div>
        </div>
      </div>
      
      {/* Glass effect demo */}
      <div className="mt-6 p-6 glass rounded-lg">
        <h3 className="text-lg font-medium mb-2">Glass Effect Card</h3>
        <p className="text-neutral-color mb-4">This is a card with a modern glass effect</p>
        <Button className="bg-primary">Action</Button>
      </div>
    </div>
  );
};

export default TestColorTheme; 