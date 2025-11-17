---
title: "MOD2"
layout: "single"
---

# MOD2 - RP2350 Digital Percussion Module

MOD2 is a **digital percussion synthesizer** built on the powerful RP2350 microcontroller. Generate classic and experimental drum sounds with precise parameter control.

**Hardware:** RP2350 (Raspberry Pi Pico 2) · Digital Synthesis · 6 Parameters per Voice · Eurorack Format

---

## Firmware Options

Choose from 6 different (percussion) synthesis algorithms:


### Braids test

braids based synth module with 47 sound engines 

{{< rp2350_button uf2="MOD2_braids" buttonText="Download Braids Firmware" >}}

---


### Clap

Digital TR-808-style clap with adjustable tone, decay, and density parameters.

{{< rp2350_button uf2="MOD2_clap" buttonText="Download Clap Firmware" >}}

---

### Claves

Sine/triangle wave-based claves with LED envelope visualization and tunable parameters.

{{< rp2350_button uf2="MOD2_claves" buttonText="Download Claves Firmware" >}}

---

### FM Drum

Two-operator FM percussion synthesis - create metallic, bell-like, and experimental drum sounds.

{{< rp2350_button uf2="MOD2_fmdrum" buttonText="Download FM Drum Firmware" >}}

---

### Hi-Hat

White/blue noise-based hi-hat with tone shaping and envelope control.

{{< rp2350_button uf2="MOD2_hihat" buttonText="Download Hi-Hat Firmware" >}}

---

### Kick Drum

Sine wave-based kick drum with 6 controllable parameters - pitch, decay, punch, and more.

{{< rp2350_button uf2="MOD2_kick" buttonText="Download Kick Drum Firmware" >}}

---

### Sample

Sample player

{{< rp2350_button uf2="MOD2_sample" buttonText="Download Sample Firmware" >}}

---

### VCO

VCO

{{< rp2350_button uf2="MOD2_vco" buttonText="Download VCO Firmware" >}}

---

## Features

- **RP2350 Processor**: 150 MHz dual-core ARM Cortex-M33
- **High-Quality Audio**: ~36.6 kHz sample rate, 10-bit PWM output
- **Parameter Storage**: Settings saved to flash memory
- **Real-Time Control**: 6 potentiometers for immediate sound shaping
- **Trigger Input**: Gate/trigger responsive
- **CV Inputs**: Modulate parameters with external CV
- **LED Feedback**: Visual indication of envelope and parameters

## Technical Specifications

- **Sample Rate**: 36.6 kHz (150 MHz / 4096)
- **Resolution**: 10-bit (1024 levels)
- **EEPROM**: 128 bytes flash-based parameter storage
- **Power**: Eurorack +12V / -12V
- **Upload**: USB drag-and-drop (.uf2 format)

## Hardware Requirements

- **RP2350-based Module** (Raspberry Pi Pico 2 or compatible)
- MOD2 Eurorack hardware
- USB cable for firmware updates
- **Important**: Disconnect eurorack power before USB connection

---

## About RP2350 Firmware Updates

The RP2350 uses a simple drag-and-drop method for firmware updates:

1. No bootloader selection needed - RP2350 handles everything
2. Device appears as a USB drive when in BOOTSEL mode
3. Simply drag the .uf2 file to the drive
4. Automatic reboot with new firmware

**No Arduino IDE required** - pre-compiled .uf2 files ready to use!

---

## Resources

- [GitHub Repository](https://github.com/modulove/MOD2) - Source code and hardware files
- [Report Issues](https://github.com/modulove/MOD2/issues) - Bug reports and feature requests

---

*Next-generation digital percussion synthesis for Eurorack*
