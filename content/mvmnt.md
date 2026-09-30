---
title: "MVMNT Firmware"
layout: "single"
---

<img src="https://dl.modulove.de/module/mvmnt/img/SyncLFO_Logo_Gradient.png" alt="MVMNT Logo" class="module-header-logo">

# MVMNT Firmware Collection

MVMNT (also known as SyncLFO) is a **smooth random CV and LFO generator** based on Hagiwo's Bezier Curve design. It breathes life into your patches with organic, evolving modulation.

**Hardware:** Arduino Nano · Dual-Panel Design · Track & Hold · Inverted & Bipolar Outputs

---

<div class="firmware-section">

## MVMNT (Bezier Curve Smooth Random)

<div class="firmware-header">
  <div class="firmware-image">🌊</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Smooth random control voltage using Bezier curves</li>
      <li>Precise control over shape and rate of modulation</li>
      <li>Adjustable intensity for fine-tuning randomness</li>
      <li>Track & Hold via TRIG input</li>
      <li>Inverted and Bipolar outputs</li>
      <li>Dynamic, unpredictable modulation</li>
    </ul>
  </div>
</div>

**Perfect for:** Organic modulation, smooth random sequences, evolving patches

**Controls:**
- **DEV (Deviation)**: Adjusts the range/intensity of randomness
- **LEVEL**: Controls the output voltage level
- **CURVE**: Shapes the Bezier curve character
- **FREQ**: Sets the rate of modulation
- **TRIG Input**: Track & Hold - freezes current voltage

> **LGT8F328P boards:** the MVMNT firmware also runs on LGT8F328P Nano-compatible boards (32 MHz). Tick **Board is an LGT8F328P** below the button before flashing one - it uses a different build.

{{< firmware_button hex="MVMNT" buttonText="Flash MVMNT Firmware" lgt="true" oledImage="https://dl.modulove.de/module/mvmnt/img/SyncLFO_Firmware_UI_SmoothRandom_887x512.png" >}}

</div>

---

<div class="firmware-section">

## DRIFT — by Mike

<div class="firmware-header">
  <div class="firmware-image">➿</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Bounded random walk — each value steps from the last, it does not teleport</li>
      <li>CHAOS sets how far it may wander; it reflects at the rails instead of clipping</li>
      <li>SHAPE morphs linear ramps → sample &amp; hold → smoothstep on one bipolar knob</li>
      <li>RATE from a 20-second drift up to 1 kHz, with a freeze position at hard CCW</li>
      <li>TRIG becomes a clock / S&amp;H input — or interleaves for instant polyrhythm</li>
      <li>9-bit output (512 levels) instead of the stock 8-bit</li>
    </ul>
  </div>
</div>

**Perfect for:** Sound design, organic motion curves, clocked sample &amp; hold, slow evolving drift

Written for MVMNT by **Mike**, a sound designer working in film, television and games — modelled on the random modulator he uses in Kilohearts Snap Heap. He sent it to us with four words: *"Share it with the community!"*

**Controls:**
- **DEPTH** (pos 1): Output amount — CCW flat, CW full swing
- **CHAOS** (pos 2): How far each new value steps from the current one
- **SHAPE** (pos 3): Bipolar — centre is sample &amp; hold, CCW linear ramps, CW smoothstep
- **RATE** (pos 4): 0.05 Hz → 1 kHz exponential; hard CCW freezes the output
- **TRIG Input**: Emits a new value immediately — clock it, or let it interleave

