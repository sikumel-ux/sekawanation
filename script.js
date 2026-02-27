import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyD7rGI9iL0M889t6PR8za1-PxvjA_6jdHQ",
  authDomain: "websekawan.firebaseapp.com",
  projectId: "websekawan",
  databaseURL: "https://websekawan-default-rtdb.asia-southeast1.firebasedatabase.app/",
  appId: "1:407413490869:web:093f8a187261c68ea36afc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log("Service Worker Registered"));
}

// --- AUTH FUNCTIONS ---
window.handleAuth = () => {
    if(localStorage.getItem('userHp')) {
        if(confirm("Keluar dari akun?")) { 
            localStorage.clear(); 
            location.reload(); 
        }
    } else { 
        location.href = 'login.html'; 
    }
};

window.aksesPrivat = (h) => {
    if (localStorage.getItem('userHp')) {
        location.href = h;
    } else if (confirm("Login sebagai warga dulu, Bro!")) {
        location.href = 'login.html';
    }
};

// --- DATA LOADING ---
function initApp() {
    // Saldo Kas
    onValue(ref(db, 'keuangan'), s => {
        const d = s.val(); 
        if(d) {
            document.getElementById('val-kas').innerText = 'Rp ' + (parseInt(d.kas) || 0).toLocaleString('id-ID');
            document.getElementById('val-sosial').innerText = 'Rp ' + (parseInt(d.sosial) || 0).toLocaleString('id-ID');
        }
    });

    // Warta & Ticker
    onValue(ref(db, 'settings'), s => { 
        if(s.val()) document.getElementById('ticker-text').innerText = "✦ " + s.val().ticker; 
    });

    // Info Terakhir
    onValue(query(ref(db, 'content/info'), limitToLast(1)), s => {
        if(s.exists()){
            const d = Object.values(s.val())[0];
            document.getElementById('info-view').innerHTML = `
                <h4 class="text-[12px] font-black text-[#005461] uppercase mb-1">${d.judul}</h4>
                <p class="text-[11px] text-slate-500 leading-relaxed">${d.keterangan}</p>`;
        }
    });

    // Agenda
    onValue(query(ref(db, 'content/agenda'), limitToLast(1)), s => {
        if(s.exists()){
            const a = Object.values(s.val())[0];
            const tglParts = a.tgl.split(' ');
            document.getElementById('agenda-view').innerHTML = `
                <div class="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div class="bg-[#005461] text-[#00B7B5] p-3 rounded-2xl text-center min-w-[50px] font-black text-[14px] leading-tight">
                        ${tglParts[0]}<br><span class="text-[8px] text-white uppercase">${tglParts[1] || ''}</span>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black uppercase text-slate-800">${a.judul}</h4>
                        <p class="text-[9px] font-bold text-slate-400 mt-0.5">${a.jam} • ${a.lokasi || 'RT'}</p>
                    </div>
                </div>`;
        }
    });

    // Blog
    onValue(query(ref(db, 'content/blog'), limitToLast(5)), s => {
        const bL = document.getElementById('blog-list'); 
        bL.innerHTML = "";
        s.forEach(c => {
            const b = c.val();
            bL.innerHTML += `
                <div class="min-w-[260px] bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm">
                    <span class="text-[7px] font-black text-[#00B7B5] uppercase bg-[#00B7B5]/10 px-2 py-0.5 rounded-full">${b.kategori || 'Warga'}</span>
                    <h4 class="text-[11px] font-black text-[#005461] uppercase mt-2 line-clamp-1">${b.judul}</h4>
                    <p class="text-[10px] text-slate-500 mt-1 line-clamp-2">${b.isi}</p>
                </div>`;
        });
    });

    // Cuitan (Live Feed)
    onValue(query(ref(db, 'content/cuit'), limitToLast(3)), snapshot => {
        const feed = document.getElementById('index-feed'); 
        feed.innerHTML = "";
        let items = []; 
        snapshot.forEach(c => { items.push(c.val()); });
        items.reverse().forEach(data => {
            feed.innerHTML += `
                <div class="bg-white p-4 rounded-[2rem] border border-slate-50 shadow-sm cuit-border">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[8px] font-black text-[#00B7B5] bg-[#00B7B5]/10 px-2 py-0.5 rounded-full uppercase">${data.nama.split(' ')[0]}</span>
                        <span class="text-[7px] text-slate-300 font-bold uppercase">${data.tgl}</span>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium line-clamp-2">${data.teks}</p>
                </div>`;
        });
    });

    // Lapak
    onValue(ref(db, 'lapak'), s => {
        const list = document.getElementById('lapak-list'); 
        list.innerHTML = "";
        s.forEach(c => {
            const i = c.val();
            list.innerHTML += `
                <div class="min-w-[150px] bg-white p-4 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
                    <h4 class="text-[10px] font-black text-[#005461] uppercase truncate">${i.produk}</h4>
                    <p class="text-[11px] font-black text-[#00B7B5] mt-1">Rp ${parseInt(i.harga).toLocaleString('id-ID')}</p>
                    <a href="https://wa.me/${i.wa}" class="block bg-[#005461] text-white text-[8px] font-black py-2 rounded-full mt-3 uppercase tracking-widest">Beli</a>
                </div>`;
        });
    });
}

// --- API UI (Weather & Sholat) ---
async function getUI() {
    try {
        const now = new Date();
        const sh = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1501/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`);
        const sD = await sh.json(); 
        const j = sD.data.jadwal;
        const sl = [
            {n:'Subuh', t:j.subuh},
            {n:'Dzuhur', t:j.dzuhur},
            {n:'Ashar', t:j.ashar},
            {n:'Maghrib', t:j.maghrib},
            {n:'Isya', t:j.isya}
        ];
        document.getElementById('sholat-view').innerHTML = sl.map(x => `
            <div class="text-center flex-1 bg-white/10 py-2 rounded-2xl">
                <p class="text-[7px] font-black text-[#00B7B5] uppercase">${x.n}</p>
                <p class="text-[10px] text-white font-bold">${x.t}</p>
            </div>`).join('');
        
        const cu = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.84&longitude=110.36&current_weather=true');
        const cD = await cu.json(); 
        const t = Math.round(cD.current_weather.temperature);
        document.getElementById('temp').innerText = t + '°C';
        document.getElementById('weather-icon').innerHTML = t > 30 ? '<i class="fas fa-sun text-amber-400"></i>' : '<i class="fas fa-cloud-sun text-blue-400"></i>';
        document.getElementById('weather-desc').innerText = t > 30 ? 'Cerah' : 'Berawan';
    } catch(e) {
        console.error("Gagal memuat API UI", e);
    }
}

// --- INITIALIZATION ---
window.onload = () => {
    getUI(); 
    initApp();
    
    // Auth Status
    if(localStorage.getItem('userHp')) {
        document.getElementById('auth-btn').innerHTML = '<i class="fas fa-right-from-bracket text-red-400"></i>';
    }
    
    // Digital Clock
    setInterval(() => {
        const d = new Date();
        document.getElementById('jam').innerText = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
    }, 1000);
};
              
