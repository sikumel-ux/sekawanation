import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, query, limitToLast, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7rGI9iL0M889t6PR8za1-PxvjA_6jdHQ",
    authDomain: "websekawan.firebaseapp.com",
    projectId: "websekawan",
    databaseURL: "https://websekawan-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:407413490869:web:093f8a187261c68ea36afc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Masukkan fungsi ke window agar bisa dipanggil dari HTML
window.reaksiCuit = (key, tipe) => {
    runTransaction(ref(db, `content/cuit/${key}/${tipe}`), (val) => (val || 0) + 1);
};

// Load Feed Cuitan
onValue(query(ref(db, 'content/cuit'), limitToLast(50)), (snapshot) => {
    onValue(ref(db, 'users'), (userSnapshot) => {
        const allUsers = userSnapshot.val() || {};
        const container = document.getElementById('full-feed');
        container.innerHTML = "";
        
        let posts = [];
        snapshot.forEach(c => { posts.push({ id: c.key, ...c.val() }); });
        
        posts.reverse().forEach(data => {
            const userData = allUsers[data.hp] || {};
            const avatar = userData.foto 
                ? `<img src="${userData.foto}" class="user-pic">` 
                : `<div class="user-pic bg-[#005461] flex items-center justify-center text-[11px] font-black text-[#00B7B5] uppercase">${data.nama.charAt(0)}</div>`;
            const jmlKomentar = data.komentar ? Object.keys(data.komentar).length : 0;

            container.innerHTML += `
                <div class="bg-white p-5 rounded-[2.5rem] shadow-md border border-slate-50 cuit-card fade-in">
                    <div class="flex items-center gap-4 mb-4">
                        ${avatar}
                        <div>
                            <h4 class="text-[12px] font-black text-[#005461] uppercase leading-none">${data.nama}</h4>
                            <p class="text-[8px] font-bold text-slate-300 uppercase mt-1">${data.tgl}</p>
                        </div>
                    </div>
                    <p class="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">${data.teks}</p>
                    <div class="flex items-center gap-4 pt-4 border-t border-slate-50">
                        <button onclick="reaksiCuit('${data.id}', 'up')" class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#00B7B5]"><i class="fas fa-thumbs-up text-[10px]"></i></div>
                            <span class="text-[11px] font-black text-[#005461]">${data.up || 0}</span>
                        </button>
                        <button onclick="reaksiCuit('${data.id}', 'lol')" class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><i class="fas fa-face-laugh-squint text-[10px]"></i></div>
                            <span class="text-[11px] font-black text-[#005461]">${data.lol || 0}</span>
                        </button>
                        <button onclick="location.href='cuit_detail.html?id=${data.id}'" class="flex items-center gap-2 ml-auto bg-slate-50 px-4 py-2 rounded-full active:scale-95 transition-all">
                            <i class="fas fa-comment-dots text-[#005461] text-xs"></i>
                            <span class="text-[10px] font-black text-[#005461] uppercase">${jmlKomentar}</span>
                        </button>
                    </div>
                </div>`;
        });
    }, { onlyOnce: true });
});
                      
