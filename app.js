const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/\u00a0/g,' ')+' so‘m';
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const CITY=[['Toshkent','Toshkent shahri'],['Samarqand','Samarqand viloyati'],['Buxoro','Buxoro viloyati'],['Namangan','Namangan viloyati'],['Andijon','Andijon viloyati'],['Farg‘ona','Farg‘ona viloyati'],['Xiva','Xorazm viloyati'],['Nukus','Qoraqalpog‘iston'],['Qarshi','Qashqadaryo viloyati'],['Termiz','Surxondaryo viloyati']];
// nomi, shahar, manzil, qulayliklar, qator, o‘rin, bazaviy narx
const CIN=[['KinoShow Chilonzor',0,'Chilonzor tumani, Bunyodkor shoh ko‘chasi','Dolby Atmos|4K|Reklayner',10,14,55000],['KinoShow Yunusobod',0,'Yunusobod tumani, Amir Temur shoh ko‘chasi','IMAX|Gurme taomlar|Avtoturargoh',10,14,65000],['KinoShow Mirobod',0,'Mirobod tumani, Nukus ko‘chasi','Dolby 7.1|VIP zal|Lounge bar',9,12,60000],
['KinoShow Registon',1,'Samarqand shahri, Universitet xiyoboni','Dolby Atmos|4K|Kafe',9,12,45000],['KinoShow Siyob',1,'Samarqand shahri, Mirzo Ulug‘bek ko‘chasi','3D|Bolalar xonasi|Avtoturargoh',8,12,42000],
['KinoShow Labi Hovuz',2,'Buxoro shahri, Navoiy ko‘chasi','4K|Kafe|Kondensioner',8,12,40000],['KinoShow Ark',2,'Buxoro shahri, Mustaqillik ko‘chasi','Dolby 7.1|3D|Avtoturargoh',8,12,42000],
['KinoShow Namangan',3,'Namangan shahri, Uychi ko‘chasi','3D|Gurme taomlar|4K',8,12,38000],
['KinoShow Andijon Plaza',4,'Andijon shahri, Bobur shoh ko‘chasi','IMAX|Dolby Atmos|Reklayner',9,13,45000],['KinoShow Asaka',4,'Asaka tumani, Navoiy ko‘chasi','4K|Kafe|Avtoturargoh',8,12,36000],
['KinoShow Farg‘ona',5,'Farg‘ona shahri, Al-Farg‘oniy ko‘chasi','Dolby 7.1|3D|Bolalar xonasi',9,12,40000],['KinoShow Marg‘ilon',5,'Marg‘ilon shahri, Ipakchilar ko‘chasi','4K|Kafe|Kondensioner',8,10,35000],
['KinoShow Ichan Qala',6,'Xiva shahri, Pahlavon Mahmud ko‘chasi','4K|Kafe|Kondensioner',8,10,34000],['KinoShow Nukus',7,'Nukus shahri, Berdaq ko‘chasi','3D|Dolby 7.1|Avtoturargoh',8,12,36000],
['KinoShow Qarshi',8,'Qarshi shahri, Mustaqillik ko‘chasi','Dolby Atmos|4K|Kafe',8,12,36000],['KinoShow Termiz',9,'Termiz shahri, Alpomish ko‘chasi','3D|Kafe|Kondensioner',8,10,34000]].map((c,i)=>({id:i,n:c[0],city:c[1],ad:c[2],ft:c[3].split('|'),r:c[4],c:c[5],base:c[6]}));
const LN={uz:'O‘zbek tilida',ru:'Rus tilida',en:'Ingliz tilida'};
const M0=[
['k1','kino','Qirq kun qorong‘ulik','uz','2D',8.6,112,['Triller','Drama'],'#6b1030','Tog‘li qishloqda g‘oyib bo‘lgan jurnalist izidan borgan tergovchi sirli voqealarga duch keladi.'],
['k2','kino','Samarqand sarguzashti','uz','2D',8.9,118,['Sarguzasht','Komediya'],'#8a5a12','Uch do‘st qadimiy xaritani topib, Ipak yo‘li bo‘ylab kulgili izlanishga otlanadi.'],
['k3','kino','Ipak yo‘li: Oxirgi karvon','uz','IMAX',9.1,151,['Jangari','Tarixiy'],'#7a2b10','Savdogarlar karvoni qaroqchilar ichidan o‘tib, shaharga eng so‘nggi yukni yetkazishga intiladi.'],
['k4','kino','Yulduzlar ortida','ru','3D',8.4,134,['Fantastika','Sarguzasht'],'#2c3a8f','Olis sayyoraga uchgan ekipaj insoniyat taqdirini hal qiluvchi signalni topadi.'],
['k5','kino','Kulgi ustaxonasi','uz','2D',8.2,96,['Komediya'],'#1f5a63','Hunarmandlar mahallasidagi kutilmagan ko‘rik-tanlov butun ko‘chani bir-biriga qarama-qarshi qo‘yadi.'],
['k6','kino','Bahor muhabbati','uz','2D',8.0,105,['Melodrama','Drama'],'#8f2d56','Toshkentda o‘qiyotgan yigit va Xivalik rassom qiz uchrashuvi hayotlarini o‘zgartiradi.'],
['k7','kino','Qora bo‘ron','ru','IMAX',8.7,128,['Jangari','Triller'],'#2b2b3d','Sobiq maxsus xizmat xodimi shahar ostidagi fitnaning oldini olish uchun qaytadi.'],
['k8','kino','Kichik paxlavon','uz','3D',8.8,88,['Multfilm','Sarguzasht'],'#2f7a4f','Kichkina bola xalq dostonlaridagi kuchli qahramonga aylanish yo‘lini boshlaydi.'],
['k9','kino','Soyalar vodiysi','en','2D',7.9,99,['Qo‘rqinchli','Triller'],'#2a1a3d','Tashlandiq vodiyga kelgan tadqiqotchilar tunda g‘alati tovushlarni eshita boshlaydi.'],
['k10','kino','Mehmon kelsa','uz','2D',8.5,101,['Komediya','Drama'],'#a0541c','Katta oilaga kutilmagan mehmon kelib, to‘y arafasidagi sirlar oshkor bo‘ladi.'],
['s1','shou','Sharq taronalari','uz','Jonli',9.0,150,['Konsert'],'#7a1d5e','Milliy va zamonaviy ijrochilar ishtirokidagi katta konsert dasturi.'],
['s2','shou','Stand-up kechasi','uz','Jonli',8.7,110,['Stand-up'],'#a13b0d','Yosh komiklar o‘zbek tilida hayotiy hazillar bilan chiqish qiladi.'],
['s3','shou','Oq oqqush','uz','Jonli',9.2,130,['Balet'],'#34507a','Klassik balet spektakli, to‘liq orkestr jo‘rligida.'],
['s4','shou','Jazz va yulduzlar','ru','Jonli',8.8,120,['Konsert'],'#1e3b5c','Jazz kvartetlari va mehmon xonandalarning oqshom dasturi.'],
['s5','shou','Sehr olami','uz','Jonli',8.5,95,['Shou'],'#5b2a86','Illyuziyachilar va sehrgarlarning butun oila uchun tomoshasi.'],
['s6','shou','Yoshlar KVN ligasi','uz','Jonli',8.3,105,['KVN'],'#8f6a12','Viloyat jamoalari o‘rtasida hazil va topqirlik musobaqasi.']
].map(a=>({id:a[0],type:a[1],t:a[2],lang:a[3],fmt:a[4],r:a[5],d:a[6],g:a[7],c:a[8],ds:a[9]}));
const GEN=['Jangari','Komediya','Drama','Triller','Qo‘rqinchli','Melodrama','Multfilm','Fantastika','Sarguzasht','Konsert','Stand-up','Balet'];
const TIMES=['10:00','12:40','15:20','18:00','20:30','22:50'];
const SN=[['pop','Popkorn (katta)',25000],['cola','Cola 0.5 l',15000],['nach','Nachos',30000],['combo','Kombo: popkorn + 2 cola',50000]];
const PROMO={KINOBIRINCHI:'Birinchi buyurtmaga 25% chegirma (30 000 so‘mgacha)',TALABA:'Talabalar uchun 15% chegirma',POPKORN:'2 va undan ortiq chiptaga bepul popkorn (25 000 so‘m)',SHOUKECHA:'Shoular uchun 10% chegirma'};
const OFFERS=[['KINOBIRINCHI','Birinchi buyurtmaga 25% chegirma','Platformadagi birinchi buyurtmangizga 30 000 so‘mgacha chegirma.','Amal qiladi: 30-noyabrgacha'],['TALABA','Talabalar uchun 15%','Dushanbadan juma kunigacha 12:40 seansigacha kinolarga.','Amal qiladi: doimiy'],['POPKORN','Ikkita chipta, bepul popkorn','2 va undan ortiq chipta olsangiz, katta popkorn sovg‘a.','Amal qiladi: ish kunlari'],['SHOUKECHA','Shoularga 10% chegirma','Konsert, stand-up va balet chiptalariga hafta oxirida.','Amal qiladi: shanba, yakshanba']];
const S={city:ld('city',0),date:0,gen:'',type:'',lang:'',q:'',B:null,user:ld('user',null),adm:false,extra:ld('extra',[])};
const CAT=()=>M0.concat(S.extra);
const mov=id=>CAT().find(m=>m.id===id);
const orders=()=>ld('orders',[]);
const dobj=i=>{const d=new Date();d.setDate(d.getDate()+i);return d};
const dk=i=>{const d=dobj(i);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const WD=['Yak','Dush','Sesh','Chor','Pay','Jum','Shan'];
const dlab=i=>i?WD[dobj(i).getDay()]+' '+dobj(i).getDate()+'.'+String(dobj(i).getMonth()+1).padStart(2,'0'):'Bugun';
const dur=n=>Math.floor(n/60)+' s '+n%60+' daq';
function showsOf(ci,date){
  const out=[];
  CAT().forEach(m=>{const h=hash(ci+m.id+date);
    if(m.type==='shou'){if(h%3===0)out.push({m,t:[h%2?'19:00':'20:00']})}
    else if(h%4!==0){const n=2+h%2;out.push({m,t:TIMES.filter((_,i)=>(i+h)%6<n).slice(0,3)})}});
  return out;
}
const isPast=(date,t)=>{if(date!==dk(0))return false;const n=new Date();return +t.slice(0,2)*60+ +t.slice(3)<=n.getHours()*60+n.getMinutes()};
function price(c,m,r){const mul=m.type==='shou'?2.2:m.fmt==='IMAX'?1.5:m.fmt==='3D'?1.25:1;return Math.round(CIN[c].base*mul*(r>=CIN[c].r-2?1.5:1)/1000)*1000}
const skey=B=>[B.ci,B.mid,B.date,B.time].join('|');
function sold(B){
  const c=CIN[B.ci],k=skey(B),set=new Set();let h=hash(k);
  for(let r=0;r<c.r;r++)for(let i=1;i<=c.c;i++){h=Math.imul(h^(r*31+i),2654435761)>>>0;if(h%100<(35+k.length%10))set.add(String.fromCharCode(65+r)+i)}
  orders().filter(o=>o.key===k).forEach(o=>o.seats.forEach(s=>set.add(s)));
  return set;
}
const seatPrice=(B,id)=>price(B.ci,mov(B.mid),id.charCodeAt(0)-65);
function calc(B){
  const base=B.sel.reduce((a,s)=>a+seatPrice(B,s),0),sn=SN.reduce((a,x)=>a+(B.sn[x[0]]||0)*x[2],0),sub=base+sn;
  let d=0,note='';const p=B.promo,first=!orders().length,shou=mov(B.mid).type==='shou';
  if(p==='KINOBIRINCHI'){if(first){d=Math.min(base*.25,30000)}else note='Bu kod faqat birinchi buyurtmaga'}
  else if(p==='TALABA'){if(shou)note='Talaba kodi faqat kinolarga';else d=base*.15}
  else if(p==='POPKORN'){if(B.sel.length>=2)d=25000;else note='Kamida 2 ta chipta kerak'}
  else if(p==='SHOUKECHA'){if(shou)d=base*.1;else note='Bu kod faqat shoularga'}
  else if(p)note='Bunday kod topilmadi';
  return{base,sn,d:Math.round(d),note,total:sub-Math.round(d)};
}
function qr(code){let h=hash(code),c='';for(let y=0;y<9;y++)for(let x=0;x<9;x++){h=Math.imul(h^(y*9+x+1),2246822519)>>>0;if((x<3&&y<3)||(x>5&&y<3)||(x<3&&y>5)||h%2)c+=`<rect x="${x*6}" y="${y*6}" width="6" height="6"/>`}return`<svg width="76" height="76" viewBox="0 0 54 54" fill="#111" aria-hidden="true">${c}</svg>`}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2400)}
const go=h=>{if(location.hash===h)draw();else location.hash=h};

