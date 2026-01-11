/* ============================================
   PHASE 3 CONFIGURATION
   Modern black-themed interface
   ============================================ */

const CONFIG_PHASE3 = {
  // ===== CANVAS =====
  canvas: {
    backgroundColor: '#0a0a0a'  // Very dark gray (almost black) for modern look
  },
  
  // ===== LAYOUT =====
  layout: {
    textSize: 128,        // Readable size that won't overflow
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
  emotionPresets: {
    happiness: {
      hue: 60,        // Yellow/Gold
      energy: 70,     // Lively
      amount: 95,     // Very dense for legibility
      radius: 18,     // Extra large for visibility
      turbulence: 15  // Low chaos for readability
    },
    trust: {
      hue: 180,       // Turquoise/Cyan
      energy: 30,     // Calm
      amount: 95,     // Very dense for legibility
      radius: 18,     // Extra large for visibility
      turbulence: 10  // Very low chaos
    },
    envy: {
      hue: 15,        // Red-Orange
      energy: 60,     // Medium
      amount: 95,     // Very dense for legibility
      radius: 18,     // Extra large for visibility
      turbulence: 20  // Low chaos for readability
    },
    rage: {
      hue: 0,         // Pure Red
      energy: 100,    // Maximum
      amount: 95,     // Very dense for legibility
      radius: 20,     // Extra large for visibility
      turbulence: 30  // Moderate chaos (reduced for readability)
    },
    anger: {
      hue: 30,        // Orange
      energy: 90,     // Very fast
      amount: 95,     // Very dense for legibility
      radius: 18,     // Extra large for visibility
      turbulence: 25  // Moderate chaos for readability
    }
  },
  
  // ===== PARAMETER SETTINGS =====
  parameters: {
    hueStep: 10,          // Degrees to change hue per key press
    energyStep: 10,       // Energy change per key press
    amountStep: 10,       // Amount change per key press
    radiusStep: 2,        // Radius change per key press
    turbulenceStep: 10    // Turbulence change per key press
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
