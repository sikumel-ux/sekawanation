import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, query, orderByChild, equalTo, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7rGI9iL0M889t6PR8za1-PxvjA_6jdHQ",
    authDomain: "websekawan.firebaseapp.com",
    projectId: "websekawan",
    databaseURL: "https://websekawan-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:407413490869:web:093f8a187261c68ea36afc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const uHp = localStorage.getItem('userHp');
let editKey = null;

// Proteksi Login
if(!uHp) { location.href = 'login.html'; }

// Fungsi Batal Edit
window.cancelEdit = () => {
    editKey = null;
    document.getElementById('judul-note').value = "";
    document.getElementById('isi-note').value = "";
    document.getElementById('edit-indicator').classList.add('hidden');
    document.getElementById('btn-save-note').innerHTML = 'SIMPAN CATATAN <i class="fas fa-cookie-bite ml-2"></i>';
};

// Fungsi Simpan atau Update
document.getElementById('btn-save-note').onclick = async () => {
    const judul = document.getElementById('judul-note').value;
    const isi = document.getElementById('isi-note').value;
    
    if(!judul || !isi) return alert("Woy, isi dulu dong judul & catatannya!");

    const btn = document.getElementById('btn-save-note');
    btn.disabled = true;
    btn.innerText = "PROSES...";

    try {
        if(editKey) {
            await update(ref(db, `cakes_personal/${editKey}`), {
                judul: judul,
                isi: isi,
                last_edit: true
            });
            alert("Berhasil diperbarui!");
            window.cancelEdit();
        } else {
            await set(push(ref(db, 'cakes_personal')), {
                hp: uHp,
                judul: judul,
                isi: isi,
                tgl: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                timestamp: Date.now()
            });
        }
        document.getElementById('judul-note').value = "";
        document.getElementById('isi-note').value = "";
    } catch (e) {
        alert("Waduh, gagal simpan!");
    } finally {
        btn.disabled = false;
        if(!editKey) btn.innerHTML = 'SIMPAN CATATAN <i class="fas fa-cookie-bite ml-2"></i>';
    }
};

// Fungsi Masuk Mode Edit
window.prepareEdit = (key, judul, isi) => {
    editKey = key;
    document.getElementById('judul-note').value = judul;
    document.getElementById('isi-note').value = isi;
    document.getElementById('edit-indicator').classList.remove('hidden');
    document.getElementById('btn-save-note').innerHTML = 'UPDATE CATATAN <i class="fas fa-check-circle ml-2"></i>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fungsi Hapus
window.hapusNote = (key) => {
    if(confirm("Yakin mau hapus catatan ini?")) {
        if(editKey === key) window.cancelEdit();
        remove(ref(db, `cakes_personal/${key}`));
    }
};

// Monitor Data secara Real-time
onValue(query(ref(db, 'cakes_personal'), orderByChild('hp'), equalTo(uHp)), (snapshot) => {
    const container = document.getElementById('cakes-container');
    const countView = document.getElementById('note-count');
    container.innerHTML = "";
    
    if(!snapshot.exists()) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-[2.5rem] text-center border border-slate-50 shadow-sm">
                <i class="fas fa-feather-pointed text-slate-100 text-4xl mb-4 block"></i>
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum ada koleksi Cakes</p>
            </div>`;
        countView.innerText = "0";
        return;
    }

    let notes = [];
    snapshot.forEach(c => { notes.push({ key: c.key, ...c.val() }); });
    countView.innerText = notes.length;

    notes.reverse().forEach(item => {
        const safeJudul = item.judul.replace(/'/g, "\\'");
        const safeIsi = item.isi.replace(/'/g, "\\'").replace(/\n/g, "\\n");

        container.innerHTML += `
            <div class="bg-white p-6 rounded-[2.5rem] shadow-md border border-slate-50 cake-card fade-up">
                <div class="flex justify-between items-start mb-4">
                    <h4 class="text-[12px] font-black text-[#005461] uppercase leading-tight pr-4">${item.judul}</h4>
                    <div class="flex gap-4">
                        <button onclick="prepareEdit('${item.key}', '${safeJudul}', '${safeIsi}')" class="text-[#00B7B5] active:scale-90 transition-all">
                            <i class="fas fa-pen-to-square text-xs"></i>
                        </button>
                        <button onclick="hapusNote('${item.key}')" class="text-rose-200 active:text-rose-500 transition-colors">
                            <i class="fas fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
                <p class="note-text text-justify text-slate-600 font-medium whitespace-pre-wrap">${item.isi}</p>
                <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                    <span class="text-[8px] font-black text-[#00B7B5] bg-[#00B7B5]/10 px-2 py-1 rounded-lg uppercase tracking-[0.2em]">
                        ${item.tgl} ${item.last_edit ? '(Edit)' : ''}
                    </span>
                    <i class="fas fa-cookie text-amber-200 opacity-50"></i>
                </div>
            </div>`;
    });
}, (err) => {
    console.error("Firebase Error:", err);
    document.getElementById('cakes-container').innerHTML = "Gagal memuat data.";
});
