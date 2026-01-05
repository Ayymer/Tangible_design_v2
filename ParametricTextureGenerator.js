/* ============================================
   PARAMETRIC TEXTURE GENERATOR CLASS
   Generates textures based on emotion and parameters
   ============================================ */

class ParametricTextureGenerator {
  constructor(tileSize = 100) {
    this.tileSize = tileSize;
    this.cache = new Map();
    this.maxCacheSize = 50;
  }
  
  // Generate texture based on emotion and parameters
  generate(emotion, params) {
    // Create cache key
    let cacheKey = this.getCacheKey(emotion, params);
    
    // Return cached texture if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Create new graphics buffer
    let buffer = createGraphics(this.tileSize, this.tileSize);
    buffer.clear();
    
    // Call emotion-specific generator
    switch(emotion.getKey()) {
      case 'happiness':
        this.generateHappiness(buffer, emotion.getColor(), params);
        break;
      case 'envy':
        this.generateEnvy(buffer, emotion.getColor(), params);
        break;
      case 'anger':
        this.generateAnger(buffer, emotion.getColor(), params);
        break;
      case 'rage':
        this.generateRage(buffer, emotion.getColor(), params);
        break;
      case 'trust':
        this.generateTrust(buffer, emotion.getColor(), params);
        break;
      default:
        this.generateDefault(buffer, emotion.getColor(), params);
    }
    
    // Cache the result
    this.cacheTexture(cacheKey, buffer);
    
    return buffer;
  }
  
  // Generate Happiness: Radiating rays with sparkles
  generateHappiness(buffer, emotionColor, params) {
    buffer.push();
    buffer.translate(buffer.width / 2, buffer.height / 2);
    buffer.stroke(emotionColor);
    buffer.strokeWeight(1);
    buffer.noFill();
    
    // DENSITY: Number of rays
    let numRays = map(params.density, 0, 100, 5, 40);
    
    // AMPLITUDE: Length of rays
    let rayLength = map(params.amplitude, 0, 100, 10, 50);
    
    // ROUGHNESS: Jaggedness (segments in ray)
    let segments = floor(map(params.roughness, 0, 100, 1, 10));
    
    // TURBULENCE: Randomness in angle and length
    let angleNoise = map(params.turbulence, 0, 100, 0, 0.5);
    let lengthNoise = map(params.turbulence, 0, 100, 0, 20);
    
    // ENERGY: Used as variation seed
    let energySeed = params.energy;
    
    // Draw rays
    for (let i = 0; i < numRays; i++) {
      let baseAngle = (TWO_PI / numRays) * i;
      let angle = baseAngle + sin(i + energySeed * 0.1) * angleNoise;
      let len = rayLength + cos(i * 2 + energySeed * 0.1) * lengthNoise;
      
      // Draw ray with segments
      let prevX = 0, prevY = 0;
      for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = cos(angle) * len * t;
        let y = sin(angle) * len * t;
        
        // Add roughness jitter
        if (s > 0 && params.roughness > 20) {
          x += random(-params.roughness * 0.05, params.roughness * 0.05);
          y += random(-params.roughness * 0.05, params.roughness * 0.05);
        }
        
        if (s > 0) {
          buffer.line(prevX, prevY, x, y);
        }
        prevX = x;
        prevY = y;
      }
    }
    
    // Add sparkles based on density
    let numSparkles = map(params.density, 0, 100, 3, 20);
    for (let i = 0; i < numSparkles; i++) {
      let r = random(rayLength * 0.5);
      let a = random(TWO_PI);
      let x = cos(a) * r;
      let y = sin(a) * r;
      let size = map(params.amplitude, 0, 100, 1, 4);
      buffer.circle(x, y, size);
    }
    
