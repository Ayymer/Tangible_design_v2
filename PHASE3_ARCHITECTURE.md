# Phase 3: Particle System Architecture

## Overview

Create emotion words using **diverse particle types** with subtle animation, color variation, and 5 adjustable parameters. Each emotion uses a unique particle renderer.

## Particle Types (6+)

### 1. SQUARES (Happiness)
- **Description:** Colorful square particles (like Particle Type B)
- **Behavior:** Gentle floating, slight rotation
- **Color:** Yellow/gold base with subtle hue variation
- **Best for:** Joyful, structured, playful emotion

### 2. DOTS/CIRCLES (Trust)
- **Description:** Smooth circular particles
- **Behavior:** Slow breathing motion (expand/contract)
- **Color:** Turquoise base with gentle color shifts
- **Best for:** Calm, organic, flowing emotion

### 3. DITHER PATTERN (Envy)
- **Description:** Halftone/dither effect (like old newspaper print)
- **Behavior:** Particles vary in size creating texture
- **Color:** Red-orange with density variation
- **Best for:** Complex, textured, uncomfortable emotion

### 4. REACTION-DIFFUSION (Rage)
- **Description:** Organic blob-like patterns (Turing patterns)
- **Behavior:** Pulsing, growing, chaotic movement
- **Color:** Pure red with intense variation
- **Best for:** Intense, explosive, uncontrolled emotion

### 5. STRIPS/LINES (Anger)
- **Description:** Short line segments/strokes
- **Behavior:** Aggressive directional movement
- **Color:** Orange with sharp transitions
- **Best for:** Sharp, directional, aggressive emotion

### 6. SATELLITES (Bonus - any emotion)
- **Description:** Particles with trailing orbits
- **Behavior:** Circular motion around anchor points
- **Color:** Varies by emotion
- **Best for:** Dynamic, cosmic, interconnected feeling

## Emotion → Particle Mapping

```javascript
const EMOTION_PARTICLES = {
  happiness: 'squares',      // Playful, structured
  trust: 'dots',            // Calm, organic
  envy: 'dither',           // Complex, textured
  rage: 'reaction',         // Chaotic, explosive
  anger: 'strips'           // Sharp, aggressive
};
```

## Parameter System (H/E/A/R/T)

### H = HUE (0-360)
**What it controls:**
- Base color hue on HSB color wheel
- Each emotion starts with signature hue
- Pressing H cycles through spectrum

**Implementation:**
```javascript
hue: {
  min: 0,
  max: 360,
  step: 36,  // 10 steps around color wheel
  default: {
    happiness: 60,  // Yellow
    trust: 180,     // Cyan
    envy: 15,       // Red-orange
    rage: 0,        // Pure red
    anger: 30       // Orange
  }
}
```

### E = ENERGY (0-100)
**What it controls:**
- Animation speed
- Particle velocity
- Movement chaos

**Effects by particle type:**
- **Squares:** Rotation speed, float speed
- **Dots:** Breathing frequency
- **Dither:** Size oscillation speed
- **Reaction:** Growth/pulse rate
- **Strips:** Movement speed
- **Satellites:** Orbit speed

### A = AMOUNT (0-100)
**What it controls:**
- Number of particles
- Density of sampling

**Implementation:**
```javascript
// Map amount to particle count
let numParticles = map(amount, 0, 100, 50, 500);
```

**Effects:**
- Low: Sparse, abstract, minimal
- High: Dense, solid, detailed

### R = RADIUS (0-100)
**What it controls:**
- Size of individual particles
- Scale of pattern elements

**Effects by particle type:**
- **Squares:** Side length (2-20px)
- **Dots:** Circle diameter (2-15px)
- **Dither:** Dot size range (1-10px)
- **Reaction:** Blob size (5-30px)
- **Strips:** Line length (5-25px)
- **Satellites:** Orbit radius (10-50px)

### T = TURBULENCE (0-100)
**What it controls:**
- Randomness/chaos in behavior
- Deviation from target position
- Noise influence

**Implementation:**
```javascript
// Apply turbulence to particle position
let noiseVal = noise(p.x * 0.01, p.y * 0.01, frameCount * 0.01);
let offset = map(turbulence, 0, 100, 0, 50);
p.x += (noiseVal - 0.5) * offset;
```

## Animation System

### Subtle Animation Requirements:
1. **Continuous but gentle** - Not distracting
2. **Organic movement** - Use Perlin noise
3. **Color variation** - Slight hue/brightness shifts
4. **Breathing effect** - Slow expand/contract

