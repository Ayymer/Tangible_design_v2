# Makey Makey Control Guide

## Overview

Your Tangible Design v2 application now supports **Makey Makey touch controls**! You can control the particle parameters by touching the pads directly on the board - no alligator clips or conductive materials needed.

## Hardware Setup

1. **Connect the Makey Makey** to your computer via USB
2. **No additional materials required** - the touch pads on the board work directly
3. The board acts as a keyboard, no drivers needed

## How to Use

### Step 1: Speak an Emotion
Hold the "Hold to speak" button and say one of these emotions:
- HAPPINESS
- ANGER
- ENVY
- RAGE
- TRUST

### Step 2: Touch the Board to Adjust Parameters

**Ground yourself first:** Touch one of the EARTH/GROUND connections on the board with one hand, then touch the control pads with your other hand.

#### Makey Makey Touch Controls

| Touch Pad | Parameter | Effect |
|-----------|-----------|--------|
| **UP arrow** ↑ | Hue | Increase color (cycles through rainbow) |
| **DOWN arrow** ↓ | Hue | Decrease color (cycles through rainbow) |
| **RIGHT arrow** → | Energy | Increase particle movement speed |
| **LEFT arrow** ← | Energy | Decrease particle movement speed |
| **SPACE** | Amount | Cycle density: 25% → 50% → 75% → 100% |

#### Keyboard Controls (Alternative)

If you prefer using a regular keyboard, these keys still work:

| Key | Parameter | Effect |
|-----|-----------|--------|
| **H** | Hue | Cycle through colors |
| **E** | Energy | Cycle through energy levels |
| **A** | Amount | Cycle through particle density |
| **R** | Radius | Cycle through particle sizes |
| **T** | Turbulence | Cycle through chaos levels |

## Tips

1. **Make sure an emotion word is active** - controls only work after you've spoken an emotion
2. **Watch the console** - parameter changes are logged with visual indicators (↑↓←→⎵)
3. **Experiment!** - Try different combinations to create unique visual effects
4. **Parameter display** - The bottom-right corner shows current parameter values

## Troubleshooting

**Controls not responding?**
- Make sure you're touching EARTH/GROUND with one hand
- Check that the Makey Makey is plugged in (LED should be lit)
- Test in a text editor first - touching pads should type characters
- Make sure you've spoken an emotion word first

**Want to use alligator clips later?**
- The back of the board has W, A, S, D, F, G connections
- These aren't mapped yet, but can be added if needed
- Let me know if you want to map these keys!

## Technical Details

- **Implementation:** `sketch_phase3.js` `keyPressed()` function
- **Key codes:** Uses p5.js `keyCode` constants (UP_ARROW, DOWN_ARROW, etc.)
- **Backward compatible:** Original H/E/A/R/T keys still work
- **Real-time updates:** Parameters update immediately and regenerate particles

---

**Enjoy creating tangible emotion visualizations!** 🎨✨
