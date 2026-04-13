<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Queue Number</title>
  <style>
    :root { --bg:#0f172a; --text:#e5e7eb; --muted:#94a3b8; --accent:#22c55e; --warn:#f59e0b; --blue:#60a5fa; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; display:grid; place-items:center; font-family:system-ui,Segoe UI,Arial,sans-serif; background:linear-gradient(135deg,#0f172a,#1e293b); color:var(--text); transition:background .4s; }
    body.calling { background:linear-gradient(135deg,#1c1a00,#3d2b00) !important; }
    body.served  { background:linear-gradient(135deg,#0a1628,#0f2a4a) !important; }
    .wrap { width:min(92vw,560px); background:rgba(17,24,39,.92); border:1px solid rgba(148,163,184,.2); border-radius:20px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,.35); text-align:center; transition:border-color .4s; }
    .wrap.calling { border-color:var(--warn); }
    .wrap.served  { border-color:var(--blue); }
    h1 { margin:0 0 6px; font-size:26px; }
    .subtitle { margin:0 0 14px; color:var(--muted); font-size:14px; }
    .num { font-size:72px; font-weight:800; letter-spacing:4px; padding:22px; border-radius:16px; background:#0b1220; border:1px solid rgba(148,163,184,.15); margin:14px 0; transition:all .4s; }
    .num.calling { color:var(--warn); border-color:var(--warn); }
    .num.served  { color:var(--blue); border-color:var(--blue); text-decoration:line-through; opacity:.6; }
    .status { font-size:14px; font-weight:600; padding:8px 18px; border-radius:20px; display:inline-block; margin-bottom:10px; }
    .status.waiting { background:rgba(34,197,94,.15); color:var(--accent); }
    .status.called  { background:rgba(245,158,11,.2);  color:var(--warn); animation:pulse 1s infinite; }
    .status.served  { background:rgba(96,165,250,.15); color:var(--blue); }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
    #notifBtn { background:rgba(34,197,94,.1); border:1px solid #22c55e; color:#22c55e; border-radius:10px; padding:8px 16px; font-size:13px; cursor:pointer; margin-bottom:12px; font-weight:600; display:inline-block; transition:all .3s; }
    #notifBtn:disabled { opacity:.6; cursor:default; }
    #notifBtn.denied { border-color:#ef4444; color:#ef4444; background:rgba(239,68,68,.1); }
    .alert-box { display:none; border-radius:14px; padding:18px 16px; margin-top:12px; font-size:17px; font-weight:700; }
    .alert-box.calling { display:block; background:rgba(245,158,11,.15); border:2px solid var(--warn); color:var(--warn); animation:pulse 1.5s infinite; }
    .alert-box.served  { display:block; background:rgba(96,165,250,.1);  border:2px solid var(--blue); color:var(--blue); }
    .thank-icon  { font-size:52px; margin-bottom:10px; }
    .thank-title { font-size:22px; font-weight:800; margin-bottom:6px; }
    .thank-sub   { font-size:14px; color:var(--muted); }
    .small { font-size:12px; color:var(--muted); margin-top:12px; }
    .msg   { margin-top:8px; min-height:18px; color:#fbbf24; font-size:13px; }
  </style>
</head>
<body>
  <div class="wrap" id="mainWrap">
    <h1>Queue Number</h1>
    <p class="subtitle">Your number is assigned automatically when you open this page.</p>

    <button id="notifBtn" onclick="requestNotif()">🔔 Enable Notifications</button>

    <div id="queueNumber" class="num">----</div>
    <div id="statusBadge" class="status waiting">Waiting</div>

    <div id="calledAlert" class="alert-box">
      📢 Your number is being called!<br>Please proceed to the counter.
    </div>
    <div id="servedAlert" class="alert-box">
      <div class="thank-icon">🎉</div>
      <div class="thank-title">Thank You!</div>
      <div class="thank-sub">You have been served. We hope to see you again!</div>
    </div>

    <p class="small" id="hintText">Keep this page open. You will be notified when your number is called.</p>
    <div id="msg" class="msg"></div>
  </div>

  <script>
    // ← Replace with your deployed Apps Script web app URL
    const SHEET_URL = 'https://script.google.com/your-apps-script-webapp-url/exec';

    const queueNumberEl = document.getElementById('queueNumber');
    const statusBadge   = document.getElementById('statusBadge');
    const calledAlert   = document.getElementById('calledAlert');
    const servedAlert   = document.getElementById('servedAlert');
    const mainWrap      = document.getElementById('mainWrap');
    const hintText      = document.getElementById('hintText');
    const msgEl         = document.getElementById('msg');
    const notifBtn      = document.getElementById('notifBtn');

    let myDeviceId = null, myNumber = null, lastStatus = null, pollTimer = null;
    let swRegistration = null;

    // ── Device ID ─────────────────────────────────────────────────────────
    function getDeviceId() {
      let id = localStorage.getItem('queue_device_id');
      if (!id) {
        id = 'device_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('queue_device_id', id);
      }
      return id;
    }

    // ── Register Service Worker ───────────────────────────────────────────
    async function registerSW() {
      if (!('serviceWorker' in navigator)) return;
      try {
        swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', swRegistration.scope);
      } catch (err) {
        console.warn('SW registration failed:', err);
      }
    }

    // ── Notification permission ───────────────────────────────────────────
    function updateNotifBtn() {
      if (!('Notification' in window)) {
        notifBtn.textContent = '❌ Not supported on this device';
        notifBtn.classList.add('denied');
        notifBtn.disabled = true;
        return;
      }
      if (Notification.permission === 'granted') {
        notifBtn.textContent = '✅ Notifications enabled';
        notifBtn.disabled = true;
      } else if (Notification.permission === 'denied') {
        notifBtn.textContent = '❌ Blocked — allow in browser settings';
        notifBtn.classList.add('denied');
        notifBtn.disabled = true;
      }
    }

    async function requestNotif() {
      if (!('Notification' in window)) {
        notifBtn.textContent = '❌ Not supported on this browser';
        notifBtn.classList.add('denied');
        notifBtn.disabled = true;
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        notifBtn.textContent = '✅ Notifications enabled';
        notifBtn.disabled = true;
        // Register SW now that permission is granted
        await registerSW();
      } else {
        notifBtn.textContent = '❌ Blocked — allow in browser settings';
        notifBtn.classList.add('denied');
        notifBtn.disabled = true;
      }
    }

    // ── Show notification via Service Worker ─────────────────────────────
    async function showNotif(title, body) {
      if (Notification.permission !== 'granted') return;
      try {
        // Use SW if available (works in background)
        if (swRegistration) {
          await swRegistration.showNotification(title, {
            body,
            vibrate: [300, 100, 300, 100, 300],
            tag: 'queue-alert',
            renotify: true,
            requireInteraction: true
          });
        } else {
          // Fallback to basic Notification
          new Notification(title, { body });
        }
      } catch (e) {
        console.warn('Notification error:', e);
      }
    }

    // ── Beep sound (3 beeps) ──────────────────────────────────────────────
    function playBeep() {
      try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        [0, 0.35, 0.70].forEach(offset => {
          osc.frequency.setValueAtTime(880, ctx.currentTime + offset);
          gain.gain.setValueAtTime(0.5, ctx.currentTime + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.28);
        });
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.1);
      } catch (e) {}
    }

    // ── UI state machine ──────────────────────────────────────────────────
    async function updateUI(status) {
      if (lastStatus === status) return;
      lastStatus = status;

      document.body.className = '';
      mainWrap.className      = 'wrap';
      queueNumberEl.className = 'num';
      calledAlert.className   = 'alert-box';
      servedAlert.className   = 'alert-box';
      statusBadge.className   = 'status ' + status;

      const labels = { waiting:'Waiting', called:'Being Called!', served:'Served' };
      statusBadge.textContent = labels[status] || status;

      if (status === 'called') {
        document.body.classList.add('calling');
        mainWrap.classList.add('calling');
        queueNumberEl.classList.add('calling');
        calledAlert.classList.add('calling');
        hintText.textContent = 'Please proceed to the counter now.';
        playBeep();
        await showNotif(
          'Queue Alert 📢',
          'Number ' + String(myNumber).padStart(4,'0') + ' is being called! Please proceed to the counter.'
        );
      } else if (status === 'served') {
        document.body.classList.add('served');
        mainWrap.classList.add('served');
        queueNumberEl.classList.add('served');
        servedAlert.classList.add('served');
        hintText.textContent = 'This queue session is complete. Thank you!';
        if (pollTimer) clearInterval(pollTimer);
        await showNotif('Queue ✅', 'You have been served. Thank you!');
      } else {
        hintText.textContent = 'Keep this page open. You will be notified when your number is called.';
      }
    }

    // ── Fetch queue number on open ────────────────────────────────────────
    async function fetchNumber() {
      myDeviceId = getDeviceId();
      const url = `${SHEET_URL}?action=get_number&device_id=${encodeURIComponent(myDeviceId)}&timestamp=${Date.now()}`;
      msgEl.textContent = 'Loading...';
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        if (resp.ok && data && typeof data.number === 'number') {
          myNumber = data.number;
          queueNumberEl.textContent = String(data.number).padStart(4,'0');
          msgEl.textContent = data.is_new ? 'New number issued.' : 'Existing number reused.';
          await updateUI(data.status || 'waiting');
          if (data.status !== 'served') startPolling();
        } else {
          queueNumberEl.textContent = 'ERR';
          msgEl.textContent = data?.error || 'Error loading number.';
        }
      } catch (err) {
        queueNumberEl.textContent = 'ERR';
        msgEl.textContent = 'Network error. Please refresh.';
      }
    }

    // ── Poll every 5s ─────────────────────────────────────────────────────
    async function pollStatus() {
      if (!myDeviceId) return;
      try {
        const url = `${SHEET_URL}?action=get_status&device_id=${encodeURIComponent(myDeviceId)}&timestamp=${Date.now()}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.status) await updateUI(data.status);
      } catch (e) {}
    }

    function startPolling() {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(pollStatus, 5000);
    }

    // ── Init ──────────────────────────────────────────────────────────────
    updateNotifBtn();
    if (Notification.permission === 'granted') registerSW();
    fetchNumber();
  </script>
</body>
</html>
