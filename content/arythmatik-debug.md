---
title: "A-RYTH-MATIK Hardware Test Guide"
layout: "single"
url: "/arythmatik/debug/"
description: "How to check an A-RYTH-MATIK module with the DEBUG firmware and the browser test page: flashing, connecting, typical values, loopback test and troubleshooting."
---

The **DEBUG firmware** turns your A-RYTH-MATIK into its own test bench. It checks the board, the display, the inputs, the encoder and every output, and shows the results on the module screen and on the [hardware test page](/arythmatik/test/) in your browser.

**[→ Open the hardware test page](/arythmatik/test/)**

## What the test firmware does

- Shows the chip, its supply voltage, free memory and the reason for the last restart, and tests the EEPROM (the memory for saved settings).
- Measures the display's supply and data lines, lists everything on the display bus and runs a display speed test.
- Shows the CLK and RST inputs (level, pulse count, BPM, pulse width), the encoder and its button.
- Drives the outputs and LEDs in several test modes.
- Runs a loopback test: patch any output into CLK or RST and the module tells you which output arrives and how fast.
- Never hangs on a bad display: it recovers the display bus and restarts the display by itself.
- The same file runs on **Arduino Nano** (ATmega328P) and **LGT8F328P** boards.

Your saved settings stay: the EEPROM test only changes one spare byte and puts the old value back. When you are done, flash your normal firmware again from the [A-RYTH-MATIK page](/arythmatik/).

## 1. Flash the DEBUG firmware

1. Connect the module's board to your computer by USB, in **Chrome** or **Edge**.
2. Set **"Use new bootloader"** in the box below:
   - **Arduino Nano with the new bootloader** (most Nanos from 2018 on): **checked**.
   - **Older Nanos** and **LGT8F328P boards**: **unchecked**.
   - Upload fails? Try the other setting.
3. Click **Flash DEBUG Firmware**, pick the port and wait until the upload is complete.
4. The module shows "A-RYTH-MATIK hardware test 2.0" and then its first test screen.

{{< encoder_firmware_button hex="ARYTHMATIK_DEBUG" buttonText="Flash DEBUG Firmware" >}}

