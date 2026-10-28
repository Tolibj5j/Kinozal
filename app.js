const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){console.error(e);toast('Brauzer xotirasi to‘ldi: ma’lumot saqlanmadi');return false}};
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/\u00a0/g,' ')+' so‘m';
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const CITY=[['Toshkent','Toshkent shahri'],['Samarqand','Samarqand viloyati'],['Buxoro','Buxoro viloyati'],['Namangan','Namangan viloyati'],['Andijon','Andijon viloyati'],['Farg‘ona','Farg‘ona viloyati'],['Xiva','Xorazm viloyati'],['Nukus','Qoraqalpog‘iston'],['Qarshi','Qashqadaryo viloyati'],['Termiz','Surxondaryo viloyati'],['Navoiy','Navoiy viloyati'],['Jizzax','Jizzax viloyati'],['Guliston','Sirdaryo viloyati'],['Urganch','Xorazm viloyati']];
// nomi, shahar, manzil, qulayliklar, qator, o‘rin, bazaviy narx
const CIN=[['KinoShow Chilonzor',0,'Chilonzor tumani, Bunyodkor shoh ko‘chasi','Dolby Atmos|4K|Reklayner',10,14,55000],['KinoShow Yunusobod',0,'Yunusobod tumani, Amir Temur shoh ko‘chasi','IMAX|Gurme taomlar|Avtoturargoh',10,14,65000],['KinoShow Mirobod',0,'Mirobod tumani, Nukus ko‘chasi','Dolby 7.1|VIP zal|Lounge bar',9,12,60000],
['KinoShow Registon',1,'Samarqand shahri, Universitet xiyoboni','Dolby Atmos|4K|Kafe',9,12,45000],['KinoShow Siyob',1,'Samarqand shahri, Mirzo Ulug‘bek ko‘chasi','3D|Bolalar xonasi|Avtoturargoh',8,12,42000],
['KinoShow Labi Hovuz',2,'Buxoro shahri, Navoiy ko‘chasi','4K|Kafe|Kondensioner',8,12,40000],['KinoShow Ark',2,'Buxoro shahri, Mustaqillik ko‘chasi','Dolby 7.1|3D|Avtoturargoh',8,12,42000],
['KinoShow Namangan',3,'Namangan shahri, Uychi ko‘chasi','3D|Gurme taomlar|4K',8,12,38000],
['KinoShow Andijon Plaza',4,'Andijon shahri, Bobur shoh ko‘chasi','IMAX|Dolby Atmos|Reklayner',9,13,45000],['KinoShow Asaka',4,'Asaka tumani, Navoiy ko‘chasi','4K|Kafe|Avtoturargoh',8,12,36000],
['KinoShow Farg‘ona',5,'Farg‘ona shahri, Al-Farg‘oniy ko‘chasi','Dolby 7.1|3D|Bolalar xonasi',9,12,40000],['KinoShow Marg‘ilon',5,'Marg‘ilon shahri, Ipakchilar ko‘chasi','4K|Kafe|Kondensioner',8,10,35000],
['KinoShow Ichan Qala',6,'Xiva shahri, Pahlavon Mahmud ko‘chasi','4K|Kafe|Kondensioner',8,10,34000],['KinoShow Nukus',7,'Nukus shahri, Berdaq ko‘chasi','3D|Dolby 7.1|Avtoturargoh',8,12,36000],
['KinoShow Qarshi',8,'Qarshi shahri, Mustaqillik ko‘chasi','Dolby Atmos|4K|Kafe',8,12,36000],['KinoShow Termiz',9,'Termiz shahri, Alpomish ko‘chasi','3D|Kafe|Kondensioner',8,10,34000],
['KinoShow Sergeli',0,'Sergeli tumani, Yangi Sergeli ko‘chasi','4K|Dolby 7.1|Bolalar xonasi',9,12,48000],['KinoShow Navoiy',10,'Navoiy shahri, G‘alaba shoh ko‘chasi','3D|Kafe|Avtoturargoh',8,12,36000],
['KinoShow Jizzax',11,'Jizzax shahri, Sharof Rashidov ko‘chasi','4K|Kafe|Kondensioner',8,10,32000],['KinoShow Guliston',12,'Guliston shahri, Mustaqillik ko‘chasi','3D|Kondensioner|Kafe',8,10,30000],
['KinoShow Urganch',13,'Urganch shahri, Al-Xorazmiy ko‘chasi','Dolby Atmos|4K|Avtoturargoh',9,12,38000]].map((c,i)=>({id:i,n:c[0],city:c[1],ad:c[2],ft:c[3].split('|'),r:c[4],c:c[5],base:c[6]}));
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
['k11','kino','Tog‘ ortidagi qishloq','uz','2D',8.3,108,['Drama'],'#3d5a2a','Shahardan qaytgan shifokor tug‘ilgan qishlog‘ida yagona kasalxonani saqlab qolish uchun kurashadi.'],
['k12','kino','Raqamli tuzoq','en','IMAX',8.1,124,['Triller','Fantastika'],'#0e3a4f','Yosh dasturchi butun shahar tarmog‘ini egallagan sun’iy intellektning yagona zaif nuqtasini topadi.'],
['k13','kino','Oilaviy sayohat','uz','2D',7.8,97,['Komediya','Sarguzasht'],'#b5651d','Eski “Damas”da Toshkentdan Xivagacha yo‘lga chiqqan oila boshidan kulgili sarguzashtlar o‘tadi.'],
['k14','kino','Qal’a himoyachilari','uz','3D',8.7,139,['Jangari','Tarixiy'],'#5c1a1a','Qamal qilingan qal’ani bir hovuch jasur yigit qirq kun davomida himoya qiladi.'],
['k15','kino','Dengiz sirlari','ru','3D',8.4,92,['Multfilm','Sarguzasht'],'#0b5e8a','Kichkina baliq Orol dengizining yo‘qolgan suvlarini qaytarish uchun okean bo‘ylab sayohat qiladi.'],
['k16','kino','Tungi navbatchilik','ru','2D',7.6,103,['Qo‘rqinchli','Triller'],'#1a1a24','Kasalxonaning tungi navbatchisi bo‘sh qavatdan kelayotgan qo‘ng‘iroqlar sirini ochishga urinadi.'],
['s1','shou','Sharq taronalari','uz','Jonli',9.0,150,['Konsert'],'#7a1d5e','Milliy va zamonaviy ijrochilar ishtirokidagi katta konsert dasturi.'],
['s2','shou','Stand-up kechasi','uz','Jonli',8.7,110,['Stand-up'],'#a13b0d','Yosh komiklar o‘zbek tilida hayotiy hazillar bilan chiqish qiladi.'],
['s3','shou','Oq oqqush','uz','Jonli',9.2,130,['Balet'],'#34507a','Klassik balet spektakli, to‘liq orkestr jo‘rligida.'],
['s4','shou','Jazz va yulduzlar','ru','Jonli',8.8,120,['Konsert'],'#1e3b5c','Jazz kvartetlari va mehmon xonandalarning oqshom dasturi.'],
['s5','shou','Sehr olami','uz','Jonli',8.5,95,['Shou'],'#5b2a86','Illyuziyachilar va sehrgarlarning butun oila uchun tomoshasi.'],
['s6','shou','Yoshlar KVN ligasi','uz','Jonli',8.3,105,['KVN'],'#8f6a12','Viloyat jamoalari o‘rtasida hazil va topqirlik musobaqasi.'],
['s7','shou','Maqom kechasi','uz','Jonli',9.1,140,['Konsert'],'#6a2c0f','Shashmaqom va Xorazm maqomlari, an’anaviy cholg‘ular ansambli jo‘rligida.'],
['s8','shou','Sirk: Osmon ostida','uz','Jonli',8.6,115,['Shou'],'#7a0f2a','Dorbozlar, akrobatlar va masxarabozlarning butun oila uchun dasturi.'],
['s9','shou','Zumrad va Qimmat','uz','Jonli',8.9,80,['Spektakl'],'#2d6b5a','Mashhur xalq ertagi asosidagi bolalar teatri spektakli.']
].map(a=>({id:a[0],type:a[1],t:a[2],lang:a[3],fmt:a[4],r:a[5],d:a[6],g:a[7],c:a[8],ds:a[9]}));
// yil, yosh chegarasi, rejissyor / tashkilotchi, rollarda / ijrochilar (barcha ismlar to‘qima)
const INFO={k1:[2025,'16+','Jahongir Qosimov','Bobur Yo‘ldoshev, Malika Ibrohimova, Sanjar Mahmudov'],k2:[2025,'6+','Rustam Sa’dullayev','Alisher Ortiqov, Nodira Valiyeva, Ulug‘bek Qodirov'],k3:[2026,'12+','Zulfiqor Musayev','Jasur Ismoilov, Dilnoza Karimova, Farrux Saidov'],k4:[2025,'12+','Andrey Volkov','Ivan Sokolov, Mariya Orlova, Timur Asanov'],k5:[2024,'6+','Shuhrat Abbosov','Obid Asqarov, Zulfiya Zokirova, Mirzabek Xolmatov'],k6:[2025,'12+','Nigora Karimova','Sardor Rahimov, Madina Aqilova, Yulduz Usmonova'],k7:[2026,'16+','Pavel Sergeyev','Dmitriy Krylov, Aleksandr Gromov, Kamila Nuriyeva'],k8:[2025,'0+','Hilola Rasulova','Ovozlar: Behruz Ergashev, Lola Yusupova'],k9:[2024,'18+','James Holloway','Emily Carter, Noah Reed, Sofia Grant'],k10:[2026,'12+','Bahodir Yo‘ldoshev','To‘lqin Tojiyev, Gulchehra Eshonova, Ra’no G‘aniyeva'],k11:[2026,'12+','Otabek Nurmatov','Akmal Toshpo‘latov, Nilufar Saidova, Javlon Mirzayev'],k12:[2025,'16+','Lucas Moreno','Daniel Brooks, Aiko Tanaka, Ravi Mehta'],k13:[2026,'6+','Sherzod Aliyev','Ulmas Hamidov, Dildora Rasulova, bolalar: Azizbek, Mohinur'],k14:[2026,'12+','Davron Salimov','Shohruh Abdullayev, Kamron Yusupov, Zarina Hakimova'],k15:[2025,'0+','Olga Petrova','Ovozlar: Anna Belova, Kirill Rudenko'],k16:[2024,'18+','Sergey Ilyin','Yekaterina Lebedeva, Maksim Zorin'],
s1:[2026,'0+','“Sharq sadosi” prodyuserlik markazi','Milliy estrada va folklor ansambllari'],s2:[2026,'16+','“Kulgi markazi” klubi','Yosh komiklar jamoasi'],s3:[2026,'6+','Davlat balet teatri','Balet truppasi va simfonik orkestr'],s4:[2026,'12+','“Jazz klub” uyushmasi','Jazz kvartetlari va mehmon xonandalar'],s5:[2026,'0+','“Sehrli dunyo” teatri','Illyuziyachilar guruhi'],s6:[2026,'6+','Yoshlar ittifoqi','14 ta viloyat jamoasi'],s7:[2026,'0+','Maqom san’ati markazi','Maqom ansambli va xonandalar'],s8:[2026,'0+','Davlat sirki','Akrobatlar, dorbozlar, masxarabozlar'],s9:[2026,'0+','Yosh tomoshabinlar teatri','Teatr aktyorlari jamoasi']};
const GEN=['Jangari','Komediya','Drama','Triller','Qo‘rqinchli','Melodrama','Multfilm','Fantastika','Sarguzasht','Tarixiy','Konsert','Stand-up','Balet','Shou','Spektakl'];
const TIMES=['10:00','12:40','15:20','18:00','20:30','22:50'];
const SN=[['pop','Popkorn (katta)',25000],['cola','Cola 0.5 l',15000],['nach','Nachos',30000],['hot','Hot-dog',22000],['water','Suv 0.5 l',7000],['combo','Kombo: popkorn + 2 cola',50000]];
const PAYS=['Payme','Click','Uzcard','Humo','Visa/Mastercard'];
const PROMO={KINOBIRINCHI:'Birinchi buyurtmaga 25% chegirma (30 000 so‘mgacha)',TALABA:'Talabalar uchun 15% chegirma',POPKORN:'2 va undan ortiq chiptaga bepul popkorn (25 000 so‘m)',SHOUKECHA:'Shoular uchun 10% chegirma'};
const OFFERS=[['KINOBIRINCHI','Birinchi buyurtmaga 25% chegirma','Platformadagi birinchi buyurtmangizga 30 000 so‘mgacha chegirma.','Amal qiladi: 30-noyabrgacha'],['TALABA','Talabalar uchun 15%','Dushanbadan juma kunigacha 12:40 seansigacha kinolarga.','Amal qiladi: doimiy'],['POPKORN','Ikkita chipta, bepul popkorn','2 va undan ortiq chipta olsangiz, katta popkorn sovg‘a.','Amal qiladi: ish kunlari'],['SHOUKECHA','Shoularga 10% chegirma','Konsert, stand-up va balet chiptalariga hafta oxirida.','Amal qiladi: shanba, yakshanba']];
const S={city:Math.min(ld('city',0),CITY.length-1),date:0,gen:'',type:'',lang:'',q:'',B:null,user:KSAuth.current(),adm:sessionStorage.getItem('ks-adm')==='1',extra:ld('extra',[]),lt:'in',ret:null,opage:1,apage:1,at:'stats',aq:'',af:''};
const CAT=()=>M0.concat(S.extra);
const mov=id=>CAT().find(m=>m.id===id);
let _oRaw,_oList=[];
const orders=()=>{const raw=localStorage.getItem('orders');if(raw!==_oRaw){_oRaw=raw;try{_oList=JSON.parse(raw)||[]}catch(e){_oList=[]}}return _oList};
const paid=o=>o.st!=='cancel';
const dobj=i=>{const d=new Date();d.setDate(d.getDate()+i);return d};
const dk=i=>{const d=dobj(i);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const WD=['Yak','Dush','Sesh','Chor','Pay','Jum','Shan'];
const dlab=i=>i?WD[dobj(i).getDay()]+' '+dobj(i).getDate()+'.'+String(dobj(i).getMonth()+1).padStart(2,'0'):'Bugun';
const dur=n=>Math.floor(n/60)+' s '+n%60+' daq';
const dt=ts=>ts?new Date(ts).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
const sstart=o=>new Date(o.date+'T'+o.time+':00').getTime();
const POSTER=id=>/^[ks]\d+$/.test(id)?`img/${id}.svg?v=3`:'';
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
  orders().forEach(o=>{if(o.key===k&&paid(o))o.seats.forEach(s=>set.add(s))});
  return set;
}
const seatPrice=(B,id)=>price(B.ci,mov(B.mid),id.charCodeAt(0)-65);
function calc(B){
  const base=B.sel.reduce((a,s)=>a+seatPrice(B,s),0),sn=SN.reduce((a,x)=>a+(B.sn[x[0]]||0)*x[2],0),sub=base+sn;
  let d=0,note='';const p=B.promo,first=!orders().some(o=>paid(o)&&(!S.user||o.uid===S.user.id)),shou=mov(B.mid).type==='shou';
  if(p==='KINOBIRINCHI'){if(first){d=Math.min(base*.25,30000)}else note='Bu kod faqat birinchi buyurtmaga'}
  else if(p==='TALABA'){if(shou)note='Talaba kodi faqat kinolarga';else d=base*.15}
  else if(p==='POPKORN'){if(B.sel.length>=2)d=25000;else note='Kamida 2 ta chipta kerak'}
  else if(p==='SHOUKECHA'){if(shou)d=base*.1;else note='Bu kod faqat shoularga'}
  else if(p)note='Bunday kod topilmadi';
  return{base,sn,d:Math.round(d),note,total:sub-Math.round(d)};
}
function newCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',ex=new Set(orders().map(o=>o.code));let c;do{const b=new Uint32Array(8);crypto.getRandomValues(b);c='KS-'+[...b].map(x=>A[x%A.length]).join('')}while(ex.has(c));return c}
function qr(code){try{const m=QR.encode(code),n=m.length,q=4;let p='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(m[y][x])p+=`M${x+q} ${y+q}h1v1h-1z`;return`<svg width="110" height="110" viewBox="0 0 ${n+2*q} ${n+2*q}" shape-rendering="crispEdges" role="img" aria-label="QR kod ${code}"><rect width="100%" height="100%" fill="#fff"/><path d="${p}" fill="#111"/></svg>`}catch(e){return''}}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2600)}
const go=h=>{if(location.hash===h)draw();else location.hash=h};
function dl(name,rows){const csv='\ufeff'+rows.map(r=>r.map(x=>`"${String(x??'').replace(/"/g,'""')}"`).join(';')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();a.remove()}

/* ---------- ko‘rinishlar ---------- */
const poster=m=>`<div class="poster${POSTER(m.id)?' pimg':''}" style="--c:${esc(m.c)}">${POSTER(m.id)?`<img src="${POSTER(m.id)}" alt="${esc(m.t)} posteri" loading="lazy">`:''}${INFO[m.id]?`<em class="age">${INFO[m.id][1]}</em>`:''}<b>${esc(m.t)}</b><span>${m.type==='shou'?'Jonli shou':LN[m.lang]+' • '+m.fmt}</span></div>`;
const card=m=>`<a class="mc" href="#/movie/${m.id}">${poster(m)}<div class="mi"><h3>${esc(m.t)}</h3><div class="sub">★ ${m.r} · ${dur(m.d)}</div><div class="sub">${m.g.map(esc).join(', ')}</div></div></a>`;
const citySel=()=>`<select id="citySel" aria-label="Shahar">${CITY.map((c,i)=>`<option value="${i}" ${i===S.city?'selected':''}>${c[0]}</option>`).join('')}</select>`;
const dateChips=()=>`<div class="chips">${[0,1,2,3,4,5,6].map(i=>`<button class="chip" aria-pressed="${S.date===i}" data-a="date" data-v="${i}">${dlab(i)}</button>`).join('')}</div>`;
const timeChips=(ci,m,date,ts)=>ts.map(t=>`<button class="chip" ${isPast(date,t)?'disabled':''} data-a="book" data-v="${ci}|${m.id}|${date}|${t}">${t} · ${fmt(price(ci,m,0))}</button>`).join('');
const cinCard=c=>`<a class="card" href="#/cinema/${c.id}" style="display:block"><h3>${c.n}</h3><div class="sub">${c.ad}, ${CITY[c.city][1]}</div><div class="tags">${c.ft.map(f=>`<i>${f}</i>`).join('')}<i>${c.r*c.c} o‘rin</i></div><b style="color:var(--ac)">Seanslarni ko‘rish</b></a>`;
const badge=o=>!paid(o)?'<span class="st st-c">Bekor qilingan</span>':sstart(o)<Date.now()?'<span class="st st-p">O‘tgan</span>':'<span class="st st-ok">To‘langan</span>';

function home(){
  const mv=CAT().filter(m=>m.type==='kino').slice(0,10),sh=CAT().filter(m=>m.type==='shou').slice(0,5);
  const cn=CIN.filter(c=>c.city===S.city);
  return`<section class="hero"><div class="w"><h1>O‘zbekiston bo‘ylab kino va shoularga chipta, bir zumda</h1><p>Shaharni tanlang, zaldagi bo‘sh joyni ko‘rib o‘rindiqni o‘zingiz belgilang, joyingizdan ekran qanday ko‘rinishini oldindan ko‘ring.</p>
  <div class="search"><input id="hq" placeholder="Film yoki shou nomini yozing" aria-label="Qidiruv"><button class="btn" data-a="search">Qidirish</button></div>
  <div class="hstat"><span><b>${CAT().filter(m=>m.type==='kino').length}</b> film</span><span><b>${CAT().filter(m=>m.type==='shou').length}</b> shou</span><span><b>${CIN.length}</b> zal</span><span><b>${CITY.length}</b> shahar</span></div></div></section>
  <div class="w"><section class="sec"><div class="sh"><h2>Janr bo‘yicha</h2></div><div class="chips">${GEN.map(g=>`<button class="chip" data-a="genre" data-v="${g}">${g}</button>`).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Hozir kinoteatrlarda</h2><a href="#/movies">Hammasi</a></div><div class="grid">${mv.map(card).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Shoular va konsertlar</h2><a href="#/movies" data-a="type" data-v="shou">Hammasi</a></div><div class="grid">${sh.map(card).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Aksiyalar</h2><a href="#/offers">Barchasi</a></div><div class="cards">${OFFERS.slice(0,3).map(offer).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>${CITY[S.city][0]}dagi kinozallar</h2><a href="#/cinemas">Barcha shaharlar</a></div><div class="cards">${cn.map(cinCard).join('')}</div></section>
  <section class="sec"><div class="sh"><h2>Nega KinoShow</h2></div><div class="why"><div class="card"><h3>Joyingizdan ekran ko‘rinishi</h3><p class="sub">O‘rindiqni tanlaganingizda zalning 3D ko‘rinishi ekran qaysi burchakdan ko‘rinishini ko‘rsatadi.</p></div><div class="card"><h3>${CITY.length} ta shahar, ${CIN.length} ta zal</h3><p class="sub">Toshkentdan Termizgacha, Nukusdan Andijongacha.</p></div><div class="card"><h3>Taomni oldindan buyuring</h3><p class="sub">Popkorn va ichimlikni navbatsiz oling.</p></div><div class="card"><h3>Xavfsiz to‘lov</h3><p class="sub">Payme, Click, Uzcard, Humo, Visa va Mastercard. SMS kod bilan tasdiqlash (demo rejim).</p></div></div></section></div>`;
}
const offer=o=>`<div class="card"><span class="code">${o[0]}</span><h3>${o[1]}</h3><p class="sub">${o[2]}</p><div class="sub">${o[3]}</div><button class="gh" style="margin-top:10px" data-a="usepromo" data-v="${o[0]}">Kodni qo‘llash</button></div>`;
function movies(){
  const f=filtered();
  return`<div class="w sec"><div class="sh"><h2>Filmlar va shoular</h2><span class="sub">${CAT().length} ta</span></div>
  <div class="chips" style="margin-bottom:12px">${[['','Hammasi'],['kino','Filmlar'],['shou','Shoular']].map(t=>`<button class="chip" aria-pressed="${S.type===t[0]}" data-a="type" data-v="${t[0]}">${t[1]}</button>`).join('')}
  <select id="genSel" aria-label="Janr"><option value="">Barcha janrlar</option>${GEN.map(g=>`<option ${S.gen===g?'selected':''}>${g}</option>`).join('')}</select>
  <select id="langSel" aria-label="Til"><option value="">Barcha tillar</option>${Object.keys(LN).map(k=>`<option value="${k}" ${S.lang===k?'selected':''}>${LN[k]}</option>`).join('')}</select>
  <input id="mq" style="max-width:240px" placeholder="Qidirish" value="${esc(S.q)}" aria-label="Qidirish"></div><div class="grid" id="grid">${gridHTML(f)}</div></div>`;
}
const filtered=()=>CAT().filter(m=>(!S.type||m.type===S.type)&&(!S.gen||m.g.includes(S.gen))&&(!S.lang||m.lang===S.lang)&&m.t.toLowerCase().includes(S.q.toLowerCase()));
const gridHTML=f=>f.length?f.map(card).join(''):'<p class="sub">Hech narsa topilmadi. Filtrlarni o‘zgartirib ko‘ring.</p>';
function cinemas(){
  return`<div class="w sec"><div class="sh"><h2>Kinozallar</h2><span class="sub">${CIN.length} ta zal, ${CITY.length} ta shahar</span></div>${CITY.map((c,i)=>{const l=CIN.filter(x=>x.city===i);return`<h3 style="margin:22px 0 10px">${c[0]} <span class="sub" style="font-family:Figtree">${c[1]}</span></h3><div class="cards">${l.map(cinCard).join('')}</div>`}).join('')}</div>`;
}
function cinemaP(id){
  const c=CIN[+id];if(!c)return home();const d=dk(S.date),l=showsOf(c.id,d);
  return`<div class="w sec"><a class="sub" href="#/cinemas">← Barcha kinozallar</a><h1 style="font-size:32px;margin:6px 0">${c.n}</h1><div class="sub">${c.ad}, ${CITY[c.city][1]}</div><div class="tags">${c.ft.map(f=>`<i>${f}</i>`).join('')}<i>${c.r} qator × ${c.c} o‘rin = ${c.r*c.c} ta o‘rindiq</i><i>VIP: oxirgi 2 qator</i></div>${dateChips()}
  ${l.length?l.map(s=>`<div class="shw"><div><a href="#/movie/${s.m.id}"><b>${esc(s.m.t)}</b></a><div class="sub">${s.m.type==='shou'?'Jonli shou':LN[s.m.lang]+' • '+s.m.fmt} · ${s.m.g.map(esc).join(', ')}${INFO[s.m.id]?' · '+INFO[s.m.id][1]:''}</div></div><div class="chips">${timeChips(c.id,s.m,d,s.t)}</div></div>`).join(''):'<p class="sub">Bu kunga seans yo‘q.</p>'}</div>`;
}
function movieP(id){
  const m=mov(id);if(!m)return home();const d=dk(S.date),inf=INFO[m.id],sh=m.type==='shou';
  const list=CIN.filter(c=>c.city===S.city).map(c=>({c,s:showsOf(c.id,d).find(x=>x.m.id===m.id)})).filter(x=>x.s);
  return`<div class="w"><div class="det">${poster(m)}<div><h1>${esc(m.t)}</h1><div class="sub">★ ${m.r} / 10 · ${dur(m.d)} · ${sh?'Jonli shou':LN[m.lang]+' • '+m.fmt}</div><div class="tags">${m.g.map(g=>`<i>${esc(g)}</i>`).join('')}${inf?`<i>${inf[1]}</i><i>${inf[0]}-yil</i>`:''}</div><p>${esc(m.ds)}</p>
  ${inf?`<div class="kv"><span>${sh?'Tashkilotchi':'Rejissyor'}</span><b>${inf[2]}</b><span>${sh?'Ijrochilar':'Rollarda'}</span><b>${inf[3]}</b></div>`:''}
  <div class="sub">Shahar: ${CITY[S.city][0]}. Boshqa shaharni tepadagi ro‘yxatdan tanlang.</div></div></div>
  ${dateChips()}<div style="margin-top:6px">${list.length?list.map(x=>`<div class="shw"><div><a href="#/cinema/${x.c.id}"><b>${x.c.n}</b></a><div class="sub">${x.c.ad} · ${x.c.ft.join(', ')}</div></div><div class="chips">${timeChips(x.c.id,m,d,x.s.t)}</div></div>`).join(''):`<p class="sub" style="padding:16px 0">${CITY[S.city][0]}da bu kunga seans yo‘q. Boshqa kun yoki shaharni tanlang.</p>`}</div></div>`;
}
function offers(){return`<div class="w sec"><div class="sh"><h2>Aksiya va chegirmalar</h2></div><div class="cards">${OFFERS.map(offer).join('')}</div></div>`}

/* ---------- zal, sektorlar va 3D ko‘rinish ---------- */
const sid=(r,i)=>String.fromCharCode(65+r)+i;
const pseat=id=>[id.charCodeAt(0)-65,+id.slice(1)];
function SECT(c){const v=c.r-2,q1=Math.ceil(c.c*.25),q3=Math.floor(c.c*.75);return[
  {id:'front',n:'Old qatorlar',r:[0,2],c:[1,c.c]},{id:'mid',n:'Markaz',r:[3,v-1],c:[q1+1,q3]},
  {id:'left',n:'Chap tomon',r:[3,v-1],c:[1,q1]},{id:'right',n:'O‘ng tomon',r:[3,v-1],c:[q3+1,c.c]},{id:'vip',n:'VIP (orqa)',r:[v,c.r-1],c:[1,c.c]}]}
const inSec=(s,r,i)=>s&&r>=s.r[0]&&r<=s.r[1]&&i>=s.c[0]&&i<=s.c[1];
const secMid=s=>sid(Math.round((s.r[0]+s.r[1])/2),Math.round((s.c[0]+s.c[1])/2));
function viewTarget(){const B=S.B,c=CIN[B.ci];if(B.view)return pseat(B.view);if(B.sel.length)return pseat(B.sel[B.sel.length-1]);return[Math.round((c.r-1)*.6),Math.ceil(c.c/2)]}
function seatsP(){
  const B=S.B;if(!B)return home();
  const c=CIN[B.ci],m=mov(B.mid),so=sold(B);B.sel=B.sel.filter(x=>!so.has(x));
  const total=c.r*c.c,free=total-so.size,half=Math.ceil(c.c/2),secs=SECT(c),cur=secs.find(s=>s.id===B.sector);
  let rows='';
  for(let r=0;r<c.r;r++){const L=String.fromCharCode(65+r);rows+=`<div class="r"><span class="rl">${L}</span>`;
    for(let i=1;i<=c.c;i++){const id=L+i;rows+=(i===half+1?'<span class="gap"></span>':'')+`<button class="seat ${r>=c.r-2?'vip':''} ${B.sel.includes(id)?'sel':''} ${inSec(cur,r,i)?'insec':''}" data-a="seat" data-v="${id}" ${so.has(id)?'disabled':''} aria-label="${L} qator ${i}-o‘rin, ${fmt(price(B.ci,m,r))}${so.has(id)?', band':''}" title="${id} · ${fmt(price(B.ci,m,r))}">${i}</button>`}
    rows+=`<span class="rl">${L}</span></div>`}
  const freeIn=s=>{let n=0;for(let r=s.r[0];r<=s.r[1];r++)for(let i=s.c[0];i<=s.c[1];i++)if(!so.has(sid(r,i)))n++;return n};
  const cost=calc(B).base;
  return`<div class="w"><div class="lay"><div class="card"><a class="sub" href="#/movie/${m.id}">← Seanslarga qaytish</a>
  <div class="v3" id="v3"><span class="v3-tag" id="v3t">Ekrandan ko‘rinish</span></div><div class="v3i" id="v3i"></div>
  <div class="chips" style="margin:6px 0 10px"><span class="sub" style="align-self:center">Sektorlar:</span>${secs.map(s=>`<button class="chip" aria-pressed="${B.sector===s.id}" data-a="sector" data-v="${s.id}">${s.n} <small class="sub">· ${freeIn(s)} bo‘sh</small></button>`).join('')}</div>
  <div class="chips" style="margin:0 0 10px"><span class="sub" style="align-self:center">Yonma-yon joy:</span>${[1,2,3,4,5,6].map(n=>`<button class="chip" data-a="auto" data-v="${n}">${n}</button>`).join('')}<button class="gh" data-a="clear">Tozalash</button></div>
  <div class="scr"></div><div class="sub" style="text-align:center;margin-bottom:18px">Ekran</div><div class="map"><div class="rows">${rows}</div></div>
  <div class="lg"><span><i style="background:var(--free)"></i>Bo‘sh</span><span><i style="background:var(--vip)"></i>VIP</span><span><i style="background:var(--ac)"></i>Tanlangan</span><span><i style="background:var(--sold);opacity:.55"></i>Band</span><span class="sub">Sichqonchani o‘rindiq ustiga olib boring: ekran ko‘rinishi o‘zgaradi</span></div>
  <div style="margin-top:14px"><div class="sub">Bo‘sh joylar: <b style="color:var(--ink)">${free}</b> / ${total} · band: ${so.size}</div><div class="bar" style="margin-top:6px"><span style="width:${Math.round(so.size/total*100)}%"></span></div></div></div>
  <aside class="card"><h2 style="font-size:21px">${esc(m.t)}</h2><div class="sub">${c.n}, ${CITY[c.city][0]}<br>${B.date.split('-').reverse().join('.')} · ${B.time}</div><div style="margin-top:10px">${B.sel.length?B.sel.slice().sort().map(s=>`<div class="ln"><span>${s[0]} qator, ${s.slice(1)}-o‘rin</span><span>${fmt(seatPrice(B,s))} <button class="gh" style="padding:0 8px" data-a="seat" data-v="${s}" aria-label="Olib tashlash">✕</button></span></div>`).join(''):'<div class="sub">Sxemadan joy tanlang (8 tagacha).</div>'}</div>
  <div class="tot"><span>Jami</span><span>${fmt(cost)}</span></div><button class="btn" style="width:100%" data-a="next" ${B.sel.length?'':'disabled'}>${S.user?'Davom etish':'Kirish va davom etish'}</button></aside></div></div>`;
}
function showInfo(p,hover){const el=$('#v3i'),t=$('#v3t');if(!el)return;const f=KSView.info(p[0],p[1]);
  t.textContent=`${hover?'Ko‘rish: ':'Siz: '}${String.fromCharCode(65+p[0])} qator, ${p[1]}-o‘rin`;
  el.innerHTML=`<b>${f.score}/100</b> · Ekrangacha ${f.dist} m · Ko‘rish burchagi ${f.ang}°${f.side>4?` · Yon burchak ${f.side}°`:''}<br><span class="sub">${f.grade}</span>`}
function afterSeats(){
  const B=S.B,el=$('#v3');if(!B||!el)return;const c=CIN[B.ci],m=mov(B.mid);
  KSView.mount(el,{rows:c.r,cols:c.c,vip:2,poster:POSTER(m.id),sold:sold(B),sel:B.sel});
  const t=viewTarget();KSView.look(t[0],t[1]);showInfo(t);
  const map=$('.map');let ht;
  map.addEventListener('mouseover',e=>{const s=e.target.closest('.seat');if(!s)return;clearTimeout(ht);ht=setTimeout(()=>{const p=pseat(s.dataset.v);KSView.look(p[0],p[1],true);showInfo(p,true)},70)});
  map.addEventListener('mouseleave',()=>{clearTimeout(ht);const t=viewTarget();KSView.look(t[0],t[1]);showInfo(t)});
}

/* ---------- to‘lov ---------- */
function checkout(){
  const B=S.B;if(!B||!B.sel.length)return home();
  if(!S.user)return login();
  if(!B.name)B.name=S.user.name;if(!B.phone)B.phone=KSAuth.fmtPhone(S.user.phone);
  const m=mov(B.mid),c=CIN[B.ci],k=calc(B);
  return`<div class="w"><div class="lay"><div><div class="card"><h3>Taom va ichimliklar</h3>${SN.map(x=>`<div class="ln"><span>${x[1]}<div class="sub">${fmt(x[2])}</div></span><span class="qty"><button data-a="sn" data-v="${x[0]}|-1" aria-label="Kamaytirish">−</button><b>${B.sn[x[0]]||0}</b><button data-a="sn" data-v="${x[0]}|1" aria-label="Ko‘paytirish">+</button></span></div>`).join('')}</div>
  <div class="card" style="margin-top:16px"><h3>Promokod</h3><div style="display:flex;gap:8px;margin-top:8px"><input id="promo" value="${esc(B.promo||'')}" placeholder="Masalan, TALABA"><button class="gh" data-a="applypromo">Qo‘llash</button></div><div class="${k.note||!B.promo?'err':'ok'}">${B.promo?(k.note||PROMO[B.promo]):''}</div></div>
  <div class="card" style="margin-top:16px"><h3>To‘lov usuli</h3><div class="pays">${PAYS.map(p=>`<button class="pay ${B.pay===p?'on':''}" data-a="pay" data-v="${p}" aria-pressed="${B.pay===p}"><i class="pl pl-${p.split('/')[0].toLowerCase()}">${p==='Visa/Mastercard'?'VISA':p.toUpperCase()}</i><span>${p}</span></button>`).join('')}</div>
  <label>Ismingiz<input id="name" autocomplete="name" value="${esc(B.name||'')}"></label><label>Telefon<input id="phone" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" value="${esc(B.phone||'')}"></label><div class="err" id="err"></div>
  <p class="sub" style="margin:6px 0 0">🔒 To‘lov KinoShow Pay xavfsiz sahifasida SMS kod bilan tasdiqlanadi. Demo rejim: haqiqiy pul yechilmaydi.</p></div></div>
  <aside class="card"><h2 style="font-size:21px">${esc(m.t)}</h2><div class="sub">${c.n} · ${B.date.split('-').reverse().join('.')} ${B.time}<br>Joylar: ${B.sel.slice().sort().join(', ')}</div>
  <div class="ln"><span>Chiptalar (${B.sel.length})</span><span>${fmt(k.base)}</span></div><div class="ln"><span>Taomlar</span><span>${fmt(k.sn)}</span></div>${k.d?`<div class="ln"><span>Chegirma</span><span>−${fmt(k.d)}</span></div>`:''}
  <div class="tot"><span>To‘lov</span><span>${fmt(k.total)}</span></div><button class="btn" style="width:100%" data-a="buy">${B.pay} orqali to‘lash</button></aside></div></div>`;
}
function tkHTML(o){const m=mov(o.mid)||{t:o.title||'—'},c=CIN[o.ci]||{n:'—',city:0};return`<div class="tk" id="tkt">${qr(o.code)}<div><div class="tc">${o.code} ${badge(o)}</div><b>${esc(m.t)}</b><div class="sub">${c.n}, ${CITY[c.city][0]}<br>${o.date.split('-').reverse().join('.')} · ${o.time}</div><div>Joylar: ${o.seats.join(', ')}</div><div class="sub">${esc(o.name)} · ${fmt(o.total)}</div></div></div>`}
function receipt(o){const p=o.payment||{};return`<div class="card rc"><h3>To‘lov cheki</h3><div class="kv"><span>Sotuvchi</span><b>KinoShow MChJ</b><span>To‘lov usuli</span><b>${esc(p.method||o.pay||'—')}</b><span>Karta</span><b>${esc(p.mask||'—')}</b><span>Tranzaksiya ID</span><b>${esc(p.txn||'—')}</b><span>RRN</span><b>${esc(p.rrn||'—')}</b><span>Avtorizatsiya kodi</span><b>${esc(p.auth||'—')}</b><span>To‘langan vaqt</span><b>${dt(p.at||o.ts)}</b>
  ${o.sub!=null?`<span>Chipta va taomlar</span><b>${fmt(o.sub)}</b>`:''}${o.disc?`<span>Chegirma${o.promo?' ('+esc(o.promo)+')':''}</span><b>−${fmt(o.disc)}</b>`:''}<span>Jami</span><b>${fmt(o.total)}</b>${!paid(o)?`<span>Qaytarildi</span><b>${dt(o.refundAt)}</b>`:''}</div></div>`}
function ticket(code){
  const o=orders().find(x=>x.code===code);if(!o)return`<div class="w sec"><p>Chipta topilmadi.</p></div>`;
  return`<div class="w sec"><h2 style="margin-bottom:6px">${paid(o)?'Chipta tayyor':'Chipta bekor qilingan'}</h2><p class="sub">Zalga kirishda QR kodni ko‘rsating. Chipta “Chiptalarim” bo‘limida saqlanadi.</p><div class="tkw">${tkHTML(o)}${receipt(o)}</div><div class="chips" style="margin-top:14px"><button class="btn" onclick="window.print()">Chop etish</button><a class="gh" href="#/orders">Chiptalarim</a></div></div>`;
}
function ordersP(){
  const all=orders().filter(o=>S.user?o.uid===S.user.id:!o.uid),l=all.slice(0,S.opage*20);
  return`<div class="w sec"><div class="sh"><h2>Chiptalarim</h2><span class="sub">${all.length} ta buyurtma</span></div>${S.user?'':'<div class="card" style="margin-bottom:14px">Chiptalaringiz barcha qurilmada saqlanishi uchun <a href="#/login" style="color:var(--ac);font-weight:700">hisobingizga kiring</a>.</div>'}
  ${l.length?l.map(o=>`<div class="shw"><div><b>${o.code}</b> · ${esc((mov(o.mid)||{}).t)} ${badge(o)}<div class="sub">${(CIN[o.ci]||{}).n} · ${o.date.split('-').reverse().join('.')} ${o.time} · ${o.seats.join(', ')} · ${fmt(o.total)} · ${esc((o.payment||{}).method||o.pay)}</div></div><div class="chips"><a class="gh" href="#/ticket/${o.code}">Ko‘rish</a>${paid(o)&&sstart(o)-Date.now()>30*60000?`<button class="gh" data-a="cancel" data-v="${o.code}">Bekor qilish</button>`:''}</div></div>`).join('')+(all.length>l.length?`<button class="gh" style="margin-top:14px" data-a="more" data-v="opage">Yana ko‘rsatish (${all.length-l.length})</button>`:''):'<p class="sub">Hozircha chipta yo‘q.</p>'}</div>`;
}
function login(){
  if(S.user){const u=KSAuth.all().find(x=>x.id===S.user.id)||{},my=orders().filter(o=>o.uid===S.user.id);
    return`<div class="form card"><h2>Mening hisobim</h2><div class="kv" style="margin-top:12px"><span>Ism</span><b>${esc(u.name)}</b><span>Telefon</span><b>${KSAuth.fmtPhone(u.phone)}</b><span>Ro‘yxatdan o‘tgan</span><b>${dt(u.createdAt)}</b><span>Buyurtmalar</span><b>${my.filter(paid).length} ta</b><span>Jami to‘lov</span><b>${fmt(my.filter(paid).reduce((a,o)=>a+o.total,0))}</b></div><a class="btn" style="display:block;text-align:center;margin-top:14px" href="#/orders">Chiptalarim</a><button class="gh" style="width:100%;margin-top:8px" data-a="logout">Chiqish</button></div>`}
  const up=S.lt==='up';
  return`<div class="form card">${S.ret?'<p class="ok" style="margin:0 0 8px">Chipta olish uchun hisobingizga kiring yoki ro‘yxatdan o‘ting.</p>':''}<div class="tabs"><button class="${up?'':'on'}" data-a="ltab" data-v="in">Kirish</button><button class="${up?'on':''}" data-a="ltab" data-v="up">Ro‘yxatdan o‘tish</button></div>
  <form id="${up?'fup':'fin'}">${up?'<label>Ism va familiya<input id="lname" autocomplete="name" required></label>':''}<label>Telefon<input id="lphone" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" required></label><label>Parol<input id="lpass" type="password" autocomplete="${up?'new-password':'current-password'}" required></label>${up?'<label>Parolni takrorlang<input id="lpass2" type="password" autocomplete="new-password" required></label>':''}
  <div class="err" id="lerr"></div><button class="btn" style="width:100%;margin-top:10px" type="submit">${up?'Ro‘yxatdan o‘tish':'Kirish'}</button></form><p class="sub" style="margin-top:10px">Parol shifrlangan (SHA-256 xesh) holda saqlanadi.</p></div>`;
}

/* ---------- admin ---------- */
function stats(){
  const o=orders(),p=o.filter(paid),c=o.filter(x=>!paid(x)),u=KSAuth.all(),today=new Date().setHours(0,0,0,0);
  const rev=p.reduce((a,x)=>a+x.total,0),tc=p.reduce((a,x)=>a+x.seats.length,0);
  const by=CITY.map((cc,i)=>({n:cc[0],v:p.filter(x=>(CIN[x.ci]||{}).city===i).reduce((a,x)=>a+x.total,0)})).filter(x=>x.v),mx=Math.max(1,...by.map(x=>x.v));
  const pm=PAYS.map(n=>({n,v:p.filter(x=>((x.payment||{}).method||x.pay)===n).reduce((a,x)=>a+x.total,0)})),pmx=Math.max(1,...pm.map(x=>x.v));
  const fm={};p.forEach(x=>{fm[x.mid]=(fm[x.mid]||0)+x.seats.length});const top=Object.entries(fm).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return`<div class="cards kpi"><div class="card"><div class="sub">Foydalanuvchilar</div><h2>${u.length}</h2><div class="sub">bugun: +${u.filter(x=>x.createdAt>=today).length}</div></div><div class="card"><div class="sub">To‘langan buyurtmalar</div><h2>${p.length}</h2><div class="sub">bekor qilingan: ${c.length}</div></div><div class="card"><div class="sub">Sotilgan chiptalar</div><h2>${tc}</h2><div class="sub">o‘rtacha chek: ${fmt(p.length?rev/p.length:0)}</div></div><div class="card"><div class="sub">Tushum</div><h2>${fmt(rev)}</h2><div class="sub">qaytarilgan: ${fmt(c.reduce((a,x)=>a+x.total,0))}</div></div></div>
  <div class="cards" style="margin-top:16px"><div class="card"><h3>To‘lov usullari</h3>${pm.map(x=>`<div class="ln"><span style="width:120px">${x.n}</span><div class="bar" style="flex:1;align-self:center"><span style="width:${x.v/pmx*100}%"></span></div><span style="width:110px;text-align:right">${fmt(x.v)}</span></div>`).join('')}</div>
  <div class="card"><h3>Shaharlar bo‘yicha tushum</h3>${by.length?by.map(x=>`<div class="ln"><span style="width:90px">${x.n}</span><div class="bar" style="flex:1;align-self:center"><span style="width:${x.v/mx*100}%"></span></div><span style="width:110px;text-align:right">${fmt(x.v)}</span></div>`).join(''):'<p class="sub">Hali sotuv yo‘q.</p>'}</div>
  <div class="card"><h3>Eng ko‘p sotilgan</h3>${top.length?top.map(([id,n],i)=>`<div class="ln"><span>${i+1}. ${esc((mov(id)||{}).t||id)}</span><b>${n} chipta</b></div>`).join(''):'<p class="sub">Hali sotuv yo‘q.</p>'}</div></div>`;
}
function aUsers(){
  const q=S.aq.trim().toLowerCase(),o=orders(),l=KSAuth.all().filter(u=>!q||u.name.toLowerCase().includes(q)||u.phone.includes(q.replace(/\D/g,'')||'#')).sort((a,b)=>b.createdAt-a.createdAt);
  return l.length?`<table><tr><th>#</th><th>Ism</th><th>Telefon</th><th>Ro‘yxatdan o‘tgan</th><th>Oxirgi faollik</th><th>Kirishlar</th><th>Buyurtmalar</th><th>Sarflagan</th><th>Holat</th><th></th></tr>${l.map((u,i)=>{const my=o.filter(x=>x.uid===u.id&&paid(x));return`<tr><td>${i+1}</td><td><b>${esc(u.name)}</b></td><td>${KSAuth.fmtPhone(u.phone)}</td><td>${dt(u.createdAt)}</td><td>${dt(u.lastSeen||u.lastLogin)}</td><td>${u.logins||0}</td><td>${my.length}</td><td>${fmt(my.reduce((a,x)=>a+x.total,0))}</td><td>${u.blocked?'<span class="st st-c">Bloklangan</span>':'<span class="st st-ok">Faol</span>'}</td><td style="white-space:nowrap"><button class="gh" data-a="uorders" data-v="${u.phone}">Buyurtmalari</button> <button class="gh" data-a="ublock" data-v="${u.id}">${u.blocked?'Blokdan chiqarish':'Bloklash'}</button></td></tr>`}).join('')}</table>`:`<p class="sub">${q?'Hech kim topilmadi.':'Hali ro‘yxatdan o‘tgan foydalanuvchi yo‘q. Saytda “Kirish → Ro‘yxatdan o‘tish” orqali birinchi foydalanuvchini yarating.'}</p>`;
}
function aOrdersList(){const q=S.aq.trim().toLowerCase(),qd=q.replace(/\D/g,'');return orders().filter(o=>(!S.af||(S.af==='paid'?paid(o):!paid(o)))&&(!q||o.code.toLowerCase().includes(q)||String(o.name).toLowerCase().includes(q)||(qd&&String(o.phone).replace(/\D/g,'').includes(qd))))}
function aOrders(){
  const all=aOrdersList(),l=all.slice(0,S.apage*25);
  return l.length?`<table><tr><th>Kod</th><th>Vaqt</th><th>Mijoz</th><th>Seans</th><th>Joylar</th><th>To‘lov</th><th>Summa</th><th>Holat</th><th></th></tr>${l.map(x=>`<tr><td><a href="#/ticket/${x.code}" style="color:var(--ac);font-weight:700">${x.code}</a></td><td>${dt(x.ts)}</td><td>${esc(x.name)}<div class="sub">${esc(x.phone)}</div></td><td>${esc((mov(x.mid)||{}).t)}<div class="sub">${(CIN[x.ci]||{}).n} · ${x.date.split('-').reverse().join('.')} ${x.time}</div></td><td>${x.seats.join(', ')}</td><td>${esc((x.payment||{}).method||x.pay)}<div class="sub">${esc((x.payment||{}).mask||'')}</div></td><td>${fmt(x.total)}</td><td>${badge(x)}</td><td>${paid(x)?`<button class="gh" data-a="cancel" data-v="${x.code}">Bekor qilish</button>`:''}</td></tr>`).join('')}</table>${all.length>l.length?`<button class="gh" style="margin-top:12px" data-a="more" data-v="apage">Yana ko‘rsatish (${all.length-l.length})</button>`:''}`:'<p class="sub">Buyurtma topilmadi.</p>';
}
function aFilms(){
  return`<div class="card"><h3>Yangi film yoki shou qo‘shish</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:8px"><input id="nt" placeholder="Nomi"><select id="ntype"><option value="kino">Film</option><option value="shou">Shou</option></select><select id="ng">${GEN.map(g=>`<option>${g}</option>`).join('')}</select><select id="nl"><option value="uz">O‘zbek</option><option value="ru">Rus</option><option value="en">Ingliz</option></select><select id="nf"><option>2D</option><option>3D</option><option>IMAX</option><option>Jonli</option></select><input id="nd" type="number" placeholder="Davomiyligi (daq)" value="110"></div><div class="err" id="nerr"></div><button class="btn" style="margin-top:6px" data-a="addm">Qo‘shish</button></div>
  <div class="card tw" style="margin-top:16px"><h3>Katalog (${CAT().length})</h3><table><tr><th>Nomi</th><th>Turi</th><th>Janr</th><th>Til / format</th><th>Davomiylik</th><th></th></tr>${CAT().map(m=>`<tr><td><b>${esc(m.t)}</b></td><td>${m.type==='shou'?'Shou':'Film'}</td><td>${m.g.map(esc).join(', ')}</td><td>${LN[m.lang]||m.lang} · ${esc(m.fmt)}</td><td>${dur(m.d)}</td><td>${m.id[0]==='x'?`<button class="gh" data-a="delm" data-v="${m.id}">O‘chirish</button>`:''}</td></tr>`).join('')}</table></div>`;
}
const atable=()=>S.at==='users'?aUsers():aOrders();
function admin(){
  if(!S.adm)return`<div class="form card"><h2>Admin panel</h2><p class="sub">Demo kod: 1234</p><form id="fadm"><label>Kod<input id="acode" type="password" autocomplete="off"></label><div class="err" id="aerr"></div><button class="btn" style="width:100%;margin-top:10px" type="submit">Kirish</button></form></div>`;
  const T=[['stats','Umumiy'],['users','Foydalanuvchilar ('+KSAuth.all().length+')'],['orders','Buyurtmalar ('+orders().length+')'],['films','Filmlar']];
  let body;
  if(S.at==='users'||S.at==='orders')body=`<div class="card tw"><div class="chips" style="margin-bottom:12px"><input id="aq" style="max-width:300px" placeholder="${S.at==='users'?'Ism yoki telefon':'Kod, ism yoki telefon'} bo‘yicha qidirish" value="${esc(S.aq)}">${S.at==='orders'?`<select id="af"><option value="">Barcha holatlar</option><option value="paid" ${S.af==='paid'?'selected':''}>To‘langan</option><option value="cancel" ${S.af==='cancel'?'selected':''}>Bekor qilingan</option></select>`:''}<button class="gh" data-a="csv" data-v="${S.at}">⬇ Excel (CSV) yuklab olish</button></div><div id="atable">${atable()}</div></div>`;
  else body=S.at==='films'?aFilms():stats();
  return`<div class="w sec"><div class="sh"><h2>Boshqaruv paneli</h2><button class="gh" data-a="alogout">Chiqish</button></div><div class="tabs wide">${T.map(t=>`<button class="${S.at===t[0]?'on':''}" data-a="atab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>${body}</div>`;
}

/* ---------- boshqaruv ---------- */
const ROUTES={'':home,movies,cinemas,cinema:cinemaP,movie:movieP,offers,seats:seatsP,checkout,ticket,orders:ordersP,login,admin};
function draw(){
  const [p,a]=(location.hash.slice(2)||'').split('/');
  const nl=[['','Bosh sahifa'],['movies','Filmlar va shoular'],['cinemas','Kinozallar'],['offers','Aksiyalar'],['admin','Admin']];
  $('#nav').innerHTML=`<a class="logo" href="#/">KinoShow</a>${nl.map(x=>`<a class="l ${p===x[0]?'on':''}" href="#/${x[0]}">${x[1]}</a>`).join('')}<span class="sp"></span>${citySel()}<a class="l ${p==='orders'?'on':''}" href="#/orders">Chiptalarim</a><button class="gh" data-a="theme" aria-label="Rejim">Rejim</button><a class="btn" href="#/login" style="white-space:nowrap">${S.user?'👤 '+esc(S.user.name.split(' ')[0]):'Kirish'}</a>`;
  $('#app').innerHTML=(ROUTES[p]||home)(a);
  if(p==='seats')afterSeats();
}
function route(){draw();scrollTo(0,0)}
addEventListener('hashchange',route);
const ACT={
  date:v=>{S.date=+v;draw()},
  genre:v=>{S.gen=v;S.type='';go('#/movies')},
  type:v=>{S.type=v;go('#/movies')},
  search:()=>{S.q=$('#hq').value;go('#/movies')},
  theme:()=>{const r=document.documentElement;r.dataset.theme=getComputedStyle(r).colorScheme==='dark'?'light':'dark';localStorage.setItem('theme',r.dataset.theme)},
  book:v=>{const [ci,mid,date,time]=v.split('|');S.B={ci:+ci,mid,date,time,sel:[],sn:{},promo:ld('promo',''),pay:'Payme',name:S.user?S.user.name:'',phone:S.user?KSAuth.fmtPhone(S.user.phone):'',view:null,sector:null};go('#/seats')},
  seat:v=>{const B=S.B,i=B.sel.indexOf(v);if(i>=0)B.sel.splice(i,1);else if(B.sel.length>=8)return toast('Eng ko‘pi bilan 8 ta joy');else{B.sel.push(v);B.view=v}draw()},
  sector:v=>{const B=S.B,c=CIN[B.ci];if(B.sector===v){B.sector=null}else{B.sector=v;B.view=secMid(SECT(c).find(s=>s.id===v))}draw()},
  clear:()=>{S.B.sel=[];draw()},
  auto:v=>{const n=+v,B=S.B,c=CIN[B.ci],so=sold(B),sec=SECT(c).find(s=>s.id===B.sector);let best=null;
    for(let r=0;r<c.r;r++)for(let s=1;s+n-1<=c.c;s++){const ids=Array.from({length:n},(_,k)=>String.fromCharCode(65+r)+(s+k));if(ids.some(x=>so.has(x)))continue;if(sec&&!ids.every(x=>inSec(sec,...pseat(x))))continue;const sc=Math.abs(s+(n-1)/2-(c.c+1)/2)*1.2+Math.abs(r-c.r*.6)*1.6;if(!best||sc<best.sc)best={sc,ids}}
    if(!best)return toast(n+' ta yonma-yon bo‘sh joy topilmadi'+(sec?' (shu sektorda)':''));B.sel=best.ids;B.view=best.ids[Math.floor(n/2)];draw()},
  next:()=>{if(!S.user){S.ret='#/checkout';toast('Chipta olish uchun hisobingizga kiring');return go('#/login')}const B=S.B;if(!B.name)B.name=S.user.name;if(!B.phone)B.phone=KSAuth.fmtPhone(S.user.phone);go('#/checkout')},
  sn:v=>{const [id,d]=v.split('|'),B=S.B;B.sn[id]=Math.max(0,Math.min(20,(B.sn[id]||0)+ +d));draw()},
  applypromo:()=>{S.B.promo=$('#promo').value.trim().toUpperCase();sv('promo',S.B.promo);draw()},
  usepromo:v=>{sv('promo',v);if(S.B)S.B.promo=v;toast('Kod saqlandi: '+v+'. To‘lov sahifasida qo‘llanadi')},
  pay:v=>{S.B.pay=v;draw()},
  buy:async()=>{const B=S.B;if(!B||S.paying)return;const name=($('#name').value||'').trim(),phone=$('#phone').value.trim();B.name=name;B.phone=phone;
    if(name.length<2)return $('#err').textContent='Ismingizni kiriting';
    if(phone.replace(/\D/g,'').length<9)return $('#err').textContent='Telefon raqamini to‘liq kiriting';
    let so=sold(B);if(B.sel.some(x=>so.has(x))){toast('Ba’zi joylar band bo‘lib qoldi');return go('#/seats')}
    const k=calc(B);if(k.note)return $('#err').textContent='Promokod: '+k.note;
    const code=newCode(),m=mov(B.mid);S.paying=true;
    const r=await KSPay.open({amount:k.total,method:B.pay,phone,orderId:code,desc:`${m.t} · ${CIN[B.ci].n} · ${B.date.split('-').reverse().join('.')} ${B.time} · Joylar: ${B.sel.slice().sort().join(', ')}`});
    S.paying=false;if(!r.ok)return toast('To‘lov bekor qilindi');
    so=sold(B);if(B.sel.some(x=>so.has(x))){toast('Afsuski, joylar boshqa xaridorga sotildi. To‘lov qaytarildi');return go('#/seats')}
    const o={code,key:skey(B),ci:B.ci,mid:B.mid,date:B.date,time:B.time,seats:B.sel.slice().sort(),sn:B.sn,sub:k.base+k.sn,disc:k.d,promo:k.d?B.promo:'',total:k.total,name,phone,pay:B.pay,uid:S.user?S.user.id:null,st:'paid',payment:{method:r.method,brand:r.brand,mask:r.mask,txn:r.txn,rrn:r.rrn,auth:r.auth,at:r.paidAt},ts:Date.now()};
    if(!sv('orders',[o,...orders()]))return toast('Xotira to‘ldi: buyurtma saqlanmadi, to‘lov qaytarildi');
    if(k.d&&B.promo)sv('promo','');S.B=null;go('#/ticket/'+code)},
  cancel:v=>{const l=orders(),o=l.find(x=>x.code===v);if(!o||!paid(o))return;const adm=location.hash.startsWith('#/admin');
    if(!adm&&sstart(o)-Date.now()<30*60000)return toast('Seansga 30 daqiqadan kam qoldi, bekor qilib bo‘lmaydi');
    if(!confirm(`${o.code} chiptasi bekor qilinsinmi? ${fmt(o.total)} kartaga qaytariladi va joylar bo‘shaydi.`))return;
    if(sv('orders',l.map(x=>x.code===v?{...x,st:'cancel',refundAt:Date.now(),cancelBy:adm?'admin':'user'}:x))){toast('Chipta bekor qilindi, '+fmt(o.total)+' qaytarildi');draw()}},
  more:v=>{S[v]++;draw()},
  ltab:v=>{S.lt=v;draw()},
  logout:()=>{KSAuth.logout();S.user=null;toast('Hisobdan chiqdingiz');go('#/')},
  alogout:()=>{S.adm=false;sessionStorage.removeItem('ks-adm');draw()},
  atab:v=>{S.at=v;S.aq='';S.apage=1;draw()},
  ublock:v=>{const u=KSAuth.all().find(x=>x.id===v);if(!u)return;if(!u.blocked&&!confirm(u.name+' bloklansinmi? U hisobiga kira olmaydi.'))return;KSAuth.setBlocked(v,!u.blocked);toast(u.blocked?'Blokdan chiqarildi':'Bloklandi');draw()},
  uorders:v=>{S.at='orders';S.aq=v;S.apage=1;draw()},
  csv:v=>{const d=new Date().toISOString().slice(0,10);if(v==='users'){const o=orders();dl(`foydalanuvchilar-${d}.csv`,[['ID','Ism','Telefon','Ro‘yxatdan o‘tgan','Oxirgi faollik','Kirishlar','Buyurtmalar','Sarflagan (so‘m)','Holat'],...KSAuth.all().map(u=>{const my=o.filter(x=>x.uid===u.id&&paid(x));return[u.id,u.name,KSAuth.fmtPhone(u.phone),dt(u.createdAt),dt(u.lastSeen),u.logins,my.length,my.reduce((a,x)=>a+x.total,0),u.blocked?'Bloklangan':'Faol']})])}
    else dl(`buyurtmalar-${d}.csv`,[['Kod','Vaqt','Mijoz','Telefon','Film','Zal','Seans','Joylar','To‘lov usuli','Karta','Tranzaksiya','Summa (so‘m)','Holat'],...aOrdersList().map(x=>[x.code,dt(x.ts),x.name,x.phone,(mov(x.mid)||{}).t,(CIN[x.ci]||{}).n,x.date+' '+x.time,x.seats.join(' '),(x.payment||{}).method||x.pay,(x.payment||{}).mask||'',(x.payment||{}).txn||'',x.total,paid(x)?'To‘langan':'Bekor qilingan'])]);toast('Fayl yuklab olindi')},
  addm:()=>{const t=$('#nt').value.trim();if(t.length<2)return $('#nerr').textContent='Nomini kiriting';const id='x'+Date.now(),h=hash(t)%360;
    S.extra.push({id,type:$('#ntype').value,t,lang:$('#nl').value,fmt:$('#nf').value,r:8.0,d:+$('#nd').value||100,g:[$('#ng').value],c:`hsl(${h} 55% 28%)`,ds:'Yangi qo‘shilgan namoyish.'});if(sv('extra',S.extra))toast('Qo‘shildi');draw()},
  delm:v=>{const m=mov(v);if(!m||!confirm(m.t+' katalogdan o‘chirilsinmi?'))return;S.extra=S.extra.filter(x=>x.id!==v);sv('extra',S.extra);draw()}
};
const FORMS={
  fin:async()=>{const r=await KSAuth.login($('#lphone').value,$('#lpass').value);if(!r.ok)return $('#lerr').textContent=r.error;S.user=r.user;toast('Xush kelibsiz, '+r.user.name);const ret=S.ret;S.ret=null;go(ret&&S.B?ret:'#/')},
  fup:async()=>{const r=await KSAuth.register($('#lname').value,$('#lphone').value,$('#lpass').value,$('#lpass2').value);if(!r.ok)return $('#lerr').textContent=r.error;S.user=r.user;toast('Hisob yaratildi. Xush kelibsiz, '+r.user.name);const ret=S.ret;S.ret=null;if(S.B){S.B.name=r.user.name;S.B.phone=KSAuth.fmtPhone(r.user.phone)}go(ret&&S.B?ret:'#/')},
  fadm:()=>{if($('#acode').value==='1234'){S.adm=true;sessionStorage.setItem('ks-adm','1');draw()}else $('#aerr').textContent='Kod noto‘g‘ri'}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&ACT[b.dataset.a])ACT[b.dataset.a](b.dataset.v)});
document.addEventListener('submit',e=>{const f=FORMS[e.target.id];if(f){e.preventDefault();f()}});
document.addEventListener('input',e=>{const i=e.target.id,B=S.B;
  if(i==='mq'){S.q=e.target.value;$('#grid').innerHTML=gridHTML(filtered())}
  else if(i==='aq'){S.aq=e.target.value;S.apage=1;$('#atable').innerHTML=atable()}
  else if(i==='name'&&B)B.name=e.target.value;else if(i==='phone'&&B)B.phone=e.target.value});
document.addEventListener('change',e=>{const i=e.target.id,v=e.target.value;
  if(i==='citySel'){S.city=+v;sv('city',S.city);draw()}
  else if(i==='af'){S.af=v;S.apage=1;$('#atable').innerHTML=atable()}
  else if(i==='genSel'){S.gen=v;draw()}else if(i==='langSel'){S.lang=v;draw()}});
if(localStorage.getItem('theme'))document.documentElement.dataset.theme=localStorage.getItem('theme');
route();
