/* ============================================
   PHASE 3: PARTICLE-BASED EMOTION VISUALIZATION
   Full emotion words with diverse particle types
   ============================================ */

// Global variables
let mic, speechRec, recordButton, bodyImg;
let isListening = false;
let currentEmotion = null;
let imgLoaded = false;

// Particle systems
let textSystem = null;
let bodySystem = null;

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

function preload() {
  // Load body silhouette
  bodyImg = loadImage('silhouette.png', 
    () => { imgLoaded = true; console.log('✅ Body image loaded'); },
    () => { console.warn('⚠️ Body image not found'); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize microphone
  mic = new p5.AudioIn();
  mic.start();
  
  // Initialize speech recognition
  speechRec = new p5.SpeechRec(CONFIG_PHASE3.speech.language, gotSpeech);
  speechRec.continuous = CONFIG_PHASE3.speech.continuous;
  speechRec.interimResults = CONFIG_PHASE3.speech.interimResults;
  
  // Create button
  let btnConfig = CONFIG_PHASE3.ui.button;
  recordButton = createButton(btnConfig.labelNormal);
  styleButton(recordButton);
  recordButton.mousePressed(startListening);
  recordButton.mouseReleased(stopListening);
  
  // Initialize parameter display
  paramDisplay = new ParameterDisplayPhase3(CONFIG_PHASE3);
  
  console.log('✅ Phase 3 initialized');
}

function draw() {
  // Background
  background(CONFIG_PHASE3.canvas.backgroundColor);
  
  // Display instructions
  ParameterDisplayPhase3.displayInstructions(CONFIG_PHASE3);
  
  // Display parameter panel
  if (currentEmotion) {
    paramDisplay.display();
  }
  
  // Update and display body particles
  if (bodySystem) {
    bodySystem.update();
    bodySystem.display();
  }
  
  // Update and display text particles
  if (textSystem) {
    textSystem.update();
    textSystem.display();
  } else {
    // Show prompt
    displayPrompt();
  }
  
  // Update button state
  updateButton();
}

function displayPrompt() {
  push();
  fill(255);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text('Say: Happiness, Anger, Envy, Rage, Trust', 
       width / 2, 
       height * CONFIG_PHASE3.layout.textY);
  pop();
}

function startListening() {
  userStartAudio();
  isListening = true;
  speechRec.start();
  console.log('🎙️ START LISTENING');
}

function stopListening() {
  isListening = false;
  console.log('🎙️ STOP LISTENING');
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let word = speechRec.resultString.toLowerCase();
    console.log('🗣️ SPEECH DETECTED:', word);
    
    // Check for emotion keywords
    for (let emotionKey in CONFIG_PHASE3.emotions) {
      if (word.includes(emotionKey)) {
        handleEmotionDetected(emotionKey);
        break;
      }
    }
  }
}

function handleEmotionDetected(emotionKey) {
  console.log('🎭 EMOTION DETECTED:', emotionKey);
  
  currentEmotion = emotionKey;
  
  // Load emotion preset
  currentParams = Object.assign({}, CONFIG_PHASE3.emotionPresets[emotionKey]);
  
  // Get particle type for this emotion
  let particleType = CONFIG_PHASE3.emotionParticles[emotionKey];
  
  // Create text particle system
  textSystem = new ParticleTextSystem(
    emotionKey.toUpperCase(),
    particleType,
    currentParams,
    width / 2,
    height * CONFIG_PHASE3.layout.textY,
    CONFIG_PHASE3.layout.textSize
  );
  
  // Create body particle system
  if (imgLoaded && bodyImg) {
    bodySystem = new ParticleBodySystem(
      bodyImg,
      particleType,
      currentParams,
      width / 2,
      height * CONFIG_PHASE3.layout.bodyY,
      CONFIG_PHASE3.layout.bodyHeight * 0.5,  // width
      CONFIG_PHASE3.layout.bodyHeight          // height
    );
  }
  
  // Update parameter display
  paramDisplay.updateParams(currentParams);
  
  console.log('✨ Particle systems created');
}

function keyPressed() {
  if (!currentEmotion) return;
  
  let k = key.toLowerCase();
  let changed = null;
  
  switch(k) {
    case 'h':
      currentParams.hue = (currentParams.hue + CONFIG_PHASE3.parameters.hue.step) % 360;
      changed = 'H';
      console.log('🎨 HUE:', currentParams.hue);
      break;
      
    case 'e':
      currentParams.energy = (currentParams.energy + CONFIG_PHASE3.parameters.energy.step) % 110;
      if (currentParams.energy > 100) currentParams.energy = 0;
      changed = 'E';
      console.log('⚡ ENERGY:', currentParams.energy);
      break;
      
    case 'a':
      currentParams.amount = (currentParams.amount + CONFIG_PHASE3.parameters.amount.step) % 110;
      if (currentParams.amount > 100) currentParams.amount = 10;
      changed = 'A';
      console.log('▪ AMOUNT:', currentParams.amount);
      break;
      
    case 'r':
      currentParams.radius = (currentParams.radius + CONFIG_PHASE3.parameters.radius.step);
      if (currentParams.radius > CONFIG_PHASE3.parameters.radius.max) {
        currentParams.radius = CONFIG_PHASE3.parameters.radius.min;
      }
      changed = 'R';
      console.log('● RADIUS:', currentParams.radius);
      break;
      
    case 't':
      currentParams.turbulence = (currentParams.turbulence + CONFIG_PHASE3.parameters.turbulence.step) % 110;
      if (currentParams.turbulence > 100) currentParams.turbulence = 0;
      changed = 'T';
      console.log('~ TURBULENCE:', currentParams.turbulence);
      break;
  }
  
  if (changed) {
    // Update particle systems with new parameters
    if (textSystem) {
      textSystem.updateParams(currentParams);
    }
    if (bodySystem) {
      bodySystem.updateParams(currentParams);
    }
    
    // Update parameter display
    paramDisplay.updateParams(currentParams, changed);
  }
}

function updateButton() {
  if (!recordButton) return;
  
  let btnConfig = CONFIG_PHASE3.ui.button;
  
  if (isListening) {
    recordButton.html(btnConfig.labelListening);
    recordButton.style('background', btnConfig.backgroundListening);
    recordButton.style('border', btnConfig.borderListening);
  } else {
    recordButton.html(btnConfig.labelNormal);
    recordButton.style('background', btnConfig.backgroundNormal);
    recordButton.style('border', btnConfig.borderNormal);
  }
}

function styleButton(btn) {
  let btnConfig = CONFIG_PHASE3.ui.button;
  
  btn.position(
    width / 2 - btnConfig.width / 2,
    height * btnConfig.offsetY
  );
  btn.size(btnConfig.width, btnConfig.height);
  btn.style('color', btnConfig.textColor);
  btn.style('background', btnConfig.backgroundNormal);
  btn.style('border', btnConfig.borderNormal);
  btn.style('border-radius', btnConfig.borderRadius);
  btn.style('font-size', btnConfig.fontSize);
  btn.style('cursor', 'pointer');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (recordButton) {
    let btnConfig = CONFIG_PHASE3.ui.button;
    recordButton.position(
      width / 2 - btnConfig.width / 2,
      height * btnConfig.offsetY
    );
  }
  
  // Regenerate particle systems with new dimensions
  if (currentEmotion) {
    handleEmotionDetected(currentEmotion);
  }
}
