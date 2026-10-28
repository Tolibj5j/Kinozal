# KinoShow — O‘zbekiston kinozallari va shoulari

Kino va shoularga onlayn chipta band qilish platformasi (demo loyiha).
Toza HTML, CSS va JavaScript bilan yozilgan, framework yoki server kerak emas.

Sayt: https://tolibj5j.github.io/Kinozal/

## Imkoniyatlari
- 14 ta shahar, 21 ta kinozal, 16 ta film va 9 ta shou (poster, yosh chegarasi, rejissyor, rollarda)
- Zal sxemasidan joy tanlash, bo‘sh va band joylarni ko‘rsatish
- **Zalning 3D ko‘rinishi**: o‘rindiq yoki sektor tanlanganda kamera shu joyga animatsiya bilan suriladi va ekran qanday rakursdan ko‘rinishini ko‘rsatadi (masofa, ko‘rish burchagi, baho)
- Sektorlar: old qatorlar, markaz, chap, o‘ng, VIP. Yonma-yon N ta joyni sektor ichida avtomatik tanlash
- Taom va ichimliklarni oldindan buyurtma qilish, promokodlar: `KINOBIRINCHI`, `TALABA`, `POPKORN`, `SHOUKECHA`
- **To‘lov (demo, haqiqiyga o‘xshash)**: Payme, Click, Uzcard, Humo, Visa/Mastercard
  - karta raqami Luhn algoritmi bilan tekshiriladi, karta turi raqamdan aniqlanadi
  - SMS tasdiqlash kodi (3-D Secure), 60 soniya taymer, 3 ta urinish
  - to‘lov cheki: tranzaksiya ID, RRN, avtorizatsiya kodi
- Chipta: skanerlanadigan QR kod, chop etish, bekor qilish (pul qaytarish)
- Foydalanuvchilar: ro‘yxatdan o‘tish va kirish (telefon + parol, parol SHA-256 xesh bilan saqlanadi)
- Admin panel (demo kod: `1234`): statistika, ro‘yxatdan o‘tgan foydalanuvchilar, bloklash, buyurtmalar, filtr va qidiruv, Excel (CSV) eksport, film qo‘shish/o‘chirish

## Test kartalar
| Karta | Natija |
|---|---|
| Uzcard `8600 4901 2345 6782` | muvaffaqiyatli |
| Uzcard `8600 0000 0000 0007` | mablag‘ yetmaydi |
| Humo `9860 0123 4567 8903` | muvaffaqiyatli |
| Humo `9860 0000 0000 0000` | karta bloklangan |
| Visa `4111 1111 1111 1111` | muvaffaqiyatli |
| Mastercard `5555 4444 3333 2226` | muvaffaqiyatli |

Muddat: istalgan kelajakdagi sana (masalan 12/29). SMS kod ekranning tepasida xabar sifatida chiqadi.

## Muhim
Ma’lumotlar (foydalanuvchilar, buyurtmalar) brauzerning localStorage xotirasida saqlanadi. Admin panel faqat shu brauzerda ro‘yxatdan o‘tganlarni ko‘radi. Turli qurilmalardagi foydalanuvchilarni bitta joyda ko‘rish uchun server yoki ma’lumotlar bazasi (masalan Firebase, Supabase) ulash kerak.

## Testlar
- `tests/e2e.js` — barcha bo‘limlarni tekshiruvchi Playwright testi (40 ta tekshiruv)
- `tests/load-test.js` — katta ma’lumotlar bilan yuklama testi, natijalar `tests/TEST-NATIJALARI.md`

## Ishga tushirish
`index.html` faylini brauzerda oching yoki GitHub Pages manzilidan foydalaning.
