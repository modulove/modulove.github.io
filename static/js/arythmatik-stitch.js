/*
 * A-RYTH-MATIK Stitch pattern editor for the Stitch sequencer firmware (Web Serial: Chrome / Edge).
 * Markup and styles: layouts/shortcodes/arythmatik_stitch_editor.html. Nothing leaves the browser.
 *
 * Protocol (source of truth: serialPoll() in Firmware/ARYTHMATIK_Stitch/ARYTHMATIK_Stitch.ino
 * in modulove/A-RYTH-MATIK): USB serial 115200 8N1, one command per line ending in "\n".
 * Opening the port resets the module (Nano auto-reset); bootloader + start take a few seconds,
 * Stitch prints nothing at start. Unknown commands get no answer.
 *   P?            -> P=hhhh,hhhh,hhhh,hhhh,hhhh,hhhh   CH1..CH6, bit 15 = step 1
 *   P=hhhh,...    -> OK (pattern set and saved in EEPROM) | ERR
 *   C?            -> C=bpm,clk,mode,style,fill,rep,sw,enc,oled,rst,fper,out
 *   B60..240 K0/1 M0/1 S0..4 F0/1 R0..4 W0..4 T0..2 E0/1 O0/1 N0..3  -> OK
 *                    (saved by the module: 2 s after the last change, E/O/N at once)
 *   G / U         -> OK  generate / mutate the playing pattern (not saved)
 *   X RST action · Q factory settings · D0/D1 debug -> OK
 * The fill period (fper, F-EV on the module) has no command: shown read-only.
 * While the secret menu is open the module does not read the serial port.
 *
 * Demo without hardware: add ?mock=1 to the page URL.
 */
