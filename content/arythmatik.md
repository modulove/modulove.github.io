---
title: "A-RYTH-MATIK Firmware"
layout: "single"
---

<img src="https://dl.modulove.de/module/arythmatik/img/A-Ryth-Matik_Logo_Gradient.png" alt="A-RYTH-MATIK Logo" class="module-header-logo">

# A-RYTH-MATIK Firmware Collection

The A-RYTH-MATIK is a versatile **6-channel gate/trigger generator** based on the Hagiwo design. Choose from multiple firmware options below, each offering a unique approach to rhythm generation. The animations show the real display of each firmware.

**Hardware:** Arduino Nano or LGT8F328P Nano board · OLED Display (SSD1306) · Rotary Encoder · 6 Output Channels

> **Module not working as expected?** Flash the [DEBUG firmware](#hardware-test-debug) and check display, inputs and outputs in your browser on the [hardware test page](/arythmatik/test/).

---

<div class="firmware-section">

## Euclidean Rhythms

<div class="firmware-header">
  <div class="firmware-image">🔢</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>6 channels, each plays a Euclidean rhythm over 16 steps</li>
      <li>Per channel: hits, offset, length, mute and probability</li>
      <li>External clock at CLK or internal clock (40-240 BPM)</li>
      <li>20 presets (Techno, Samba, Clave, Aksak ...) and 20 memory slots</li>
      <li>Re-roll all channels at once, or automatically every 4-16 bars</li>
      <li>Exact 10 ms triggers straight from the clock, even while the display redraws</li>
    </ul>
  </div>
</div>

**Perfect for:** Mathematical polyrhythms, world rhythms, generative music

**Controls:**
- **Turn**: Step through the menu (channels 1-6, random, save, load, preset, clock, reset, mute)
- **Click**: Open the item; on a channel step through hits, offset, length, mute, reset, random, probability
- **Long Press**: Mute a channel · save, load or pick a preset on its page · switch internal/external clock
- **Press + Turn**: Change a channel's hits directly
- **CLK Input**: Next step on all channels
- **RST Input**: All channels start again from step 1

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Euclid)

{{< encoder_firmware_button hex="ARYTHMATIK_Euclid" buttonText="Flash Euclidean Firmware" oledImage="/images/arythmatik/Euclid_OLED.gif" >}}

</div>

---

<div class="firmware-section">

## Buds

<div class="firmware-header">
  <div class="firmware-image">🌱</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Two independent clock processors: side A runs from RST, side B from CLK, each at its own tempo</li>
      <li>Four modes per side: Buds (coin flip with adjustable probability), Toggle, Swing, Factor (divider 1-8)</li>
      <li>Main, inverted and clock output per side</li>
      <li>Swing worked out from the measured clock period</li>
      <li>12 ms triggers from a hardware timer, independent of the display</li>
      <li>Settings are saved automatically</li>
    </ul>
  </div>
</div>

**Perfect for:** Bernoulli gates, swinging hi-hats, two clock processors in one module

**Controls:**
- **Click**: Select side A or side B
- **Press + Turn**: Next mode for the selected side
- **Turn**: Probability, swing amount or divider of the selected side
- **Long Press**: Flip the toggle state (Toggle mode)
- **RST Input**: Clock for side A (outputs 1-3: inverted, main, clock)
- **CLK Input**: Clock for side B (outputs 4-6: inverted, main, clock)

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Buds)

{{< encoder_firmware_button hex="ARYTHMATIK_Buds" buttonText="Flash Buds Firmware" oledImage="/images/arythmatik/Buds_OLED.gif" >}}

</div>

---

<div class="firmware-section">

## Stitch Sequencer

<div class="firmware-header">
  <div class="firmware-image">▶️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>6 tracks × 16 steps with a fast text display</li>
      <li>MAN mode: edit the steps on a 6×16 grid</li>
      <li>AUTO mode: preset banks (Tech, Dub, House, Half-time) or generative patterns, with automatic switching and fills</li>
      <li>Output modes: triggers, gates or flip-flop</li>
      <li>RST jack assignable: reset, fill, generate or mutate</li>
      <li>Internal clock (60-240 BPM) or external clock, settings saved automatically</li>
    </ul>
  </div>
</div>

**Perfect for:** Live drum grooves, performance, generative variations

**Controls:**
- **Turn**: Move the cursor through the grid, then the bottom menu
- **Click**: Toggle a step or run the menu item
- **Press + Turn on BPM**: Change the tempo
- **Hold 5 s** (or 3 s while powering on): Secret menu (display rotation, encoder direction, defaults)
- **CLK Input**: Next step (with CLK:E)
- **RST Input**: The action set with IN: reset, fill, generate or mutate

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Stitch)

{{< encoder_firmware_button hex="ARYTHMATIK_Stitch" buttonText="Flash Stitch Firmware" oledImage="/images/arythmatik/Stitch_OLED.gif" >}}

</div>

---

<div class="firmware-section">

## Gate Sequencer

<div class="firmware-header">
  <div class="firmware-image">▶️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>6 channels × 16 steps, after HAGIWO's 6CH gate sequencer</li>
      <li>Gates as long as the clock pulse</li>
      <li>MANUAL mode: switch steps on and off, mute channels, save the pattern</li>
      <li>AUTO mode: built-in drum patterns (Techno, Dub Techno, House, Half-step) with fill-ins, a new pattern at random after a set number of bars</li>
      <li>Needs an external clock at CLK</li>
    </ul>
  </div>
</div>

**Perfect for:** Traditional sequencing, drum patterns, hands-on control

