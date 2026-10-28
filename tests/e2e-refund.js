// Band joylar mijozlar nomidan saqlanishi va 24 soatlik qaytarish qoidasini tekshiradi.
async (page) => {
  const BASE = 'http://show.test/';
  const R = [];
  const errs = [];
  const ok = (name, cond, extra = '') => R.push(`${cond ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`);
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(() => { window.confirm = () => true; });
  const w = (ms) => page.waitForTimeout(ms);
  const text = (s) => page.locator(s).first().innerText();
  const refundFlow = async () => {
    await page.waitForSelector('[data-pg=rfgo]'); await page.check('#pgAgree'); await page.click('[data-pg=rfgo]');
    await page.waitForSelector('[data-pg=finish]', { timeout: 8000 }); await page.click('[data-pg=finish]'); await w(300);
  };
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload(); await w(500);

  // 1. Band joylar mijozlar nomidan
  const d = await page.evaluate(() => {
    const t = performance.now(); const all = allOrders(); const ms = performance.now() - t;
    let mism = 0, checked = 0;
    for (let k = 0; k < 40; k++) {
      const c = CIN[k % CIN.length], date = dk(k % 7), sh = showsOf(c.id, date)[0]; if (!sh) continue;
      const B = { ci: c.id, mid: sh.m.id, date, time: sh.t[0] };
      const fromOrders = new Set(all.filter((o) => o.key === skey(B) && paid(o)).flatMap((o) => o.seats));
      const s = sold(B); checked++;
      if (s.size !== fromOrders.size || [...s].some((x) => !fromOrders.has(x))) mism++;
    }
    const users = KSAuth.all(), names = new Set(users.map((u) => u.id));
    return { n: all.length, seats: all.reduce((a, o) => a + o.seats.length, 0), ms: Math.round(ms), users: users.length, orphan: all.filter((o) => !names.has(o.uid)).length, mism, checked, codes: new Set(all.map((o) => o.code)).size, sample: all.find((o) => o.seed) };
  });
  ok('Barcha band joylar buyurtmalarga aylantirildi', d.n > 50000, `${d.n.toLocaleString()} buyurtma, ${d.seats.toLocaleString()} joy, ${d.ms} ms`);
  ok('Har bir buyurtma ro‘yxatdagi mijozga tegishli', d.orphan === 0 && d.users === 2000, `${d.users} mijoz`);
  ok('Zal sxemasidagi band joylar = buyurtmalardagi joylar', d.mism === 0, `${d.checked} ta seans tekshirildi`);
  ok('Buyurtma kodlari takrorlanmaydi', d.codes === d.n);
  ok('Namuna buyurtma', !!d.sample, `${d.sample.code}: ${d.sample.name}, ${d.sample.phone}, ${d.sample.seats.join(' ')}, ${d.sample.pay}, ${d.sample.src}`);

  // 2. Admin panel
  await page.goto(BASE + '#/admin'); await w(200); await page.fill('#acode', '1234'); await page.click('#fadm button'); await w(600);
  const kpi = await text('.kpi');
  ok('Admin statistikasi band joylarni hisoblaydi', /Mijozlar\s*2000/.test(kpi), kpi.replace(/\s+/g, ' ').slice(0, 160));
  await page.click('[data-a=atab][data-v=users]'); await w(400);
  const ut = await page.locator('#atable tr').nth(1).innerText();
  ok('Mijozlar jadvali: buyurtma soni va summasi', /\d+\t[\d ]+ so‘m/.test(ut), ut.replace(/\t/g, ' | '));
  await page.selectOption('#asrc', 'Telegram bot'); await w(300);
  const tg = await text('#atable .sub');
  ok('Kanal bo‘yicha filtr (Telegram bot)', /\d+ ta mijoz/.test(tg), tg);
  const phone = await page.evaluate(() => KSAuth.all()[3].phone);
  await page.click('[data-a=atab][data-v=orders]'); await w(800);
  const tot = await text('#atable .sub');
  ok('Buyurtmalar jadvali', /buyurtma/.test(tot), tot);

  // 3. 24 soatdan ko'p qolgan buyurtmani admin qaytaradi
  const far = await page.evaluate(() => allOrders().find((o) => o.seed && paid(o) && hoursLeft(o) > 30));
  const near = await page.evaluate(() => allOrders().find((o) => o.seed && paid(o) && hoursLeft(o) > 0 && hoursLeft(o) < 23));
  await page.fill('#aq', far.code); await w(400);
  ok('24 soatdan ko‘p: “Qaytarish” tugmasi bor', (await page.locator('#atable [data-a=refund]').count()) === 1, `${far.code}, seansgacha ${Math.round((Date.parse(far.date + 'T' + far.time) - Date.now()) / 36e5)} soat`);
  await page.click('#atable [data-a=refund]');
  const head = await text('.pg-sum');
  await refundFlow();
  const after = await page.evaluate((c) => { const o = allOrders().find((x) => x.code === c); const [ci, mid, date, time] = o.key.split('|'); const s = sold({ ci: +ci, mid, date, time }); return { st: o.st, by: o.refund && o.refund.by, free: o.seats.every((x) => !s.has(x)) }; }, far.code);
  ok('Admin qaytardi: holat “Qaytarilgan”, joylar bo‘shadi', after.st === 'cancel' && after.by === 'admin' && after.free, head.replace(/\n/g, ' '));
  await page.reload(); await w(500);
  const persisted = await page.evaluate((c) => allOrders().find((x) => x.code === c).st, far.code);
  ok('Qaytarish sahifa yangilangandan keyin ham saqlanadi', persisted === 'cancel');

  // 4. 24 soatdan kam qolgan buyurtma qaytarilmaydi
  if (near) {
    await page.goto(BASE + '#/admin'); await w(300); await page.click('[data-a=atab][data-v=orders]'); await w(600);
    await page.fill('#aq', near.code); await w(400);
    const row = await page.locator('#atable tr').nth(1).innerText();
    ok('24 soatdan kam: admin ham qaytara olmaydi', (await page.locator('#atable [data-a=refund]').count()) === 0 && row.includes('24 soatdan kam'), `${near.code}`);
    await page.goto(BASE + '#/ticket/' + near.code); await w(300);
    const tk = await text('#app');
    ok('Chipta sahifasida qaytarish tugmasi yo‘q va sabab yozilgan', (await page.locator('[data-a=refund]').count()) === 0 && tk.includes('24 soatdan kam'));
    await page.evaluate((c) => ACT.refund(c), near.code); await w(200);
    ok('To‘g‘ridan-to‘g‘ri chaqirilsa ham rad etiladi', (await text('#toast')).includes('24 soatdan kam') && (await page.locator('.pg').count()) === 0, await text('#toast'));
  } else ok('24 soatdan kam qolgan seans', true, 'hozir bunday seans yo‘q');

  // 5. Mijoz o'z chiptasini qaytaradi (sayt orqali)
  await page.goto(BASE + '#/login'); await page.click('[data-a=ltab][data-v=up]');
  await page.fill('#lname', 'Dilshod Test'); await page.fill('#lphone', '+998 97 555 44 33'); await page.fill('#lpass', 'parol123'); await page.fill('#lpass2', 'parol123');
  await page.click('#fup button[type=submit]'); await w(300);
  await page.evaluate(() => { S.date = 3; }); await page.goto(BASE + '#/movie/k2'); await w(300);
  await page.evaluate(() => { S.date = 3; draw(); }); await w(200);
  await page.locator('[data-a=book]:not([disabled])').first().click(); await w(500);
  await page.locator('.seat:not([disabled])').first().click(); await w(200); await page.click('[data-a=next]'); await w(300);
  await page.click('[data-a=pay][data-v=Click]'); await page.click('[data-a=buy]');
  await page.waitForSelector('#pgPh'); await page.click('[data-pg=wallet]'); await page.waitForSelector('#pgOtp'); await page.click('.pg-sms'); await page.click('.pg-btn');
  await page.waitForSelector('[data-pg=walletpay]'); await page.click('[data-pg=walletpay]'); await page.waitForSelector('[data-pg=finish]', { timeout: 8000 }); await page.click('[data-pg=finish]'); await w(400);
  const note = await text('#app .sub');
  ok('Chipta sahifasida qaytarish muddati ko‘rsatiladi', note.includes('Qaytarish mumkin'), note);
  await page.goto(BASE + '#/orders'); await w(300);
  const rule = await text('#app');
  ok('Chiptalarim: qaytarish qoidasi yozilgan', rule.includes('24 soat oldin'));
  await page.click('[data-a=refund]'); await page.waitForSelector('[data-pg=rfgo]');
  const term = await text('.pg-rc');
  await page.click('[data-pg=close]'); await w(200);
  ok('Qaytarish oynasini yopish chiptani o‘zgartirmaydi', (await page.evaluate(() => orders()[0].st)) === 'paid');
  await page.click('[data-a=refund]'); await refundFlow();
  const mine = await page.evaluate(() => orders()[0]);
  ok('Mijoz qaytardi: Click hamyoniga, sabab saqlandi', mine.st === 'cancel' && mine.refund.by === 'user' && term.includes('Click hamyoniga'), `${mine.refund.id}, ${mine.refund.reason}`);
  const st2 = await text('#app');
  ok('Ro‘yxatda “Qaytarilgan” belgisi', st2.includes('Qaytarilgan'));

  // 6. Kassada xarid qilgan mijoz saytda ro'yxatdan o'tadi
  await page.click('#nav a.btn'); await w(150); await page.click('[data-a=logout]'); await w(200);
  const cu = await page.evaluate((p) => { const u = KSAuth.all().find((x) => x.phone === p); return { name: u.name, n: allOrders().filter((o) => o.uid === u.id).length }; }, phone);
  await page.goto(BASE + '#/login'); await w(200); await page.click('[data-a=ltab][data-v=in]'); await page.fill('#lphone', phone.slice(3)); await page.fill('#lpass', 'x'); await page.click('#fin button[type=submit]'); await w(200);
  const msg = await text('#lerr');
  await page.click('[data-a=ltab][data-v=up]');
  await page.fill('#lname', cu.name); await page.fill('#lphone', phone.slice(3)); await page.fill('#lpass', 'parol123'); await page.fill('#lpass2', 'parol123');
  await page.click('#fup button[type=submit]'); await w(300);
  await page.goto(BASE + '#/orders'); await w(500);
  const n = await page.locator('#app .shw').count();
  ok('Kassa mijozi ro‘yxatdan o‘tganda eski chiptalari ko‘rinadi', msg.includes('parol o‘rnatilmagan') && n === Math.min(cu.n, 20), `${cu.name}: ${cu.n} ta chipta`);

  ok('JavaScript xatolari yo‘q', !errs.length, errs.slice(0, 3).join(' | '));
  return R.join('\n');
}