/* ---------- ko‘rinishlar ---------- */
const POSTER=id=>/^[ks]\d+$/.test(id)?`img/${id}.svg`:'';
const poster=m=>`<div class="poster${POSTER(m.id)?' pimg':''}" style="--c:${m.c}">${POSTER(m.id)?`<img src="${POSTER(m.id)}?v=2" alt="${m.t} posteri" loading="lazy">`:''}<b>${m.t}</b><span>${m.type==='shou'?'Jonli shou':LN[m.lang]+' • '+m.fmt}</span></div>`;
const card=m=>`<a class="mc" href="#/movie/${m.id}">${poster(m)}<div class="mi"><h3>${m.t}</h3><div class="sub">★ ${m.r} · ${dur(m.d)}</div><div class="sub">${m.g.join(', ')}</div></div></a>`;
const citySel=()=>`<select id="citySel" aria-label="Shahar">${CITY.map((c,i)=>`<option value="${i}" ${i===S.city?'selected':''}>${c[0]}</option>`).join('')}</select>`;
const dateChips=()=>`<div class="chips">${[0,1,2,3,4,5,6].map(i=>`<button class="chip" aria-pressed="${S.date===i}" data-a="date" data-v="${i}">${dlab(i)}</button>`).join('')}</div>`;
const timeChips=(ci,m,date,ts)=>ts.map(t=>`<button class="chip" ${isPast(date,t)?'disabled':''} data-a="book" data-v="${ci}|${m.id}|${date}|${t}">${t} · ${fmt(price(ci,m,0))}</button>`).join('');
const cinCard=c=>`<a class="card" href="#/cinema/${c.id}" style="display:block"><h3>${c.n}</h3><div class="sub">${c.ad}, ${CITY[c.city][1]}</div><div class="tags">${c.ft.map(f=>`<i>${f}</i>`).join('')}</div><b style="color:var(--ac)">Seanslarni ko‘rish</b></a>`;

