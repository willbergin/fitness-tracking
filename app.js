/**
 * Bergin PFT — App Logic
 * Handles mode selection, running mode, and strength mode.
 */

(function () {

  var RUN_STORAGE_KEY = 'pft_runs';
  var STRENGTH_STORAGE_KEY = 'pft_strength_sessions';

  /* ===== Storage Helpers ===== */
  function getStore(key) {
    try { var raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
    return [];
  }
  function setStore(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  /* ===== Export / Import (Device Sync) ===== */
  document.getElementById('btn-export-data').addEventListener('click', function () {
    var payload = {
      exportedAt: new Date().toISOString(),
      runs: getStore(RUN_STORAGE_KEY),
      strength: getStore(STRENGTH_STORAGE_KEY)
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'bergin-pft-backup-' + todayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported!');
  });

  document.getElementById('btn-import-data').addEventListener('click', function () {
    document.getElementById('import-file-input').click();
  });

  document.getElementById('import-file-input').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      try {
        var data = JSON.parse(evt.target.result);
        if (!data.runs && !data.strength) { showToast('Invalid backup file'); return; }
        var existingRuns = getStore(RUN_STORAGE_KEY);
        var existingStrength = getStore(STRENGTH_STORAGE_KEY);
        var mergeChoice = (existingRuns.length > 0 || existingStrength.length > 0)
          ? confirm('You already have data on this device.\n\nOK = Merge (keep both)\nCancel = Replace (overwrite with imported data)')
          : false;
        if (mergeChoice) {
          // Merge: combine and deduplicate by id
          var runIds = {};
          existingRuns.forEach(function (r) { runIds[r.id] = true; });
          (data.runs || []).forEach(function (r) { if (!runIds[r.id]) existingRuns.push(r); });
          setStore(RUN_STORAGE_KEY, existingRuns);

          var sIds = {};
          existingStrength.forEach(function (s) { sIds[s.id] = true; });
          (data.strength || []).forEach(function (s) { if (!sIds[s.id]) existingStrength.push(s); });
          setStore(STRENGTH_STORAGE_KEY, existingStrength);
          showToast('Data merged successfully!');
        } else {
          // Replace
          setStore(RUN_STORAGE_KEY, data.runs || []);
          setStore(STRENGTH_STORAGE_KEY, data.strength || []);
          showToast('Data imported successfully!');
        }
      } catch (err) {
        showToast('Error reading file — is it a valid backup?');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  /* ===== Toast ===== */
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 3000);
  }

  /* ===== Date Helpers ===== */
  function todayStr() {
    var t = new Date();
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* =========================================================
     MODE SELECTION
     ========================================================= */

  var modeSelect = document.getElementById('mode-select');
  var runningApp = document.getElementById('running-app');
  var strengthApp = document.getElementById('strength-app');

  document.getElementById('mode-running').addEventListener('click', function () {
    modeSelect.style.display = 'none';
    runningApp.style.display = 'flex';
    initRunning();
  });

  document.getElementById('mode-strength').addEventListener('click', function () {
    modeSelect.style.display = 'none';
    strengthApp.style.display = 'flex';
    initStrength();
  });

  // Back buttons
  document.getElementById('running-back-btn').addEventListener('click', function () {
    runningApp.style.display = 'none';
    modeSelect.style.display = 'flex';
  });

  document.getElementById('strength-back-btn').addEventListener('click', function () {
    strengthApp.style.display = 'none';
    modeSelect.style.display = 'flex';
  });

  /* =========================================================
     RUNNING MODE
     ========================================================= */

  var runningInitialized = false;

  function initRunning() {
    if (runningInitialized) return;
    runningInitialized = true;

    // Navigation
    var navLinks = runningApp.querySelectorAll('.nav-link[data-view]');
    var sections = runningApp.querySelectorAll('.view-section');

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showRunView(link.getAttribute('data-view'));
      });
    });

    function showRunView(viewId) {
      sections.forEach(function (s) { s.classList.remove('active'); });
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      var target = document.getElementById('view-' + viewId);
      if (target) target.classList.add('active');
      navLinks.forEach(function (l) {
        if (l.getAttribute('data-view') === viewId) l.classList.add('active');
      });
      if (viewId === 'r-log') renderRecentRuns();
      if (viewId === 'r-calendar') renderRunCalendar();
      if (viewId === 'r-stats') renderRunStats();
    }

    // Make showRunView accessible for calendar modal
    window._showRunView = showRunView;

    /* Countdown */
    function updateCountdown() {
      var raceDate = new Date(MARATHON_CONFIG.raceDate + 'T09:00:00');
      var now = new Date();
      var diff = raceDate.getTime() - now.getTime();
      if (diff <= 0) {
        document.getElementById('countdown-days').textContent = '0';
        document.getElementById('countdown-hours').textContent = '0';
        document.getElementById('countdown-minutes').textContent = '0';
        document.getElementById('countdown-seconds').textContent = '0';
        return;
      }
      document.getElementById('countdown-days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
      document.getElementById('countdown-hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      document.getElementById('countdown-minutes').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById('countdown-seconds').textContent = Math.floor((diff % (1000 * 60)) / 1000);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* Current Week */
    function getCurrentWeek() {
      var today = new Date(); today.setHours(0,0,0,0);
      for (var i = 0; i < TRAINING_PLAN.length; i++) {
        var week = TRAINING_PLAN[i];
        var start = new Date(week.startDate + 'T00:00:00');
        var end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23,59,59,999);
        if (today >= start && today <= end) return week;
      }
      var planStart = new Date(TRAINING_PLAN[0].startDate + 'T00:00:00');
      if (today < planStart) return TRAINING_PLAN[0];
      return TRAINING_PLAN[TRAINING_PLAN.length - 1];
    }

    /* This Week */
    (function renderThisWeek() {
      var container = document.getElementById('this-week-content');
      if (!container) return;
      var currentWeek = getCurrentWeek();
      container.innerHTML = '';
      var weekHeader = document.createElement('div');
      weekHeader.className = 'this-week-header';
      weekHeader.innerHTML = '<h3>' + currentWeek.label + '</h3><span class="week-dates">' + currentWeek.dates + '</span><span class="week-volume">' + currentWeek.volume + '</span>';
      container.appendChild(weekHeader);
      var daysList = document.createElement('div');
      daysList.className = 'this-week-days';
      currentWeek.days.forEach(function (d) {
        var dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = '<div class="day-card-label">Day ' + d.day + '</div><div class="day-card-title">' + d.title + '</div>' + (d.detail ? '<div class="day-card-detail">' + d.detail + '</div>' : '');
        daysList.appendChild(dayCard);
      });
      container.appendChild(daysList);
    })();

    /* Paces */
    (function renderPaces() {
      var container = document.getElementById('paces-content');
      if (!container) return;
      var table = document.createElement('table');
      table.className = 'paces-table';
      table.innerHTML = '<thead><tr><th>Run Type</th><th>Pace</th></tr></thead>';
      var tbody = document.createElement('tbody');
      TRAINING_PACES.forEach(function (p) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + p.type + '</td><td>' + p.pace + '</td>';
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);
    })();

    /* Plan */
    (function renderPlan() {
      var container = document.getElementById('plan-content');
      if (!container) return;
      var currentWeek = getCurrentWeek();
      TRAINING_PLAN.forEach(function (week) {
        var isCurrent = week.week === currentWeek.week;
        var weekBlock = document.createElement('div');
        weekBlock.className = 'plan-week-block' + (isCurrent ? ' current' : '');
        weekBlock.innerHTML =
          '<div class="plan-week-header"><div class="plan-week-title">' + week.label + (isCurrent ? ' <span class="current-badge">Current</span>' : '') + '</div><div class="plan-week-meta"><span>' + week.dates + '</span><span>Volume: ' + week.volume + '</span></div></div>';
        var daysGrid = document.createElement('div');
        daysGrid.className = 'plan-days-grid';
        week.days.forEach(function (d) {
          var dayEl = document.createElement('div');
          dayEl.className = 'plan-day-card';
          dayEl.innerHTML = '<div class="plan-day-label">Day ' + d.day + '</div><div class="plan-day-title">' + d.title + '</div>' + (d.detail ? '<div class="plan-day-detail">' + d.detail + '</div>' : '');
          daysGrid.appendChild(dayEl);
        });
        weekBlock.appendChild(daysGrid);
        container.appendChild(weekBlock);
      });
    })();

    /* Log Run Form */
    var logForm = document.getElementById('log-run-form');
    var dateInput = document.getElementById('run-date');
    if (dateInput) dateInput.value = todayStr();

    logForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var date = document.getElementById('run-date').value;
      var type = document.getElementById('run-type').value;
      var distance = parseFloat(document.getElementById('run-distance').value);
      var paceMin = parseInt(document.getElementById('run-pace-min').value) || 0;
      var paceSec = parseInt(document.getElementById('run-pace-sec').value) || 0;
      var notes = document.getElementById('run-notes').value.trim();
      if (!date || !type || !distance || distance <= 0) { showToast('Please fill in all required fields'); return; }
      if (paceMin === 0 && paceSec === 0) { showToast('Please enter a pace'); return; }
      var paceTotal = paceMin * 60 + paceSec;
      var paceStr = paceMin + ':' + (paceSec < 10 ? '0' : '') + paceSec + '/km';
      var runs = getStore(RUN_STORAGE_KEY);
      runs.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2,8), date: date, type: type, distance: distance, paceSeconds: paceTotal, paceStr: paceStr, notes: notes });
      setStore(RUN_STORAGE_KEY, runs);
      showToast('Run saved!');
      logForm.reset();
      dateInput.value = todayStr();
      renderRecentRuns();
    });

    function renderRecentRuns() {
      var container = document.getElementById('recent-runs-list');
      if (!container) return;
      var runs = getStore(RUN_STORAGE_KEY).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (runs.length === 0) { container.innerHTML = '<div class="empty-state">No runs logged yet.</div>'; return; }
      container.innerHTML = '';
      runs.slice(0, 20).forEach(function (run) {
        var card = document.createElement('div');
        card.className = 'run-card';
        card.innerHTML =
          '<div class="run-card-main"><div class="run-card-header"><span class="run-card-type">' + run.type + '</span><span class="run-card-date">' + formatDate(run.date) + '</span></div><div class="run-card-stats"><div class="run-card-stat"><span class="run-card-stat-label">Distance</span><span class="run-card-stat-value">' + run.distance + ' km</span></div><div class="run-card-stat"><span class="run-card-stat-label">Pace</span><span class="run-card-stat-value">' + run.paceStr + '</span></div></div>' + (run.notes ? '<div class="run-card-notes">' + run.notes + '</div>' : '') + '</div><button class="run-card-delete" data-id="' + run.id + '">&times;</button>';
        container.appendChild(card);
      });
      container.querySelectorAll('.run-card-delete').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (confirm('Delete this run?')) {
            var runs = getStore(RUN_STORAGE_KEY).filter(function (r) { return r.id !== btn.getAttribute('data-id'); });
            setStore(RUN_STORAGE_KEY, runs);
            renderRecentRuns();
            showToast('Run deleted');
          }
        });
      });
    }

    renderRecentRuns();

    /* Running Calendar */
    var rCalMonth = new Date().getMonth();
    var rCalYear = new Date().getFullYear();

    document.getElementById('r-cal-prev').addEventListener('click', function () { rCalMonth--; if (rCalMonth < 0) { rCalMonth = 11; rCalYear--; } renderRunCalendar(); });
    document.getElementById('r-cal-next').addEventListener('click', function () { rCalMonth++; if (rCalMonth > 11) { rCalMonth = 0; rCalYear++; } renderRunCalendar(); });

    function renderRunCalendar() {
      var label = document.getElementById('r-cal-month-label');
      var grid = document.getElementById('r-cal-grid');
      if (!label || !grid) return;
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      label.textContent = months[rCalMonth] + ' ' + rCalYear;
      var runs = getStore(RUN_STORAGE_KEY);
      var runsByDate = {};
      runs.forEach(function (r) { if (!runsByDate[r.date]) runsByDate[r.date] = []; runsByDate[r.date].push(r); });
      var firstDay = new Date(rCalYear, rCalMonth, 1);
      var lastDay = new Date(rCalYear, rCalMonth + 1, 0);
      var startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      var todayS = todayStr();
      grid.innerHTML = '';
      for (var e = 0; e < startOffset; e++) { var ec = document.createElement('div'); ec.className = 'calendar-cell empty'; grid.appendChild(ec); }
      for (var day = 1; day <= lastDay.getDate(); day++) {
        var dateStr = rCalYear + '-' + String(rCalMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var cell = document.createElement('div');
        cell.className = 'calendar-cell' + (dateStr === todayS ? ' today' : '');
        cell.innerHTML = '<div class="calendar-cell-date">' + day + '</div>';
        if (runsByDate[dateStr]) { runsByDate[dateStr].forEach(function (r) { var re = document.createElement('div'); re.className = 'calendar-cell-run'; re.textContent = r.type; cell.appendChild(re); }); }
        (function (ds) { cell.addEventListener('click', function () { showRunDayDetail(ds); }); })(dateStr);
        grid.appendChild(cell);
      }
    }

    function showRunDayDetail(dateStr) {
      var runs = getStore(RUN_STORAGE_KEY).filter(function (r) { return r.date === dateStr; });
      var modal = document.getElementById('r-cal-modal');
      var title = document.getElementById('r-cal-modal-title');
      var body = document.getElementById('r-cal-modal-body');
      title.textContent = formatDate(dateStr);
      if (runs.length === 0) {
        body.innerHTML = '<div class="empty-state">No runs logged on this date.</div>';
      } else {
        body.innerHTML = '';
        runs.forEach(function (run) {
          var card = document.createElement('div');
          card.style.cssText = 'margin-bottom:12px;padding:12px;background:var(--bg-page);border-radius:var(--radius-sm);border-left:3px solid var(--running-color);display:flex;justify-content:space-between;align-items:flex-start;gap:12px;';
          card.innerHTML = '<div><div style="font-weight:700;margin-bottom:4px;">' + run.type + '</div><div style="font-size:14px;color:var(--text-secondary);">' + run.distance + ' km &bull; ' + run.paceStr + '</div>' + (run.notes ? '<div style="font-size:12px;color:var(--text-muted);margin-top:6px;font-style:italic;">' + run.notes + '</div>' : '') + '</div><button class="btn btn-danger btn-sm cal-delete-run" data-id="' + run.id + '">Delete</button>';
          body.appendChild(card);
        });
        body.querySelectorAll('.cal-delete-run').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (confirm('Delete this run?')) {
              var all = getStore(RUN_STORAGE_KEY).filter(function (r) { return r.id !== btn.getAttribute('data-id'); });
              setStore(RUN_STORAGE_KEY, all);
              showToast('Run deleted');
              renderRunCalendar();
              showRunDayDetail(dateStr);
            }
          });
        });
      }
      // Log run button
      var logBtn = document.createElement('button');
      logBtn.className = 'btn btn-primary';
      logBtn.style.cssText = 'margin-top:16px;width:100%;';
      logBtn.textContent = '+ Log a Run on this date';
      logBtn.addEventListener('click', function () {
        modal.classList.remove('active');
        window._showRunView('r-log');
        document.getElementById('run-date').value = dateStr;
      });
      body.appendChild(logBtn);
      modal.classList.add('active');
    }

    document.getElementById('r-cal-modal-close').addEventListener('click', function () { document.getElementById('r-cal-modal').classList.remove('active'); });
    document.getElementById('r-cal-modal').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('active'); });

    renderRunCalendar();

    /* Running Stats */
    function renderRunStats() {
      renderRunStatsSummary();
      renderMileageChart();
      renderPaceChart();
    }

    function renderRunStatsSummary() {
      var container = document.getElementById('r-stats-summary');
      if (!container) return;
      var runs = getStore(RUN_STORAGE_KEY);
      var now = new Date();
      var dayOfWeek = now.getDay();
      var mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      var monday = new Date(now); monday.setDate(now.getDate() + mondayOffset); monday.setHours(0,0,0,0);
      var sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23,59,59,999);
      var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      var monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      var weekRuns = runs.filter(function (r) { var d = new Date(r.date + 'T00:00:00'); return d >= monday && d <= sunday; });
      var monthRuns = runs.filter(function (r) { var d = new Date(r.date + 'T00:00:00'); return d >= monthStart && d <= monthEnd; });
      var weekDist = weekRuns.reduce(function (s, r) { return s + r.distance; }, 0);
      var monthDist = monthRuns.reduce(function (s, r) { return s + r.distance; }, 0);
      container.innerHTML =
        '<div class="stat-card"><div class="stat-value">' + weekRuns.length + '</div><div class="stat-label">Runs This Week</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + monthRuns.length + '</div><div class="stat-label">Runs This Month</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + weekDist.toFixed(1) + '</div><div class="stat-label">km This Week</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + monthDist.toFixed(1) + '</div><div class="stat-label">km This Month</div></div>';
    }

    function getWeeklyRunData() {
      var runs = getStore(RUN_STORAGE_KEY);
      if (runs.length === 0) return [];
      var weeks = {};
      runs.forEach(function (r) {
        var d = new Date(r.date + 'T00:00:00');
        var day = d.getDay(); var diff = d.getDate() - day + (day === 0 ? -6 : 1);
        var mon = new Date(d); mon.setDate(diff);
        var key = mon.getFullYear() + '-' + String(mon.getMonth() + 1).padStart(2, '0') + '-' + String(mon.getDate()).padStart(2, '0');
        if (!weeks[key]) weeks[key] = { totalKm: 0, totalPace: 0, count: 0 };
        weeks[key].totalKm += r.distance;
        weeks[key].totalPace += r.paceSeconds;
        weeks[key].count++;
      });
      return Object.keys(weeks).sort().map(function (k) { return { week: k, totalKm: weeks[k].totalKm, avgPace: Math.round(weeks[k].totalPace / weeks[k].count) }; });
    }

    function renderMileageChart() {
      var canvas = document.getElementById('chart-mileage');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width - 40; canvas.height = 250;
      var data = getWeeklyRunData();
      if (data.length === 0) { ctx.font = '14px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center'; ctx.fillText('No data yet — log some runs to see mileage trend', canvas.width / 2, 125); return; }
      drawLineChart(ctx, canvas.width, canvas.height, data.map(function (d) { return d.week; }), data.map(function (d) { return d.totalKm; }), 'km', '#2563EB', false);
    }

    function renderPaceChart() {
      var canvas = document.getElementById('chart-pace');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width - 40; canvas.height = 250;
      var data = getWeeklyRunData();
      if (data.length === 0) { ctx.font = '14px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center'; ctx.fillText('No data yet — log some runs to see pace trend', canvas.width / 2, 125); return; }
      drawLineChart(ctx, canvas.width, canvas.height, data.map(function (d) { return d.week; }), data.map(function (d) { return d.avgPace; }), '/km', '#0EA5E9', true);
    }

    function drawLineChart(ctx, w, h, labels, values, unit, color, invertY) {
      var pad = { top: 30, right: 20, bottom: 50, left: 55 };
      var cW = w - pad.left - pad.right, cH = h - pad.top - pad.bottom;
      ctx.clearRect(0, 0, w, h);
      var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
      if (min === max) { min -= 1; max += 1; }
      var range = max - min;
      function gX(i) { return values.length === 1 ? pad.left + cW / 2 : pad.left + (i / (values.length - 1)) * cW; }
      function gY(v) { var n = (v - min) / range; return invertY ? pad.top + n * cH : pad.top + (1 - n) * cH; }
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
      for (var g = 0; g <= 5; g++) {
        var gy = pad.top + (g / 5) * cH;
        ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(pad.left + cW, gy); ctx.stroke();
        var gv = invertY ? min + (g / 5) * range : max - (g / 5) * range;
        ctx.font = '11px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'right';
        if (unit === '/km') { var m = Math.floor(gv / 60), s = Math.round(gv % 60); ctx.fillText(m + ':' + (s < 10 ? '0' : '') + s, pad.left - 8, gy + 4); }
        else ctx.fillText(gv.toFixed(1), pad.left - 8, gy + 4);
      }
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      for (var i = 0; i < values.length; i++) { var x = gX(i), y = gY(values[i]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
      for (var j = 0; j < values.length; j++) { ctx.beginPath(); ctx.arc(gX(j), gY(values[j]), 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
      var step = Math.max(1, Math.floor(labels.length / 8));
      for (var k = 0; k < labels.length; k += step) { var parts = labels[k].split('-'); ctx.fillText(parts[2] + '/' + parts[1], gX(k), h - pad.bottom + 20); }
    }
  }

  /* =========================================================
     STRENGTH MODE
     ========================================================= */

  var strengthInitialized = false;

  function initStrength() {
    if (strengthInitialized) { renderStrengthOverview(); return; }
    strengthInitialized = true;

    // Navigation
    var navLinks = strengthApp.querySelectorAll('.nav-link[data-view]');
    var sections = strengthApp.querySelectorAll('.view-section');

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showStrengthView(link.getAttribute('data-view'));
      });
    });

    function showStrengthView(viewId) {
      sections.forEach(function (s) { s.classList.remove('active'); });
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      var target = document.getElementById('view-' + viewId);
      if (target) target.classList.add('active');
      navLinks.forEach(function (l) { if (l.getAttribute('data-view') === viewId) l.classList.add('active'); });
      if (viewId === 's-overview') renderStrengthOverview();
      if (viewId === 's-log') renderRecentSessions();
      if (viewId === 's-calendar') renderStrengthCalendar();
      if (viewId === 's-stats') renderStrengthStats();
    }

    window._showStrengthView = showStrengthView;

    /* Overview */
    renderStrengthOverview();

    /* Log Session Form */
    var sForm = document.getElementById('s-log-form');
    var sTypeSelect = document.getElementById('s-session-type');
    var sDateInput = document.getElementById('s-session-date');
    sDateInput.value = todayStr();

    sTypeSelect.addEventListener('change', function () {
      var type = sTypeSelect.value;
      var selector = document.getElementById('s-exercise-selector');
      var checkboxes = document.getElementById('s-exercise-checkboxes');
      var inputs = document.getElementById('s-exercise-inputs');
      var saveGroup = document.getElementById('s-save-group');
      inputs.innerHTML = '';
      saveGroup.style.display = 'none';

      if (!type) { selector.style.display = 'none'; return; }

      selector.style.display = 'block';
      checkboxes.innerHTML = '';

      // Show all exercises from all groups
      ['Push', 'Pull', 'Legs'].forEach(function (group) {
        var groupHeader = document.createElement('div');
        groupHeader.className = 'exercise-group-header';
        groupHeader.textContent = group;
        checkboxes.appendChild(groupHeader);

        var groupGrid = document.createElement('div');
        groupGrid.className = 'exercise-checkbox-grid';
        STRENGTH_EXERCISES[group].forEach(function (ex) {
          var label = document.createElement('label');
          label.className = 'exercise-checkbox-label';
          label.innerHTML = '<input type="checkbox" value="' + ex + '" class="s-ex-checkbox"> ' + ex;
          groupGrid.appendChild(label);
        });
        checkboxes.appendChild(groupGrid);
      });

      // When checkboxes change, render weight/sets inputs
      checkboxes.querySelectorAll('.s-ex-checkbox').forEach(function (cb) {
        cb.addEventListener('change', function () { renderExerciseInputs(); });
      });
    });

    function renderExerciseInputs() {
      var inputs = document.getElementById('s-exercise-inputs');
      var saveGroup = document.getElementById('s-save-group');
      inputs.innerHTML = '';
      var checked = document.querySelectorAll('.s-ex-checkbox:checked');
      if (checked.length === 0) { saveGroup.style.display = 'none'; return; }
      saveGroup.style.display = 'block';

      checked.forEach(function (cb) {
        var name = cb.value;
        var block = document.createElement('div');
        block.className = 'exercise-input-block';
        block.setAttribute('data-exercise-block', name);
        block.innerHTML =
          '<div class="exercise-input-title">' + name + '</div>' +
          '<div class="exercise-entries" data-exercise-entries="' + name + '">' +
            '<div class="exercise-entry">' +
              '<div class="exercise-input-row"><label class="form-label">Weight (kg)</label><input type="number" class="form-input s-weight-input" data-exercise="' + name + '" min="0" step="0.5" placeholder="kg"></div>' +
              '<div class="exercise-input-row"><label class="form-label">Sets/Reps</label><input type="text" class="form-input s-sets-input" data-exercise="' + name + '" placeholder="e.g. 4x10"></div>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn btn-secondary btn-sm s-add-entry-btn" data-exercise="' + name + '" style="margin-top:6px;">+ Add another</button>';
        inputs.appendChild(block);
      });

      // Add entry button handlers
      inputs.querySelectorAll('.s-add-entry-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var exName = btn.getAttribute('data-exercise');
          var container = document.querySelector('[data-exercise-entries="' + exName + '"]');
          var entry = document.createElement('div');
          entry.className = 'exercise-entry';
          entry.style.marginTop = '6px';
          entry.style.paddingTop = '6px';
          entry.style.borderTop = '1px dashed var(--border-color)';
          entry.innerHTML =
            '<div class="exercise-input-row"><label class="form-label">Weight (kg)</label><input type="number" class="form-input s-weight-input" data-exercise="' + exName + '" min="0" step="0.5" placeholder="kg"></div>' +
            '<div class="exercise-input-row"><label class="form-label">Sets/Reps</label><input type="text" class="form-input s-sets-input" data-exercise="' + exName + '" placeholder="e.g. 2x10"></div>';
          container.appendChild(entry);
        });
      });
    }

    sForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var date = sDateInput.value;
      var type = sTypeSelect.value;
      if (!date || !type) { showToast('Please select date and type'); return; }

      var exercises = [];
      // Gather all entries grouped by exercise
      var blocks = document.querySelectorAll('[data-exercise-block]');
      blocks.forEach(function (block) {
        var exName = block.getAttribute('data-exercise-block');
        var entries = [];
        var weightInputs = block.querySelectorAll('.s-weight-input');
        var setsInputs = block.querySelectorAll('.s-sets-input');
        for (var i = 0; i < weightInputs.length; i++) {
          var weight = parseFloat(weightInputs[i].value) || 0;
          var sets = setsInputs[i] ? setsInputs[i].value.trim() : '';
          if (weight > 0 && sets) {
            entries.push({ weight: weight, sets: sets });
          }
        }
        if (entries.length > 0) {
          exercises.push({ name: exName, entries: entries });
        }
      });

      if (exercises.length === 0) { showToast('Please enter weight and sets/reps for at least one exercise'); return; }

      var sessions = getStore(STRENGTH_STORAGE_KEY);
      sessions.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), date: date, type: type, exercises: exercises });
      setStore(STRENGTH_STORAGE_KEY, sessions);
      showToast('Session saved!');
      sForm.reset();
      sDateInput.value = todayStr();
      document.getElementById('s-exercise-selector').style.display = 'none';
      document.getElementById('s-exercise-inputs').innerHTML = '';
      document.getElementById('s-save-group').style.display = 'none';
      renderRecentSessions();
    });

    renderRecentSessions();

    /* Strength Stats — weight progression charts */
    function renderStrengthStats() {
      var sessions = getStore(STRENGTH_STORAGE_KEY);
      ['Push', 'Pull', 'Legs'].forEach(function (group) {
        var container = document.getElementById('s-stats-' + group.toLowerCase());
        if (!container) return;
        container.innerHTML = '';

        STRENGTH_EXERCISES[group].forEach(function (exName) {
          var monthlyData = getMonthlyMaxWeight(sessions, exName);
          if (monthlyData.length === 0) return;

          var card = document.createElement('div');
          card.className = 'card';
          card.style.marginBottom = '16px';
          card.innerHTML = '<div class="card-title">' + exName + '</div>';

          var canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 200;
          card.appendChild(canvas);
          container.appendChild(card);

          (function (cvs, data) {
            setTimeout(function () {
              var ctx = cvs.getContext('2d');
              var rect = cvs.parentElement.getBoundingClientRect();
              cvs.width = rect.width - 40;
              cvs.height = 180;
              var labels = data.map(function (d) { return d.month; });
              var values = data.map(function (d) { return d.maxWeight; });
              drawStrengthChart(ctx, cvs.width, cvs.height, labels, values);
            }, 50);
          })(canvas, monthlyData);
        });

        if (container.innerHTML === '') {
          container.innerHTML = '<div class="empty-state">No data yet for ' + group + ' exercises.</div>';
        }
      });
    }

    function getMonthlyMaxWeight(sessions, exerciseName) {
      var months = {};
      sessions.forEach(function (session) {
        session.exercises.forEach(function (ex) {
          if (ex.name !== exerciseName) return;
          var d = new Date(session.date + 'T00:00:00');
          var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
          var maxWeight = 0;
          if (ex.entries && ex.entries.length > 0) {
            ex.entries.forEach(function (ent) { if (ent.weight > maxWeight) maxWeight = ent.weight; });
          } else if (ex.weight) {
            maxWeight = ex.weight;
          }
          if (maxWeight > 0) {
            if (!months[monthKey] || maxWeight > months[monthKey]) {
              months[monthKey] = maxWeight;
            }
          }
        });
      });
      return Object.keys(months).sort().map(function (k) { return { month: k, maxWeight: months[k] }; });
    }

    function drawStrengthChart(ctx, w, h, labels, values) {
      var pad = { top: 20, right: 20, bottom: 40, left: 50 };
      var cW = w - pad.left - pad.right;
      var cH = h - pad.top - pad.bottom;
      ctx.clearRect(0, 0, w, h);
      if (values.length === 0) return;
      var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
      if (min === max) { min -= 2; max += 2; }
      var range = max - min;
      function gX(i) { return values.length === 1 ? pad.left + cW / 2 : pad.left + (i / (values.length - 1)) * cW; }
      function gY(v) { return pad.top + (1 - (v - min) / range) * cH; }
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var gy = pad.top + (g / 4) * cH;
        ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(pad.left + cW, gy); ctx.stroke();
        var gv = max - (g / 4) * range;
        ctx.font = '11px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'right';
        ctx.fillText(gv.toFixed(1) + 'kg', pad.left - 6, gy + 4);
      }
      ctx.beginPath(); ctx.strokeStyle = '#7C3AED'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      for (var i = 0; i < values.length; i++) { var x = gX(i), y = gY(values[i]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
      for (var j = 0; j < values.length; j++) { ctx.beginPath(); ctx.arc(gX(j), gY(values[j]), 4, 0, Math.PI * 2); ctx.fillStyle = '#7C3AED'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
      var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var step = Math.max(1, Math.floor(labels.length / 10));
      for (var k = 0; k < labels.length; k += step) { var parts = labels[k].split('-'); ctx.fillText(monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0].slice(2), gX(k), h - pad.bottom + 18); }
    }

    /* Strength Calendar */
    var sCalMonth = new Date().getMonth();
    var sCalYear = new Date().getFullYear();

    document.getElementById('s-cal-prev').addEventListener('click', function () { sCalMonth--; if (sCalMonth < 0) { sCalMonth = 11; sCalYear--; } renderStrengthCalendar(); });
    document.getElementById('s-cal-next').addEventListener('click', function () { sCalMonth++; if (sCalMonth > 11) { sCalMonth = 0; sCalYear++; } renderStrengthCalendar(); });

    document.getElementById('s-cal-modal-close').addEventListener('click', function () { document.getElementById('s-cal-modal').classList.remove('active'); });
    document.getElementById('s-cal-modal').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('active'); });

    renderStrengthCalendar();

    function renderStrengthCalendar() {
      var label = document.getElementById('s-cal-month-label');
      var grid = document.getElementById('s-cal-grid');
      if (!label || !grid) return;
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      label.textContent = months[sCalMonth] + ' ' + sCalYear;
      var sessions = getStore(STRENGTH_STORAGE_KEY);
      var byDate = {};
      sessions.forEach(function (s) { if (!byDate[s.date]) byDate[s.date] = []; byDate[s.date].push(s); });
      var firstDay = new Date(sCalYear, sCalMonth, 1);
      var lastDay = new Date(sCalYear, sCalMonth + 1, 0);
      var startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      var todayS = todayStr();
      grid.innerHTML = '';
      for (var e = 0; e < startOffset; e++) { var ec = document.createElement('div'); ec.className = 'calendar-cell empty'; grid.appendChild(ec); }
      for (var day = 1; day <= lastDay.getDate(); day++) {
        var dateStr = sCalYear + '-' + String(sCalMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var cell = document.createElement('div');
        cell.className = 'calendar-cell' + (dateStr === todayS ? ' today' : '');
        cell.innerHTML = '<div class="calendar-cell-date">' + day + '</div>';
        if (byDate[dateStr]) { byDate[dateStr].forEach(function (s) { var re = document.createElement('div'); re.className = 'calendar-cell-run'; re.style.background = 'rgba(139,92,246,0.12)'; re.style.color = '#7C3AED'; re.textContent = s.type; cell.appendChild(re); }); }
        (function (ds) { cell.addEventListener('click', function () { showStrengthDayDetail(ds); }); })(dateStr);
        grid.appendChild(cell);
      }
    }

    function showStrengthDayDetail(dateStr) {
      var sessions = getStore(STRENGTH_STORAGE_KEY).filter(function (s) { return s.date === dateStr; });
      var modal = document.getElementById('s-cal-modal');
      var title = document.getElementById('s-cal-modal-title');
      var body = document.getElementById('s-cal-modal-body');
      title.textContent = formatDate(dateStr);
      body.innerHTML = '';
      if (sessions.length === 0) {
        body.innerHTML = '<div class="empty-state">No sessions on this date.</div>';
      } else {
        sessions.forEach(function (session) {
          var card = document.createElement('div');
          card.style.cssText = 'margin-bottom:16px;padding:12px;background:var(--bg-page);border-radius:var(--radius-sm);border-left:3px solid #7C3AED;';
          var exHtml = session.exercises.map(function (ex) {
            // Support both old format (single weight/sets) and new format (entries array)
            if (ex.entries && ex.entries.length > 0) {
              var entriesStr = ex.entries.map(function (ent) { return ent.weight + 'kg (' + ent.sets + ')'; }).join(', ');
              return '<div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">' + ex.name + ' — ' + entriesStr + '</div>';
            } else {
              return '<div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">' + ex.name + ' — ' + ex.weight + 'kg (' + ex.sets + ')</div>';
            }
          }).join('');
          card.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
              '<div><div style="font-weight:700;margin-bottom:4px;">' + session.type + '</div>' + exHtml + '</div>' +
              '<div style="display:flex;gap:6px;">' +
                '<button class="btn btn-secondary btn-sm s-cal-edit" data-id="' + session.id + '">Edit</button>' +
                '<button class="btn btn-danger btn-sm s-cal-delete" data-id="' + session.id + '">Delete</button>' +
              '</div>' +
            '</div>';
          body.appendChild(card);
        });
        body.querySelectorAll('.s-cal-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (confirm('Delete this session?')) {
              var all = getStore(STRENGTH_STORAGE_KEY).filter(function (s) { return s.id !== btn.getAttribute('data-id'); });
              setStore(STRENGTH_STORAGE_KEY, all);
              showToast('Session deleted');
              renderStrengthCalendar();
              showStrengthDayDetail(dateStr);
            }
          });
        });
        body.querySelectorAll('.s-cal-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var sessionId = btn.getAttribute('data-id');
            modal.classList.remove('active');
            showEditSessionForm(sessionId);
          });
        });
      }
      modal.classList.add('active');
    }

    function showEditSessionForm(sessionId) {
      var sessions = getStore(STRENGTH_STORAGE_KEY);
      var session = sessions.find(function (s) { return s.id === sessionId; });
      if (!session) return;

      var modal = document.getElementById('s-cal-modal');
      var title = document.getElementById('s-cal-modal-title');
      var body = document.getElementById('s-cal-modal-body');
      title.textContent = 'Edit Session — ' + formatDate(session.date);
      body.innerHTML = '';

      var form = document.createElement('form');
      form.id = 's-edit-form';

      // Type display
      form.innerHTML = '<div style="font-weight:700;margin-bottom:12px;">' + session.type + ' — ' + formatDate(session.date) + '</div>';

      // For each exercise, show editable entries
      session.exercises.forEach(function (ex, exIdx) {
        var block = document.createElement('div');
        block.className = 'exercise-input-block';
        block.setAttribute('data-edit-exercise', exIdx);

        var entries = ex.entries || [{ weight: ex.weight, sets: ex.sets }];
        var entriesHtml = entries.map(function (ent, entIdx) {
          return '<div class="exercise-entry' + (entIdx > 0 ? '" style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border-color);' : '') + '">' +
            '<div class="exercise-input-row"><label class="form-label">Weight (kg)</label><input type="number" class="form-input edit-weight" value="' + ent.weight + '" min="0" step="0.5"></div>' +
            '<div class="exercise-input-row"><label class="form-label">Sets/Reps</label><input type="text" class="form-input edit-sets" value="' + ent.sets + '"></div>' +
          '</div>';
        }).join('');

        block.innerHTML = '<div class="exercise-input-title">' + ex.name + '</div>' + entriesHtml +
          '<button type="button" class="btn btn-secondary btn-sm edit-add-entry" style="margin-top:6px;" data-edit-ex="' + exIdx + '">+ Add another</button>';
        form.appendChild(block);
      });

      var actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:10px;margin-top:16px;';
      actions.innerHTML = '<button type="submit" class="btn btn-primary">Save Changes</button><button type="button" class="btn btn-secondary" id="s-edit-cancel">Cancel</button>';
      form.appendChild(actions);
      body.appendChild(form);

      // Add entry buttons
      form.querySelectorAll('.edit-add-entry').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var entry = document.createElement('div');
          entry.className = 'exercise-entry';
          entry.style.cssText = 'margin-top:6px;padding-top:6px;border-top:1px dashed var(--border-color);';
          entry.innerHTML =
            '<div class="exercise-input-row"><label class="form-label">Weight (kg)</label><input type="number" class="form-input edit-weight" min="0" step="0.5" placeholder="kg"></div>' +
            '<div class="exercise-input-row"><label class="form-label">Sets/Reps</label><input type="text" class="form-input edit-sets" placeholder="e.g. 2x10"></div>';
          btn.parentElement.insertBefore(entry, btn);
        });
      });

      // Cancel
      form.querySelector('#s-edit-cancel').addEventListener('click', function () {
        modal.classList.remove('active');
      });

      // Save
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var blocks = form.querySelectorAll('[data-edit-exercise]');
        var updatedExercises = [];
        blocks.forEach(function (block, idx) {
          var weights = block.querySelectorAll('.edit-weight');
          var sets = block.querySelectorAll('.edit-sets');
          var entries = [];
          for (var i = 0; i < weights.length; i++) {
            var w = parseFloat(weights[i].value) || 0;
            var s = sets[i] ? sets[i].value.trim() : '';
            if (w > 0 && s) entries.push({ weight: w, sets: s });
          }
          if (entries.length > 0) {
            updatedExercises.push({ name: session.exercises[idx].name, entries: entries });
          }
        });

        // Update the session in storage
        var allSessions = getStore(STRENGTH_STORAGE_KEY);
        var idx = allSessions.findIndex(function (s) { return s.id === sessionId; });
        if (idx !== -1) {
          allSessions[idx].exercises = updatedExercises;
          setStore(STRENGTH_STORAGE_KEY, allSessions);
          showToast('Session updated!');
          renderStrengthCalendar();
        }
        modal.classList.remove('active');
      });

      modal.classList.add('active');
    }

    function renderRecentSessions() {
      var container = document.getElementById('s-recent-sessions');
      if (!container) return;
      var sessions = getStore(STRENGTH_STORAGE_KEY).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (sessions.length === 0) { container.innerHTML = '<div class="empty-state">No sessions logged yet.</div>'; return; }
      container.innerHTML = '';
      sessions.slice(0, 15).forEach(function (session) {
        var card = document.createElement('div');
        card.className = 'run-card';
        card.style.borderLeftColor = '#7C3AED';
        var exSummary = session.exercises.map(function (ex) {
          if (ex.entries && ex.entries.length > 0) {
            return ex.name + ' ' + ex.entries.map(function (ent) { return ent.weight + 'kg (' + ent.sets + ')'; }).join(', ');
          }
          return ex.name + ' ' + ex.weight + 'kg (' + ex.sets + ')';
        }).join('; ');
        card.innerHTML = '<div class="run-card-main"><div class="run-card-header"><span class="run-card-type" style="background:rgba(139,92,246,0.1);color:#7C3AED;">' + session.type + '</span><span class="run-card-date">' + formatDate(session.date) + '</span></div><div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">' + exSummary + '</div></div><button class="run-card-delete s-recent-delete" data-id="' + session.id + '">&times;</button>';
        container.appendChild(card);
      });
      container.querySelectorAll('.s-recent-delete').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (confirm('Delete this session?')) {
            var all = getStore(STRENGTH_STORAGE_KEY).filter(function (s) { return s.id !== btn.getAttribute('data-id'); });
            setStore(STRENGTH_STORAGE_KEY, all);
            renderRecentSessions();
            showToast('Session deleted');
          }
        });
      });
    }
  }

  /* Strength Overview */
  function renderStrengthOverview() {
    // Sessions this month
    var sessions = getStore(STRENGTH_STORAGE_KEY);
    var now = new Date();
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    var monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    var monthSessions = sessions.filter(function (s) { var d = new Date(s.date + 'T00:00:00'); return d >= monthStart && d <= monthEnd; });
    var countEl = document.getElementById('s-sessions-count');
    if (countEl) countEl.textContent = monthSessions.length;

    // Exercise lists with highest weight + sets/reps all time
    ['Push', 'Pull', 'Legs'].forEach(function (group) {
      var containerId = 's-' + group.toLowerCase() + '-list';
      var container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';
      STRENGTH_EXERCISES[group].forEach(function (ex) {
        var best = getBestWeight(sessions, ex);
        var row = document.createElement('div');
        row.className = 'exercise-list-row';
        row.innerHTML = '<span class="exercise-name">' + ex + '</span><span class="exercise-last-weight">' + (best ? best.weight + ' kg — ' + best.sets : '—') + '</span>';
        container.appendChild(row);
      });
    });
  }

  function getBestWeight(sessions, exerciseName) {
    // Find the highest weight recorded for this exercise across all sessions
    var best = null;
    sessions.forEach(function (session) {
      session.exercises.forEach(function (ex) {
        if (ex.name !== exerciseName) return;
        if (ex.entries && ex.entries.length > 0) {
          ex.entries.forEach(function (ent) {
            if (!best || ent.weight > best.weight) {
              best = { weight: ent.weight, sets: ent.sets };
            }
          });
        } else if (ex.weight) {
          // Legacy format
          if (!best || ex.weight > best.weight) {
            best = { weight: ex.weight, sets: ex.sets || '' };
          }
        }
      });
    });
    return best;
  }

})();