The encoder direction does not matter for the test. The same button is on the [A-RYTH-MATIK page](/arythmatik/#hardware-test-debug).

## 2. Open the test page and connect

1. Open the [hardware test page](/arythmatik/test/) in **Chrome** or **Edge** on a computer. Firefox, Safari and phones can't talk to USB devices.
2. Close anything else that uses the module's port: the Arduino IDE serial monitor, the uploader tab, other test tabs.
3. Press **Connect** and pick the module's port (often "USB-SERIAL CH340" or "USB Serial").
4. The module restarts (that is normal) and sends its report. After 2–3 seconds the page shows live values, a little later on LGT8F boards.

USB alone powers the module for the test. It can also stay in the rack – the supply voltage then reads higher (see below).

The **Checks** box at the top explains in plain words what looks fine and what doesn't. The buttons in each panel start the tests; **Module screen** switches the module's display to the matching test screen.

**Copy report for support** collects everything (the module's report, the latest values and the checks) and copies it, ready to paste into an e-mail. You can also download it as a text file.

## 3. What the values mean

### System and display

| Value | Typical | What it tells you |
|---|---|---|
| Chip | ATmega328P or LGT8F328P, 16 MHz | Which board sits on the module. |
| Supply (VCC) | 4.75–5.25 V in the rack, 4.2–4.7 V on USB only | The board's 5 V supply. On USB the board drops some voltage, that is normal. Nano boards measure it within about ±10 %, LGT8F boards within about ±1 %. |
| Free RAM | 60 bytes or more | Memory that was never used since the start. |
| Reset cause | reset (USB connect or reset button) | Why the module last started. Connecting the page restarts it. "brown-out" means the supply dipped at some point. |
| EEPROM | 1024 bytes, test ok | Press **EEPROM test**. "TEST FAILED" means settings can't be saved – the board is faulty. |
| Display | found at 0x3C | The display answered. |
| SDA / SCL | about 3.3 V each, both about the same | The display board's own supply, seen through its pull-up resistors (on some modules about 5 V). **Below 2.5 V** the display is not properly powered or is damaged. |
| Pull-ups | ok | "missing" means a display line has no pull-up or is shorted. |
| Devices | 0x3C | Everything that answered on the display bus. |
| Frame time | about 50–80 ms | How long one picture takes (drawing plus sending). |
| Timeouts, Re-inits | 0 and not counting up | Display bus trouble the firmware recovered from. Counting up = unstable display connection. |

**Bus check** measures the display lines again. **Speed test** sends a test picture at 400 kHz, 800 kHz and 1 MHz (about 4 seconds) – watch the module screen. A clean picture at 400 kHz is what the regular firmwares need.

### Inputs

| Value | Typical | What it tells you |
|---|---|---|
| Level | low with nothing patched | The input right now. The page reads it twice a second, so a running clock flickers. |
| Pulses | counts up with every pulse | Every rising edge is counted. **Clear counters** sets them to 0. |
| Width | the length of your pulses | Length of the last pulse. |
| Clock BPM | your clock tempo | Counted with 4 pulses per beat (16th notes). With one pulse per beat the real tempo is 4 × the value shown. |
| Encoder | changes by one per step | Works on the INPUTS screen. On the other screens turning the encoder changes the screen. |
| Button | PRESSED while you hold it | The encoder's push button. |

## The module screens

The firmware also works without a computer. The top line shows the screen name, its number and **NANO** or **LGT8F**.

- **Turn** the encoder: next or previous screen.
- **Click**: the screen's action (see the table).
- On **INPUTS**, turning is the encoder test instead – **hold the button for 1 second** to go to the next screen.
- **No display found:** the CLK LED blinks 3 times every 2 seconds. The firmware looks for the display again every 4 seconds.

| Screen | Shows | Click |
|---|---|---|
| 1 SYSTEM | chip, firmware version, VCC, free RAM, reset cause, EEPROM | EEPROM test |
| 2 I2C | SDA/SCL voltages, pull-ups, devices, frame time, timeouts | display speed test |
| 3 INPUTS | CLK/RST level, pulses, BPM, width, encoder, button | clear counters (hold 1 s: next screen) |
| 4 OUTPUTS | output test mode | next mode |
| 5 LOOP | loopback results | clear results |

## Output test

The outputs only run while the module shows the **OUTPUTS** screen. Pick a mode on the test page (this switches the module to OUTPUTS) or click through them on the module:

- **Chase** – one output after the other, the LEDs follow.
- **All on/off 1 Hz** – all outputs together, once per second.
- **Follow CLK input** – all outputs copy the CLK input.
- **LED 4+5 test** – LEDs 4 and 5 share their pins with the USB connection, so they stay dark in the other modes. In this mode the module switches USB off for 10 seconds and lights them. The test page waits and carries on by itself.
- **Off**

The LEDs have their own pins: a lit LED does not prove that the output jack works. The loopback test does.

## Loopback test

1. Press **Start loopback test** on the test page (or turn the module to the LOOP screen). The module now pulses OUT1 to OUT6 in turn.
2. Patch a cable from **OUT1** into **CLK**. The OUT1 cell in the CLK row counts up.
3. Move the cable through **OUT2 … OUT6**, then repeat with **RST**. **Clear** resets the table.

A healthy module shows hits for each patched output, a **delay of about 10–50 µs** and a **pulse width of about 5 ms**. An output that never shows hits has a problem between the chip and the jack. If no output arrives at all, check the input instead.

## Troubleshooting

| What you see | What the test shows | What to do |
|---|---|---|
| Black screen, CLK LED blinks 3 times every 2 s | Display: NOT FOUND | The display gets no power or no connection. Check its 4-pin header and solder joints, look at SDA/SCL. Try another display. |
| Black screen, no blinking, page gets no answer | – | The firmware is not running. Flash the DEBUG firmware again and check that the board's power LED is on. |
| Noisy, flickering or half-drawn screen | SDA/SCL below 2.5 V or jumping, timeouts counting up | The display board doesn't get a clean supply. Check its VCC/GND connection and solder joints, try another display. (A module with this fault showed 1.6–2.7 V on SDA/SCL.) |
| Picture only noisy at 800 kHz or 1 MHz in the speed test | – | Usually fine, the regular firmwares use 400 kHz. |
| No clock detected | CLK pulses stay at 0 | Check the cable and the clock source. Patch an output into CLK: if that arrives, the input works and your clock may be too weak or too short. |
| CLK or RST reads HIGH with nothing patched | Level HIGH all the time | Look at that input's jack and parts for a short or a missing part. |
| One output never arrives in the loopback test | Empty cell for that output | Check that output's jack, its resistor and the solder joints. |
| LEDs 4 and 5 stay dark | – | Normal in chase mode: use the LED 4+5 test. |
| Encoder doesn't count, or counts backwards | Encoder value on the INPUTS screen | Check the encoder's solder joints. Counting backwards: use the "reversed encoder" firmware variants. |
| Button never shows PRESSED | Button: released | Check the encoder's push switch and its solder joints. |
| Supply 4.2–4.7 V | VCC note in the Checks box | Normal when the module runs from USB only. |
| EEPROM test failed | EEPROM: TEST FAILED | The board can't save settings – replace the Nano/LGT8F board. |
| The page finds no port or gets no answer | – | Use a USB data cable (not charge-only), close the Arduino IDE and uploader tabs, and install the CH340 driver if your board needs one. Make sure the DEBUG firmware 2 is flashed. |
| The firmware upload fails | – | Toggle "Use new bootloader". LGT8F328P boards: unchecked. |

## Asking for help

Press **Copy report for support** on the test page and paste the report into your e-mail or into an [issue on GitHub](https://github.com/modulove/A-RYTH-MATIK/issues). A photo of the module screen helps too.

[← Back to the A-RYTH-MATIK firmware](/arythmatik/) · [Open the hardware test page](/arythmatik/test/)
