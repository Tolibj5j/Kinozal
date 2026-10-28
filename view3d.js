/*
 * Zalning 3D ko'rinishi: tanlangan o'rindiqdan ekran qanday rakursda ko'rinishini
 * CSS 3D (perspective) yordamida chizadi va kamerani o'rindiqlar orasida animatsiya bilan suradi.
 * Birliklar: 70 px = 1 metr.
 */
(function () {
  const M = 70;          // 1 metr
  const RZ = 70;         // qatorlar orasidagi masofa
  const Z0 = 420;        // ekrandan A qatorgacha (6 m)
  const RISE = 22;       // har qator balandlashadi (amfiteatr)
  const PX = 46;         // o'rindiqlar orasidagi masofa
  const AIS = 40;        // o'rtadagi yo'lak
  const EYE = 95;        // ko'z balandligi (o'rindiq polidan)
  const SB = 150;        // ekran pastki chetining poldan balandligi
  const WH = 760;        // devor balandligi

  let st = null;         // joriy sahna
  let lastTf = null;     // oxirgi kamera holati (qayta chizilganda animatsiya davom etishi uchun)
  let lastRow = null;
  let timer = null;

  const rowId = (r) => String.fromCharCode(65 + r);
  const rz = (r) => Z0 + r * RZ;
  const fy = (r) => -r * RISE;
  const plane = (cls, w, h, tf, extra = '') => `<div class="${cls}" style="width:${w}px;height:${h}px;transform:${tf};${extra}"></div>`;

  function geom(o) {
    const half = Math.ceil(o.cols / 2);
    const W = o.cols * PX + AIS;
    const SW = Math.min(W * 1.02, 1100);
    return { half, W, SW, SH: SW / 2.2, FW: W + 160 };
  }
  const sx = (g, i) => (i - 1) * PX + (i > g.half ? AIS : 0) - g.W / 2 + PX / 2;

  function mount(el, o) {
    const g = geom(o);
    st = { el, o, g };
    let h = '';
    h += plane('v3-scr', g.SW, g.SH, `translate3d(${-g.SW / 2}px,${-SB - g.SH}px,0)`, o.poster ? `background-image:url(${o.poster})` : '');
    h += plane('v3-cur', 130, g.SH + 140, `translate3d(${-g.SW / 2 - 130}px,${-SB - g.SH - 70}px,2px)`);
    h += plane('v3-cur', 130, g.SH + 140, `translate3d(${g.SW / 2}px,${-SB - g.SH - 70}px,2px)`);
    h += plane('v3-floor', g.FW, Z0 - 35, `translate3d(${-g.FW / 2}px,0,0) rotateX(90deg)`);
    h += plane('v3-wall', Z0 - 35, WH, `translate3d(${-g.FW / 2}px,${-WH}px,${Z0 - 35}px) rotateY(90deg)`);
    h += plane('v3-wall', Z0 - 35, WH, `translate3d(${g.FW / 2}px,${-WH}px,${Z0 - 35}px) rotateY(90deg)`);
    for (let r = 0; r < o.rows; r++) {
      const z = rz(r), y = fy(r), vip = r >= o.rows - o.vip;
      let s = plane('v3-floor' + (vip ? ' vip' : ''), g.FW, RZ, `translate3d(${-g.FW / 2}px,${y}px,${z - 35}px) rotateX(90deg)`);
      s += plane('v3-wall', RZ, WH + y, `translate3d(${-g.FW / 2}px,${-WH}px,${z + 35}px) rotateY(90deg)`);
      s += plane('v3-wall', RZ, WH + y, `translate3d(${g.FW / 2}px,${-WH}px,${z + 35}px) rotateY(90deg)`);
      for (let i = 1; i <= o.cols; i++) {
        const id = rowId(r) + i;
        const cls = ['v3-seat', vip ? 'vip' : '', o.sold && o.sold.has(id) ? 'p' : '', o.sel && o.sel.includes(id) ? 'sel' : ''].join(' ');
        s += `<div class="${cls}" style="transform:translate3d(${sx(g, i) - 20}px,${y - 46}px,${z + 18}px)"></div>`;
      }
      h += `<div class="v3-row" data-r="${r}">${s}</div>`;
    }
    const tag = el.querySelector('.v3-tag');
    el.innerHTML = `<div class="v3-world">${h}</div>`;
    if (tag) el.appendChild(tag);
    el.style.perspective = Math.round(el.clientWidth * 0.48) + 'px';
    st.world = el.querySelector('.v3-world');
    st.rows = [...el.querySelectorAll('.v3-row')];
    if (lastTf) { st.world.style.transition = 'none'; st.world.style.transform = lastTf; void st.world.offsetWidth; st.world.style.transition = ''; }
  }

  function cam(r, i) {
    const g = st.g;
    const x = sx(g, i), ey = fy(r) - EYE, z = rz(r) + 8;
    const dx = -x, dy = -SB - g.SH * 0.22 - ey, dz = -z;
    const hd = Math.hypot(dx, dz);
    return { x, ey, z, yaw: Math.atan2(dx, -dz), pitch: Math.atan2(-dy, hd), dist: Math.hypot(dx, dy, dz) };
  }

  function hideRows(from) { st.rows.forEach((el, k) => { el.style.display = k >= from ? 'none' : ''; }); }

  function look(r, i, fast) {
    if (!st) return;
    const c = cam(r, i);
    const P = parseFloat(st.el.style.perspective) || 500;
    const tf = `translateZ(${P}px) rotateX(${c.pitch}rad) rotateY(${c.yaw}rad) translate3d(${-c.x}px,${-c.ey}px,${-c.z}px)`;
    st.el.classList.toggle('fast', !!fast);
    // Animatsiya paytida kameraning orqasida qoladigan qatorlarni yashiramiz
    hideRows(lastRow === null ? r : Math.min(lastRow, r));
    clearTimeout(timer);
    timer = setTimeout(() => hideRows(r), fast ? 460 : 920);
    requestAnimationFrame(() => { st.world.style.transform = tf; });
    lastTf = tf;
    lastRow = r;
    return info(r, i);
  }

  function info(r, i) {
    const g = st.g, c = cam(r, i);
    const ang = Math.round((2 * Math.atan(g.SW / 2 / c.z)) * 180 / Math.PI);
    const side = Math.round(Math.abs(c.yaw) * 180 / Math.PI);
    let grade = ang > 62 ? 'Juda yaqin: boshni ko‘tarib, ekranni ko‘z bilan kezib ko‘rasiz'
      : ang > 46 ? 'Kinoga to‘liq sho‘ng‘ish effekti, ekran ko‘zni to‘ldiradi'
        : ang > 32 ? 'A’lo ko‘rinish: butun ekran bir qarashda ko‘rinadi'
          : ang > 22 ? 'Yaxshi, lekin ekran biroz kichikroq ko‘rinadi' : 'Uzoq: ekran kichik ko‘rinadi';
    if (side > 16) grade += '. Ekran yon tomondan, biroz qiyshiq ko‘rinadi';
    return { dist: (c.dist / M).toFixed(1), ang, side, grade, score: Math.max(0, Math.min(100, Math.round(100 - Math.abs(ang - 40) * 2 - side * 1.5))) };
  }

  addEventListener('resize', () => { if (st && st.el.isConnected) st.el.style.perspective = Math.round(st.el.clientWidth * 0.48) + 'px'; });

  window.KSView = { mount, look, info };
})();
