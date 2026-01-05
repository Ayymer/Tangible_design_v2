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
    // Create off-screen graphics if needed
    if (!this.samplingGraphics) {
      this.samplingGraphics = createGraphics(width, height);
    }
    
    let pg = this.samplingGraphics;
    
    // Clear and draw text
    pg.clear();
    pg.fill(255);
    pg.noStroke();
    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textAlign(CENTER, CENTER);
    pg.text(text, x, y);
    
    // Load pixels
    pg.loadPixels();
    
    // Collect all valid pixels (where text is drawn)
    let validPixels = [];
    let step = 2; // Sample every 2 pixels for performance
    
    for (let py = 0; py < pg.height; py += step) {
      for (let px = 0; px < pg.width; px += step) {
        let index = (px + py * pg.width) * 4;
        let alpha = pg.pixels[index + 3];
        
        // If pixel is part of text (alpha > threshold)
        if (alpha > 128) {
          validPixels.push({x: px, y: py});
        }
      }
    }
    
    // Randomly select numPoints from valid pixels
    let points = [];
    for (let i = 0; i < numPoints && validPixels.length > 0; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
      
      // Remove selected point to avoid duplicates (optional)
      // validPixels.splice(randomIndex, 1);
    }
    
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
    
    // Clear and draw text
    pg.clear();
    pg.fill(255);
    pg.noStroke();
    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textAlign(CENTER, CENTER);
    pg.text(text, x, y);
    
    // Load pixels
    pg.loadPixels();
    
    // Find edge pixels (pixels with at least one transparent neighbor)
    let edgePixels = [];
    let step = 2;
    
    for (let py = step; py < pg.height - step; py += step) {
      for (let px = step; px < pg.width - step; px += step) {
        let index = (px + py * pg.width) * 4;
        let alpha = pg.pixels[index + 3];
        
        // If this pixel is opaque
        if (alpha > 128) {
          // Check neighbors
          let hasTransparentNeighbor = false;
          
          for (let dy = -step; dy <= step; dy += step) {
            for (let dx = -step; dx <= step; dx += step) {
              if (dx === 0 && dy === 0) continue;
              
              let nx = px + dx;
              let ny = py + dy;
              let nIndex = (nx + ny * pg.width) * 4;
              let nAlpha = pg.pixels[nIndex + 3];
              
              if (nAlpha < 128) {
                hasTransparentNeighbor = true;
                break;
              }
            }
            if (hasTransparentNeighbor) break;
          }
          
          if (hasTransparentNeighbor) {
            edgePixels.push({x: px, y: py});
          }
        }
      }
    }
    
    // Randomly select numPoints from edge pixels
    let points = [];
    for (let i = 0; i < numPoints && edgePixels.length > 0; i++) {
      let randomIndex = floor(random(edgePixels.length));
      points.push(edgePixels[randomIndex]);
    }
    
    return points;
  }
  
  /**
   * Sample points from image (for body silhouette)
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
    if (!this.samplingGraphics) {
      this.samplingGraphics = createGraphics(width, height);
    }
    
    let pg = this.samplingGraphics;
    
    // Clear and draw image
    pg.clear();
    pg.imageMode(CENTER);
    pg.image(img, x, y, w, h);
    
    // Load pixels
    pg.loadPixels();
    
    let validPixels = [];
    let step = 3; // Sample every 3 pixels for performance
    
    if (outlineOnly) {
      // Find edge pixels
      for (let py = step; py < pg.height - step; py += step) {
        for (let px = step; px < pg.width - step; px += step) {
          let index = (px + py * pg.width) * 4;
          let alpha = pg.pixels[index + 3];
          
          if (alpha > 128) {
            // Check neighbors for edge
            let hasTransparentNeighbor = false;
            
            for (let dy = -step; dy <= step; dy += step) {
              for (let dx = -step; dx <= step; dx += step) {
                if (dx === 0 && dy === 0) continue;
                
                let nx = px + dx;
                let ny = py + dy;
                let nIndex = (nx + ny * pg.width) * 4;
                let nAlpha = pg.pixels[nIndex + 3];
                
                if (nAlpha < 128) {
                  hasTransparentNeighbor = true;
                  break;
                }
              }
              if (hasTransparentNeighbor) break;
            }
            
            if (hasTransparentNeighbor) {
              validPixels.push({x: px, y: py});
            }
          }
        }
      }
    } else {
      // Sample all opaque pixels
      for (let py = 0; py < pg.height; py += step) {
        for (let px = 0; px < pg.width; px += step) {
          let index = (px + py * pg.width) * 4;
          let alpha = pg.pixels[index + 3];
          
          if (alpha > 128) {
            validPixels.push({x: px, y: py});
          }
        }
      }
    }
    
    // Randomly select numPoints
    let points = [];
    for (let i = 0; i < numPoints && validPixels.length > 0; i++) {
      let randomIndex = floor(random(validPixels.length));
      points.push(validPixels[randomIndex]);
    }
    
    return points;
  }
}
