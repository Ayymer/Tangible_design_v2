/* PROJET FINAL : LIQUIDE RÉALISTE & VIBRATION DOUCE
   REFACTORED VERSION - Using CONFIG object
   - Le remplissage part vraiment du bas (comme de l'eau).
   - La lumière "respire" lentement.
   - Vitesse dépend de la force de la voix.
*/

let mic, speechRec, recordButton, bodyImg;
let isListening = false;
let currentEmotion = null;
let fillLevel = 0;
let imgLoaded = false;

// Configuration is loaded from config.js
const emotionsData = CONFIG.emotions;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Chargement image sécurisé
  bodyImg = loadImage('silhouette.png', 
    () => { imgLoaded = true; },
    () => { console.log("Image 'silhouette.png' introuvable."); }
  );

  mic = new p5.AudioIn();
  mic.start();
  
  speechRec = new p5.SpeechRec(CONFIG.speech.language, gotSpeech);
  speechRec.continuous = CONFIG.speech.continuous;
  speechRec.interimResults = CONFIG.speech.interimResults;

  recordButton = createButton(CONFIG.button.labelNormal);
  styleButton(recordButton);
  recordButton.mousePressed(startListening);
  recordButton.mouseReleased(stopListening);
  
  textAlign(CENTER, CENTER);
  rectMode(CENTER); 
}

function draw() {
  background(CONFIG.canvas.backgroundColor);

  // A. VOLUME & REMPLISSAGE
  let vol = mic.getLevel(); 
  
  if (currentEmotion) {
    // Sensibilité : map(volume, min, max, vitesse_min, vitesse_max)
    let fillSpeed = map(vol, 
      CONFIG.audio.volumeMin, 
      CONFIG.audio.volumeMax, 
      CONFIG.audio.fillSpeedMin, 
      CONFIG.audio.fillSpeedMax
    ); 
    if (fillSpeed < 0) fillSpeed = 0;

    if (fillLevel < CONFIG.audio.fillLevelMax) {
      fillLevel += fillSpeed;
    } else {
      fillLevel = CONFIG.audio.fillLevelMax;
    }
  }

  // B. DESSIN LETTRE
  push();
  translate(width * CONFIG.canvas.leftPanelWidth, height / 2);
  if (currentEmotion) {
    drawLetter(emotionsData[currentEmotion]);
  } else {
    fill(CONFIG.letter.promptColor); 
    noStroke(); 
    textSize(CONFIG.letter.promptSize);
    text("Say: Happiness, Anger, Envy...", 0, 0);
  }
  pop();

  // C. DESSIN CORPS
  push();
  translate(width * CONFIG.canvas.rightPanelWidth, height / 2);
  drawBody();
  pop();
  
  // D. Feedback Bouton
  if (recordButton) {
    if(isListening) {
      recordButton.html(CONFIG.button.labelListening);
      recordButton.style('background', CONFIG.button.backgroundListening);
      recordButton.style('border', CONFIG.button.borderListening);
    } else {
      recordButton.html(CONFIG.button.labelNormal);
      recordButton.style('background', CONFIG.button.backgroundNormal);
      recordButton.style('border', CONFIG.button.borderNormal);
    }
  }
}

// --- FONCTIONS LOGIQUES ---

function startListening() {
  userStartAudio();
  isListening = true;
  speechRec.start();
}

function stopListening() { 
  isListening = false; 
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let word = speechRec.resultString.toLowerCase();
    for (let key in emotionsData) {
      if (word.includes(key)) {
        currentEmotion = key;
        fillLevel = CONFIG.audio.fillLevelMin; 
        break;
      }
    }
  }
}

// --- FONCTIONS DE DESSIN ---

function drawLetter(data) {
  let s = CONFIG.letter.size;
  textSize(s); 
  textStyle(BOLD);
  
  // 1. Contour
  noFill(); 
  stroke(CONFIG.letter.outlineColor); 
  strokeWeight(CONFIG.letter.outlineWeight);
  text(data.letter, 0, 0);
  
  // 2. LIQUIDE
  push();
    drawingContext.save();
    text(data.letter, 0, 0);
    drawingContext.clip();
    
    noStroke(); 
    fill(data.color);
    
    rectMode(CORNER);
    
    let h = map(fillLevel, 
      CONFIG.audio.fillLevelMin, 
      CONFIG.audio.fillLevelMax, 
      0, 
      s
    );
    
    rect(-s/2, (s/2) - h, s, h);
    
    drawingContext.restore();
  pop();
  
  // 3. Titre
  fill(CONFIG.letter.outlineColor); 
  noStroke(); 
  textSize(CONFIG.letter.titleSize); 
  textAlign(CENTER, CENTER);
  text(currentEmotion.toUpperCase(), 0, s/2 + CONFIG.letter.titleOffset);
}

function drawBody() {
  imageMode(CENTER);
  
  // 1. Silhouette
  if (imgLoaded && bodyImg) {
    tint(CONFIG.body.imageTint); 
    image(bodyImg, 0, 0, CONFIG.body.imageWidth, CONFIG.body.imageHeight);
    noTint();
  } else {
    stroke(CONFIG.letter.outlineColor); 
    noFill(); 
    rect(0, 0, CONFIG.body.fallbackWidth, CONFIG.body.fallbackHeight, CONFIG.body.fallbackRadius);
  }
  
  // 2. Émotion Vibrante
  if (currentEmotion && fillLevel > CONFIG.animation.minFillToShow) {
    let data = emotionsData[currentEmotion];
    
    // VIBRATION LENTE (breathing effect)
    let vibration = sin(millis() * CONFIG.animation.breathingFrequency); 
    
    let sizeVar = map(vibration, -1, 1, CONFIG.animation.sizeMin, CONFIG.animation.sizeMax);
    let glowVar = map(vibration, -1, 1, CONFIG.animation.glowMin, CONFIG.animation.glowMax);
    
    noStroke(); 
    fill(data.color);
    
    // Effet Glow
    drawingContext.shadowBlur = glowVar;
    drawingContext.shadowColor = data.color;
    ellipse(data.bodyPos.x, data.bodyPos.y, sizeVar, sizeVar);
    drawingContext.shadowBlur = 0; 
    
    // 3. Description
    fill(CONFIG.letter.outlineColor); 
    textSize(CONFIG.body.descriptionSize); 
    textLeading(CONFIG.body.descriptionLeading);
    text(data.desc, 0, CONFIG.body.descriptionY, CONFIG.body.descriptionWidth, CONFIG.body.descriptionHeight); 
  }
}

function styleButton(btn) {
  btn.position(
    width/2 - CONFIG.button.width/2, 
    height - CONFIG.button.offsetY
  );
  btn.size(CONFIG.button.width, CONFIG.button.height);
  btn.style('color', CONFIG.button.textColor);
  btn.style('background', CONFIG.button.backgroundNormal);
  btn.style('border', CONFIG.button.borderNormal);
  btn.style('border-radius', CONFIG.button.borderRadius);
  btn.style('font-size', CONFIG.button.fontSize);
  btn.style('cursor', 'pointer');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (recordButton) {
    recordButton.position(
      width/2 - CONFIG.button.width/2, 
      height - CONFIG.button.offsetY
    );
  }
}
