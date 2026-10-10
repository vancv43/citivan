/* Swarm Intelligence Textbook — controller, nền bầy chim, đổi ngôn ngữ, khung mô phỏng 2D. Châu Văn Vân · PTITHCM */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class SlidePresentation {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.current = 0;
    this.locked = false;
    this.progress = document.querySelector('.progress');
    this.pageNum = document.querySelector('.page-num');
    this.hint = document.querySelector('.keyboard-hint');
    this.setupNavDots();
    this.setupIntersectionObserver();
    this.setupKeyboardNav();
    this.setupWheelNav();
    this.setupTouchNav();
    window.addEventListener('resize', () => this.go(this.current, true));
    const start = parseInt(location.hash.slice(1), 10);
    if (start > 0 && start <= this.slides.length) this.go(start - 1, true);
    this.update();
  }

  setupIntersectionObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          e.target.classList.add('visible');
          this.current = this.slides.indexOf(e.target);
          this.update();
          e.target.dispatchEvent(new CustomEvent('slideenter'));
        } else if (!e.isIntersecting) {
          e.target.dispatchEvent(new CustomEvent('slideleave'));
        }
      });
    }, { threshold: [0, 0.6] });
    this.slides.forEach((s) => io.observe(s));
  }

  setupNavDots() {
    const nav = document.querySelector('.nav-dots');
    nav.innerHTML = '';
    this.navDots = nav;
    this.dots = this.slides.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${i + 1}: ${s.getAttribute('aria-label') || ''}`);
      b.addEventListener('click', () => this.go(i));
      nav.appendChild(b);
      return b;
    });
  }

  update() {
    const n = this.slides.length;
    this.progress.style.width = `${((this.current + 1) / n) * 100}%`;
    this.pageNum.textContent = `${String(this.current + 1).padStart(2, '0')} / ${n}`;
    this.dots.forEach((d, i) => d.setAttribute('aria-current', i === this.current ? 'true' : 'false'));
    history.replaceState(null, '', `#${this.current + 1}`);
    if (this.current > 0) this.hint.classList.add('gone');
  }

  go(i, instant = false) {
    i = Math.max(0, Math.min(this.slides.length - 1, i));
    this.slides[i].scrollIntoView({ behavior: instant || reduceMotion ? 'auto' : 'smooth' });
    this.current = i;
    this.update();
  }

  next() {
    const s = this.slides[this.current].stepper;
    if (s && s.next()) return;
    this.go(this.current + 1);
  }

  prev() {
    const s = this.slides[this.current].stepper;
    if (s && s.prev()) return;
    this.go(this.current - 1);
  }

  setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
      if (e.target.closest && e.target.closest('input, select, textarea')) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); this.next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); this.prev(); }
      else if (e.key === 'Home') { e.preventDefault(); this.go(0); }
      else if (e.key === 'End') { e.preventDefault(); this.go(this.slides.length - 1); }
    });
  }

  setupWheelNav() {
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.locked || Math.abs(e.deltaY) < 12) return;
      this.locked = true;
      e.deltaY > 0 ? this.next() : this.prev();
      setTimeout(() => (this.locked = false), 750);
    }, { passive: false });
  }

  setupTouchNav() {
    let x0 = 0, y0 = 0;
    window.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      const d = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      if (Math.abs(d) < 45) return;
      d < 0 ? this.next() : this.prev();
    }, { passive: true });
  }
}

/* ===========================================
   LIVE SWARM BACKGROUND (trang bìa + trang cuối)
   Một PSO thật trên mục tiêu di động: mỗi khung hình đánh giá lại
   pbest/gbest nên bầy liên tục bám theo như đàn chim.
   =========================================== */
