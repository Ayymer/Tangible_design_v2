/* ============================================
   CONFIGURATION FILE
   All magic numbers and settings centralized
   ============================================ */

const CONFIG = {
  
  // ===== CANVAS LAYOUT =====
  canvas: {
    // Split-screen layout percentages
    leftPanelWidth: 0.3,    // Letter visualization (30% of width)
    rightPanelWidth: 0.7,   // Body visualization (70% of width)
    backgroundColor: 0       // Black background
  },
  
  // ===== LETTER VISUALIZATION =====
  letter: {
    size: 300,              // Letter text size in pixels
    outlineWeight: 4,       // Stroke weight for letter outline
    outlineColor: '#FFFFFF', // White outline color
    titleSize: 32,          // Size of emotion title text
    titleOffset: 60,        // Vertical offset below letter for title
    promptSize: 18,         // Size of prompt text when no emotion selected
    promptColor: 150        // Gray color for prompt text
  },
  
  // ===== BODY VISUALIZATION =====
  body: {
    imageWidth: 200,        // Silhouette image width
    imageHeight: 400,       // Silhouette image height
    imageTint: 200,         // Tint value for silhouette (grayscale)
    fallbackWidth: 150,     // Fallback rectangle width if image fails
    fallbackHeight: 350,    // Fallback rectangle height if image fails
    fallbackRadius: 20,     // Corner radius for fallback rectangle
    descriptionSize: 14,    // Font size for emotion description
    descriptionLeading: 20, // Line spacing for description
    descriptionY: 260,      // Y position for description text
    descriptionWidth: 350,  // Max width for description text
    descriptionHeight: 200  // Max height for description text area
  },
  
  // ===== AUDIO SETTINGS =====
  audio: {
    // Microphone volume range
    volumeMin: 0.01,        // Minimum volume threshold
    volumeMax: 0.4,         // Maximum volume threshold
    
    // Fill speed mapping (units per frame)
    fillSpeedMin: 0.2,      // Minimum fill speed (quiet voice)
    fillSpeedMax: 5.0,      // Maximum fill speed (loud voice)
    
    // Fill level
    fillLevelMax: 100,      // Maximum fill percentage
    fillLevelMin: 0         // Minimum fill percentage (empty)
  },
  
  // ===== ANIMATION SETTINGS =====
  animation: {
    // Breathing effect for body hotspot
    breathingFrequency: 0.003,  // Sine wave frequency (very slow)
    
    // Hotspot glow effect
    glowMin: 30,            // Minimum shadow blur
    glowMax: 60,            // Maximum shadow blur
    
    // Hotspot size variation
    sizeMin: 55,            // Minimum hotspot diameter
    sizeMax: 65,            // Maximum hotspot diameter
    
    // Minimum fill level to show hotspot
    minFillToShow: 5        // Don't show hotspot until 5% filled
  },
  
  // ===== SPEECH RECOGNITION =====
  speech: {
    language: 'en-US',      // Speech recognition language
    continuous: false,      // Single utterance mode
    interimResults: false   // No interim results
  },
  
  // ===== UI BUTTON =====
  button: {
    width: 150,             // Button width
    height: 40,             // Button height
    offsetY: 80,            // Distance from bottom of screen
    
    // Styling
    textColor: 'white',
    backgroundNormal: 'transparent',
    backgroundListening: '#333',
    borderNormal: '2px solid white',
    borderListening: '2px solid #ff0000',
    borderRadius: '20px',
    fontSize: '16px',
    
    // Text labels
    labelNormal: "Maintenir pour parler",
    labelListening: "Écoute en cours..."
  },
  
  // ===== TEXTURE PARAMETER PRESETS =====
  texturePresets: {
    happiness: {
      density: 60,      // Moderate abundance of rays/sparkles
      energy: 75,       // High movement, joyful
      amplitude: 50,    // Medium size elements
      roughness: 20,    // Smooth, flowing
      turbulence: 30    // Some variation but mostly ordered
    },
    
    envy: {
      density: 80,      // Dense, crowded, tangled
      energy: 40,       // Moderate, simmering
      amplitude: 35,    // Smaller, constrained
      roughness: 60,    // Mix of smooth and sharp
      turbulence: 70    // High chaos, unpredictable
    },
    
    anger: {
      density: 70,      // Dense strokes
      energy: 85,       // High intensity
      amplitude: 65,    // Bold, strong
      roughness: 75,    // Aggressive, sharp
      turbulence: 50    // Controlled chaos
    },
    
    rage: {
      density: 90,      // Maximum density
      energy: 95,       // Explosive movement
      amplitude: 80,    // Large, dramatic
      roughness: 85,    // Very jagged
      turbulence: 90    // Maximum chaos
    },
    
    trust: {
      density: 40,      // Sparse, spacious
      energy: 25,       // Calm, slow
      amplitude: 45,    // Gentle size
      roughness: 15,    // Very smooth, organic
      turbulence: 20    // Ordered, predictable
    }
  },
  
  // ===== EMOTIONS DATA =====
  emotions: {
    happiness: {
      color: "#FFD700",     // Gold/Yellow
      letter: "H",
      bodyPos: { x: 0, y: -80 },  // Chest area
      desc: "BONHEUR (Happiness) : Une chaleur rayonnante qui inonde la poitrine et s'étend vers le visage. On ressent une légèreté physique, une ouverture du cœur et une énergie vibrante qui donne envie de sourire."
    },
    
    envy: {
      color: "#FF4500",     // Dark orange-red
      letter: "E",
      bodyPos: { x: 0, y: -110 }, // Throat/head area
      desc: "ENVIE (Envy) : Une sensation désagréable de constriction dans la gorge et une chaleur lourde dans la tête. C'est un mélange de désir et de frustration qui crée une tension physique ciblée sur le haut du corps."
    },
    
    anger: {
      color: "#FF8C00",     // Bright orange
      letter: "A",
      bodyPos: { x: 0, y: -90 },  // Upper body
      desc: "COLÈRE (Anger) : Une montée d'adrénaline brutale. La chaleur monte aux mains (prêtes à frapper) et au visage. Le haut du corps se tend, le rythme cardiaque s'accélère pour préparer l'action."
    },
    
    rage: {
      color: "#FF0000",     // Pure red
      letter: "R",
      bodyPos: { x: 0, y: -120 }, // Head area
      desc: "RAGE : La forme explosive de la colère. Une pression extrême et bouillante dans la tête, comme un volcan. La vision peut se troubler, la chaleur est aveuglante et la perte de contrôle physique est proche."
    },
    
    trust: {
      color: "#20B2AA",     // Turquoise
      letter: "T",
      bodyPos: { x: 0, y: -40 },  // Heart area
      desc: "CONFIANCE (Trust) : Une sensation profonde de sécurité et de calme. La poitrine se détend, la respiration devient ample et régulière. C'est une chaleur douce et apaisante située au niveau du cœur."
    }
  }
};

// Make CONFIG available globally
// (In p5.js, this will be accessible in sketch.js)
