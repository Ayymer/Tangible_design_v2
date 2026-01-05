/* ============================================
   PARAMETER DISPLAY CLASS
   Visual feedback showing current parameter values
   ============================================ */

class ParameterDisplay {
  constructor() {
    this.position = { x: 20, y: null }; // y set dynamically
    this.barWidth = 220;
    this.barHeight = 15;
    this.spacing = 25;
    this.activeParam = null;
    this.activeFade = 0;
    
    // Parameter labels with keys
    this.paramLabels = {
      density: 'H - Density',
      energy: 'E - Energy',
      amplitude: 'A - Amplitude',
      roughness: 'R - Roughness',
      turbulence: 'T - Turbulence'
    };
    
    // Parameter order for display
    this.paramOrder = ['density', 'energy', 'amplitude', 'roughness', 'turbulence'];
  }
  
  // Main draw method
  draw(params, emotionColor) {
    if (!params) return;
    
    push();
    
    // Position at bottom left
    this.position.y = height - 160;
    
    // Background panel
    fill(0, 0, 0, 180);
    noStroke();
    rect(
      this.position.x - 10, 
      this.position.y - 10,
      this.barWidth + 20, 
      this.spacing * 5 + 20, 
      5
    );
    
    // Draw each parameter bar
    let currentValues = params.getCurrent();
    let targetValues = params.getTarget();
    
    this.paramOrder.forEach((param, index) => {
      let y = this.position.y + index * this.spacing;
      this.drawParameterBar(
        param,
        currentValues[param],
        targetValues[param],
        y,
        emotionColor
      );
    });
    
    // Fade active highlight
    if (this.activeFade > 0) {
      this.activeFade -= 0.05;
    }
    
    pop();
  }
  
  // Draw individual parameter bar
  drawParameterBar(param, currentValue, targetValue, y, emotionColor) {
    let x = this.position.x;
    let isActive = (param === this.activeParam && this.activeFade > 0);
    
    // Label
    fill(255);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text(this.paramLabels[param], x, y);
    
    // Bar background
    fill(50);
    rect(x + 110, y - this.barHeight / 2, this.barWidth - 110, this.barHeight, 3);
    
    // Bar fill (current value)
    let fillWidth = map(currentValue, 0, 100, 0, this.barWidth - 110);
    
    // Color with active highlight
    if (isActive) {
      let c = color(emotionColor);
      let white = color(255);
      fill(lerpColor(c, white, this.activeFade));
    } else {
      fill(emotionColor);
    }
    
    rect(x + 110, y - this.barHeight / 2, fillWidth, this.barHeight, 3);
    
    // Target indicator (small tick) if different from current
    if (abs(currentValue - targetValue) > 1) {
      let targetX = x + 110 + map(targetValue, 0, 100, 0, this.barWidth - 110);
      stroke(255);
      strokeWeight(2);
      line(targetX, y - this.barHeight / 2 - 3, targetX, y + this.barHeight / 2 + 3);
    }
    
    // Value text
    noStroke();
    fill(255);
    textAlign(RIGHT, CENTER);
    text(round(currentValue), x + this.barWidth, y);
  }
  
  // Highlight a parameter (called when button pressed)
  highlightParameter(param) {
    this.activeParam = param;
    this.activeFade = 1.0;
  }
  
  // Set position
  setPosition(x, y) {
    this.position = { x, y };
  }
  
  // Set bar width
  setBarWidth(width) {
    this.barWidth = width;
  }
  
  // Set spacing
  setSpacing(spacing) {
    this.spacing = spacing;
  }
  
  // Get total height
  getTotalHeight() {
    return this.spacing * 5 + 20;
  }
  
  // Get total width
  getTotalWidth() {
    return this.barWidth + 20;
  }
}
