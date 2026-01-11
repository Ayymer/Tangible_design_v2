/* ============================================
   PHASE 3 CONFIGURATION
   Modern black-themed interface
   Optimized for readable particle text
   ============================================ */

const CONFIG_PHASE3 = {
  // ===== CANVAS =====
  canvas: {
    backgroundColor: '#0a0a0a'  // Very dark gray (almost black) for modern look
  },
  
  // ===== LAYOUT =====
  layout: {
    textSize: 120,        // INCREASED for better visibility
    buttonOffsetY: 80     // Button offset from bottom
  },
  
  // ===== EMOTION → PARTICLE TYPE MAPPING =====
  emotionParticles: {
    happiness: 'squares',
    trust: 'dots',
    envy: 'dither',
    rage: 'reaction',
    anger: 'strips'
  },
  
  // ===== EMOTION PRESETS =====
  // Optimized for READABLE particle text
  emotionPresets: {
    happiness: {
      hue: 60,        // Yellow/Gold
      energy: 40,     // REDUCED for calmer movement
      amount: 100,    // MAXIMUM density for legibility
      radius: 4,      // SMALLER particles = more detail
      turbulence: 8   // VERY LOW chaos for readability
    },
    trust: {
      hue: 180,       // Turquoise/Cyan
      energy: 20,     // Very calm
      amount: 100,    // Maximum density
      radius: 4,      // Small particles
      turbulence: 5   // Minimal chaos
    },
    envy: {
      hue: 15,        // Red-Orange
      energy: 35,     // Medium-low
      amount: 100,    // Maximum density
      radius: 4,      // Small particles
      turbulence: 10  // Low chaos
    },
    rage: {
      hue: 0,         // Pure Red
      energy: 60,     // Higher energy but still readable
      amount: 100,    // Maximum density
      radius: 5,      // Slightly larger
      turbulence: 15  // Moderate chaos (still readable)
    },
    anger: {
      hue: 30,        // Orange
      energy: 50,     // Medium energy
      amount: 100,    // Maximum density
      radius: 4,      // Small particles
      turbulence: 12  // Low-moderate chaos
    }
  },
  
  // ===== PARAMETER SETTINGS =====
  parameters: {
    hueStep: 10,          // Degrees to change hue per key press
    energyStep: 10,       // Energy change per key press
    amountStep: 10,       // Amount change per key press
    radiusStep: 1,        // SMALLER steps for finer control
    turbulenceStep: 5     // SMALLER steps for finer control
  },
  
  // ===== UI STYLING =====
  ui: {
    // Instructions (top-left)
    instructions: {
      x: 30,
      y: 30,
      fontSize: 16,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      lineHeight: 28,
      opacity: 0.8
    },
    
    // Parameter display (bottom-right)
    parameterDisplay: {
      x: -30,  // Offset from right edge
      y: -30,  // Offset from bottom edge
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      color: '#ffffff',
      lineHeight: 24,
      opacity: 0.9,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: 16,
      borderRadius: 12,
      backdropBlur: true
    },
    
    // Button styling
    button: {
      width: 200,
      height: 56,
      fontSize: 16,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      hoverColor: 'rgba(255, 255, 255, 0.12)',
      activeColor: 'rgba(255, 255, 255, 0.16)',
      borderRadius: 28,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      glowColor: 'rgba(255, 255, 255, 0.3)',
      glowSize: 20
    }
  },
  
  // ===== TEXT CONTENT =====
  text: {
    instructions: [
      'INSTRUCTIONS',
      '',
      '1. Hold button to speak',
      '2. Say: happiness, anger, envy, rage, trust',
      '3. Press H/E/A/R/T keys to adjust parameters'
    ],
    buttonIdle: 'Hold to speak',
    buttonListening: 'Listening...'
  }
};
