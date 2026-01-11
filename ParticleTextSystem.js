/* ============================================
   PARTICLE TEXT SYSTEM
   Manages particle-based text rendering
   ============================================ */

class ParticleTextSystem {
  constructor(text, x, y, fontSize, particleType, params) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.particleType = particleType;
    this.params = params;
    
    this.particles = [];
    this.sampler = new TextSampler();
    
    // Generate initial particles
    this.generateParticles();
  }
  
  /**
   * Generate particles from text shape
   */
  generateParticles() {
    // Clear existing particles
    this.particles = [];
    
    // Calculate number of particles based on amount parameter
    let numParticles = floor(map(this.params.amount, 0, 100, 1000, 5000));
    
    // Sample points from text
    let points = this.sampler.sampleText(
      this.text,
      this.x,
      this.y,
      this.fontSize,
      numParticles
    );
    
    // Create particles at sampled points
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      
      // Start particles slightly offset for entrance animation
      let startX = pt.x + random(-20, 20);
      let startY = pt.y + random(-20, 20);
      
      let particle = createParticle(
        this.particleType,
        startX,
        startY,
        pt.x,
        pt.y,
        i,
        this.params
      );
      
      this.particles.push(particle);
    }
    
    console.log(`✨ Generated ${this.particles.length} ${this.particleType} particles for "${this.text}"`);
  }
  
  /**
   * Update all particles
   */
  update() {
    for (let particle of this.particles) {
      if (particle.isOnScreen()) {
        particle.update(this.params);
      }
    }
  }
  
  /**
   * Display all particles
   */
  display() {
    for (let particle of this.particles) {
      if (particle.isOnScreen()) {
        particle.display();
      }
    }
  }
  
  /**
   * Update parameters and regenerate if amount changed significantly
   */
  updateParams(newParams) {
    let oldAmount = this.params.amount;
    this.params = newParams;
    
    // Regenerate if particle count changed significantly
    let amountDiff = abs(newParams.amount - oldAmount);
    if (amountDiff > 20) {
      this.generateParticles();
    }
  }
  
  /**
   * Change text and regenerate
   */
  setText(newText) {
    this.text = newText;
    this.generateParticles();
  }
  
  /**
   * Change particle type and regenerate
   */
  setParticleType(newType) {
    this.particleType = newType;
    this.generateParticles();
  }
  
  /**
   * Get current particle count
   */
  getParticleCount() {
    return this.particles.length;
  }
}
