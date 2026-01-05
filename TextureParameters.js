/* ============================================
   TEXTURE PARAMETERS CLASS
   Manages the 5 texture parameters with smooth interpolation
   ============================================ */

class TextureParameters {
  constructor(preset = null) {
    // Default values (neutral)
    this.defaults = {
      density: 50,
      energy: 50,
      amplitude: 50,
      roughness: 50,
      turbulence: 50
    };
    
    // If preset provided, use it as defaults
    if (preset) {
      this.defaults = { ...preset };
    }
    
    // Current values (smoothly interpolated)
    this.current = { ...this.defaults };
    
    // Target values (set by button presses)
    this.target = { ...this.defaults };
    
    // Interpolation speed (0-1, higher = faster)
    this.smoothing = 0.15;
    
    // Track if regeneration is needed
    this.needsRegeneration = false;
  }
  
  // Set target value for a parameter
  setTarget(param, value) {
    if (this.target.hasOwnProperty(param)) {
      let oldValue = this.target[param];
      this.target[param] = constrain(value, 0, 100);
      
      // Mark for regeneration if value changed significantly
      if (abs(oldValue - this.target[param]) > 0.1) {
        this.needsRegeneration = true;
      }
    }
  }
  
  // Increment parameter by amount (with wrapping)
  increment(param, amount = 10) {
    if (this.target.hasOwnProperty(param)) {
      let newValue = this.target[param] + amount;
      
      // Wrap around at 100
      if (newValue > 100) {
        newValue = newValue - 100;
      }
      
      this.setTarget(param, newValue);
    }
  }
  
  // Update current values (call every frame)
  update() {
    let changed = false;
    
    for (let key in this.current) {
      let oldValue = this.current[key];
      this.current[key] = lerp(
        this.current[key],
        this.target[key],
        this.smoothing
      );
      
      // Check if value changed significantly
      if (abs(oldValue - this.current[key]) > 0.1) {
        changed = true;
      }
    }
    
    return changed;
  }
  
  // Get current interpolated values
  getCurrent() {
    return { ...this.current };
  }
  
  // Get target values
  getTarget() {
    return { ...this.target };
  }
  
  // Get a specific current value
  getCurrentValue(param) {
    return this.current[param] || 50;
  }
  
  // Get a specific target value
  getTargetValue(param) {
    return this.target[param] || 50;
  }
  
  // Reset to defaults
  reset() {
    this.target = { ...this.defaults };
    this.needsRegeneration = true;
  }
  
  // Load new preset
  loadPreset(preset) {
    this.defaults = { ...preset };
    this.target = { ...preset };
    this.needsRegeneration = true;
  }
  
  // Check if values have changed significantly (for regeneration trigger)
  hasChanged(threshold = 0.5) {
    for (let key in this.current) {
      if (abs(this.current[key] - this.target[key]) > threshold) {
        return true;
      }
    }
    return false;
  }
  
  // Check and clear regeneration flag
  checkRegeneration() {
    if (this.needsRegeneration) {
      this.needsRegeneration = false;
      return true;
    }
    
    // Also check if values are still changing
    return this.hasChanged(2.0);
  }
  
  // Get all parameter names
  getParameterNames() {
    return Object.keys(this.current);
  }
  
  // Get parameter info for display
  getParameterInfo() {
    return {
      density: {
        name: 'Density',
        key: 'H',
        description: 'How many elements'
      },
      energy: {
        name: 'Energy',
        key: 'E',
        description: 'Animation speed'
      },
      amplitude: {
        name: 'Amplitude',
        key: 'A',
        description: 'Element size'
      },
      roughness: {
        name: 'Roughness',
        key: 'R',
        description: 'Smooth vs jagged'
      },
      turbulence: {
        name: 'Turbulence',
        key: 'T',
        description: 'Order vs chaos'
      }
    };
  }
}
