---
title: "MOD1 Firmware Collection"
layout: "single"
---

# MOD1 - Modular Utility Collection

MOD1 is Hagiwo's **versatile utility module collection** offering 12 different firmware options for a wide range of modular synthesis tasks. From LFOs and envelopes to logic processing and VCOs, MOD1 is your Swiss Army knife for Eurorack.

**Hardware:** Arduino Nano · Compact Design · Triple Potentiometer Control · Multiple I/O

---

{{< mod1_firmware title="3-Channel LFO" hex="MOD1_3LFO" buttonText="Flash 3-Channel LFO" image="3lfo" >}}
- 3 independent LFO outputs
- Selectable waveforms: Triangle, Square, Sine, Random Slope
- Individual frequency control per channel
- Global CV frequency input affects all channels
- Frequency range: 0.02 - 5Hz
- Waveform selection saved to EEPROM

**Perfect for:** Multi-source modulation, complex movement, parallel LFO routing

**Controls:**
- **POT1**: LFO1 Frequency
- **POT2**: LFO2 Frequency
- **POT3**: LFO3 Frequency
- **F1 Input**: Global frequency CV (affects all channels)
- **Button**: Change waveform (Triangle → Square → Sine → Random Slope)
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="ADSR Envelope Generator" hex="MOD1_ADSR" buttonText="Flash ADSR Envelope" image="adsr" >}}
- Classic ADSR envelope with CV output
- Attack phase gate output (gate-to-trigger conversion)
- Decay-to-release phase gate output (trigger-to-gate conversion)
- 6-level sustain control via button
- PWM envelope output
- Sustain level saved to EEPROM

**Perfect for:** VCA control, filter modulation, percussion shaping

**Controls:**
- **POT1**: Attack Time
- **POT2**: Decay Time
- **POT3**: Release Time
- **F1 Input**: Trigger Input
- **F2 Output**: Attack phase gate
- **F3 Output**: Decay-to-release phase gate
- **F4 Output**: ADSR envelope CV
- **Button**: Cycle through 6 sustain levels
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Chipz" hex="MOD1_Chipz" buttonText="Flash Chipz" image="clock" >}}
- 2 independent pwm outputs
- Clock input and internal Clock fallback
- Can be used with headphones

**Perfect for:** First encounter with the MOD1 module

**Controls:**
- **POT1**: 
- **POT2**: 
- **POT3**: 
- **F1 Input**: Clock input
- **Button**: Toggle mode / song
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Clock Divider/Multiplier" hex="MOD1_clock_div_multi" buttonText="Flash Clock Div/Multi" image="clock" >}}
- 3 independent clock outputs
- Division/multiplication rates: 1, 2, 3, 4, 8, 16
- Mode switching: Divider ↔ Multiplier
- Pin change interrupts for zero-latency edge detection
- Direct port manipulation for fastest I/O
- Mode stored in EEPROM

**Perfect for:** Polyrhythms, tempo variations, synchronized modulation

**Controls:**
- **POT1**: Output 1 rate (1, 2, 3, 4, 8, 16)
- **POT2**: Output 2 rate
- **POT3**: Output 3 rate
- **F1 Input**: Clock input
- **Button**: Toggle Divider/Multiplier mode
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Envelope Generator (AR)" hex="MOD1_EG" buttonText="Flash AR Envelope" image="eg" >}}
- Attack-Release envelope generator
- 3 outputs: EG, Inverted EG, End-of-cycle pulse
- Self-patchable for LFO or clock functionality
- Output level control
- Exponential curves via lookup table

**Perfect for:** Percussion, fast envelopes, gate-to-trigger conversion

**Controls:**
- **POT1**: Attack Time
- **POT2**: Release Time
- **POT3**: Output Level
- **F1 Input**: Trigger Input
- **F2 Output**: End-of-cycle pulse
- **F3 Output**: Inverted EG output
- **F4 Output**: EG output
- **Button**: Manual trigger
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Euclidean Rhythm Sequencer" hex="MOD1_Euclid" buttonText="Flash Euclidean Sequencer" image="euclid" >}}
- 8 or 16-step Euclidean rhythm generator
- Adjustable number of hits (0-8)
- Output probability control (randomize triggers)
- Step length: 8 steps ↔ 16 steps
- CV control for number of hits
- Reset input

**Perfect for:** Generative rhythms, polyrhythmic patterns, controlled randomness

