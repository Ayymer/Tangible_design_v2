/* PROJET FINAL : LIQUIDE RÉALISTE & VIBRATION DOUCE
   - Le remplissage part vraiment du bas (comme de l'eau).
   - La lumière "respire" lentement.
   - Vitesse dépend de la force de la voix.
*/

let mic, speechRec, recordButton, bodyImg;
let isListening = false;
let currentEmotion = null;
let fillLevel = 0;
let imgLoaded = false;

// --- CONFIGURATION DES ÉMOTIONS ---
const emotionsData = {
  "happiness": { 
    color: "#FFD700", // Or / Jaune
    letter: "H", 
    bodyPos: {x: 0, y: -80}, 
    desc: "BONHEUR (Happiness) : Une chaleur rayonnante qui inonde la poitrine et s'étend vers le visage. On ressent une légèreté physique, une ouverture du cœur et une énergie vibrante qui donne envie de sourire." 
  },
  "envy": { 
    color: "#FF4500", // Rouge orangé sombre
    letter: "E", 
    bodyPos: {x: 0, y: -110}, 
    desc: "ENVIE (Envy) : Une sensation désagréable de constriction dans la gorge et une chaleur lourde dans la tête. C'est un mélange de désir et de frustration qui crée une tension physique ciblée sur le haut du corps." 
  },
  "anger": { 
    color: "#FF8C00", // Orange vif
    letter: "A", 
    bodyPos: {x: 0, y: -90}, 
    desc: "COLÈRE (Anger) : Une montée d'adrénaline brutale. La chaleur monte aux mains (prêtes à frapper) et au visage. Le haut du corps se tend, le rythme cardiaque s'accélère pour préparer l'action." 
  },
  "rage": { 
    color: "#FF0000", // Rouge pur intense
    letter: "R", 
    bodyPos: {x: 0, y: -120}, 
    desc: "RAGE : La forme explosive de la colère. Une pression extrême et bouillante dans la tête, comme un volcan. La vision peut se troubler, la chaleur est aveuglante et la perte de contrôle physique est proche." 
  },
  "trust": { 
    color: "#20B2AA", // Vert d'eau / Turquoise
    letter: "T", 
    bodyPos: {x: 0, y: -40}, 
    desc: "CONFIANCE (Trust) : Une sensation profonde de sécurité et de calme. La poitrine se détend, la respiration devient ample et régulière. C'est une chaleur douce et apaisante située au niveau du cœur." 
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Chargement image sécurisé
  bodyImg = loadImage('silhouette.png', 
    () => { imgLoaded = true; },
    () => { console.log("Image 'silhouette.png' introuvable."); }
  );

  mic = new p5.AudioIn();
  mic.start();
  
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  recordButton = createButton("Maintenir pour parler");
  styleButton(recordButton);
  recordButton.mousePressed(startListening);
  recordButton.mouseReleased(stopListening);
  
  textAlign(CENTER, CENTER);
  // On garde CENTER par défaut, mais on changera pour CORNER juste pour le liquide
  rectMode(CENTER); 
}

function draw() {
  background(0); // FOND NOIR

  // A. VOLUME & REMPLISSAGE
  let vol = mic.getLevel(); 
  
  if (currentEmotion) {
    // Sensibilité : map(volume, min, max, vitesse_min, vitesse_max)
    let fillSpeed = map(vol, 0.01, 0.4, 0.2, 5.0); 
    if (fillSpeed < 0) fillSpeed = 0;

    if (fillLevel < 100) {
      fillLevel += fillSpeed;
    } else {
      fillLevel = 100;
    }
  }

  // B. DESSIN LETTRE
  push();
  translate(width * 0.3, height / 2);
  if (currentEmotion) {
    drawLetter(emotionsData[currentEmotion]);
  } else {
    fill(150); noStroke(); textSize(18);
    text("Dites : Happiness, Anger, Envy...", 0, 0);
  }
  pop();

  // C. DESSIN CORPS
  push();
  translate(width * 0.7, height / 2);
  drawBody();
  pop();
  
  // D. Feedback Bouton
  if (recordButton) {
    if(isListening) {
      recordButton.html("Écoute en cours...");
      recordButton.style('background', '#333');
      recordButton.style('border-color', '#ff0000');
    } else {
      recordButton.html("Maintenir pour parler");
      recordButton.style('background', 'transparent');
      recordButton.style('border-color', 'white');
    }
  }
}

// --- FONCTIONS LOGIQUES ---

function startListening() {
  userStartAudio();
  isListening = true;
  speechRec.start();
}
function stopListening() { isListening = false; }

function gotSpeech() {
  if (speechRec.resultValue) {
    let word = speechRec.resultString.toLowerCase();
    for (let key in emotionsData) {
      if (word.includes(key)) {
        currentEmotion = key;
        fillLevel = 0; 
        break;
      }
    }
  }
}

// --- FONCTIONS DE DESSIN CORRIGÉES ---

function drawLetter(data) {
  let s = 300; // Taille de la lettre
  textSize(s); textStyle(BOLD);
  
  // 1. Contour
  noFill(); stroke(255); strokeWeight(4);
  text(data.letter, 0, 0);
  
  // 2. LIQUIDE (CORRECTION ICI)
  push();
    drawingContext.save();
    text(data.letter, 0, 0);
    drawingContext.clip(); // On coupe tout ce qui dépasse
    
    noStroke(); 
    fill(data.color);
    
    // On passe en mode CORNER pour dessiner le rectangle depuis un coin précis
    rectMode(CORNER);
    
    // Calcul mathématique :
    // Le texte est centré en (0,0). Il va environ de -150 (haut) à +150 (bas).
    // On veut dessiner un rectangle qui part du bas (+150) et remonte.
    // 'h' est la hauteur actuelle du liquide.
    let h = map(fillLevel, 0, 100, 0, s);
    
    // Explication : 
    // x = -s/2 (bord gauche)
    // y = (s/2) - h (on part du bas et on remonte de h)
    // w = s (largeur totale)
    // h = h (hauteur du liquide)
    rect(-s/2, (s/2) - h, s, h);
    
    drawingContext.restore();
  pop();
  
  // 3. Titre
  fill(255); noStroke(); textSize(32); textAlign(CENTER, CENTER);
  text(currentEmotion.toUpperCase(), 0, s/2 + 60);
}

function drawBody() {
  imageMode(CENTER);
  
  // 1. Silhouette
  if (imgLoaded && bodyImg) {
    tint(200); 
    image(bodyImg, 0, 0, 200, 400);
    noTint();
  } else {
    stroke(255); noFill(); rect(0,0, 150, 350, 20);
  }
  
  // 2. Émotion Vibrante (CORRECTION VITESSE ICI)
  if (currentEmotion && fillLevel > 5) {
    let data = emotionsData[currentEmotion];
    
    // VIBRATION LENTE
    // J'ai mis 0.003 au lieu de 0.01 -> C'est 3x plus lent, comme une respiration.
    let vibration = sin(millis() * 0.003); 
    
    let sizeVar = map(vibration, -1, 1, 55, 65); // Taille min/max
    let glowVar = map(vibration, -1, 1, 30, 60); // Intensité lumineuse min/max
    
    noStroke(); 
    fill(data.color);
    
    // Effet Glow
    drawingContext.shadowBlur = glowVar;
    drawingContext.shadowColor = data.color;
    ellipse(data.bodyPos.x, data.bodyPos.y, sizeVar, sizeVar);
    drawingContext.shadowBlur = 0; 
    
    // 3. Description
    fill(255); textSize(14); textLeading(20);
    text(data.desc, 0, 260, 350, 200); 
  }
}

function styleButton(btn) {
  btn.position(width/2 - 75, height - 80);
  btn.size(150, 40);
  btn.style('color', 'white');
  btn.style('background', 'transparent');
  btn.style('border', '2px solid white');
  btn.style('border-radius', '20px');
  btn.style('font-size', '16px');
  btn.style('cursor', 'pointer');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (recordButton) recordButton.position(width/2 - 75, height - 80);
}