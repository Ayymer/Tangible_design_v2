/* ============================================
   TANGIBLE DESIGN V2 - FULLY REFACTORED
   Main Application
   ============================================ */

// Global instances
let emotions;
let letterViz;
let bodyViz;
let inputManager;
let bodyImg;

function preload() {
  // Load body image
  bodyImg = loadImage('silhouette.png',
    () => { console.log("Image loaded successfully"); },
    () => { console.log("Image 'silhouette.png' not found - using fallback"); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize emotions from config
  emotions = EmotionFactory.createAll(CONFIG.emotions);
  
  // Initialize visualizers
  letterViz = new LetterVisualizer(CONFIG);
  bodyViz = new BodyVisualizer(CONFIG, bodyImg);
  
  // Initialize input manager
  inputManager = new InputManager(CONFIG);
  inputManager.init();
  
  // Register event handlers
  inputManager.onEmotionDetected(handleEmotionDetected);
  
  // Set text alignment
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  background(CONFIG.canvas.backgroundColor);
  
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
  
  // Update button appearance
  inputManager.updateButton();
}

// Handle emotion detection from speech
function handleEmotionDetected(word) {
  let emotion = EmotionFactory.findByWord(emotions, word);
  
  if (emotion) {
    // Set emotion in both visualizers
    letterViz.setEmotion(emotion);
    bodyViz.setEmotion(emotion);
    
    console.log("Emotion detected:", emotion.getKey());
  }
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