**Controls:**
- **POT1**: Number of hits (0-8)
- **POT2**: Output probability
- **POT3**: Step length (8 or 16 steps)
- **F1 Input**: Reset
- **F2 Input**: Clock
- **F3 Input**: Number of hits CV
- **F4 Output**: Trigger output
- **Button**: Manual reset
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="LFO (Single Channel)" hex="MOD1_LFO" buttonText="Flash Single LFO" image="lfo" >}}
- 5 waveforms: Sine, Triangle, Sawtooth, Square, Random Slope
- Continuous waveform selection via pot
- Frequency CV input
- Waveform CV input
- Output level CV input
- Switchable frequency range (saved to EEPROM)

**Perfect for:** Classic modulation, CV mixing, voltage-controlled waveshaping

**Controls:**
- **POT1**: Frequency
- **POT2**: Waveform selection
- **POT3**: Output level
- **F1 Input**: Frequency CV
- **F2 Input**: Waveform CV
- **F3 Input**: Output level CV
- **F4 Output**: LFO output
- **Button**: Change frequency range
{{< /mod1_firmware >}}

---

<div class="firmware-section">

## Logic Processor

<div class="firmware-header">
  <div class="firmware-image">🔀</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>6 logic modes: AND/NAND, OR/NOR, XOR/XNOR, COMPARE, MAX/MIN, FLIP-FLOP</li>
      <li>Dual PWM outputs (A and B)</li>
      <li>Two CV inputs with pot control</li>
      <li>Real-time logic processing</li>
    </ul>
  </div>
</div>

**Perfect for:** Complex CV processing, gate logic, voltage comparisons

**Controls:**
- **POT1**: Mode select
- **POT2**: Input A value
- **POT3**: Input B value
- **F1 Input**: CV Input A
- **F2 Input**: CV Input B
- **F3 Output**: PWM Output A
- **F4 Output**: PWM Output B

{{< firmware_button hex="MOD1_Logic" buttonText="Flash Logic Processor" >}}

</div>

---

{{< mod1_firmware title="Random CV Sequencer" hex="MOD1_randomCVsequencer" buttonText="Flash Random CV Seq" image="random_cv_seq" >}}
- Quantized random CV output (C2-C5 range)
- Step lengths: 3, 4, 5, 8, 16, 32
- Output level sets top note (0-36 semitones)
- Trigger probability control
- Scale selection via button (multiple scales)
- Serial tuning menu (hold button at boot)
- Calibration table stored in EEPROM

**Perfect for:** Generative melodies, random sequences, quantized randomness

**Controls:**
- **POT1**: Step length
- **POT2**: Output level (top note)
- **POT3**: Trigger probability
- **F1 Input**: Clock input
- **F2 Input**: Re-randomize trigger
- **F3 Output**: CV output (quantized)
- **F4 Output**: Trigger output
- **Button**: Re-randomize / Scale select (long press)
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Square Wave VCO" hex="MOD1_square_vco" buttonText="Flash Square VCO" image="vco" >}}
- V/Oct tracking square wave oscillator
- Octave control with CV input
- Vibrato LFO with depth control
- Chiptune-style octave LFO (toggle on/off)
- Audio-rate output

**Perfect for:** Audio oscillator, chiptune sounds, square wave bass

**Controls:**
- **POT1**: Frequency tune
- **POT2**: Octave
- **POT3**: Vibrato LFO level
- **F1 Input**: V/Oct CV input
- **F2 Input**: Octave CV input
- **F3 Input**: Vibrato level CV input
- **F4 Output**: Audio output
- **Button**: Octave LFO on/off

**Note:** Remove capacitor from D11 output circuit for proper audio operation
{{< /mod1_firmware >}}

---

{{< mod1_firmware title="Sync LFO" hex="MOD1_SyncLFO" buttonText="Flash Sync LFO" image="sync_lfo" >}}
- Clock-synchronized LFO
- 5 waveforms: Sine, Triangle, Sawtooth, Square, Random
- Division rate control
- Waveform selection via pot or CV
- Output level control
- External clock input via button or F1

**Perfect for:** Tempo-synced modulation, rhythmic LFO, clocked movement

**Controls:**
- **POT1**: Division rate
- **POT2**: Waveform selection
- **POT3**: Output level
- **F1 Input**: External clock (when button pressed)
- **F2 Input**: Division rate CV
- **F3 Input**: Waveform select CV
- **F4 Output**: LFO output
- **Button**: Use external clock
{{< /mod1_firmware >}}

---

<div class="firmware-section">

## Tap Tempo Clock

