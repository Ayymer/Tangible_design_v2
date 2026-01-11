/* ============================================
   PARTICLE TYPE SUBCLASSES
   6 different particle renderers for emotions
   Enhanced with more dramatic animations
   ============================================ */

// ===== 1. SQUARE PARTICLES (Happiness) =====
class SquareParticle extends Particle {
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Pulsing effect
    let pulse = sin(frameCount * 0.05 + this.phase) * 0.3 + 1;
    let currentSize = this.size * pulse;
    
    colorMode(HSB);
    fill(this.currentHue, 80, 90, 0.9);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, currentSize, currentSize);
    
    // Add sparkle effect occasionally
    if (random() < 0.05) {
      fill(this.currentHue, 50, 100, 0.6);
      rect(0, 0, currentSize * 0.5, currentSize * 0.5);
    }
    pop();
  }
}

// ===== 2. DOT PARTICLES (Trust) =====
class DotParticle extends Particle {
  display() {
    // Breathing effect - more pronounced
    let breathe = sin(frameCount * 0.08 + this.phase) * 0.4 + 1;
    let currentSize = this.size * breathe;
    
    push();
    colorMode(HSB);
    
    // Outer glow
    fill(this.currentHue, 50, 70, 0.3);
    noStroke();
    ellipse(this.x, this.y, currentSize * 1.8);
    
    // Main dot
    fill(this.currentHue, 70, 90, 0.95);
    ellipse(this.x, this.y, currentSize);
    
    // Inner highlight
    fill(this.currentHue, 30, 100, 0.5);
    ellipse(this.x, this.y, currentSize * 0.4);
    pop();
  }
}

// ===== 3. DITHER PARTICLES (Envy) =====
class DitherParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }
  
  display() {
    // Halftone effect - size varies by noise (more dramatic)
    let density = noise(
      (this.x + this.noiseOffsetX) * 0.015,
      (this.y + this.noiseOffsetY) * 0.015,
      frameCount * 0.002
    );
    let size = map(density, 0, 1, this.size * 0.2, this.size * 2);
    
    push();
    colorMode(HSB);
    
    // Vary opacity based on density
    let alpha = map(density, 0, 1, 0.6, 1.0);
    fill(this.currentHue, 85, 80, alpha);
    noStroke();
    ellipse(this.x, this.y, size);
    
    // Add occasional bright spots
    if (density > 0.7) {
      fill(this.currentHue, 60, 100, 0.4);
      ellipse(this.x, this.y, size * 0.6);
    }
    pop();
  }
}

// ===== 4. REACTION-DIFFUSION PARTICLES (Rage) =====
class ReactionParticle extends Particle {
  display() {
    // Pulsing organic blob effect - more intense
    let pulse = sin(frameCount * 0.15 + this.phase) * 0.5 + 1;
    
    push();
    colorMode(HSB);
    noStroke();
    
    // Draw multiple overlapping circles for organic blob
    let blobCount = 4;
    for (let i = 0; i < blobCount; i++) {
      let angle = (i / blobCount) * TWO_PI + frameCount * 0.02;
      let offset = noise(this.id + i, frameCount * 0.02) * this.size * 0.7;
      let bx = this.x + cos(angle) * offset;
      let by = this.y + sin(angle) * offset;
      
      let blobSize = this.size * pulse * (0.8 + random(0.4));
      let alpha = 0.4 + noise(this.id, i, frameCount * 0.01) * 0.4;
      
      fill(this.currentHue, 100, 90, alpha);
      ellipse(bx, by, blobSize);
    }
    
    // Bright center
    fill(this.currentHue, 80, 100, 0.8);
    ellipse(this.x, this.y, this.size * 0.5 * pulse);
    pop();
  }
}

