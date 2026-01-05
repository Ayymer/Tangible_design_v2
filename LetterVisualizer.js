/* ============================================
   LETTER VISUALIZER CLASS
   Handles letter drawing and liquid fill animation
   ============================================ */

class LetterVisualizer {
  constructor(config) {
    this.config = config;
    this.currentEmotion = null;
    this.fillLevel = 0;
  }
  
  // Set the current emotion to display
  setEmotion(emotion) {
    this.currentEmotion = emotion;
    this.fillLevel = CONFIG.audio.fillLevelMin; // Reset fill level
  }
  
  // Get current emotion
  getEmotion() {
    return this.currentEmotion;
  }
  
  // Update fill level based on speed
  updateFillLevel(speed) {
    if (this.fillLevel < CONFIG.audio.fillLevelMax) {
      this.fillLevel += speed;
      if (this.fillLevel > CONFIG.audio.fillLevelMax) {
        this.fillLevel = CONFIG.audio.fillLevelMax;
      }
    }
  }
  
  // Get current fill level (0-100)
  getFillLevel() {
    return this.fillLevel;
  }
  
  // Reset fill level to 0
  resetFillLevel() {
    this.fillLevel = CONFIG.audio.fillLevelMin;
  }
  
  // Main draw method
  draw(x, y) {
    push();
    translate(x, y);
    
    if (this.currentEmotion) {
      this.drawLetter();
    } else {
      this.drawPrompt();
    }
    
    pop();
  }
  
  // Draw the letter with outline and liquid fill
  drawLetter() {
    let s = this.config.letter.size;
    textSize(s);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    // 1. Draw outline
    this.drawOutline();
    
    // 2. Draw liquid fill
    this.drawFill();
    
    // 3. Draw title below letter
    this.drawTitle();
  }
  
  // Draw letter outline
  drawOutline() {
    let s = this.config.letter.size;
    
    noFill();
    stroke(this.config.letter.outlineColor);
    strokeWeight(this.config.letter.outlineWeight);
    
    text(this.currentEmotion.getLetter(), 0, 0);
  }
  
  // Draw liquid fill inside letter
  drawFill() {
    let s = this.config.letter.size;
    
    push();
      // Save canvas context
      drawingContext.save();
      
      // Create clipping path from letter shape
      text(this.currentEmotion.getLetter(), 0, 0);
      drawingContext.clip();
      
      // Draw filled rectangle (liquid)
      noStroke();
      fill(this.currentEmotion.getColor());
      
      rectMode(CORNER);
      
      // Calculate fill height based on fill level
      let h = map(
        this.fillLevel,
        this.config.audio.fillLevelMin,
        this.config.audio.fillLevelMax,
        0,
        s
      );
      
      // Draw from bottom up
      rect(-s/2, (s/2) - h, s, h);
      
      // Restore canvas context
      drawingContext.restore();
    pop();
  }
  
  // Draw emotion title below letter
  drawTitle() {
    let s = this.config.letter.size;
    
    fill(this.config.letter.outlineColor);
    noStroke();
    textSize(this.config.letter.titleSize);
    textAlign(CENTER, CENTER);
    
    text(
      this.currentEmotion.getDisplayName(),
      0,
      s/2 + this.config.letter.titleOffset
    );
  }
  
  // Draw prompt when no emotion selected
  drawPrompt() {
    fill(this.config.letter.promptColor);
    noStroke();
    textSize(this.config.letter.promptSize);
    textAlign(CENTER, CENTER);
    
    text("Say: Happiness, Anger, Envy...", 0, 0);
  }
  
  // Check if an emotion is currently selected
  hasEmotion() {
    return this.currentEmotion !== null;
  }
  
  // Clear current emotion
  clearEmotion() {
    this.currentEmotion = null;
    this.fillLevel = 0;
  }
}
