// Mengimpor library Firebase langsung dari server Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Konfigurasi Asli LytoosPay Anda
const firebaseConfig = {
  apiKey: "AIzaSyD5OAu-ytGL26g1iHrBfNqY8mm2zB2Sphg",
  authDomain: "lytoospay-66a22.firebaseapp.com",
  projectId: "lytoospay-66a22",
  storageBucket: "lytoospay-66a22.firebasestorage.app",
  messagingSenderId: "143149599518",
  appId: "1:143149599518:web:828b8dcf8a1a77cd75970f"
};

// URL Brankas Rahasia Apps Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbyawrjcfIRfr2Ch4WBIwhx2E-iUwG_Z3lcG79mjv574boopSURi_WgMsR3D26uYCZEY/exec";

// Menyalakan Mesin Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menghilangkan Splash Screen dengan mulus
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.display = 'none'; }, 600);
        
        // Mulai ambil data dari Firebase setelah aplikasi terbuka
        loadProdukDariFirebase();
    }, 1500);
});

// Fungsi mengambil data produk dari Koleksi 'produk' di Firebase
async function loadProdukDariFirebase() {
    const listContainer = document.getElementById("listProduk");
    
    try {
        const querySnapshot = await getDocs(collection(db, "produk"));
        
        if (querySnapshot.empty) {
            listContainer.innerHTML = `<p style="text-align:center; color:#e74c3c; font-size:14px; padding:20px; background:#fdf3f2; border-radius:12px;">Database Firebase masih kosong. Silakan tambahkan produk di dashboard Firebase Anda.</p>`;
            return;
        }

        listContainer.innerHTML = ""; // Bersihkan tulisan loading
        
        // Cetak semua produk yang ditemukan ke layar
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            listContainer.innerHTML += `
            <div class="product-card">
                <div class="prod-detail">
                    <h4>${data.namaProduk}</h4>
                    <p>${data.provider} | SKU: ${data.sku}</p>
                    <button class="btn-buy" onclick="beliProduk('${data.sku}', '${data.namaProduk}')">Beli Sekarang</button>
                </div>
                <div class="prod-price">
                    Rp ${Number(data.hargaJual).toLocaleString('id-ID')}
                </div>
            </div>
            `;
        });
        
    } catch (error) {
        console.error("Gagal terhubung ke Firebase:", error);
        listContainer.innerHTML = `<p style="text-align:center; color:#e74c3c;">Terjadi kesalahan saat menghubungi server nasional.</p>`;
    }
}

// ==========================================
// MESIN TRANSAKSI (MENEMBAK DIGIFLAZZ)
// ==========================================
window.beliProduk = async function(sku, namaProduk) {
    // 1. Minta nomor HP ke pembeli
    const tujuan = prompt(`Masukkan Nomor HP Tujuan untuk pembelian:\n${namaProduk}`);
    
    // Jika pembeli klik batal atau tidak mengisi
    if (!tujuan) {
        return; 
    }

    // 2. Beri tahu pembeli bahwa sistem sedang bekerja
    alert("Sedang memproses transaksi ke server... Mohon tunggu sebentar.");

    // 3. Tembak data ke Google Apps Script
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                tujuan: tujuan,
                sku: sku
            })
        });

        const hasil = await response.json();
        
        // 4. Tampilkan balasan dari Digiflazz ke layar HP Pembeli
        if (hasil && hasil.data) {
            // Ini akan memunculkan balasan asli dari Digiflazz (contoh: "Saldo Tidak Cukup")
            alert(`Status Transaksi:\n${hasil.data.message}`);
        } else {
            alert(`Pesan Sistem:\n${JSON.stringify(hasil)}`);
        }
        
    } catch (error) {
        console.error("Error Transaksi:", error);
        alert("Terjadi kesalahan jaringan. Gagal menghubungi Brankas Server.");
    }
}
