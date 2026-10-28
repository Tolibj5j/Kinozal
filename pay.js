/*
 * KinoShow Pay: demo to'lov shlyuzi. Haqiqiy pul yechilmaydi.
 * Karta (Uzcard / Humo / Visa / Mastercard): raqam (Luhn tekshiruvi), muddat, SMS kod, 3-D Secure.
 * Payme / Click: telefon raqam, SMS kod, hamyondagi kartani tanlash.
 * KSPay.open({amount, method, phone, desc, orderId}) -> Promise<{ok, ...chek}>
 */
(function () {
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + ' so‘m';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const rndInt = (n) => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] % n; };
  const rndStr = (n, A = '0123456789') => Array.from({ length: n }, () => A[rndInt(A.length)]).join('');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function luhn(n) {
    let sum = 0, alt = false;
    for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } sum += d; alt = !alt; }
    return n.length >= 16 && sum % 10 === 0;
  }
  const brandOf = (d) => /^(8600|5614|6262)/.test(d) ? 'Uzcard' : /^9860/.test(d) ? 'Humo' : /^4/.test(d) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(d) ? 'Mastercard' : '';
  const ALLOW = { Uzcard: ['Uzcard'], Humo: ['Humo'], 'Visa/Mastercard': ['Visa', 'Mastercard'] };
  const FAIL = { '8600000000000007': 'Kartada mablag‘ yetarli emas', '9860000000000000': 'Karta bloklangan. Bankingizga murojaat qiling' };
  const TEST = {
    Uzcard: [['8600 4901 2345 6782', 'muvaffaqiyatli'], ['8600 0000 0000 0007', 'mablag‘ yetmaydi']],
    Humo: [['9860 0123 4567 8903', 'muvaffaqiyatli'], ['9860 0000 0000 0000', 'karta bloklangan']],
    'Visa/Mastercard': [['4111 1111 1111 1111', 'Visa, muvaffaqiyatli'], ['5555 4444 3333 2226', 'Mastercard, muvaffaqiyatli']],
  };
  const maskCard = (d) => d.slice(0, 4) + ' ' + d.slice(4, 6) + '** **** ' + d.slice(-4);
  const maskPhone = (d) => (d.length === 12 ? `+998 ${d.slice(3, 5)} *** ** ${d.slice(10)}` : '');

  let root, ctx, done;

  function shell(o, rows, title) {
    root = document.createElement('div');
    root.className = 'pg';
    const cls = o.method === 'Payme' ? 'payme' : o.method === 'Click' ? 'click' : 'card';
    root.innerHTML = `<div class="pg-box pgm-${title ? 'card' : cls}" role="dialog" aria-modal="true" aria-label="${title || 'To‘lov'}">
      <div class="pg-head"><div class="pg-logo">${title ? 'KinoShow <b>Pay</b>' : o.method === 'Payme' ? 'pay<b>me</b>' : o.method === 'Click' ? '<b>●</b> click' : 'KinoShow <b>Pay</b>'}</div>
        <span class="pg-lock">${title ? esc(title) : '🔒 Xavfsiz ulanish'}</span><button class="pg-x" data-pg="close" aria-label="Yopish">✕</button></div>
      <div class="pg-sum">${rows}</div>
      <div class="pg-desc">${esc(o.desc || '')}</div>
      <div class="pg-body"></div>
      <div class="pg-foot">PCI DSS · 3-D Secure · TLS 1.3 &nbsp;|&nbsp; Demo rejim: haqiqiy pul yechilmaydi</div>
    </div><div class="pg-sms" hidden></div>`;
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'radio' && e.target.type !== 'checkbox') { e.preventDefault(); const b = root.querySelector('.pg-btn:not([disabled])'); if (b) b.click(); }
      if (e.key === 'Escape') ask();
    });
  }

  function open(o) {
    return new Promise((resolve) => {
      done = resolve;
      ctx = { ...o, wallet: o.method === 'Payme' || o.method === 'Click', phoneD: digits(o.phone), tries: 0 };
      if (ctx.phoneD.length === 9) ctx.phoneD = '998' + ctx.phoneD;
      shell(o, `<div><small>Sotuvchi</small><b>KinoShow MChJ</b></div><div><small>Buyurtma</small><b>${esc(o.orderId)}</b></div>
        <div class="pg-amt"><small>To‘lov summasi</small><b>${fmt(o.amount)}</b></div>`);
      if (ctx.wallet) stepWallet(); else stepCard();
    });
  }

  /* ---------- Chiptani qaytarish ---------- */
  const REASONS = ['Rejalarim o‘zgardi', 'Boshqa seans yoki kunni tanlayman', 'Kasallik sababli', 'Xato sotib oldim', 'Boshqa sabab'];
  const TERM = (m) => m === 'Payme' || m === 'Click' ? `${m} hamyoniga darhol` : m === 'Visa/Mastercard' ? '3–10 ish kunida kartaga' : '1–3 ish kunida kartaga';
  function refund(o) {
    return new Promise((resolve) => {
      done = resolve;
      ctx = { ...o, refund: true };
      shell(o, `<div><small>Chipta</small><b>${esc(o.orderId)}</b></div><div><small>Joylar</small><b>${esc(o.seats)}</b></div>
        <div class="pg-amt"><small>Qaytariladigan summa</small><b>${fmt(o.amount)}</b></div>`, 'Chiptani qaytarish');
      body(`${o.warn ? `<div class="pg-warn">${esc(o.warn)}</div>` : ''}
        <div class="pg-rc"><span>Qaytariladi</span><b>${esc(o.method || '—')}${o.mask ? ' · ' + esc(o.mask) : ''}</b><span>Muddat</span><b>${TERM(o.method)}</b><span>Shart</span><b>Seansdan kamida 24 soat oldin, to‘liq summa</b></div>
        <p class="pg-p" style="margin-top:12px"><b>Qaytarish sababi</b></p>
        <div class="pg-list">${REASONS.map((r, k) => `<label class="pg-opt"><input type="radio" name="pgr" value="${esc(r)}" ${k === 0 ? 'checked' : ''}><span>${esc(r)}</span></label>`).join('')}</div>
        <label class="pg-chk" style="margin-top:12px"><input type="checkbox" id="pgAgree"> Chipta bekor qilinishi va joylar qayta sotuvga chiqarilishiga roziman</label>
        <div class="pg-err"></div><button class="pg-btn" data-pg="rfgo">${fmt(o.amount)} qaytarish</button>`);
    });
  }
  async function processRefund() {
    const reason = root.querySelector('input[name=pgr]:checked').value;
    if (!root.querySelector('#pgAgree').checked) return err('Davom etish uchun rozilikni belgilang');
    ctx.busy = true;
    body(`<div class="pg-proc"><div class="pg-spin"></div><ul><li>Chipta bekor qilinmoqda</li><li>Bank bilan bog‘lanilmoqda</li><li>Mablag‘ qaytarilmoqda</li></ul></div>`);
    const li = root.querySelectorAll('.pg-proc li');
    for (const l of li) { l.className = 'run'; await sleep(550 + rndInt(300)); l.className = 'ok'; }
    ctx.busy = false;
    const r = { ok: true, id: 'RF' + Date.now().toString(36).toUpperCase() + rndStr(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), at: Date.now(), reason, amount: ctx.amount };
    ctx.paid = r;
    body(`<div class="pg-done"><div class="pg-ok">↩</div><h3>Chipta qaytarildi</h3><b class="pg-big">${fmt(ctx.amount)}</b>
      <div class="pg-rc"><span>Qaytarish ID</span><b>${r.id}</b><span>Qayerga</span><b>${esc(ctx.method || '—')}${ctx.mask ? ' · ' + esc(ctx.mask) : ''}</b><span>Muddat</span><b>${TERM(ctx.method)}</b><span>Sabab</span><b>${esc(reason)}</b><span>Vaqt</span><b>${new Date(r.at).toLocaleString('ru-RU')}</b></div>
      <button class="pg-btn" data-pg="finish">Tayyor</button></div>`);
  }

  function finish(r) {
    clearInterval(ctx.timer);
    document.body.style.overflow = '';
    root.remove();
    done(r);
  }
  function ask() {
    if (ctx.busy) return;
    if (ctx.paid) return finish(ctx.paid);
    if (ctx.refund) return finish({ ok: false, reason: 'cancel' });
    if (confirm('To‘lovni bekor qilasizmi? Tanlangan joylar saqlanib qoladi.')) finish({ ok: false, reason: 'cancel' });
  }
  const body = (h) => { const b = root.querySelector('.pg-body'); b.innerHTML = h; const i = b.querySelector('input'); if (i) setTimeout(() => i.focus(), 30); };
  const err = (m) => { const e = root.querySelector('.pg-err'); if (e) e.textContent = m; };

  /* ---------- Karta ---------- */
  function stepCard() {
    const intl = ctx.method === 'Visa/Mastercard';
    body(`<div class="pg-card" id="pgPrev"><div class="pg-chip"></div><div class="pg-brand" id="pgBrand">${intl ? 'VISA / MC' : esc(ctx.method).toUpperCase()}</div>
        <div class="pg-num" id="pgNumP">•••• •••• •••• ••••</div><div class="pg-cr"><span id="pgHolP">${intl ? 'KARTA EGASI' : ''}</span><span id="pgExpP">MM/YY</span></div></div>
      <label>Karta raqami<input id="pgNum" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="19"></label>
      <div class="pg-two"><label>Amal qilish muddati<input id="pgExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"></label>
        ${intl ? '<label>CVV/CVC<input id="pgCvv" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="3"></label>' : ''}</div>
      ${intl ? '<label>Karta egasi (lotin harflarida)<input id="pgHol" autocomplete="cc-name" placeholder="AZIZ KARIMOV"></label>' : ''}
      <label class="pg-chk"><input type="checkbox" id="pgSave"> Kartani keyingi to‘lovlar uchun eslab qolish</label>
      <div class="pg-err"></div>
      <button class="pg-btn" data-pg="card">${fmt(ctx.amount)} to‘lash</button>
      <details class="pg-test"><summary>Test kartalar (demo)</summary>${(TEST[ctx.method] || []).map(([n, t]) => `<button type="button" data-pg="fill" data-v="${n}">${n}</button> <span>${t}</span><br>`).join('')}<span>Muddat: istalgan kelajakdagi sana, masalan 12/29.${intl ? ' CVV: istalgan 3 raqam.' : ''}</span></details>`);
  }

  function readCard() {
    const intl = ctx.method === 'Visa/Mastercard';
    const n = digits(root.querySelector('#pgNum').value);
    const [mm, yy] = root.querySelector('#pgExp').value.split('/').map(Number);
    const brand = brandOf(n);
    if (!luhn(n)) return { e: 'Karta raqami noto‘g‘ri. 16 raqamni tekshiring' };
    if (!brand) return { e: 'Bu turdagi karta qo‘llab-quvvatlanmaydi' };
    if (!ALLOW[ctx.method].includes(brand)) return { e: `Bu ${brand} karta. To‘lov usulini ${brand === 'Visa' || brand === 'Mastercard' ? 'Visa/Mastercard' : brand} qilib tanlang` };
    const now = new Date(), y = 2000 + (yy || 0);
    if (!(mm >= 1 && mm <= 12) || y < now.getFullYear() || (y === now.getFullYear() && mm < now.getMonth() + 1) || y > now.getFullYear() + 10) return { e: 'Karta amal qilish muddati noto‘g‘ri yoki o‘tib ketgan' };
    if (intl) {
      if (digits(root.querySelector('#pgCvv').value).length !== 3) return { e: 'CVV kodi 3 ta raqam bo‘lishi kerak' };
      if (!/^[A-Za-z]+( [A-Za-z]+)+$/.test(root.querySelector('#pgHol').value.trim())) return { e: 'Karta egasining ism va familiyasini lotin harflarida kiriting' };
    }
    return { n, brand };
  }

  /* ---------- Payme / Click hamyon ---------- */
  function stepWallet() {
    body(`<p class="pg-p">${esc(ctx.method)} hisobingizga ulangan telefon raqamni kiriting. Unga tasdiqlash kodi yuboriladi.</p>
      <label>Telefon raqam<input id="pgPh" inputmode="tel" autocomplete="tel" value="${ctx.phoneD.length === 12 ? '+' + ctx.phoneD : ''}" placeholder="+998 90 123 45 67"></label>
      <div class="pg-err"></div><button class="pg-btn" data-pg="wallet">Kod olish</button>`);
  }

  function walletCards() {
    let h = 0;
    for (const c of ctx.phoneD) h = (h * 31 + +c) % 1e9;
    return [
      { brand: 'Uzcard', mask: '8600 ' + String(1000 + (h % 9000)).slice(0, 2) + '** **** ' + String(1000 + ((h >> 3) % 9000)), bal: 350000 + (h % 50) * 41000 },
      { brand: 'Humo', mask: '9860 ' + String(1000 + ((h >> 5) % 9000)).slice(0, 2) + '** **** ' + String(1000 + ((h >> 7) % 9000)), bal: 120000 + (h % 30) * 23000 },
    ];
  }

  /* ---------- SMS kod ---------- */
  function sendOtp() {
    ctx.otp = rndStr(6);
    ctx.otpExp = Date.now() + 60000;
    ctx.tries = 0;
    const sms = root.querySelector('.pg-sms');
    sms.innerHTML = `<b>📩 SMS · ${ctx.wallet ? esc(ctx.method) : '3-D Secure'}</b><span>Tasdiqlash kodi: <b>${ctx.otp}</b>. Summa: ${fmt(ctx.amount)}. Kodni hech kimga bermang!</span><small>Bosing, kod avtomatik kiritiladi</small>`;
    sms.hidden = false;
    sms.classList.remove('in'); void sms.offsetWidth; sms.classList.add('in');
    clearTimeout(ctx.smsT);
    ctx.smsT = setTimeout(() => { sms.hidden = true; }, 12000);
  }

  function stepOtp() {
    const ph = maskPhone(ctx.phoneD);
    body(`<div class="pg-3ds">${ctx.wallet ? '' : `<div class="pg-3dsl">${esc(ctx.brand)} · ${ctx.brand === 'Visa' ? 'Visa Secure' : ctx.brand === 'Mastercard' ? 'Mastercard ID Check' : '3-D Secure'}</div>`}
      <p class="pg-p">Tasdiqlash kodi ${ph ? `<b>${ph}</b> raqamiga` : 'telefoningizga'} yuborildi.${ctx.mask ? `<br>Karta: <b>${ctx.mask}</b>` : ''}</p>
      <label>SMS kod<input id="pgOtp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" class="pg-otp"></label>
      <div class="pg-err"></div>
      <button class="pg-btn" data-pg="otp">Tasdiqlash</button>
      <div class="pg-re"><span id="pgTm"></span><button type="button" class="pg-link" data-pg="resend" disabled>Kodni qayta yuborish</button></div></div>`);
    sendOtp();
    clearInterval(ctx.timer);
    const tick = () => {
      const left = Math.max(0, Math.ceil((ctx.otpExp - Date.now()) / 1000));
      const tm = root.querySelector('#pgTm'), rb = root.querySelector('[data-pg=resend]');
      if (!tm) return clearInterval(ctx.timer);
      tm.textContent = left ? `Kod ${left} soniya amal qiladi` : 'Kod muddati tugadi';
      rb.disabled = left > 0;
    };
    tick();
    ctx.timer = setInterval(tick, 500);
  }

  function stepPickCard() {
    const cards = walletCards();
    body(`<p class="pg-p">${esc(ctx.method)} hamyoningizdagi kartani tanlang:</p>
      <div class="pg-list">${cards.map((c, k) => `<label class="pg-opt"><input type="radio" name="pgc" value="${k}" ${k === 0 ? 'checked' : ''}>
        <span><b>${c.brand} ${c.mask.slice(-9)}</b><small>Balans: ${fmt(c.bal)}</small></span></label>`).join('')}</div>
      <div class="pg-err"></div><button class="pg-btn" data-pg="walletpay">${fmt(ctx.amount)} to‘lash</button>`);
    ctx.cards = cards;
  }

  /* ---------- Jarayon va natija ---------- */
  async function process() {
    ctx.busy = true;
    clearInterval(ctx.timer);
    const steps = ctx.wallet ? ['Hamyon tekshirilmoqda', 'Kartadan mablag‘ yechilmoqda', 'To‘lov tasdiqlanmoqda'] : ['Karta ma’lumotlari tekshirilmoqda', 'Bank bilan xavfsiz ulanish (3-D Secure)', 'To‘lov tasdiqlanmoqda'];
    body(`<div class="pg-proc"><div class="pg-spin"></div><ul>${steps.map((s) => `<li>${s}</li>`).join('')}</ul><p class="pg-p">Sahifani yopmang...</p></div>`);
    const li = root.querySelectorAll('.pg-proc li');
    for (let k = 0; k < li.length; k++) {
      li[k].className = 'run';
      await sleep(650 + rndInt(350));
      if (k === 1 && ctx.fail) { ctx.busy = false; return stepError(ctx.fail); }
      if (k === 1 && ctx.wallet && ctx.card.bal < ctx.amount) { ctx.busy = false; return stepError('Tanlangan kartada mablag‘ yetarli emas'); }
      li[k].className = 'ok';
    }
    ctx.busy = false;
    const r = {
      ok: true, method: ctx.method, brand: ctx.brand, mask: ctx.mask,
      txn: (ctx.method === 'Payme' ? 'PM' : ctx.method === 'Click' ? 'CL' : 'KS') + Date.now().toString(36).toUpperCase() + rndStr(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'),
      rrn: rndStr(12), auth: rndStr(6, 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'), terminal: '9001' + rndStr(4), paidAt: Date.now(),
    };
    ctx.paid = r;
    body(`<div class="pg-done"><div class="pg-ok">✓</div><h3>To‘lov muvaffaqiyatli!</h3><b class="pg-big">${fmt(ctx.amount)}</b>
      <div class="pg-rc"><span>Karta</span><b>${esc(r.mask)}</b><span>Tranzaksiya</span><b>${r.txn}</b><span>RRN</span><b>${r.rrn}</b><span>Avtorizatsiya kodi</span><b>${r.auth}</b><span>Vaqt</span><b>${new Date(r.paidAt).toLocaleString('ru-RU')}</b></div>
      <button class="pg-btn" data-pg="finish">Chiptani olish</button></div>`);
  }

  function stepError(msg) {
    body(`<div class="pg-done"><div class="pg-ok bad">!</div><h3>To‘lov amalga oshmadi</h3><p class="pg-p">${esc(msg)}</p><p class="pg-p"><small>Mablag‘ yechilmadi. Boshqa karta bilan urinib ko‘ring.</small></p>
      <button class="pg-btn" data-pg="retry">Qayta urinish</button><button class="pg-link" data-pg="close">Bekor qilish</button></div>`);
  }

  /* ---------- Hodisalar ---------- */
  async function onClick(e) {
    const sms = e.target.closest('.pg-sms');
    if (sms) { const i = root.querySelector('#pgOtp'); if (i) { i.value = ctx.otp; i.focus(); } sms.hidden = true; return; }
    const b = e.target.closest('[data-pg]');
    if (!b || ctx.busy) return;
    const a = b.dataset.pg;
    if (a === 'close') return ask();
    if (a === 'fill') {
      root.querySelector('#pgNum').value = b.dataset.v; root.querySelector('#pgExp').value = '12/29';
      const c = root.querySelector('#pgCvv'); if (c) c.value = '123';
      const h = root.querySelector('#pgHol'); if (h) h.value = 'TEST CARDHOLDER';
      root.querySelector('#pgNum').dispatchEvent(new Event('input', { bubbles: true }));
      root.querySelector('#pgExp').dispatchEvent(new Event('input', { bubbles: true }));
      if (h) h.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    if (a === 'card') {
      const c = readCard();
      if (c.e) return err(c.e);
      ctx.brand = c.brand; ctx.mask = maskCard(c.n); ctx.fail = FAIL[c.n] || null;
      b.disabled = true; b.textContent = 'Bankka ulanilmoqda...';
      await sleep(700);
      return stepOtp();
    }
    if (a === 'wallet') {
      const d = digits(root.querySelector('#pgPh').value);
      const full = d.length === 9 ? '998' + d : d;
      if (full.length !== 12 || !full.startsWith('998')) return err('Telefon raqamni to‘liq kiriting');
      ctx.phoneD = full;
      b.disabled = true; b.textContent = 'Kod yuborilmoqda...';
      await sleep(600);
      return stepOtp();
    }
    if (a === 'rfgo') return processRefund();
    if (a === 'resend') return sendOtp();
    if (a === 'otp') {
      const v = digits(root.querySelector('#pgOtp').value);
      if (Date.now() > ctx.otpExp) return err('Kod muddati tugadi. Qayta yuboring');
      if (v !== ctx.otp) {
        ctx.tries++;
        if (ctx.tries >= 3) return stepError('Kod 3 marta noto‘g‘ri kiritildi. Xavfsizlik uchun to‘lov to‘xtatildi');
        return err(`Kod noto‘g‘ri. Yana ${3 - ctx.tries} ta urinish qoldi`);
      }
      if (ctx.wallet) return stepPickCard();
      return process();
    }
    if (a === 'walletpay') {
      const k = +root.querySelector('input[name=pgc]:checked').value;
      ctx.card = ctx.cards[k]; ctx.brand = ctx.card.brand; ctx.mask = ctx.card.mask; ctx.fail = null;
      return process();
    }
    if (a === 'retry') { ctx.paid = null; return ctx.wallet ? stepWallet() : stepCard(); }
    if (a === 'finish') return finish(ctx.paid);
  }

  function onInput(e) {
    const t = e.target;
    if (t.id === 'pgNum') {
      const d = digits(t.value).slice(0, 16);
      t.value = d.replace(/(\d{4})(?=\d)/g, '$1 ');
      const br = brandOf(d);
      root.querySelector('#pgNumP').textContent = (d + '•'.repeat(16 - d.length)).replace(/(.{4})(?=.)/g, '$1 ');
      const p = root.querySelector('#pgPrev');
      p.className = 'pg-card' + (br ? ' b-' + br.toLowerCase() : '');
      root.querySelector('#pgBrand').textContent = br ? br.toUpperCase() : ctx.method.toUpperCase();
    }
    if (t.id === 'pgExp') {
      const d = digits(t.value).slice(0, 4);
      t.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      root.querySelector('#pgExpP').textContent = t.value || 'MM/YY';
    }
    if (t.id === 'pgCvv') t.value = digits(t.value).slice(0, 3);
    if (t.id === 'pgHol') { t.value = t.value.toUpperCase().replace(/[^A-Z ]/g, ''); root.querySelector('#pgHolP').textContent = t.value || 'KARTA EGASI'; }
    if (t.id === 'pgOtp') t.value = digits(t.value).slice(0, 6);
    err('');
  }

  window.KSPay = { open, refund, luhn, brandOf };
})();
