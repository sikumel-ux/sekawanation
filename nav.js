/**
 * Logika Navigasi Otomatis
 * Menentukan menu mana yang aktif berdasarkan URL halaman saat ini.
 */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Ambil nama file dari URL (contoh: 'doku.html')
    const path = window.location.pathname.split("/").pop() || 'index.html';
    
    // 2. Mapping antara nama file dan ID button yang kamu buat di HTML
    const navMap = {
        'index.html': 'nav-index',
        'doku.html': 'nav-doku',
        'cakes.html': 'nav-cakes',
        'profile.html': 'nav-profile'
    };

    // 3. Reset semua tombol ke tampilan "tidak aktif" (abu-abu/transparan)
    const allButtons = document.querySelectorAll('.nav-item');
    allButtons.forEach(btn => {
        btn.classList.remove('bg-[#00B7B5]', 'text-[#005461]', 'rounded-full', 'shadow-lg');
        btn.classList.add('text-white/40');
    });

    // 4. Berikan style "Aktif" pada tombol yang sesuai dengan halaman saat ini
    const activeId = navMap[path];
    const activeBtn = document.getElementById(activeId);

    if (activeBtn) {
        activeBtn.classList.remove('text-white/40');
        activeBtn.classList.add('text-[#005461]', 'bg-[#00B7B5]', 'rounded-full', 'shadow-lg');
        
        // Atur warna teks (span) jika ada agar tetap terbaca gelap
        const span = activeBtn.querySelector('span');
        if (span) {
            span.classList.add('text-[#005461]');
            span.classList.remove('text-white/40');
        }
    }
});
