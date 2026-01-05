/* ============================================
   PARAMETER CONTROLLER CLASS
   Handles keyboard input for parameter adjustment
   ============================================ */

class ParameterController {
  constructor(textureParams = null) {
    this.params = textureParams;
    this.incrementAmount = 10;
    this.debounceTime = 200; // ms
    this.lastPress = {};
    
    // Map keys to parameters
    this.paramMap = {
      'h': 'density',
      'e': 'energy',
      'a': 'amplitude',
      'r': 'roughness',
      't': 'turbulence'
    };
    
    // Event listeners
    this.listeners = {
      parameterChanged: []
    };
    
    // Initialize keyboard listener
    this.initKeyboard();
  }
  
  // Initialize keyboard event listener
  initKeyboard() {
    document.addEventListener('keydown', (event) => {
      this.handleKeyPress(event.key);
    });
  }
  
  // Handle key press
  handleKeyPress(key) {
    let keyLower = key.toLowerCase();
    
    if (this.paramMap[keyLower]) {
      if (!this.isDebounced(keyLower)) {
        let paramName = this.paramMap[keyLower];
        
        // Increment parameter if we have params object
        if (this.params) {
          this.params.increment(paramName, this.incrementAmount);
          console.log(`📊 Parameter ${paramName} increased by ${this.incrementAmount}`);
          console.log(`   New value: ${this.params.getTargetValue(paramName)}`);
        }
        
        // Set debounce
        this.setDebounce(keyLower);
        
        // Notify listeners
        this.notifyParameterChanged(paramName);
        
        return paramName;
      }
    }
    
    return null;
  }
  
  // Check if key is debounced
  isDebounced(key) {
    if (this.lastPress[key]) {
      let timeSince = millis() - this.lastPress[key];
      return timeSince < this.debounceTime;
    }
    return false;
  }
  
  // Set debounce timestamp
  setDebounce(key) {
    this.lastPress[key] = millis();
  }
  
  // Set the texture parameters object
  setParams(params) {
    this.params = params;
  }
  
  // Get current params
  getParams() {
    return this.params;
  }
  
  // Set increment amount
  setIncrementAmount(amount) {
    this.incrementAmount = amount;
  }
  
  // Get increment amount
  getIncrementAmount() {
    return this.incrementAmount;
  }
  
  // Set debounce time
  setDebounceTime(time) {
    this.debounceTime = time;
  }
  
  // Get parameter name for a key
  getParameterForKey(key) {
    return this.paramMap[key.toLowerCase()];
  }
  
  // Get key for a parameter
  getKeyForParameter(param) {
    for (let key in this.paramMap) {
      if (this.paramMap[key] === param) {
        return key.toUpperCase();
      }
    }
    return null;
  }
  
  // === EVENT LISTENER SYSTEM ===
  
  // Register callback for parameter changes
  onParameterChanged(callback) {
    this.listeners.parameterChanged.push(callback);
  }
  
  // Notify all parameter change listeners
  notifyParameterChanged(paramName) {
    this.listeners.parameterChanged.forEach(callback => {
      callback(paramName);
    });
  }
}
