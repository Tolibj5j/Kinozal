// KinoShow: barcha bo'limlarni brauzerda tekshiruvchi Playwright testi.
// Ishlatish: Playwright `page` obyektiga beriladigan funksiya. BASE manzilni o'zgartiring.
async (page) => {
  const BASE = 'http://show.test/';
  const R = [];
  const errs = [];
  const ok = (name, cond, extra = '') => R.push(`${cond ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`);
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(() => { window.confirm = () => true; });
  await page.evaluate(() => { window.confirm = () => true; });
  const w = (ms) => page.waitForTimeout(ms);
  const go = async (h) => { await page.evaluate((x) => { location.hash = x; }, h); await w(150); };
  const text = (s) => page.locator(s).first().innerText();

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  await w(400);

  // 1. Barcha sahifalar
  const routes = ['#/', '#/movies', '#/cinemas', '#/offers', '#/orders', '#/login', '#/admin'];
  const ids = await page.evaluate(() => ({ cin: CIN.map((c) => c.id), mov: CAT().map((m) => m.id) }));
  ids.cin.forEach((i) => routes.push('#/cinema/' + i));
  ids.mov.forEach((i) => routes.push('#/movie/' + i));
  let empty = [];
  for (const r of routes) { await go(r); const len = (await text('#app')).length; if (len < 20) empty.push(r); }
  ok(`${routes.length} ta sahifa ochildi (bosh, filmlar, ${ids.cin.length} zal, ${ids.mov.length} film/shou va b.)`, !empty.length && !errs.length, empty.join(', ') + errs.join('; '));

  // 2. Posterlar
  await go('#/movies'); await w(900);
  const img = await page.evaluate(() => { const l = [...document.querySelectorAll('.poster img')]; return { n: l.length, ok: l.filter((i) => i.complete && i.naturalWidth > 0).length }; });
  ok('Posterlar yuklandi', img.n === ids.mov.length && img.ok === img.n, `${img.ok}/${img.n}`);

  // 3. Filtr va qidiruv
  await page.fill('#mq', 'qal');
  const found = await page.locator('#grid .mc').count();
  ok('Qidiruv ("qal")', found === 1, `${found} ta natija`);
  await page.fill('#mq', '');
  await page.selectOption('#genSel', 'Multfilm'); await w(100);
  ok('Janr filtri (Multfilm)', (await page.locator('#grid .mc').count()) === 2);
  await page.selectOption('#genSel', '');

  // 4. Ro'yxatdan o'tish / kirish
  await go('#/login');
  await page.click('[data-a=ltab][data-v=up]');
  await page.fill('#lname', 'Aziz Karimov'); await page.fill('#lphone', '901234567'); await page.fill('#lpass', 'parol123'); await page.fill('#lpass2', 'parol123');
  await page.click('#fup button[type=submit]'); await w(300);
  ok('Ro‘yxatdan o‘tish', (await text('#nav')).includes('Aziz'));
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('users')).find((u) => u.phone === '998901234567'));
  const secure = await page.evaluate(() => isSecureContext);
  ok('Parol ochiq saqlanmaydi (xesh)', stored.pass.startsWith(secure ? 'sha256:' : 'fnv:') && !JSON.stringify(stored).includes('parol123'), secure ? 'SHA-256' : 'https bo‘lmagan test muhiti: zaxira xesh (GitHub Pages’da SHA-256)');
  await page.click('#nav a.btn'); await w(150); await page.click('[data-a=logout]'); await w(150);
  await go('#/login'); await page.click('[data-a=ltab][data-v=up]');
  await page.fill('#lname', 'Boshqa'); await page.fill('#lphone', '+998 90 123 45 67'); await page.fill('#lpass', 'parol123'); await page.fill('#lpass2', 'parol123');
  await page.click('#fup button[type=submit]'); await w(200);
  ok('Takroriy raqam rad etiladi', (await text('#lerr')).includes('allaqachon'));
  await page.click('[data-a=ltab][data-v=in]');
  await page.fill('#lphone', '901234567'); await page.fill('#lpass', 'xato'); await page.click('#fin button[type=submit]'); await w(200);
  ok('Noto‘g‘ri parol rad etiladi', (await text('#lerr')).includes('noto‘g‘ri'));

  // 5. Zal va 3D ko'rinish (kirmasdan)
  await page.goto(BASE + '#/movie/k3'); await w(300);
  await page.locator('[data-a=book]:not([disabled])').first().click(); await w(1100);
  const v3 = await page.evaluate(() => ({ seats: document.querySelectorAll('.v3-seat').length, scr: !!document.querySelector('.v3-scr'), info: document.querySelector('#v3i').innerText }));
  ok('3D zal chizildi', v3.seats > 0 && v3.scr, `${v3.seats} ta o‘rindiq`);
  const free = page.locator('.seat:not([disabled])');
  const i1 = await text('#v3i');
  await free.first().hover(); await w(700);
  const i2 = await text('#v3i'); const t2 = await text('#v3t');
  ok('O‘rindiq ustiga borganda ko‘rinish o‘zgaradi', i1 !== i2 && t2.startsWith('Ko‘rish'), t2);
  await page.click('[data-a=sector][data-v=vip]'); await w(1000);
  ok('Sektor tanlash (VIP)', (await page.locator('.seat.insec').count()) > 0 && (await text('#v3t')).includes('qator'));
  await page.click('[data-a=auto][data-v="2"]'); await w(900);
  const sel = await page.evaluate(() => ({ l: S.B.sel.slice(), vip: S.B.sel.every((s) => s.charCodeAt(0) - 65 >= CIN[S.B.ci].r - 2) }));
  ok('Yonma-yon 2 joy (VIP sektorida)', sel.l.length === 2 && sel.vip, sel.l.join(', '));
  await page.click('[data-a=next]'); await w(300);
  ok('Kirmagan foydalanuvchi kirish sahifasiga yo‘naltiriladi', (await text('#app')).includes('Chipta olish uchun'));
  await page.fill('#lphone', '901234567'); await page.fill('#lpass', 'parol123'); await page.click('#fin button[type=submit]'); await w(400);
  ok('Kirgandan keyin to‘lov sahifasiga qaytadi', page.url().includes('#/checkout'));

  // 6. To'lov: yordamchi funksiyalar
  async function otp() {
    await page.waitForSelector('#pgOtp', { timeout: 5000 });
    await page.click('.pg-sms'); await w(100);
    await page.click('.pg-btn');
  }
  async function newBooking(mid) {
    await page.goto(BASE + '#/movie/' + mid); await w(300);
    await page.locator('[data-a=book]:not([disabled])').first().click(); await w(500);
    await page.locator('.seat:not([disabled])').first().click(); await w(300);
    await page.click('[data-a=next]'); await w(300);
  }
  async function payCard(method, num, extra) {
    await page.click(`[data-a=pay][data-v="${method}"]`); await w(150);
    await page.click('[data-a=buy]'); await page.waitForSelector('#pgNum');
    await page.fill('#pgNum', num); await page.fill('#pgExp', '1229');
    if (extra) { await page.fill('#pgCvv', '123'); await page.fill('#pgHol', 'AZIZ KARIMOV'); }
    await page.click('[data-pg=card]');
  }
  const finishOk = async () => { await page.waitForSelector('[data-pg=finish]', { timeout: 8000 }); await page.click('[data-pg=finish]'); await w(400); return page.url().includes('#/ticket/'); };

  // Uzcard + promokod + taom
  await page.click('[data-a=sn][data-v="pop|1"]'); await w(100);
  await page.fill('#promo', 'kinobirinchi'); await page.click('[data-a=applypromo]'); await w(150);
  const totalUI = await text('aside .tot');
  await payCard('Uzcard', '8600 4901 2345 6782');
  await page.waitForSelector('#pgOtp'); await page.fill('#pgOtp', '000000'); await page.click('.pg-btn'); await w(150);
  const wrongOtp = await text('.pg-err');
  await page.click('.pg-sms'); await page.click('.pg-btn');
  const u1 = await finishOk();
  const o1 = await page.evaluate(() => orders()[0]);
  ok('Uzcard to‘lovi (SMS kod, promokod, popkorn)', u1 && o1.payment.mask === '8600 49** **** 6782' && o1.disc > 0 && o1.sn.pop === 1, `${o1.code}, ${totalUI.replace('\n', ' ')}, chegirma ${o1.disc}`);
  ok('Noto‘g‘ri SMS kod rad etiladi', wrongOtp.includes('noto‘g‘ri'), wrongOtp);
  const tk = await page.evaluate(() => ({ qr: !!document.querySelector('.tk svg path'), rc: document.querySelector('.rc').innerText }));
  ok('Chipta: QR kod va to‘lov cheki', tk.qr && tk.rc.includes(o1.payment.txn) && tk.rc.includes(o1.payment.rrn));

  // Humo: bloklangan karta, keyin muvaffaqiyatli
  await newBooking('k8');
  await payCard('Humo', '9860 0000 0000 0000'); await otp();
  await page.waitForSelector('[data-pg=retry]', { timeout: 8000 });
  const blocked = await text('.pg-done');
  await page.click('[data-pg=retry]'); await page.fill('#pgNum', '9860 0123 4567 8903'); await page.fill('#pgExp', '1229'); await page.click('[data-pg=card]'); await otp();
  const u2 = await finishOk();
  ok('Humo: bloklangan karta rad etildi, boshqa karta bilan to‘landi', blocked.includes('bloklangan') && u2);

  // Brend mos kelmasligi + Visa
  await newBooking('k12');
  await payCard('Uzcard', '9860 0123 4567 8903');
  const mism = await text('.pg-err');
  ok('Karta turi mos kelmasa ogohlantiradi', mism.includes('Humo'), mism);
  await page.click('[data-pg=close]'); await w(200);
  ok('To‘lov oynasini yopish (bekor qilish)', (await page.locator('.pg').count()) === 0);
  await payCard('Visa/Mastercard', '4111 1111 1111 1111', true); await otp();
  ok('Visa to‘lovi (CVV, karta egasi, 3-D Secure)', await finishOk());

  // Payme va Click
  for (const [mid, m] of [['s3', 'Payme'], ['k14', 'Click']]) {
    await newBooking(mid);
    await page.click(`[data-a=pay][data-v="${m}"]`); await w(100); await page.click('[data-a=buy]');
    await page.waitForSelector('#pgPh'); await page.click('[data-pg=wallet]'); await otp();
    await page.waitForSelector('[data-pg=walletpay]'); await page.click('[data-pg=walletpay]');
    const good = await finishOk();
    const o = await page.evaluate(() => orders()[0]);
    ok(`${m} to‘lovi (telefon, SMS, hamyondagi karta)`, good && o.payment.method === m && o.payment.txn.startsWith(m === 'Payme' ? 'PM' : 'CL'), o.payment.txn);
  }

  // 7. Sotilgan joy qayta sotilmaydi
  const dbl = await page.evaluate(() => { const o = orders()[0]; const [ci, mid, date, time] = o.key.split('|'); return sold({ ci: +ci, mid, date, time }).has(o.seats[0]); });
  ok('Sotib olingan joy zalda band ko‘rinadi', dbl);

  // 8. Chiptalarim va bekor qilish
  await page.goto(BASE + '#/orders'); await w(300);
  const cnt = await page.locator('#app .shw').count();
  ok('Chiptalarim: foydalanuvchining 5 ta buyurtmasi', cnt === 5, `${cnt} ta`);
  const cb = page.locator('[data-a=refund]').first();
  const canCancel = await cb.count();
  if (canCancel) {
    const code = await cb.getAttribute('data-v');
    await cb.click(); await page.waitForSelector('[data-pg=rfgo]');
    await page.click('[data-pg=rfgo]'); const e1 = await text('.pg-err');
    await page.check('#pgAgree'); await page.click('[data-pg=rfgo]');
    await page.waitForSelector('[data-pg=finish]', { timeout: 8000 }); await page.click('[data-pg=finish]'); await w(300);
    const st = await page.evaluate((c) => orders().find((x) => x.code === c).st, code);
    ok('Chiptani qaytarish: rozilik so‘raladi, holat “Qaytarilgan”, boshqa buyurtmalar o‘chmaydi', e1.includes('rozilik') && st === 'cancel' && (await page.evaluate(() => orders().length)) === 5);
  } else ok('Chiptani qaytarish', true, 'barcha seanslarga 24 soatdan kam qolgani uchun tugma yo‘q (qoida bo‘yicha)');

  // 9. Admin
  await page.goto(BASE + '#/admin'); await w(200);
  await page.fill('#acode', '0000'); await page.click('#fadm button'); await w(100);
  ok('Admin: noto‘g‘ri kod rad etiladi', (await text('#aerr')).includes('noto‘g‘ri'));
  await page.fill('#acode', '1234'); await page.click('#fadm button'); await w(200);
  const kpi = await text('.kpi');
  ok('Admin: umumiy statistika', kpi.includes('Mijozlar'), kpi.replace(/\n/g, ' ').slice(0, 120));
  await page.click('[data-a=atab][data-v=users]'); await w(200);
  await page.fill('#aq', '901234567'); await w(400);
  const ut = await text('#atable');
  ok('Admin: foydalanuvchilar ro‘yxati (haqiqiy ro‘yxatdan o‘tgan)', ut.includes('Aziz Karimov') && ut.includes('+998 90 123 45 67'), ut.split('\n')[1]);
  const [dlu] = await Promise.all([page.waitForEvent('download'), page.click('[data-a=csv]')]);
  ok('Admin: mijozlarni Excel (CSV) ga yuklab olish', dlu.suggestedFilename().startsWith('mijozlar'));
  await page.click('[data-a=ublock]'); await w(200);
  ok('Admin: foydalanuvchini bloklash', (await text('#atable')).includes('Bloklangan'));
  await page.click('[data-a=uorders]'); await w(200);
  ok('Admin: foydalanuvchining buyurtmalari', (await page.locator('#atable tr').count()) === 6);
  await page.selectOption('#af', 'cancel'); await w(150);
  ok('Admin: holat bo‘yicha filtr', (await page.locator('#atable tr').count()) === (canCancel ? 2 : 0));
  await page.click('[data-a=atab][data-v=films]'); await w(150);
  await page.fill('#nt', 'Test filmi'); await page.click('[data-a=addm]'); await w(150);
  ok('Admin: yangi film qo‘shish', (await page.evaluate(() => CAT().length)) === ids.mov.length + 1);
  await page.click('[data-a=delm]'); await w(150);
  ok('Admin: qo‘shilgan filmni o‘chirish', (await page.evaluate(() => CAT().length)) === ids.mov.length);
  // Bloklangan foydalanuvchi kira olmaydi
  await page.reload(); await w(300);
  ok('Bloklangan foydalanuvchi sessiyadan chiqariladi', !(await text('#nav')).includes('Aziz'));
  await go('#/login'); await page.fill('#lphone', '901234567'); await page.fill('#lpass', 'parol123'); await page.click('#fin button[type=submit]'); await w(300);
  ok('Bloklangan foydalanuvchi kira olmaydi', (await text('#lerr')).includes('bloklangan'));
  await go('#/admin'); await page.click('[data-a=atab][data-v=users]'); await w(150); await page.fill('#aq', '901234567'); await w(400); await page.click('[data-a=ublock]'); await w(150);

  // 10. Ma'lumotlar saqlanadi (sahifa yangilangandan keyin)
  await page.reload(); await w(300);
  const persist = await page.evaluate(() => ({ u: KSAuth.all().length, o: orders().length }));
  ok('Sahifa yangilangandan keyin ma’lumotlar saqlanib qoladi', persist.u === 2001 && persist.o === 5, `${persist.u} foydalanuvchi, ${persist.o} buyurtma`);

  // 11. Mobil ko'rinish
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '#/movie/k1'); await w(300); await page.locator('[data-a=book]:not([disabled])').first().click(); await w(1000);
  const mob = await page.evaluate(() => document.querySelector('.lay').getBoundingClientRect().right <= document.documentElement.clientWidth + 1 && document.querySelector('#app').scrollWidth <= document.documentElement.clientWidth);
  ok('Mobil ekran (390 px): sahifa ekranga sig‘adi', mob);
  await page.setViewportSize({ width: 1280, height: 900 });

  ok('JavaScript xatolari yo‘q', !errs.length, errs.slice(0, 3).join(' | '));
  return R.join('\n');
}
