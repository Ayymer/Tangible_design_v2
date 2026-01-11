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
    
    // Measure text width using textWidth()
    let tw = textWidth(text);
    let th = fontSize; // Approximate height as fontSize
    
    console.log(`📐 Text bounds: ${floor(tw)}x${floor(th)}`);
    
    // Calculate position so text is centered
    // textToPoints uses baseline positioning, so we need to adjust
    let textX = centerX - tw / 2;
    let textY = centerY; // Center vertically
    
    // Use font().textToPoints() to get outline points
    // sampleFactor controls density (lower = more points)
    let sampleFactor = max(0.05, 0.5 / (numPoints / 1000)); // Adaptive sampling
    let font = textFont();
    let points = font.textToPoints(text, textX, textY, fontSize, {
      sampleFactor: sampleFactor,
      simplifyThreshold: 0
    });
    
    console.log(`✅ textToPoints returned ${points.length} outline points`);
    
    if (points.length === 0) {
      console.error('❌ No points from textToPoints!');
      return [];
    }
    
    // Randomly sample requested number of points from outline
    let sampledPoints = [];
    let actualPoints = min(numPoints, points.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(points.length));
      sampledPoints.push(points[randomIndex]);
    }
    
    console.log(`✨ Returning ${sampledPoints.length} sampled points`);
    
    // Debug: log sample coordinates
    if (sampledPoints.length > 0) {
      console.log(`🔍 Sample points: (${floor(sampledPoints[0].x)}, ${floor(sampledPoints[0].y)})`);
    }
    
    return sampledPoints;
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
