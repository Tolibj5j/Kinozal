// Kino va shoular uchun SVG posterlarni yaratadi: node tools/make-posters.js
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'img');
fs.mkdirSync(OUT, { recursive: true });

const W = 300, H = 400;
const sky = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
const glow = (id, col) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity=".9"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
const stars = (n, seed, maxY = 220) => {
  let s = seed, o = '';
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) o += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * maxY).toFixed(1)}" r="${(r() * 1.4 + .3).toFixed(2)}" fill="#fff" opacity="${(r() * .6 + .3).toFixed(2)}"/>`;
  return o;
};
const wrap = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient></defs>${body}<rect width="${W}" height="${H}" fill="url(#shade)"/></svg>`;

const P = {
  // Qirq kun qorong'ulik — tog'li qishloq, to'lin oy, yolg'iz fonar
  k1: wrap(sky('g', '#0b0a1f', '#3a0f2c', '#120510') + glow('m', '#ffe9c4'),
    `<rect width="300" height="400" fill="url(#g)"/>${stars(60, 3)}<circle cx="210" cy="90" r="70" fill="url(#m)"/><circle cx="210" cy="90" r="30" fill="#fff4dc"/>
    <path d="M0 250 L60 170 L110 230 L170 150 L240 240 L300 190 V400 H0Z" fill="#1d0b1f"/><path d="M0 300 L80 250 L150 290 L230 245 L300 280 V400 H0Z" fill="#12060f"/>
    <g fill="#0a0309"><rect x="40" y="275" width="40" height="30"/><path d="M36 277 L60 258 L84 277Z"/><rect x="200" y="268" width="50" height="36"/><path d="M196 270 L225 248 L254 270Z"/></g>
    <rect x="52" y="285" width="10" height="10" fill="#ffcf6b"/><path d="M150 400 L150 330" stroke="#0a0309" stroke-width="3"/><circle cx="150" cy="328" r="5" fill="#ffcf6b"/><circle cx="150" cy="328" r="22" fill="url(#m)" opacity=".5"/>
    <path d="M128 400 q4 -40 8 -46 q6 -6 10 0 q4 6 6 46Z" fill="#000"/>`),
  // Samarqand sarguzashti — Registon gumbazlari, quyosh
  k2: wrap(sky('g', '#ffb347', '#e86a2c', '#5a2410') + glow('s', '#fff2b0'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="150" r="110" fill="url(#s)"/><circle cx="150" cy="150" r="44" fill="#fff4c8"/>
    <g fill="#3b1608"><rect x="20" y="200" width="70" height="140"/><rect x="210" y="200" width="70" height="140"/><rect x="95" y="230" width="110" height="110"/>
    <path d="M105 230 Q150 150 195 230Z"/><rect x="8" y="150" width="16" height="190"/><rect x="276" y="150" width="16" height="190"/><rect x="88" y="175" width="12" height="165"/><rect x="200" y="175" width="12" height="165"/></g>
    <g fill="#2a96b8"><path d="M30 200 Q55 150 80 200Z"/><path d="M220 200 Q245 150 270 200Z"/><path d="M118 232 Q150 175 182 232Z"/></g>
    <g fill="#5a2410"><path d="M40 340 V255 Q55 230 70 255 V340Z"/><path d="M230 340 V255 Q245 230 260 255 V340Z"/><path d="M128 340 V275 Q150 245 172 275 V340Z"/></g>
    <rect y="338" width="300" height="62" fill="#2a0f05"/><g fill="#14070a"><circle cx="120" cy="352" r="7"/><rect x="114" y="358" width="12" height="30" rx="4"/><circle cx="150" cy="350" r="7"/><rect x="144" y="356" width="12" height="32" rx="4"/><circle cx="180" cy="352" r="7"/><rect x="174" y="358" width="12" height="30" rx="4"/></g>`),
  // Ipak yo'li: Oxirgi karvon — cho'l, tuyalar karvoni
  k3: wrap(sky('g', '#2b0f0a', '#c2501c', '#f0a04b') + glow('s', '#ffd27a'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="80" cy="230" r="90" fill="url(#s)"/><circle cx="80" cy="230" r="34" fill="#ffe2a0"/>
    <path d="M0 270 Q80 240 150 265 T300 255 V400 H0Z" fill="#a8461a"/><path d="M0 310 Q100 280 190 305 T300 300 V400 H0Z" fill="#6e2a0f"/>
    <g fill="#2a0e05">${[60, 130, 200].map((x, i) => `<g transform="translate(${x} ${262 - i * 2})"><ellipse cx="20" cy="18" rx="22" ry="11"/><path d="M8 10 q6 -14 14 0 q6 -12 12 0Z"/><path d="M38 14 q10 -8 10 -22 l6 0 q0 18 -12 26Z"/><circle cx="52" cy="-9" r="5"/><rect x="4" y="24" width="3" height="20"/><rect x="14" y="24" width="3" height="20"/><rect x="26" y="24" width="3" height="20"/><rect x="34" y="24" width="3" height="20"/><path d="M14 6 l6 -16 l6 16Z"/></g>`).join('')}</g>
    <path d="M0 400 L0 340 Q40 330 70 345 L90 400Z" fill="#3a1407"/>`),
  // Yulduzlar ortida — sayyora, raketa, yulduzlar
  k4: wrap(sky('g', '#03041a', '#14205e', '#2c3a8f') + glow('p', '#7fb2ff') + '<linearGradient id="pl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ad0ff"/><stop offset="1" stop-color="#2a3a9a"/></linearGradient>',
    `<rect width="300" height="400" fill="url(#g)"/>${stars(120, 7, 400)}<circle cx="200" cy="300" r="170" fill="url(#p)" opacity=".5"/><circle cx="200" cy="300" r="120" fill="url(#pl)"/>
    <ellipse cx="200" cy="300" rx="180" ry="26" fill="none" stroke="#cfe3ff" stroke-width="5" opacity=".7" transform="rotate(-18 200 300)"/>
    <g transform="translate(95 120) rotate(35)"><path d="M0 -50 Q14 -30 14 10 L-14 10 Q-14 -30 0 -50Z" fill="#eef3ff"/><circle cy="-18" r="6" fill="#3a5bd9"/><path d="M-14 0 L-26 18 L-14 12Z M14 0 L26 18 L14 12Z" fill="#ff5b5b"/><path d="M-8 12 Q0 50 8 12Z" fill="#ffb347"/></g>
    <circle cx="60" cy="60" r="14" fill="#c9d6ff" opacity=".8"/>`),
  // Kulgi ustaxonasi — rangli ustaxona, bolg'a, kulgich yuz
  k5: wrap(sky('g', '#1f5a63', '#2d8a8f', '#0f2f35'),
    `<rect width="300" height="400" fill="url(#g)"/><g opacity=".15" fill="#fff">${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${i * 50 - 20}" y="0" width="22" height="400" transform="skewX(-15)"/>`).join('')}</g>
    <circle cx="150" cy="170" r="80" fill="#ffd23f"/><circle cx="122" cy="150" r="10" fill="#1f2a30"/><circle cx="178" cy="150" r="10" fill="#1f2a30"/><path d="M105 185 Q150 245 195 185 Z" fill="#1f2a30"/><path d="M120 200 Q150 225 180 200 Z" fill="#ff6b6b"/>
    <g transform="translate(60 290) rotate(-30)"><rect x="-4" y="0" width="8" height="70" rx="3" fill="#8b5a2b"/><rect x="-22" y="-12" width="44" height="18" rx="3" fill="#cfd8dc"/></g>
    <g transform="translate(240 290) rotate(25)"><rect x="-4" y="0" width="8" height="70" rx="3" fill="#8b5a2b"/><path d="M-14 -8 L14 -8 L8 10 L-8 10Z" fill="#ff8f3f"/></g>
    <g fill="#ffd23f"><path d="M40 70 l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2Z"/><path d="M255 60 l4 10 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1Z"/></g>`),
  // Bahor muhabbati — gullagan o'rik, ikki siluet, yurak
  k6: wrap(sky('g', '#ffd1dc', '#e88aa8', '#8f2d56'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="140" r="60" fill="#fff0f4" opacity=".7"/>
    <path d="M70 400 Q80 300 60 220 Q50 180 80 150 M60 220 Q30 200 20 170 M68 260 Q110 230 130 200" stroke="#5a2236" stroke-width="9" fill="none" stroke-linecap="round"/>
    <g fill="#fff">${Array.from({ length: 40 }, (_, i) => { const x = 10 + (i * 37) % 160, y = 120 + (i * 53) % 130; return `<circle cx="${x}" cy="${y}" r="${4 + (i % 4)}" opacity="${.6 + (i % 3) * .15}" fill="${i % 3 ? '#fff' : '#ffc2d4'}"/>`; }).join('')}</g>
    <g fill="#3a0f22"><circle cx="175" cy="265" r="12"/><path d="M162 400 L165 285 Q175 275 185 285 L190 400Z"/><circle cx="215" cy="270" r="11"/><path d="M200 400 Q205 300 205 290 Q215 280 225 290 L235 400Z"/></g>
    <path d="M195 230 c-10 -14 -30 -4 -20 12 l20 18 l20 -18 c10 -16 -10 -26 -20 -12Z" fill="#ff3d6e"/>
    ${[[230, 60], [260, 120], [40, 70], [270, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`).join('')}`),
  // Qora bo'ron — bo'ronli shahar, chaqmoq, siluet
  k7: wrap(sky('g', '#07070c', '#23233a', '#3b3b55'),
    `<rect width="300" height="400" fill="url(#g)"/><g fill="#15151f" opacity=".9"><ellipse cx="60" cy="60" rx="110" ry="40"/><ellipse cx="230" cy="80" rx="120" ry="45"/><ellipse cx="150" cy="40" rx="130" ry="35"/></g>
    <path d="M190 90 L160 170 L185 170 L150 260 L215 150 L188 150 L215 90Z" fill="#cde7ff"/><path d="M190 90 L160 170 L185 170 L150 260 L215 150 L188 150 L215 90Z" fill="#7fc4ff" opacity=".4" transform="translate(4 2)"/>
    <g fill="#0a0a12"><rect x="0" y="260" width="40" height="140"/><rect x="40" y="220" width="35" height="180"/><rect x="75" y="280" width="30" height="120"/><rect x="105" y="200" width="45" height="200"/><rect x="150" y="250" width="30" height="150"/><rect x="180" y="190" width="40" height="210"/><rect x="220" y="270" width="35" height="130"/><rect x="255" y="230" width="45" height="170"/></g>
    <g fill="#ffd36b" opacity=".6">${Array.from({ length: 30 }, (_, i) => `<rect x="${(i * 41) % 290 + 5}" y="${230 + (i * 29) % 150}" width="4" height="5"/>`).join('')}</g>
    <g stroke="#9fb3c8" stroke-width="1" opacity=".35">${Array.from({ length: 40 }, (_, i) => `<line x1="${(i * 23) % 300}" y1="${(i * 47) % 400}" x2="${(i * 23) % 300 - 8}" y2="${(i * 47) % 400 + 22}"/>`).join('')}</g>
    <g fill="#000"><circle cx="150" cy="318" r="10"/><path d="M135 400 L138 332 Q150 324 162 332 L165 400Z"/><path d="M162 336 L190 360 L186 364 L160 345Z"/></g>`),
  // Kichik paxlavon — bola qahramon, plash, tog'lar
  k8: wrap(sky('g', '#7fd3ff', '#4fb37a', '#1f5a3a') + glow('s', '#fff6b0'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="240" cy="70" r="60" fill="url(#s)"/><circle cx="240" cy="70" r="24" fill="#fff3a0"/>
    <g fill="#fff" opacity=".9"><ellipse cx="70" cy="70" rx="40" ry="14"/><ellipse cx="95" cy="62" rx="26" ry="14"/></g>
    <path d="M0 260 L70 170 L130 240 L200 160 L300 250 V400 H0Z" fill="#3c8c5a"/><path d="M0 310 Q150 270 300 310 V400 H0Z" fill="#2a6b41"/>
    <g transform="translate(150 255)"><path d="M-6 -30 Q-50 10 -40 70 L0 40Z" fill="#e8402f"/><circle cy="-46" r="20" fill="#f2c39b"/><path d="M-20 -52 Q0 -76 20 -52 Q10 -60 -20 -52Z" fill="#3a2414"/><circle cx="-7" cy="-46" r="3" fill="#222"/><circle cx="7" cy="-46" r="3" fill="#222"/><path d="M-6 -36 Q0 -31 6 -36" stroke="#222" stroke-width="2" fill="none"/>
    <rect x="-18" y="-26" width="36" height="44" rx="10" fill="#2f5bd9"/><path d="M-8 -18 l8 8 l8 -8 l-8 18Z" fill="#ffd23f"/><path d="M18 -20 L44 -50" stroke="#2f5bd9" stroke-width="12" stroke-linecap="round"/><circle cx="46" cy="-52" r="8" fill="#f2c39b"/>
    <rect x="-14" y="16" width="11" height="30" rx="4" fill="#3a2414"/><rect x="3" y="16" width="11" height="30" rx="4" fill="#3a2414"/></g>`),
  // Soyalar vodiysi — qorong'i o'rmon, ko'zlar, tuman
  k9: wrap(sky('g', '#05030c', '#1d1033', '#2a1a3d') + glow('f', '#b9a7ff'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="110" r="45" fill="#d9d0ff" opacity=".85"/><circle cx="168" cy="98" r="40" fill="#1d1033"/>
    <g fill="#08040f">${[[20, 120], [70, 90], [230, 100], [280, 130], [120, 150], [190, 140]].map(([x, y]) => `<path d="M${x} 400 L${x - 4} ${y + 60} L${x - 30} ${y + 90} L${x - 3} ${y + 50} L${x - 22} ${y + 55} L${x} ${y} L${x + 22} ${y + 55} L${x + 3} ${y + 50} L${x + 30} ${y + 90} L${x + 4} ${y + 60} L${x + 6} 400Z"/>`).join('')}</g>
    <ellipse cx="150" cy="330" rx="200" ry="40" fill="url(#f)" opacity=".35"/>
    <g fill="#ffde59"><ellipse cx="135" cy="280" rx="5" ry="3"/><ellipse cx="152" cy="280" rx="5" ry="3"/><ellipse cx="60" cy="300" rx="3" ry="2"/><ellipse cx="70" cy="300" rx="3" ry="2"/></g>
    <g fill="#ff3d3d"><ellipse cx="240" cy="290" rx="4" ry="2.5"/><ellipse cx="253" cy="290" rx="4" ry="2.5"/></g>`),
  // Mehmon kelsa — hovli, dasturxon, chiroqlar, eshik
  k10: wrap(sky('g', '#2a1238', '#a0541c', '#e0913f'),
    `<rect width="300" height="400" fill="url(#g)"/><path d="M0 40 Q150 90 300 40" stroke="#3a1a10" stroke-width="2" fill="none"/>
    <g>${Array.from({ length: 9 }, (_, i) => { const x = 20 + i * 33, y = 40 + Math.sin(i / 8 * Math.PI) * 25; return `<circle cx="${x}" cy="${y + 8}" r="6" fill="${['#ffd23f', '#ff6b6b', '#6be0ff'][i % 3]}"/>`; }).join('')}</g>
    <rect x="30" y="120" width="240" height="190" fill="#5a2a12"/><path d="M20 125 L150 70 L280 125Z" fill="#3a1608"/><path d="M115 310 V200 Q150 165 185 200 V310Z" fill="#2a0f05"/><path d="M120 310 V203 Q150 172 180 203 V310Z" fill="#ffcf7a"/>
    <rect x="50" y="170" width="45" height="45" fill="#ffcf7a"/><rect x="205" y="170" width="45" height="45" fill="#ffcf7a"/><path d="M72 170 V215 M50 192 H95 M227 170 V215 M205 192 H250" stroke="#5a2a12" stroke-width="3"/>
    <rect y="310" width="300" height="90" fill="#3a1608"/><ellipse cx="150" cy="350" rx="110" ry="20" fill="#c2302a"/><g fill="#ffd9a0"><circle cx="110" cy="345" r="9"/><circle cx="150" cy="342" r="11"/><circle cx="190" cy="345" r="9"/></g>
    <g fill="#14070a"><circle cx="150" cy="225" r="10"/><path d="M137 310 L140 238 Q150 230 160 238 L163 310Z"/><rect x="158" y="262" width="16" height="12" rx="2" fill="#7a3a1a"/></g>`),
  // Sharq taronalari — doira, notalar, sahna nurlari
  s1: wrap(sky('g', '#1a0516', '#7a1d5e', '#2a0820') + glow('l', '#ffd36b'),
    `<rect width="300" height="400" fill="url(#g)"/><g opacity=".35">${[40, 110, 190, 260].map(x => `<path d="M${x} 0 L${x - 50} 330 L${x + 50} 330Z" fill="#ffd36b"/>`).join('')}</g>
    <circle cx="150" cy="210" r="80" fill="#e8c38a"/><circle cx="150" cy="210" r="80" fill="none" stroke="#5a2a12" stroke-width="10"/><circle cx="150" cy="210" r="62" fill="none" stroke="#a0541c" stroke-width="2" stroke-dasharray="4 6"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<circle cx="${150 + Math.cos(a) * 80}" cy="${210 + Math.sin(a) * 80}" r="5" fill="#ffd36b"/>`; }).join('')}
    <g fill="#ffd36b"><circle cx="50" cy="90" r="9"/><rect x="57" y="50" width="3" height="40"/><circle cx="250" cy="110" r="9"/><circle cx="275" cy="100" r="9"/><rect x="257" y="68" width="3" height="42"/><rect x="282" y="58" width="3" height="42"/><rect x="257" y="58" width="28" height="8"/></g>
    <rect y="330" width="300" height="70" fill="#14030f"/><g fill="#000">${Array.from({ length: 14 }, (_, i) => `<circle cx="${i * 23 + 6}" cy="${352 + (i % 2) * 6}" r="10"/>`).join('')}</g>`),
  // Stand-up kechasi — mikrofon, spot nur, g'isht devor
  s2: wrap(sky('g', '#2a0c04', '#a13b0d', '#3a1004') + glow('l', '#ffe0a0'),
    `<rect width="300" height="400" fill="url(#g)"/><g stroke="#000" stroke-opacity=".25" stroke-width="2">${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 28}" x2="300" y2="${i * 28}"/>`).join('')}${Array.from({ length: 14 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<line x1="${c * 56 + (r % 2) * 28}" y1="${r * 28}" x2="${c * 56 + (r % 2) * 28}" y2="${r * 28 + 28}"/>`).join('')).join('')}</g>
    <ellipse cx="150" cy="200" rx="120" ry="170" fill="url(#l)" opacity=".75"/>
    <g transform="translate(150 150)"><rect x="-22" y="-60" width="44" height="64" rx="22" fill="#2b2b2b"/><g stroke="#555" stroke-width="2">${[-45, -35, -25, -15, -5].map(y => `<line x1="-20" y1="${y}" x2="20" y2="${y}"/>`).join('')}</g><rect x="-8" y="4" width="16" height="30" fill="#1a1a1a"/><rect x="-3" y="34" width="6" height="150" fill="#111"/><ellipse cy="186" rx="40" ry="8" fill="#111"/></g>
    <rect y="345" width="300" height="55" fill="#1a0602"/>`),
  // Oq oqqush — balerina siluet, oy, ko'l
  s3: wrap(sky('g', '#0c1630', '#34507a', '#7a9cc6') + glow('m', '#ffffff'),
    `<rect width="300" height="400" fill="url(#g)"/>${stars(40, 11, 160)}<circle cx="150" cy="110" r="70" fill="url(#m)" opacity=".6"/><circle cx="150" cy="110" r="38" fill="#f4f8ff"/>
    <rect y="300" width="300" height="100" fill="#1d3354"/><g stroke="#cfe0ff" stroke-opacity=".5">${[312, 328, 346, 366].map((y, i) => `<line x1="${60 - i * 15}" y1="${y}" x2="${240 + i * 15}" y2="${y}"/>`).join('')}</g>
    <g fill="#fff"><circle cx="150" cy="168" r="11"/><path d="M146 178 Q138 210 144 236 L156 236 Q162 210 154 178Z"/><path d="M100 236 Q150 210 200 236 Q150 252 100 236Z"/><path d="M147 236 L120 296 L126 298 L151 240Z"/><path d="M153 236 L196 210 L198 216 L157 242Z"/><path d="M146 186 Q110 160 92 128 L96 125 Q118 152 150 180Z"/><path d="M154 186 Q190 160 208 128 L204 125 Q182 152 150 180Z"/></g>`),
  // Jazz va yulduzlar — saksofon, notalar, yulduzlar
  s4: wrap(sky('g', '#060d18', '#1e3b5c', '#0c1a2a') + glow('l', '#ffc04d'),
    `<rect width="300" height="400" fill="url(#g)"/>${stars(70, 19, 400)}<circle cx="150" cy="220" r="140" fill="url(#l)" opacity=".35"/>
    <g transform="translate(150 215) rotate(-20)" fill="#e0a43a" stroke="#8a5a12" stroke-width="2"><path d="M-10 -120 L10 -120 L14 40 Q16 90 -20 100 Q-60 104 -66 70 L-48 64 Q-44 82 -24 80 Q-4 76 -6 40Z"/><ellipse cx="-57" cy="67" rx="20" ry="9"/>
    ${[-90, -65, -40, -15, 10].map(y => `<circle cx="10" cy="${y}" r="5" fill="#fff3c4"/>`).join('')}<path d="M-10 -120 L-30 -140" stroke-width="6"/></g>
    <g fill="#ffc04d"><circle cx="60" cy="100" r="8"/><rect x="66" y="64" width="3" height="36"/><circle cx="240" cy="80" r="8"/><rect x="246" y="44" width="3" height="36"/><path d="M246 44 q14 8 10 22 q-2 -12 -10 -14Z"/></g>`),
  // Sehr olami — shlyapa, sehrli tayoqcha, yulduzchalar
  s5: wrap(sky('g', '#12061f', '#5b2a86', '#1c0a2e') + glow('l', '#d6a8ff'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="200" r="150" fill="url(#l)" opacity=".4"/>
    <path d="M90 300 L210 300 L200 190 L100 190Z" fill="#111"/><rect x="100" y="215" width="100" height="16" fill="#c2302a"/><ellipse cx="150" cy="300" rx="95" ry="18" fill="#000"/>
    <g fill="#fff"><ellipse cx="135" cy="182" rx="12" ry="22"/><ellipse cx="160" cy="180" rx="12" ry="24"/><circle cx="148" cy="196" r="18"/></g><circle cx="142" cy="192" r="2.5" fill="#222"/><circle cx="155" cy="192" r="2.5" fill="#222"/><ellipse cx="148" cy="200" rx="3" ry="2" fill="#ff8fb1"/>
    <g transform="translate(220 140) rotate(30)"><rect x="-4" y="0" width="8" height="90" fill="#111"/><rect x="-4" y="0" width="8" height="14" fill="#fff"/></g>
    <g fill="#ffe680">${[[230, 110, 10], [260, 80, 7], [200, 90, 6], [70, 120, 8], [50, 200, 5], [250, 220, 6]].map(([x, y, r]) => `<path d="M${x} ${y - r * 2} L${x + r / 2} ${y - r / 2} L${x + r * 2} ${y} L${x + r / 2} ${y + r / 2} L${x} ${y + r * 2} L${x - r / 2} ${y + r / 2} L${x - r * 2} ${y} L${x - r / 2} ${y - r / 2}Z"/>`).join('')}</g>`),
  // Yoshlar KVN ligasi — kubok, niqoblar, konfetti
  s6: wrap(sky('g', '#2a1f04', '#8f6a12', '#2a1a04') + glow('l', '#fff0a0'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="190" r="140" fill="url(#l)" opacity=".4"/>
    <g fill="#ffd23f" stroke="#a0740c" stroke-width="3"><path d="M100 110 H200 V150 Q200 210 150 215 Q100 210 100 150Z"/><path d="M100 125 Q65 125 70 160 Q76 185 104 180" fill="none" stroke-width="8" stroke="#ffd23f"/><path d="M200 125 Q235 125 230 160 Q224 185 196 180" fill="none" stroke-width="8" stroke="#ffd23f"/><rect x="138" y="215" width="24" height="40"/><rect x="110" y="255" width="80" height="22" rx="4"/></g>
    <text x="150" y="172" font-family="Arial Black,Arial" font-weight="900" font-size="34" text-anchor="middle" fill="#a0740c">KVN</text>
    <g transform="translate(60 300) rotate(-15)"><path d="M-28 -18 Q0 -30 28 -18 Q30 18 0 28 Q-30 18 -28 -18Z" fill="#fff"/><circle cx="-10" cy="-4" r="4" fill="#222"/><circle cx="10" cy="-4" r="4" fill="#222"/><path d="M-12 8 Q0 20 12 8" stroke="#222" stroke-width="3" fill="none"/></g>
    <g transform="translate(240 300) rotate(15)"><path d="M-28 -18 Q0 -30 28 -18 Q30 18 0 28 Q-30 18 -28 -18Z" fill="#6be0ff"/><circle cx="-10" cy="-4" r="4" fill="#222"/><circle cx="10" cy="-4" r="4" fill="#222"/><path d="M-12 16 Q0 4 12 16" stroke="#222" stroke-width="3" fill="none"/></g>
    <g>${Array.from({ length: 36 }, (_, i) => `<rect x="${(i * 53) % 290}" y="${(i * 37) % 120 + 10}" width="6" height="10" fill="${['#ff6b6b', '#6be0ff', '#fff', '#9b6bff'][i % 4]}" transform="rotate(${i * 25} ${(i * 53) % 290} ${(i * 37) % 120 + 10})"/>`).join('')}</g>`),
  // Tog' ortidagi qishloq — tog'lar, qishloq uylari, shifoxona xochi
  k11: wrap(sky('g', '#9fd4e8', '#6c9a5a', '#2c4a22'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="230" cy="80" r="26" fill="#fff6c8"/><path d="M0 220 L80 110 L140 190 L210 90 L300 200 V400 H0Z" fill="#5f7d8c"/><path d="M60 140 L80 110 L100 140Z M190 120 L210 90 L232 122Z" fill="#fff"/>
    <path d="M0 270 Q150 230 300 270 V400 H0Z" fill="#3d5a2a"/>${[[40, 280], [100, 300], [200, 290], [250, 310]].map(([x, y]) => `<g><rect x="${x}" y="${y}" width="34" height="26" fill="#e9d8b4"/><path d="M${x - 4} ${y} L${x + 17} ${y - 16} L${x + 38} ${y}Z" fill="#8a4a2a"/><rect x="${x + 12}" y="${y + 10}" width="9" height="16" fill="#5a3420"/></g>`).join('')}
    <rect x="132" y="300" width="56" height="42" fill="#fff"/><path d="M128 300 L160 280 L192 300Z" fill="#c23a3a"/><rect x="155" y="308" width="10" height="26" fill="#d32f2f"/><rect x="147" y="316" width="26" height="10" fill="#d32f2f"/><rect y="350" width="300" height="50" fill="#2c4a22"/>`),
  // Raqamli tuzoq — raqamli shahar, kod yomg'iri, ko'z
  k12: wrap(sky('g', '#020b12', '#0e3a4f', '#04161f'),
    `<rect width="300" height="400" fill="url(#g)"/><g fill="#39ffb0" opacity=".55" font-family="monospace" font-size="12">${Array.from({ length: 60 }, (_, i) => `<text x="${(i * 37) % 300}" y="${(i * 61) % 380 + 12}">${(i * 7919 % 2) ? '1' : '0'}${i % 3 ? '0' : '1'}</text>`).join('')}</g>
    <ellipse cx="150" cy="170" rx="95" ry="52" fill="#06222e" stroke="#39ffb0" stroke-width="3"/><circle cx="150" cy="170" r="36" fill="#0b4d63" stroke="#7fe8ff" stroke-width="3"/><circle cx="150" cy="170" r="15" fill="#ff3d6e"/><circle cx="142" cy="162" r="5" fill="#fff"/>
    <g fill="#031017">${[0, 40, 70, 110, 150, 190, 230, 260].map((x, i) => `<rect x="${x}" y="${280 - (i % 3) * 30}" width="36" height="${120 + (i % 3) * 30}"/>`).join('')}</g><g fill="#39ffb0" opacity=".7">${Array.from({ length: 24 }, (_, i) => `<rect x="${(i * 43) % 290 + 4}" y="${300 + (i * 23) % 90}" width="4" height="4"/>`).join('')}</g>`),
  // Oilaviy sayohat — yo'l, kichik mashina, quyosh
  k13: wrap(sky('g', '#ffd57e', '#f39b4a', '#b5651d'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="120" r="50" fill="#fff1b8"/><path d="M0 250 Q150 200 300 250 V400 H0Z" fill="#c9843e"/><path d="M110 400 L145 245 L155 245 L190 400Z" fill="#555"/><path d="M148 400 L149 250 L151 250 L152 400Z" fill="#ffd23f" stroke-dasharray="10 10"/>
    <g transform="translate(95 290)"><rect x="0" y="20" width="110" height="40" rx="10" fill="#f2f2f2"/><path d="M14 20 L28 -4 H86 L100 20Z" fill="#e6e6e6"/><path d="M30 18 L38 2 H56 V18Z M62 18 V2 H82 L92 18Z" fill="#7fc4e8"/><circle cx="26" cy="62" r="13" fill="#222"/><circle cx="84" cy="62" r="13" fill="#222"/><circle cx="26" cy="62" r="5" fill="#aaa"/><circle cx="84" cy="62" r="5" fill="#aaa"/>
    <rect x="18" y="-14" width="74" height="10" rx="3" fill="#8a4a2a"/><rect x="26" y="-26" width="24" height="14" fill="#2f7ad9"/><rect x="56" y="-24" width="20" height="12" fill="#e8402f"/></g>`),
  // Qal'a himoyachilari — qal'a devori, bayroq, qilichlar
  k14: wrap(sky('g', '#2a0808', '#8a2a1a', '#e07a3a') + glow('f', '#ffb347'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="230" r="140" fill="url(#f)" opacity=".5"/>
    <g fill="#2a1008"><rect x="30" y="170" width="240" height="230"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${30 + i * 20}" y="155" width="12" height="18"/>`).join('')}<rect x="20" y="120" width="50" height="280"/><rect x="230" y="120" width="50" height="280"/>${[20, 230].map(x => Array.from({ length: 3 }, (_, i) => `<rect x="${x + i * 18}" y="106" width="12" height="16"/>`).join('')).join('')}</g>
    <path d="M120 400 V300 Q150 260 180 300 V400Z" fill="#140602"/><rect x="243" y="50" width="4" height="72" fill="#140602"/><path d="M247 52 L285 64 L247 78Z" fill="#c2302a"/>
    <g stroke="#e8e8e8" stroke-width="5" stroke-linecap="round"><line x1="110" y1="80" x2="190" y2="150"/><line x1="190" y1="80" x2="110" y2="150"/></g><g fill="#b98d2c"><rect x="100" y="140" width="22" height="8" transform="rotate(42 111 144)"/><rect x="178" y="140" width="22" height="8" transform="rotate(-42 189 144)"/></g>`),
  // Dengiz sirlari — suv osti, baliq, pufakchalar
  k15: wrap(sky('g', '#5fd3f3', '#0b5e8a', '#05233a'),
    `<rect width="300" height="400" fill="url(#g)"/><g fill="#fff" opacity=".18">${[40, 110, 180, 250].map(x => `<path d="M${x} 0 L${x - 30} 400 L${x + 10} 400Z"/>`).join('')}</g>
    <g transform="translate(150 200)"><ellipse rx="60" ry="36" fill="#ff8f3f"/><path d="M50 0 L95 -32 L95 32Z" fill="#ff6b2a"/><path d="M-10 -34 Q10 -60 30 -32Z" fill="#ff6b2a"/><rect x="-20" y="-34" width="12" height="68" fill="#fff" opacity=".85"/><rect x="10" y="-30" width="10" height="60" fill="#fff" opacity=".85"/><circle cx="-36" cy="-8" r="11" fill="#fff"/><circle cx="-38" cy="-8" r="6" fill="#111"/><path d="M-56 10 Q-48 16 -40 10" stroke="#5a2a10" stroke-width="3" fill="none"/></g>
    ${[[60, 120, 8], [80, 90, 5], [230, 140, 10], [250, 100, 6], [70, 260, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#dff7ff" stroke-width="2"/>`).join('')}
    <path d="M0 340 Q40 310 70 340 T150 335 T230 340 T300 330 V400 H0Z" fill="#e8c88a"/><g fill="#2fa36b"><path d="M30 345 Q20 300 35 270 Q45 300 40 345Z"/><path d="M260 340 Q250 290 268 262 Q278 300 272 340Z"/></g><path d="M200 350 l10 -18 l10 18 l-10 -4Z" fill="#ff6fa8"/>`),
  // Tungi navbatchilik — kasalxona yo'lagi, miltillovchi chiroq, eshik
  k16: wrap(sky('g', '#0a0a10', '#1a1a24', '#05050a'),
    `<rect width="300" height="400" fill="url(#g)"/><path d="M0 0 L110 150 H190 L300 0Z" fill="#14141c"/><path d="M0 400 L110 260 H190 L300 400Z" fill="#20202a"/><path d="M0 0 L110 150 V260 L0 400Z" fill="#191922"/><path d="M300 0 L190 150 V260 L300 400Z" fill="#191922"/>
    <rect x="110" y="150" width="80" height="110" fill="#0a0a0f"/><rect x="130" y="170" width="40" height="90" fill="#3a0f0f"/><rect x="138" y="178" width="24" height="20" fill="#ff3d3d" opacity=".6"/>
    <path d="M40 70 L60 85 L60 330 L40 360Z" fill="#2a2a36"/><path d="M260 70 L240 85 L240 330 L260 360Z" fill="#2a2a36"/>
    <rect x="135" y="20" width="30" height="10" fill="#cfe7ff"/><path d="M110 30 L190 30 L230 150 L70 150Z" fill="#cfe7ff" opacity=".08"/>
    <g fill="#000"><circle cx="150" cy="232" r="7"/><path d="M142 260 L144 240 Q150 236 156 240 L158 260Z"/></g><text x="150" y="128" font-family="Arial" font-size="12" font-weight="700" text-anchor="middle" fill="#7fe08a" opacity=".8">EXIT</text>`),
  // Maqom kechasi — tanbur, dutor, gilam naqshi
  s7: wrap(sky('g', '#2a0c04', '#6a2c0f', '#1a0602') + glow('l', '#ffcf6b'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="200" r="150" fill="url(#l)" opacity=".35"/><g fill="none" stroke="#d9a24a" stroke-width="2" opacity=".5">${[40, 70, 100].map(r => `<circle cx="150" cy="200" r="${r}"/>`).join('')}</g>
    <g transform="translate(110 70) rotate(-12)"><ellipse cx="0" cy="210" rx="34" ry="44" fill="#a0541c" stroke="#5a2a10" stroke-width="3"/><rect x="-5" y="0" width="10" height="170" fill="#7a3a14"/>${[20, 50, 80, 110, 140].map(y => `<rect x="-7" y="${y}" width="14" height="3" fill="#e8c38a"/>`).join('')}<path d="M-2 0 V250 M2 0 V250" stroke="#f5e1b0" stroke-width="1"/></g>
    <g transform="translate(195 90) rotate(14)"><ellipse cx="0" cy="190" rx="28" ry="38" fill="#c27a2c" stroke="#5a2a10" stroke-width="3"/><rect x="-4" y="0" width="8" height="155" fill="#8a4a1a"/><circle cy="-6" r="8" fill="#5a2a10"/></g>
    <rect y="340" width="300" height="60" fill="#8a1a1a"/><g fill="#e8c38a">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 30 + 15} 350 l10 10 l-10 10 l-10 -10Z"/>`).join('')}</g><rect y="380" width="300" height="20" fill="#3a0a0a"/>`),
  // Sirk — chodir, akrobat, yulduzlar
  s8: wrap(sky('g', '#1a0410', '#7a0f2a', '#2a0612'),
    `<rect width="300" height="400" fill="url(#g)"/>${stars(30, 23, 180)}<g>${Array.from({ length: 8 }, (_, i) => `<path d="M150 70 L${i * 40 - 10} 300 L${i * 40 + 30} 300Z" fill="${i % 2 ? '#fff' : '#d81b3a'}"/>`).join('')}</g><path d="M150 40 V72" stroke="#ffd23f" stroke-width="4"/><path d="M150 40 L180 50 L150 60Z" fill="#ffd23f"/>
    <rect y="300" width="300" height="100" fill="#3a0a14"/><ellipse cx="150" cy="330" rx="110" ry="22" fill="#e8b84a"/><ellipse cx="150" cy="330" rx="90" ry="16" fill="#c2302a"/>
    <path d="M70 120 Q150 150 230 120" stroke="#ddd" stroke-width="2" fill="none"/><g transform="translate(150 140)" fill="#111"><circle cy="-22" r="8"/><path d="M-4 -14 L4 -14 L6 12 L-6 12Z"/><path d="M-4 -10 L-26 -26 M4 -10 L26 -26" stroke="#111" stroke-width="4"/><path d="M-4 12 L-12 34 M4 12 L12 34" stroke="#111" stroke-width="4"/><rect x="-46" y="-28" width="92" height="3" fill="#ffd23f"/></g>`),
  // Zumrad va Qimmat — ertak uyi, qiz, sandiq
  s9: wrap(sky('g', '#a8e6cf', '#2d6b5a', '#123329') + glow('l', '#fff3a0'),
    `<rect width="300" height="400" fill="url(#g)"/><circle cx="70" cy="80" r="30" fill="#fff3a0"/><g fill="#1f4a3c"><path d="M0 260 Q40 160 80 260Z"/><path d="M220 260 Q260 150 300 260Z"/><path d="M40 270 Q80 190 120 270Z"/></g>
    <rect x="150" y="190" width="110" height="90" fill="#c99a5a"/><path d="M140 192 L205 140 L270 192Z" fill="#8a3a2a"/><rect x="190" y="230" width="28" height="50" fill="#5a3420"/><rect x="160" y="210" width="22" height="20" fill="#fff3a0"/>
    <rect y="280" width="300" height="120" fill="#4a8a4a"/><g transform="translate(90 300)"><path d="M-22 60 L0 0 L22 60Z" fill="#2fb36b"/><circle cy="-12" r="14" fill="#f2c39b"/><path d="M-14 -16 Q0 -36 14 -16 Q22 10 16 30 L10 -10 Q0 -20 -10 -10 L-16 30 Q-22 10 -14 -16Z" fill="#2a1408"/><circle cx="-5" cy="-12" r="2" fill="#222"/><circle cx="5" cy="-12" r="2" fill="#222"/></g>
    <g transform="translate(200 330)"><rect x="-26" y="0" width="52" height="34" rx="4" fill="#8a5a2b"/><path d="M-26 0 Q0 -24 26 0Z" fill="#a0702b"/><rect x="-4" y="4" width="8" height="10" fill="#ffd23f"/><g fill="#ffd23f"><circle cx="-18" cy="-14" r="3"/><circle cx="14" cy="-20" r="2"/><circle cx="24" cy="-8" r="2"/></g></g>`),
};

for (const [id, svg] of Object.entries(P)) fs.writeFileSync(path.join(OUT, id + '.svg'), svg.replace(/\n\s*/g, ''));
console.log('Yaratildi:', Object.keys(P).length, 'ta poster →', OUT);