function home(){
  const mv=CAT().filter(m=>m.type==='kino').slice(0,5),sh=CAT().filter(m=>m.type==='shou').slice(0,5);
  const cn=CIN.filter(c=>c.city===S.city);
  return`<section class="hero"><div class="w"><h1>O‘zbekiston bo‘ylab kino va shoularga chipta, bir zumda</h1><p>Shaharni tanlang, zaldagi bo‘sh joyni ko‘rib o‘rindiqni o‘zingiz belgilang, taom va ichimlikni oldindan buyurtma qiling.</p>
  <div class="search"><input id="hq" placeholder="Film yoki shou nomini yozing" aria-label="Qidiruv"><button class="btn" data-a="search">Qidirish</button></div></div></section>
  <div class="w"><section class="sec"><div class="sh"><h2>Janr bo‘yicha</h2></div><div class="chips">${GEN.map(g=>`<button class="chip" data-a="genre" data-v="${g}">${g}</button>`).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Hozir kinoteatrlarda</h2><a href="#/movies">Hammasi</a></div><div class="grid">${mv.map(card).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Shoular va konsertlar</h2><a href="#/movies" data-a="type" data-v="shou">Hammasi</a></div><div class="grid">${sh.map(card).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Aksiyalar</h2><a href="#/offers">Barchasi</a></div><div class="cards">${OFFERS.slice(0,3).map(offer).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>${CITY[S.city][0]}dagi kinozallar</h2><a href="#/cinemas">Barcha shaharlar</a></div><div class="cards">${cn.map(cinCard).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Nega KinoShow</h2></div><div class="why"><div class="card"><h3>Joyni o‘zingiz tanlang</h3><p class="sub">Zal sxemasida bo‘sh va band o‘rindiqlar real vaqtda ko‘rinadi.</p></div><div class="card"><h3>10 ta shahar, 16 ta zal</h3><p class="sub">Toshkentdan Termizgacha, Nukusdan Andijongacha.</p></div><div class="card"><h3>Taomni oldindan buyuring</h3><p class="sub">Popkorn va ichimlikni navbatsiz oling.</p></div><div class="card"><h3>Qulay to‘lov</h3><p class="sub">Payme, Click, Uzcard va Humo (demo rejimda).</p></div></div></section></div>`;
}
const offer=o=>`<div class="card"><span class="code">${o[0]}</span><h3>${o[1]}</h3><p class="sub">${o[2]}</p><div class="sub">${o[3]}</div><button class="gh" style="margin-top:10px" data-a="usepromo" data-v="${o[0]}">Kodni qo‘llash</button></div>`;
function movies(){
  const f=filtered();
  return`<div class="w sec"><div class="sh"><h2>Filmlar va shoular</h2></div>
  <div class="chips" style="margin-bottom:12px">${[['','Hammasi'],['kino','Filmlar'],['shou','Shoular']].map(t=>`<button class="chip" aria-pressed="${S.type===t[0]}" data-a="type" data-v="${t[0]}">${t[1]}</button>`).join('')}
  <select id="genSel" aria-label="Janr"><option value="">Barcha janrlar</option>${GEN.map(g=>`<option ${S.gen===g?'selected':''}>${g}</option>`).join('')}</select>
  <select id="langSel" aria-label="Til"><option value="">Barcha tillar</option>${Object.keys(LN).map(k=>`<option value="${k}" ${S.lang===k?'selected':''}>${LN[k]}</option>`).join('')}</select>
  <input id="mq" style="max-width:240px" placeholder="Qidirish" value="${S.q}" aria-label="Qidirish"></div><div class="grid" id="grid">${gridHTML(f)}</div></div>`;
}
const filtered=()=>CAT().filter(m=>(!S.type||m.type===S.type)&&(!S.gen||m.g.includes(S.gen))&&(!S.lang||m.lang===S.lang)&&m.t.toLowerCase().includes(S.q.toLowerCase()));
const gridHTML=f=>f.length?f.map(card).join(''):'<p class="sub">Hech narsa topilmadi. Filtrlarni o‘zgartirib ko‘ring.</p>';
function cinemas(){
  return`<div class="w sec"><div class="sh"><h2>Kinozallar</h2></div>${CITY.map((c,i)=>{const l=CIN.filter(x=>x.city===i);return`<h3 style="margin:22px 0 10px">${c[0]} <span class="sub" style="font-family:Figtree">${c[1]}</span></h3><div class="cards">${l.map(cinCard).join('')}</div>`}).join('')}</div>`;
}
function cinemaP(id){
  const c=CIN[+id];if(!c)return home();const d=dk(S.date),l=showsOf(c.id,d);
  return`<div class="w sec"><a class="sub" href="#/cinemas">← Barcha kinozallar</a><h1 style="font-size:32px;margin:6px 0">${c.n}</h1><div class="sub">${c.ad}, ${CITY[c.city][1]}</div><div class="tags">${c.ft.map(f=>`<i>${f}</i>`).join('')}<i>${c.r*c.c} ta o‘rindiq</i></div>${dateChips()}
  ${l.length?l.map(s=>`<div class="shw"><div><a href="#/movie/${s.m.id}"><b>${s.m.t}</b></a><div class="sub">${s.m.type==='shou'?'Jonli shou':LN[s.m.lang]+' • '+s.m.fmt} · ${s.m.g.join(', ')}</div></div><div class="chips">${timeChips(c.id,s.m,d,s.t)}</div></div>`).join(''):'<p class="sub">Bu kunga seans yo‘q.</p>'}</div>`;
}
function movieP(id){
  const m=mov(id);if(!m)return home();const d=dk(S.date);
  const list=CIN.filter(c=>c.city===S.city).map(c=>({c,s:showsOf(c.id,d).find(x=>x.m.id===m.id)})).filter(x=>x.s);
  return`<div class="w"><div class="det">${poster(m)}<div><h1>${m.t}</h1><div class="sub">★ ${m.r} / 10 · ${dur(m.d)} · ${m.type==='shou'?'Jonli shou':LN[m.lang]+' • '+m.fmt}</div><div class="tags">${m.g.map(g=>`<i>${g}</i>`).join('')}</div><p>${m.ds}</p><div class="sub">Shahar: ${CITY[S.city][0]}. Boshqa shaharni tepadagi ro‘yxatdan tanlang.</div></div></div>
  ${dateChips()}<div style="margin-top:6px">${list.length?list.map(x=>`<div class="shw"><div><a href="#/cinema/${x.c.id}"><b>${x.c.n}</b></a><div class="sub">${x.c.ad} · ${x.c.ft.join(', ')}</div></div><div class="chips">${timeChips(x.c.id,m,d,x.s.t)}</div></div>`).join(''):`<p class="sub" style="padding:16px 0">${CITY[S.city][0]}da bu kunga seans yo‘q. Boshqa kun yoki shaharni tanlang.</p>`}</div></div>`;
}
function offers(){return`<div class="w sec"><div class="sh"><h2>Aksiya va chegirmalar</h2></div><div class="cards">${OFFERS.map(offer).join('')}</div></div>`}
function seatsP(){
  const B=S.B;if(!B)return home();
  const c=CIN[B.ci],m=mov(B.mid),so=sold(B);B.sel=B.sel.filter(x=>!so.has(x));
  const total=c.r*c.c,free=total-so.size,half=Math.ceil(c.c/2);
  let rows='';
  for(let r=0;r<c.r;r++){const L=String.fromCharCode(65+r);rows+=`<div class="r"><span class="rl">${L}</span>`;
    for(let i=1;i<=c.c;i++){const id=L+i;rows+=(i===half+1?'<span class="gap"></span>':'')+`<button class="seat ${r>=c.r-2?'vip':''} ${B.sel.includes(id)?'sel':''}" data-a="seat" data-v="${id}" ${so.has(id)?'disabled':''} aria-label="${L} qator ${i}-o‘rin, ${fmt(price(B.ci,m,r))}${so.has(id)?', band':''}" title="${id} · ${fmt(price(B.ci,m,r))}">${i}</button>`}
    rows+=`<span class="rl">${L}</span></div>`}
  const cost=calc(B).base;
  return`<div class="w"><div class="lay"><div class="card"><a class="sub" href="#/movie/${m.id}">← Seanslarga qaytish</a>
  <div class="chips" style="margin:10px 0"><span class="sub" style="align-self:center">Yonma-yon joy:</span>${[1,2,3,4,5,6].map(n=>`<button class="chip" data-a="auto" data-v="${n}">${n}</button>`).join('')}<button class="gh" data-a="clear">Tozalash</button></div>
  <div class="scr"></div><div class="sub" style="text-align:center;margin-bottom:18px">Ekran</div><div class="map"><div class="rows">${rows}</div></div>
  <div class="lg"><span><i style="background:var(--free)"></i>Bo‘sh</span><span><i style="background:var(--vip)"></i>VIP</span><span><i style="background:var(--ac)"></i>Tanlangan</span><span><i style="background:var(--sold);opacity:.55"></i>Band</span></div>
  <div style="margin-top:14px"><div class="sub">Bo‘sh joylar: <b style="color:var(--ink)">${free}</b> / ${total} · band: ${so.size}</div><div class="bar" style="margin-top:6px"><span style="width:${Math.round(so.size/total*100)}%"></span></div></div></div>
  <aside class="card"><h2 style="font-size:21px">${m.t}</h2><div class="sub">${c.n}, ${CITY[c.city][0]}<br>${B.date.split('-').reverse().join('.')} · ${B.time}</div><div style="margin-top:10px">${B.sel.length?B.sel.slice().sort().map(s=>`<div class="ln"><span>${s[0]} qator, ${s.slice(1)}-o‘rin</span><span>${fmt(seatPrice(B,s))} <button class="gh" style="padding:0 8px" data-a="seat" data-v="${s}" aria-label="Olib tashlash">✕</button></span></div>`).join(''):'<div class="sub">Sxemadan joy tanlang (8 tagacha).</div>'}</div>
  <div class="tot"><span>Jami</span><span>${fmt(cost)}</span></div><button class="btn" style="width:100%" data-a="next" ${B.sel.length?'':'disabled'}>Davom etish</button></aside></div></div>`;
}
function checkout(){
  const B=S.B;if(!B||!B.sel.length)return home();
  const m=mov(B.mid),c=CIN[B.ci],k=calc(B);
  return`<div class="w"><div class="lay"><div><div class="card"><h3>Taom va ichimliklar</h3>${SN.map(x=>`<div class="ln"><span>${x[1]}<div class="sub">${fmt(x[2])}</div></span><span class="qty"><button data-a="sn" data-v="${x[0]}|-1" aria-label="Kamaytirish">−</button><b>${B.sn[x[0]]||0}</b><button data-a="sn" data-v="${x[0]}|1" aria-label="Ko‘paytirish">+</button></span></div>`).join('')}</div>
  <div class="card" style="margin-top:16px"><h3>Promokod</h3><div style="display:flex;gap:8px;margin-top:8px"><input id="promo" value="${B.promo||''}" placeholder="Masalan, TALABA"><button class="gh" data-a="applypromo">Qo‘llash</button></div><div class="${k.note||!B.promo?'err':'ok'}">${B.promo?(k.note||PROMO[B.promo]):''}</div></div>
  <div class="card" style="margin-top:16px"><h3>To‘lov</h3><div class="chips" style="margin:10px 0">${['Payme','Click','Uzcard','Humo'].map(p=>`<button class="chip" aria-pressed="${B.pay===p}" data-a="pay" data-v="${p}">${p}</button>`).join('')}</div>
  <label>Ismingiz<input id="name" autocomplete="name" value="${B.name||''}"></label><label>Telefon<input id="phone" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" value="${B.phone||''}"></label><div class="err" id="err"></div></div></div>
  <aside class="card"><h2 style="font-size:21px">${m.t}</h2><div class="sub">${c.n} · ${B.date.split('-').reverse().join('.')} ${B.time}<br>Joylar: ${B.sel.slice().sort().join(', ')}</div>
  <div class="ln"><span>Chiptalar</span><span>${fmt(k.base)}</span></div><div class="ln"><span>Taomlar</span><span>${fmt(k.sn)}</span></div>${k.d?`<div class="ln"><span>Chegirma</span><span>−${fmt(k.d)}</span></div>`:''}
  <div class="tot"><span>To‘lov</span><span>${fmt(k.total)}</span></div><button class="btn" style="width:100%" data-a="buy">${B.pay} orqali to‘lash</button></aside></div></div>`;
}
function tkHTML(o){const m=mov(o.mid)||{t:o.title},c=CIN[o.ci];return`<div class="tk" id="tkt">${qr(o.code)}<div><div class="tc">${o.code}</div><b>${m.t}</b><div class="sub">${c.n}, ${CITY[c.city][0]}<br>${o.date.split('-').reverse().join('.')} · ${o.time}</div><div>Joylar: ${o.seats.join(', ')}</div><div class="sub">${o.name} · ${fmt(o.total)}</div></div></div>`}
function ticket(code){
  const o=orders().find(x=>x.code===code);if(!o)return`<div class="w sec"><p>Chipta topilmadi.</p></div>`;
  return`<div class="w sec"><h2 style="margin-bottom:6px">Chipta tayyor</h2><p class="sub">Zalga kirishda shu kodni ko‘rsating.</p>${tkHTML(o)}<div class="chips" style="margin-top:14px"><button class="btn" onclick="window.print()">Chop etish</button><a class="gh" href="#/orders">Chiptalarim</a></div></div>`;
}
function ordersP(){
  const l=orders();
  return`<div class="w sec"><div class="sh"><h2>Chiptalarim</h2></div>${l.length?l.map(o=>`<div class="shw"><div><b>${o.code}</b> · ${(mov(o.mid)||{}).t}<div class="sub">${CIN[o.ci].n} · ${o.date.split('-').reverse().join('.')} ${o.time} · ${o.seats.join(', ')} · ${fmt(o.total)}</div></div><div class="chips"><a class="gh" href="#/ticket/${o.code}">Ko‘rish</a><button class="gh" data-a="cancel" data-v="${o.code}">Bekor qilish</button></div></div>`).join(''):'<p class="sub">Hozircha chipta yo‘q.</p>'}</div>`;
}
function login(){
  return`<div class="form card"><h2>Kirish</h2><p class="sub">Ma’lumotlaringiz buyurtma vaqtida avtomatik to‘ldiriladi.</p><label>Ism<input id="lname" value="${S.user?S.user.name:''}"></label><label>Telefon<input id="lphone" inputmode="tel" placeholder="+998 90 123 45 67" value="${S.user?S.user.phone:''}"></label><div class="err" id="lerr"></div><button class="btn" style="width:100%;margin-top:10px" data-a="login">Kirish</button>${S.user?'<button class="gh" style="width:100%;margin-top:8px" data-a="logout">Chiqish</button>':''}</div>`;
}
function admin(){
  if(!S.adm)return`<div class="form card"><h2>Admin panel</h2><p class="sub">Demo kod: 1234</p><label>Kod<input id="acode" type="password"></label><div class="err" id="aerr"></div><button class="btn" style="width:100%;margin-top:10px" data-a="alogin">Kirish</button></div>`;
  const o=orders(),rev=o.reduce((a,x)=>a+x.total,0),tc=o.reduce((a,x)=>a+x.seats.length,0);
  const by=CITY.map((c,i)=>({n:c[0],v:o.filter(x=>CIN[x.ci].city===i).reduce((a,x)=>a+x.total,0)})),mx=Math.max(1,...by.map(x=>x.v));
  return`<div class="w sec"><div class="sh"><h2>Boshqaruv paneli</h2><button class="gh" data-a="alogout">Chiqish</button></div>
  <div class="cards"><div class="card"><div class="sub">Buyurtmalar</div><h2>${o.length}</h2></div><div class="card"><div class="sub">Sotilgan chiptalar</div><h2>${tc}</h2></div><div class="card"><div class="sub">Tushum</div><h2>${fmt(rev)}</h2></div></div>
  <div class="card" style="margin-top:16px"><h3>Shaharlar bo‘yicha tushum</h3>${by.map(x=>`<div class="ln"><span style="width:90px">${x.n}</span><div class="bar" style="flex:1;align-self:center"><span style="width:${x.v/mx*100}%"></span></div><span style="width:110px;text-align:right">${fmt(x.v)}</span></div>`).join('')}</div>
  <div class="card" style="margin-top:16px"><h3>Yangi film yoki shou qo‘shish</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:8px"><input id="nt" placeholder="Nomi"><select id="ntype"><option value="kino">Film</option><option value="shou">Shou</option></select><select id="ng">${GEN.map(g=>`<option>${g}</option>`).join('')}</select><select id="nl"><option value="uz">O‘zbek</option><option value="ru">Rus</option><option value="en">Ingliz</option></select><select id="nf"><option>2D</option><option>3D</option><option>IMAX</option><option>Jonli</option></select><input id="nd" type="number" placeholder="Davomiyligi (daq)" value="110"></div><div class="err" id="nerr"></div><button class="btn" style="margin-top:6px" data-a="addm">Qo‘shish</button></div>
  <div class="card tw" style="margin-top:16px"><h3>So‘nggi buyurtmalar</h3>${o.length?`<table><tr><th>Kod</th><th>Mijoz</th><th>Seans</th><th>Joylar</th><th>Summa</th><th></th></tr>${o.slice(0,15).map(x=>`<tr><td>${x.code}</td><td>${x.name}</td><td>${(mov(x.mid)||{}).t}, ${CIN[x.ci].n}</td><td>${x.seats.join(', ')}</td><td>${fmt(x.total)}</td><td><button class="gh" data-a="cancel" data-v="${x.code}">O‘chirish</button></td></tr>`).join('')}</table>`:'<p class="sub">Hali buyurtma yo‘q.</p>'}</div></div>`;
}

