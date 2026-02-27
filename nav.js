// Simpan kode ini di file nav.js
document.addEventListener("DOMContentLoaded", function() {
    // 1. Deteksi halaman saat ini
    const path = window.location.pathname.split("/").pop() || 'index.html';
    
    // 2. Daftar ID tombol sesuai halaman
    const navMap = {
        'index.html': 'nav-index',
        'cuitan.html': 'nav-cuitan',
        'doku.html': 'nav-doku',
        'cakes.html': 'nav-cakes'
    };

    const activeId = navMap[path];

    // 3. Atur tampilan semua tombol navigasi
    const allButtons = document.querySelectorAll('.nav-item');
    
    allButtons.forEach(btn => {
        if (btn.id === activeId) {
            // TAMPILAN JIKA AKTIF: Hijau Toska Terang + Icon Gelap
            btn.classList.remove('text-white/40');
            btn.classList.add('text-[#005461]', 'bg-[#00B7B5]', 'rounded-full', 'shadow-lg', 'scale-110');
            
            // Jika ada teks (span) di bawah icon, buat jadi gelap biar kebaca
            const span = btn.querySelector('span');
            if (span) {
                span.classList.add('text-[#005461]');
                span.classList.remove('text-white/40');
            }
        } else {
            // TAMPILAN JIKA TIDAK AKTIF: Redup/Transparan
            btn.classList.add('text-white/40');
            btn.classList.remove('text-[#005461]', 'bg-[#00B7B5]', 'rounded-full', 'shadow-lg', 'scale-110');
            
            const span = btn.querySelector('span');
            if (span) {
                span.classList.add('text-white/40');
                span.classList.remove('text-[#005461]');
            }
        }
    });
});
