/* ============================================
   PARAMETER DISPLAY - PHASE 3
   Compact parameter display for top-right corner
   ============================================ */

class ParameterDisplayPhase3 {
  constructor(config) {
    this.config = config.ui.parameterDisplay;
    this.params = null;
    this.lastChanged = null;
    this.highlightTime = 0;
  }
  
  updateParams(params, changedParam = null) {
    this.params = params;
    if (changedParam) {
      this.lastChanged = changedParam;
      this.highlightTime = 0;
    }
  }
  
  display() {
    if (!this.params) return;
    
    push();
    
    let x = width + this.config.x;
    let y = this.config.y;
    
    textAlign(RIGHT, TOP);
    textSize(this.config.size);
    
    this.highlightTime++;
    
    this.displayParam('H', this.params.hue, x, y, '●');
    y += this.config.lineHeight;
    
    this.displayParam('E', this.params.energy, x, y, '▸');
    y += this.config.lineHeight;
    
    this.displayParam('A', this.params.amount, x, y, this.getAmountIcon(this.params.amount));
    y += this.config.lineHeight;
    
    this.displayParam('R', this.params.radius, x, y, '●');
    y += this.config.lineHeight;
    
    this.displayParam('T', this.params.turbulence, x, y, '~');
    
    pop();
  }
  
  displayParam(label, value, x, y, icon) {
    let isHighlighted = this.lastChanged === label && this.highlightTime < 30;
    
    push();
    
    if (isHighlighted) {
      fill(255, 255, 0);
      textStyle(BOLD);
    } else {
      fill(this.config.color);
      textStyle(NORMAL);
    }
    
    let displayValue;
    if (label === 'H') {
      displayValue = Math.round(value) + '°';
    } else {
      displayValue = Math.round(value);
    }
    
    text(`${label}: ${displayValue}  ${icon}`, x, y);
    
    pop();
  }
  
  getAmountIcon(amount) {
    if (amount < 33) return '▪';
    else if (amount < 66) return '▪▪';
    else return '▪▪▪';
  }
  
  static displayInstructions(config) {
    push();
    
    let instrConfig = config.ui.instructions;
    
    textAlign(LEFT, TOP);
    textSize(instrConfig.size);
    fill(instrConfig.color);
    
    let x = instrConfig.x;
    let y = instrConfig.y;
    
    for (let line of instrConfig.text) {
      text(line, x, y);
      y += instrConfig.lineHeight;
    }
    
    pop();
  }
}
