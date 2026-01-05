/* ============================================
   LETTER VISUALIZER CLASS V2
   Handles letter drawing with parametric texture support
   ============================================ */

class LetterVisualizer {
  constructor(config) {
    this.config = config;
    this.currentEmotion = null;
    this.fillLevel = 0;
    
    // Parametric texture system
    this.textureGen = new ParametricTextureGenerator(100);
    this.textureParams = null;
    this.currentTexture = null;
    this.needsRegeneration = false;
  }
  
  // Set the current emotion to display
  setEmotion(emotion) {
    this.currentEmotion = emotion;
    this.fillLevel = CONFIG.audio.fillLevelMin; // Reset fill level
    
    // Load emotion's texture preset
    if (emotion.hasTexturePreset()) {
      this.textureParams = new TextureParameters(emotion.getTexturePreset());
      this.needsRegeneration = true;
      console.log("🎨 Loaded texture preset for", emotion.getKey());
      console.log("   Preset:", emotion.getTexturePreset());
    } else {
      this.textureParams = new TextureParameters();
      this.needsRegeneration = true;
    }
  }
  
  // Get current emotion
  getEmotion() {
    return this.currentEmotion;
  }
  
  // Get texture parameters
  getTextureParams() {
    return this.textureParams;
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
  
  // Update texture parameters (call every frame)
  update() {
    if (this.textureParams) {
      // Update parameter interpolation
      this.textureParams.update();
      
      // Check if texture needs regeneration
      if (this.textureParams.checkRegeneration()) {
        this.needsRegeneration = true;
      }
    }
  }
  
  // Trigger texture regeneration
  triggerRegeneration() {
    this.needsRegeneration = true;
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
  
  // Draw the letter with outline and parametric texture fill
  drawLetter() {
    let s = this.config.letter.size;
    textSize(s);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    // Regenerate texture if needed
    if (this.needsRegeneration && this.textureParams) {
      let params = this.textureParams.getCurrent();
      this.currentTexture = this.textureGen.generate(this.currentEmotion, params);
      this.needsRegeneration = false;
      console.log("🔄 Texture regenerated with params:", params);
    }
    
    // 1. Draw outline
    this.drawOutline();
    
    // 2. Draw fill (with texture)
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
  
  // Draw parametric texture fill inside letter
  drawFill() {
    let s = this.config.letter.size;
    
    push();
    
    // Set up text rendering for clipping
    textSize(s);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    // Use texture if available, otherwise solid color
    if (this.currentTexture) {
      // Create pattern from texture
      let pattern = this.textureGen.createPattern(this.currentTexture);
      drawingContext.fillStyle = pattern;
    } else {
      // Fallback to solid color
      fill(this.currentEmotion.getColor());
    }
    
    // Calculate fill height based on fill level
    let h = map(
      this.fillLevel,
      this.config.audio.fillLevelMin,
      this.config.audio.fillLevelMax,
      0,
      s
    );
    
    // Save context for clipping
    drawingContext.save();
    
    // Create clipping rectangle for liquid effect (bottom to top)
    drawingContext.beginPath();
    drawingContext.rect(-s/2, (s/2) - h, s, h);
    drawingContext.clip();
    
    // Draw filled text within clipping region
    noStroke();
    text(this.currentEmotion.getLetter(), 0, 0);
    
    // Restore context
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
    this.textureParams = null;
    this.currentTexture = null;
  }
  
  // Get texture generator (for debugging)
  getTextureGenerator() {
    return this.textureGen;
  }
}
