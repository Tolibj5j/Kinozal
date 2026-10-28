/*
 * Foydalanuvchilar: ro'yxatdan o'tish, kirish, sessiya.
 * Parol ochiq saqlanmaydi: tuz (salt) + SHA-256 xesh.
 * Ma'lumotlar brauzerning localStorage xotirasida ("users" kaliti) saqlanadi.
 */
(function () {
  const KEY = 'users', SES = 'session';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const write = (u) => { try { localStorage.setItem(KEY, JSON.stringify(u)); return true; } catch (e) { return false; } };
  const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  const rnd = (n) => { const b = new Uint8Array(n); crypto.getRandomValues(b); return hex(b); };

  function normPhone(p) {
    let d = String(p || '').replace(/\D/g, '');
    if (d.length === 9) d = '998' + d;
    return d.length === 12 && d.startsWith('998') ? d : null;
  }
  const fmtPhone = (d) => (d && d.length === 12 ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : d || '');

  async function hash(pw, salt, algo) {
    const s = salt + ':' + pw;
    if ((algo || 'sha256') === 'sha256' && window.crypto && crypto.subtle) {
      return 'sha256:' + hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
    }
    // Zaxira (fayl sifatida ochilganda crypto.subtle bo'lmaydi)
    let a = 2166136261, b = 5381;
    for (let k = 0; k < 2000; k++) for (const c of s + k) { a ^= c.charCodeAt(0); a = Math.imul(a, 16777619); b = Math.imul(b, 33) ^ c.charCodeAt(0); }
    return 'fnv:' + (a >>> 0).toString(16) + (b >>> 0).toString(16);
  }

  const pub = (u) => ({ id: u.id, name: u.name, phone: u.phone, createdAt: u.createdAt });

  function setSession(u) { localStorage.setItem(SES, JSON.stringify({ uid: u.id, at: Date.now() })); }

  async function register(name, phone, pass, pass2) {
    name = String(name || '').trim().replace(/\s+/g, ' ');
    const d = normPhone(phone);
    if (name.length < 2) return { ok: false, error: 'Ism va familiyani kiriting' };
    if (!d) return { ok: false, error: 'Telefon raqam noto‘g‘ri. Masalan: +998 90 123 45 67' };
    if (String(pass || '').length < 6) return { ok: false, error: 'Parol kamida 6 ta belgidan iborat bo‘lsin' };
    if (pass2 !== undefined && pass !== pass2) return { ok: false, error: 'Parollar bir xil emas' };
    const users = read();
    const salt = rnd(16);
    const now = Date.now();
    const algo = window.crypto && crypto.subtle ? 'sha256' : 'fnv';
    const ex = users.find((u) => u.phone === d);
    if (ex && ex.seed) {
      // Kassada xarid qilgan mijoz saytda ro'yxatdan o'tsa, eski xaridlari o'zida qoladi
      Object.assign(ex, { name, salt, pass: await hash(pass, salt, algo), seed: false, wasSeed: true, src: 'Sayt', lastLogin: now, lastSeen: now, logins: (ex.logins || 0) + 1 });
      if (!write(users)) return { ok: false, error: 'Xotira to‘ldi, hisob saqlanmadi' };
      setSession(ex);
      return { ok: true, user: pub(ex) };
    }
    if (ex) return { ok: false, error: 'Bu raqam allaqachon ro‘yxatdan o‘tgan. “Kirish” bo‘limidan foydalaning' };
    const u = { id: 'u' + rnd(6), name, phone: d, salt, pass: await hash(pass, salt, algo), createdAt: now, lastLogin: now, lastSeen: now, logins: 1, blocked: false };
    users.push(u);
    if (!write(users)) return { ok: false, error: 'Xotira to‘ldi, hisob saqlanmadi' };
    setSession(u);
    return { ok: true, user: pub(u) };
  }

  async function login(phone, pass) {
    const d = normPhone(phone);
    if (!d) return { ok: false, error: 'Telefon raqamni to‘liq kiriting' };
    const users = read();
    const u = users.find((x) => x.phone === d);
    if (!u) return { ok: false, error: 'Bu raqam bilan hisob topilmadi. Avval ro‘yxatdan o‘ting' };
    if (u.blocked) return { ok: false, error: 'Hisobingiz bloklangan. Administrator bilan bog‘laning' };
    if (u.seed || !u.pass) return { ok: false, error: 'Bu raqam kassada ro‘yxatga olingan, lekin parol o‘rnatilmagan. “Ro‘yxatdan o‘tish” orqali parol qo‘ying: avvalgi chiptalaringiz saqlanadi' };
    const algo = u.pass.split(':')[0];
    if ((await hash(pass, u.salt, algo)) !== u.pass) return { ok: false, error: 'Parol noto‘g‘ri' };
    u.lastLogin = u.lastSeen = Date.now();
    u.logins = (u.logins || 0) + 1;
    write(users);
    setSession(u);
    return { ok: true, user: pub(u) };
  }

  function current() {
    let s;
    try { s = JSON.parse(localStorage.getItem(SES)); } catch (e) { s = null; }
    if (!s) return null;
    const users = read();
    const u = users.find((x) => x.id === s.uid);
    if (!u || u.blocked) { localStorage.removeItem(SES); return null; }
    u.lastSeen = Date.now();
    write(users);
    return pub(u);
  }

  function logout() { localStorage.removeItem(SES); }

  function setBlocked(id, v) {
    const users = read();
    const u = users.find((x) => x.id === id);
    if (!u) return false;
    u.blocked = !!v;
    return write(users);
  }

  // Kassa va boshqa kanallar orqali xarid qilgan mijozlar (bir marta yoziladi)
  function seed(list) {
    const users = read();
    if (users.some((u) => u.seed || u.wasSeed)) return false;
    const have = new Set(users.map((u) => u.phone));
    list.forEach((u) => { if (!have.has(u.phone)) users.push(u); });
    return write(users);
  }

  window.KSAuth = { register, login, current, logout, all: read, setBlocked, seed, normPhone, fmtPhone };
})();
