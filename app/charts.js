// Dana Rumah — canvas charts (donut + bars), drawn with no libraries.

(function () {
  'use strict';

  var PALETTE = [
    '#1e5631', '#d97706', '#2f7d4f', '#b45309',
    '#6aa84f', '#e0a458', '#14532d', '#8a5a00', '#4c956c'
  ];

  // Donut chart of spending by category. slices: [{label, value}]
  function drawDonut(canvas, slices) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) / 2 - 14;
    var inner = radius * 0.58;
    var total = slices.reduce(function (s, x) { return s + x.value; }, 0);
    ctx.clearRect(0, 0, width, height);
    if (!total) {
      ctx.fillStyle = '#5f6f5b';
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Belum ada pengeluaran', cx, cy);
      return;
    }
    var start = -Math.PI / 2;
    slices.forEach(function (slice, i) {
      var angle = (slice.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();
      start += angle;
    });
    // Hole + centre label.
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf6';
    ctx.fill();
    ctx.fillStyle = '#143d22';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Total', cx, cy - 4);
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Rp ' + (total / 1000000).toFixed(1).replace('.', ',') + ' jt', cx, cy + 16);
  }

  // Grouped bar chart: months of {month, income, spending}.
  function drawBars(canvas, months) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var padL = 58, padB = 30, padT = 36, padR = 10;
    var maxVal = 0;
    months.forEach(function (m) {
      maxVal = Math.max(maxVal, m.income, m.spending);
    });
    maxVal = Math.ceil(maxVal / 5000000) * 5000000;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;
    var n = months.length;
    var groupW = plotW / n;
    var barW = Math.min(34, (groupW - 24) / 2);

    // Gridlines + y labels (in juta).
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#5f6f5b';
    ctx.textAlign = 'right';
    for (var g = 0; g <= 2; g++) {
      var val = (maxVal / 2) * g;
      var y = padT + plotH - (val / maxVal) * plotH;
      ctx.strokeStyle = '#e5ddc8';
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillText('Rp ' + (val / 1000000) + ' jt', padL - 8, y + 4);
    }

    months.forEach(function (m, i) {
      var gx = padL + i * groupW + groupW / 2;
      var inH = (m.income / maxVal) * plotH;
      var spH = (m.spending / maxVal) * plotH;
      ctx.fillStyle = '#1e5631';
      ctx.fillRect(gx - barW - 2, padT + plotH - inH, barW, inH);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(gx + 2, padT + plotH - spH, barW, spH);
      ctx.fillStyle = '#22301f';
      ctx.textAlign = 'center';
      ctx.fillText(m.month, gx, H - 10);
    });

    // Legend.
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e5631';
    ctx.fillRect(padL, 2, 12, 12);
    ctx.fillStyle = '#22301f';
    ctx.fillText('Pemasukan', padL + 18, 12);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(padL + 110, 2, 12, 12);
    ctx.fillStyle = '#22301f';
    ctx.fillText('Pengeluaran', padL + 128, 12);
  }

  window.DanaCharts = {
    drawDonut: drawDonut,
    drawBars: drawBars,
    PALETTE: PALETTE
  };
})();
