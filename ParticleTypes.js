/* ============================================
   PARTICLE TYPE SUBCLASSES
   6 different particle renderers for emotions
   ============================================ */

// ===== 1. SQUARE PARTICLES (Happiness) =====
class SquareParticle extends Particle {
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    colorMode(HSB);
    fill(this.currentHue, 80, 90, 0.8);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }
}

// ===== 2. DOT PARTICLES (Trust) =====
class DotParticle extends Particle {
  display() {
    // Breathing effect
    let breathe = sin(frameCount * 0.05 + this.phase) * 0.2 + 1;
    let currentSize = this.size * breathe;
    
    push();
    colorMode(HSB);
    fill(this.currentHue, 70, 85, 0.7);
    noStroke();
    ellipse(this.x, this.y, currentSize);
    pop();
  }
}

// ===== 3. DITHER PARTICLES (Envy) =====
class DitherParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    // Store noise offset for consistent halftone pattern
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }
  
  display() {
    // Halftone effect - size varies by noise
    let density = noise(
      (this.x + this.noiseOffsetX) * 0.01,
      (this.y + this.noiseOffsetY) * 0.01,
      frameCount * 0.001
    );
    let size = map(density, 0, 1, this.size * 0.3, this.size * 1.5);
    
    push();
    colorMode(HSB);
    fill(this.currentHue, 85, 80, 0.9);
    noStroke();
    ellipse(this.x, this.y, size);
    pop();
  }
}

// ===== 4. REACTION-DIFFUSION PARTICLES (Rage) =====
class ReactionParticle extends Particle {
  display() {
    // Pulsing organic blob effect
    let pulse = sin(frameCount * 0.1 + this.phase) * 0.3 + 1;
    
    push();
    colorMode(HSB);
    fill(this.currentHue, 100, 90, 0.6);
    noStroke();
    
    // Draw multiple overlapping circles for organic blob
    let blobCount = 3;
    for (let i = 0; i < blobCount; i++) {
      let angle = (i / blobCount) * TWO_PI;
      let offset = noise(this.id + i, frameCount * 0.01) * this.size * 0.5;
      let bx = this.x + cos(angle) * offset;
      let by = this.y + sin(angle) * offset;
      ellipse(bx, by, this.size * pulse);
    }
    pop();
  }
}

// ===== 5. STRIP PARTICLES (Anger) =====
class StripParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    // Random angle for line direction
    this.angle = random(TWO_PI);
    this.length = this.size * 2;
  }
  
  update(params) {
    super.update(params);
    // Update length based on radius parameter
    this.length = params.radius * 2;
    
    // Slowly rotate angle based on energy
    this.angle += (noise(this.id, frameCount * 0.001) - 0.5) * 0.1 * (this.energy / 50);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    colorMode(HSB);
    stroke(this.currentHue, 90, 85, 0.8);
    strokeWeight(2);
    line(-this.length / 2, 0, this.length / 2, 0);
    pop();
  }
}

// ===== 6. SATELLITE PARTICLES (Bonus) =====
class SatelliteParticle extends Particle {
  constructor(x, y, targetX, targetY, id, params) {
    super(x, y, targetX, targetY, id, params);
    // Orbit parameters
    this.orbitRadius = this.size * 3;
    this.orbitAngle = random(TWO_PI);
    this.orbitSpeed = random(0.01, 0.03);
  }
  
  update(params) {
    // Update orbit radius based on radius parameter
    this.orbitRadius = params.radius * 3;
    
    // Update orbit speed based on energy
    let speedMultiplier = map(params.energy, 0, 100, 0.5, 2);
    this.orbitAngle += this.orbitSpeed * speedMultiplier;
    
    // Calculate position on orbit around target
    this.x = this.targetX + cos(this.orbitAngle) * this.orbitRadius;
    this.y = this.targetY + sin(this.orbitAngle) * this.orbitRadius;
    
    // Add turbulence
    let turbulenceForce = map(params.turbulence, 0, 100, 0, 10);
    let nx = noise(this.id * 0.1, frameCount * 0.001);
    let ny = noise(this.id * 0.1 + 100, frameCount * 0.001);
    this.x += (nx - 0.5) * turbulenceForce;
    this.y += (ny - 0.5) * turbulenceForce;
    
    // Update hue
    this.baseHue = params.hue;
    let hueShift = sin(frameCount * 0.01 + this.phase) * 5;
    this.currentHue = (this.baseHue + hueShift + 360) % 360;
  }
  
  display() {
    push();
    
    // Draw faint orbit path
    colorMode(HSB);
    noFill();
    stroke(this.currentHue, 50, 70, 0.2);
    strokeWeight(1);
    ellipse(this.targetX, this.targetY, this.orbitRadius * 2);
    
    // Draw satellite
    fill(this.currentHue, 80, 90, 0.9);
    noStroke();
    ellipse(this.x, this.y, this.size);
    
    // Draw small trail
    stroke(this.currentHue, 60, 80, 0.4);
    strokeWeight(1);
    let trailAngle = this.orbitAngle - 0.5;
    let trailX = this.targetX + cos(trailAngle) * this.orbitRadius;
    let trailY = this.targetY + sin(trailAngle) * this.orbitRadius;
    line(this.x, this.y, trailX, trailY);
    
    pop();
  }
}

// ===== PARTICLE FACTORY =====
/**
 * Create appropriate particle type based on emotion
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
