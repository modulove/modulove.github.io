---
title: "A-RYTH-MATIK Firmware"
layout: "single"
---

<img src="https://dl.modulove.de/module/arythmatik/img/A-Ryth-Matik_Logo_Gradient.png" alt="A-RYTH-MATIK Logo" class="module-header-logo">

# A-RYTH-MATIK Firmware Collection

The A-RYTH-MATIK is a versatile **6-channel gate/trigger generator** based on the Hagiwo design. Choose from multiple firmware options below, each offering a unique approach to rhythm generation.

**Hardware:** Arduino Nano · OLED Display (SSD1306) · Rotary Encoder · 6 Output Channels

---

<div class="firmware-section">

## Euclidean Rhythms

<div class="firmware-header">
  <div class="firmware-image">🔢</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>6 independent Euclidean rhythm generators</li>
      <li>Adjustable steps, hits, rotation, and rest per channel</li>
      <li>Multiple output modes: trigger, gate, flip</li>
      <li>Save/load patterns to memory banks</li>
      <li>Individual channel reset and randomization</li>
      <li>Interactive OLED with visual feedback</li>
    </ul>
  </div>
</div>

**Perfect for:** Mathematical polyrhythms, complex evolving patterns, generative music

**Controls:**
- **Encoder Short Press**: Toggle between menu options
- **Encoder Long Press**: Access global settings
- **Encoder Double Click**: Reset all patterns
- **CLK Input**: Clock source to advance patterns
- **RST Input**: Reset all patterns to first step

{{< encoder_firmware_button hex="ARYTHMATIK_Euclid" buttonText="Flash Euclidean Firmware" oledImage="https://dl.modulove.de/module/arythmatik/img/A-Ryth-Matik_Firmware_UI_Euclidean_887x512.png" >}}

</div>

---

<div class="firmware-section">

## Buds

<div class="firmware-header">
  <div class="firmware-image">🌱</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Organic, evolving gate sequences</li>
      <li>Algorithmic pattern generation</li>
      <li>Probability-based gate generation</li>
      <li>Visual feedback on OLED display</li>
      <li>Patterns grow and mutate over time</li>
    </ul>
  </div>
</div>

**Perfect for:** Generative patches, organic rhythms, evolving patterns

**Controls:**
- **Encoder**: Adjust evolution parameters
- **CLK Input**: Clock source
- **RST Input**: Reset pattern evolution

{{< encoder_firmware_button hex="ARYTHMATIK_Buds" buttonText="Flash Buds Firmware" >}}

</div>

---

<div class="firmware-section">

## Gate Sequencer

<div class="firmware-header">
  <div class="firmware-image">▶️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Classic step sequencer with 6 channels</li>
      <li>Per-step gate on/off control</li>
      <li>Adjustable pattern length</li>
      <li>Step probability control</li>
      <li>Save/load sequences</li>
      <li>Visual step display</li>
    </ul>
  </div>
</div>

**Perfect for:** Traditional sequencing, rhythmic patterns, hands-on control

**Controls:**
- **Encoder**: Navigate and edit sequence steps
- **CLK Input**: Advance sequencer
- **RST Input**: Return to first step

{{< encoder_firmware_button hex="ARYTHMATIK_Gate-seq" buttonText="Flash Gate Sequencer Firmware" oledImage="https://dl.modulove.de/module/arythmatik/img/A-Ryth-Matik_Firmware_UI_Gate_887x512.png" >}}

</div>

---

<div class="firmware-section">

## Pong

<div class="firmware-header">
  <div class="firmware-image">🏓</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Physics-based rhythm generation</li>
      <li>Multiple balls with different speeds</li>
      <li>Adjustable gravity and bounce parameters</li>
      <li>Visual representation on display</li>
      <li>Chaotic yet musical patterns</li>
    </ul>
  </div>
</div>

**Perfect for:** Experimental rhythms, chaotic patterns, visual performance

**Controls:**
- **Encoder**: Adjust physics parameters
- **CLK Input**: Update ball physics
- **RST Input**: Reset ball positions

{{< encoder_firmware_button hex="ARYTHMATIK_Pong" buttonText="Flash Pong Firmware" >}}

</div>

---

<div class="firmware-section">

## Labor (Experimental)

<div class="firmware-header">
  <div class="firmware-image">🧪</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Multiple experimental rhythm algorithms</li>
      <li>Deep parameter control</li>
      <li>Modulation options</li>
      <li>Research-focused feature set</li>
      <li>Bleeding-edge algorithms</li>
    </ul>
  </div>
</div>

**Perfect for:** Experimentation, discovering new rhythms, research

**Controls:**
- **Encoder**: Navigate experimental parameters
- **CLK Input**: Clock source
- **RST Input**: Reset current algorithm

{{< encoder_firmware_button hex="ARYTHMATIK_Labor" buttonText="Flash Labor Firmware" >}}

</div>

---

## Hardware Requirements

- **Arduino Nano** or **Arduino Nano (Old Bootloader)**
- **OLED Display**: SSD1306, 128x64 pixels, I2C
- **Rotary Encoder** with push button
- **6 output channels** with LED indicators
- **Clock (CLK)** and **Reset (RST)** inputs

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
- Check the OLED display for confirmation

---

## Encoder Direction

Some modules have reversed encoder direction. If rotating the encoder moves parameters in the opposite direction than expected, use the **"Reversed"** firmware variants.

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

**Wrong encoder direction:**
- Use the reversed encoder firmware variant

---

## Resources

- [GitHub Repository](https://github.com/modulove/A-RYTH-MATIK) - Source code
- [Build Guide & Schematic](https://github.com/modulove/A-RYTH-MATIK/blob/main/README.md) - Assembly instructions
- [Quick Start PDF](https://github.com/modulove/A-RYTH-MATIK/blob/main/A-Ryth-Matik_QuickStart.pdf) - Hardware guide
- [Report Issues](https://github.com/modulove/A-RYTH-MATIK/issues) - Bug reports and feature requests

---

*Based on the Hagiwo design · Enhanced by the Modulove community*
