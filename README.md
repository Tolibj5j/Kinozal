# KinoShow — O‘zbekiston kinozallari va shoulari

Kino va shoularga onlayn chipta band qilish platformasi (demo loyiha).
Toza HTML, CSS va JavaScript bilan yozilgan, hech qanday framework yoki server kerak emas.

## Imkoniyatlari
- 10 ta shahar/viloyat va 16 ta kinozal
- 10 ta film va 6 ta shou (konsert, stand-up, balet, KVN va boshqalar)
- Zal sxemasidan joy tanlash, bo‘sh va band joylarni ko‘rsatish
- Yonma-yon N ta joyni avtomatik tanlash
- Taom va ichimliklarni oldindan buyurtma qilish
- Promokodlar: `KINOBIRINCHI`, `TALABA`, `POPKORN`, `SHOUKECHA`
- To‘lov usullari (demo): Payme, Click, Uzcard, Humo
- Chipta kodi va QR belgisi, chop etish
- Chiptalarim bo‘limi va bekor qilish
- Admin panel (demo kod: `1234`): tushum, diagramma, yangi film/shou qo‘shish
- Yorug‘ va qorong‘i rejim, telefonga moslashgan dizayn

## Ishga tushirish
`index.html` faylini brauzerda oching. Boshqa hech narsa o‘rnatish shart emas.

## Loyiha tuzilmasi
```
kinoshow-uz/
├── index.html
├── css/style.css
├── js/app.js
└── README.md
```

## Eslatma
Ma’lumotlar (buyurtmalar, band joylar) faqat foydalanuvchi brauzerining `localStorage` xotirasida saqlanadi.
Kinozallar, seanslar va to‘lov namunaviy. Real loyiha uchun server va baza kerak.
