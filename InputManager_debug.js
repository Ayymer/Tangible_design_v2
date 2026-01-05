/* ============================================
   INPUT MANAGER CLASS - DEBUG VERSION
   Handles speech recognition, microphone, and button input
   WITH EXTENSIVE LOGGING FOR DEBUGGING
   ============================================ */

class InputManager {
  constructor(config) {
    this.config = config;
    this.mic = null;
    this.speechRec = null;
    this.recordButton = null;
    this.isListening = false;
    
    // Event listeners
    this.listeners = {
      emotionDetected: [],
      listeningStateChanged: []
    };
    
    console.log("🔧 InputManager: Constructor called");
  }
  
  // Initialize all input systems
  init() {
    console.log("🔧 InputManager: Initializing...");
    this.initMicrophone();
    this.initSpeechRecognition();
    this.initButton();
    console.log("✅ InputManager: Initialization complete");
  }
  
  // Initialize microphone for volume detection
  initMicrophone() {
    console.log("🎤 InputManager: Initializing microphone...");
    try {
      this.mic = new p5.AudioIn();
      this.mic.start();
      console.log("✅ Microphone initialized successfully");
    } catch (error) {
      console.error("❌ Microphone initialization failed:", error);
    }
  }
  
  // Initialize speech recognition
  initSpeechRecognition() {
    console.log("🗣️ InputManager: Initializing speech recognition...");
    console.log("   Language:", this.config.speech.language);
    console.log("   Continuous:", this.config.speech.continuous);
    console.log("   Interim results:", this.config.speech.interimResults);
    
    try {
      // Check if speech recognition is available
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error("❌ Speech recognition not supported in this browser");
        return;
      }
      
      this.speechRec = new p5.SpeechRec(
        this.config.speech.language,
        this.handleSpeech.bind(this)
      );
      this.speechRec.continuous = this.config.speech.continuous;
      this.speechRec.interimResults = this.config.speech.interimResults;
      
      console.log("✅ Speech recognition initialized successfully");
      console.log("   Speech recognizer object:", this.speechRec);
    } catch (error) {
      console.error("❌ Speech recognition initialization failed:", error);
    }
  }
  
  // Initialize button UI
  initButton() {
    console.log("🔘 InputManager: Initializing button...");
    try {
      this.recordButton = createButton(this.config.button.labelNormal);
      this.styleButton();
      
      // Bind event handlers
      this.recordButton.mousePressed(this.startListening.bind(this));
      this.recordButton.mouseReleased(this.stopListening.bind(this));
      
      console.log("✅ Button initialized successfully");
    } catch (error) {
      console.error("❌ Button initialization failed:", error);
    }
  }
  
  // Style the button according to config
  styleButton() {
    this.recordButton.position(
      width/2 - this.config.button.width/2,
      height - this.config.button.offsetY
    );
    this.recordButton.size(
      this.config.button.width,
      this.config.button.height
    );
    this.recordButton.style('color', this.config.button.textColor);
    this.recordButton.style('background', this.config.button.backgroundNormal);
    this.recordButton.style('border', this.config.button.borderNormal);
    this.recordButton.style('border-radius', this.config.button.borderRadius);
    this.recordButton.style('font-size', this.config.button.fontSize);
    this.recordButton.style('cursor', 'pointer');
  }
  
  // Start listening for speech
  startListening() {
    console.log("🎙️ START LISTENING PRESSED");
    
    try {
      userStartAudio(); // Required for p5.sound
      console.log("   ✅ userStartAudio() called");
    } catch (error) {
      console.error("   ❌ userStartAudio() failed:", error);
    }
    
    this.isListening = true;
    console.log("   Listening state set to TRUE");
    
    try {
      if (this.speechRec) {
        this.speechRec.start();
        console.log("   ✅ Speech recognition started");
        console.log("   Speech recognizer active:", this.speechRec);
      } else {
        console.error("   ❌ Speech recognizer not initialized!");
      }
    } catch (error) {
      console.error("   ❌ Failed to start speech recognition:", error);
    }
    
    this.notifyListeningStateChanged(true);
  }
  
  // Stop listening for speech
  stopListening() {
    console.log("🛑 STOP LISTENING RELEASED");
    this.isListening = false;
    console.log("   Listening state set to FALSE");
    this.notifyListeningStateChanged(false);
  }
  
  // Handle speech recognition result
  handleSpeech() {
    console.log("🗣️ SPEECH CALLBACK TRIGGERED");
    console.log("   Speech recognizer:", this.speechRec);
    console.log("   resultValue:", this.speechRec.resultValue);
    console.log("   resultString:", this.speechRec.resultString);
    console.log("   resultJSON:", this.speechRec.resultJSON);
    
    if (this.speechRec.resultValue) {
      let word = this.speechRec.resultString;
      console.log("   ✅ Word detected:", word);
      this.notifyEmotionDetected(word);
    } else {
      console.log("   ⚠️ No result value");
    }
  }
  
  // Get current microphone level (0-1)
  getMicLevel() {
    if (this.mic) {
      let level = this.mic.getLevel();
      // Uncomment for continuous volume monitoring (very verbose!)
      // if (level > 0.01) {
      //   console.log("🎤 Mic level:", level.toFixed(4));
      // }
      return level;
    }
    return 0;
  }
  
  // Get listening state
  getIsListening() {
    return this.isListening;
  }
  
  // Update button appearance based on state
  updateButton() {
    if (!this.recordButton) return;
    
    if (this.isListening) {
      this.recordButton.html(this.config.button.labelListening);
      this.recordButton.style('background', this.config.button.backgroundListening);
      this.recordButton.style('border', this.config.button.borderListening);
    } else {
      this.recordButton.html(this.config.button.labelNormal);
      this.recordButton.style('background', this.config.button.backgroundNormal);
      this.recordButton.style('border', this.config.button.borderNormal);
    }
  }
  
  // Reposition button on window resize
  repositionButton() {
    if (this.recordButton) {
      this.recordButton.position(
        width/2 - this.config.button.width/2,
        height - this.config.button.offsetY
      );
    }
  }
  
  // === EVENT LISTENER SYSTEM ===
  
  // Register callback for emotion detection
  onEmotionDetected(callback) {
    this.listeners.emotionDetected.push(callback);
    console.log("📝 Emotion detection listener registered. Total:", this.listeners.emotionDetected.length);
  }
  
  // Register callback for listening state changes
  onListeningStateChanged(callback) {
    this.listeners.listeningStateChanged.push(callback);
  }
  
  // Notify all emotion detection listeners
  notifyEmotionDetected(word) {
    console.log("📢 Notifying emotion detected:", word);
    console.log("   Number of listeners:", this.listeners.emotionDetected.length);
    this.listeners.emotionDetected.forEach((callback, index) => {
      console.log("   Calling listener", index);
      callback(word);
    });
  }
  
  // Notify all listening state listeners
  notifyListeningStateChanged(isListening) {
    console.log("📢 Notifying listening state changed:", isListening);
    this.listeners.listeningStateChanged.forEach(callback => {
      callback(isListening);
    });
  }
  
  // Clean up resources
  destroy() {
    if (this.mic) {
      this.mic.stop();
    }
    if (this.recordButton) {
      this.recordButton.remove();
    }
  }
}