<div class="firmware-header">
  <div class="firmware-image">⏲️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>4-output tap tempo master clock</li>
      <li>F1: Fixed 4x output</li>
      <li>F2: 1-16x variable multiplication</li>
      <li>F3 & F4: 1/1 to 1/16 variable division</li>
      <li>Tap tempo via button (4 taps to set)</li>
      <li>BPM range up to ~280 BPM</li>
    </ul>
  </div>
</div>

**Perfect for:** Master clock, tempo setting, synchronized rhythms

**Controls:**
- **POT1**: F2 output multiplication rate (1-16x)
- **POT2**: F3 output division rate (1/1 - 1/16)
- **POT3**: F4 output division rate (1/1 - 1/16)
- **F1 Output**: 4x clock output
- **F2 Output**: Variable multiply output
- **F3 Output**: Variable division output
- **F4 Output**: Variable division output
- **Button**: Tap tempo (tap 4 times)

{{< firmware_button hex="MOD1_TapTempoClock" buttonText="Flash Tap Tempo Clock" >}}

</div>

---

{{< mod1_firmware title="Trigger Burst" hex="MOD1_TiggerBurst" buttonText="Flash Trigger Burst" image="burst" >}}
- Clock-syncable trigger burst generator
- Burst counts: 1, 3, 4, 6, 8, 16
- Burst frequency divisions: /2, /3, /4, /6, /8, /16
- Internal clock (~280 BPM max) or external clock
- CV control for burst number
- Manual or trigger input activation

**Perfect for:** Trigger multiplication, rhythmic bursts, drum fills

**Controls:**
- **POT1**: Burst number (1, 3, 4, 6, 8, 16)
- **POT2**: Burst frequency (division of master clock)
- **POT3**: Internal clock rate (or external when fully left)
- **F1 Input**: External clock input
- **F2 Input**: Trigger input
- **F3 Input**: Burst number CV
- **F4 Output**: Trigger burst output
- **Button**: Manual trigger
{{< /mod1_firmware >}}

---

## Hardware Requirements

- **Arduino Nano** or **Arduino Nano (Old Bootloader)**
- **MOD1 Hardware** (available from various Eurorack DIY sources)
- **3 Potentiometers** for parameter control
- **Push Button** for mode selection/triggering
- **LED** for visual feedback
- **Multiple I/O Jacks** (4 jacks: F1-F4)

---

## Installation Instructions

### 1. Connect Your Module
- Connect your Arduino Nano to your computer via USB
- Ensure the module is powered

### 2. Select Firmware
- Choose the firmware that matches your needs from the options above
- Click the appropriate button (Nano or Old Bootloader)

### 3. Flash Firmware
- Your browser will prompt you to select the serial port
- Select the port corresponding to your Arduino
- Wait for the upload to complete (typically 10-30 seconds)

### 4. Verify
- The module should boot up with the new firmware
- Test the inputs/outputs to confirm proper operation
- Check LED feedback for visual confirmation

---

## About MOD1

MOD1 is Hagiwo's collection of utility modules designed for maximum flexibility in a compact Eurorack format. Each firmware transforms the same hardware into a completely different tool, making MOD1 one of the most versatile modules in your rack.

Key features across all firmware:
- **Easy to Build**: Minimal component count
- **Flexible**: 12 different firmware options
- **Reprogrammable**: Change firmware as your needs evolve
- **Educational**: Great for learning Arduino and Eurorack DIY

The compact design and triple-pot interface provide hands-on control while keeping your rack tidy.

---

## Troubleshooting

**Upload fails:**
- Ensure you're using Chrome, Edge, or Opera (Web Serial API required)
- Try unplugging and reconnecting the USB cable
- Check that no other software (Arduino IDE, serial monitor) is using the port

**Module doesn't respond:**
- Check power connections
- Verify correct board selection (Nano vs Old Bootloader)
- Try the opposite bootloader version

**Outputs not working:**
- Check your power supply
- Verify the firmware uploaded successfully
- Test with a multimeter to check for voltage output
- Confirm proper wiring of output jacks

**Button not responding:**
- Some firmware use button for mode selection, others for triggering
- Check if button requires pull-up resistor
- Verify button wiring

---

## Resources

- [GitHub Repository](https://github.com/modulove/MOD1) - Source code
- [Hagiwo's Original Designs](https://note.com/solder_state) - Original MOD1 documentation
- [Modulove Website](https://modulove.io) - Hardware information
- [Report Issues](https://github.com/modulove/MOD1/issues) - Bug reports and feature requests

---

*Based on Hagiwo's designs · Enhanced by the Modulove community*