// ===== 5. STRIP PARTICLES (Anger) =====
class StripParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    this.angle = random(TWO_PI);
    this.length = random(this.size * 2, this.size * 4);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Pulsing length
    let pulse = sin(frameCount * 0.1 + this.phase) * 0.3 + 1;
    let currentLength = this.length * pulse;
    
    colorMode(HSB);
    
    // Draw strip with gradient
    strokeWeight(this.size * 0.8);
    strokeCap(SQUARE);
    
    // Main strip
    stroke(this.currentHue, 90, 85, 0.9);
    line(-currentLength / 2, 0, currentLength / 2, 0);
    
    // Bright core
    strokeWeight(this.size * 0.4);
    stroke(this.currentHue, 70, 100, 0.7);
    line(-currentLength / 2, 0, currentLength / 2, 0);
    
    // Add occasional flare
    if (random() < 0.1) {
      strokeWeight(this.size * 1.2);
      stroke(this.currentHue, 50, 100, 0.4);
      line(-currentLength / 2, 0, currentLength / 2, 0);
    }
    
    pop();
  }
}

// ===== 6. SATELLITE PARTICLES (Bonus) =====
class SatelliteParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    this.orbitRadius = random(10, 30);
    this.orbitSpeed = random(0.02, 0.05);
    this.orbitAngle = random(TWO_PI);
  }
  
  update(params) {
    // Update base parameters
    this.baseHue = params.hue;
    this.size = params.radius;
    this.energy = params.energy;
    this.turbulence = params.turbulence;
    
    // Orbit around target
    let speed = this.orbitSpeed * (this.energy / 50);
    this.orbitAngle += speed;
    
    this.x = this.targetX + cos(this.orbitAngle) * this.orbitRadius;
    this.y = this.targetY + sin(this.orbitAngle) * this.orbitRadius;
    
    // Add turbulence
    let turbulenceForce = map(params.turbulence, 0, 100, 0, 10);
    let nx = noise(this.id * 0.1, frameCount * 0.001);
    let ny = noise(this.id * 0.1 + 100, frameCount * 0.001);
    this.x += (nx - 0.5) * turbulenceForce;
    this.y += (ny - 0.5) * turbulenceForce;
    
    // Update hue with more variation
    let hueShift = sin(frameCount * 0.02 + this.phase) * 10;
    this.currentHue = (this.baseHue + hueShift + 360) % 360;
  }
  
  display() {
    push();
    
    // Draw faint orbit path (pulsing)
    let pathAlpha = sin(frameCount * 0.05 + this.phase) * 0.15 + 0.2;
    colorMode(HSB);
    noFill();
    stroke(this.currentHue, 50, 70, pathAlpha);
    strokeWeight(1);
    ellipse(this.targetX, this.targetY, this.orbitRadius * 2);
    
    // Draw satellite with glow
    let pulse = sin(frameCount * 0.1 + this.phase) * 0.3 + 1;
    let currentSize = this.size * pulse;
    
    // Outer glow
    fill(this.currentHue, 60, 80, 0.3);
    noStroke();
    ellipse(this.x, this.y, currentSize * 2);
    
    // Main satellite
    fill(this.currentHue, 80, 95, 0.95);
    ellipse(this.x, this.y, currentSize);
    
    // Inner core
    fill(this.currentHue, 50, 100, 0.7);
    ellipse(this.x, this.y, currentSize * 0.4);
    
    // Draw trail
    stroke(this.currentHue, 70, 85, 0.5);
    strokeWeight(2);
    let trailAngle = this.orbitAngle - 0.3;
    let trailX = this.targetX + cos(trailAngle) * this.orbitRadius;
    let trailY = this.targetY + sin(trailAngle) * this.orbitRadius;
    line(this.x, this.y, trailX, trailY);
    
    pop();
  }
}

/**
 * Factory function to create appropriate particle type
 */
function createParticle(type, x, y, targetX, targetY, id, params) {
  switch(type) {
    case 'squares':
      return new SquareParticle(x, y, targetX, targetY, id, params);
    case 'dots':
      return new DotParticle(x, y, targetX, targetY, id, params);
    case 'dither':
      return new DitherParticle(x, y, targetX, targetY, id, params);
    case 'reaction':
      return new ReactionParticle(x, y, targetX, targetY, id, params);
    case 'strips':
      return new StripParticle(x, y, targetX, targetY, id, params);
    case 'satellites':
      return new SatelliteParticle(x, y, targetX, targetY, id, params);
    default:
      return new Particle(x, y, targetX, targetY, id, params);
  }
}
