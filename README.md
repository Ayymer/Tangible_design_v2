# Tangible Design v2: Particle Emotion Visualizer

This project is an interactive web application that visualizes spoken emotion words as dynamic, physics-based particle systems. Using the p5.js library, it captures voice input, recognizes specific emotion keywords, and transforms them into beautiful, tangible art that can be manipulated in real-time with a keyboard or a Makey Makey board.

![Particle Text Demo](https://i.imgur.com/your-demo-image.gif)  
*Note: Replace with a GIF of your project in action!* 

---

## ✨ Features

- **Speech-to-Text Emotion Recognition**: Recognizes the words "HAPPINESS", "ANGER", "ENVY", "RAGE", and "TRUST".
- **Dynamic Particle Systems**: Each emotion is rendered with a unique particle type, creating distinct visual styles.
- **Real-time Parameter Control**: Adjust Hue, Energy, Amount, Radius, and Turbulence to customize the visuals.
- **Makey Makey Integration**: Control the particle system by touching the pads on a Makey Makey board.
- **Pixel-Based Text Sampling**: Generates dense, readable particle text by sampling filled letter shapes.
- **Modern UI**: A clean, dark-themed interface with a responsive layout.

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser that supports the Web Speech API (like Google Chrome).

### Running the Project

1.  **Clone the repository:**
    ```bash
    gh repo clone Ayymer/Tangible_design_v2
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Tangible_design_v2
    ```

3.  **Start a local web server.** A simple way is to use Python's built-in HTTP server.
    ```bash
    python3 -m http.server
    ```

4.  **Open the application** in your browser by navigating to:
    [http://localhost:8000/index_phase3.html](http://localhost:8000/index_phase3.html)

## 🕹️ How to Use

### Step 1: Speak an Emotion

1.  Click and hold the **"Hold to speak"** button.
2.  Your browser may ask for microphone permission. Click **"Allow"**.
3.  Say one of the supported emotion words:
    - `HAPPINESS`
    - `ANGER`
    - `ENVY`
    - `RAGE`
    - `TRUST`
4.  Release the button. The word will appear as a particle system.

### Step 2: Control the Visualization

You can manipulate the particle parameters using either a **Makey Makey** board or your **keyboard**.

#### Makey Makey Controls

First, ground yourself by touching the **EARTH** strip on the Makey Makey with one hand. Then, touch the control pads with your other hand.

| Touch Pad         | Parameter | Effect                                  |
| ----------------- | --------- | --------------------------------------- |
| **UP arrow** ↑    | Hue       | Increase color value (cycles rainbow)   |
| **DOWN arrow** ↓  | Hue       | Decrease color value (cycles rainbow)   |
| **RIGHT arrow** → | Energy    | Increase particle movement speed        |
| **LEFT arrow** ←  | Energy    | Decrease particle movement speed        |
| **SPACE**         | Amount    | Cycle density: 25% → 50% → 75% → 100% |

#### Keyboard Controls

| Key | Parameter  | Effect                        |
| --- | ---------- | ----------------------------- |
| `H` | Hue        | Cycle through colors          |
| `E` | Energy     | Cycle through energy levels   |
| `A` | Amount     | Cycle through particle density|
| `R` | Radius     | Cycle through particle sizes  |
| `T` | Turbulence | Cycle through chaos levels    |

---

## 🎨 Particle System Details

Each emotion is mapped to a unique particle type and a preset of parameters to give it a distinct feel.

### Emotion & Particle Mapping

| Emotion     | Particle Type | Visual Style                     |
| ----------- | ------------- | -------------------------------- |
| **HAPPINESS** | `squares`     | Playful, structured, colorful    |
| **TRUST**     | `dots`        | Calm, organic, flowing           |
| **ENVY**      | `dither`      | Complex, textured, uncomfortable |
| **RAGE**      | `reaction`    | Intense, explosive, uncontrolled |
| **ANGER**     | `strips`      | Sharp, directional, aggressive   |

### H.E.A.R.T. Parameters

These five parameters allow for deep customization of the visuals.

| Parameter    | Description                                           |
| ------------ | ----------------------------------------------------- |
| **Hue**      | The base color of the particles (0-360).                |
| **Energy**   | The speed and movement intensity of the particles.      |
| **Amount**   | The total number of particles in the system.          |
| **Radius**   | The size of each individual particle.                 |
| **Turbulence** | The amount of random, chaotic motion applied.         |

---

## 📁 Project Structure

```
.
├── index_phase3.html         # Main HTML file, loads all scripts
├── sketch_phase3.js          # Main application logic (setup, draw, speech, controls)
├── TextSampler.js            # Crucial class for converting text to particle points
├── Particle.js               # Base class for a single particle
├── ParticleTextSystem.js     # Manages the collection of particles for a word
├── ParticleTypes.js          # Defines the different particle renderers (squares, dots, etc.)
├── config_phase3.js          # All configuration (presets, UI styles, text)
├── ParameterDisplay_phase3.js# UI component for displaying parameters
├── MAKEY_MAKEY_GUIDE.md      # Detailed guide for using the Makey Makey
└── ... (other test files)
```

## 🛠️ Development Notes

This project involved overcoming a significant rendering challenge in p5.js. The initial approach using `font.textToPoints()` only sampled the *outline* of the text, resulting in hollow, unreadable words. 

The solution was to implement a **pixel-based sampling** method in `TextSampler.js`. This class now works by:
1.  Creating a temporary, off-screen graphics buffer.
2.  Drawing the text onto this buffer.
3.  Loading the buffer's pixels and collecting the coordinates of every non-black pixel.
4.  Using these coordinates to create a dense, filled-in particle system.

This approach proved to be far more robust and is the core of the current rendering engine.

## 🔮 Future Work

- **Add More Particle Types**: The system is modular, making it easy to add new renderers in `ParticleTypes.js`.
- **Custom Controller Object**: Integrate a dedicated controller object to abstract away the key mappings.
- **Map Back of Makey Makey**: The W, A, S, D, F, G keys on the back of the Makey Makey could be mapped to other functions.
- **Sound-Reactive Particles**: Use the microphone input level (`mic.getLevel()`) to influence particle behavior.

---

*This project was developed with assistance from Manus, an AI agent.*