### Animation Loop:
```javascript
draw() {
  // Update particles
  for (let p of particles) {
    // Subtle position drift (Perlin noise)
    let nx = noise(p.id * 0.1, frameCount * 0.001);
    let ny = noise(p.id * 0.1 + 100, frameCount * 0.001);
    p.x += (nx - 0.5) * energy * 0.1;
    p.y += (ny - 0.5) * energy * 0.1;
    
    // Pull back toward target (spring force)
    let dx = p.targetX - p.x;
    let dy = p.targetY - p.y;
    p.x += dx * 0.05;
    p.y += dy * 0.05;
    
    // Subtle color variation
    let hueShift = sin(frameCount * 0.01 + p.id) * 5;
    p.currentHue = p.baseHue + hueShift;
  }
}
```

### Color Variation:
- **Base hue:** Set by H parameter
- **Variation range:** ±5-10 degrees
- **Animation:** Sine wave over time
- **Per-particle:** Each particle has slight offset

## UI Layout

```
┌──────────────────────────────────────────────────┐
│ Instructions                    [Parameters]     │  ← Top bar
│ 1. Hold to speak               H: 60  E: 70      │
│ 2. Say emotion                 A: 80  R: 6       │
│ 3. Press H/E/A/R/T             T: 40             │
│                                                   │
│                                                   │
│              [Body Silhouette]                    │  ← Small, top center
│                (particle effect)                  │     150-200px height
│                                                   │
│                                                   │
│                                                   │
│          H A P P I N E S S                       │  ← LARGE, centered
│       (diverse particle effect)                   │     250-350px size
│                                                   │
│                                                   │
│                                                   │
│                                                   │
│                                                   │
│           [Hold to speak]                         │  ← Bottom center
└──────────────────────────────────────────────────┘
```

### Layout Specifications:
- **Background:** #808080 (gray, like mockup)
- **Instructions:** Top-left, white text, 14px
- **Parameters:** Top-right, white text, 12px, compact
- **Body:** Top center, 150-200px height
- **Word:** Center, 250-350px font size
- **Button:** Bottom center, 150x40px, rounded

### Parameter Display:
```
┌─────────────┐
│ H: 60  ●    │  ← Hue (color dot)
│ E: 70  ▸    │  ← Energy (arrow)
│ A: 80  ▪▪▪  │  ← Amount (density)
│ R: 6   ●    │  ← Radius (size dot)
│ T: 40  ~    │  ← Turbulence (wave)
└─────────────┘
```

## Technical Implementation

### Class Structure:

```javascript
// Base particle class
class Particle {
  constructor(x, y, targetX, targetY, id) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.id = id;
    this.baseHue = 0;
    this.currentHue = 0;
  }
  
  update(params) {
    // Implemented by subclasses
  }
  
  display() {
    // Implemented by subclasses
  }
}

// Specific particle types
class SquareParticle extends Particle { ... }
class DotParticle extends Particle { ... }
class DitherParticle extends Particle { ... }
class ReactionParticle extends Particle { ... }
class StripParticle extends Particle { ... }
class SatelliteParticle extends Particle { ... }

// Particle system manager
class ParticleTextSystem {
  constructor(text, particleType, params) {
    this.text = text;
    this.particleType = particleType;
    this.params = params;
    this.particles = [];
    this.generateParticles();
  }
  
  generateParticles() {
    // Sample text shape
    let points = this.sampleText(this.text, this.params.amount);
    
    // Create particles based on type
    for (let pt of points) {
      let p = this.createParticle(pt.x, pt.y);
      this.particles.push(p);
    }
  }
  
  createParticle(x, y) {
    switch(this.particleType) {
      case 'squares': return new SquareParticle(x, y, ...);
      case 'dots': return new DotParticle(x, y, ...);
      case 'dither': return new DitherParticle(x, y, ...);
      case 'reaction': return new ReactionParticle(x, y, ...);
      case 'strips': return new StripParticle(x, y, ...);
      case 'satellites': return new SatelliteParticle(x, y, ...);
    }
  }
  
  update() {
    for (let p of this.particles) {
      p.update(this.params);
    }
  }
  
  display() {
    for (let p of this.particles) {
      p.display();
    }
  }
  
  sampleText(text, numPoints) {
    // Use p5.js font.textToPoints() or manual sampling
    // Return array of {x, y} positions
  }
}

// Body silhouette system (same particles)
class ParticleBodySystem {
  constructor(silhouetteImg, particleType, params) {
    // Same as ParticleTextSystem but samples from image
  }
}

// Main application
class Phase3App {
  constructor() {
    this.currentEmotion = null;
    this.textSystem = null;
    this.bodySystem = null;
    this.params = {
      hue: 60,
      energy: 50,
      amount: 70,
      radius: 6,
      turbulence: 40
    };
  }
  
  handleEmotionDetected(emotion) {
    // Load emotion preset
    this.params = this.getEmotionPreset(emotion);
    
    // Create particle systems
    let particleType = EMOTION_PARTICLES[emotion];
    this.textSystem = new ParticleTextSystem(
      emotion.toUpperCase(),
      particleType,
      this.params
    );
    this.bodySystem = new ParticleBodySystem(
      bodyImg,
      particleType,
      this.params
    );
  }
  
  handleKeyPress(key) {
    // H, E, A, R, T pressed
    switch(key) {
      case 'h': this.params.hue = (this.params.hue + 36) % 360; break;
      case 'e': this.params.energy = (this.params.energy + 10) % 110; break;
      case 'a': this.params.amount = (this.params.amount + 10) % 110; break;
      case 'r': this.params.radius = (this.params.radius + 10) % 110; break;
      case 't': this.params.turbulence = (this.params.turbulence + 10) % 110; break;
    }
    
    // Regenerate particles with new params
    this.regenerateParticles();
  }
}
```

