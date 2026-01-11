/* ============================================
   PARAMETER DISPLAY - PHASE 3
   Modern glassmorphism design for parameter UI
   ============================================ */

class ParameterDisplayPhase3 {
  constructor(config) {
    this.config = config.ui.parameterDisplay;
    this.lastUpdate = 0;
    this.highlightParam = null;
    this.highlightTime = 0;
  }
  
  /**
   * Highlight a parameter when it's changed
   */
  highlight(paramName) {
    this.highlightParam = paramName;
    this.highlightTime = millis();
  }
  
  /**
   * Draw the parameter display
   */
  display(params) {
    push();
    
    // Position at bottom-right
    let panelWidth = 200;
    let panelHeight = 180;
    let x = width + this.config.x - panelWidth;
    let y = height + this.config.y - panelHeight;
    
    // Glassmorphism background
    fill(255, 255, 255, 13); // rgba(255, 255, 255, 0.05)
    noStroke();
    rect(x, y, panelWidth, panelHeight, this.config.borderRadius);
    
    // Border
    noFill();
    stroke(255, 255, 255, 51); // rgba(255, 255, 255, 0.2)
    strokeWeight(1.5);
    rect(x, y, panelWidth, panelHeight, this.config.borderRadius);
    
    // Content
    noStroke();
    textSize(this.config.fontSize);
    textAlign(LEFT, TOP);
    
    let contentX = x + this.config.padding;
    let contentY = y + this.config.padding;
    let lineY = contentY;
    
    // Draw each parameter
    this.drawParameter('H', params.hue + '°', contentX, lineY, '●');
    lineY += this.config.lineHeight;
    
    this.drawParameter('E', floor(params.energy), contentX, lineY, '▸');
    lineY += this.config.lineHeight;
    
    this.drawParameter('A', floor(params.amount), contentX, lineY, '▪▪▪');
    lineY += this.config.lineHeight;
    
    this.drawParameter('R', floor(params.radius), contentX, lineY, '●');
    lineY += this.config.lineHeight;
    
    this.drawParameter('T', floor(params.turbulence), contentX, lineY, '~');
    
    pop();
  }
  
  /**
   * Draw a single parameter line
   */
  drawParameter(key, value, x, y, icon) {
    // Check if this parameter was recently changed
    let isHighlighted = (this.highlightParam === key && millis() - this.highlightTime < 500);
    let alpha = isHighlighted ? 255 : 230;
    
    // Highlight background
    if (isHighlighted) {
      let fadeProgress = (millis() - this.highlightTime) / 500;
      let highlightAlpha = (1 - fadeProgress) * 60;
      fill(255, 255, 255, highlightAlpha);
      noStroke();
      rect(x - 8, y - 2, 180, this.config.lineHeight - 4, 4);
    }
    
    // Key letter (bold)
    fill(255, 255, 255, alpha);
    textStyle(BOLD);
    text(key + ':', x, y);
    
    // Value
    textStyle(NORMAL);
    let valueStr = typeof value === 'number' ? value.toString() : value;
    text(valueStr, x + 30, y);
    
    // Icon
    fill(255, 255, 255, alpha * 0.6);
    text(icon, x + 160, y);
  }
  
  /**
   * Static method to display instructions
   */
  static displayInstructions(config) {
    push();
    
    let instrConfig = config.ui.instructions;
    
    textAlign(LEFT, TOP);
    textSize(instrConfig.fontSize);
    fill(255, 255, 255, instrConfig.opacity * 255);
    
    let x = instrConfig.x;
    let y = instrConfig.y;
    
    // Title
    textStyle(BOLD);
    text(config.text.instructions[0], x, y);
    y += instrConfig.lineHeight;
    
    // Instructions
    textStyle(NORMAL);
    for (let i = 2; i < config.text.instructions.length; i++) {
      text(config.text.instructions[i], x, y);
      y += instrConfig.lineHeight;
    }
    
    pop();
  }
}
