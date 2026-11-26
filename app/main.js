// Dana Rumah — routing + wiring. Hash routes, one page per route; every
// control on the page reads and writes the store from data.js.

(function () {
  'use strict';

  var D = window.DanaRumah;
  var V = window.DanaViews;
  var C = window.DanaCharts;

  var app = document.getElementById('app');
  var state = D.loadState();
  var txFilter = { category: '', query: '' };

  function setActiveNav(route) {
    var links = document.querySelectorAll('.main-nav a');
    links.forEach(function (a) {
      if (a.getAttribute('data-route') === route) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  function currentRoute() {
    var hash = window.location.hash || '#/';
    var path = hash.slice(1);
    if (path === '' || path === '/') return '/';
    return path;
  }

  function render() {
    var route = currentRoute();
    setActiveNav(route);
    if (route === '/transaksi') {
      app.innerHTML = V.renderTransactions(state, txFilter);
      wireTransactions();
    } else if (route === '/anggaran') {
      app.innerHTML = V.renderBudget(state);
      wireBudget();
    } else if (route === '/tagihan') {
      app.innerHTML = V.renderBills(state);
      wireBills();
    } else if (route === '/tujuan') {
      app.innerHTML = V.renderGoals(state);
      wireGoals();
    } else if (route === '/laporan') {
      app.innerHTML = V.renderReports(state);
      wireReports();
      var bars = document.getElementById('bars');
      if (bars) C.drawBars(bars, state.history);
    } else {
      app.innerHTML = V.renderDashboard(state);
      var donut = document.getElementById('donut');
      if (donut) {
        var slices = JSON.parse(donut.getAttribute('data-slices') || '[]');
        C.drawDonut(donut, slices);
      }
    }
    window.scrollTo(0, 0);
  }

  // ---- Transactions ----------------------------------------------------

  function wireTransactions() {
    var form = document.getElementById('add-form');
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault();
      var label = document.getElementById('f-label').value.trim();
      var amount = parseInt(document.getElementById('f-amount').value, 10);
      var date = document.getElementById('f-date').value;
      var category = document.getElementById('f-cat').value;
      if (!label || !amount || amount <= 0 || !date) return;
      state.transactions.push({
        id: 't' + Date.now(),
        date: date,
        label: label,
        category: category,
        amount: amount
      });
      D.saveState(state);
      render();
    });

    var cat = document.getElementById('filter-cat');
    if (cat) cat.addEventListener('change', function () {
      txFilter.category = cat.value;
      render();
    });
    var q = document.getElementById('filter-q');
    if (q) q.addEventListener('input', function () {
      txFilter.query = q.value;
      render();
      var again = document.getElementById('filter-q');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });

    app.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-delete');
        state.transactions = state.transactions.filter(function (t) { return t.id !== id; });
        D.saveState(state);
        render();
      });
    });
  }

  // ---- Budget ----------------------------------------------------------

  function wireBudget() {
    app.querySelectorAll('[data-save-budget]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-save-budget');
        var input = app.querySelector('input[data-budget="' + category + '"]');
        if (!input) return;
        var value = parseInt(input.value, 10);
        if (isNaN(value) || value < 0) return;
        state.budgets.forEach(function (b) { if (b.category === category) b.amount = value; });
        D.saveState(state);
        render();
      });
    });
  }

  // ---- Bills -----------------------------------------------------------

  function wireBills() {
    app.querySelectorAll('[data-toggle-bill]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-toggle-bill');
        state.bills.forEach(function (b) { if (b.id === id) b.paid = !b.paid; });
        D.saveState(state);
        render();
      });
    });
  }

  // ---- Goals -----------------------------------------------------------

  function wireGoals() {
    app.querySelectorAll('[data-add-goal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-add-goal');
        var input = app.querySelector('input[data-goal-input="' + id + '"]');
        if (!input) return;
        var value = parseInt(input.value, 10);
        if (isNaN(value) || value <= 0) return;
        state.goals.forEach(function (g) { if (g.id === id) g.saved += value; });
        D.saveState(state);
        render();
      });
    });
  }

  // ---- Reports ---------------------------------------------------------

  function buildCsv() {
    var lines = ['Tanggal,Keterangan,Kategori,Jumlah (Rp)'];
    state.transactions.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).forEach(function (t) {
      var label = '"' + t.label.replace(/"/g, '""') + '"';
      lines.push(t.date + ',' + label + ',' + t.category + ',' + t.amount);
    });
    lines.push('');
    lines.push('Total Pemasukan (Rp),' + D.totalIncome(state));
    lines.push('Total Pengeluaran (Rp),' + D.totalSpending(state));
    lines.push('Sisa (Rp),' + (D.totalIncome(state) - D.totalSpending(state)));
    return lines.join('\n');
  }

  function wireReports() {
    var btn = document.getElementById('export-csv');
    if (btn) btn.addEventListener('click', function () {
      var blob = new Blob([buildCsv()], { type: 'text/csv;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'dana-rumah-november-2026.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  window.addEventListener('hashchange', render);
  render();
})();
