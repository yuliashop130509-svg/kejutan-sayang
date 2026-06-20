/* =========================================================
   SCRIPT.JS — Logika SPA (Single Page App)
   Semua "halaman" sebenarnya satu dokumen HTML, hanya section
   yang ditampilkan/disembunyikan via JS. Dengan begitu, dokumen
   TIDAK PERNAH reload saat pindah menu, sehingga audio latar
   ikut tidak pernah berhenti / putus sama sekali.
   ========================================================= */

/* =========================================================
   ⚙️ KONFIGURASI UTAMA — UBAH DI SINI SAJA
   ========================================================= */
const CONFIG = {
  namaPacar: "Sayang",                 // <-- Ganti dengan nama pacar Anda
  tanggalJadian: "2023-10-05T00:00:00", // <-- Ganti format: "YYYY-MM-DDTHH:MM:SS"
  pesanCinta: `for special people
sejak bertemu denganmu aku baru tahu bagaimana rasanya dirayakan oleh seseorang 
tidak lebih ataupun kurang caramu mencintaiku selalu berhasil membuatku merasa begitu 
sangat disayang mungkin kalimat terima kasih saja belum cukup untuk menjelaskan betapa beruntungnya aku
 memilikimu dan hidupku aku bukan hanya diterima apa adanya tapi juga diperlakukan sebaik-baiknya aku tahu
  kalau tulisan ini tidak akan pernah sanggup menjelaskan betapa aku mencintaimu bahkan ketika aku hidup sekali lagi 
  aku akan tetap memilihmu sebagai seseorang yang aku cintai kamu terlalu istimewa untuk sekedar disebut manusia biasa
   lalu bagaimana mungkin aku bisa tidak jatuh cinta? kamu punya daya tarik yang memikat Kamu adalah definisi dari kecukupan 
   yang aku maksudkan kamu bukan hanya sekedar seseorang yang aku inginkan tapi juga menjadi seseorang yang aku butuhkan
    terimakasih sudah menjadi tujuan ketika aku hampir lupa jalan pulang terimakasih sudah menjadi bintang di langitku yang penuh kegelapan
     sejak bertemu dengan mu aku jadi layak belajar bagaimana caranya berdamai dengan kegagalan di masalalu aku jadi percaya bahwa sesuatu yang hilang
      akan di gantikan dengan sesuatu yang jauh lebih baik lagi soo terimakasih telah hadir di hidup ku sampai detik ini aku sangat mencintaimu 🤍. 
      SAYANG I LOVE U MOREE💖`
};

const HALAMAN_VALID = ['beranda', 'kenangan', 'surat', 'kejutan'];

/* ===== Hati melayang di background ===== */
function buatFloatingHearts() {
  const wrapper = document.querySelector('.floating-hearts');
  if (!wrapper) return;
  const simbol = ['💗', '💖', '💕', '💞', '❤️'];
  setInterval(() => {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = simbol[Math.floor(Math.random() * simbol.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (14 + Math.random() * 18) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    wrapper.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
  }, 600);
}

/* ===== Hitung Mundur Waktu Kebersamaan (halaman beranda) ===== */
function jalankanCountdown() {
  const elHari = document.getElementById('cd-hari');
  const elJam = document.getElementById('cd-jam');
  const elMenit = document.getElementById('cd-menit');
  const elDetik = document.getElementById('cd-detik');
  const elNama = document.getElementById('nama-pacar');
  if (!elHari) return;

  if (elNama) elNama.textContent = CONFIG.namaPacar;

  const mulai = new Date(CONFIG.tanggalJadian).getTime();

  function update() {
    const sekarang = new Date().getTime();
    let selisih = sekarang - mulai;
    if (selisih < 0) selisih = 0;

    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);

    elHari.textContent = hari;
    elJam.textContent = String(jam).padStart(2, '0');
    elMenit.textContent = String(menit).padStart(2, '0');
    elDetik.textContent = String(detik).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===== Popup kejutan kecil saat klik tombol (halaman beranda) ===== */
function setupPopupKejutan() {
  const btn = document.getElementById('btn-mulai');
  const overlay = document.getElementById('popup-overlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('active');
    buatConfettiKecil();
  });

  const closeBtn = document.getElementById('popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      navigasiKe('kenangan');
    });
  }
}

/* ===== Confetti kecil sederhana untuk popup ===== */
function buatConfettiKecil() {
  const warna = ['#ffb3d1', '#d9b8ff', '#ffd27f', '#ff8fb3'];
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.top = '-10px';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.width = '8px';
    conf.style.height = '8px';
    conf.style.background = warna[Math.floor(Math.random() * warna.length)];
    conf.style.borderRadius = '50%';
    conf.style.zIndex = 2000;
    conf.style.transition = 'transform 2.5s ease-in, opacity 2.5s';
    document.body.appendChild(conf);
    requestAnimationFrame(() => {
      conf.style.transform = `translateY(${60 + Math.random() * 40}vh) rotate(${Math.random()*360}deg)`;
      conf.style.opacity = '0';
    });
    setTimeout(() => conf.remove(), 2600);
  }
}

/* ===== Lightbox Galeri Foto (halaman kenangan) ===== */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  if (!lightbox) return;

  // Pakai delegasi event supaya tetap berfungsi meski section disembunyikan/ditampilkan ulang
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.photo-card');
    if (card) {
      const img = card.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  }
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

