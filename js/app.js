// ── Shared state ────────────────────────────────────────────
const App = (() => {
  const KEYS = { raw: 'etl_raw', clean: 'etl_clean', meta: 'etl_meta' };

  function save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch(e) { console.warn('Storage full:', e); return false; }
  }
  function load(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch(e) { return null; }
  }

  return {
    saveRaw:   d => save(KEYS.raw,   d),
    loadRaw:   () => load(KEYS.raw),
    saveClean: d => save(KEYS.clean, d),
    loadClean: () => load(KEYS.clean),
    saveMeta:  d => save(KEYS.meta,  d),
    loadMeta:  () => load(KEYS.meta),
    clearAll:  () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),

    // Count helpers for nav badges
    rawCount:   () => { const d = load(KEYS.raw);   return d ? d.length : 0; },
    cleanCount: () => { const d = load(KEYS.clean); return d ? d.length : 0; },

    // Format numbers
    fmt: n => n == null ? '—' : Number(n).toLocaleString(),
    fmtDate: s => s ? new Date(s).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—',
  };
})();

// ── Nav badge updater ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const rc = App.rawCount();
  const cc = App.cleanCount();
  const rb = document.getElementById('badge-raw');
  const cb = document.getElementById('badge-clean');
  const db = document.getElementById('badge-dash');
  if (rb && rc) rb.textContent = rc > 999 ? '999+' : rc;
  if (cb && cc) { cb.textContent = cc > 999 ? '999+' : cc; }
  if (db && cc) { db.textContent = cc > 999 ? '999+' : cc; }

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.includes(href.replace('.html',''))) a.classList.add('active');
  });
});