## Text Sampling Strategy

### Option 1: p5.js textToPoints()
```javascript
let font = loadFont('font.ttf');
let points = font.textToPoints(text, x, y, fontSize, {
  sampleFactor: 0.1,  // Density of sampling
  simplifyThreshold: 0
});
```

### Option 2: Manual Pixel Sampling
```javascript
function sampleText(text, numPoints) {
  // Draw text to off-screen graphics
  let pg = createGraphics(width, height);
  pg.textSize(fontSize);
  pg.text(text, x, y);
  
  // Sample pixels
  pg.loadPixels();
  let points = [];
  for (let i = 0; i < numPoints; i++) {
    // Random sampling with rejection
    let px, py;
    do {
      px = random(width);
      py = random(height);
    } while (pg.get(px, py)[3] < 128); // Check alpha
    points.push({x: px, y: py});
  }
  
  return points;
}
```

## Particle Type Details

### 1. Squares (Happiness)
```javascript
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
```

### 2. Dots (Trust)
```javascript
class DotParticle extends Particle {
  display() {
    let breathe = sin(frameCount * 0.05 + this.id) * 0.2 + 1;
    colorMode(HSB);
    fill(this.currentHue, 70, 85, 0.7);
    noStroke();
    ellipse(this.x, this.y, this.size * breathe);
  }
}
```

### 3. Dither (Envy)
```javascript
class DitherParticle extends Particle {
  display() {
    // Vary size based on position (halftone effect)
    let density = noise(this.x * 0.01, this.y * 0.01);
    let size = map(density, 0, 1, 1, this.maxSize);
    colorMode(HSB);
    fill(this.currentHue, 85, 80);
    noStroke();
    ellipse(this.x, this.y, size);
  }
}
```

### 4. Reaction-Diffusion (Rage)
```javascript
class ReactionParticle extends Particle {
  display() {
    // Organic blob with metaball effect
    let pulse = sin(frameCount * 0.1 + this.id) * 0.3 + 1;
    colorMode(HSB);
    fill(this.currentHue, 100, 90, 0.6);
    noStroke();
    
    // Draw multiple overlapping circles for blob effect
    for (let i = 0; i < 3; i++) {
      let offset = noise(this.id + i, frameCount * 0.01) * 10;
      ellipse(
        this.x + cos(i * TWO_PI / 3) * offset,
        this.y + sin(i * TWO_PI / 3) * offset,
        this.size * pulse
      );
    }
  }
}
```

### 5. Strips (Anger)
```javascript
class StripParticle extends Particle {
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    colorMode(HSB);
    stroke(this.currentHue, 90, 85);
    strokeWeight(2);
    line(0, 0, this.length, 0);
    pop();
  }
}
```

### 6. Satellites (Bonus)
```javascript
class SatelliteParticle extends Particle {
  display() {
    // Draw orbit path
    noFill();
    colorMode(HSB);
    stroke(this.currentHue, 50, 70, 0.3);
    strokeWeight(1);
    ellipse(this.targetX, this.targetY, this.orbitRadius * 2);
    
    // Draw satellite
    fill(this.currentHue, 80, 90);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}
```

## Performance Optimization

### Strategies:
1. **Limit particle count** - Max 500 particles per system
2. **Use object pooling** - Reuse particle objects
3. **Spatial partitioning** - Only update visible particles
4. **Reduce draw calls** - Batch similar particles
5. **Throttle regeneration** - Debounce parameter changes

### Target Performance:
- **Frame rate:** 60fps maintained
- **Particle count:** 200-500 per system (text + body)
- **Memory:** < 100MB
- **Regeneration time:** < 100ms

## Next Steps

1. Implement base Particle class
2. Implement 6 particle type subclasses
3. Create ParticleTextSystem
4. Create ParticleBodySystem
5. Implement parameter control
6. Design new UI layout
7. Add emotion presets
8. Test and optimize

Ready to start coding!
