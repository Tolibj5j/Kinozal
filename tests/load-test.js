/*
 * KinoShow yuklama (stress) testi.
 * Ishlatish: saytni oching, F12 → Console, shu faylni nusxalab qo'ying, keyin:
 *   await KSLoadTest.run()            // 1 000 / 10 000 / 50 000 buyurtma bilan
 *   KSLoadTest.restore()              // test oldidagi ma'lumotlarni qaytarish
 * Test oldidan localStorage dagi ma'lumotlar zaxiraga olinadi va oxirida qaytariladi.
 */
(function () {
  const KEYS = ['orders', 'extra', 'promo', 'user', 'city'];
  const BACKUP = 'ks-loadtest-backup';

  function rng(seed) { // deterministik: har safar bir xil ma'lumot
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  const NAMES = ['Aziz', 'Dilnoza', 'Jasur', 'Madina', 'Sardor', 'Nodira', 'Bekzod', 'Shahzoda', 'Otabek', 'Malika', 'Javohir', 'Gulnora'];
  const SURN = ['Karimov', 'Rahimova', 'Toshmatov', 'Yusupova', 'Aliyev', 'Ergasheva', 'Qodirov', 'Saidova'];

  // Haqiqiy seanslardan (showsOf) foydalanib buyurtmalar yaratadi, bitta joy ikki marta sotilmaydi
  function makeOrders(n, seed = 42) {
    const r = rng(seed);
    const out = [];
    const taken = new Map();
    const pays = ['Payme', 'Click', 'Uzcard', 'Humo'];
    let guard = 0;
    while (out.length < n && guard++ < n * 20) {
      const ci = Math.floor(r() * CIN.length);
      const di = Math.floor(r() * 7);
      const date = dk(di);
      const list = showsOf(ci, date);
      if (!list.length) continue;
      const s = list[Math.floor(r() * list.length)];
      const time = s.t[Math.floor(r() * s.t.length)];
      const B = { ci, mid: s.m.id, date, time, sel: [], sn: {} };
      const key = skey(B);
      const c = CIN[ci];
      if (!taken.has(key)) taken.set(key, sold({ ...B }));
      const used = taken.get(key);
      const want = 1 + Math.floor(r() * 4);
      const row = Math.floor(r() * c.r);
      const start = 1 + Math.floor(r() * (c.c - want + 1));
      const seats = [];
      for (let k = 0; k < want; k++) { const id = String.fromCharCode(65 + row) + (start + k); if (!used.has(id)) seats.push(id); }
      if (!seats.length) continue;
      seats.forEach((x) => used.add(x));
      const total = seats.reduce((a, x) => a + price(ci, s.m, x.charCodeAt(0) - 65), 0);
      const name = NAMES[Math.floor(r() * NAMES.length)] + ' ' + SURN[Math.floor(r() * SURN.length)];
      const ts = Date.now() - Math.floor(r() * 7 * 864e5);
      out.push({
        code: 'KS-' + (hash(key + seats.join() + ts + out.length) % 900000 + 100000),
        key, ci, mid: s.m.id, date, time, seats: seats.sort(), sn: r() < 0.4 ? { pop: 1 } : {},
        total, name, phone: '+998 9' + Math.floor(r() * 10) + ' ' + String(Math.floor(r() * 1e7)).padStart(7, '0'),
        pay: pays[Math.floor(r() * 4)], ts,
      });
    }
    return out.sort((a, b) => b.ts - a.ts);
  }

  function makeExtra(n, seed = 7) {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => ({
      id: 'x' + (1e12 + i), type: r() < 0.25 ? 'shou' : 'kino', t: 'Test film ' + (i + 1),
      lang: ['uz', 'ru', 'en'][Math.floor(r() * 3)], fmt: ['2D', '3D', 'IMAX'][Math.floor(r() * 3)], r: 8, d: 90 + Math.floor(r() * 60),
      g: [GEN[Math.floor(r() * GEN.length)]], c: `hsl(${Math.floor(r() * 360)} 55% 28%)`, ds: 'Test uchun yaratilgan.',
    }));
  }

  const time = (fn, reps = 1) => { const t = performance.now(); for (let i = 0; i < reps; i++) fn(); return +((performance.now() - t) / reps).toFixed(2); };
  const render = (hashStr) => { location.hash = hashStr; draw(); };

  function measure(label) {
    const ord = orders();
    const any = ord[0];
    const res = { label, orders: ord.length, extra: S.extra.length, storageKB: Math.round(((localStorage.getItem('orders') || '').length + (localStorage.getItem('extra') || '').length) * 2 / 1024) };
    res.parseOrdersMs = time(() => orders(), 5);
    res.homeMs = time(() => render('#/'), 3);
    res.moviesMs = time(() => render('#/movies'), 3);
    res.movieDetailMs = time(() => render('#/movie/k1'), 3);
    S.adm = true;
    res.adminMs = time(() => render('#/admin'), 3);
    res.ordersPageMs = time(() => render('#/orders'), 1);
    if (any) {
      const [ci, mid, date, t] = any.key.split('|');
      S.B = { ci: +ci, mid, date, time: t, sel: [], sn: {}, promo: '', pay: 'Payme', name: 'Test', phone: '+998901234567' };
      res.seatMapMs = time(() => render('#/seats'), 3);
      res.seatClickMs = time(() => { ACT.seat('A1'); ACT.seat('A1'); }, 5);
      res.ticketPageMs = time(() => render('#/ticket/' + any.code), 3);
    }
    // Takrorlangan chipta kodlari
    const seen = new Map();
    ord.forEach((o) => seen.set(o.code, (seen.get(o.code) || 0) + 1));
    res.duplicateCodes = [...seen.values()].filter((v) => v > 1).length;
    // Bitta joy ikki marta sotilganmi (buyurtmalar orasida)
    const seatSet = new Set(); let dbl = 0;
    ord.forEach((o) => o.seats.forEach((s) => { const k = o.key + '#' + s; if (seatSet.has(k)) dbl++; seatSet.add(k); }));
    res.doubleSoldSeats = dbl;
    res.revenue = ord.reduce((a, o) => a + o.total, 0);
    return res;
  }

  // Haqiqiy foydalanuvchi kabi: zal → 2 joy → to'lov
  function realPurchase() {
    const date = dk(1);
    const list = showsOf(0, date);
    const s = list[0];
    ACT.book(`0|${s.m.id}|${date}|${s.t[0]}`); draw();
    const before = orders().length;
    ACT.auto(2);
    const sel = S.B.sel.slice();
    ACT.next(); draw();
    $('#name').value = 'Yuklama Test'; $('#phone').value = '+998 90 111 22 33';
    const t = performance.now();
    ACT.buy();
    const ms = +(performance.now() - t).toFixed(2);
    const after = orders();
    const ok = after.length === before + 1 && after[0].seats.join() === sel.slice().sort().join();
    // O'sha joylarni qayta sotib olishga urinish
    S.B = { ci: 0, mid: s.m.id, date, time: s.t[0], sel, sn: {}, promo: '', pay: 'Payme', name: 'Ikkinchi', phone: '+998901112233' };
    draw();
    const blocked = S.B.sel.length === 0; // seatsP band joylarni tanlovdan olib tashlaydi
    return { buyMs: ms, saved: ok, sameSeatsBlocked: blocked };
  }

  // localStorage sig'imini topish (qancha buyurtmagacha saqlanadi)
  function quotaProbe() {
    const one = JSON.stringify(makeOrders(1)[0]).length;
    let lo = 0, hi = 400000, last = 0;
    const base = makeOrders(1)[0];
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const arr = new Array(mid).fill(base);
      try { localStorage.setItem('ks-quota-probe', JSON.stringify(arr)); last = mid; lo = mid + 1; } catch (e) { hi = mid - 1; }
      localStorage.removeItem('ks-quota-probe');
    }
    return { bytesPerOrder: one, maxOrders: last };
  }

  async function run(levels = [1000, 10000, 50000]) {
    if (!localStorage.getItem(BACKUP)) {
      const b = {}; KEYS.forEach((k) => { b[k] = localStorage.getItem(k); });
      localStorage.setItem(BACKUP, JSON.stringify(b));
    }
    const results = { startedAt: new Date().toISOString(), userAgent: navigator.userAgent, levels: [] };
    localStorage.removeItem('orders'); S.extra = []; sv('extra', []);
    results.levels.push(measure('Bo\'sh (0 buyurtma)'));
    for (const n of levels) {
      const t = performance.now();
      const data = makeOrders(n);
      const genMs = +(performance.now() - t).toFixed(1);
      sv('orders', data);
      const stored = orders().length;
      const m = measure(`${n} buyurtma`);
      m.generateMs = genMs; m.savedOk = stored === data.length;
      results.levels.push(m);
      await new Promise((r) => setTimeout(r, 0));
    }
    S.extra = makeExtra(500); sv('extra', S.extra);
    results.levels.push(measure(`${levels[levels.length - 1]} buyurtma + 500 qo'shimcha film`));
    results.realPurchase = realPurchase();
    results.quota = quotaProbe();
    results.finishedAt = new Date().toISOString();
    window.__KS_LAST = results;
    return results;
  }

  function restore() {
    const b = JSON.parse(localStorage.getItem(BACKUP) || 'null');
    if (!b) return false;
    KEYS.forEach((k) => { if (b[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, b[k]); });
    localStorage.removeItem(BACKUP);
    S.extra = ld('extra', []); S.B = null; S.adm = false;
    location.hash = '#/'; draw();
    return true;
  }

  window.KSLoadTest = { run, restore, makeOrders, makeExtra };
})();
