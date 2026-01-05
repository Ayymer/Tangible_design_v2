/* ============================================
   INPUT MANAGER CLASS
   Handles speech recognition, microphone, and button input
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
  }
  
  // Initialize all input systems
  init() {
    this.initMicrophone();
    this.initSpeechRecognition();
    this.initButton();
  }
  
  // Initialize microphone for volume detection
  initMicrophone() {
    this.mic = new p5.AudioIn();
    this.mic.start();
  }
  
  // Initialize speech recognition
  initSpeechRecognition() {
    this.speechRec = new p5.SpeechRec(
      this.config.speech.language,
      this.handleSpeech.bind(this)
    );
    this.speechRec.continuous = this.config.speech.continuous;
    this.speechRec.interimResults = this.config.speech.interimResults;
  }
  
  // Initialize button UI
  initButton() {
    this.recordButton = createButton(this.config.button.labelNormal);
    this.styleButton();
    
    // Bind event handlers
    this.recordButton.mousePressed(this.startListening.bind(this));
    this.recordButton.mouseReleased(this.stopListening.bind(this));
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
    userStartAudio(); // Required for p5.sound
    this.isListening = true;
    this.speechRec.start();
    this.notifyListeningStateChanged(true);
  }
  
  // Stop listening for speech
  stopListening() {
    this.isListening = false;
    this.notifyListeningStateChanged(false);
  }
  
  // Handle speech recognition result
  handleSpeech() {
    if (this.speechRec.resultValue) {
      let word = this.speechRec.resultString;
      this.notifyEmotionDetected(word);
    }
  }
  
  // Get current microphone level (0-1)
  getMicLevel() {
    if (this.mic) {
      return this.mic.getLevel();
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
  }
  
  // Register callback for listening state changes
  onListeningStateChanged(callback) {
    this.listeners.listeningStateChanged.push(callback);
  }
  
  // Notify all emotion detection listeners
  notifyEmotionDetected(word) {
    this.listeners.emotionDetected.forEach(callback => {
      callback(word);
    });
  }
  
  // Notify all listening state listeners
  notifyListeningStateChanged(isListening) {
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
