/*
 * A-RYTH-MATIK hardware test page for the DEBUG firmware 2.x (Web Serial: Chrome / Edge).
 * Markup and styles: layouts/shortcodes/arythmatik_hwtest.html. Nothing leaves the browser.
 *
 * Protocol (source of truth: Firmware/ARYTHMATIK_DEBUG/ARYTHMATIK_DEBUG.ino in modulove/A-RYTH-MATIK):
 *   USB serial 115200 8N1. Opening the port resets the module; it then prints a readable
 *   report ending with "=== end ===". Single-character commands:
 *     r report   j status JSON   b bus check (+ status)   t display speed test (~4 s)
 *     e EEPROM test   c clear counters   0..4 module screen   m0..m4 output mode
 *     (m3 = LED 4+5 test: the module switches serial off for 10 s, LEDs 4/5 share D0/D1)
 *   Lines starting with "{" are JSON ({"t":"st"|"bus"|"ee"|"ok", ...}), all others are text.
 *
 * Demo without hardware: add ?mock=1 (healthy module) or ?mock=bad (weak display supply)
 * to the page URL.
 */
(function () {
  'use strict';

  const root = document.getElementById('hwt');
  if (!root) return;

  const POLL_MS = 500;           // status poll interval
  const BOOT_WAIT_MS = 7000;     // reset + bootloader + splash until "=== end ===" (LGT8F boards are slower)
  const LED45_PAUSE_MS = 10500;  // serial is off on the module for 10 s in the LED 4+5 test
  const PAGE_NAMES = ['SYSTEM', 'I2C', 'INPUTS', 'OUTPUTS', 'LOOP'];
  const MODE_NAMES = ['chase', 'all on/off 1 Hz', 'follow CLK', 'LED 4+5 test', 'off'];
  const RESET_TEXT = {
    'power-on': 'power-on',
    'brown-out': 'brown-out (supply dipped)',
    'reset-pin': 'reset (USB connect or reset button)',
    'watchdog/boot': 'watchdog / bootloader',
    unknown: 'unknown'
  };
  const LABEL = { bad: 'Problem', warn: 'Check', info: 'Note', ok: 'OK' };
  const MOCK = new URLSearchParams(location.search).get('mock');
  const GUIDE = root.dataset.guide || '';

  // ---------- DOM helpers ----------
  const F = {};
  root.querySelectorAll('[data-f]').forEach(function (el) { F[el.dataset.f] = el; });

  function setText(name, text, cls) {
    const el = F[name];
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hwt-ok', 'hwt-warn', 'hwt-bad');
    if (cls) el.classList.add('hwt-' + cls);
  }
  function volts(mv) { return (mv / 1000).toFixed(2) + ' V'; }
  function ms(us) { return (us / 1000).toFixed(1) + ' ms'; }
  function hex(a) { return '0x' + Number(a).toString(16).toUpperCase(); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function sleep(t) { return new Promise(function (r) { setTimeout(r, t); }); }
  function fmtDuration(t) {
    const s = Math.floor(t / 1000);
    if (s < 60) return s + ' s';
    if (s < 3600) return Math.floor(s / 60) + ' min ' + (s % 60) + ' s';
    return Math.floor(s / 3600) + ' h ' + Math.floor((s % 3600) / 60) + ' min';
  }

  // ---------- state ----------
  const S = {
    link: null,
    state: 'idle',        // idle | connecting | starting | live | noanswer | paused | lost
    st: null,             // latest status JSON
    stAt: 0,
    report: [],           // latest readable report (lines)
    reportBuf: null,
    reportWaiters: [],
    bus: null,            // latest speed test result
    busBefore: 0,
    pending: null,        // request waiting for its answer
    queue: [],
    pollAt: 0,
    missed: 0,
    rxLines: 0,
    oldFw: false,
    pausedUntil: 0,
    speedRunning: false,
    lastTimeouts: null,
    timeoutRiseAt: 0,
    lastUptime: 0,
    high: { clk: null, rst: null },
    lastPort: null,
    userClosed: false,
    errLogAt: 0,
    dlUrl: null
  };

  // ---------- console log ----------
  const logLines = [];
  let logDirty = false;
  function log(text) {
    logLines.push(text);
    if (logLines.length > 500) logLines.splice(0, logLines.length - 500);
    if (!logDirty) {
      logDirty = true;
      setTimeout(flushLog, 150);
    }
  }
  function flushLog() {
    logDirty = false;
    const el = F.log;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    el.textContent = logLines.join('\n');
    if (atBottom) el.scrollTop = el.scrollHeight;
  }

  // ---------- serial link (Web Serial) ----------
  class SerialLink {
    constructor(port) {
      this.port = port || null;
      this.buf = '';
      this.dec = new TextDecoder();
      this.enc = new TextEncoder();
      this.reader = null;
      this.reading = false;
    }
    async open() {
      if (!this.port) this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200, bufferSize: 4096 });
      this.reading = true;
      this.loop = this.readLoop();
    }
    async readLoop() {
      while (this.reading && this.port.readable) {
        this.reader = this.port.readable.getReader();
        try {
          for (;;) {
            const r = await this.reader.read();
            if (r.done) break;
            if (r.value) this.feed(r.value);
          }
        } catch (e) {
          // Framing/break/overrun errors are not fatal (they happen during the LED 4+5
          // test, when D0/D1 drive LEDs): take a new reader and carry on.
          if (this.reading && this.onEvent) this.onEvent('readerror', e);
          await sleep(20);
        } finally {
          try { this.reader.releaseLock(); } catch (e) { /* already released */ }
          this.reader = null;
        }
      }
      if (this.reading && this.onEvent) this.onEvent('lost');
    }
    feed(bytes) {
      this.buf += this.dec.decode(bytes, { stream: true });
      let i;
      while ((i = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, i);
        this.buf = this.buf.slice(i + 1);
        if (this.onLine) this.onLine(line);
      }
      if (this.buf.length > 4000) this.buf = '';
    }
    clearBuffer() { this.buf = ''; }
    async write(text) {
      if (!this.port || !this.port.writable) throw new Error('port not open');
      const w = this.port.writable.getWriter();
      try {
        await w.write(this.enc.encode(text));
      } finally {
        w.releaseLock();
      }
    }
    async close() {
      this.reading = false;
      if (this.reader) {
        try { await this.reader.cancel(); } catch (e) { /* gone */ }
      }
      try { await this.loop; } catch (e) { /* ignore */ }
      try { await this.port.close(); } catch (e) { /* already closed */ }
    }
  }

  // ---------- requests: one command at a time, each waits for its answer ----------
  const isSt = function (o) { return !!o && o.t === 'st'; };
  const isOk = function (o) { return !!o && o.t === 'ok'; };
  const CMDS = {
    j: { test: isSt, ms: 1500 },
    b: { test: isSt, ms: 5000 },
    t: { test: function (o) { return !!o && o.t === 'bus'; }, ms: 12000 },
    e: { test: function (o) { return !!o && o.t === 'ee'; }, ms: 3000 },
    c: { test: isOk, ms: 2000 },
    r: { test: function (o, line) { return line.trim() === '=== end ==='; }, ms: 4000 }
  };
  function cmdSpec(cmd) {
    if (CMDS[cmd]) return CMDS[cmd];
    if (/^m?[0-4]$/.test(cmd)) return { test: isOk, ms: 5000 };
    return null;
  }
  function request(cmd, spec) {
    spec = spec || cmdSpec(cmd) || { test: function () { return false; }, ms: 300 };
    return new Promise(function (resolve) {
      S.queue.push({ cmd: cmd, test: spec.test, ms: spec.ms, resolve: resolve });
      pump();
    });
  }
  function pump() {
    if (S.pending || !S.queue.length || !S.link || Date.now() < S.pausedUntil) return;
    const r = S.queue.shift();
    S.pending = r;
    r.timer = setTimeout(function () { finish(r, null); }, r.ms);
    if (r.cmd !== 'j' || F.showjson.checked) log('> ' + r.cmd);
    S.link.write(r.cmd).catch(function (e) {
      log('(could not send: ' + e.message + ')');
      finish(r, null);
    });
  }
  function finish(r, value) {
    if (S.pending !== r) return;
    clearTimeout(r.timer);
    S.pending = null;
    r.resolve(value);
    setTimeout(pump, 0);
  }
  function flushRequests() {
    const all = S.queue.splice(0);
    if (S.pending) {
      clearTimeout(S.pending.timer);
      all.push(S.pending);
      S.pending = null;
    }
    all.forEach(function (r) { r.resolve(null); });
  }

  // ---------- incoming lines ----------
  function onLine(raw) {
    const line = raw.replace(/\r/g, '');
    S.rxLines++;
    let obj = null;
    const j = line.indexOf('{"t":');  // tolerate junk in front (after the LED 4+5 test)
    if (j >= 0) {
      try { obj = JSON.parse(line.slice(j)); } catch (e) { obj = null; }
    }
    if (!(obj && obj.t === 'st') || F.showjson.checked) log(line);

    if (line.indexOf('=== A-RYTH-MATIK DEBUG') >= 0) S.reportBuf = [];
    if (S.reportBuf) {
      S.reportBuf.push(line);
      if (line.trim() === '=== end ===') {
        S.report = S.reportBuf;
        S.reportBuf = null;
        S.reportWaiters.splice(0).forEach(function (w) { w(); });
      } else if (S.reportBuf.length > 60) {
        S.reportBuf = null;
      }
    } else if (!obj && /^(Free RAM:|Millis:|Display found at address|SSD1306 allocation failed)/.test(line)) {
      S.oldFw = true;  // DEBUG firmware 1.x prints these lines
    }

    if (obj) handleJson(obj);
    if (S.pending && S.pending.test(obj, line)) finish(S.pending, obj || line);
  }

  function handleJson(o) {
    if (o.t === 'st') {
      trackStatus(o);
      const first = !S.st;
      S.st = o;
      S.stAt = Date.now();
      S.missed = 0;
      if (S.state === 'noanswer' || (S.state === 'live' && first)) setState('live');  // (shows chip + version)
      render();
    } else if (o.t === 'bus') {
      S.bus = o;
      renderSpeed();
    } else if (o.t === 'ee') {
      if (S.st) S.st.ee_test = o.ok ? 1 : 2;
      render();
    }
  }

  function trackStatus(o) {
    const now = Date.now();
    if (o.uptime_ms < S.lastUptime) {
      log('(the module restarted)');
      S.lastTimeouts = null;
    }
    S.lastUptime = o.uptime_ms;
    if (S.lastTimeouts !== null && o.i2c_timeouts > S.lastTimeouts && !S.speedRunning) S.timeoutRiseAt = now;
    S.lastTimeouts = o.i2c_timeouts;
    ['clk', 'rst'].forEach(function (k) {  // input stuck high with no new pulses?
      const x = o[k];
      if (!x || !x.level) S.high[k] = null;
      else if (!S.high[k] || S.high[k].count !== x.count) S.high[k] = { since: now, count: x.count };
    });
  }

  // ---------- connection ----------
  const STATE_TEXT = {
    idle: 'Not connected.',
    connecting: 'Choose the module’s USB port in the browser window…',
    starting: 'Connected. The module restarts – waiting for its report…',
    live: 'Live – values update twice a second.',
    noanswer: 'Connected, but the module does not answer.',
    paused: 'LED 4+5 test: USB is paused on the module…',
    lost: 'Connection lost. Plug the cable back in (the page reconnects by itself) or press Connect.'
  };

  function setState(state, text) {
    S.state = state;
    let t = text || STATE_TEXT[state];
    if (state === 'live' && S.st) t = 'Live – ' + S.st.chip + ', DEBUG ' + S.st.fw + '. Values update twice a second.';
    if (MOCK && S.link) t = '[demo] ' + t;
    F.state.textContent = t;
    F.state.classList.toggle('hwt-live', state === 'live');
    root.classList.toggle('hwt-stale', state !== 'live');
    updateButtons();
    renderHints();
  }

  function waitReport(timeout) {
    return new Promise(function (resolve) {
      let done = false;
      const w = function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(true);
      };
      const timer = setTimeout(function () {
        done = true;
        const i = S.reportWaiters.indexOf(w);
        if (i >= 0) S.reportWaiters.splice(i, 1);
        resolve(false);
      }, timeout);
      S.reportWaiters.push(w);
    });
  }

  function openError(e) {
    if (e && e.name === 'NetworkError') {
      return 'The port could not be opened. Is another program using it (Arduino IDE serial monitor, the firmware uploader, another browser tab)? Close it and try again.';
    }
    if (e && e.name === 'InvalidStateError') return 'This port is already open in another tab or program.';
    return 'Could not open the port: ' + (e && e.message ? e.message : e);
  }

  function attach(link) {
    S.link = link;
    S.lastPort = link.port || null;
    link.onLine = onLine;
    link.onEvent = onLinkEvent;
    S.st = null;
    S.stAt = 0;
    S.report = [];
    S.reportBuf = null;
    S.bus = null;
    S.missed = 0;
    S.rxLines = 0;
    S.oldFw = false;
    S.lastTimeouts = null;
    S.timeoutRiseAt = 0;
    S.lastUptime = 0;
    S.pausedUntil = 0;
    S.high = { clk: null, rst: null };
    render();
  }

  async function connect(port) {
    S.userClosed = false;
    const link = MOCK ? new MockLink(MOCK) : new SerialLink(port);
    setState('connecting', port ? 'Reconnecting…' : null);
    try {
      if (port) await sleep(500);
      await link.open();
    } catch (e) {
      if (port) setState('lost');
      else if (e && e.name === 'NotFoundError') setState('idle');  // chooser closed without a port
      else setState('idle', openError(e));
      return;
    }
    log('(connected)');
    attach(link);
    setState('starting');
    let ok = await waitReport(BOOT_WAIT_MS);
    if (S.link !== link) return;
    if (!ok) ok = !!(await request('r'));  // no reset on open? ask for the report
    if (S.link !== link) return;
    S.pollAt = 0;
    setState(ok ? 'live' : 'noanswer');
  }

  async function disconnect() {
    S.userClosed = true;
    const link = S.link;
    S.link = null;
    flushRequests();
    if (link) await link.close();
    log('(disconnected)');
    setState('idle');
  }

  function onLinkEvent(type, e) {
    if (type === 'readerror') {
      if (Date.now() - S.errLogAt > 3000) log('(serial read error: ' + (e && e.name ? e.name : e) + ' – continuing)');
      S.errLogAt = Date.now();
    } else if (type === 'lost' && S.link) {
      const link = S.link;
      S.link = null;
      flushRequests();
      link.close();
      log('(connection lost)');
      setState('lost');
    }
  }

  if ('serial' in navigator) {
    navigator.serial.addEventListener('disconnect', function (ev) {
      if (S.link && S.link.port === ev.target) onLinkEvent('lost');
    });
    navigator.serial.addEventListener('connect', function (ev) {
      if (S.state === 'lost' && !S.userClosed) connect(ev.target);  // same permission, plugged back in
    });
  }

  // ---------- polling ----------
  function tick() {
    const now = Date.now();
    if (!S.link) return;
    if (S.state === 'paused') {
      const left = Math.ceil((S.pausedUntil - now) / 1000);
      if (left > 0) {
        F.state.textContent = (MOCK ? '[demo] ' : '') + 'LED 4+5 test: USB is paused on the module, back in ' + left + ' s…';
        return;
      }
      if (S.link.clearBuffer) S.link.clearBuffer();
      S.missed = 0;
      S.stAt = now;
      setState('live');
    }
    if ((S.state === 'live' || S.state === 'noanswer') && !S.pending && !S.queue.length &&
        now - S.pollAt >= (S.state === 'live' ? POLL_MS : 1000)) {
      S.pollAt = now;
      request('j').then(function (o) {
        if (o || !S.link || (S.state !== 'live' && S.state !== 'noanswer')) return;
        if (++S.missed >= 4) setState('noanswer');
      });
    }
    root.classList.toggle('hwt-stale', S.state !== 'live' || now - S.stAt > 2500);
    pump();
  }
  setInterval(tick, 200);

  // ---------- commands from the buttons ----------
  async function runCmd(cmd) {
    if (!S.link || S.state !== 'live') return;
    if (cmd === 'm3') {
      await request('m3');  // answer {"t":"ok","note":"serial pauses 10 s"}, then serial goes off
      if (!S.link) return;
      S.pausedUntil = Date.now() + LED45_PAUSE_MS;
      setState('paused');
      return;
    }
    if (cmd === 't') {
      S.speedRunning = true;
      S.busBefore = S.st ? S.st.i2c_timeouts : 0;
      setText('speed', 'Speed test running – watch the module screen (about 4 s)…');
      updateButtons();
      const res = await request('t');
      S.speedRunning = false;
      updateButtons();
      if (!res) setText('speed', 'Speed test: no answer from the module.', 'warn');
      return;
    }
    const res = await request(cmd);
    if (cmd === 'e' && !res) log('(EEPROM test: no answer)');
    S.pollAt = 0;  // fresh status right away
  }

  function updateButtons() {
    const live = !!S.link && S.state === 'live' && !S.speedRunning;
    root.querySelectorAll('[data-cmd]').forEach(function (b) { b.disabled = !live; });
    const c = root.querySelector('[data-act="connect"]');
    const connected = !!S.link || S.state === 'connecting';
    c.textContent = S.state === 'connecting' ? 'Connecting…' : connected ? 'Disconnect' : 'Connect';
    c.classList.toggle('hwt-primary', !connected);
    c.disabled = S.state === 'connecting' || (!MOCK && !('serial' in navigator));
    root.querySelector('[data-act="copy"]').disabled = !(S.st || S.report.length || S.link);
    F.sendtext.disabled = F.sendbtn.disabled = !S.link || S.state === 'paused' || S.state === 'starting';
  }

  // ---------- rendering ----------
  function render() {
    const s = S.st;
    updateButtons();
    if (!s) {
      root.querySelectorAll('.hwt-grid dd, .hwt-grid td').forEach(function (el) {
        el.textContent = '–';
        el.className = '';
      });
      renderHints();
      return;
    }
    const tol = s.vref === 'lgt' ? '±1 %' : '±10 %';
    setText('chip', s.chip + ' · ' + s.mhz + ' MHz' + (s.id && s.id !== '0' ? ' · id ' + s.id : ''));
    setText('fw', 'DEBUG ' + s.fw, /^2\./.test(String(s.fw)) ? null : 'warn');
    setText('vcc', volts(s.vcc) + ' (' + tol + ')', s.vcc < 4000 || s.vcc > 5300 ? 'bad' : s.vcc < 4600 ? null : 'ok');
    setText('vccnote', (s.vref === 'lgt'
      ? 'LGT8F boards measure VCC with a calibrated reference (about ±1 %). '
      : 'Nano boards measure VCC against an internal reference that varies by up to ±10 % between chips. ') +
      'USB power only: 4.2–4.7 V is normal. In the rack: 4.75–5.25 V.');
    setText('ram', s.ram + ' bytes', s.ram < 60 ? 'warn' : 'ok');
    setText('reset', RESET_TEXT[s.reset] || s.reset);
    setText('ee', s.ee_size + ' bytes · ' + (['test not run', 'test ok', 'TEST FAILED'][s.ee_test] || '?'),
      s.ee_test === 1 ? 'ok' : s.ee_test === 2 ? 'bad' : null);
    setText('uptime', fmtDuration(s.uptime_ms));

    const noPower = s.sda < 300 && s.scl < 300;
    const busBad = s.sda < 2500 || s.scl < 2500;
    setText('oled', s.oled ? 'found at 0x3C' : 'NOT FOUND', s.oled ? 'ok' : 'bad');
    setText('bus', volts(s.sda) + ' / ' + volts(s.scl), busBad ? 'bad' : Math.abs(s.sda - s.scl) > 300 ? 'warn' : 'ok');
    setText('pullups', s.pullups ? 'ok' : noPower ? 'no voltage' : 'missing / line held low', s.pullups ? 'ok' : 'bad');
    setText('devs', s.devs && s.devs.length ? s.devs.map(hex).join(' ') : 'none', s.devs && s.devs.indexOf(60) >= 0 ? 'ok' : 'bad');
    setText('frame', s.oled ? ms(s.draw_us + s.send_us) + ' (draw ' + ms(s.draw_us) + ', send ' + ms(s.send_us) + ')' : '–');
    const rising = Date.now() - S.timeoutRiseAt < 15000;
    setText('timeouts', String(s.i2c_timeouts) + (rising ? ' (counting up)' : ''), rising ? 'warn' : s.i2c_timeouts ? null : 'ok');
    setText('reinits', String(s.oled_reinits), s.oled_reinits ? null : 'ok');

    renderInput('clk', s.clk);
    renderInput('rst', s.rst);
    const c = s.clk;
    setText('bpm', c && c.count > 1 && c.age_ms < 2000 && c.period_us > 0 ? (15e6 / c.period_us).toFixed(1) : 'no clock');
    setText('enc', String(s.enc));
    setText('button', s.button ? 'PRESSED' : 'released', s.button ? 'ok' : null);

    root.querySelectorAll('.hwt-pages [data-cmd]').forEach(function (b) {
      b.classList.toggle('hwt-on', b.dataset.cmd === String(s.page));
    });
    root.querySelectorAll('.hwt-modes [data-cmd]').forEach(function (b) {
      b.classList.toggle('hwt-on', s.page === 3 && b.dataset.cmd === 'm' + s.mode);
    });
    setText('outstate', s.page === 3
      ? 'Running: ' + MODE_NAMES[s.mode] + '. Check that every output jack and LED reacts.'
      : 'Outputs are idle: they run only on the OUTPUTS screen (the module shows ' + (PAGE_NAMES[s.page] || '?') + '). Pick a mode to start.');

    const L = s.loop || { active: 0, sent: 0, clk: [0, 0, 0, 0, 0, 0], rst: [0, 0, 0, 0, 0, 0], delay_us: null, width_us: null };
    [L.clk, L.rst].forEach(function (row, i) {
      row.forEach(function (n, o) {
        const el = F['l' + i + '-' + o];
        el.textContent = n ? String(n) : '·';
        el.className = n ? 'hwt-hit' : '';
      });
    });
    setText('loopstate', L.active ? 'Running – ' + L.sent + ' pulses sent.' : 'Not running. Press Start (or turn the module to LOOP).', L.active ? 'ok' : null);
    setText('ldelay', L.delay_us ? L.delay_us[0] + '–' + L.delay_us[1] + ' µs' : 'no pulse arrived yet',
      L.delay_us ? (L.delay_us[1] > 200 ? 'warn' : 'ok') : null);
    setText('lwidth', L.width_us ? (L.width_us[0] / 1000).toFixed(2) + '–' + (L.width_us[1] / 1000).toFixed(2) + ' ms' : '–',
      L.width_us ? (L.width_us[0] < 4000 || L.width_us[1] > 6000 ? 'warn' : 'ok') : null);
    renderHints();
  }

  function renderInput(k, x) {
    if (!x) return;
    const el = F[k + '-level'];
    el.textContent = '';
    const dot = document.createElement('span');
    dot.className = 'hwt-dot' + (x.level ? ' hwt-high' : '');
    el.appendChild(dot);
    el.appendChild(document.createTextNode(x.level ? 'HIGH' : 'low'));
    setText(k + '-count', String(x.count));
    setText(k + '-width', x.count && x.width_us ? ms(x.width_us) : '–');
    setText(k + '-age', !x.count ? 'none yet' : x.age_ms < 1000 ? 'just now' : fmtDuration(x.age_ms) + ' ago');
  }

  function renderSpeed() {
    const b = S.bus;
    if (!b) return;
    if (!b.oled) {
      setText('speed', 'Speed test skipped: no display found.', 'bad');
      return;
    }
    const more = b.i2c_timeouts > S.busBefore;
    setText('speed', 'Speed test – one picture took: 400 kHz ' + ms(b.k400_us) + ' · 800 kHz ' + ms(b.k800_us) +
      ' · 1 MHz ' + ms(b.k1000_us) + '. Was the picture clean at each speed? A clean picture at 400 kHz is what the regular firmwares need.' +
      (more ? ' The display bus timed out during the test.' : ''), more ? 'warn' : null);
  }

  // ---------- automatic hints ----------
  function computeHints() {
    const H = [];
    function add(lvl, text, link) { H.push({ lvl: lvl, text: text, link: link }); }
    const s = S.st;
    const flash = GUIDE ? { href: GUIDE + '#1-flash-the-debug-firmware', label: 'How to flash it' } : null;
    if (S.state === 'noanswer') {
      if (s) add('warn', 'The module stopped answering. If you started the LED 4+5 test on the module itself, USB is paused for 10 seconds.');
      else if (S.oldFw) add('bad', 'The module runs the old DEBUG firmware (version 1). This page needs version 2: flash the latest DEBUG firmware, then connect again.', flash);
      else if (S.rxLines > 0) add('warn', 'The module sends messages, but not from the DEBUG firmware 2. Another firmware is probably running: flash the DEBUG firmware, then connect again.', flash);
      else add('warn', 'No answer from the module. Is the DEBUG firmware flashed? Is it the right port? Close other programs that use the port (Arduino IDE, the uploader, other tabs). Some USB cables only charge – try another one.', flash);
    } else if (S.state === 'starting') {
      add('info', 'Waiting for the module’s start-up report (2–3 seconds, a little longer on LGT8F boards).');
    } else if (S.state === 'lost') {
      add('warn', 'The USB connection was lost. Plug the cable back in; the page reconnects by itself.');
    } else if (!s) {
      add('info', 'Connect the module to see the results here.');
    } else if (S.state === 'idle') {
      add('info', 'Not connected – these are the last values received.');
    }
    if (!s) return H;
    const tol = s.vref === 'bandgap' ? ' (Nano boards measure about ±10 %.)' : '';
    const noPower = s.sda < 300 && s.scl < 300;
    if (!/^2\./.test(String(s.fw))) add('warn', 'This page is made for DEBUG firmware 2.x, the module reports ' + s.fw + '.');
    if (!s.oled) {
      add('bad', noPower
        ? 'Display not found and there is no voltage on its data lines (SDA/SCL). The display board gets no power or is not connected: check its 4-pin connection and solder joints.'
        : 'Display not found (no answer at address 0x3C). Check that the display board sits well and its pins are soldered. While no display is found, the CLK LED blinks 3 times every 2 seconds.');
    }
    if (!noPower && (s.sda < 2500 || s.scl < 2500)) {
      add('bad', 'Display supply too low: SDA ' + volts(s.sda) + ', SCL ' + volts(s.scl) + ' (about 3.3 V is normal). The display board is not properly powered or is damaged – this gives a black or noisy screen.' + tol);
    } else if (!noPower && Math.abs(s.sda - s.scl) > 300) {
      add('warn', 'SDA and SCL differ (' + volts(s.sda) + ' / ' + volts(s.scl) + '). Both lines should show about the same voltage: look for a bad contact or a damaged display board.');
    }
    if (!s.pullups && !noPower) add('bad', 'A display line has no pull-up or is held low. Check the display board and look for solder bridges on the SDA/SCL pins (A4/A5).');
    if (Date.now() - S.timeoutRiseAt < 15000) {
      add('warn', 'The display connection is unstable: bus timeouts are counting up (' + s.i2c_timeouts + ' so far). Usually a weak display supply or a loose contact.');
    } else if (s.i2c_timeouts > 0 || s.oled_reinits > 0) {
      add('info', s.i2c_timeouts + ' display bus timeout(s) and ' + s.oled_reinits + ' display restart(s) since the module started. The firmware recovered by itself; if the numbers keep growing, check the display connection.');
    }
    if (s.vcc < 4000) add('bad', 'Supply voltage very low: ' + volts(s.vcc) + '. The display and outputs may misbehave. On USB try another port or cable; in the rack check the power cable.' + tol);
    else if (s.vcc < 4600) add('info', 'Supply ' + volts(s.vcc) + ': normal when the module runs from USB only (the board drops some voltage). In the rack it should be 4.75–5.25 V.' + tol);
    else if (s.vcc > 5300) add('warn', 'Supply voltage high: ' + volts(s.vcc) + '. Check the 5 V supply.' + tol);
    if (s.ram < 60) add('warn', 'Free RAM is low (' + s.ram + ' bytes).');
    if (s.ee_test === 2) add('bad', 'EEPROM test failed: the module may not be able to save settings.');
    if (s.oled && s.send_us > 100000) add('warn', 'Sending a picture to the display is slow (' + ms(s.send_us) + '). Check the display connection.');
    ['clk', 'rst'].forEach(function (k) {
      const h = S.high[k];
      if (h && Date.now() - h.since > 3000) add('info', k.toUpperCase() + ' input reads HIGH all the time. Fine if a cable with a steady high signal is patched; with nothing patched it should read low.');
    });
    const L = s.loop;
    if (L && L.active) {
      if (!sum(L.clk) && !sum(L.rst) && L.sent > 30) add('info', 'Loopback test running: patch a cable from any output into CLK or RST.');
      if (L.delay_us && L.delay_us[1] > 200) add('warn', 'Loopback: slow pulse edges (delay up to ' + L.delay_us[1] + ' µs, normal is 10–50 µs).');
      if (L.width_us && (L.width_us[0] < 4000 || L.width_us[1] > 6000)) add('warn', 'Loopback: pulse width ' + (L.width_us[0] / 1000).toFixed(2) + '–' + (L.width_us[1] / 1000).toFixed(2) + ' ms, about 5 ms is normal. Check the output and input circuits.');
    }
    if (S.state === 'live' && !H.some(function (h) { return h.lvl === 'bad' || h.lvl === 'warn'; })) {
      add('ok', 'No problems found by the automatic checks. Now try the inputs, encoder, button, outputs and the loopback test below.');
    }
    const order = { bad: 0, warn: 1, ok: 2, info: 3 };
    return H.sort(function (a, b) { return order[a.lvl] - order[b.lvl]; });
  }

  function renderHints() {
    const ul = F.hints;
    ul.textContent = '';
    computeHints().forEach(function (h) {
      const li = document.createElement('li');
      li.className = h.lvl;
      const b = document.createElement('strong');
      b.textContent = LABEL[h.lvl];
      li.appendChild(b);
      li.appendChild(document.createTextNode(h.text));
      if (h.link) {
        li.appendChild(document.createTextNode(' '));
        const a = document.createElement('a');
        a.href = h.link.href;
        a.textContent = h.link.label;
        li.appendChild(a);
      }
      ul.appendChild(li);
    });
  }

  // ---------- report for support ----------
  function buildReport() {
    const out = [];
    const now = new Date();
    out.push('A-RYTH-MATIK hardware test report');
    out.push('created  ' + now.toLocaleString() + ' (' + now.toISOString() + ')');
    out.push('page     ' + location.origin + location.pathname + (MOCK ? '  DEMO MODE - simulated values, not a real module' : ''));
    out.push('browser  ' + navigator.userAgent);
    out.push('');
    out.push('--- automatic checks ---');
    computeHints().forEach(function (h) { out.push('[' + LABEL[h.lvl] + '] ' + h.text); });
    out.push('');
    out.push('--- module report ---');
    const rep = S.report.slice();
    while (rep.length && !rep[0].trim()) rep.shift();
    out.push(rep.length ? rep.join('\n') : '(no report received)');
    if (S.bus) {
      out.push('');
      out.push('--- display speed test ---');
      out.push(JSON.stringify(S.bus));
    }
    out.push('');
    out.push('--- latest status ---');
    out.push(S.st ? JSON.stringify(S.st) : '(no status received)');
    return out.join('\n') + '\n';
  }

  async function copyReport(btn) {
    btn.disabled = true;
    F.copied.hidden = false;
    F.copied.textContent = 'Collecting the report…';
    if (S.link && S.state === 'live') {
      await request('r');
      await request('j');
    }
    const text = buildReport();
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (e) { /* blocked: offer the download */ }
    if (S.dlUrl) URL.revokeObjectURL(S.dlUrl);
    S.dlUrl = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = S.dlUrl;
    a.download = 'arythmatik-test-' + new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-') + '.txt';
    a.textContent = 'download it as a .txt file';
    F.copied.textContent = copied
      ? 'Report copied – paste it into your e-mail or support request. You can also '
      : 'The browser did not allow copying. Please ';
    F.copied.appendChild(a);
    F.copied.appendChild(document.createTextNode('.'));
    updateButtons();
  }

  // ---------- wiring ----------
  root.addEventListener('click', function (ev) {
    const b = ev.target.closest('button');
    if (!b || !root.contains(b) || b.disabled) return;
    if (b.dataset.cmd) runCmd(b.dataset.cmd);
    else if (b.dataset.act === 'connect') {
      if (S.link) disconnect();
      else connect();
    } else if (b.dataset.act === 'copy') copyReport(b);
  });
  F.sendform.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const text = F.sendtext.value.trim();
    if (!text || !S.link) return;
    F.sendtext.value = '';
    if (cmdSpec(text) && S.state === 'live') runCmd(text);
    else request(text, { test: function () { return false; }, ms: 300 });
  });
  F.showjson.addEventListener('change', flushLog);

  if (MOCK) F.mockinfo.hidden = false;
  else if (!('serial' in navigator)) F.unsupported.hidden = false;
  setState('idle');
  render();

  // =====================================================================================
  // Simulated module for ?mock=1 / ?mock=bad: answers like the DEBUG firmware 2.0.
  // =====================================================================================
  class MockLink {
    constructor(kind) {
      this.bad = kind === 'bad';
      this.port = null;
    }
    async open() {
      await sleep(400);
      this.m = {
        t0: Date.now(), page: 0, mode: 0, modeNext: false, ee: 0, to: 0, re: 0, enc: 0,
        offUntil: 0, busyUntil: 0, loopAt: 0, junk: '', bus: [0, 0, 0],
        clk: { count: 0, t: 0, period: 0, next: 0 }, rst: { count: 0, t: 0, period: 0 }, loop: null, buttonUntil: 0
      };
      this.clearLoop();
      this.timer = setInterval(this.tick.bind(this), 25);
      setTimeout(this.emitReport.bind(this), 2200);  // reset + bootloader + splash screen
    }
    async close() { clearInterval(this.timer); this.closed = true; }
    clearBuffer() {}
    async write(text) {
      for (const c of text) {
        await sleep(2);
        if (Date.now() >= this.m.offUntil) this.command(c);  // RX is an LED pin during the LED 4+5 test
      }
    }
    emit(line) {
      if (this.closed || Date.now() < this.m.offUntil) return;
      const l = this.m.junk + line;
      this.m.junk = '';
      setTimeout(() => { if (!this.closed && this.onLine) this.onLine(l); }, 1);
    }
    clearLoop() { this.m.loop = { sent: 0, clk: [0, 0, 0, 0, 0, 0], rst: [0, 0, 0, 0, 0, 0], d: null, w: null }; }
    enterPage(p) {
      this.m.page = p;
      if (p === 4) this.clearLoop();
    }
    command(c) {
      const m = this.m;
      if (Date.now() < m.busyUntil) {  // the speed test blocks the firmware's loop
        setTimeout(() => this.command(c), m.busyUntil - Date.now() + 5);
        return;
      }
      if (m.modeNext) {
        m.modeNext = false;
        if (c >= '0' && c <= '4') {
          if (m.page !== 3) this.enterPage(3);
          m.mode = +c;
          if (m.mode === 3) {
            this.emit('{"t":"ok","note":"serial pauses 10 s"}');
            m.offUntil = Date.now() + 10000;
            m.junk = '\u0000��';
            setTimeout(() => { if (this.onEvent) this.onEvent('readerror', { name: 'FramingError' }); }, 1500);
            setTimeout(() => { m.mode = 0; }, 10000);
          } else {
            this.emit('{"t":"ok"}');
          }
          return;
        }
      }
      switch (c) {
        case 'r': case '?': case 'h': this.emitReport(); break;
        case 'j': case 'b': this.emit(this.status()); break;
        case 't':
          m.busyUntil = Date.now() + 3900;
          setTimeout(() => {
            m.bus = [26800 + this.rnd(300), 15400 + this.rnd(300), 13100 + this.rnd(300)];
            if (this.bad) m.to += 2;
            this.emit(JSON.stringify({ t: 'bus', oled: 1, k400_us: m.bus[0], k800_us: m.bus[1], k1000_us: m.bus[2], i2c_timeouts: m.to }));
          }, 3900);
          break;
        case 'e':
          m.ee = this.bad ? 2 : 1;
          this.emit('{"t":"ee","ok":' + (this.bad ? 0 : 1) + '}');
          break;
        case 'c':
          m.clk.count = m.rst.count = 0;
          m.enc = 0;
          this.clearLoop();
          this.emit('{"t":"ok"}');
          break;
        case 'm': m.modeNext = true; break;
        default:
          if (c >= '0' && c <= '4') {
            this.enterPage(+c);
            this.emit('{"t":"ok"}');
          }
      }
    }
    rnd(n) { return Math.round((Math.random() - 0.5) * 2 * n); }
    tick() {
      const m = this.m;
      const now = Date.now();
      const up = now - m.t0;
      if (up > 4000 && now >= m.clk.next) {  // 120 BPM clock (16th notes) on CLK
        m.clk.next = Math.max(m.clk.next + 125, now);
        if (m.clk.t) m.clk.period = 125000 + this.rnd(40);
        m.clk.t = now;
        m.clk.count++;
        if (m.clk.count % 16 === 1) {  // and a reset pulse every bar on RST
          if (m.rst.t) m.rst.period = (now - m.rst.t) * 1000;
          m.rst.t = now;
          m.rst.count++;
        }
      }
      if (m.page === 2 && Math.random() < 0.01) m.enc += Math.random() < 0.6 ? 1 : -1;
      if (Math.random() < 0.003) m.buttonUntil = now + 400;
      if (this.bad && Math.random() < 0.006) { m.to++; m.re++; }
      if (m.page === 4 && now >= m.loopAt) {  // loopback: OUT1..OUT6 every 50 ms, a cable from OUT3 to CLK
        const L = m.loop;
        m.loopAt = now + 50;
        L.sent++;
        if (L.sent % 6 === 3) {
          L.clk[2]++;
          const d = 14 + this.rnd(4), w = 5000 + this.rnd(15);
          L.d = L.d ? [Math.min(L.d[0], d), Math.max(L.d[1], d)] : [d, d];
          L.w = L.w ? [Math.min(L.w[0], w), Math.max(L.w[1], w)] : [w, w];
        }
      }
    }
    input(x, width) {
      const now = Date.now();
      return { level: x.count && now - x.t < width / 1000 ? 1 : 0, count: x.count, period_us: x.period, width_us: x.count ? width : 0, age_ms: x.count ? now - x.t : 0 };
    }
    values() {
      const m = this.m;
      const L = m.loop;
      return {
        t: 'st', fw: '2.0',
        chip: this.bad ? 'LGT8F328P' : 'ATmega328P', mhz: 16, id: this.bad ? '1A2B3C4D' : '0',
        reset: 'reset-pin',
        vcc: (this.bad ? 4230 : 4710) + this.rnd(8), vref: this.bad ? 'lgt' : 'bandgap',
        ram: this.bad ? 52 : 94, ee_size: 1024, ee_test: m.ee,
        sda: this.bad ? 2050 + this.rnd(350) : 3290 + this.rnd(6), scl: this.bad ? 1900 + this.rnd(350) : 3301 + this.rnd(6),
        pullups: 1, oled: 1, devs: [60], i2c_timeouts: m.to, oled_reinits: m.re,
        draw_us: 23000 + this.rnd(4000), send_us: 38000 + this.rnd(600),
        clk: this.input(m.clk, 10000), rst: this.input(m.rst, 10000),
        enc: m.enc, button: Date.now() < m.buttonUntil ? 1 : 0, page: m.page, mode: m.mode,
        uptime_ms: Date.now() - m.t0,
        loop: { active: m.page === 4 ? 1 : 0, sent: L.sent, clk: L.clk, rst: L.rst, delay_us: L.d, width_us: L.w }
      };
    }
    status() { return JSON.stringify(this.values()); }
    emitReport() {
      const v = this.values();
      const f1 = (us) => (us / 1000).toFixed(1);
      const lines = [
        '',
        '=== A-RYTH-MATIK DEBUG 2.0 ===',
        'chip      ' + v.chip + '  16 MHz' + (v.id !== '0' ? '  id ' + v.id : ''),
        'reset     ' + v.reset,
        'VCC       ' + (v.vcc / 1000).toFixed(2) + 'V' + (v.vref === 'lgt' ? '  (LGT internal reference, ~1 %)' : '  (ATmega bandgap, +-10 %)'),
        'RAM free  ' + v.ram + ' bytes never used so far',
        'EEPROM    1024 bytes' + (v.ee_test === 1 ? ', test ok' : v.ee_test === 2 ? ', TEST FAILED' : ', test: send e'),
        'I2C idle  SDA ' + (v.sda / 1000).toFixed(2) + 'V  SCL ' + (v.scl / 1000).toFixed(2) + 'V  pull-ups ok',
        'I2C devs  0x3C   timeouts ' + v.i2c_timeouts + '  OLED re-inits ' + v.oled_reinits,
        'OLED      ok, frame ' + f1(v.draw_us + v.send_us) + ' ms (draw ' + f1(v.draw_us) + ' + send ' + f1(v.send_us) + ' ms at 400 kHz)'
      ];
      if (this.m.bus[0]) lines.push('bus test  frame send ms 400k ' + f1(this.m.bus[0]) + '  800k ' + f1(this.m.bus[1]) + '  1M ' + f1(this.m.bus[2]));
      lines.push('inputs    CLK ' + (v.clk.level ? 'high' : 'low') + ' n=' + v.clk.count + '  RST ' + (v.rst.level ? 'high' : 'low') + ' n=' + v.rst.count +
        '  encoder ' + v.enc + '  button ' + (v.button ? 'down' : 'up'));
      lines.push('commands  r report  j json  b bus check  t bus speed test  e EEPROM test');
      lines.push('          c clear  0-4 page  m0-m4 output mode (m3 pauses serial 10 s)');
      lines.push('=== end ===');
      lines.forEach((l) => this.emit(l));
    }
  }
})();