> **The printed panel legend does not apply.** DRIFT reassigns all four knobs, so the silkscreened ELEVATE / STRETCH / SMOOTH / FLUCTUATE labels are not what the knobs do. The [DRIFT panel legend](https://github.com/modulove/MVMNT/blob/main/Firmware/DRIFT/PANEL.md) has the mapping.

> **LGT8F328P boards:** DRIFT also runs on LGT8F328P Nano-compatible boards (32 MHz). Tick **Board is an LGT8F328P** below the button before flashing one - it uses a different build.

{{< firmware_button hex="DRIFT" buttonText="Flash DRIFT Firmware" lgt="true" >}}

[Read the full story and the firmware documentation](https://github.com/modulove/MVMNT/tree/main/Firmware/DRIFT)

</div>

---

<div class="firmware-section">

## SyncLFO

<div class="firmware-header">
  <div class="firmware-image">〰️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Classic LFO with multiple waveforms</li>
      <li>Sync-able to external clock</li>
      <li>Variable rate and depth control</li>
      <li>Multiple output options</li>
      <li>Tempo-sync'd modulation</li>
    </ul>
  </div>
</div>

**Perfect for:** Tempo-sync'd modulation, classic LFO shapes, rhythmic modulation

**Controls:**
- **RATE**: LFO speed
- **DEPTH**: Modulation amount
- **SYNC Input**: External clock for tempo sync
- **Multiple Outputs**: Different waveforms and polarities

> **LGT8F328P boards:** the SyncLFO firmware also runs on LGT8F328P Nano-compatible boards (32 MHz). Tick **Board is an LGT8F328P** below the button before flashing one - it uses a different build.

{{< firmware_button hex="SyncLFO" buttonText="Flash SyncLFO Firmware" lgt="true" oledImage="https://dl.modulove.de/module/mvmnt/img/SyncLFO_Firmware_UI_SyncLFO_887x512.png" >}}

</div>

---

## Hardware Requirements

- **Arduino Nano** or **Arduino Nano (Old Bootloader)**; all three firmwares also run on **LGT8F328P** Nano-compatible boards
- **Dual-Panel Design** by bkrsmdesign
  - Front: MVMNT Bezier Curve Random CV
  - Back: SYNC MOD LFO
- **CV Outputs**: Normal, Inverted, and Bipolar
- **Control Inputs**: TRIG for Track & Hold

---

## Installation Instructions

### 1. Connect Your Module
- Connect your Arduino Nano to your computer via USB
- Ensure the module is powered

### 2. Select Firmware
- Choose the firmware that matches your needs above
- Click the appropriate button (Nano or Old Bootloader; for an LGT8F328P board tick the option under the button first)

### 3. Flash Firmware
- Your browser will prompt you to select the serial port
- Select the port corresponding to your Arduino
- Wait for the upload to complete (typically 10-30 seconds)

### 4. Verify
- The module should boot up with the new firmware
- Test the CV outputs to confirm proper operation

---

## About MVMNT

MVMNT is inspired by the CV section of Mutable Instruments Marbles and based on Hagiwo's design. It features:

- **Beginner-Friendly**: Straightforward assembly with few parts
- **Dual-Use Design**: Flip panel offers two modules in one
- **Smooth Random CV**: Dynamic, organic modulation
- **Track & Hold**: Capture and hold CV values via TRIG input

The name "MVMNT" (Movement) reflects the organic, breathing quality of the Bezier curve modulation.

---

## Troubleshooting

**Upload fails:**
- Ensure you're using Chrome, Edge, or Opera (Web Serial API required)
- Try unplugging and reconnecting the USB cable
- Check that no other software (Arduino IDE, serial monitor) is using the port

**Module doesn't respond:**
- Check power connections
- Verify correct board selection (Nano, Old Bootloader or LGT8F328P)
- Try the opposite bootloader version

**No CV output:**
- Check your power supply
- Verify the firmware uploaded successfully
- Test with a different output (Normal, Inverted, or Bipolar)

---

## Resources

- [GitHub Repository](https://github.com/modulove/MVMNT) - Source code
- [Modulove Website](https://modulove.io) - Hardware information
- [Original Hagiwo Design](https://note.com/solder_state/n/n39aacefd73a3) - Hagiwo's original project
- [Report Issues](https://github.com/modulove/MVMNT/issues) - Bug reports and feature requests

---

*Based on Hagiwo's design · Enhanced by the Modulove community*
