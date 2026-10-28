'use strict';
/*
 * Minimal QR kod generatori (Version 1, xatoni tuzatish darajasi L, bayt rejimi, mask 0).
 * 17 baytgacha matnni kodlaydi — "KZ-XXXXXX" chipta kodi uchun yetarli.
 * Algoritm ISO/IEC 18004 standartiga asoslangan (Reed–Solomon GF(256), 0x11D).
 */
(function () {
  const SIZE = 21;
  const DATA_CW = 19;
  const EC_CW = 7;

  function gfMul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xff;
  }
  function rsDivisor(degree) {
    const r = new Array(degree).fill(0);
    r[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < r.length; j++) {
        r[j] = gfMul(r[j], root);
        if (j + 1 < r.length) r[j] ^= r[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return r;
  }
  function rsRemainder(data, div) {
    const r = div.map(() => 0);
    for (const b of data) {
      const f = b ^ r.shift();
      r.push(0);
      div.forEach((c, i) => { r[i] ^= gfMul(c, f); });
    }
    return r;
  }

  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 17) throw new Error('QR: matn juda uzun');
    const bits = [];
    const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    push(0b0100, 4);
    push(bytes.length, 8);
    bytes.forEach((b) => push(b, 8));
    const cap = DATA_CW * 8;
    push(0, Math.min(4, cap - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0xec; data.length < DATA_CW; p ^= 0xec ^ 0x11) data.push(p);
    const all = data.concat(rsRemainder(data, rsDivisor(EC_CW)));

    const m = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
    const fn = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
    const setF = (x, y, dark) => { m[y][x] = dark; fn[y][x] = true; };

    for (let i = 0; i < SIZE; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    [[3, 3], [SIZE - 4, 3], [3, SIZE - 4]].forEach(([cx, cy]) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        setF(x, y, d !== 2 && d !== 4);
      }
    });

    // Format ma'lumoti: EC=L (01), mask=0
    const fdata = (1 << 3) | 0;
    let rem = fdata;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fbits = ((fdata << 10) | rem) ^ 0x5412;
    const g = (i) => ((fbits >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) setF(8, i, g(i));
    setF(8, 7, g(6)); setF(8, 8, g(7)); setF(7, 8, g(8));
    for (let i = 9; i < 15; i++) setF(14 - i, 8, g(i));
    for (let i = 0; i < 8; i++) setF(SIZE - 1 - i, 8, g(i));
    for (let i = 8; i < 15; i++) setF(8, SIZE - 15 + i, g(i));
    setF(8, SIZE - 8, true);

    let bi = 0;
    for (let right = SIZE - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let v = 0; v < SIZE; v++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const up = ((right + 1) & 2) === 0;
          const y = up ? SIZE - 1 - v : v;
          if (!fn[y][x] && bi < all.length * 8) {
            m[y][x] = ((all[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1;
            bi++;
          }
        }
      }
    }
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!fn[y][x] && (x + y) % 2 === 0) m[y][x] = !m[y][x];
    return m;
  }

  function draw(canvas, text, px = 240) {
    const m = encode(text);
    const q = 4; // oq hoshiya (standart bo'yicha 4 modul)
    const n = SIZE + q * 2;
    canvas.width = px; canvas.height = px;
    const ctx = canvas.getContext('2d');
    const s = px / n;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = '#111';
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (m[y][x]) ctx.fillRect(Math.floor((x + q) * s), Math.floor((y + q) * s), Math.ceil(s), Math.ceil(s));
    }
  }

  window.QR = { encode, draw };
})();
