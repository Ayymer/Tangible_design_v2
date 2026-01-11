/* ============================================
   BASE PARTICLE CLASS
   Foundation for all particle types
   ============================================ */

class Particle {
  constructor(x, y, targetX, targetY, id, params) {
    // Current position
    this.x = x;
    this.y = y;
    
    // Target position (where particle should be)
    this.targetX = targetX;
    this.targetY = targetY;
    
    // Unique identifier
    this.id = id;
    
    // Velocity and acceleration
    this.vx = 0;
    this.vy = 0;
    
    // Parameters
    this.baseHue = params.hue || 0;
    this.currentHue = this.baseHue;
    this.size = params.radius || 5;
    this.energy = params.energy || 50;
    this.turbulence = params.turbulence || 30;
    
    // Animation state
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.phase = random(TWO_PI); // For sine wave animations
  }
  
  /**
   * Update particle position and state
   * Uses Perlin noise for organic movement
   * Spring force pulls particle back to target
   */
  update(params) {
    // Update parameters
    this.baseHue = params.hue;
    this.size = params.radius;
    this.energy = params.energy;
    this.turbulence = params.turbulence;
    
    // Subtle color variation over time
    let hueShift = sin(frameCount * 0.01 + this.phase) * 5;
    this.currentHue = (this.baseHue + hueShift + 360) % 360;
    
    // Perlin noise for organic drift
    let noiseScale = 0.01;
    let timeScale = 0.001 * (this.energy / 50);
    let nx = noise(this.id * 0.1, frameCount * timeScale);
    let ny = noise(this.id * 0.1 + 100, frameCount * timeScale);
    
    // Apply turbulence
    let turbulenceForce = map(this.turbulence, 0, 100, 0, 2);
    this.vx += (nx - 0.5) * turbulenceForce;
    this.vy += (ny - 0.5) * turbulenceForce;
    
    // Spring force toward target (keeps particles near text shape)
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let springStrength = 0.15; // Increased from 0.05 for tighter letter shapes
    this.vx += dx * springStrength;
    this.vy += dy * springStrength;
    
    // Damping (friction)
    this.vx *= 0.9;
    this.vy *= 0.9;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Update rotation
    this.rotation += this.rotationSpeed * (this.energy / 50);
  }
  
  /**
   * Display particle (to be overridden by subclasses)
   */
  display() {
    // Base implementation - simple circle
    push();
    colorMode(HSB);
    fill(this.currentHue, 80, 90, 0.8);
    noStroke();
    ellipse(this.x, this.y, this.size);
    pop();
  }
  
  /**
   * Check if particle is on screen (for optimization)
   */
  isOnScreen() {
    return this.x > -50 && this.x < width + 50 &&
           this.y > -50 && this.y < height + 50;
  }
}
