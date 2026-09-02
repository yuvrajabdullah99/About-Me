(function () {
  var style = document.createElement("style");
  style.textContent =
    "@keyframes siteBgGridMove { to { background-position: 44px 44px; } }" +
    "#site-bg-grid { animation: siteBgGridMove 6s linear infinite; }";
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.id = "site-bg";
  wrap.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;transition:opacity 0.3s ease;";

  var grid = document.createElement("div");
  grid.id = "site-bg-grid";
  grid.style.cssText =
    "position:absolute;inset:0;" +
    "background-image:linear-gradient(rgba(31,100,201,0.12) 1px, transparent 1px)," +
    "linear-gradient(90deg, rgba(31,100,201,0.12) 1px, transparent 1px);" +
    "background-size:44px 44px;";

  var vignette = document.createElement("div");
  vignette.style.cssText =
    "position:absolute;inset:0;" +
    "background:" +
    "radial-gradient(circle at 50% 25%, rgba(47,123,224,0.22) 0%, transparent 45%)," +
    "radial-gradient(circle at 12% 85%, rgba(21,74,150,0.20) 0%, transparent 50%)," +
    "radial-gradient(circle at 88% 80%, rgba(31,100,201,0.16) 0%, transparent 50%)," +
    "radial-gradient(circle at 50% 50%, transparent 0%, #000000 85%);";

  var canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;display:block;";

  wrap.appendChild(grid);
  wrap.appendChild(vignette);
  wrap.appendChild(canvas);
  document.body.insertBefore(wrap, document.body.firstChild);

  var ctx = canvas.getContext("2d");
  var rafId = null;
  var pts = [];
  var sparkles = [];
  var trail = [];
  var labels = [];
  var t = 0;

  var statPool = [
    "16.12%", "r = 0.96", "n = 2,000", "$3.19M", "79 / 21",
    "n = 1,470", "10,000+", "r = 0.87", "105K+", "237",
    "+12%", "R\u00B2 = 0.94", "31M pts", "8,903 rows", "40%"
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    seedPoints();
    seedLabels();
  }

  function seedPoints() {
    var count = Math.min(240, Math.floor((canvas.width * canvas.height) / 5000));
    var spread = 0.95;
    pts = [];
    for (var i = 0; i < count; i++) {
      var cx = canvas.width * (0.5 + (Math.random() - 0.5) * spread);
      var trendY = canvas.height * 0.75 - (cx / canvas.width) * canvas.height * 0.5;
      var y = trendY + (Math.random() - 0.5) * canvas.height * 0.4;
      pts.push({ x: cx, y: y, r: 1.1 + Math.random() * 1.9, tw: Math.random() * Math.PI * 2 });
    }
  }

  function seedLabels() {
    var count = Math.max(6, Math.min(14, Math.floor(canvas.width / 160)));
    labels = [];
    for (var i = 0; i < count; i++) {
      labels.push(makeLabel(Math.random() * canvas.height));
    }
  }

  function makeLabel(startY) {
    return {
      text: statPool[Math.floor(Math.random() * statPool.length)],
      x: Math.random() * canvas.width,
      y: startY !== undefined ? startY : canvas.height + 20,
      speed: 0.12 + Math.random() * 0.18,
      size: 11 + Math.random() * 3,
      alpha: 0.06 + Math.random() * 0.07
    };
  }

  function isDark() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  function getEndpoints() {
    return {
      x1: canvas.width * 0.08,
      y1: canvas.height * 0.78,
      x2: canvas.width * 0.92,
      y2: canvas.height * 0.22
    };
  }

  function drawStar(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(200,225,255,1)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "rgba(220,235,255,1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    if (!isDark()) {
      wrap.style.opacity = "0";
      rafId = requestAnimationFrame(tick);
      return;
    }
    wrap.style.opacity = "1";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.006;

    ctx.font = "500 12px -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";
    for (var l = 0; l < labels.length; l++) {
      var lb = labels[l];
      lb.y -= lb.speed;
      if (lb.y < -20) {
        labels[l] = makeLabel();
        continue;
      }
      ctx.font = "500 " + lb.size + "px -apple-system, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = "rgba(140,180,235," + lb.alpha + ")";
      ctx.fillText(lb.text, lb.x, lb.y);
    }

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var alpha = 0.35 + 0.35 * Math.abs(Math.sin(t * 2 + p.tw));
      ctx.fillStyle = "rgba(90,150,235," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    var e = getEndpoints();
    var progress = Math.min(1, ((Math.sin(t * 0.35) + 1) / 2) * 1.15);
    var cx = e.x1 + (e.x2 - e.x1) * progress;
    var cy = e.y1 + (e.y2 - e.y1) * progress;

    ctx.save();
    ctx.shadowColor = "rgba(47,123,224,0.9)";
    ctx.shadowBlur = 14;
    ctx.strokeStyle = "rgba(90,160,240,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(e.x1, e.y1);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.restore();

    trail.push({ x: cx, y: cy });
    if (trail.length > 18) trail.shift();
    for (var tr = 0; tr < trail.length; tr++) {
      var age = tr / trail.length;
      var pos = trail[tr];
      ctx.save();
      ctx.shadowColor = "rgba(90,160,240,0.6)";
      ctx.shadowBlur = 8 * age;
      ctx.fillStyle = "rgba(120,180,250," + (0.35 * age) + ")";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1 + 3 * age, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    var flicker = 0.75 + Math.random() * 0.25;

    ctx.save();
    ctx.shadowColor = "rgba(80,150,255,0.9)";
    ctx.shadowBlur = 34 * flicker;
    ctx.fillStyle = "rgba(90,160,240,0.55)";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(140,195,255,1)";
    ctx.shadowBlur = 22 * flicker;
    ctx.fillStyle = "rgba(180,215,255,1)";
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (Math.random() < 0.55) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 6 + Math.random() * 16;
      sparkles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        age: 0,
        maxAge: 18 + Math.random() * 14,
        size: 1.5 + Math.random() * 2.5
      });
    }

    for (var s = sparkles.length - 1; s >= 0; s--) {
      var sp = sparkles[s];
      sp.age += 1;
      if (sp.age > sp.maxAge) {
        sparkles.splice(s, 1);
        continue;
      }
      var life = sp.age / sp.maxAge;
      var sparkleAlpha = life < 0.3 ? life / 0.3 : 1 - (life - 0.3) / 0.7;
      drawStar(sp.x, sp.y, sp.size, sparkleAlpha);
    }

    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();
