/* ============================================
   BODY VISUALIZER CLASS
   Handles body silhouette and emotion hotspot display
   ============================================ */

class BodyVisualizer {
  constructor(config, bodyImage) {
    this.config = config;
    this.bodyImg = bodyImage;
    this.currentEmotion = null;
    this.imgLoaded = false;
    
    // Check if image loaded successfully
    if (bodyImage && bodyImage.width > 0) {
      this.imgLoaded = true;
    }
  }
  
  // Set the current emotion to display
  setEmotion(emotion) {
    this.currentEmotion = emotion;
  }
  
  // Get current emotion
  getEmotion() {
    return this.currentEmotion;
  }
  
  // Main draw method
  draw(x, y, fillLevel) {
    push();
    translate(x, y);
    
    // Draw body silhouette
    this.drawSilhouette();
    
    // Draw emotion hotspot if emotion is selected and fill level is sufficient
    if (this.currentEmotion && fillLevel > this.config.animation.minFillToShow) {
      this.drawHotspot();
      this.drawDescription();
    }
    
    pop();
  }
  
  // Draw body silhouette (image or fallback rectangle)
  drawSilhouette() {
    imageMode(CENTER);
    
    if (this.imgLoaded && this.bodyImg) {
      // Draw image with tint
      tint(this.config.body.imageTint);
      image(
        this.bodyImg,
        0, 0,
        this.config.body.imageWidth,
        this.config.body.imageHeight
      );
      noTint();
    } else {
      // Fallback: draw simple rectangle
      stroke(this.config.letter.outlineColor);
      noFill();
      rect(
        0, 0,
        this.config.body.fallbackWidth,
        this.config.body.fallbackHeight,
        this.config.body.fallbackRadius
      );
    }
  }
  
  // Draw animated emotion hotspot
  drawHotspot() {
    if (!this.currentEmotion) return;
    
    let pos = this.currentEmotion.getBodyPosition();
    let emotionColor = this.currentEmotion.getColor();
    
    // Calculate breathing animation
    let vibration = sin(millis() * this.config.animation.breathingFrequency);
    
    // Map vibration to size and glow variations
    let sizeVar = map(
      vibration,
      -1, 1,
      this.config.animation.sizeMin,
      this.config.animation.sizeMax
    );
    
    let glowVar = map(
      vibration,
      -1, 1,
      this.config.animation.glowMin,
      this.config.animation.glowMax
    );
    
    // Draw hotspot with glow effect
    noStroke();
    fill(emotionColor);
    
    // Apply shadow/glow effect
    drawingContext.shadowBlur = glowVar;
    drawingContext.shadowColor = emotionColor;
    
    ellipse(pos.x, pos.y, sizeVar, sizeVar);
    
    // Reset shadow
    drawingContext.shadowBlur = 0;
  }
  
  // Draw emotion description text
  drawDescription() {
    if (!this.currentEmotion) return;
    
    fill(this.config.letter.outlineColor);
    noStroke();
    textSize(this.config.body.descriptionSize);
    textLeading(this.config.body.descriptionLeading);
    textAlign(CENTER, CENTER);
    
    text(
      this.currentEmotion.getDescription(),
      0,
      this.config.body.descriptionY,
      this.config.body.descriptionWidth,
      this.config.body.descriptionHeight
    );
  }
  
  // Check if an emotion is currently selected
  hasEmotion() {
    return this.currentEmotion !== null;
  }
  
  // Clear current emotion
  clearEmotion() {
    this.currentEmotion = null;
  }
  
  // Update body image (if loading asynchronously)
  setBodyImage(img) {
    this.bodyImg = img;
    if (img && img.width > 0) {
      this.imgLoaded = true;
    }
  }
}
