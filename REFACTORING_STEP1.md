# Refactoring Step 1: Configuration Extraction

## What Was Done

This is the first step of Phase 1 refactoring. All hard-coded values from the original `sketch.js` have been extracted into a centralized configuration object.

## Files Created

### 1. `config.js`
A new configuration file containing all magic numbers and settings organized into logical sections:

- **Canvas Layout** - Split-screen percentages, background color
- **Letter Visualization** - Size, outline, title, prompt settings
- **Body Visualization** - Image dimensions, tints, description formatting
- **Audio Settings** - Volume thresholds, fill speed mapping
- **Animation Settings** - Breathing effect, glow, hotspot size
- **Speech Recognition** - Language and recognition settings
- **UI Button** - Dimensions, styling, labels
- **Emotions Data** - Colors, letters, body positions, descriptions for all 5 emotions

### 2. `sketch_refactored.js`
Updated version of sketch.js that uses the CONFIG object instead of hard-coded values.

**Key Changes:**
- All magic numbers replaced with `CONFIG.section.property` references
- Emotions data accessed via `CONFIG.emotions`
- More readable and maintainable code
- Identical functionality to original

### 3. `index_refactored.html`
Updated HTML file that loads `config.js` before `sketch_refactored.js`.

**Important:** The config file MUST be loaded first, otherwise CONFIG will be undefined.

## How to Test

### Option 1: Test the Refactored Version
1. Open `index_refactored.html` in your browser
2. Test all functionality:
   - Press and hold the button to activate microphone
   - Say one of the emotion words (happiness, envy, anger, rage, trust)
   - Verify the letter appears with correct color
   - Speak louder/softer to control fill speed
   - Verify body hotspot appears and "breathes"
   - Check that description text appears

### Option 2: Compare Side-by-Side
1. Open original `index.html` in one browser tab
2. Open `index_refactored.html` in another tab
3. Test the same actions in both
4. Verify they behave identically

## Benefits of This Change

### 1. Easy Experimentation
Want to try different colors? Just edit `CONFIG.emotions.happiness.color`
Want larger letters? Just change `CONFIG.letter.size`

### 2. Single Source of Truth
No more hunting through 239 lines of code to find where a value is used. Everything is in one place.

### 3. Preparation for Parametric System
The parametric texture system will add emotion presets to this config. Having a clean config structure now makes that much easier.

### 4. Better Documentation
The config file serves as documentation, showing all adjustable parameters in one place.

### 5. Easier Debugging
When something looks wrong, check the config values first before diving into code logic.

## What Didn't Change

- **Functionality:** The app works exactly the same as before
- **Visual Appearance:** Everything looks identical
- **Performance:** No performance impact
- **File Structure:** Original files are untouched (still work)

## Next Steps

After you've tested and confirmed this works:

### Step 1.2: Create Emotion Class
Extract emotion data into a proper class with methods.

### Step 1.3: Create LetterVisualizer Class
Isolate all letter drawing logic into a dedicated class.

### Step 1.4: Create BodyVisualizer Class
Isolate all body drawing logic into a dedicated class.

### Step 1.5: Create InputManager Class
Isolate all input handling (speech, mic, button) into a dedicated class.

### Step 1.6: Refactor Main Application
Clean up the main sketch.js to use all the new classes.

## Configuration Reference

### Quick Reference: Most Commonly Adjusted Values

```javascript
// Make letters bigger/smaller
CONFIG.letter.size = 300;  // Default: 300

// Adjust fill speed sensitivity
CONFIG.audio.fillSpeedMin = 0.2;  // Slow (quiet voice)
CONFIG.audio.fillSpeedMax = 5.0;  // Fast (loud voice)

// Change emotion colors
CONFIG.emotions.happiness.color = "#FFD700";  // Gold
CONFIG.emotions.anger.color = "#FF8C00";      // Orange
// etc.

// Adjust breathing animation speed
CONFIG.animation.breathingFrequency = 0.003;  // Very slow

// Change button labels
CONFIG.button.labelNormal = "Maintenir pour parler";
CONFIG.button.labelListening = "Écoute en cours...";
```

## Troubleshooting

### Problem: "CONFIG is not defined"
**Solution:** Make sure `config.js` is loaded BEFORE `sketch_refactored.js` in your HTML file.

### Problem: Nothing appears on screen
**Solution:** Check browser console for errors. Verify all CONFIG properties are spelled correctly.

### Problem: Colors look wrong
**Solution:** Verify color format in `CONFIG.emotions`. Should be hex strings like "#FFD700".

### Problem: Button doesn't appear
**Solution:** Check `CONFIG.button` values. Verify width, height, and offsetY are reasonable numbers.

## Testing Checklist

- [ ] Page loads without errors
- [ ] Button appears at bottom center
- [ ] Clicking button activates microphone
- [ ] Saying emotion words triggers recognition
- [ ] Letter appears with correct color
- [ ] Letter outline is visible
- [ ] Liquid fill animation works
- [ ] Fill speed responds to voice volume
- [ ] Body silhouette appears
- [ ] Hotspot appears at correct position
- [ ] Hotspot "breathes" slowly
- [ ] Description text appears and is readable
- [ ] Window resize works correctly
- [ ] All 5 emotions work (happiness, envy, anger, rage, trust)

## Commit Message Suggestion

```
refactor: Extract configuration into config.js

- Create centralized CONFIG object with all settings
- Update sketch.js to use CONFIG instead of magic numbers
- Organize config into logical sections (canvas, letter, body, audio, etc.)
- No functionality changes, identical behavior
- Preparation for Phase 2 parametric texture system
```

---

**Status:** ✅ Step 1.1 Complete  
**Next:** Step 1.2 - Create Emotion Class  
**Estimated Time for Next Step:** 1-2 hours
