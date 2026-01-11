/* ============================================
   TEXT SAMPLER
   Samples points from text shapes for particles
   ============================================ */

class TextSampler {
  constructor() {
    this.samplingGraphics = null;
  }
  
  /**
   * Sample points from text using pixel-based approach
   * @param {string} text - Text to sample
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points
   */
  sampleText(text, x, y, fontSize, numPoints) {
    console.log(`📝 Sampling text: "${text}" at (${x}, ${y}), size: ${fontSize}, points: ${numPoints}`);
    
    // Create off-screen graphics if needed
    if (!this.samplingGraphics) {
      this.samplingGraphics = createGraphics(width, height);
      console.log(`✅ Created sampling graphics: ${width}x${height}`);
    }
    
    let pg = this.samplingGraphics;
    
    // Ensure graphics is correct size
    if (pg.width !== width || pg.height !== height) {
      pg.resizeCanvas(width, height);
      console.log(`📐 Resized sampling graphics: ${width}x${height}`);
    }
    
    // Clear and draw text
    pg.clear();
    pg.background(0); // Black background for testing
    pg.fill(255);     // White text
    pg.noStroke();
    pg.textSize(fontSize);
    pg.textFont('Arial'); // Use standard font
    pg.textStyle(BOLD);
    pg.textAlign(CENTER, CENTER);
    pg.text(text, x, y);
    
    // Load pixels
    pg.loadPixels();
    
    // Collect all valid pixels (where text is drawn)
    let validPixels = [];
    let step = 3; // Sample every 3 pixels for performance
    
    let minX = width, maxX = 0, minY = height, maxY = 0;
    
    for (let py = 0; py < pg.height; py += step) {
      for (let px = 0; px < pg.width; px += step) {
        let index = (px + py * pg.width) * 4;
        let r = pg.pixels[index];
        let g = pg.pixels[index + 1];
        let b = pg.pixels[index + 2];
        let alpha = pg.pixels[index + 3];
        
        // If pixel is part of text (bright and opaque)
        if ((r > 128 || g > 128 || b > 128) && alpha > 128) {
          validPixels.push({x: px, y: py});
          
          // Track bounds
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
    }
    
    console.log(`✅ Found ${validPixels.length} valid pixels`);
    console.log(`📏 Text bounds: (${minX}, ${minY}) to (${maxX}, ${maxY})`);
    console.log(`📏 Text size: ${maxX - minX}x${maxY - minY}`);
    
    if (validPixels.length === 0) {
      console.error('❌ No valid pixels found! Text may not be rendering.');
      console.log(`Debug: Canvas size: ${width}x${height}, Text pos: (${x}, ${y}), Font size: ${fontSize}`);
      return [];
    }
    
    // Randomly select numPoints from valid pixels
    let points = [];
    let actualPoints = min(numPoints, validPixels.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    console.log(`✨ Sampled ${points.length} points for particles`);
    
    return points;
  }
  
  /**
   * Sample points from text outline (perimeter only)
   * @param {string} text - Text to sample
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points
   */
  sampleTextOutline(text, x, y, fontSize, numPoints) {
    if (!this.samplingGraphics) {
      this.samplingGraphics = createGraphics(width, height);
    }
    
    let pg = this.samplingGraphics;
    
    // Clear and draw text outline
    pg.clear();
    pg.noFill();
    pg.stroke(255);
    pg.strokeWeight(2);
    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textAlign(CENTER, CENTER);
    pg.text(text, x, y);
    
    // Load pixels
    pg.loadPixels();
    
    // Collect outline pixels
    let validPixels = [];
    let step = 2;
    
    for (let py = 0; py < pg.height; py += step) {
      for (let px = 0; px < pg.width; px += step) {
        let index = (px + py * pg.width) * 4;
        let alpha = pg.pixels[index + 3];
        
        if (alpha > 128) {
          validPixels.push({x: px, y: py});
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
  
  /**
   * Sample points from image
   * @param {p5.Image} img - Image to sample
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {number} numPoints - Number of points to sample
   * @param {boolean} outlineOnly - Sample only outline
   * @returns {Array} Array of {x, y} points
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
