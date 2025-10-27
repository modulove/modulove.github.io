---
title: "MVMNT Firmware"
layout: "single"
---

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

{{< firmware_button hex="MVMNT" buttonText="Flash MVMNT Firmware" >}}

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

{{< firmware_button hex="SyncLFO" buttonText="Flash SyncLFO Firmware" >}}

</div>

---

## Hardware Requirements

- **Arduino Nano** or **Arduino Nano (Old Bootloader)**
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
- Click the appropriate button (Nano or Old Bootloader)

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
- Verify correct board selection (Nano vs Old Bootloader)
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
