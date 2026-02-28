document.addEventListener("DOMContentLoaded", function() {
    // 1. Deteksi halaman saat ini
    const path = window.location.pathname.split("/").pop() || 'index.html';
    
    // 2. Daftar ID tombol sesuai halaman
    const navMap = {
        'index.html': 'nav-index',
        'cuitan.html': 'nav-cuitan',
        'doku.html': 'nav-doku',
        'cakes.html': 'nav-cakes',
        'profile.html': 'nav-profile'
    };

    const activeId = navMap[path];

    // 3. Atur tampilan semua tombol navigasi
    const allButtons = document.querySelectorAll('.nav-item');
    
    allButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');

        if (btn.id === activeId) {
            // TAMPILAN AKTIF: Berwarna Hijau Toska + Sedikit Membesar
            btn.classList.remove('text-white/40');
            btn.classList.add('text-[#00B7B5]', 'scale-110', 'transition-all', 'duration-300');
            
            // Pastikan icon dan teks ikut terang
            if (icon) icon.classList.replace('text-white/40', 'text-[#00B7B5]');
            if (span) {
                span.classList.remove('text-white/40');
                span.classList.add('text-[#00B7B5]', 'font-black');
            }
        } else {
            // TAMPILAN TIDAK AKTIF: Redup (Putih Transparan)
            btn.classList.add('text-white/40');
            btn.classList.remove('text-[#00B7B5]', 'scale-110', 'font-black');
            
            if (icon) icon.classList.add('text-white/40');
            if (span) {
                span.classList.add('text-white/40');
                span.classList.remove('text-[#00B7B5]', 'font-black');
            }
        }
    });
});