**Controls:**
- **Turn**: Move the cursor (steps, then MNAL / RESET / SAVE, then the channel names)
- **Click**: Toggle the step, run the item, or mute/unmute the channel
- **CLK Input**: Next step; outputs stay high while CLK is high
- **RST Input**: Back to the start, the next clock plays step 1

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Gate-seq)

{{< encoder_firmware_button hex="ARYTHMATIK_Gate-seq" buttonText="Flash Gate Sequencer Firmware" oledImage="/images/arythmatik/Gate-seq_OLED.gif" >}}

</div>

---

<div class="firmware-section">

## Pong

<div class="firmware-header">
  <div class="firmware-image">🏓</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Playable Pong: you play the right paddle with the encoder, the computer the left one</li>
      <li>1-3 balls with different speeds</li>
      <li>Adjustable gravity and bounce: arcs, and balls that die down and get launched again</li>
      <li>Every wall and paddle hit fires a trigger on its own output, OUT6 on every hit</li>
      <li>Follows a clock at CLK (physics steps per clock), optional quantize to the clock</li>
      <li>Settings are saved automatically</li>
    </ul>
  </div>
</div>

**Perfect for:** Experimental rhythms, chaotic patterns, visual performance

**Controls:**
- **Turn**: Move your paddle
- **Click**: Show the next parameter (gravity, bounce, balls, speed, steps per clock, quantize)
- **Press + Turn**: Change the shown parameter
- **Long Press**: New serve with a new random pattern
- **CLK Input**: The game runs in sync with the clock
- **RST Input**: Restart the serve (the same pattern again)

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Pong)

{{< encoder_firmware_button hex="ARYTHMATIK_Pong" buttonText="Flash Pong Firmware" oledImage="/images/arythmatik/Pong_OLED.gif" >}}

</div>

---

<div class="firmware-section">

## Labor (Show Piece)

<div class="firmware-header">
  <div class="firmware-image">🔨</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Two blacksmiths hammer away on the display, one animation frame per clock</li>
      <li>Four outputs play the hammer blows, two more a fixed beat pattern</li>
      <li>Runs from CLK, or from its own clock (30-600 BPM) when nothing is patched</li>
      <li>Clock divider /1, /2, /4, /8 for an external clock</li>
      <li>Four looks: classic, mirror, night, night mirror</li>
    </ul>
  </div>
</div>

**Perfect for:** A light-hearted break, demos and shows (made for Labour Day)

**Controls:**
- **Turn**: Tempo (own clock) or clock divider (external clock)
- **Click**: Info box with clock source, tempo, divider and look
- **Hold 0.7 s**: Next look
- **CLK Input**: Next animation frame
- **RST Input**: Back to the first frame

[Full manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Labor)

{{< encoder_firmware_button hex="ARYTHMATIK_Labor" buttonText="Flash Labor Firmware" oledImage="/images/arythmatik/Labor_OLED.gif" >}}

</div>

---
<div class="firmware-section">

## Hardware Test (DEBUG)

<div class="firmware-header">
  <div class="firmware-image">🩺</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>Checks chip, supply voltage, free RAM and EEPROM</li>
      <li>Measures the display supply and bus, display speed test</li>
      <li>CLK/RST pulses and BPM, encoder and button test</li>
      <li>Output and LED test modes, loopback test for every output</li>
      <li>Live results in the browser on the <a href="/arythmatik/test/">hardware test page</a></li>
      <li>Runs on Arduino Nano and LGT8F328P boards from the same file</li>
    </ul>
  </div>
</div>

**Perfect for:** checking a freshly built module, finding display, input or output faults, support requests

**Controls:**
- **Encoder Turn**: Next/previous test screen (on INPUTS: encoder test, hold the button 1 s for the next screen)
- **Encoder Click**: Screen action (EEPROM test, display speed test, clear counters, next output mode)
- **CLK / RST Input**: Measured on the INPUTS and LOOP screens

{{< encoder_firmware_button hex="ARYTHMATIK_DEBUG" buttonText="Flash DEBUG Firmware" oledImage="/images/arythmatik/DEBUG_OLED.gif" >}}

<a class="tool-button" href="/arythmatik/test/">🩺 Open the hardware test page</a>

Flash the DEBUG firmware with the button above, then open the test page and press **Connect**. The [hardware test guide](/arythmatik/debug/) explains every value, the loopback test and what to do when something looks wrong.

</div>

---

## Hardware Requirements

- **Arduino Nano** (new or old bootloader) or an **LGT8F328P Nano board** – the same firmware files run on both
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
- Tick "Use new bootloader" only for a Nano with the new bootloader; leave it unticked for an old-bootloader Nano or an LGT8F328P board

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

**Display, inputs or outputs misbehave:**
- Flash the [DEBUG firmware](#hardware-test-debug) and run the [hardware test](/arythmatik/test/) – the [guide](/arythmatik/debug/) explains the results

---

## Resources

- [GitHub Repository](https://github.com/modulove/A-RYTH-MATIK) - Source code
- [Build Guide & Schematic](https://github.com/modulove/A-RYTH-MATIK/blob/main/README.md) - Assembly instructions
- [Quick Start PDF](https://github.com/modulove/A-RYTH-MATIK/blob/main/A-Ryth-Matik_QuickStart.pdf) - Hardware guide
- [Hardware Test](/arythmatik/test/) - Check your module in the browser (with the DEBUG firmware) · [Guide](/arythmatik/debug/)
- [Report Issues](https://github.com/modulove/A-RYTH-MATIK/issues) - Bug reports and feature requests

---

*Based on the Hagiwo design · Enhanced by the Modulove community*
