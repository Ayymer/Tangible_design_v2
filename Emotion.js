/* ============================================
   EMOTION CLASS
   Encapsulates emotion data and behavior
   ============================================ */

class Emotion {
  constructor(key, data) {
    this.key = key;                    // e.g., "happiness"
    this.color = data.color;           // Hex color string
    this.letter = data.letter;         // Single letter (H, E, A, R, T)
    this.bodyPos = data.bodyPos;       // {x, y} position on body
    this.description = data.desc;      // Full description text
  }
  
  // Getters for clean access
  getKey() {
    return this.key;
  }
  
  getColor() {
    return this.color;
  }
  
  getLetter() {
    return this.letter;
  }
  
  getBodyPosition() {
    return this.bodyPos;
  }
  
  getDescription() {
    return this.description;
  }
  
  // Get display name (capitalized)
  getDisplayName() {
    return this.key.toUpperCase();
  }
  
  // Check if a spoken word matches this emotion
  matches(word) {
    return word.toLowerCase().includes(this.key);
  }
  
  // Get p5.js color object (for use in fill(), stroke(), etc.)
  getP5Color() {
    return color(this.color);
  }
}

/* ============================================
   EMOTION FACTORY
   Creates Emotion instances from CONFIG
   ============================================ */

class EmotionFactory {
  static createAll(emotionsData) {
    const emotions = {};
    for (let key in emotionsData) {
      emotions[key] = new Emotion(key, emotionsData[key]);
    }
    return emotions;
  }
  
  static findByWord(emotions, word) {
    for (let key in emotions) {
      if (emotions[key].matches(word)) {
        return emotions[key];
      }
    }
    return null;
  }
}