class SwarmCanvas {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.slide = canvas.closest('.slide');
    this.running = false; this.t = Math.random() * 100;
    this.resize(); window.addEventListener('resize', () => this.resize());
    this.slide.addEventListener('slideenter', () => this.start());
    this.slide.addEventListener('slideleave', () => this.stop());
    this.init();
    this.draw(true);
  }
  resize() {
    const r = this.c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width; this.h = r.height;
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  target() {
    // mục tiêu trôi theo đường Lissajous ở nửa trên khung hình
    return { x: this.w * (0.55 + 0.33 * Math.sin(this.t * 0.31)), y: this.h * (0.36 + 0.2 * Math.sin(this.t * 0.47 + 1)) };
  }
  fit(p, g) { const dx = p.x - g.x, dy = p.y - g.y; return dx * dx + dy * dy; }
  init() {
    const n = this.w < 600 ? 40 : 70;
    // khởi tạo thành một đám lỏng, bay cùng hướng, như đàn chim vừa cất cánh
    const cx = this.w * 0.25, cy = this.h * 0.3, R = Math.min(this.w, this.h) * 0.25;
    this.ps = Array.from({ length: n }, () => {
      const a = Math.random() * Math.PI * 2, r = R * Math.sqrt(Math.random());
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a) * 0.6;
      return { x, y, vx: 1.6 + Math.random(), vy: (Math.random() - 0.5), bx: x, by: y };
    });
  }
  step() {
    this.t += 0.012;
    const g0 = this.target();
    let best = null, bf = Infinity;
    for (const p of this.ps) {
      const f = this.fit({ x: p.bx, y: p.by }, g0);
      // mục tiêu thay đổi → quên dần pbest cũ
      if (this.fit(p, g0) < f) { p.bx = p.x; p.by = p.y; }
      const fb = this.fit({ x: p.bx, y: p.by }, g0);
      if (fb < bf) { bf = fb; best = p; }
    }
    const w = 0.93, c1 = 0.5, c2 = 0.32, vmax = 3.2;
    for (const p of this.ps) {
      const r1 = Math.random(), r2 = Math.random();
      p.vx = w * p.vx + c1 * r1 * (p.bx - p.x) * 0.006 + c2 * r2 * (best.bx - p.x) * 0.006 + (Math.random() - 0.5) * 0.6;
      p.vy = w * p.vy + c1 * r1 * (p.by - p.y) * 0.006 + c2 * r2 * (best.by - p.y) * 0.006 + (Math.random() - 0.5) * 0.6;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > vmax) { p.vx *= vmax / sp; p.vy *= vmax / sp; }
      // lực tách (kiểu boids): giữ khoảng cách để bầy trông như đàn chim, không co thành một chấm
      for (const q of this.ps) {
        if (q === p) continue;
        const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 520 && d2 > 0.01) { const k = (520 - d2) / 520 * 0.22 / Math.sqrt(d2); p.vx += dx * k; p.vy += dy * k; }
      }
      // căn hướng nhẹ theo cá thể dẫn đầu
      p.vx += (best.vx - p.vx) * 0.02; p.vy += (best.vy - p.vy) * 0.02;
      p.x += p.vx; p.y += p.vy;
      // pbest tự "phai" để bầy không đông cứng
      p.bx += (p.x - p.bx) * 0.01; p.by += (p.y - p.by) * 0.01;
    }
    this.best = best;
  }
  draw(clear) {
    const ctx = this.ctx;
    if (clear) { ctx.clearRect(0, 0, this.w, this.h); }
    else { ctx.fillStyle = 'rgba(245,240,230,0.42)'; ctx.fillRect(0, 0, this.w, this.h); }
    for (const p of this.ps) {
      const a = Math.atan2(p.vy, p.vx);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
      ctx.fillStyle = 'rgba(28,42,46,0.75)';
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, 3.2); ctx.lineTo(-2, 0); ctx.lineTo(-4, -3.2); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    if (this.best) {
      ctx.fillStyle = '#d9562f';
      ctx.fillRect(this.best.bx - 4, this.best.by - 4, 8, 8);
    }
  }
  loop() {
    if (!this.running) return;
    this.step(); this.draw(false);
    requestAnimationFrame(() => this.loop());
  }
  start() {
    if (reduceMotion) { for (let i = 0; i < 200; i++) this.step(); this.draw(true); return; }
    if (this.running) return;
    this.running = true; this.loop();
  }
  stop() { this.running = false; }
}


