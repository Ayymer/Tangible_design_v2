/* ============================================
   TEXT SAMPLER
   Samples points from text shapes for particles
   ============================================ */

class TextSampler {
  constructor() {
    this.font = null;
  }
  
  /**
   * Sample points from text using a grid-based approach
   * This method doesn't rely on textToPoints (which requires font loading)
   * Instead, it renders text to an off-screen buffer and samples pixels
   * @param {string} text - Text to sample
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points
   */
  sampleText(text, x, y, fontSize, numPoints) {
    console.log(`📝 Sampling text: "${text}" at (${x}, ${y}), size: ${fontSize}, points: ${numPoints}`);
    
    // Create a temporary graphics buffer
    let buffer = createGraphics(width, height);
    
    // Draw text to buffer with white on black
    buffer.background(0);
    buffer.fill(255);
    buffer.noStroke();
    buffer.textSize(fontSize);
    buffer.textAlign(CENTER, CENTER);
    buffer.textFont('Arial');
    buffer.textStyle(BOLD);
    
    // Draw the text
    buffer.text(text, x, y);
    
    // Force the buffer to update
    buffer.loadPixels();
    
    console.log(`📐 Buffer size: ${buffer.width}x${buffer.height}`);
    console.log(`📍 Checking pixels...`);
    
    // Collect all white pixels (where text is)
    let validPixels = [];
    let step = 3; // Sample every 3 pixels
    
    let pixelsChecked = 0;
    let whitePixels = 0;
    
    for (let py = 0; py < buffer.height; py += step) {
      for (let px = 0; px < buffer.width; px += step) {
        pixelsChecked++;
        let index = (px + py * buffer.width) * 4;
        
        // Check if pixel is white (text)
        let r = buffer.pixels[index];
        let g = buffer.pixels[index + 1];
        let b = buffer.pixels[index + 2];
        let a = buffer.pixels[index + 3];
        
        // If pixel is bright and opaque
        if (r > 200 && g > 200 && b > 200 && a > 200) {
          validPixels.push({x: px, y: py});
          whitePixels++;
        }
      }
    }
    
    console.log(`🔍 Checked ${pixelsChecked} pixels, found ${whitePixels} white pixels`);
    console.log(`✅ Valid pixels for sampling: ${validPixels.length}`);
    
    // If we still don't have pixels, try a simpler geometric approach
    if (validPixels.length === 0) {
      console.warn('⚠️ Pixel sampling failed, using geometric fallback');
      return this.sampleTextGeometric(text, x, y, fontSize, numPoints);
    }
    
    // Randomly select numPoints from valid pixels
    let points = [];
    let actualPoints = min(numPoints, validPixels.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    console.log(`✨ Sampled ${points.length} points for particles`);
    
    // Clean up
    buffer.remove();
    
    return points;
  }
  
  /**
   * Geometric fallback - creates points in a rectangular grid
   * approximating the text bounds
   */
  sampleTextGeometric(text, x, y, fontSize, numPoints) {
    console.log('📐 Using geometric approximation');
    
    // Estimate text bounds (rough approximation)
    let charWidth = fontSize * 0.6; // Average character width
    let textWidth = text.length * charWidth;
    let textHeight = fontSize;
    
    let points = [];
    let cols = ceil(sqrt(numPoints * (textWidth / textHeight)));
    let rows = ceil(numPoints / cols);
    
    let startX = x - textWidth / 2;
    let startY = y - textHeight / 2;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (points.length >= numPoints) break;
        
        let px = startX + (col / cols) * textWidth + random(-5, 5);
        let py = startY + (row / rows) * textHeight + random(-5, 5);
        
        points.push({x: px, y: py});
      }
    }
    
    console.log(`✨ Generated ${points.length} geometric points`);
    
    return points;
  }
  
  /**
   * Sample points from text outline (perimeter only)
   */
  sampleTextOutline(text, x, y, fontSize, numPoints) {
    // For now, just use regular sampling
    // Could be enhanced to detect edges
    return this.sampleText(text, x, y, fontSize, numPoints);
  }
  
  /**
   * Sample points from image
   */
  sampleImage(img, x, y, w, h, numPoints, outlineOnly = false) {
    if (!img) return [];
    
    img.loadPixels();
    
    let validPixels = [];
    let step = 2;
    
    // Calculate scaling
    let scaleX = w / img.width;
    let scaleY = h / img.height;
    
    for (let py = 0; py < img.height; py += step) {
      for (let px = 0; px < img.width; px += step) {
        let index = (px + py * img.width) * 4;
        let alpha = img.pixels[index + 3];
        
        if (alpha > 128) {
          // Transform to target position and scale
          let tx = x - w / 2 + px * scaleX;
          let ty = y - h / 2 + py * scaleY;
          validPixels.push({x: tx, y: ty});
        }
      }
    }
    
    // Randomly select points
    let points = [];
    for (let i = 0; i < numPoints && validPixels.length > 0; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    return points;
  }
}
