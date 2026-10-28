# KinoShow: katta ma'lumotlar bilan yuklama testi

Sana: 2026-10-27. Brauzer: Chrome 151 (headless). Test skripti: `tests/load-test.js`.

Test haqiqiy seanslardan (`showsOf`) foydalanib buyurtmalar yaratadi: 16 ta zal, 7 kun, 1–4 joy, 4 xil to'lov usuli. Bitta joy ikki marta sotilmaydi.

## Saqlangan test ma'lumotlari

| Fayl | Nima bor |
|---|---|
| `data/orders-1000.json` | 1 000 ta buyurtma (250 KB) |
| `data/orders-10000.json` | 10 000 ta buyurtma (2.5 MB) |
| `data/results.json` | barcha o'lchovlarning to'liq natijasi |

Buyurtmalardagi sanalar test kunidan (27-oktabr) boshlab 7 kunga yaratilgan. Ma'lumotni brauzerga yuklash: Console'da `localStorage.setItem('orders', <fayl matni>)`, keyin sahifani yangilang. Yangi sanalar bilan qayta yaratish: `KSLoadTest.makeOrders(10000)`.

## Tezlik (millisekund)

| Amal | 0 | 1 000 | 10 000 | 10 000 + 500 film |
|---|---|---|---|---|
| Bosh sahifa | 0.5 | 0.5 | 0.4 | 0.4 |
| Filmlar ro'yxati | 0.5 | 0.5 | 0.3 | 4.3 |
| Zal sxemasi | – | 4.0 | 15.7 | 15.7 |
| Joyni bosish (tanlash + bekor) | – | 7.3 | 30.0 | 25.5 |
| Chipta sahifasi | – | 1.0 | 6.0 | 5.7 |
| Admin panel | 0.6 | 2.1 | 9.5 | 7.7 |
| "Chiptalarim" sahifasi | 0.3 | 18.4 | **187.9** | 175.8 |
| Haqiqiy xarid (to'lov tugmasi) | – | – | 29.8 | – |

10 000 buyurtmagacha sayt tez ishlaydi. "Chiptalarim" sahifasi sezilarli sekinlashadi (~0.2 soniya), chunki barcha buyurtmalar bir vaqtda chiziladi.

## To'g'rilik

| Tekshiruv | Natija |
|---|---|
| Sotilgan joyni qayta sotib olish | ✅ Bloklanadi. Joy sxemada o'chirilgan va tanlovdan olib tashlanadi |
| 1 000 / 10 000 buyurtma saqlanishi | ✅ To'liq saqlandi |
| Bitta joy ikki marta sotilgan holatlar | ✅ 0 ta |

## Topilgan muammolar

1. **❌ Ma'lumot jim yo'qoladi (eng jiddiy).** Brauzer xotirasi (localStorage, ~5 MB) taxminan **11 000 buyurtma**da to'ladi. 50 000 buyurtma testida saqlash muvaffaqiyatsiz bo'ldi, lekin hech qanday xato ko'rsatilmadi: `sv()` funksiyasi xatoni yutib yuboradi (`app.js`, 3-qator). Xotira to'lgandan keyin xaridor "Chipta tayyor" deb ko'radi-yu, chipta saqlanmaydi.
2. **❌ Chipta kodlari takrorlanadi.** Kod faqat 900 000 xil bo'lishi mumkin (`KS-100000`…`KS-999999`, 209-qator). 1 000 buyurtmada 1 ta, 10 000 buyurtmada **63 ta takroriy kod** chiqdi.
3. **❌ Bitta chiptani bekor qilish boshqa mijozning chiptasini ham o'chiradi.** Takroriy kodli chiptani bekor qilganda 2 ta buyurtma o'chdi (212-qator, kod bo'yicha filtr).
4. **⚠️ "Chiptalarim" sahifasi barcha buyurtmalarni chizadi.** 10 000 buyurtmada 188 ms ketadi. Sahifalarga bo'lish (masalan, 50 tadan) kerak.
5. **⚠️ Har bir harakatda butun buyurtmalar ro'yxati qayta o'qiladi.** `orders()` har chaqiruvda JSON.parse qiladi. Joyni bosish 10 000 buyurtmada 30 ms oladi.

## Tavsiya etilgan tuzatishlar

- `sv()` xato bo'lsa foydalanuvchiga xabar bersin. Xarid saqlanmasa, "Chipta tayyor" ko'rsatilmasin.
- Chipta kodi uzunroq va tasodifiy bo'lsin (masalan, 8 belgi `crypto.getRandomValues` bilan). Yaratishda kod mavjudligi tekshirilsin.
- Bekor qilish faqat bitta buyurtmani o'chirsin.
- "Chiptalarim" va admin jadvali sahifalarga bo'linsin.
- Buyurtmalar xotirada keshlansin, faqat o'zgarganda qayta o'qilsin.
