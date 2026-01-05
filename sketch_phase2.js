/* ============================================
   TANGIBLE DESIGN V2 - PHASE 2 COMPLETE
   Main Application with Parametric Textures
   ============================================ */

// Global instances
let emotions;
let letterViz;
let bodyViz;
let inputManager;
let paramController;
let paramDisplay;
let bodyImg;

function preload() {
  // Load body image
  bodyImg = loadImage('silhouette.png',
    () => { console.log("✅ Image loaded successfully"); },
    () => { console.log("⚠️ Image 'silhouette.png' not found - using fallback"); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  console.log("🚀 Starting Tangible Design v2 - Phase 2");
  
  // Initialize emotions from config with texture presets
  emotions = EmotionFactory.createAll(CONFIG.emotions, CONFIG.texturePresets);
  console.log("✅ Emotions initialized with texture presets");
  
  // Initialize visualizers
  letterViz = new LetterVisualizer(CONFIG);
  bodyViz = new BodyVisualizer(CONFIG, bodyImg);
  console.log("✅ Visualizers initialized");
  
  // Initialize input manager
  inputManager = new InputManager(CONFIG);
  inputManager.init();
  console.log("✅ Input manager initialized");
  
  // Initialize parameter controller
  paramController = new ParameterController();
  console.log("✅ Parameter controller initialized");
  
  // Initialize parameter display
  paramDisplay = new ParameterDisplay();
  console.log("✅ Parameter display initialized");
  
  // Register event handlers
  inputManager.onEmotionDetected(handleEmotionDetected);
  paramController.onParameterChanged(handleParameterChanged);
  
  // Set text alignment
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  console.log("🎉 Setup complete! Ready to use.");
  console.log("📝 Instructions:");
  console.log("   1. Press and hold button to activate microphone");
  console.log("   2. Say an emotion word (happiness, anger, envy, rage, trust)");
  console.log("   3. Press H, E, A, R, T keys to adjust texture parameters");
}

function draw() {
  background(CONFIG.canvas.backgroundColor);
  
  // Update systems
  if (letterViz.hasEmotion()) {
    // Update texture parameters
    letterViz.update();
    
    // Update parameter controller reference
    if (paramController.getParams() !== letterViz.getTextureParams()) {
      paramController.setParams(letterViz.getTextureParams());
    }
  }
  
  // Update fill level based on microphone volume
  updateFillLevel();
  
  // Draw letter visualization (left panel)
  letterViz.draw(
    width * CONFIG.canvas.leftPanelWidth,
    height / 2
  );
  
  // Draw body visualization (right panel)
  bodyViz.draw(
    width * CONFIG.canvas.rightPanelWidth,
    height / 2,
    letterViz.getFillLevel()
  );
  
  // Draw parameter display if emotion is selected
  if (letterViz.hasEmotion() && letterViz.getTextureParams()) {
    paramDisplay.draw(
      letterViz.getTextureParams(),
      letterViz.getEmotion().getColor()
    );
  }
  
  // Update button appearance
  inputManager.updateButton();
}

// Handle emotion detection from speech
function handleEmotionDetected(word) {
  let emotion = EmotionFactory.findByWord(emotions, word);
  
  if (emotion) {
    console.log("🎭 Emotion detected:", emotion.getKey());
    
    // Set emotion in both visualizers
    letterViz.setEmotion(emotion);
    bodyViz.setEmotion(emotion);
    
    // Update parameter controller
    paramController.setParams(letterViz.getTextureParams());
    
    console.log("✅ Emotion set with texture preset");
  } else {
    console.log("⚠️ No matching emotion found for:", word);
  }
}

// Handle parameter changes from keyboard
function handleParameterChanged(paramName) {
  console.log("🎛️ Parameter changed:", paramName);
  
  // Trigger texture regeneration
  if (letterViz.hasEmotion()) {
    letterViz.triggerRegeneration();
  }
  
  // Highlight parameter in display
  paramDisplay.highlightParameter(paramName);
}

// Update fill level based on microphone volume
function updateFillLevel() {
  if (!letterViz.hasEmotion()) return;
  
  let vol = inputManager.getMicLevel();
  
  // Map volume to fill speed
  let fillSpeed = map(
    vol,
    CONFIG.audio.volumeMin,
    CONFIG.audio.volumeMax,
    CONFIG.audio.fillSpeedMin,
    CONFIG.audio.fillSpeedMax
  );
  
  // Ensure non-negative speed
  fillSpeed = max(0, fillSpeed);
  
  // Update fill level
  letterViz.updateFillLevel(fillSpeed);
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  inputManager.repositionButton();
}

// Debug: Log current state (press 'D' key)
function keyPressed() {
  if (key === 'd' || key === 'D') {
    console.log("=== DEBUG INFO ===");
    console.log("Current emotion:", letterViz.getEmotion()?.getKey() || "none");
    console.log("Fill level:", letterViz.getFillLevel());
    if (letterViz.getTextureParams()) {
      console.log("Current parameters:", letterViz.getTextureParams().getCurrent());
      console.log("Target parameters:", letterViz.getTextureParams().getTarget());
    }
    console.log("Texture cache size:", letterViz.getTextureGenerator().getCacheSize());
    console.log("==================");
  }
}
