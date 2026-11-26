// Dana Rumah — seed data and the tiny store behind the site.
// All figures are realistic November 2026 numbers for one household
// (Keluarga Wijaya, 4 people). The store keeps state in localStorage
// under one key so every control on every page persists.

(function () {
  'use strict';

  var STORAGE_KEY = 'dana-rumah-v1';

  var CATEGORIES = [
    'Belanja Harian',
    'Makan & Minum',
    'Transportasi',
    'Listrik & Air',
    'Internet & HP',
    'Pendidikan Anak',
    'Kesehatan',
    'Hiburan',
    'Tabungan'
  ];

  function seedData() {
    return {
      household: 'Keluarga Wijaya',
      monthLabel: 'November 2026',
      income: [
        { id: 'inc-1', label: 'Gaji Bulanan', source: 'PT Cakrawala', date: '2026-11-01', amount: 10000000 },
        { id: 'inc-2', label: 'Freelance Desain', source: 'Proyek logo UMKM', date: '2026-11-15', amount: 2500000 }
      ],
      transactions: [
        { id: 't01', date: '2026-11-01', label: 'Pasar Minggu', category: 'Belanja Harian', amount: 185000 },
        { id: 't02', date: '2026-11-01', label: 'Indomaret', category: 'Belanja Harian', amount: 92500 },
        { id: 't03', date: '2026-11-02', label: 'GoFood — Ayam Geprek', category: 'Makan & Minum', amount: 78000 },
        { id: 't04', date: '2026-11-02', label: 'Bensin Pertalite', category: 'Transportasi', amount: 100000 },
        { id: 't05', date: '2026-11-03', label: 'Token PLN', category: 'Listrik & Air', amount: 200000 },
        { id: 't06', date: '2026-11-03', label: 'SPP Sekolah Anak', category: 'Pendidikan Anak', amount: 750000 },
        { id: 't07', date: '2026-11-04', label: 'Warteg Bahari', category: 'Makan & Minum', amount: 45000 },
        { id: 't08', date: '2026-11-05', label: 'IndiHome', category: 'Internet & HP', amount: 389000 },
        { id: 't09', date: '2026-11-05', label: 'Apotek Kimia Farma', category: 'Kesehatan', amount: 125000 },
        { id: 't10', date: '2026-11-06', label: 'Pasar Minggu', category: 'Belanja Harian', amount: 210000 },
        { id: 't11', date: '2026-11-07', label: 'GoPay — Ojek Online', category: 'Transportasi', amount: 150000 },
        { id: 't12', date: '2026-11-08', label: 'Bioskop XXI', category: 'Hiburan', amount: 120000 },
        { id: 't13', date: '2026-11-09', label: 'Alfamart', category: 'Belanja Harian', amount: 87000 },
        { id: 't14', date: '2026-11-10', label: 'Tagihan PDAM', category: 'Listrik & Air', amount: 165000 },
        { id: 't15', date: '2026-11-11', label: 'Mie Ayam Pakde', category: 'Makan & Minum', amount: 38000 },
        { id: 't16', date: '2026-11-12', label: 'Bensin Pertalite', category: 'Transportasi', amount: 100000 },
        { id: 't17', date: '2026-11-13', label: 'Buku & Alat Tulis', category: 'Pendidikan Anak', amount: 145000 },
        { id: 't18', date: '2026-11-14', label: 'Pasar Minggu', category: 'Belanja Harian', amount: 235000 },
        { id: 't19', date: '2026-11-15', label: 'Netflix', category: 'Hiburan', amount: 65000 },
        { id: 't20', date: '2026-11-16', label: 'Indomaret', category: 'Belanja Harian', amount: 110000 },
        { id: 't21', date: '2026-11-17', label: 'Klinik Gigi', category: 'Kesehatan', amount: 250000 },
        { id: 't22', date: '2026-11-18', label: 'GoFood — Nasi Padang', category: 'Makan & Minum', amount: 92000 },
        { id: 't23', date: '2026-11-19', label: 'Pulsa Telkomsel', category: 'Internet & HP', amount: 75000 },
        { id: 't24', date: '2026-11-20', label: 'Pasar Minggu', category: 'Belanja Harian', amount: 198000 },
        { id: 't25', date: '2026-11-21', label: 'Cicilan Motor', category: 'Transportasi', amount: 1250000 },
        { id: 't26', date: '2026-11-22', label: 'Bakso Pakde', category: 'Makan & Minum', amount: 56000 },
        { id: 't27', date: '2026-11-23', label: 'Sayur Keliling', category: 'Belanja Harian', amount: 64000 },
        { id: 't28', date: '2026-11-24', label: 'Les Renang Anak', category: 'Pendidikan Anak', amount: 300000 },
        { id: 't29', date: '2026-11-25', label: 'Bensin Pertalite', category: 'Transportasi', amount: 100000 },
        { id: 't30', date: '2026-11-26', label: 'Warung Kopi', category: 'Makan & Minum', amount: 42000 }
      ],
      budgets: [
        { category: 'Belanja Harian', amount: 1500000 },
        { category: 'Makan & Minum', amount: 600000 },
        { category: 'Transportasi', amount: 1800000 },
        { category: 'Listrik & Air', amount: 450000 },
        { category: 'Internet & HP', amount: 500000 },
        { category: 'Pendidikan Anak', amount: 1200000 },
        { category: 'Kesehatan', amount: 400000 },
        { category: 'Hiburan', amount: 300000 },
        { category: 'Tabungan', amount: 2000000 }
      ],
      bills: [
        { id: 'b1', name: 'PLN (Listrik)', amount: 200000, due: '2026-11-05', paid: true },
        { id: 'b2', name: 'IndiHome (Internet)', amount: 389000, due: '2026-11-05', paid: true },
        { id: 'b3', name: 'PDAM (Air)', amount: 165000, due: '2026-11-10', paid: true },
        { id: 'b4', name: 'Cicilan Motor', amount: 1250000, due: '2026-11-21', paid: true },
        { id: 'b5', name: 'BPJS Kesehatan', amount: 150000, due: '2026-11-28', paid: false },
        { id: 'b6', name: 'Asuransi Jiwa', amount: 275000, due: '2026-11-27', paid: false },
        { id: 'b7', name: 'SPP Sekolah', amount: 750000, due: '2026-11-30', paid: true },
        { id: 'b8', name: 'Iuran RT & Keamanan', amount: 50000, due: '2026-11-30', paid: false }
      ],
      goals: [
        { id: 'g1', name: 'Dana Darurat', target: 20000000, saved: 12400000, note: '6x pengeluaran bulanan, disimpan di tabungan terpisah.' },
        { id: 'g2', name: 'Liburan Keluarga', target: 8000000, saved: 3250000, note: 'Liburan ke Yogyakarta, akhir tahun. Tiket & hotel sudah dicek.' },
        { id: 'g3', name: 'DP Motor Baru', target: 15000000, saved: 6750000, note: 'Motor lama sudah 7 tahun; ganti sebelum mudik Lebaran.' }
      ],
      history: [
        { month: 'Jun 2026', income: 12000000, spending: 5420000 },
        { month: 'Jul 2026', income: 12500000, spending: 5980000 },
        { month: 'Agu 2026', income: 12500000, spending: 6150000 },
        { month: 'Sep 2026', income: 12500000, spending: 5640000 },
        { month: 'Okt 2026', income: 12500000, spending: 6020000 },
        { month: 'Nov 2026', income: 12500000, spending: 5816500 }
      ],
      tips: [
        { title: 'Masak 4x seminggu', text: 'Jatah makan di luar bulan ini Rp 351.000 dari Rp 600.000. Masak di rumah 4 kali seminggu bisa memangkas Rp 150.000–Rp 200.000 per bulan.' },
        { title: 'Belanja pasar 2x seminggu', text: 'Belanja harian Rp 1.181.500 dari Rp 1.500.000. Daftar belanja sebelum ke pasar mencegah belanja impulsif di rak camilan.' },
        { title: 'Cek langganan tiap bulan', text: 'Internet & HP sudah Rp 464.000 dari Rp 500.000. Tinjau paket data dan langganan streaming yang jarang dipakai.' },
        { title: 'Sisihkan di awal gajian', text: 'Pindahkan Rp 2.000.000 ke tabungan begitu gaji masuk, bukan dari sisa. Sisa bulan ini Rp 6.683.500 — aman untuk menambah dana darurat.' }
      ]
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.transactions)) return parsed;
      }
    } catch (e) { /* fall through to seed */ }
    var fresh = seedData();
    saveState(fresh);
    return fresh;
  }

  function saveState(state) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
  }

  function totalIncome(state) {
    return state.income.reduce(function (sum, row) { return sum + row.amount; }, 0);
  }

  function totalSpending(state) {
    return state.transactions.reduce(function (sum, row) { return sum + row.amount; }, 0);
  }

  function spentByCategory(state) {
    var out = {};
    CATEGORIES.forEach(function (c) { out[c] = 0; });
    state.transactions.forEach(function (row) {
      if (out[row.category] !== undefined) out[row.category] += row.amount;
    });
    return out;
  }

  function budgetFor(state, category) {
    var found = null;
    state.budgets.forEach(function (b) { if (b.category === category) found = b.amount; });
    return found === null ? 0 : found;
  }

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.DanaRumah = {
    CATEGORIES: CATEGORIES,
    loadState: loadState,
    saveState: saveState,
    seedData: seedData,
    totalIncome: totalIncome,
    totalSpending: totalSpending,
    spentByCategory: spentByCategory,
    budgetFor: budgetFor,
    formatRupiah: formatRupiah,
    formatDate: formatDate,
    escapeHtml: escapeHtml
  };
})();
