---
title: "A-RYTH-MATIK Hardware Test"
layout: "single"
url: "/arythmatik/test/"
description: "Test an A-RYTH-MATIK module in the browser with the DEBUG firmware: display, supply, inputs, encoder, outputs and a loopback test."
---

Check your A-RYTH-MATIK from the browser. The module needs the **DEBUG firmware 2** – [flash it first](/arythmatik/debug/#1-flash-the-debug-firmware).

1. Connect the module by USB. Close other programs that use its port (Arduino IDE, the firmware uploader tab).
2. Press **Connect** and pick the module's port (often called "USB-SERIAL CH340" or "USB Serial").
3. The module restarts and sends its report. After 2–3 seconds the values below update twice a second.

Not sure what a value means? The [hardware test guide](/arythmatik/debug/) explains every value and what to do when something looks wrong.

{{< arythmatik_hwtest >}}

[← Back to the A-RYTH-MATIK firmware](/arythmatik/) · [Hardware test guide](/arythmatik/debug/)