/* ---------- boshqaruv ---------- */
const ROUTES={'':home,movies,cinemas,cinema:cinemaP,movie:movieP,offers,seats:seatsP,checkout,ticket,orders:ordersP,login,admin};
function draw(){
  const [p,a]=(location.hash.slice(2)||'').split('/');
  const nl=[['','Bosh sahifa'],['movies','Filmlar va shoular'],['cinemas','Kinozallar'],['offers','Aksiyalar'],['admin','Admin']];
  $('#nav').innerHTML=`<a class="logo" href="#/">KinoShow</a>${nl.map(x=>`<a class="l ${p===x[0]?'on':''}" href="#/${x[0]}">${x[1]}</a>`).join('')}<span class="sp"></span>${citySel()}<a class="l ${p==='orders'?'on':''}" href="#/orders">Chiptalarim</a><button class="gh" data-a="theme" aria-label="Rejim">Rejim</button><a class="btn" href="#/login" style="white-space:nowrap">${S.user?S.user.name:'Kirish'}</a>`;
  $('#app').innerHTML=(ROUTES[p]||home)(a);
}
function route(){draw();scrollTo(0,0)}
addEventListener('hashchange',route);
const ACT={
  date:v=>{S.date=+v;draw()},
  genre:v=>{S.gen=v;S.type='';go('#/movies')},
  type:v=>{S.type=v;go('#/movies')},
  search:()=>{S.q=$('#hq').value;go('#/movies')},
  theme:()=>{const r=document.documentElement;r.dataset.theme=getComputedStyle(r).colorScheme==='dark'?'light':'dark'},
  book:v=>{const [ci,mid,date,time]=v.split('|');S.B={ci:+ci,mid,date,time,sel:[],sn:{},promo:ld('promo',''),pay:'Payme',name:S.user?S.user.name:'',phone:S.user?S.user.phone:''};go('#/seats')},
  seat:v=>{const B=S.B,i=B.sel.indexOf(v);if(i>=0)B.sel.splice(i,1);else if(B.sel.length>=8)return toast('Eng ko‘pi bilan 8 ta joy');else B.sel.push(v);draw()},
  clear:()=>{S.B.sel=[];draw()},
  auto:v=>{const n=+v,B=S.B,c=CIN[B.ci],so=sold(B);let best=null;
    for(let r=0;r<c.r;r++)for(let s=1;s+n-1<=c.c;s++){const ids=Array.from({length:n},(_,k)=>String.fromCharCode(65+r)+(s+k));if(ids.some(x=>so.has(x)))continue;const sc=Math.abs(s+(n-1)/2-(c.c+1)/2)*1.2+Math.abs(r-c.r*.6)*1.6;if(!best||sc<best.sc)best={sc,ids}}
    if(!best)return toast(n+' ta yonma-yon bo‘sh joy topilmadi');B.sel=best.ids;draw()},
  next:()=>go('#/checkout'),
  sn:v=>{const [id,d]=v.split('|'),B=S.B;B.sn[id]=Math.max(0,(B.sn[id]||0)+ +d);draw()},
  applypromo:()=>{S.B.promo=$('#promo').value.trim().toUpperCase();sv('promo',S.B.promo);draw()},
  usepromo:v=>{sv('promo',v);if(S.B)S.B.promo=v;toast('Kod saqlandi: '+v+'. To‘lov sahifasida qo‘llanadi')},
  pay:v=>{S.B.pay=v;draw()},
  buy:()=>{const B=S.B,name=($('#name').value||'').trim(),phone=$('#phone').value.trim();B.name=name;B.phone=phone;
    if(name.length<2)return $('#err').textContent='Ismingizni kiriting';
    if(phone.replace(/\D/g,'').length<9)return $('#err').textContent='Telefon raqamini to‘liq kiriting';
    const so=sold(B);if(B.sel.some(x=>so.has(x))){toast('Ba’zi joylar band bo‘lib qoldi');return go('#/seats')}
    const k=calc(B);if(k.note)return $('#err').textContent='Promokod: '+k.note;
    const code='KS-'+(hash(skey(B)+B.sel.join()+Date.now())%900000+100000);
    const o={code,key:skey(B),ci:B.ci,mid:B.mid,date:B.date,time:B.time,seats:B.sel.slice().sort(),sn:B.sn,total:k.total,name,phone,pay:B.pay,ts:Date.now()};
    sv('orders',[o,...orders()]);S.B=null;go('#/ticket/'+code)},
  cancel:v=>{sv('orders',orders().filter(o=>o.code!==v));toast('Chipta bekor qilindi, joylar bo‘shadi');draw()},
  login:()=>{const n=$('#lname').value.trim(),p=$('#lphone').value.trim();if(n.length<2||p.replace(/\D/g,'').length<9)return $('#lerr').textContent='Ism va telefonni to‘g‘ri kiriting';S.user={name:n,phone:p};sv('user',S.user);go('#/')},
  logout:()=>{S.user=null;sv('user',null);go('#/')},
  alogin:()=>{if($('#acode').value==='1234'){S.adm=true;draw()}else $('#aerr').textContent='Kod noto‘g‘ri'},
  alogout:()=>{S.adm=false;draw()},
  addm:()=>{const t=$('#nt').value.trim();if(t.length<2)return $('#nerr').textContent='Nomini kiriting';const id='x'+Date.now(),h=hash(t)%360;
    S.extra.push({id,type:$('#ntype').value,t,lang:$('#nl').value,fmt:$('#nf').value,r:8.0,d:+$('#nd').value||100,g:[$('#ng').value],c:`hsl(${h} 55% 28%)`,ds:'Yangi qo‘shilgan namoyish.'});sv('extra',S.extra);toast('Qo‘shildi');draw()}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&ACT[b.dataset.a])ACT[b.dataset.a](b.dataset.v)});
document.addEventListener('input',e=>{const i=e.target.id,B=S.B;
  if(i==='mq'){S.q=e.target.value;$('#grid').innerHTML=gridHTML(filtered())}
  else if(i==='name'&&B)B.name=e.target.value;else if(i==='phone'&&B)B.phone=e.target.value});
document.addEventListener('change',e=>{const i=e.target.id,v=e.target.value;
  if(i==='citySel'){S.city=+v;sv('city',S.city);draw()}
  else if(i==='genSel'){S.gen=v;draw()}else if(i==='langSel'){S.lang=v;draw()}});
route();
