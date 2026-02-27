const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";
const userHp = localStorage.getItem('userHp');
const userNama = localStorage.getItem('userSekawan');

// Proteksi Halaman
if (!userHp) {
    alert("Harap login dulu!");
    location.href = 'login.html';
}

/**
 * Mengatur tipe transaksi (Masuk/Keluar) dan perubahan UI tombol
 */
window.setType = function(type) {
    document.getElementById('transType').value = type;
    const bM = document.getElementById('btn-masuk');
    const bK = document.getElementById('btn-keluar');
    
    if(type === 'masuk') {
        bM.className = "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-[#005461] btn-income";
        bK.className = "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-transparent bg-slate-100 text-slate-400";
    } else {
        bK.className = "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-red-500 btn-expense";
        bM.className = "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-transparent bg-slate-100 text-slate-400";
    }
};

/**
 * Handle submit form ke Apps Script
 */
document.getElementById('dokuForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    
    const data = {
        action: 'tambahDoku',
        hp: userHp,
        nama: userNama,
        jenis: document.getElementById('transType').value,
        nominal: document.getElementById('nominal').value,
        keterangan: document.getElementById('catatan').value,
        tanggal: new Date().toISOString()
    };

    btn.innerText = "MENYIMPAN...";
    btn.disabled = true;

    try {
        // Karena Apps Script sering terkendala CORS, 
        // pastikan Apps Script-mu mengembalikan ContentService yang benar.
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // Pakai no-cors jika hanya kirim data tanpa butuh response detail
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });
        
        alert("Mantap! Catatan berhasil masuk ke Doku.");
        document.getElementById('dokuForm').reset();
        // Reset type ke masuk
        setType('masuk');
    } catch (err) {
        alert("Waduh, koneksi ke API bermasalah!");
        console.error(err);
    } finally {
        btn.innerText = "SIMPAN KE DOKU";
        btn.disabled = false;
    }
};
                      