/* ===== Efek Ketikan Mesin Tik (halaman surat) ===== */
let timerKetik = null;
function jalankanTypewriter() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  if (timerKetik) clearTimeout(timerKetik);

  const teks = CONFIG.pesanCinta;
  let index = 0;
  target.textContent = '';
  const tombolLanjut = document.getElementById('btn-lanjut');
  if (tombolLanjut) tombolLanjut.style.display = 'none';

  function ketik() {
    if (index < teks.length) {
      target.textContent += teks.charAt(index);
      index++;
      const jeda = teks.charAt(index - 1) === '\n' ? 250 : 35 + Math.random() * 35;
      timerKetik = setTimeout(ketik, jeda);
    } else {
      if (tombolLanjut) tombolLanjut.style.display = 'inline-block';
    }
  }

  timerKetik = setTimeout(ketik, 600);
}

/* ===== Kembang Api Canvas (halaman kejutan) ===== */
let kembangApiSudahJalan = false;
function jalankanKembangApi() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas || kembangApiSudahJalan) return;
  kembangApiSudahJalan = true;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const partikelList = [];
  const warnaList = ['#ff8fb3', '#ffd27f', '#d9b8ff', '#ffffff', '#ffb3d1', '#fff5f8'];

  function Partikel(x, y, warna) {
    this.x = x;
    this.y = y;
    const sudut = Math.random() * Math.PI * 2;
    const kecepatan = Math.random() * 5 + 1;
    this.vx = Math.cos(sudut) * kecepatan;
    this.vy = Math.sin(sudut) * kecepatan;
    this.warna = warna;
    this.alpha = 1;
    this.gravity = 0.05;
  }

  Partikel.prototype.update = function () {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.012;
  };

  Partikel.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.warna;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.warna;
    ctx.fill();
    ctx.restore();
  };

  function letuskan(x, y) {
    const warna = warnaList[Math.floor(Math.random() * warnaList.length)];
    const jumlah = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < jumlah; i++) {
      partikelList.push(new Partikel(x, y, warna));
    }
  }

  function loop() {
    const halamanKejutanAktif = document.getElementById('page-kejutan').classList.contains('active');
    if (halamanKejutanAktif) {
      ctx.fillStyle = 'rgba(45, 27, 58, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = partikelList.length - 1; i >= 0; i--) {
        const p = partikelList[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) partikelList.splice(i, 1);
      }
    }
    requestAnimationFrame(loop);
  }
  loop();

  // Letuskan otomatis secara berkala (hanya jika halaman kejutan sedang aktif)
  setInterval(() => {
    const halamanKejutanAktif = document.getElementById('page-kejutan').classList.contains('active');
    if (!halamanKejutanAktif) return;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    letuskan(x, y);
  }, 900);

  canvas.addEventListener('click', (e) => letuskan(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    letuskan(touch.clientX, touch.clientY);
  });

  canvas.dataset.letuskanPembuka = 'siap';
  canvas._letuskanPembuka = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        letuskan(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
      }, i * 350);
    }
  };
}

function letupanPembukaKejutan() {
  const canvas = document.getElementById('fireworks-canvas');
  if (canvas && canvas._letuskanPembuka) canvas._letuskanPembuka();
}

/* ===== Musik Latar — diinisialisasi SEKALI saja karena dokumen tidak pernah reload ===== */
function setupMusik() {
  const audio = document.getElementById('audio-latar');
  if (!audio) return;

  function cobaPutar() {
    audio.play().catch(() => {
      const mulaiSaatInteraksi = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click', mulaiSaatInteraksi);
        document.removeEventListener('touchstart', mulaiSaatInteraksi);
        document.removeEventListener('keydown', mulaiSaatInteraksi);
      };
      document.addEventListener('click', mulaiSaatInteraksi, { once: true });
      document.addEventListener('touchstart', mulaiSaatInteraksi, { once: true });
      document.addEventListener('keydown', mulaiSaatInteraksi, { once: true });
    });
  }

  cobaPutar();
}

/* ===== Isi nama pacar otomatis di seluruh halaman ===== */
function isiNamaOtomatis() {
  document.querySelectorAll('.nama-pacar-auto').forEach(el => {
    el.textContent = CONFIG.namaPacar;
  });
}

/* =========================================================
   ROUTER SPA — mengganti section yang tampil tanpa reload
   ========================================================= */
function navigasiKe(halaman) {
  if (!HALAMAN_VALID.includes(halaman)) halaman = 'beranda';

  document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
  document.getElementById('page-' + halaman).classList.add('active');

  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === halaman);
  });

  document.body.classList.toggle('fireworks-active', halaman === 'kejutan');

  if (window.location.hash !== '#' + halaman) {
    history.pushState(null, '', '#' + halaman);
  }

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  // Jalankan ulang efek yang perlu di-reset tiap kali halaman dibuka
  if (halaman === 'surat') {
    jalankanTypewriter();
  }
  if (halaman === 'kejutan') {
    jalankanKembangApi();
    letupanPembukaKejutan();
  }
}

function setupRouter() {
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigasiKe(link.dataset.page);
    });
  });

  window.addEventListener('popstate', () => {
    const halaman = window.location.hash.replace('#', '') || 'beranda';
    navigasiKe(halaman);
  });

  const halamanAwal = window.location.hash.replace('#', '') || 'beranda';
  navigasiKe(halamanAwal);
}

/* ===== Jalankan semua fungsi saat DOM siap ===== */
document.addEventListener('DOMContentLoaded', () => {
  buatFloatingHearts();
  isiNamaOtomatis();
  jalankanCountdown();
  setupPopupKejutan();
  setupLightbox();
  setupMusik();
  setupRouter();
});
