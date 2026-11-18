---
title: "Stitch Pattern Editor"
layout: "single"
url: "/arythmatik/stitch/"
description: "Edit the patterns and settings of the A-RYTH-MATIK Stitch sequencer firmware in the browser, over USB."
---

Edit your A-RYTH-MATIK's **Stitch** sequencer from the browser: switch steps on the 6×16 grid, load preset grooves, let the module generate or mutate patterns and change its settings. The module needs the **Stitch firmware** – [flash it first](/arythmatik/#stitch-sequencer). The editor works in **Chrome** or **Edge** on a computer.

1. Connect the module by USB. Close other programs that use its port (Arduino IDE, the firmware uploader tab, the hardware test page).
2. Press **Connect** and pick the module's port (often called "USB-SERIAL CH340" or "USB Serial").
3. The module restarts. After 2–3 seconds the editor shows its pattern and settings.

**Send** puts the grid on the module and saves it there, so the pattern is still there after a power cycle. Settings change on the module at once and are saved by the module itself. In AUTO mode the module changes the pattern on its own – set Mode to MAN to keep yours playing.

{{< arythmatik_stitch_editor >}}

[← Back to the A-RYTH-MATIK firmware](/arythmatik/#stitch-sequencer) · [Stitch manual](https://github.com/modulove/A-RYTH-MATIK/tree/main/Firmware/ARYTHMATIK_Stitch)
