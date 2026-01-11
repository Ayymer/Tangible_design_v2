/* ============================================
   PHASE 3: PARTICLE-BASED EMOTION VISUALIZATION
   Modern black-themed interface
   ============================================ */

// Global variables
let mic, speechRec, recordButton;
let isListening = false;
let currentEmotion = null;

// Particle system
let textSystem = null;

// UI
let paramDisplay = null;

// Current parameters
let currentParams = {
  hue: 60,
  energy: 50,
  amount: 70,
  radius: 6,
  turbulence: 40
};

// Preload function - loads assets before setup()
function preload() {
  // Load the font for TextSampler
  loadFont(FONT_URL, 
    (font) => {
      samplerFont = font;
      console.log('✅ Font preloaded successfully');
    },
    (err) => {
      console.error('❌ Font preload failed:', err);
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize microphone
  mic = new p5.AudioIn();
  mic.start();
  
  // Initialize speech recognition
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;
  
  // Create modern button
  createModernButton();
  
  // Initialize parameter display
  paramDisplay = new ParameterDisplayPhase3(CONFIG_PHASE3);
  
  console.log('✅ Phase 3 initialized');
  console.log('📝 Font loaded:', samplerFont ? 'YES' : 'NO');
}

function createModernButton() {
  let btnConfig = CONFIG_PHASE3.ui.button;
  
  recordButton = createButton(CONFIG_PHASE3.text.buttonIdle);
  recordButton.position(
    (windowWidth - btnConfig.width) / 2,
    windowHeight - btnConfig.height - CONFIG_PHASE3.layout.buttonOffsetY
  );
  recordButton.size(btnConfig.width, btnConfig.height);
  
  // Modern styling
  recordButton.style('font-family', btnConfig.fontFamily);
  recordButton.style('font-size', btnConfig.fontSize + 'px');
  recordButton.style('color', btnConfig.color);
  recordButton.style('background', btnConfig.backgroundColor);
  recordButton.style('border', `${btnConfig.borderWidth}px solid ${btnConfig.borderColor}`);
  recordButton.style('border-radius', btnConfig.borderRadius + 'px');
  recordButton.style('cursor', 'pointer');
  recordButton.style('transition', 'all 0.2s ease');
  recordButton.style('backdrop-filter', 'blur(10px)');
  recordButton.style('-webkit-backdrop-filter', 'blur(10px)');
  
  // Hover effect
  recordButton.mouseOver(() => {
    if (!isListening) {
      recordButton.style('background', btnConfig.hoverColor);
      recordButton.style('box-shadow', `0 0 ${btnConfig.glowSize}px ${btnConfig.glowColor}`);
    }
  });
  
  recordButton.mouseOut(() => {
    if (!isListening) {
      recordButton.style('background', btnConfig.backgroundColor);
      recordButton.style('box-shadow', 'none');
    }
  });
  
  recordButton.mousePressed(startListening);
  recordButton.mouseReleased(stopListening);
}

function draw() {
  // Black background
  background(CONFIG_PHASE3.canvas.backgroundColor);
  
  // Draw instructions
  ParameterDisplayPhase3.displayInstructions(CONFIG_PHASE3);
  
  // Draw and update particle system
  if (textSystem) {
    textSystem.update(currentParams);
    textSystem.display();
  }
  
  // Draw parameter display
  if (paramDisplay && currentEmotion) {
    paramDisplay.display(currentParams);
  }
}

function startListening() {
  isListening = true;
  recordButton.html(CONFIG_PHASE3.text.buttonListening);
  recordButton.style('background', CONFIG_PHASE3.ui.button.activeColor);
  speechRec.start();
  console.log('🎙️ START LISTENING');
}

function stopListening() {
  isListening = false;
  recordButton.html(CONFIG_PHASE3.text.buttonIdle);
  recordButton.style('background', CONFIG_PHASE3.ui.button.backgroundColor);
  speechRec.stop();
  console.log('🎙️ STOP LISTENING');
}

function gotSpeech() {
  if (!speechRec.resultValue) return;
  
  let speech = speechRec.resultString.toLowerCase().trim();
  console.log('🗣️ SPEECH DETECTED:', speech);
  
  // Check for emotion keywords
  const emotions = ['happiness', 'anger', 'envy', 'rage', 'trust'];
  for (let emotion of emotions) {
    if (speech.includes(emotion)) {
      handleEmotionDetected(emotion);
      return;
    }
  }
}

function handleEmotionDetected(emotion) {
  console.log('🎭 EMOTION DETECTED:', emotion);
  
  currentEmotion = emotion;
  
  // Load preset for this emotion
  let preset = CONFIG_PHASE3.emotionPresets[emotion];
  if (preset) {
    currentParams = {...preset};
    console.log('🎨 Loaded preset for', emotion);
  }
  
  // Get particle type for this emotion
  let particleType = CONFIG_PHASE3.emotionParticles[emotion];
  
  // Create new particle system
  let emotionText = emotion.toUpperCase();
  textSystem = new ParticleTextSystem(
    emotionText,
    width / 2,
    height / 2,
    CONFIG_PHASE3.layout.textSize,
    particleType,
    currentParams
  );
  
  console.log('✨ Particle system created');
}

function keyPressed() {
  if (!currentEmotion) return;
  
  let changed = false;
  let changedParam = null;
  
  // Support both keyboard letters (H/E/A/R/T) and Makey Makey touch controls
  let k = key.toLowerCase();
  
  // Arrow keys for Makey Makey touch controls
  if (keyCode === UP_ARROW) {
    // UP arrow: Increase Hue
    currentParams.hue = (currentParams.hue + CONFIG_PHASE3.parameters.hueStep) % 360;
    changed = true;
    changedParam = 'H';
    console.log('↑ HUE:', currentParams.hue);
  } else if (keyCode === DOWN_ARROW) {
    // DOWN arrow: Decrease Hue
    currentParams.hue = (currentParams.hue - CONFIG_PHASE3.parameters.hueStep + 360) % 360;
    changed = true;
    changedParam = 'H';
    console.log('↓ HUE:', currentParams.hue);
  } else if (keyCode === RIGHT_ARROW) {
    // RIGHT arrow: Increase Energy
    currentParams.energy = min(100, currentParams.energy + CONFIG_PHASE3.parameters.energyStep);
    changed = true;
    changedParam = 'E';
    console.log('→ ENERGY:', currentParams.energy);
  } else if (keyCode === LEFT_ARROW) {
    // LEFT arrow: Decrease Energy
    currentParams.energy = max(0, currentParams.energy - CONFIG_PHASE3.parameters.energyStep);
    changed = true;
    changedParam = 'E';
    console.log('← ENERGY:', currentParams.energy);
  } else if (k === ' ') {
    // SPACE: Cycle Amount (25, 50, 75, 100)
    let amounts = [25, 50, 75, 100];
    let currentIndex = amounts.findIndex(a => a >= currentParams.amount);
    currentIndex = (currentIndex + 1) % amounts.length;
    currentParams.amount = amounts[currentIndex];
    changed = true;
    changedParam = 'A';
    console.log('⎵ AMOUNT:', currentParams.amount);
  } else {
    // Original keyboard controls (H/E/A/R/T)
    switch(k) {
      case 'h':
        currentParams.hue = (currentParams.hue + CONFIG_PHASE3.parameters.hueStep) % 360;
        changed = true;
        changedParam = 'H';
        break;
      case 'e':
        currentParams.energy = (currentParams.energy + CONFIG_PHASE3.parameters.energyStep) % 101;
        changed = true;
        changedParam = 'E';
        break;
      case 'a':
        currentParams.amount = (currentParams.amount + CONFIG_PHASE3.parameters.amountStep) % 101;
        changed = true;
        changedParam = 'A';
        break;
      case 'r':
        currentParams.radius = ((currentParams.radius + CONFIG_PHASE3.parameters.radiusStep - 1) % 20) + 1;
        changed = true;
        changedParam = 'R';
        console.log('● RADIUS:', currentParams.radius);
        break;
      case 't':
        currentParams.turbulence = (currentParams.turbulence + CONFIG_PHASE3.parameters.turbulenceStep) % 101;
        changed = true;
        changedParam = 'T';
        break;
    }
  }
  
  if (changed && textSystem) {
    textSystem.regenerate(currentParams);
    if (paramDisplay) {
      paramDisplay.highlight(changedParam);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reposition button
  let btnConfig = CONFIG_PHASE3.ui.button;
  recordButton.position(
    (windowWidth - btnConfig.width) / 2,
    windowHeight - btnConfig.height - CONFIG_PHASE3.layout.buttonOffsetY
  );
  
  // Regenerate particle system at new center
  if (textSystem) {
    textSystem.x = width / 2;
    textSystem.y = height / 2;
    textSystem.regenerate(currentParams);
  }
}
