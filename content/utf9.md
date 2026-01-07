---
title: "UTF-9-SAMPLIFIED"
layout: "single"
---

# UTF-9-SAMPLIFIED - Sample-Based Drum Module

UTF-9-SAMPLIFIED is a **4-track sample-based step sequencer** for Eurorack, based on the Bleep Drum design. Choose from 6 different drumkit flavors, each with unique sampled drum sounds.

**Hardware:** Arduino Nano · 4-track Sequencer · 32 Steps · MIDI Support · Save/Load System

---

## Drumkit Firmwares

Select your preferred drumkit and flash it to your UTF-9-SAMPLIFIED module:

### Standard Drumkit

Classic drum machine sounds - the default drumkit with versatile samples for general use.

{{< firmware_button hex="UTF9_standard" buttonText="Flash Standard Drumkit" oledImage="/images/utf9/Standard_Drumkit.png" >}}

---

### TR-808 Drumkit

Legendary Roland TR-808 drum machine sounds - iconic analog-style kicks, snares, and hi-hats.

{{< firmware_button hex="UTF9_808" buttonText="Flash TR-808 Drumkit" oledImage="/images/utf9/TR-808_Drumkit.png" >}}

---

### TR-909 Drumkit

Classic Roland TR-909 drum sounds - punchy electronic drums perfect for techno and house.

{{< firmware_button hex="UTF9_909" buttonText="Flash TR-909 Drumkit" oledImage="/images/utf9/TR-909_Drumkit.png" >}}

---

### Hip-Hop Drumkit

Hip-hop oriented drum samples - boom-bap kicks, crispy snares, and hard-hitting percussion.

{{< firmware_button hex="UTF9_hiphop" buttonText="Flash Hip-Hop Drumkit" oledImage="/images/utf9/Hip-Hop_Drumkit.png" >}}

---

### Industrial Drumkit

Industrial and electronic sounds - harsh, metallic, and aggressive drum samples.

{{< firmware_button hex="UTF9_industrial" buttonText="Flash Industrial Drumkit" >}}

---

### Experimental Drumkit

Experimental and unconventional sounds - unique and creative percussion samples.

{{< firmware_button hex="UTF9_experimental" buttonText="Flash Experimental Drumkit" oledImage="/images/utf9/Experimental_Drumkit.png" >}}

---

## Features

- **4-track Step Sequencer**: 32 steps per track
- **Save/Load System**: 4 save banks with multiple pattern slots
- **MIDI Support**: Channels 1-16 selectable on boot
- **MIDI-to-CV Clock**: Converter when sequencer is stopped
- **Configurable Clock**: Dividers and MIDI auto-start
- **Reverse Play Mode**: Play patterns backwards
- **Metronome**: Live toggle feature
- **Pattern Bank Switching**: Quick access to different patterns

## Controls

- **Potentiometers**: Parameter control for each track
- **Buttons**: Step programming and pattern navigation
- **LEDs**: Visual feedback for step position
- **MIDI Input**: External clock and note triggers
- **CV Outputs**: Gate outputs for each track

## Hardware Requirements

- **Arduino Nano** or **Arduino Nano (Old Bootloader)**
- UTF-9-SAMPLIFIED hardware module
- MCP4901 DAC for audio output
- Flash before soldering for best results

---

## Resources

- [GitHub Repository](https://github.com/modulove/utf-9-samplified) - Source code and hardware files
- [Report Issues](https://github.com/modulove/utf-9-samplified/issues) - Bug reports and feature requests

---

*Based on the Bleep Drum design by Dr. Bleep*
