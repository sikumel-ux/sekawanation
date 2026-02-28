// Simpan sebagai nav.js
document.addEventListener("DOMContentLoaded", function() {
    // 1. Deteksi file yang sedang dibuka
    const path = window.location.pathname.split("/").pop() || 'index.html';
    
    // 2. Pemetaan File ke ID Tombol
    const navMap = {
        'index.html': 'nav-index',
        'cuitan.html': 'nav-cuitan',
        'doku.html': 'nav-doku',
        'cakes.html': 'nav-cakes',
        'profile.html': 'nav-profile'
    };

    const activeId = navMap[path];

    // 3. Update Visual Navigasi
    const allButtons = document.querySelectorAll('.nav-item');
    
    allButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');

        if (btn.id === activeId) {
            // JIKA AKTIF: Warna Hijau Toska Terang
            btn.classList.remove('text-white/40');
            btn.classList.add('text-[#00B7B5]', 'scale-110', 'transition-all');
            
            if (icon) icon.classList.replace('text-white/40', 'text-[#00B7B5]');
            if (span) {
                span.classList.remove('text-white/40');
                span.classList.add('text-[#00B7B5]', 'font-black');
            }
        } else {
            // JIKA TIDAK AKTIF: Redup
            btn.classList.add('text-white/40');
            btn.classList.remove('text-[#00B7B5]', 'scale-110');
            
            if (icon) icon.classList.add('text-white/40');
            if (span) {
                span.classList.add('text-white/40');
                span.classList.remove('text-[#00B7B5]', 'font-black');
            }
        }
    });
});