/* ===========================================
   SHARED HELPERS
   =========================================== */
const SI = {};
SI.lang = () => (document.documentElement.dataset.lang === 'en' ? 'en' : 'vi');
SI.t = (o) => o[SI.lang()];
SI.langHooks = [];
SI.onLang = (fn) => SI.langHooks.push(fn);

// Bộ sinh số ngẫu nhiên có hạt giống: lần trình chiếu nào cũng giống nhau
SI.rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
SI.gauss = (rnd) => { let u = 0, v = 0; while (u === 0) u = rnd(); while (v === 0) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
// Bước Lévy (thuật toán Mantegna), dùng trong HHO
SI.levy = (rnd, beta = 1.5) => {
  const g = (z) => Math.exp(lgamma(z));
  function lgamma(z) { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let x = z, y = z, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015; for (const k of c) ser += k / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); }
  const sigma = Math.pow((g(1 + beta) * Math.sin(Math.PI * beta / 2)) / (g((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)), 1 / beta);
  return 0.01 * (SI.gauss(rnd) * sigma) / Math.pow(Math.abs(SI.gauss(rnd)), 1 / beta);
};

/* ===========================================
   SHARED LANDSCAPE — cùng một "địa hình" cho mọi chương để dễ so sánh.
   Bài toán CỰC TIỂU trên [-5, 5]²: một hố toàn cục ở (2.2, -1.6) và bốn hố cục bộ.
   =========================================== */
SI.LO = -5; SI.HI = 5;
SI.WELLS = [[2.2, -1.6, 3.0, 1.1], [-2.5, 2.0, 2.3, 1.0], [-1.8, -2.6, 1.9, 0.8], [2.6, 2.7, 1.7, 0.9], [0.0, 0.5, 1.2, 0.7]];
SI.rawF = (x, y) => {
  let v = 0.04 * (x * x + y * y);
  for (const [cx, cy, d, s] of SI.WELLS) v -= d * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
  return v;
};
SI.FMIN = (() => {
  // lưới thô rồi tìm kiếm mẫu (pattern search) quanh điểm tốt nhất để có giá trị tối ưu chính xác
  let bx = 0, by = 0, m = Infinity;
  for (let i = 0; i <= 400; i++) for (let j = 0; j <= 400; j++) { const x = -5 + i / 40, y = -5 + j / 40, v = SI.rawF(x, y); if (v < m) { m = v; bx = x; by = y; } }
  for (let h = 0.025; h > 1e-9; h /= 2) {
    let moved = true;
    while (moved) { moved = false; for (const [dx, dy] of [[h, 0], [-h, 0], [0, h], [0, -h]]) { const v = SI.rawF(bx + dx, by + dy); if (v < m) { m = v; bx += dx; by += dy; moved = true; } } }
  }
  SI.XOPT = [bx, by];
  return m;
})();
SI.f = (p) => SI.rawF(p[0], p[1]) - SI.FMIN;   // giá trị tối ưu ≈ 0
SI.clamp = (v) => Math.max(SI.LO, Math.min(SI.HI, v));
SI.randPos = (rnd) => [SI.LO + rnd() * (SI.HI - SI.LO), SI.LO + rnd() * (SI.HI - SI.LO)];

/* ===========================================
   FIELD 2D — khung mô phỏng dùng chung.
   algo = { n, T, init(S), step(S), draw(g, S, P), status(S) }
   S: { rnd, pop: [{x:[..], prev:[..], ...}], best, bestF, t, T, ... }
   =========================================== */
class Field2D {
  constructor(root, algo) {
    this.root = root; this.algo = algo;
    this.cv = root.querySelector('canvas'); this.g = this.cv.getContext('2d');
    this.stat = root.querySelector('.field-stat');
    this.playBtn = root.querySelector('[data-act="play"]');
    this.slide = root.closest('.slide');
    this.speed = algo.speed || 420;
    this.heat = null; this.timer = null; this.k = 1;
    root.querySelector('[data-act="step"]').addEventListener('click', () => { this.userPaused = true; this.pause(); this.iterate(); });
    root.querySelector('[data-act="reset"]').addEventListener('click', () => { this.reset(); if (!this.userPaused && !reduceMotion) this.play(); });
    this.playBtn.addEventListener('click', () => { if (this.timer) { this.userPaused = true; this.pause(); } else { this.userPaused = false; this.play(); } });
    // tự chạy khi slide hiện ra (trừ khi người dùng đã chủ động dừng); chạy xong thì giữ nguyên kết quả
    this.slide.addEventListener('slideenter', () => { if (!reduceMotion && !this.userPaused && this.S.t < this.S.T) this.play(); });
    this.slide.addEventListener('slideleave', () => this.pause());
    window.addEventListener('resize', () => { this.size(); this.render(); });
    SI.onLang(() => { this.updateStat(); this.updatePlay(); });
    this.size(); this.reset();
  }
  size() {
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const s = Math.max(120, Math.floor(r.width));
    this.cv.width = s * dpr; this.cv.height = s * dpr; this.px = s;
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.heat = null;
  }
  P() {
    const s = this.px, k = this.k;
    const X = (x) => ((x - SI.LO) / (SI.HI - SI.LO)) * s, Y = (y) => s - ((y - SI.LO) / (SI.HI - SI.LO)) * s;
    return {
      s, X, Y,
      at: (a) => { const p = a.prev || a.x; return [X(p[0] + (a.x[0] - p[0]) * k), Y(p[1] + (a.x[1] - p[1]) * k)]; },
      pt: (x) => [X(x[0]), Y(x[1])],
    };
  }
  drawHeat() {
    // bản đồ đường mức, tô theo dải: càng thấp (tốt) càng đậm
    const n = 140, c = document.createElement('canvas'); c.width = n; c.height = n;
    const g = c.getContext('2d'), img = g.createImageData(n, n);
    const lo = [245, 240, 230], hi = [31, 111, 120];
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = SI.LO + (i + 0.5) / n * (SI.HI - SI.LO), y = SI.HI - (j + 0.5) / n * (SI.HI - SI.LO);
      const v = SI.f([x, y]);
      const band = Math.floor(Math.min(1, v / 3.6) * 12) / 12;
      const w = Math.pow(1 - band, 1.7) * 0.85;
      const o = (j * n + i) * 4;
      for (let q = 0; q < 3; q++) img.data[o + q] = lo[q] + (hi[q] - lo[q]) * w;
      img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0); this.heat = c;
  }
  render() {
    if (!this.heat) this.drawHeat();
    const g = this.g, P = this.P();
    g.imageSmoothingEnabled = true;
    g.drawImage(this.heat, 0, 0, P.s, P.s);
    // tâm hố toàn cục
    const [gx, gy] = P.pt(SI.XOPT);
    g.strokeStyle = 'rgba(245,240,230,0.9)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(gx - 6, gy); g.lineTo(gx + 6, gy); g.moveTo(gx, gy - 6); g.lineTo(gx, gy + 6); g.stroke();
    this.algo.draw(g, this.S, P);
  }
  reset() {
    this.pause();
    const S = { rnd: SI.rng(this.algo.seed || 11), t: 0, T: this.algo.T, pop: [], best: null, bestF: Infinity };
    this.S = S; this.algo.init(S); this.track();
    this.k = 1; this.render(); this.updateStat(); this.updatePlay();
  }
  track() {
    const S = this.S;
    for (const a of S.pop) { const v = SI.f(a.x); a.f = v; if (v < S.bestF) { S.bestF = v; S.best = a.x.slice(); } }
  }
  iterate() {
    const S = this.S;
    if (S.t >= S.T) { this.pause(); return; }
    S.pop.forEach((a) => (a.prev = a.x.slice()));
    S.t++; this.algo.step(S); this.track();
    this.animate();
    this.updateStat();
    if (S.t >= S.T) this.pause();
  }
  animate() {
    cancelAnimationFrame(this.raf);
    if (reduceMotion) { this.k = 1; this.render(); return; }
    const t0 = performance.now(), dur = Math.min(320, this.speed * 0.75);
    const tick = (now) => { this.k = Math.min(1, (now - t0) / dur); this.k = 1 - Math.pow(1 - this.k, 3); this.render(); if (this.k < 1) this.raf = requestAnimationFrame(tick); };
    this.raf = requestAnimationFrame(tick);
  }
  play() {
    if (this.S.t >= this.S.T) this.reset();
    clearInterval(this.timer); this.timer = setInterval(() => this.iterate(), this.speed); this.updatePlay();
  }
  pause() { clearInterval(this.timer); this.timer = null; this.updatePlay(); }
  updatePlay() {
    if (!this.playBtn) return;
    this.playBtn.textContent = this.timer ? (SI.lang() === 'en' ? '❚❚ Pause' : '❚❚ Dừng') : (SI.lang() === 'en' ? '▶ Run' : '▶ Chạy');
  }
  updateStat() {
    const S = this.S, en = SI.lang() === 'en';
    const extra = this.algo.status ? this.algo.status(S, en) : '';
    this.stat.innerHTML = `<span><b>t</b> = ${S.t} / ${S.T}</span><span><b>${en ? 'best' : 'tốt nhất'}</b> f = ${Math.max(0, S.bestF).toFixed(3)}</span>${extra}`;
  }
}
SI.Field2D = Field2D;

