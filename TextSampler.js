/* ============================================
   TEXT SAMPLER
   Samples points from text shapes for particles
   Uses pixel-based approach for filled text shapes
   ============================================ */

// Global font variable - must be loaded in preload()
let samplerFont = null;

// Font URL - using a CDN-hosted open source font
const FONT_URL = 'https://cdn.jsdelivr.net/npm/open-fonts@1.1.1/fonts/src/liberation-sans/LiberationSans-Bold.ttf';

/**
 * Load the font for TextSampler - call this in preload()
 * @returns {Promise} Promise that resolves when font is loaded
 */
function loadSamplerFont() {
  return new Promise((resolve, reject) => {
    loadFont(FONT_URL, 
      (font) => {
        samplerFont = font;
        console.log('✅ TextSampler font loaded successfully');
        resolve(font);
      },
      (err) => {
        console.error('❌ Failed to load TextSampler font:', err);
        reject(err);
      }
    );
  });
}

class TextSampler {
  constructor() {
    // Graphics buffer for pixel sampling
    this.pg = null;
  }
  
  /**
   * Sample points from text using pixel-based approach for FILLED shapes
   * This creates readable text by sampling all pixels inside the letters
   * @param {string} text - Text to sample
   * @param {number} centerX - X position (center of text on canvas)
   * @param {number} centerY - Y position (center of text on canvas)
   * @param {number} fontSize - Font size
   * @param {number} numPoints - Number of points to sample
   * @returns {Array} Array of {x, y} points in canvas coordinates
   */
  sampleText(text, centerX, centerY, fontSize, numPoints) {
    console.log(`📝 Sampling "${text}" at canvas center (${centerX}, ${centerY}), size: ${fontSize}`);
    
    // Check if font is available
    if (!samplerFont) {
      console.error('❌ TextSampler: No font loaded! Make sure to call loadSamplerFont() in preload()');
      return this.sampleTextFallback(text, centerX, centerY, fontSize, numPoints);
    }
    
    // Calculate buffer size based on text
    textFont(samplerFont);
    textSize(fontSize);
    let tw = textWidth(text);
    let th = fontSize * 1.5; // Add some vertical padding
    
    // Add padding around text
    let padding = 20;
    let bufferWidth = ceil(tw + padding * 2);
    let bufferHeight = ceil(th + padding * 2);
    
    console.log(`📐 Creating buffer: ${bufferWidth}x${bufferHeight}`);
    
    // Create off-screen graphics buffer
    this.pg = createGraphics(bufferWidth, bufferHeight);
    this.pg.pixelDensity(1); // Important: set to 1 for consistent pixel access
    
    // Draw text on buffer
    this.pg.background(0); // Black background
    this.pg.fill(255); // White text
    this.pg.noStroke();
    this.pg.textFont(samplerFont);
    this.pg.textSize(fontSize);
    this.pg.textAlign(CENTER, CENTER);
    this.pg.text(text, bufferWidth / 2, bufferHeight / 2);
    
    // Load pixels from buffer
    this.pg.loadPixels();
    
    // Collect all white (text) pixels
    let textPixels = [];
    let step = 1; // Sample every pixel for maximum density
    
    for (let y = 0; y < bufferHeight; y += step) {
      for (let x = 0; x < bufferWidth; x += step) {
        let index = (x + y * bufferWidth) * 4;
        let r = this.pg.pixels[index];
        let g = this.pg.pixels[index + 1];
        let b = this.pg.pixels[index + 2];
        
        // Check if pixel is white (part of text)
        let brightness = (r + g + b) / 3;
        if (brightness > 128) {
          // Convert buffer coordinates to canvas coordinates
          let canvasX = centerX - bufferWidth / 2 + x;
          let canvasY = centerY - bufferHeight / 2 + y;
          textPixels.push({ x: canvasX, y: canvasY });
        }
      }
    }
    
    console.log(`✅ Found ${textPixels.length} text pixels`);
    
    // Clean up buffer
    this.pg.remove();
    this.pg = null;
    
    if (textPixels.length === 0) {
      console.error('❌ No text pixels found! Using fallback...');
      return this.sampleTextFallback(text, centerX, centerY, fontSize, numPoints);
    }
    
    // Randomly sample requested number of points
    let sampledPoints = [];
    let actualPoints = min(numPoints, textPixels.length);
    
    // If we need more points than pixels, allow duplicates with slight offset
    if (numPoints > textPixels.length) {
      // First add all unique pixels
      for (let pixel of textPixels) {
        sampledPoints.push({ x: pixel.x, y: pixel.y });
      }
      // Then add duplicates with small random offset
      while (sampledPoints.length < numPoints) {
        let randomIndex = floor(random(textPixels.length));
        let pixel = textPixels[randomIndex];
        sampledPoints.push({
          x: pixel.x + random(-1, 1),
          y: pixel.y + random(-1, 1)
        });
      }
    } else {
      // Random sampling without replacement
      let indices = [];
      for (let i = 0; i < textPixels.length; i++) {
        indices.push(i);
      }
      // Shuffle and take first numPoints
      for (let i = indices.length - 1; i > 0; i--) {
        let j = floor(random(i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      for (let i = 0; i < actualPoints; i++) {
        sampledPoints.push(textPixels[indices[i]]);
      }
    }
    
    console.log(`✨ Returning ${sampledPoints.length} sampled points`);
    
    // Debug: log sample coordinates
    if (sampledPoints.length > 0) {
      console.log(`🔍 Sample point: (${floor(sampledPoints[0].x)}, ${floor(sampledPoints[0].y)})`);
    }
    
    return sampledPoints;
  }
  
  /**
   * Fallback method using textToPoints for outline sampling
   * Used when pixel-based approach fails
   */
  sampleTextFallback(text, centerX, centerY, fontSize, numPoints) {
    console.log('⚠️ Using fallback textToPoints method');
    
    if (!samplerFont) {
      console.error('❌ No font available for fallback!');
      return [];
    }
    
    textSize(fontSize);
    textFont(samplerFont);
    
    let tw = textWidth(text);
    let textX = centerX - tw / 2;
    let textY = centerY + fontSize / 3;
    
    let sampleFactor = max(0.05, 0.3 / (numPoints / 1000));
    
    let points = samplerFont.textToPoints(text, textX, textY, fontSize, {
      sampleFactor: sampleFactor,
      simplifyThreshold: 0
    });
    
    console.log(`📍 textToPoints returned ${points.length} outline points`);
    
    if (points.length === 0) return [];
    
    let sampledPoints = [];
    let actualPoints = min(numPoints, points.length);
    
    for (let i = 0; i < actualPoints; i++) {
      let randomIndex = floor(random(points.length));
      sampledPoints.push(points[randomIndex]);
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