(function () {
  'use strict';

  const root = document.getElementById('stx');
  if (!root) return;

  const BOOT_WAIT_MS = 2500;  // port opened -> module reset -> bootloader -> Stitch running
  const BOOT_TRIES = 6;       // then ask for the settings up to 6 times (1.2 s each)
  const MOCK = new URLSearchParams(location.search).get('mock');
  const FLASH = root.dataset.flash || '';
  const LABEL = { bad: 'Problem', warn: 'Check', info: 'Note', ok: 'OK' };
  const CH = ['CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6'];
  const FPER = [1, 2, 4, 8, 16];
  const CFG_KEYS = ['bpm', 'clk', 'mode', 'style', 'fill', 'rep', 'sw', 'enc', 'oled', 'rst', 'fper', 'out'];
  const CFG_CMD = { bpm: 'B', clk: 'K', mode: 'M', style: 'S', fill: 'F', rep: 'R', sw: 'W', out: 'T', enc: 'E', oled: 'O', rst: 'N' };
  const AUTO_ONLY = ['style', 'fill', 'fper', 'rep', 'sw'];
  const SUPERSEDED = { superseded: true };

  // Generated from the firmware's AUTO banks bnk1_ptn..bnk4_ptn (BASE = words 0..5, FILL = 6..11),
  // in the firmware's order. CH1..CH6.
  const PRESETS = [
    ['Tech', [
      ['Tech 1', ['8888', '0808', 'DDDD', '2222', '1000', '0022']],
      ['Tech 1 fill', ['8888', '88AF', 'DDDD', '2222', '1000', '0022']],
      ['Tech 2', ['8888', '0808', 'FFFF', '2222', '1000', '0022']],
      ['Tech 2 fill', ['8888', '88AF', 'FFFF', '2222', '1000', '0022']],
      ['Tech 3', ['8888', '0808', 'CCCC', '2222', '1000', '0022']],
      ['Tech 3 fill', ['8888', '88AF', 'CCCC', '2222', '1000', '0022']],
      ['Tech 4', ['8888', '0808', '4545', '2222', '1000', '0022']],
      ['Tech 4 fill', ['88AF', '0808', '4545', '2222', '1000', '0022']],
      ['Tech 5', ['8888', '0808', 'FFFF', '2222', '1000', '0022']],
      ['Tech 5 fill', ['88AF', '0808', 'FFFF', '2222', '1000', '0022']],
      ['Tech 6', ['8888', '0809', 'DDDD', '2222', '1000', '0022']],
      ['Tech 6 fill', ['0000', '0809', 'DDDD', '2222', '1000', '0022']],
      ['Tech 7', ['8888', '0849', 'DDDD', '2222', '1000', '0022']],
      ['Tech 7 fill', ['0000', '0849', 'DDDD', '2222', '1000', '0022']],
      ['Tech 8', ['8888', '0802', 'DDDD', '2222', '1000', '0022']],
      ['Tech 8 fill', ['8896', '0869', 'DDDD', '2222', '1000', '0022']]]],
    ['Dub', [
      ['Dub 1', ['8888', '0808', 'DDDD', '2222', '1240', '0022']],
      ['Dub 1 fill', ['8888', '0809', 'DDDD', '2222', '1240', '0022']],
      ['Dub 2', ['8888', '0808', 'FFFF', '2222', '1240', '0022']],
      ['Dub 2 fill', ['000A', '0849', 'DDDD', '2222', '1000', '0022']],
      ['Dub 3', ['8889', '0808', 'CCCC', '2222', '1240', '0022']],
      ['Dub 3 fill', ['8888', '0000', 'CCCC', '2222', '1240', '0022']],
      ['Dub 4', ['8889', '0808', '4545', '2222', '1240', '0022']],
      ['Dub 4 fill', ['8888', '0809', '4545', '2222', '1240', '0022']],
      ['Dub 5', ['888C', '0808', 'FFFF', '2222', '1240', '0022']],
      ['Dub 5 fill', ['8888', '8888', 'FFFF', '2222', '1240', '0022']],
      ['Dub 6', ['888C', '0809', 'DDDD', '2222', '1240', '0022']],
      ['Dub 6 fill', ['999F', '0000', 'DDDD', '2222', '1240', '0022']],
      ['Dub 7', ['0000', '0849', 'DDDD', '2222', '1240', '0022']],
      ['Dub 7 fill', ['000A', '0849', 'DDDD', '2222', '1000', '0022']],
      ['Dub 8', ['0000', '0802', 'DDDD', '2222', '1240', '0022']],
      ['Dub 8 fill', ['000A', '0802', 'DDDD', '2222', '1000', '0022']]]],
    ['House', [
      ['House 1', ['8888', '0808', '2222', '0000', '0040', '0101']],
      ['House 1 fill', ['8888', '88AF', '2222', '0000', '0040', '0101']],
      ['House 2', ['888A', '0808', '2323', '0000', '0040', '0101']],
      ['House 2 fill', ['8888', '88AF', '2323', '0000', '0040', '0101']],
      ['House 3', ['8888', '0808', 'CCCC', '2222', '0040', '0101']],
      ['House 3 fill', ['8888', '88AF', 'CCCC', '2222', '0040', '0101']],
      ['House 4', ['888A', '0808', 'CCCC', '2222', '0040', '0101']],
      ['House 4 fill', ['8888', '88AF', 'CCCC', '2222', '0040', '0101']],
      ['House 5', ['8888', '0808', 'FFFF', '2222', '0040', '0101']],
      ['House 5 fill', ['0000', '0808', 'FFFF', '2222', '0040', '0101']],
      ['House 6', ['888A', '0808', 'FFFF', '2222', '0040', '0101']],
      ['House 6 fill', ['0000', '0808', 'FFFF', '2222', '0040', '0101']],
      ['House 7', ['888A', '0808', 'FFFF', '2222', '0040', '4112']],
      ['House 7 fill', ['0000', '0808', 'FFFF', '2222', '0040', '4112']],
      ['House 8', ['8888', '0808', 'CCCC', '2222', '0040', '4112']],
      ['House 8 fill', ['88AF', '0808', 'CCCC', '2222', '0040', '4112']]]],
    ['Half-time', [
      ['Half-time 1', ['8000', '0080', 'AAAA', '0202', '0040', '0101']],
      ['Half-time 1 fill', ['8020', '008B', 'AAAA', '0200', '0040', '0101']],
      ['Half-time 2', ['8020', '0080', 'AAAA', '0202', '0040', '0101']],
      ['Half-time 2 fill', ['8024', '0087', 'AAAA', '0200', '0040', '0101']],
      ['Half-time 3', ['9020', '0080', 'FFFF', '0202', '0012', '0101']],
      ['Half-time 3 fill', ['9024', '008F', 'FFFF', '0200', '0010', '0101']],
      ['Half-time 4', ['8420', '0080', 'AAAA', '2020', '0040', '4112']],
      ['Half-time 4 fill', ['8424', '0089', 'AAAF', '2000', '0040', '4112']],
      ['Half-time 5', ['8000', '0080', '8888', '2222', '0010', '0101']],
      ['Half-time 5 fill', ['8002', '0088', '8888', '2220', '0013', '0101']],
      ['Half-time 6', ['8024', '0080', 'EEEE', '0202', '0040', '4112']],
      ['Half-time 6 fill', ['8024', '009B', 'EEEE', '0200', '0040', '4112']],
      ['Half-time 7', ['A020', '0084', 'AAAA', '0202', '0010', '0101']],
      ['Half-time 7 fill', ['A022', '00AD', 'AAAA', '0200', '0010', '0101']],
      ['Half-time 8', ['8000', '0080', '2222', '0000', '0040', '4112']],
      ['Half-time 8 fill', ['8004', '0083', '2222', '0000', '0040', '4112']]]]
  ];

  // ---------- DOM helpers ----------
  const F = {};
  root.querySelectorAll('[data-f]').forEach(function (el) { F[el.dataset.f] = el; });
  const K = {};
  root.querySelectorAll('[data-k]').forEach(function (el) { K[el.dataset.k] = el; });
  const FIELD = {};
  root.querySelectorAll('[data-fk]').forEach(function (el) { FIELD[el.dataset.fk] = el; });

  function sleep(t) { return new Promise(function (r) { setTimeout(r, t); }); }
  function hex4(v) { return (v & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'); }
  function patText(p) { return 'P=' + p.map(hex4).join(','); }
  function bits(v) { let n = 0; for (; v; v &= v - 1) n++; return n; }
  function setNote(el, text, cls) {
    el.textContent = text;
    el.classList.remove('stx-ok', 'stx-warn', 'stx-bad');
    if (cls) el.classList.add('stx-' + cls);
  }

  // ---------- state ----------
  const S = {
    link: null,
    state: 'idle',        // idle | connecting | starting | live | noanswer | lost
    pending: null,        // request waiting for its answer
    queue: [],
    missed: 0,
    answered: false,      // the module answered at least once on this connection
    pat: [0, 0, 0, 0, 0, 0],
    modPat: null,         // pattern last read from / sent to the module
    cfg: null,
    cfgFields: 0,
    note: '',             // pattern status: sent | err | nosend | kept | noload | gen
    unsaved: false,       // GEN/MUT result playing, not saved on the module yet
    lastPort: null,
    userClosed: false,
    errLogAt: 0
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
          // Framing/break errors (e.g. bootloader noise at the reset) are not fatal: take a
          // new reader. If the device is gone, port.readable is null and the loop ends.
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
  function isReply(line) { return line === 'OK' || line === 'ERR'; }
  function specFor(cmd) {
    if (cmd === 'C?') return { test: function (l) { return l.indexOf('C=') >= 0; }, ms: 1200 };
    if (cmd === 'P?') return { test: function (l) { return l.indexOf('P=') >= 0; }, ms: 1500 };
    if (cmd.indexOf('P=') === 0) return { test: isReply, ms: 3000 };  // includes the EEPROM write
    return { test: isReply, ms: 1500 };
  }
  // opt.key: a newer request with the same key replaces a queued (not yet sent) one
  function request(cmd, opt) {
    opt = opt || {};
    const spec = opt.spec || specFor(cmd);
    return new Promise(function (resolve) {
      if (opt.key) {
        const old = S.queue.find(function (r) { return r.key === opt.key; });
        if (old) {
          old.resolve(SUPERSEDED);
          old.cmd = cmd;
          old.resolve = resolve;
          return;
        }
      }
      S.queue.push({ cmd: cmd, test: spec.test, ms: spec.ms, key: opt.key, resolve: resolve });
      pump();
    });
  }
  function pump() {
    if (S.pending || !S.queue.length || !S.link) return;
    const r = S.queue.shift();
    S.pending = r;
    r.timer = setTimeout(function () { finish(r, null); }, r.ms);
    log('> ' + r.cmd);
    S.link.write(r.cmd + '\n').catch(function (e) {
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
  // request + bookkeeping: two missed answers in a row -> "does not answer"
  async function ask(cmd, opt) {
    const link = S.link;
    if (!link) return null;
    const res = await request(cmd, opt);
    if (res === SUPERSEDED || S.link !== link) return res;
    if (res === null) {
      if (!(opt && opt.optional)) {
        log('(no answer to ' + cmd + ')');
        if (++S.missed >= 2 && S.state === 'live') setState('noanswer');
      }
    } else {
      S.missed = 0;
      S.answered = true;
      if (S.state === 'noanswer') setState('live');
    }
    return res;
  }

  // ---------- incoming lines ----------
  function onLine(raw) {
    const line = raw.replace(/[^\x20-\x7e]/g, '').trim();  // drop CR and bootloader noise
    if (!line) return;
    log(line);
    if (S.pending && S.pending.test(line)) finish(S.pending, line);
  }

  function parseConfig(line) {
    const parts = line.slice(line.indexOf('C=') + 2).split(',').map(function (s) { return parseInt(s, 10); });
    if (parts.length < 10 || parts.some(isNaN)) return null;
    const c = { n: parts.length };
    CFG_KEYS.forEach(function (k, i) { c[k] = i < parts.length ? parts[i] : null; });
    return c;
  }
  function parsePattern(line) {
    const m = /P=([0-9A-Fa-f]{1,4}(?:,[0-9A-Fa-f]{1,4}){5})/.exec(line);
    return m ? m[1].split(',').map(function (h) { return parseInt(h, 16) & 0xFFFF; }) : null;
  }

  // ---------- module I/O ----------
  async function loadConfig() {
    const res = await ask('C?');
    const c = typeof res === 'string' ? parseConfig(res) : null;
    if (!c) return false;
    S.cfg = c;
    S.cfgFields = c.n;
    renderConfig();
    renderHints();
    return true;
  }

  // keepEdits: unsent changes in the grid stay (after a reconnect or a console command)
  async function loadPattern(keepEdits) {
    const res = await ask('P?');
    const p = typeof res === 'string' ? parsePattern(res) : null;
    if (!p) {
      S.note = 'noload';
      renderPattern();
      return false;
    }
    const edited = keepEdits && S.modPat && diffCount() > 0;
    S.modPat = p;
    if (!edited) S.pat = p.slice();
    S.note = edited && diffCount() > 0 ? 'kept' : '';
    renderPattern();
    return true;
  }

  async function sendPattern() {
    const p = S.pat.slice();
    const res = await ask(patText(p));
    if (res === 'OK') {
      S.modPat = p;
      S.unsaved = false;
      S.note = 'sent';
    } else {
      S.note = res === 'ERR' ? 'err' : 'nosend';
    }
    renderPattern();
    return res === 'OK';
  }

  async function oneShot(cmd) {
    if (cmd === 'U' && diffCount() > 0 && !(await sendPattern())) return;  // mutate what is shown
    const res = await ask(cmd);
    if (res !== 'OK') return;
    if (await loadPattern(false)) {
      S.unsaved = true;
      S.note = 'gen';
      renderPattern();
    }
  }

  function setSetting(k) {
    if (!S.cfg || !CFG_CMD[k]) return;
    const v = parseInt(K[k].value, 10);
    if (isNaN(v)) return;
    S.cfg[k] = v;
    renderConfig();
    renderHints();
    ask(CFG_CMD[k] + v, { key: k });
  }

  // ---------- connection ----------
  const STATE_TEXT = {
    idle: 'Not connected.',
    connecting: 'Choose the module’s USB port in the browser window…',
    starting: 'Connected. The module restarts – waiting for it to start…',
    live: 'Connected – the editor shows the pattern and settings of the module.',
    noanswer: 'Connected, but the module does not answer.',
    lost: 'Connection lost. Plug the cable back in (the page reconnects by itself) or press Connect.'
  };

  function setState(state, text) {
    S.state = state;
    let t = text || STATE_TEXT[state];
    if (MOCK && S.link) t = '[demo] ' + t;
    F.state.textContent = t;
    F.state.classList.toggle('stx-live', state === 'live');
    updateButtons();
    renderHints();
  }

  function openError(e) {
    if (e && e.name === 'NetworkError') {
      return 'The port could not be opened. Is another program using it (Arduino IDE serial monitor, the firmware uploader, another browser tab)? Close it and try again.';
    }
    if (e && e.name === 'InvalidStateError') return 'This port is already open in another tab or program.';
    return 'Could not open the port: ' + (e && e.message ? e.message : e);
  }

  async function connect(port) {
    S.userClosed = false;
    const link = MOCK ? new MockLink() : new SerialLink(port);
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
    S.link = link;
    S.lastPort = link.port || null;
    link.onLine = onLine;
    link.onEvent = onLinkEvent;
    S.missed = 0;
    S.answered = false;
    setState('starting');

    // The module restarts now; commands sent to the bootloader get lost.
    await sleep(BOOT_WAIT_MS);
    if (S.link !== link) return;
    if (link.clearBuffer) link.clearBuffer();
    let cfg = null;
    for (let i = 1; i <= BOOT_TRIES && S.link === link && !cfg; i++) {
      if (i > 1) setState('starting', 'Connected. Waiting for the module to answer (try ' + i + ' of ' + BOOT_TRIES + ')…');
      const res = await request('C?');
      cfg = typeof res === 'string' ? parseConfig(res) : null;
    }
    if (S.link !== link) return;
    if (!cfg) {
      setState('noanswer');
      return;
    }
    S.answered = true;
    S.cfg = cfg;
    S.cfgFields = cfg.n;
    renderConfig();
    await loadPattern(true);
    if (S.link !== link) return;
    setState('live');
  }

  async function disconnect() {
    S.userClosed = true;
    const link = S.link;
    S.link = null;
    flushRequests();
    if (link) await link.close();
    S.note = '';
    log('(disconnected)');
    setState('idle');
  }

  function onLinkEvent(type, e) {
    if (type === 'readerror') {
      if (Date.now() - S.errLogAt > 3000) log('(serial read error: ' + (e && e.name ? e.name : e) + ')');
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

  // ---------- rendering ----------
  function canEdit() { return !!S.link && S.state === 'live'; }
  function canLoad() { return !!S.link && (S.state === 'live' || S.state === 'noanswer'); }

  function updateButtons() {
    const edit = canEdit();
    const load = canLoad();
    root.querySelectorAll('[data-live]').forEach(function (b) { b.disabled = !edit; });
    root.querySelectorAll('[data-load]').forEach(function (b) { b.disabled = !load; });
    Object.keys(K).forEach(function (k) {
      K[k].disabled = !edit || !S.cfg || S.cfg[k] == null;
    });
    const c = root.querySelector('[data-act="connect"]');
    const connected = !!S.link || S.state === 'connecting';
    c.textContent = S.state === 'connecting' ? 'Connecting…' : connected ? 'Disconnect' : 'Connect';
    c.classList.toggle('stx-primary', !connected);
    c.disabled = S.state === 'connecting' || (!MOCK && !('serial' in navigator));
    F.sendtext.disabled = F.sendbtn.disabled = !load;
    renderPattern();
  }

  function renderConfig() {
    const c = S.cfg;
    Object.keys(K).forEach(function (k) {
      if (c && c[k] != null) K[k].value = String(c[k]);
    });
    F.bpmval.textContent = c ? String(c.bpm) : '–';
    F.fper.textContent = c && c.fper != null && FPER[c.fper]
      ? 'every ' + FPER[c.fper] + (FPER[c.fper] > 1 ? ' repeats' : ' repeat') : '–';
    const man = !!c && c.mode === 0;
    AUTO_ONLY.forEach(function (k) { FIELD[k].classList.toggle('stx-dim', man); });
    FIELD.bpm.classList.toggle('stx-dim', !!c && c.clk === 0);
    updateButtons();
  }

  // Grid: one block of 16 steps, or 2 x 8 steps on narrow screens.
  const narrow = window.matchMedia('(max-width: 640px)');
  function buildGrid() {
    const g = F.grid;
    g.textContent = '';
    const parts = narrow.matches ? [[0, 8], [8, 16]] : [[0, 16]];
    parts.forEach(function (part) {
      const blk = document.createElement('div');
      blk.className = 'stx-steps';
      blk.style.setProperty('--n', String(part[1] - part[0]));
      blk.appendChild(document.createElement('span'));
      for (let c = part[0]; c < part[1]; c++) {
        const n = document.createElement('span');
        n.className = 'stx-num' + (c % 4 === 0 ? ' stx-beat' : '');
        n.textContent = String(c + 1);
        blk.appendChild(n);
      }
      for (let r = 0; r < 6; r++) {
        const lab = document.createElement('span');
        lab.className = 'stx-lab';
        lab.textContent = CH[r];
        blk.appendChild(lab);
        for (let c = part[0]; c < part[1]; c++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'stx-cell' + (c % 4 === 0 ? ' stx-beat' : '');
          b.dataset.r = String(r);
          b.dataset.c = String(c);
          b.setAttribute('aria-label', CH[r] + ' step ' + (c + 1));
          blk.appendChild(b);
        }
      }
      g.appendChild(blk);
    });
    renderPattern();
  }
  if (narrow.addEventListener) narrow.addEventListener('change', buildGrid);
  else if (narrow.addListener) narrow.addListener(buildGrid);

  function diffCount() {
    if (!S.modPat) return 0;
    let n = 0;
    for (let r = 0; r < 6; r++) n += bits(S.pat[r] ^ S.modPat[r]);
    return n;
  }

  function renderPattern() {
    const edit = canEdit();
    F.grid.querySelectorAll('.stx-cell').forEach(function (b) {
      const r = +b.dataset.r;
      const bit = 1 << (15 - +b.dataset.c);
      const on = !!(S.pat[r] & bit);
      b.classList.toggle('stx-on', on);
      b.classList.toggle('stx-diff', !!S.modPat && !!((S.pat[r] ^ S.modPat[r]) & bit));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.disabled = !edit;
    });
    F.hex.textContent = patText(S.pat);
    const n = diffCount();
    const steps = n === 1 ? '1 step differs from the module (marked) – press Send to put it on the module.'
      : n + ' steps differ from the module (marked) – press Send to put them on the module.';
    if (!S.modPat) {
      setNote(F.patstate, S.note === 'noload' && S.link ? 'Could not read the pattern – press Load from module.' : '', S.note === 'noload' ? 'warn' : null);
    } else if (S.note === 'err') {
      setNote(F.patstate, 'The module did not accept the pattern (ERR). Try again.', 'bad');
    } else if (S.note === 'nosend') {
      setNote(F.patstate, 'The pattern was not sent: no answer from the module.', 'warn');
    } else if (n) {
      setNote(F.patstate, (S.note === 'kept' ? 'Your unsent changes were kept: ' : '') + steps, 'warn');
    } else if (S.unsaved) {
      setNote(F.patstate, 'The module plays the new pattern but has not saved it – press Send to keep it after a power cycle.', 'warn');
    } else if (S.note === 'sent') {
      setNote(F.patstate, 'Sent – the module plays and has saved this pattern.', 'ok');
    } else if (S.note === 'noload') {
      setNote(F.patstate, 'Could not read the pattern – press Load from module.', 'warn');
    } else {
      setNote(F.patstate, S.link ? 'The grid shows the pattern on the module.' : 'Last pattern read from the module.');
    }
  }

  function renderHints() {
    const H = [];
    function add(lvl, text, link) { H.push({ lvl: lvl, text: text, link: link }); }
    const flash = FLASH ? { href: FLASH, label: 'Flash the Stitch firmware' } : null;
    if (S.state === 'noanswer') {
      if (S.answered) add('warn', 'The module stopped answering. While its secret menu is open it does not listen to USB: leave the menu, then press Load from module.');
      else add('warn', 'No answer from the module. Is the Stitch firmware flashed? Is it the right port? Close other programs that use the port (Arduino IDE, the uploader, the hardware test page). Some USB cables only charge – try another one. While the secret menu is open on the module, it does not answer.', flash);
    } else if (S.state === 'starting') {
      add('info', 'Opening the port restarts the module. The editor waits 2–3 seconds before it asks for the pattern and settings (a little longer on LGT8F boards).');
    } else if (S.state === 'lost') {
      add('warn', 'The USB connection was lost. Plug the cable back in; the page reconnects by itself. Unsent changes in the grid are kept.');
    } else if (S.state === 'idle' && (MOCK || 'serial' in navigator)) {
      add('info', S.modPat ? 'Not connected – the grid shows the last pattern read from the module.' : 'Connect the module to load its pattern and settings.');
    }
    if (S.state === 'live' && S.cfg && S.cfg.mode === 1) {
      add('info', 'AUTO mode: the module loads new patterns by itself (REP, SW, fills), so the grid only shows the pattern at the moment it was loaded. Set Mode to MAN to keep your own pattern playing.');
    }
    if (S.state === 'live' && S.cfgFields && S.cfgFields < 12) {
      add('warn', 'This Stitch version does not report the output mode and fill period. Update the firmware to set them here.', flash);
    }
    const ul = F.hints;
    ul.textContent = '';
    H.forEach(function (h) {
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

  function fillPresets() {
    PRESETS.forEach(function (g, gi) {
      const og = document.createElement('optgroup');
      og.label = g[0];
      g[1].forEach(function (p, pi) {
        const o = document.createElement('option');
        o.value = gi + ':' + pi;
        o.textContent = p[0];
        og.appendChild(o);
      });
      F.preset.appendChild(og);
    });
  }
  function applyPreset() {
    const ix = F.preset.value.split(':').map(Number);
    const p = PRESETS[ix[0]] && PRESETS[ix[0]][1][ix[1]];
    if (!p) return;
    S.pat = p[1].map(function (h) { return parseInt(h, 16); });
    S.note = '';
    renderPattern();
  }

  // ---------- wiring ----------
  root.addEventListener('click', function (ev) {
    const b = ev.target.closest('button');
    if (!b || !root.contains(b) || b.disabled) return;
    if (b.classList.contains('stx-cell')) {
      S.pat[+b.dataset.r] ^= 1 << (15 - +b.dataset.c);
      S.note = '';
      renderPattern();
      return;
    }
    switch (b.dataset.act) {
      case 'connect': if (S.link) disconnect(); else connect(); break;
      case 'send': sendPattern(); break;
      case 'loadpat': loadPattern(false); break;
      case 'loadcfg': loadConfig(); break;
      case 'gen': oneShot('G'); break;
      case 'mut': oneShot('U'); break;
      case 'preset': applyPreset(); break;
      case 'presetsend': applyPreset(); sendPattern(); break;
    }
  });
  Object.keys(K).forEach(function (k) {
    if (k === 'bpm') {
      K.bpm.addEventListener('input', function () { F.bpmval.textContent = K.bpm.value; });
    }
    K[k].addEventListener('change', function () { setSetting(k); });
  });
  F.sendform.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const text = F.sendtext.value.trim();
    if (!text || !S.link) return;
    F.sendtext.value = '';
    const query = text === 'C?' || text === 'P?';
    ask(text, {
      optional: true,
      spec: { test: function (l) { return isReply(l) || l.indexOf('C=') >= 0 || l.indexOf('P=') >= 0; }, ms: 1500 }
    }).then(function (res) {
      if (res === null) log('(no answer – Stitch does not know this command)');
      else if (typeof res === 'string' && !query) {  // the command may have changed something
        loadConfig();
        loadPattern(true);
      }
    });
  });

  if (MOCK) F.mockinfo.hidden = false;
  else if (!('serial' in navigator)) F.unsupported.hidden = false;
  fillPresets();
  buildGrid();
  setState('idle');

  // =====================================================================================
  // Simulated module for ?mock=1: answers like the Stitch firmware. Its "EEPROM" lives
  // as long as the page, so a sent pattern is still there after Disconnect + Connect.
  // =====================================================================================
  let mockEE = null;
  class MockLink {
    constructor() { this.port = null; this.rx = ''; }
    async open() {
      await sleep(300);
      if (!mockEE) {
        mockEE = {
          cfg: { bpm: 120, clk: 1, mode: 0, style: 0, fill: 1, rep: 2, sw: 0, enc: 0, oled: 0, rst: 0, fper: 2, out: 0 },
          pat: [0x8888, 0x0808, 0xDDDD, 0x2222, 0x1000, 0x0022]
        };
      }
      this.cfg = Object.assign({}, mockEE.cfg);
      this.pat = mockEE.pat.slice();
      this.bootUntil = Date.now() + 1800;  // reset + bootloader: commands get lost
    }
    async close() { this.closed = true; }
    clearBuffer() {}
    async write(text) {
      await sleep(2);
      if (this.closed) throw new Error('port not open');
      for (const ch of text) {
        if (ch === '\n') {
          const line = this.rx.replace(/\r$/, '');
          this.rx = '';
          if (Date.now() >= this.bootUntil) this.command(line);
        } else if (this.rx.length < 63) {
          this.rx += ch;
        }
      }
    }
    emit(line) {
      setTimeout(() => { if (!this.closed && this.onLine) this.onLine(line + '\r'); }, 6 + Math.random() * 25);
    }
    save() { mockEE = { cfg: Object.assign({}, this.cfg), pat: this.pat.slice() }; }
    rndWord(p) {
      let v = 0;
      for (let i = 0; i < 16; i++) if (Math.random() < p) v |= 1 << i;
      return v;
    }
    generate() {
      this.pat = [
        0x8888 | (this.rndWord(0.12) & 0x2222),
        this.rndWord(0.55),
        0x0808 | (this.rndWord(0.1) & 0x5151),
        this.rndWord(0.3),
        this.rndWord(0.15),
        this.rndWord(0.25)
      ];
    }
    mutate() {
      this.pat = this.pat.map((v) => (Math.random() < 0.7 ? v ^ (1 << Math.floor(Math.random() * 16)) : v));
    }
    command(s) {
      const c = this.cfg;
      const n = (lo, hi) => Math.min(hi, Math.max(lo, parseInt(s.slice(1), 10) || 0));
      const ok = () => this.emit('OK');
      const set = (k, v) => { c[k] = v; this.save(); ok(); };
      if (s[0] === 'D' && (s[1] === '0' || s[1] === '1')) return ok();
      if (s[0] === 'T') return set('out', n(0, 2));
      if (s === 'X') {
        if (c.rst === 2) this.generate();
        else if (c.rst === 3) this.mutate();
        return ok();
      }
      if (s === 'G') { this.generate(); return ok(); }
      if (s === 'U') { this.mutate(); return ok(); }
      switch (s[0]) {
        case 'B': return set('bpm', n(60, 240));
        case 'K': return set('clk', s[1] === '1' ? 1 : 0);
        case 'M': return set('mode', s[1] === '1' ? 1 : 0);
        case 'S': return set('style', n(0, 4));
        case 'F': return set('fill', s[1] === '1' ? 1 : 0);
        case 'R': return set('rep', n(0, 4));
        case 'W': return set('sw', n(0, 4));
        case 'O': return set('oled', s[1] === '1' ? 1 : 0);
        case 'E': return set('enc', s[1] === '1' ? 1 : 0);
        case 'N': return set('rst', n(0, 3));
      }
      if (s === 'P?') return this.emit(patText(this.pat));
      if (s.indexOf('P=') === 0) {
        const m = /^P=([0-9A-Fa-f]{1,4}(?:,[0-9A-Fa-f]{1,4}){5})/.exec(s);
        if (!m) return this.emit('ERR');
        this.pat = m[1].split(',').map((h) => parseInt(h, 16));
        this.save();
        return ok();
      }
      if (s === 'C?') return this.emit('C=' + CFG_KEYS.map((k) => c[k]).join(','));
      if (s === 'Q') {
        Object.assign(c, { bpm: 120, clk: 0, mode: 0, style: 0, fill: 1, rep: 2, sw: 0, enc: 0, oled: 0, rst: 0, fper: 2, out: 0 });
        this.save();
        return ok();
      }
      // anything else: no answer, like the firmware
    }
  }
})();