    buffer.pop();
  }
  
  // Generate Envy: Tangled lines
  generateEnvy(buffer, emotionColor, params) {
    buffer.stroke(emotionColor);
    buffer.strokeWeight(map(params.amplitude, 0, 100, 0.5, 2));
    buffer.noFill();
    
    // DENSITY: Number of lines
    let numLines = map(params.density, 0, 100, 10, 60);
    
    // TURBULENCE: Randomness of endpoints
    let spread = map(params.turbulence, 0, 100, 20, buffer.width);
    
    // ROUGHNESS: Curve vs straight (inverted)
    let curviness = map(params.roughness, 0, 100, 1, 0);
    
    // ENERGY: Affects line complexity
    let complexity = map(params.energy, 0, 100, 1, 3);
    
    for (let i = 0; i < numLines; i++) {
      let x1 = random(buffer.width);
      let y1 = random(buffer.height);
      let x2 = x1 + random(-spread, spread);
      let y2 = y1 + random(-spread, spread);
      
      if (curviness > 0.3) {
        // Smooth curves
        buffer.bezier(
          x1, y1,
          x1 + random(-30 * complexity, 30 * complexity), 
          y1 + random(-30 * complexity, 30 * complexity),
          x2 + random(-30 * complexity, 30 * complexity), 
          y2 + random(-30 * complexity, 30 * complexity),
          x2, y2
        );
      } else {
        // Jagged lines
        let lineSegments = floor(map(params.roughness, 0, 100, 2, 8));
        for (let s = 0; s < lineSegments; s++) {
          let t1 = s / lineSegments;
          let t2 = (s + 1) / lineSegments;
          let px1 = lerp(x1, x2, t1) + random(-5, 5);
          let py1 = lerp(y1, y2, t1) + random(-5, 5);
          let px2 = lerp(x1, x2, t2) + random(-5, 5);
          let py2 = lerp(y1, y2, t2) + random(-5, 5);
          buffer.line(px1, py1, px2, py2);
        }
      }
    }
  }
  
  // Generate Anger: Aggressive diagonal strokes
  generateAnger(buffer, emotionColor, params) {
    buffer.stroke(emotionColor);
    buffer.strokeWeight(map(params.amplitude, 0, 100, 1, 3));
    buffer.noFill();
    
    // DENSITY: Spacing between strokes
    let spacing = map(params.density, 0, 100, 15, 3);
    
    // AMPLITUDE: Length variation
    let lengthVar = map(params.amplitude, 0, 100, 5, 30);
    
    // ROUGHNESS: Angle variation
    let angleVar = map(params.roughness, 0, 100, 0, 0.3);
    
    // TURBULENCE: Position jitter
    let jitter = map(params.turbulence, 0, 100, 0, 10);
    
    // ENERGY: Affects number of stroke directions
    let directions = params.energy > 50 ? 2 : 1;
    
    // Diagonal strokes (direction 1)
    for (let i = -buffer.width; i < buffer.width * 2; i += spacing) {
      let offset = random(-jitter, jitter);
      let angle = PI / 4 + random(-angleVar, angleVar);
      let len = buffer.height + random(-lengthVar, lengthVar);
      
      let x1 = i + offset;
      let y1 = 0;
      let x2 = x1 + cos(angle) * len;
      let y2 = y1 + sin(angle) * len;
      
      buffer.line(x1, y1, x2, y2);
    }
    
    // Cross-hatching if energy is high
    if (directions > 1) {
      for (let i = -buffer.width; i < buffer.width * 2; i += spacing * 1.5) {
        let offset = random(-jitter, jitter);
        let angle = -PI / 4 + random(-angleVar, angleVar);
        let len = buffer.height + random(-lengthVar, lengthVar);
        
        let x1 = i + offset;
        let y1 = buffer.height;
        let x2 = x1 + cos(angle) * len;
        let y2 = y1 + sin(angle) * len;
        
        buffer.line(x1, y1, x2, y2);
      }
    }
  }
  
  // Generate Rage: Explosive radial bursts
  generateRage(buffer, emotionColor, params) {
    buffer.push();
    buffer.translate(buffer.width / 2, buffer.height / 2);
    buffer.stroke(emotionColor);
    buffer.strokeWeight(map(params.amplitude, 0, 100, 0.5, 3));
    buffer.noFill();
    
    // DENSITY: Number of bursts
    let numBursts = map(params.density, 0, 100, 10, 60);
    
    // AMPLITUDE: Burst length
    let burstLength = map(params.amplitude, 0, 100, 15, 60);
    
    // ROUGHNESS: Jaggedness
    let segments = floor(map(params.roughness, 0, 100, 1, 8));
    
    // TURBULENCE: Angle and length chaos
    let chaos = map(params.turbulence, 0, 100, 0.1, 1.0);
    
    // ENERGY: Affects burst variation
    let energyFactor = map(params.energy, 0, 100, 0.5, 2.0);
    
    for (let i = 0; i < numBursts; i++) {
      let angle = random(TWO_PI);
      let len = burstLength * random(0.5, 1.0) * energyFactor * (1 + chaos * random(-0.5, 0.5));
      
      let prevX = 0, prevY = 0;
      for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = cos(angle) * len * t;
        let y = sin(angle) * len * t;
        
        // Add chaos
        x += random(-chaos * 5, chaos * 5);
        y += random(-chaos * 5, chaos * 5);
        
        if (s > 0) {
          buffer.line(prevX, prevY, x, y);
        }
        prevX = x;
        prevY = y;
      }
    }
    
    buffer.pop();
  }
  
  // Generate Trust: Gentle waves and ripples
  generateTrust(buffer, emotionColor, params) {
    buffer.stroke(emotionColor);
    buffer.strokeWeight(map(params.amplitude, 0, 100, 0.5, 2));
    buffer.noFill();
    
    // DENSITY: Number of waves
    let numWaves = map(params.density, 0, 100, 3, 15);
    let step = buffer.height / numWaves;
    
    // AMPLITUDE: Wave height
    let waveHeight = map(params.amplitude, 0, 100, 2, 15);
    
    // ROUGHNESS: Smoothness (inverted - lower roughness = smoother)
    let smoothness = map(params.roughness, 0, 100, 5, 20);
    
    // TURBULENCE: Irregularity
    let irregularity = map(params.turbulence, 0, 100, 0, 0.5);
    
    // ENERGY: Wave frequency
    let frequency = map(params.energy, 0, 100, 0.02, 0.1);
    
    // Horizontal waves
    for (let i = 0; i < numWaves; i++) {
      buffer.beginShape();
      for (let x = 0; x <= buffer.width; x += smoothness) {
        let y = i * step + sin(x * frequency + i) * waveHeight;
        y += random(-irregularity * 5, irregularity * 5);
        buffer.vertex(x, y);
      }
      buffer.endShape();
    }
    
    // Circular ripples if density is high
    if (params.density > 60) {
      buffer.push();
      buffer.translate(buffer.width / 2, buffer.height / 2);
      let numRipples = map(params.density, 60, 100, 3, 8);
      for (let r = 10; r < 50; r += 50 / numRipples) {
        buffer.circle(0, 0, r);
      }
      buffer.pop();
    }
  }
  
  // Default texture (fallback)
  generateDefault(buffer, emotionColor, params) {
    buffer.stroke(emotionColor);
    buffer.strokeWeight(1);
    buffer.noFill();
    
    let numLines = map(params.density, 0, 100, 5, 30);
    for (let i = 0; i < numLines; i++) {
      let x1 = random(buffer.width);
      let y1 = random(buffer.height);
      let x2 = random(buffer.width);
      let y2 = random(buffer.height);
      buffer.line(x1, y1, x2, y2);
    }
  }
  
  // Create Canvas pattern from buffer
  createPattern(buffer) {
    return drawingContext.createPattern(buffer.canvas, 'repeat');
  }
  
  // Cache management
  getCacheKey(emotion, params) {
    // Round params to reduce cache size
    let rounded = {};
    for (let key in params) {
      rounded[key] = round(params[key] / 5) * 5; // Round to nearest 5
    }
    return `${emotion.getKey()}_${JSON.stringify(rounded)}`;
  }
  
  cacheTexture(key, buffer) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      let firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, buffer);
  }
  
  clearCache() {
    this.cache.clear();
  }
  
  getCacheSize() {
    return this.cache.size;
  }
}
