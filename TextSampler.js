/* ============================================
   TEXT SAMPLER
   Samples points from text shapes for particles
   ============================================ */

class TextSampler {
  constructor() {
    // No state needed
  }
  
  /**
   * Sample points from text by rendering it and checking pixels
   * @param {string} text - Text to sample
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points
   */
  sampleText(text, x, y, fontSize, numPoints) {
    console.log(`📝 Sampling "${text}" at (${x}, ${y}), size: ${fontSize}, requesting: ${numPoints} points`);
    
    // Estimate text bounds
    let charWidth = fontSize * 0.6; // Average character width
    let textWidth = text.length * charWidth;
    let textHeight = fontSize * 1.2;
    
    // Create a buffer slightly larger than the text
    let bufferWidth = ceil(textWidth + 100);
    let bufferHeight = ceil(textHeight + 100);
    let pg = createGraphics(bufferWidth, bufferHeight);
    
    console.log(`📐 Buffer: ${bufferWidth}x${bufferHeight}`);
    
    // Draw text to buffer
    pg.background(0, 0, 0); // Black background
    pg.fill(255, 255, 255); // White text
    pg.noStroke();
    pg.textSize(fontSize);
    pg.textFont('Arial');
    pg.textStyle(BOLD);
    pg.textAlign(CENTER, CENTER);
    pg.text(text, bufferWidth / 2, bufferHeight / 2);
    
    // Load pixels
    pg.loadPixels();
    
    // Collect all white pixels (where text is)
    let validPixels = [];
    let step = 2; // Sample every 2 pixels for performance
    
    for (let py = 0; py < pg.height; py += step) {
      for (let px = 0; px < pg.width; px += step) {
        let index = (px + py * pg.width) * 4;
        let r = pg.pixels[index];
        let g = pg.pixels[index + 1];
        let b = pg.pixels[index + 2];
        let a = pg.pixels[index + 3];
        
        // If pixel is bright (part of text)
        if (r > 200 && g > 200 && b > 200 && a > 200) {
          // Transform from buffer coordinates to canvas coordinates
          let canvasX = x - textWidth / 2 + (px - bufferWidth / 2);
          let canvasY = y - textHeight / 2 + (py - bufferHeight / 2);
          validPixels.push({x: canvasX, y: canvasY});
        }
      }
    }
    
    console.log(`✅ Found ${validPixels.length} valid text pixels`);
    
    // Clean up
    pg.remove();
    
    // If no pixels found, return empty array (don't use fallback)
    if (validPixels.length === 0) {
      console.error('❌ No text pixels found! Check text rendering.');
      return [];
    }
    
    // Randomly sample points
    let points = [];
    let actualPoints = min(numPoints, validPixels.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    console.log(`✨ Returning ${points.length} sampled points`);
    
    return points;
  }
  
  /**
   * Sample points from image
   */
  sampleImage(img, x, y, w, h, numPoints) {
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
    let actualPoints = min(numPoints, validPixels.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    return points;
  }
}
