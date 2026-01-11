/* ============================================
   TEXT SAMPLER
   Samples points from text shapes for particles
   ============================================ */

class TextSampler {
  constructor() {
    // No state needed
  }
  
  /**
   * Sample points from text using textToPoints()
   * @param {string} text - Text to sample
   * @param {number} centerX - X position (center of text on canvas)
   * @param {number} centerY - Y position (center of text on canvas)
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points in canvas coordinates
   */
  sampleText(text, centerX, centerY, fontSize, numPoints) {
    console.log(`📝 Sampling "${text}" at canvas center (${centerX}, ${centerY}), size: ${fontSize}`);
    
    // Set up text properties
    textSize(fontSize);
    textFont('Arial');
    textStyle(BOLD);
    
    // Get text bounds to calculate offset for centering
    let bounds = textFont().textBounds(text, 0, 0, fontSize);
    let textWidth = bounds.w;
    let textHeight = bounds.h;
    
    console.log(`📐 Text bounds: ${floor(textWidth)}x${floor(textHeight)}`);
    
    // Calculate position so text is centered
    // textToPoints uses baseline positioning, so we need to adjust
    let textX = centerX - textWidth / 2;
    let textY = centerY + textHeight / 4; // Adjust for baseline
    
    // Use textToPoints to get outline points
    // sampleFactor controls density (lower = more points)
    let sampleFactor = max(0.05, 0.5 / (numPoints / 1000)); // Adaptive sampling
    let points = textFont().textToPoints(text, textX, textY, fontSize, {
      sampleFactor: sampleFactor,
      simplifyThreshold: 0
    });
    
    console.log(`✅ textToPoints returned ${points.length} outline points`);
    
    if (points.length === 0) {
      console.error('❌ No points from textToPoints!');
      return [];
    }
    
    // Fill in the interior of letters by sampling a grid within bounds
    let allPoints = [...points]; // Start with outline points
    
    // Add interior points
    let step = fontSize / 20; // Grid step size
    for (let py = bounds.y; py < bounds.y + bounds.h; py += step) {
      for (let px = bounds.x; px < bounds.x + bounds.w; px += step) {
        // Check if this point is inside the text shape
        // by rendering text and checking pixel
        if (this.isPointInText(text, px, py, textX, textY, fontSize)) {
          allPoints.push({
            x: textX + px,
            y: textY + py
          });
        }
      }
    }
    
    console.log(`✅ Total points (outline + interior): ${allPoints.length}`);
    
    // Randomly sample requested number of points
    let sampledPoints = [];
    let actualPoints = min(numPoints, allPoints.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(allPoints.length));
      sampledPoints.push(allPoints[randomIndex]);
    }
    
    console.log(`✨ Returning ${sampledPoints.length} sampled points`);
    
    // Debug: log sample coordinates
    if (sampledPoints.length > 0) {
      console.log(`🔍 Sample points: (${floor(sampledPoints[0].x)}, ${floor(sampledPoints[0].y)})`);
    }
    
    return sampledPoints;
  }
  
  /**
   * Check if a point is inside the text shape
   * Uses a small off-screen buffer to test
   */
  isPointInText(text, px, py, textX, textY, fontSize) {
    // Create tiny buffer just for this test
    let testSize = 10;
    let pg = createGraphics(testSize, testSize);
    
    pg.background(0);
    pg.fill(255);
    pg.textSize(fontSize);
    pg.textFont('Arial');
    pg.textStyle(BOLD);
    
    // Draw text offset so our test point is in center of buffer
    pg.text(text, testSize/2 - px, testSize/2 - py);
    
    pg.loadPixels();
    let centerIndex = (floor(testSize/2) + floor(testSize/2) * testSize) * 4;
    let brightness = pg.pixels[centerIndex];
    
    pg.remove();
    
    return brightness > 128;
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
