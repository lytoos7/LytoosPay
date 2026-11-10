# LytoosPay

Aplikasi web PPOB (pulsa, paket data, token PLN, e-wallet, tagihan, voucher game, dll.)
berbasis satu file `index.html` — tanpa proses build, siap tayang di GitHub Pages.

**Live:** https://lytoos7.github.io/LytoosPay/

## Cara kerja singkat

1. **Login** — Firebase Authentication (Google, Facebook, dan nomor HP/OTP).
   Pengguna yang belum login diarahkan ke halaman masuk.
2. **Katalog produk** — Firestore, koleksi `products`. Dokumen produk berisi:
   `sku`, `nama_produk`, `provider`, `kategori`, `harga`.
   Daftar nominal dimuat per provider lalu disaring per kategori di sisi klien
   (disengaja, agar tidak membutuhkan composite index Firestore).
3. **Transaksi** — saat produk dipilih, aplikasi mengirim `{ sku, tujuan }` (POST JSON)
   ke jembatan Google Apps Script, yang meneruskannya ke provider (Digiflazz).
   Status asli dari provider yang menentukan hasil: `Sukses` → struk BERHASIL dengan
   SN asli, `Pending` → struk PENDING, `Gagal` → pemberitahuan gagal (tidak ada struk sukses).
4. **Saldo** — dibaca langsung dari Firestore dokumen `users/{uid}` field `saldo`
   (bila dokumen/field belum ada, tampilan tetap Rp 0).
5. **Riwayat** — tersimpan di perangkat pengguna (localStorage, maks. 100 transaksi
   terakhir) dan dapat dibuka kembali menjadi struk. Tab **Transaksi** menampilkan
   yang masih berstatus PENDING.

## Struktur repo

- `index.html` — seluruh aplikasi (tampilan, gaya, dan logika).
- `logo/`, `icon/` — aset gambar operator & menu.
- `banner1.png` s.d. `banner3.png` — banner promosi di beranda (tampil bergiliran).

> Catatan: `script.js` versi lama (Firebase v10 modular, memuat koleksi `produk`)
> sudah dihapus pada 2026-11-10 karena tidak pernah dimuat oleh `index.html` dan
> skemanya bentrok dengan logika aktif di `index.html` (Firebase v8, koleksi `products`).

## Menjalankan lokal

Cukup sajikan folder ini sebagai file statis, misalnya:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Konfigurasi

Konfigurasi Firebase web (`lytoospay-66a22`) dan URL jembatan Apps Script berada di
bagian bawah `index.html`. Kunci API web Firebase memang kunci publik untuk klien;
perlindungan data diatur lewat Firebase Security Rules & Authentication, jadi pastikan
rules Firestore hanya mengizinkan pengguna yang sudah login.
