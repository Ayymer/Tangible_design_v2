# Troubleshooting Guide: Speech Recognition Not Displaying Letter

## Issue
When you say an emotion word (happiness, anger, envy, rage, trust), nothing appears on the screen.

## Possible Causes & Solutions

### 1. Speech Recognition Not Detecting Words

**Check Console Logs:**
Open browser console (F12) and look for these messages when you press the button and speak:

```
✅ Good signs:
- "🎙️ START LISTENING PRESSED"
- "✅ Speech recognition started"
- "🗣️ SPEECH CALLBACK TRIGGERED"
- "🎭 Emotion detected: happiness"

❌ Bad signs:
- "❌ Speech recognition not supported"
- "❌ Failed to start speech recognition"
- No callback messages when speaking
```

**Solution A: Browser Compatibility**
- Speech recognition requires Chrome, Edge, or Arc (Chromium-based)
- Safari and Firefox have limited support
- Try in Chrome if using another browser

**Solution B: Microphone Permissions**
1. Check browser address bar for microphone icon
2. Click it and ensure microphone is allowed
3. Reload the page after granting permission
4. On macOS: System Preferences → Security & Privacy → Microphone → Allow browser

**Solution C: Language Settings**
The app is configured for French (`fr-FR`). Try saying:
- "Happiness" (English pronunciation)
- "Bonheur" (French for happiness)
- Or change language in `config.js`:
  ```javascript
  speech: {
    language: "en-US",  // Change from "fr-FR" to "en-US"
    ...
  }
  ```

### 2. Words Not Matching Emotions

**The Problem:**
Speech recognition might be detecting the word, but it doesn't match any emotion keywords.

**Check in Console:**
Look for: `"⚠️ No matching emotion found for: [word]"`

**Solution: Word Matching**
The app looks for these keywords in your speech:
- "happiness" or "bonheur"
- "anger" or "colère"
- "envy" or "envie"
- "rage"
- "trust" or "confiance"

The word just needs to **contain** the keyword, so "I feel happiness" would work.

**Test Manually:**
Open console and type:
```javascript
// Simulate detecting "happiness"
handleEmotionDetected("happiness");
```

If the letter appears, speech recognition is the issue. If not, continue below.

### 3. Letter Rendering Issue (Fixed)

**The Fix I Just Applied:**
I fixed a bug in `LetterVisualizer_v2.js` where the text clipping wasn't working properly. The new version:
- Creates a proper clipping rectangle for the liquid fill effect
- Draws the filled text within the clipping region
- Should now display the letter correctly

**To Get the Fix:**
```bash
git pull origin phase1-refactoring
# Refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
```

### 4. Texture Generation Error

**Check Console for:**
```
❌ Errors in texture generation
❌ "Cannot read property 'getKey' of undefined"
```

**Solution:**
The texture system might be failing. Test with the original Phase 1 version:
```
Open: index_final.html (Phase 1, no textures)
```

If Phase 1 works but Phase 2 doesn't, the issue is in the texture system.

## Step-by-Step Debugging

### Test 1: Check if Page Loads
- ✅ You can see the body silhouette
- ✅ You can see the button
- ✅ Instructions overlay appears

**Status:** ✅ PASS (based on your screenshot)

### Test 2: Check Button Interaction
1. Press and hold the button
2. Does it change to "Écoute en cours..."?
3. Check console for "🎙️ START LISTENING PRESSED"

**If NO:** Button event listener issue
**If YES:** Continue to Test 3

### Test 3: Check Speech Recognition
1. While holding button, say "HAPPINESS" loudly and clearly
2. Check console for "🗣️ SPEECH CALLBACK TRIGGERED"
3. Check console for detected word

**If NO callback:** Speech recognition not working (see Solution A, B, C above)
**If YES:** Continue to Test 4

### Test 4: Check Emotion Matching
1. Look in console for "🎭 Emotion detected: [emotion]"
2. Or look for "⚠️ No matching emotion found"

**If "No matching":** Word doesn't contain emotion keyword
**If "Emotion detected":** Continue to Test 5

### Test 5: Check Letter Display
1. After emotion detected, letter should appear
2. Check console for "🎨 Loaded texture preset for [emotion]"
3. Letter outline should be visible immediately
4. Fill should animate as you make sound

**If NO letter:** Rendering issue (apply the fix I just made)
**If YES:** ✅ Working!

## Quick Fixes to Try

### Fix 1: Use Debug Version
```
Open: index_debug.html
```
This shows all console messages in an overlay on the page.

### Fix 2: Test with Keyboard
Instead of speech, test the letter display manually:
1. Open console (F12)
2. Type: `handleEmotionDetected("happiness")`
3. Press Enter
4. Letter should appear

### Fix 3: Reload with Hard Refresh
Sometimes the browser caches old code:
- **Mac:** Cmd + Shift + R
- **Windows/Linux:** Ctrl + Shift + R

### Fix 4: Check for JavaScript Errors
1. Open console (F12)
2. Look for red error messages
3. Share them with me if you see any

### Fix 5: Test Phase 1 Version
```
Open: index_final.html
```
This is the Phase 1 version without parametric textures. If this works, the issue is specific to Phase 2.

## Common Issues on macOS/Arc

### Issue: Arc Browser Permissions
Arc sometimes requires explicit permission even after granting:
1. Arc Menu → Settings
2. Privacy → Microphone
3. Ensure your site is allowed
4. Reload page

### Issue: System Microphone Permission
1. System Preferences → Security & Privacy
2. Privacy tab → Microphone
3. Ensure Arc/Chrome is checked
4. Restart browser

### Issue: Multiple Microphones
If you have multiple microphones (built-in, external, AirPods):
1. System Preferences → Sound → Input
2. Select the microphone you want to use
3. Speak to test the input level
4. Reload the page

## Still Not Working?

### Share This Information:
1. **Browser Console Output** (copy all messages)
2. **Which test failed** (from Step-by-Step Debugging above)
3. **Browser and OS** (e.g., "Arc on macOS 14")
4. **Any error messages** (red text in console)

### Try This:
Open `index_debug.html` and share a screenshot of:
1. The debug console overlay (top-right)
2. After pressing button and speaking
3. Any messages that appear

## Expected Behavior

When everything works correctly:

1. **Press button** → Button changes appearance, console shows "START LISTENING"
2. **Say "happiness"** → Console shows "SPEECH CALLBACK", "Emotion detected: happiness"
3. **Letter appears** → Gold "H" outline visible immediately
4. **Make sound** → Letter fills from bottom to top with texture
5. **Press H/E/A/R/T** → Texture changes, parameter bars update

## Files to Check

If you want to verify the fix is applied:

**LetterVisualizer_v2.js** should have this in `drawFill()`:
```javascript
// Create clipping rectangle for liquid effect (bottom to top)
drawingContext.beginPath();
drawingContext.rect(-s/2, (s/2) - h, s, h);
drawingContext.clip();

// Draw filled text within clipping region
noStroke();
text(this.currentEmotion.getLetter(), 0, 0);
```

If it still has the old code with just `text()` and `drawingContext.clip()`, you need to pull the latest changes.

## Next Steps

1. **Pull the latest fix:**
   ```bash
   git pull origin phase1-refactoring
   ```

2. **Hard refresh the browser:**
   - Mac: Cmd + Shift + R
   - Windows/Linux: Ctrl + Shift + R

3. **Test again** following the Step-by-Step Debugging above

4. **Share console output** if still not working

The fix I just applied should resolve the letter not appearing issue!
