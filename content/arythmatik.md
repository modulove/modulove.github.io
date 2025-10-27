---
title: "A-RYTH-MATIK"
layout: "single"
---

# A-RYTH-MATIK Firmware Collection

The A-RYTH-MATIK is a versatile 6-channel gate/trigger generator based on the excellent Hagiwo design. This collection offers multiple firmware options, each providing a unique approach to rhythm generation.

## Available Firmware

### Euclidean Rhythms

Generate complex polyrhythmic patterns using Euclidean algorithms. Configure each output with steps, hits, rotation offset, and rest padding.

**Features:**
- 6 independent Euclidean rhythm generators
- Adjustable steps, hits, rotation, and rest per channel
- Multiple output modes: trigger, gate, flip
- Save/load patterns to memory banks
- Individual channel reset and randomization
- Interactive OLED display with visual feedback

**Usage:**
- **CLK Input**: Clock source to advance patterns
- **RST Input**: Reset all patterns to first step
- **Encoder Short Press**: Toggle between menu options
- **Encoder Long Press**: Access global settings
- **Encoder Double Click**: Reset all patterns

{{< encoder_firmware_button hex="ARYTHMATIK_Euclid" buttonText="Flash Euclidean Firmware" >}}

---

### Buds

Organic, evolving gate sequences that grow and change over time. Perfect for generative patches.

**Features:**
- Algorithmic pattern generation
- Organic evolution of gate patterns
- Visual feedback on OLED display
- Probability-based gate generation

**Usage:**
- **CLK Input**: Clock source
- **RST Input**: Reset pattern evolution
- **Encoder**: Adjust evolution parameters

{{< encoder_firmware_button hex="ARYTHMATIK_Buds" buttonText="Flash Buds Firmware" >}}

---

### Gate Sequencer

Classic step sequencer functionality with per-step gate control.

**Features:**
- 6 channels of gate sequencing
- Per-step gate on/off control
- Pattern length adjustment
- Step probability control
- Save/load sequences

**Usage:**
- **CLK Input**: Advance sequencer
- **RST Input**: Return to first step
- **Encoder**: Navigate and edit sequence steps

{{< encoder_firmware_button hex="ARYTHMATIK_Gate-seq" buttonText="Flash Gate Sequencer Firmware" >}}

---

### Pong

Bouncing ball rhythm generator inspired by the classic game. Creates rhythmic patterns as virtual balls bounce between outputs.

**Features:**
- Physics-based rhythm generation
- Multiple balls with different speeds
- Gravity and bounce parameters
- Visual representation on display

**Usage:**
- **CLK Input**: Update ball physics
- **RST Input**: Reset ball positions
- **Encoder**: Adjust physics parameters

{{< encoder_firmware_button hex="ARYTHMATIK_Pong" buttonText="Flash Pong Firmware" >}}

---

### Labor (Experimental)

Experimental rhythm laboratory with various algorithmic approaches and parameter modulation.

**Features:**
- Multiple experimental rhythm algorithms
- Deep parameter control
- Modulation options
- Research-focused feature set

**Usage:**
- **CLK Input**: Clock source
- **RST Input**: Reset current algorithm
- **Encoder**: Navigate experimental parameters

{{< encoder_firmware_button hex="ARYTHMATIK_Labor" buttonText="Flash Labor Firmware" >}}

---

## Hardware Requirements

- Arduino Nano or Arduino Nano (Old Bootloader)
- OLED Display (SSD1306, 128x64)
- Rotary Encoder with button
- 6 output channels with LEDs
- Clock and Reset inputs

## Installation Instructions

1. **Connect Your Module**
   - Connect your Arduino Nano to your computer via USB
   - Ensure the module is powered

2. **Select Firmware**
   - Choose the firmware that matches your needs
   - Click the appropriate button above (Nano or Old Bootloader)

3. **Flash Firmware**
   - Your browser will prompt you to select the serial port
   - Select the port corresponding to your Arduino
   - Wait for the upload to complete (typically 10-30 seconds)

4. **Verify**
   - The module should boot up with the new firmware
   - Check the OLED display for confirmation

## Encoder Direction

Some modules have reversed encoder direction. If rotating the encoder moves parameters in the opposite direction than expected, use the "Reversed" firmware variants.

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

## Resources

- [GitHub Repository](https://github.com/modulove/A-RYTH-MATIK)
- [Build Guide & Schematic](https://github.com/modulove/A-RYTH-MATIK/blob/main/README.md)
- [Quick Start PDF](https://github.com/modulove/A-RYTH-MATIK/blob/main/A-Ryth-Matik_QuickStart.pdf)
- [Report Issues](https://github.com/modulove/A-RYTH-MATIK/issues)

---

*Based on the Hagiwo design with love from the Modulove community*
