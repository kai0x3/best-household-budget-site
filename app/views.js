// Dana Rumah — page views. Each view returns HTML for one hash route;
// main.js inserts it and wires the controls. All figures come from the
// store in data.js, so every page always shows the same real numbers.

(function () {
  'use strict';

  var D = window.DanaRumah;

  function pct(part, whole) {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
  }

  function barClass(percent) {
    if (percent >= 100) return 'red';
    if (percent >= 90) return 'amber';
    return '';
  }

  function statusPill(percent) {
    if (percent >= 100) return '<span class="pill red">Melebihi anggaran</span>';
    if (percent >= 90) return '<span class="pill amber">Hampir habis</span>';
    return '<span class="pill">Aman</span>';
  }

  function incomeRows(state) {
    return state.income.map(function (row) {
      return '<tr><td>' + D.formatDate(row.date) + '</td><td>' +
        D.escapeHtml(row.label) + ' — ' + D.escapeHtml(row.source) +
        '</td><td class="num amount-in">+ ' + D.formatRupiah(row.amount) + '</td></tr>';
    }).join('');
  }

  function transactionRows(rows) {
    if (!rows.length) return '<tr><td colspan="5" class="empty-note">Tidak ada transaksi yang cocok.</td></tr>';
    return rows.map(function (row) {
      return '<tr><td>' + D.formatDate(row.date) + '</td><td>' +
        D.escapeHtml(row.label) + '</td><td>' + D.escapeHtml(row.category) +
        '</td><td class="num amount-out">− ' + D.formatRupiah(row.amount) +
        '</td><td><button class="danger" data-delete="' + row.id + '">Hapus</button></td></tr>';
    }).join('');
  }

  // ---- Dashboard -------------------------------------------------------

  function renderDashboard(state) {
    var income = D.totalIncome(state);
    var spending = D.totalSpending(state);
    var rest = income - spending;
    var saveRate = pct(rest, income);
    var spent = D.spentByCategory(state);
    var slices = D.CATEGORIES.filter(function (c) { return spent[c] > 0 && c !== 'Tabungan'; })
      .map(function (c) { return { label: c, value: spent[c] }; })
      .sort(function (a, b) { return b.value - a.value; });

    var legend = slices.map(function (s, i) {
      var color = window.DanaCharts.PALETTE[i % window.DanaCharts.PALETTE.length];
      return '<div><span class="dot" style="background:' + color + '"></span>' +
        D.escapeHtml(s.label) + ' — ' + D.formatRupiah(s.value) + ' (' + pct(s.value, spending) + '%)</div>';
    }).join('');

    var recent = state.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 6);
    var recentRows = recent.map(function (row) {
      return '<tr><td>' + D.formatDate(row.date) + '</td><td>' + D.escapeHtml(row.label) +
        '</td><td class="num amount-out">− ' + D.formatRupiah(row.amount) + '</td></tr>';
    }).join('');

    var upcoming = state.bills.filter(function (b) { return !b.paid; })
      .sort(function (a, b) { return a.due.localeCompare(b.due); });
    var upcomingRows = upcoming.map(function (b) {
      return '<div class="bill-row"><div><div class="name">' + D.escapeHtml(b.name) +
        '</div><div class="meta">Jatuh tempo ' + D.formatDate(b.due) + '</div></div>' +
        '<div class="amount">' + D.formatRupiah(b.amount) + '</div></div>';
    }).join('') || '<p class="empty-note">Semua tagihan bulan ini sudah lunas.</p>';

    var alerts = [];
    state.budgets.forEach(function (b) {
      var p = pct(spent[b.category] || 0, b.amount);
      if (b.category === 'Tabungan') return;
      if (p >= 100) alerts.push('<div class="alert red"><strong>' + D.escapeHtml(b.category) +
        ' melebihi anggaran.</strong> Terpakai ' + D.formatRupiah(spent[b.category]) + ' dari ' +
        D.formatRupiah(b.amount) + ' (' + p + '%).</div>');
      else if (p >= 90) alerts.push('<div class="alert"><strong>' + D.escapeHtml(b.category) +
        ' hampir habis.</strong> Terpakai ' + D.formatRupiah(spent[b.category]) + ' dari ' +
        D.formatRupiah(b.amount) + ' (' + p + '%).</div>');
    });

    return '' +
      '<div class="page-head"><h1>Dasbor — ' + D.escapeHtml(state.monthLabel) + '</h1>' +
      '<p>Ringkasan keuangan ' + D.escapeHtml(state.household) + '. Pemasukan, pengeluaran, tagihan, dan tabungan bulan ini dalam satu layar.</p></div>' +
      '<div class="summary">' +
        '<div class="card"><div class="label">Pemasukan</div><div class="value good">' + D.formatRupiah(income) + '</div><div class="sub">Gaji Rp 10.000.000 + Freelance Rp 2.500.000</div></div>' +
        '<div class="card"><div class="label">Pengeluaran</div><div class="value">' + D.formatRupiah(spending) + '</div><div class="sub">' + state.transactions.length + ' transaksi tercatat</div></div>' +
        '<div class="card"><div class="label">Sisa Bulan Ini</div><div class="value good">' + D.formatRupiah(rest) + '</div><div class="sub">Siap dialihkan ke tabungan &amp; dana darurat</div></div>' +
        '<div class="card"><div class="label">Tingkat Tabungan</div><div class="value">' + saveRate + '%</div><div class="sub">dari pemasukan — target keluarga 40%</div></div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="card"><h2>Pengeluaran per Kategori</h2>' +
          '<canvas id="donut" class="chart" width="480" height="320" data-slices=\'' + JSON.stringify(slices) + '\'></canvas>' +
          '<div class="chart-legend">' + legend + '</div></div>' +
        '<div>' +
          '<div class="card"><h2>Transaksi Terakhir</h2><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th class="num">Jumlah</th></tr></thead><tbody>' + recentRows + '</tbody></table>' +
          '<p style="margin:12px 0 0"><a href="#/transaksi">Lihat semua transaksi →</a></p></div>' +
          '<div class="card"><h2>Tagihan Berikutnya</h2>' + upcomingRows + '<p style="margin:12px 0 0"><a href="#/tagihan">Kelola semua tagihan →</a></p></div>' +
        '</div>' +
      '</div>' +
      '<div class="card"><h2>Peringatan Anggaran</h2>' +
        (alerts.length ? alerts.join('') : '<p class="empty-note">Semua kategori masih dalam anggaran bulan ini.</p>') +
        '<p style="margin:10px 0 0"><a href="#/anggaran">Atur anggaran bulanan →</a></p></div>';
  }

  // ---- Transactions ----------------------------------------------------

  function renderTransactions(state, filter) {
    var rows = state.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    if (filter && filter.category) rows = rows.filter(function (r) { return r.category === filter.category; });
    if (filter && filter.query) {
      var q = filter.query.toLowerCase();
      rows = rows.filter(function (r) { return r.label.toLowerCase().indexOf(q) !== -1; });
    }
    var options = '<option value="">Semua kategori</option>' + D.CATEGORIES.map(function (c) {
      var sel = filter && filter.category === c ? ' selected' : '';
      return '<option value="' + c + '"' + sel + '>' + c + '</option>';
    }).join('');
    var formOptions = D.CATEGORIES.map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join('');

    return '' +
      '<div class="page-head"><h1>Transaksi</h1>' +
      '<p>Semua pengeluaran ' + D.escapeHtml(state.monthLabel) + ' — ' + state.transactions.length + ' transaksi, total ' + D.formatRupiah(D.totalSpending(state)) + '. Tambah, cari, saring, atau hapus transaksi; total di dasbor ikut berubah.</p></div>' +
      '<div class="card"><h2>Tambah Transaksi</h2>' +
        '<form id="add-form" class="inline-form">' +
          '<div class="field"><label for="f-date">Tanggal</label><input id="f-date" type="date" value="2026-11-26" required></div>' +
          '<div class="field"><label for="f-label">Keterangan</label><input id="f-label" type="text" placeholder="cth: Pasar Minggu" required></div>' +
          '<div class="field"><label for="f-cat">Kategori</label><select id="f-cat">' + formOptions + '</select></div>' +
          '<div class="field"><label for="f-amount">Jumlah (Rp)</label><input id="f-amount" type="number" min="1000" step="500" placeholder="50000" required></div>' +
          '<button type="submit">+ Tambah</button>' +
        '</form></div>' +
      '<div class="card"><h2>Daftar Transaksi</h2>' +
        '<div class="toolbar">' +
          '<select id="filter-cat" aria-label="Saring kategori">' + options + '</select>' +
          '<input id="filter-q" type="search" placeholder="Cari keterangan…" value="' + D.escapeHtml(filter && filter.query ? filter.query : '') + '" aria-label="Cari transaksi">' +
        '</div>' +
        '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>' +
        '<tbody>' + transactionRows(rows) + '</tbody></table>' +
        '<p class="empty-note" style="margin:12px 0 0">Menampilkan ' + rows.length + ' dari ' + state.transactions.length + ' transaksi.</p></div>';
  }

  // ---- Budget ----------------------------------------------------------

  function renderBudget(state) {
    var spent = D.spentByCategory(state);
    var totalBudget = state.budgets.reduce(function (s, b) { return s + b.amount; }, 0);
    var totalSpent = D.totalSpending(state);
    var blocks = state.budgets.map(function (b) {
      var used = spent[b.category] || 0;
      var p = pct(used, b.amount);
      var shown = Math.min(p, 100);
      var note = b.category === 'Tabungan'
        ? 'Target disisihkan di awal gajian.'
        : 'Terpakai ' + D.formatRupiah(used) + ' dari ' + D.formatRupiah(b.amount) + ' (' + p + '%).';
      return '<div class="bar-row">' +
        '<div class="bar-head"><strong>' + D.escapeHtml(b.category) + '</strong><span>' + statusPill(p) + '</span></div>' +
        '<div class="bar-track"><div class="bar-fill ' + barClass(p) + '" style="width:' + shown + '%"></div></div>' +
        '<div class="bar-note">' + note + '</div>' +
        '<div class="goal-add"><input type="number" min="0" step="50000" value="' + b.amount + '" data-budget="' + D.escapeHtml(b.category) + '" aria-label="Anggaran ' + D.escapeHtml(b.category) + '">' +
        '<button class="small secondary" data-save-budget="' + D.escapeHtml(b.category) + '">Simpan Anggaran</button></div>' +
      '</div>';
    }).join('');

    return '' +
      '<div class="page-head"><h1>Anggaran Bulanan</h1>' +
      '<p>Anggaran ' + D.escapeHtml(state.monthLabel) + ' total ' + D.formatRupiah(totalBudget) + '; sudah terpakai ' + D.formatRupiah(totalSpent) + ' (' + pct(totalSpent, totalBudget) + '%). Ubah angka anggaran lalu tekan Simpan — perubahan tersimpan dan langsung terlihat di dasbor.</p></div>' +
      '<div class="card">' + blocks + '</div>' +
      '<div class="card"><h2>Cara keluarga ini memakai anggaran</h2>' +
      '<p>Anggaran disusun di awal bulan dari gaji Rp 10.000.000 ditambah freelance Rp 2.500.000. Tabungan Rp 2.000.000 dipindah begitu gaji masuk, bukan dari sisa. Kategori yang menyentuh 90% muncul sebagai peringatan di dasbor.</p></div>';
  }

  // ---- Bills -----------------------------------------------------------

  function renderBills(state) {
    var unpaid = state.bills.filter(function (b) { return !b.paid; });
    var unpaidTotal = unpaid.reduce(function (s, b) { return s + b.amount; }, 0);
    var paidCount = state.bills.length - unpaid.length;
    var rows = state.bills.slice().sort(function (a, b) { return a.due.localeCompare(b.due); }).map(function (b) {
      var status = b.paid
        ? '<span class="status-paid">✓ Lunas</span>'
        : '<span class="status-due">Belum dibayar</span>';
      return '<div class="bill-row"><div><div class="name">' + D.escapeHtml(b.name) + '</div>' +
        '<div class="meta">Jatuh tempo ' + D.formatDate(b.due) + ' · ' + status + '</div></div>' +
        '<div class="amount">' + D.formatRupiah(b.amount) + '</div>' +
        '<button class="small ' + (b.paid ? 'secondary' : '') + '" data-toggle-bill="' + b.id + '">' +
        (b.paid ? 'Batalkan Lunas' : 'Tandai Lunas') + '</button></div>';
    }).join('');

    return '' +
      '<div class="page-head"><h1>Tagihan Rutin</h1>' +
      '<p>Tagihan yang datang setiap bulan. Tandai lunas begitu dibayar — status tersimpan dan ringkasan di bawah ikut berubah.</p></div>' +
      '<div class="summary">' +
        '<div class="card"><div class="label">Belum Dibayar</div><div class="value warn">' + D.formatRupiah(unpaidTotal) + '</div><div class="sub">' + unpaid.length + ' tagihan menunggu</div></div>' +
        '<div class="card"><div class="label">Sudah Lunas</div><div class="value good">' + paidCount + ' dari ' + state.bills.length + '</div><div class="sub">tagihan bulan ini</div></div>' +
        '<div class="card"><div class="label">Total Tagihan</div><div class="value">' + D.formatRupiah(state.bills.reduce(function (s, b) { return s + b.amount; }, 0)) + '</div><div class="sub">per bulan, semua tagihan rutin</div></div>' +
        '<div class="card"><div class="label">Jatuh Tempo Terdekat</div><div class="value">' + (unpaid.length ? D.formatDate(unpaid.sort(function (a, b) { return a.due.localeCompare(b.due); })[0].due) : '—') + '</div><div class="sub">' + (unpaid.length ? D.escapeHtml(unpaid.sort(function (a, b) { return a.due.localeCompare(b.due); })[0].name) : 'Semua lunas') + '</div></div>' +
      '</div>' +
      '<div class="card"><h2>Semua Tagihan — ' + D.escapeHtml(state.monthLabel) + '</h2>' + rows + '</div>' +
      '<div class="card"><h2>Pemasukan Bulan Ini</h2><table><thead><tr><th>Tanggal</th><th>Sumber</th><th class="num">Jumlah</th></tr></thead><tbody>' + incomeRows(state) + '</tbody></table></div>';
  }

  // ---- Goals -----------------------------------------------------------

  function renderGoals(state) {
    var totalSaved = state.goals.reduce(function (s, g) { return s + g.saved; }, 0);
    var totalTarget = state.goals.reduce(function (s, g) { return s + g.target; }, 0);
    var blocks = state.goals.map(function (g) {
      var p = pct(g.saved, g.target);
      return '<div class="goal-block"><div class="bar-row">' +
        '<div class="bar-head"><strong>' + D.escapeHtml(g.name) + '</strong><span>' + p + '% · ' + D.formatRupiah(g.saved) + ' dari ' + D.formatRupiah(g.target) + '</span></div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + p + '%"></div></div>' +
        '<div class="goal-note">' + D.escapeHtml(g.note) + ' Sisa ' + D.formatRupiah(g.target - g.saved) + ' lagi.</div>' +
        '<div class="goal-add"><input type="number" min="1000" step="10000" placeholder="Jumlah setoran (Rp)" data-goal-input="' + g.id + '" aria-label="Setoran ' + D.escapeHtml(g.name) + '">' +
        '<button class="small" data-add-goal="' + g.id + '">+ Tambah Setoran</button></div>' +
      '</div></div>';
    }).join('');

    return '' +
      '<div class="page-head"><h1>Tujuan Menabung</h1>' +
      '<p>Tiga tujuan keluarga: total terkumpul ' + D.formatRupiah(totalSaved) + ' dari target ' + D.formatRupiah(totalTarget) + ' (' + pct(totalSaved, totalTarget) + '%). Tambah setoran kapan saja; bilah kemajuan langsung bergerak.</p></div>' +
      '<div class="card">' + blocks + '</div>' +
      '<div class="card"><h2>Aturan mainnya</h2>' +
      '<p>Dana darurat didahulukan — targetnya 6 kali pengeluaran bulanan. Setiap ada pemasukan freelance, 20% langsung masuk ke tujuan yang paling dekat tercapai. Setoran dicatat di sini dan tersimpan di peramban, jadi kemajuan tidak hilang saat halaman ditutup.</p></div>';
  }

  // ---- Reports ---------------------------------------------------------

  function renderReports(state) {
    var spent = D.spentByCategory(state);
    var top = D.CATEGORIES.filter(function (c) { return spent[c] > 0; })
      .map(function (c) { return { label: c, value: spent[c] }; })
      .sort(function (a, b) { return b.value - a.value; });
    var topRows = top.map(function (t, i) {
      return '<tr><td>' + (i + 1) + '</td><td>' + D.escapeHtml(t.label) + '</td><td class="num">' + D.formatRupiah(t.value) + '</td><td class="num">' + pct(t.value, D.totalSpending(state)) + '%</td></tr>';
    }).join('');
    var biggest = state.transactions.slice().sort(function (a, b) { return b.amount - a.amount; }).slice(0, 5);
    var biggestRows = biggest.map(function (row) {
      return '<tr><td>' + D.formatDate(row.date) + '</td><td>' + D.escapeHtml(row.label) + '</td><td class="num">' + D.formatRupiah(row.amount) + '</td></tr>';
    }).join('');
    var tips = state.tips.map(function (tip) {
      return '<div class="tip"><strong>' + D.escapeHtml(tip.title) + '</strong><p>' + D.escapeHtml(tip.text) + '</p></div>';
    }).join('');

    return '' +
      '<div class="page-head"><h1>Laporan 6 Bulan</h1>' +
      '<p>Pemasukan melawan pengeluaran Juni–November 2026. Rata-rata pengeluaran ' + D.formatRupiah(Math.round(state.history.reduce(function (s, m) { return s + m.spending; }, 0) / state.history.length)) + ' per bulan, dengan sisa rata-rata ' + D.formatRupiah(Math.round(state.history.reduce(function (s, m) { return s + (m.income - m.spending); }, 0) / state.history.length)) + ' per bulan.</p></div>' +
      '<div class="card"><h2>Pemasukan vs Pengeluaran</h2>' +
        '<canvas id="bars" class="chart" width="960" height="360"></canvas>' +
        '<p class="empty-note">Hijau = pemasukan, oranye = pengeluaran. November paling hemat kedua setelah Juni.</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><h2>Pengeluaran per Kategori</h2><table><thead><tr><th>#</th><th>Kategori</th><th class="num">Jumlah</th><th class="num">Porsi</th></tr></thead><tbody>' + topRows + '</tbody></table></div>' +
        '<div class="card"><h2>5 Pengeluaran Terbesar</h2><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th class="num">Jumlah</th></tr></thead><tbody>' + biggestRows + '</tbody></table>' +
        '<p class="empty-note" style="margin-top:12px">Cicilan motor Rp 1.250.000 adalah pengeluaran terbesar bulan ini — tagihan tetap, bukan belanja impulsif.</p></div>' +
      '</div>' +
      '<div class="card"><h2>Ekspor &amp; Tips Hemat</h2>' +
        '<p><button id="export-csv">⬇ Unduh Laporan (CSV)</button> <span class="empty-note">Berkas berisi semua ' + state.transactions.length + ' transaksi bulan ini.</span></p>' +
        tips + '</div>';
  }

  window.DanaViews = {
    renderDashboard: renderDashboard,
    renderTransactions: renderTransactions,
    renderBudget: renderBudget,
    renderBills: renderBills,
    renderGoals: renderGoals,
    renderReports: renderReports
  };
})();