// Vẽ một cá thể dạng chấm/mũi tên theo hướng di chuyển
SI.dot = (g, x, y, r, fill, stroke = 'rgba(28,42,46,0.85)') => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); g.lineWidth = 1.2; g.strokeStyle = stroke; g.stroke(); };
SI.trail = (g, P, a, color = 'rgba(28,42,46,0.35)') => {
  if (!a.prev) return; const [x0, y0] = P.pt(a.prev), [x1, y1] = P.at(a);
  g.strokeStyle = color; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
};

/* ===========================================
   LANGUAGE SWITCH (dùng chung) — nút VN | EN, phím L, ?lang=en, nhớ trong trình duyệt
   Tiêu đề trang lấy từ <html data-title-vi data-title-en>
   =========================================== */
SI.setupLang = function (deck) {
  const root = document.documentElement;
  document.querySelectorAll('.slide').forEach((s) => { s.dataset.labelVi = s.getAttribute('aria-label') || ''; });
  function setLang(L, save = true) {
    L = L === 'en' ? 'en' : 'vi';
    root.dataset.lang = L; root.lang = L;
    if (root.dataset.titleVi) document.title = L === 'en' ? root.dataset.titleEn : root.dataset.titleVi;
    document.querySelectorAll('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === L)));
    document.querySelectorAll('.slide').forEach((s, i) => {
      const lab = L === 'en' ? (s.dataset.labelEn || s.dataset.labelVi) : s.dataset.labelVi;
      s.setAttribute('aria-label', lab);
      if (deck && deck.dots[i]) deck.dots[i].setAttribute('aria-label', `${i + 1}: ${lab}`);
    });
    document.querySelectorAll('a.lang-link').forEach((a) => { const u = a.getAttribute('href').split('?')[0]; a.setAttribute('href', `${u}?lang=${L}`); });
    SI.langHooks.forEach((fn) => fn(L));
    if (save) { try { localStorage.setItem('si-lang', L); } catch (e) { /* bộ nhớ bị chặn: bỏ qua */ } }
  }
  document.querySelectorAll('[data-set-lang]').forEach((b) => b.addEventListener('click', (e) => { setLang(b.dataset.setLang); e.currentTarget.blur(); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'l' || e.key === 'L') setLang(SI.lang() === 'en' ? 'vi' : 'en'); });
  let L = new URLSearchParams(location.search).get('lang');
  if (!L) { try { L = localStorage.getItem('si-lang'); } catch (e) { L = null; } }
  setLang(L || 'vi', false);
};

/* Khởi động chung: gọi sau khi chương đã đăng ký mô phỏng của mình */
SI.boot = function () {
  document.querySelectorAll('canvas[data-swarm]').forEach((c) => new SwarmCanvas(c));
  window.deck = new SlidePresentation();
  SI.setupLang(window.deck);
};
