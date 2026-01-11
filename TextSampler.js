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
   * @param {number} centerX - X position (center of text on canvas)
   * @param {number} centerY - Y position (center of text on canvas)
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points in canvas coordinates
   */
  sampleText(text, centerX, centerY, fontSize, numPoints) {
    console.log(`📝 Sampling "${text}" at canvas center (${centerX}, ${centerY}), size: ${fontSize}`);
    
    // Estimate text dimensions (generous for bold text)
    let charWidth = fontSize * 0.7;  // Increased from 0.6
    let textWidth = text.length * charWidth;
    let textHeight = fontSize;
    
    // Create buffer large enough for the text (with extra margin)
    let bufferWidth = ceil(textWidth * 2);   // Increased from 1.5
    let bufferHeight = ceil(textHeight * 2); // Increased from 1.5
    let pg = createGraphics(bufferWidth, bufferHeight);
    
    console.log(`📐 Buffer: ${bufferWidth}x${bufferHeight}, estimated text: ${floor(textWidth)}x${floor(textHeight)}`);
    
    // Draw text centered in the buffer
    pg.background(0);
    pg.fill(255);
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
    let step = 2;
    
    for (let py = 0; py < pg.height; py += step) {
      for (let px = 0; px < pg.width; px += step) {
        let index = (px + py * pg.width) * 4;
        let brightness = pg.pixels[index];
        
        // If pixel is white (part of text)
        if (brightness > 200) {
          // Transform from buffer coordinates to canvas coordinates
          // Buffer center is at (bufferWidth/2, bufferHeight/2)
          // Canvas center should be at (centerX, centerY)
          let offsetX = px - bufferWidth / 2;
          let offsetY = py - bufferHeight / 2;
          let canvasX = centerX + offsetX;
          let canvasY = centerY + offsetY;
          
          validPixels.push({x: canvasX, y: canvasY});
        }
      }
    }
    
    console.log(`✅ Found ${validPixels.length} valid text pixels`);
    
    // Clean up
    pg.remove();
    
    // If no pixels found, return empty
    if (validPixels.length === 0) {
      console.error('❌ No text pixels found!');
      return [];
    }
    
    // Randomly sample points
    let points = [];
    let actualPoints = min(numPoints, validPixels.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    console.log(`✨ Returning ${points.length} points`);
    
    // Debug: log first few points to verify coordinates
    if (points.length > 0) {
      console.log(`🔍 Sample points: (${floor(points[0].x)}, ${floor(points[0].y)}), (${floor(points[min(5, points.length-1)].x)}, ${floor(points[min(5, points.length-1)].y)})`);
    }
    
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
