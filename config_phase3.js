/* ============================================
   PHASE 3 CONFIGURATION
   Settings for particle-based emotion visualization
   ============================================ */

const CONFIG_PHASE3 = {
  // ===== CANVAS =====
  canvas: {
    backgroundColor: '#808080'  // Gray background (from mockup)
  },
  
  // ===== LAYOUT =====
  layout: {
    textSize: 400,        // Very large text size for readability
    buttonOffsetY: 60     // Button offset from bottom
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
      radius: 12,     // Large for visibility
      turbulence: 40  // Moderate chaos
    },
    trust: {
      hue: 180,       // Turquoise/Cyan
      energy: 30,     // Calm
      amount: 95,     // Very dense for legibility
      radius: 12,     // Large for visibility
      turbulence: 20  // Low chaos
    },
    envy: {
      hue: 15,        // Red-Orange
      energy: 60,     // Medium
      amount: 95,     // Very dense for legibility
      radius: 12,     // Large for visibility
      turbulence: 50  // Medium chaos
    },
    rage: {
      hue: 0,         // Pure Red
      energy: 100,    // Maximum
      amount: 95,     // Very dense for legibility
      radius: 15,     // Very large for visibility
      turbulence: 90  // Extreme chaos
    },
    anger: {
      hue: 30,        // Orange
      energy: 90,     // Very fast
      amount: 95,     // Very dense for legibility
      radius: 12,     // Large for visibility
      turbulence: 70  // High chaos
    }
  },
  
  // ===== PARAMETER SETTINGS =====
  parameters: {
    hue: {
      min: 0,
      max: 360,
      step: 36,       // 10 steps around color wheel
      wrap: true
    },
    energy: {
      min: 0,
      max: 100,
      step: 10,
      wrap: true
    },
    amount: {
      min: 0,
      max: 100,
      step: 10,
      wrap: true
    },
    radius: {
      min: 1,
      max: 20,
      step: 2,
      wrap: true
    },
    turbulence: {
      min: 0,
      max: 100,
      step: 10,
      wrap: true
    }
  },
  
  // ===== UI ELEMENTS =====
  ui: {
    // Instructions (top-left)
    instructions: {
      x: 30,
      y: 30,
      color: '#FFFFFF',
      size: 14,
      lineHeight: 22,
      text: [
        'INSTRUCTIONS',
        '1. Hold button to speak',
        '2. Say: happiness, anger, envy, rage, trust',
        '3. Press H/E/A/R/T keys to adjust parameters'
      ]
    },
    
    // Parameter display (top-right)
    parameterDisplay: {
      x: -30,           // Offset from right edge
      y: 30,
      color: '#FFFFFF',
      size: 12,
      lineHeight: 20,
      labelWidth: 15,
      valueWidth: 30,
      iconSize: 8
    },
    
    // Button (bottom center)
    button: {
      width: 150,
      height: 40,
      offsetY: 60,
      textColor: '#FFFFFF',
      backgroundNormal: 'transparent',
      backgroundListening: '#333333',
      borderNormal: '2px solid white',
      borderListening: '2px solid #ff0000',
      borderRadius: '20px',
      fontSize: '16px',
      labelNormal: 'Hold to speak',
      labelListening: 'Listening...'
    }
  },
  
  // ===== SPEECH RECOGNITION =====
  speech: {
    language: 'en-US',
    continuous: false,
    interimResults: false
  },
  
  // ===== EMOTIONS DATA =====
  emotions: {
    happiness: {
      key: 'happiness',
      letter: 'H',
      color: '#FFD700',
      desc: 'HAPPINESS: A radiant warmth that floods the chest and extends to the face. One feels a physical lightness, an opening of the heart, and a vibrant energy that makes you want to smile.'
    },
    envy: {
      key: 'envy',
      letter: 'E',
      color: '#FF4500',
      desc: 'ENVY: An unpleasant sensation of constriction in the throat and a heavy warmth in the head. It is a mixture of desire and frustration that creates a physical tension focused on the upper body.'
    },
    anger: {
      key: 'anger',
      letter: 'A',
      color: '#FF8C00',
      desc: 'ANGER: A brutal surge of adrenaline. The heat rises to the hands (ready to strike) and the face. The upper body tenses, the heart rate accelerates to prepare for action.'
    },
    rage: {
      key: 'rage',
      letter: 'R',
      color: '#FF0000',
      desc: 'RAGE: The explosive form of anger. Extreme and boiling pressure in the head, like a volcano. Vision may blur, the heat is blinding, and loss of physical control is near.'
    },
    trust: {
      key: 'trust',
      letter: 'T',
      color: '#20B2AA',
      desc: 'TRUST: A deep sense of security and calm. The chest relaxes, breathing becomes ample and regular. It is a soft and soothing warmth located at the level of the heart.'
    }
  }
};
