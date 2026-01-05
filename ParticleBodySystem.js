/* ============================================
   PARTICLE BODY SYSTEM
   Manages particle-based body silhouette rendering
   ============================================ */

class ParticleBodySystem {
  constructor(img, particleType, params, x, y, w, h) {
    this.img = img;
    this.particleType = particleType;
    this.params = params;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.particles = [];
    this.sampler = new TextSampler();
    
    // Generate initial particles
    if (this.img) {
      this.generateParticles();
    }
  }
  
  /**
   * Generate particles from body silhouette
   */
  generateParticles() {
    if (!this.img) {
      console.warn("⚠️ No image loaded for body system");
      return;
    }
    
    // Clear existing particles
    this.particles = [];
    
    // Calculate number of particles (fewer than text for performance)
    let numParticles = floor(map(this.params.amount, 0, 100, 30, 200));
    
    // Sample points from image outline
    let points = this.sampler.sampleImage(
      this.img,
      this.x,
      this.y,
      this.w,
      this.h,
      numParticles,
      true  // outline only
    );
    
    // Create particles at sampled points
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      
      // Start particles slightly offset
      let startX = pt.x + random(-15, 15);
      let startY = pt.y + random(-15, 15);
      
      let particle = createParticle(
        this.particleType,
        startX,
        startY,
        pt.x,
        pt.y,
        i + 1000,  // Offset ID to avoid conflicts with text particles
        this.params
      );
      
      this.particles.push(particle);
    }
    
    console.log(`✨ Generated ${this.particles.length} ${this.particleType} particles for body`);
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
   * Change particle type and regenerate
   */
  setParticleType(newType) {
    this.particleType = newType;
    this.generateParticles();
  }
  
  /**
   * Set new image and regenerate
   */
  setImage(newImg) {
    this.img = newImg;
    if (this.img) {
      this.generateParticles();
    }
  }
  
  /**
   * Get current particle count
   */
  getParticleCount() {
    return this.particles.length;
  }
}
