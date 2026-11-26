# Dana Rumah — Anggaran Rumah Tangga

![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/kai0x3/best-household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/kai0x3/best-household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

Entry for the [Make the best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457) bounty on make.fun.

**Dana Rumah** adalah situs anggaran rumah tangga berbahasa Indonesia (Rupiah) untuk satu keluarga — dasbor, transaksi, anggaran, tagihan, tujuan menabung, dan laporan — semuanya berfungsi dan tersimpan di peramban.

## Yang ada di situs

- **Dasbor** — ringkasan November 2026: pemasukan Rp 12.500.000, pengeluaran Rp 5.816.500, sisa Rp 6.683.500, tingkat tabungan 53%; diagram donat pengeluaran per kategori, transaksi terakhir, tagihan berikutnya, dan peringatan anggaran.
- **Transaksi** — 30 transaksi nyata (Pasar Minggu, Indomaret, PLN, SPP Sekolah, dll.); tambah transaksi lewat formulir, saring per kategori, cari, dan hapus per baris. Semua perubahan tersimpan dan total di dasbor ikut berubah.
- **Anggaran** — anggaran bulanan per kategori dengan bilah kemajuan dan label aman / hampir habis / melebihi; angka anggaran bisa diubah dan disimpan.
- **Tagihan** — 8 tagihan rutin (PLN, PDAM, IndiHome, BPJS, SPP, cicilan motor, dll.) dengan tanggal jatuh tempo; tombol "Tandai Lunas" yang tersimpan, plus ringkasan tagihan belum dibayar.
- **Tujuan Menabung** — Dana Darurat Rp 20 jt, Liburan Keluarga Rp 8 jt, DP Motor Rp 15 jt; tambah setoran dan bilah kemajuan langsung bergerak.
- **Laporan** — grafik batang pemasukan vs pengeluaran 6 bulan (Juni–November 2026), rincian per kategori, 5 pengeluaran terbesar, tombol unduh laporan CSV, dan tips hemat praktis.

## Menjalankan

Situs ini file statis tanpa build step dan tanpa permintaan jaringan:

```sh
node serve.ts        # atau server statis apa pun dengan app/ sebagai root
```

Lalu buka http://localhost:8080. Semua data tersimpan di `localStorage` peramban; tidak ada data yang dikirim ke mana pun.

## Struktur

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — tampilan (hijau tua + krem + amber)
- `app/data.js` — data awal dan penyimpanan (localStorage)
- `app/charts.js` — grafik donat dan batang di canvas
- `app/views.js` — tampilan tiap halaman
- `app/main.js` — routing hash dan pengait kontrol
- `main.ts` — program penyerahan (menyalin `app/` dan `screenshots/`, menulis `dossier.json`)
- `screenshots/` — tangkapan layar situs yang sedang berjalan
- `vendor/makefun-frontend.ts` — pustaka make.fun dari kit, tanpa perubahan

## Lisensi

MIT — lihat `LICENSE`.
