/* Зерно 35 — плёночная камера. Всё считается на телефоне, фото никуда не отправляются. */
(() => {
  "use strict";
  const MAX = 2000, ROLL = 36;

  // ── плёнки: тон, цвет, зерно, ореол ──
  const FILMS = [
    { id: "c200", name: "Цвет 200", iso: "200", code: "ЦВ-200", c: ["#f2b33d", "#d8402f"],
      wb: [1.05, 1.0, .9], gamma: 1.03, con: .14, sh: [-.01, 0, .02], hi: [.035, .02, -.04], fade: .03, whites: .98,
      sat: 1.04, grain: .3, gc: .05, hal: .25, hc: [1, .55, .3], leak: .75 },
    { id: "c400", name: "Цвет 400", iso: "400", code: "ЦВ-400", c: ["#e98a4c", "#f6d2b4"],
      wb: [1.04, 1.0, .94], gamma: 1.05, con: .07, sh: [-.01, .01, .03], hi: [.03, .015, -.025], fade: .05, whites: .97,
      sat: .9, grain: .36, gc: .05, hal: .3, hc: [1, .55, .3], leak: .75 },
    { id: "g200", name: "Зелёная 200", iso: "200", code: "ЗЛ-200", c: ["#2f9e6b", "#cfe9bf"],
      wb: [.97, 1.02, 1.0], gamma: 1.0, con: .16, sh: [-.02, .03, .025], hi: [.025, .015, -.02], fade: .035, whites: .98,
      sat: 1.1, grain: .32, gc: .06, hal: .18, hc: [1, .5, .3], leak: .75 },
    { id: "s100", name: "Слайд 100", iso: "100", code: "СЛ-100", c: ["#7a3fd1", "#f0c4ff"],
      wb: [1.0, 1.0, 1.02], gamma: .98, con: .3, sh: [0, -.01, .035], hi: [.015, .005, 0], fade: 0, whites: 1,
      sat: 1.3, grain: .18, gc: .03, hal: .12, hc: [1, .6, .4], leak: .7 },
    { id: "t800", name: "Ночная 800T", iso: "800T", code: "НЧ-800T", c: ["#5a3fc0", "#ff6a55"],
      wb: [.86, .98, 1.14], gamma: 1.03, con: .18, sh: [-.03, .012, .045], hi: [.025, 0, -.01], fade: .03, whites: .98,
      sat: 1.05, grain: .55, gc: .08, hal: 1.1, hc: [1, .22, .12], leak: .75 },
    { id: "bw400", name: "Ч/Б 400", iso: "400", code: "ЧБ-400", c: ["#1a1a1a", "#e9e9e9"], bw: true, mix: [.36, .5, .14],
      wb: [1, 1, 1], gamma: 1.0, con: .24, sh: [0, 0, 0], hi: [0, 0, 0], fade: .04, whites: .97,
      sat: 1, grain: .7, gc: 0, hal: .2, hc: [1, 1, 1], leak: .6 },
    { id: "exp", name: "Просрочка", iso: "200", code: "ПР-200", c: ["#8a6a4a", "#e7c9a0"],
      wb: [1.04, .94, .98], gamma: 1.08, con: -.08, sh: [.05, -.02, .06], hi: [.04, .035, -.07], fade: .12, whites: .9,
      sat: .78, grain: .85, gc: .35, hal: .3, hc: [1, .5, .3], leak: 1, vigAdd: .15 }
  ];

  // ── камеры: объектив, формат и родная плёнка ──
  const CAMS = [
    { id: "ae1", name: "Canon AE-1", kind: "Зеркальная", year: "1976", lens: "Canon FD 50 мм f/1.8", film: "c400",
      desc: "Тёплый ровный цвет и мягкая виньетка. Универсальная классика.",
      sharp: .15, edge: .1, vig: .26, bloom: .12, tint: [1.02, 1, .97], con: 0, sat: 1 },
    { id: "f3", name: "Nikon F3", kind: "Зеркальная", year: "1980", lens: "Nikkor 50 мм f/1.4", film: "bw400",
      desc: "Резкая контрастная картинка. Камера фоторепортёров.",
      sharp: .5, edge: 0, vig: .18, bloom: .05, lc: .15, tint: [1, 1, 1], con: .08, sat: 1.02 },
    { id: "om1", name: "Olympus OM-1", kind: "Зеркальная", year: "1972", lens: "Zuiko 50 мм f/1.8", film: "c200",
      desc: "Мягкое свечение в светах и спокойный контраст.",
      sharp: -.15, edge: .1, vig: .22, bloom: .35, tint: [1.02, 1.01, .98], con: -.04, sat: .97 },
    { id: "k1000", name: "Pentax K1000", kind: "Зеркальная", year: "1976", lens: "SMC Pentax 50 мм f/2", film: "c200",
      desc: "Тёплая, чуть винтажная картинка студенческой классики.",
      sharp: .1, edge: .15, vig: .3, bloom: .15, tint: [1.04, 1, .95], con: .02, sat: .98 },
    { id: "srt101", name: "Minolta SR-T 101", kind: "Зеркальная", year: "1966", lens: "Rokkor 58 мм f/1.4", film: "c400",
      desc: "Тёплые тона и заметное свечение вокруг светлых мест.",
      sharp: 0, edge: .15, vig: .3, bloom: .42, tint: [1.05, 1, .93], con: -.02, sat: 1.03 },
    { id: "st801", name: "Fujica ST801", kind: "Зеркальная", year: "1972", lens: "Fujinon 55 мм f/1.8", film: "g200",
      desc: "Чёткая картинка с лёгким зелёным оттенком.",
      sharp: .3, edge: .05, vig: .22, bloom: .1, lc: .1, tint: [.98, 1.03, .99], con: .05, sat: 1.02 },
    { id: "ax", name: "Contax AX", kind: "Зеркальная", year: "1996", lens: "Carl Zeiss Planar 50 мм f/1.4", film: "s100",
      desc: "Глубокий контраст и объёмная резкость цейссовской оптики.",
      sharp: .55, edge: 0, vig: .3, bloom: .05, lc: .35, tint: [1, 1, 1.01], con: .1, sat: 1.08 },
    { id: "pen", name: "Olympus Pen", kind: "Полукадровая", year: "1959", lens: "D.Zuiko 28 мм f/3.5", film: "c400", fmt: "half",
      desc: "Полукадр: кадр 3:4 и зерно крупнее, чем на обычном кадре.",
      sharp: -.1, edge: .2, vig: .32, bloom: .2, gm: 1.4, tint: [1.02, 1, .98], con: 0, sat: 1 },
    { id: "r35", name: "Rollei 35", kind: "Компактная", year: "1966", lens: "Tessar 40 мм f/3.5", film: "bw400",
      desc: "Резкий центр и мягкие затемнённые углы.",
      sharp: .25, edge: .35, vig: .42, vs: .05, bloom: .1, tint: [1, 1, 1], con: .06, sat: 1 },
    { id: "zenit", name: "Зенит-ЕТ", kind: "Зеркальная", year: "1981", lens: "Гелиос-44-2 58 мм f/2", film: "exp",
      desc: "Гелиос закручивает фон по краям кадра, контраст низкий.",
      sharp: -.1, edge: .25, vig: .35, bloom: .4, swirl: 1, ca: .0015, tint: [1.02, 1, .98], con: -.08, sat: .92 },
    { id: "f9", name: "Kodak F9", kind: "Мыльница", year: "2020-е", lens: "31 мм f/9 · вспышка", film: "c400", flash: true,
      desc: "Пластиковый объектив: мягко, тепло, тёмные углы.",
      sharp: -.35, edge: .45, vig: .5, bloom: .3, ca: .002, barrel: .02, tint: [1.04, 1, .95], con: .05, sat: 1.05 },
    { id: "lcw", name: "Lomography LC-Wide", kind: "Широкоугольная", year: "2011", lens: "Minigon 17 мм f/4.5", film: "c200",
      desc: "Сверхширокий угол: бочка, сочный цвет и глубокая виньетка.",
      sharp: 0, edge: .4, vig: .8, vs: 0, bloom: .15, ca: .003, barrel: .13, tint: [1, 1, 1.02], con: .15, sat: 1.25 },
    { id: "m35", name: "Kodak M35", kind: "Мыльница", year: "2020-е", lens: "31 мм f/10 · вспышка", film: "c200", flash: true,
      desc: "Простая мыльница: мягкая картинка и тёплый цвет.",
      sharp: -.3, edge: .5, vig: .55, bloom: .25, ca: .0025, barrel: .025, tint: [1.05, 1, .94], con: .02, sat: 1.05 }
  ];
  const camById = Object.fromEntries(CAMS.map((c) => [c.id, c]));
  const filmById = Object.fromEntries(FILMS.map((f) => [f.id, f]));

  const $ = (id) => document.getElementById(id);
  const finder = $("finder"), photo = $("photo"), live = $("live"), gate = $("gate");
  const dev = $("dev"), tag = $("sampleTag"), toastEl = $("toast");
  const viewer = $("viewer"), vImg = $("vImg"), rollEl = $("roll");

  // ── платформа ──
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const canLive = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext !== false;
  const canShareFiles = (() => {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File([new Blob(["x"], { type: "image/jpeg" })], "t.jpg", { type: "image/jpeg" })] })); }
    catch (e) { return false; }
  })();
  const saveLabel = isIOS ? "Сохранить в Фото" : isAndroid ? "Сохранить в галерею" : "Скачать фото";
  $("finderSaveLbl").textContent = isIOS ? "В Фото" : isAndroid ? "В галерею" : "Скачать";

  // ── настройки ──
  const PREF = "zerno35v2", LIVEKEY = "zerno35-live", HINTKEY = "zerno35-hint";
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let state = { cam: "ae1", film: "c400", date: true, leak: false, border: false, flash: false, grain: 50 };
  try { Object.assign(state, JSON.parse(ls.get(PREF) || "{}")); } catch (e) {}
  if (!camById[state.cam]) state.cam = "ae1";
  if (!filmById[state.film]) state.film = camById[state.cam].film;
  if (!(state.grain >= 0 && state.grain <= 100)) state.grain = 50;
  const savePrefs = () => ls.set(PREF, JSON.stringify(state));

  // ── утилиты ──
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  function rng(s) { let x = (s * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  const rand = () => (Math.random() * 1e9) | 0;
  const pad = (n) => String(n).padStart(2, "0");
  const toBlob = (c, type, q) => new Promise((r) => { try { c.toBlob(r, type, q); } catch (e) { r(null); } });
  const fmtDate = (ms) => { const d = new Date(ms); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`; };
  let toastT;
  function toast(msg, ms) { toastEl.textContent = msg; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("on"), ms || 2800); }

  function shrinkTo(c, tw, th) {
    let cur = c;
    while (cur.width / 2 >= tw && cur.height / 2 >= th) {
      const n = mk(Math.max(tw, cur.width >> 1), Math.max(th, cur.height >> 1));
      const x = n.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(cur, 0, 0, n.width, n.height);
      cur = n;
    }
    if (cur.width !== tw || cur.height !== th) {
      const n = mk(tw, th), x = n.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(cur, 0, 0, tw, th);
      cur = n;
    }
    return cur;
  }
  function scaleDown(c, max) {
    const k = Math.min(1, max / Math.max(c.width, c.height));
    return k >= 1 ? c : shrinkTo(c, Math.max(1, Math.round(c.width * k)), Math.max(1, Math.round(c.height * k)));
  }
  function blurData(c, factor) {
    const w = c.width, h = c.height;
    let cur = shrinkTo(c, Math.max(2, Math.round(w / factor)), Math.max(2, Math.round(h / factor)));
    while (cur.width * 2 < w) {
      const n = mk(cur.width * 2, cur.height * 2), x = n.getContext("2d");
      x.imageSmoothingQuality = "high"; x.drawImage(cur, 0, 0, n.width, n.height); cur = n;
    }
    const big = mk(w, h), bx = big.getContext("2d", { willReadFrequently: true });
    bx.imageSmoothingQuality = "high"; bx.drawImage(cur, 0, 0, w, h);
    return bx.getImageData(0, 0, w, h).data;
  }

  // ── формат кадра ──
  function formatRatio(cam, land) { return cam.fmt === "half" ? (land ? 4 / 3 : 3 / 4) : (land ? 3 / 2 : 2 / 3); }
  function cropToFormat(src, cam) {
    const w = src.width, h = src.height, r = formatRatio(cam, w >= h);
    let cw = w, ch = Math.round(w / r);
    if (ch > h) { ch = h; cw = Math.round(h * r); }
    const c = mk(cw, ch);
    c.getContext("2d").drawImage(src, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, cw, ch);
    return c;
  }

  // ── бочка и хроматическая аберрация ──
  function lensGeometry(c, cam) {
    const w = c.width, h = c.height;
    const s = c.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const o = mk(w, h), ox = o.getContext("2d"), img = ox.createImageData(w, h), d = img.data;
    const cx = (w - 1) / 2, cy = (h - 1) / 2, iR = 1 / Math.hypot(cx, cy);
    const k = cam.barrel || 0, ca = cam.ca || 0, norm = 1 / ((1 + k) * (1 + ca));
    const W4 = w * 4, mx = w - 1.001, my = h - 1.001;
    const samp = (fx, fy, ch) => {
      if (fx < 0) fx = 0; else if (fx > mx) fx = mx;
      if (fy < 0) fy = 0; else if (fy > my) fy = my;
      const x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0, i = (y0 * w + x0) * 4 + ch;
      const a = s[i], b = s[i + 4], c2 = s[i + W4], e = s[i + W4 + 4];
      const t = a + (b - a) * ax, u = c2 + (e - c2) * ax;
      return t + (u - t) * ay;
    };
    let i = 0;
    for (let y = 0; y < h; y++) {
      const py = y - cy;
      for (let x = 0; x < w; x++, i += 4) {
        const px = x - cx, r2 = (px * px + py * py) * iR * iR, f = (1 + k * r2) * norm;
        if (ca) {
          const r = Math.sqrt(r2), fr = f * (1 + ca * r), fb = f * (1 - ca * r);
          d[i] = samp(cx + px * fr, cy + py * fr, 0);
          d[i + 1] = samp(cx + px * f, cy + py * f, 1);
          d[i + 2] = samp(cx + px * fb, cy + py * fb, 2);
        } else {
          const sx = cx + px * f, sy = cy + py * f;
          d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2);
        }
        d[i + 3] = 255;
      }
    }
    ox.putImageData(img, 0, 0);
    return o;
  }

  // ── закрученное размытие Гелиоса ──
  function swirlData(c, amt) {
    const w = c.width, h = c.height, o = mk(w, h), x = o.getContext("2d", { willReadFrequently: true });
    x.drawImage(c, 0, 0);
    const N = 9, A = .028 * amt;
    for (let k = 0; k < N; k++) {
      const a = -A + 2 * A * k / (N - 1);
      x.save(); x.globalAlpha = 1 / (k + 2); x.translate(w / 2, h / 2); x.rotate(a); x.drawImage(c, -w / 2, -h / 2); x.restore();
    }
    return x.getImageData(0, 0, w, h).data;
  }

  // ── тоновая кривая ──
  function buildLUT(film, cam, flash) {
    const out = [new Float32Array(256), new Float32Array(256), new Float32Array(256)];
    const tint = cam.tint || [1, 1, 1], fwb = flash ? [.97, 1, 1.05] : [1, 1, 1];
    const con = film.con + (cam.con || 0) + (flash ? .08 : 0);
    for (let c = 0; c < 3; c++) {
      const mul = film.bw ? 1 : film.wb[c] * tint[c] * fwb[c];
      for (let v = 0; v < 256; v++) {
        let x = Math.min(1, (v / 255) * mul);
        if (film.gamma !== 1) x = Math.pow(x, 1 / film.gamma);
        if (con >= 0) { const s = x * x * (3 - 2 * x); x += (s - x) * con * 2; } else x = .5 + (x - .5) * (1 + con);
        x += film.sh[c] * (1 - x) * (1 - x) + film.hi[c] * x * x;
        x = film.fade + x * (film.whites - film.fade);
        out[c][v] = x < 0 ? 0 : x > 1 ? 1 : x;
      }
    }
    return out;
  }

  // ── ореол вокруг светов ──
  function highlightGlow(srcC, w, h) {
    const qw = Math.max(2, Math.round(w / 4)), qh = Math.max(2, Math.round(h / 4));
    const q = mk(qw, qh), qx = q.getContext("2d", { willReadFrequently: true });
    qx.imageSmoothingQuality = "high"; qx.drawImage(srcC, 0, 0, qw, qh);
    const id = qx.getImageData(0, 0, qw, qh), a = id.data;
    for (let i = 0; i < a.length; i += 4) {
      let l = (a[i] * .299 + a[i + 1] * .587 + a[i + 2] * .114) / 255 - .7;
      l = l > 0 ? l * 3.33 : 0;
      a[i] = a[i + 1] = a[i + 2] = Math.min(255, l * l * 255);
    }
    qx.putImageData(id, 0, 0);
    const near = shrinkTo(q, Math.max(2, Math.round(qw / 4)), Math.max(2, Math.round(qh / 4)));
    const far = shrinkTo(q, Math.max(2, Math.round(qw / 12)), Math.max(2, Math.round(qh / 12)));
    const m = mk(qw, qh), mx = m.getContext("2d");
    mx.imageSmoothingQuality = "high";
    mx.globalAlpha = .7; mx.drawImage(near, 0, 0, qw, qh);
    mx.globalCompositeOperation = "lighter"; mx.globalAlpha = 1; mx.drawImage(far, 0, 0, qw, qh);
    const big = mk(w, h), bx = big.getContext("2d", { willReadFrequently: true });
    bx.imageSmoothingQuality = "high"; bx.drawImage(m, 0, 0, w, h);
    return bx.getImageData(0, 0, w, h).data;
  }

  // ── зерно: крупные комки + мелкий шум ──
  function grainField(w, h, rnd, gm) {
    const f = Math.max(1.3, Math.max(w, h) / 1300) * gm;
    const nw = Math.ceil(w / f), nh = Math.ceil(h / f);
    const n = mk(nw, nh), nx = n.getContext("2d");
    const id = nx.createImageData(nw, nh), a = id.data;
    for (let i = 0; i < a.length; i += 4) { const v = ((rnd() + rnd() + rnd()) * 85) | 0; a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = 255; }
    nx.putImageData(id, 0, 0);
    const big = mk(w, h), bx = big.getContext("2d", { willReadFrequently: true });
    bx.imageSmoothingEnabled = true; bx.drawImage(n, 0, 0, w, h);
    return bx.getImageData(0, 0, w, h).data;
  }

  // ── объектив + плёнка, попиксельно ──
  function filmPass(c, cam, film, s, seed, flash) {
    const w = c.width, h = c.height;
    const b = c.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const out = mk(w, h), ox = out.getContext("2d"), img = ox.createImageData(w, h), d = img.data;
    const rnd = rng(seed), bw = !!film.bw;
    const [LR, LG, LB] = buildLUT(film, cam, flash);
    const sat = film.sat * (cam.sat || 1) * (flash ? 1.05 : 1);
    const hal = film.hal, bloom = cam.bloom || 0;
    const glow = hal + bloom > 0 ? highlightGlow(c, w, h) : null;
    const g0 = hal * film.hc[0] + bloom * (bw ? .7 : .75), g1 = hal * film.hc[1] + bloom * .7, g2 = hal * film.hc[2] + bloom * (bw ? .7 : .6);
    const sharp = cam.sharp || 0, edge = cam.edge || 0, lc = cam.lc || 0, sw = cam.swirl ? swirlData(c, cam.swirl) : null;
    const swMix = Math.min(1, cam.swirl || 0);
    const usm = sharp > 0 ? sharp * 1.5 : 0, softK = sharp < 0 ? -sharp * .8 : 0;
    const bs = usm > 0 ? blurData(c, 3) : null;
    const bsoft = softK > 0 || edge > 0 ? blurData(c, 7) : null;
    const bl = lc > 0 ? blurData(c, 28) : null;
    const vig = (cam.vig || 0) + (film.vigAdd || 0) + (flash ? .15 : 0), vs = cam.vs != null ? cam.vs : .1, ivs = 1 / (1 - vs);
    const gm = cam.gm || 1, gAmt = film.grain * (s.grain / 50) * gm;
    const nz = gAmt > 0 ? grainField(w, h, rnd, gm) : null;
    const gc = film.gc;
    const m0 = bw ? film.mix[0] : 0, m1 = bw ? film.mix[1] : 0, m2 = bw ? film.mix[2] : 0;
    const cx = w / 2, cy = h / 2, ix = 1 / cx, iy = 1 / cy;
    let i = 0;
    for (let y = 0; y < h; y++) {
      const dy = (y - cy) * iy, dy2 = dy * dy;
      for (let x = 0; x < w; x++, i += 4) {
        const dx = (x - cx) * ix, t = (dx * dx + dy2) * .5;
        let R = b[i], G = b[i + 1], B = b[i + 2];
        if (sw) {
          let m = (t - .12) * 1.6;
          if (m > 0) { if (m > 1) m = 1; m = m * m * (3 - 2 * m) * swMix; R += (sw[i] - R) * m; G += (sw[i + 1] - G) * m; B += (sw[i + 2] - B) * m; }
        }
        let em = 0;
        if (edge > 0) { let e = (t - .15) * 1.18; if (e > 0) { if (e > 1) e = 1; em = e * e * (3 - 2 * e) * edge; } }
        if (bs) { const k = usm * (1 - em); R += (R - bs[i]) * k; G += (G - bs[i + 1]) * k; B += (B - bs[i + 2]) * k; }
        if (bl) { R += (R - bl[i]) * lc; G += (G - bl[i + 1]) * lc; B += (B - bl[i + 2]) * lc; }
        if (bsoft) {
          let m = softK + em;
          if (m > 0) { if (m > 1) m = 1; R += (bsoft[i] - R) * m; G += (bsoft[i + 1] - G) * m; B += (bsoft[i + 2] - B) * m; }
        }
        if (flash) {
          let fz = 1 - t * 1.2; if (fz < 0) fz = 0;
          const fg = 1 + .4 * fz * fz * (3 - 2 * fz); R *= fg; G *= fg; B *= fg;
        }
        R = R < 0 ? 0 : R > 255 ? 255 : R | 0;
        G = G < 0 ? 0 : G > 255 ? 255 : G | 0;
        B = B < 0 ? 0 : B > 255 ? 255 : B | 0;
        let r, g, bb;
        if (bw) { let l = (R * m0 + G * m1 + B * m2) | 0; if (l > 255) l = 255; r = g = bb = LR[l]; }
        else {
          r = LR[R]; g = LG[G]; bb = LB[B];
          if (sat !== 1) { const l = .299 * r + .587 * g + .114 * bb; r = l + (r - l) * sat; g = l + (g - l) * sat; bb = l + (bb - l) * sat; }
        }
        if (glow) {
          let gg = glow[i] * (2 / 255); if (gg > 1) gg = 1;
          if (gg > .002) { const k = gg * (1 - .55 * (.299 * r + .587 * g + .114 * bb)); r += k * g0; g += k * g1; bb += k * g2; }
        }
        if (vig > 0) {
          let u = (t - vs) * ivs;
          if (u > 0) { if (u > 1) u = 1; u = u * u * (3 - 2 * u); let v = 1 - vig * u; if (v < .05) v = .05; r *= v; g *= v; bb *= v; }
        }
        if (nz) {
          let l = .299 * r + .587 * g + .114 * bb; l = l < 0 ? 0 : l > 1 ? 1 : l;
          const k = gAmt * .2 * (.35 + 2.6 * l * (1 - l));
          const n = (nz[i] - 128) * (.75 / 128) + (rnd() - .5) * .9;
          if (gc > 0) { r += (n + (rnd() - .5) * gc) * k; g += (n + (rnd() - .5) * gc) * k; bb += (n + (rnd() - .5) * gc) * k; }
          else { const a = n * k; r += a; g += a; bb += a; }
        }
        d[i] = r * 255; d[i + 1] = g * 255; d[i + 2] = bb * 255; d[i + 3] = 255;
      }
    }
    ox.putImageData(img, 0, 0);
    return out;
  }

  // ── засвет ──
  function lightLeak(x, w, h, sd, str) {
    const r = rng(sd * 7 + 3), L = Math.max(w, h);
    const side = Math.floor(r() * 4);
    let cx, cy;
    if (side === 0) { cx = -L * .04; cy = h * (.15 + r() * .7); }
    else if (side === 1) { cx = w + L * .04; cy = h * (.15 + r() * .7); }
    else if (side === 2) { cx = w * (.1 + r() * .8); cy = -L * .04; }
    else { cx = r() < .5 ? -L * .03 : w + L * .03; cy = h + L * .03; }
    x.save(); x.globalCompositeOperation = "screen";
    const blobs = [[240, 80, 180, .32, 1.0], [255, 45, 55, .55, .75], [255, 105, 30, .8, .5], [255, 215, 130, .7, .24]];
    for (const [R, G, B, a, rad] of blobs) {
      const rr = L * rad * (.7 + r() * .45) * (.65 + str * .35);
      const ox = cx + (r() - .5) * L * .12, oy = cy + (r() - .5) * L * .12;
      const g = x.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0, `rgba(${R},${G},${B},${a * str})`);
      g.addColorStop(.45, `rgba(${R},${G},${B},${a * str * .42})`);
      g.addColorStop(1, `rgba(${R},${G},${B},0)`);
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    }
    if (side < 2) {
      const bw = L * (.05 + r() * .06), bx = side === 0 ? L * (.02 + r() * .08) : w - L * (.02 + r() * .08) - bw;
      const g = x.createLinearGradient(bx, 0, bx + bw, 0);
      g.addColorStop(0, "rgba(255,120,40,0)"); g.addColorStop(.5, `rgba(255,120,40,${.28 * str})`); g.addColorStop(1, "rgba(255,120,40,0)");
      x.fillStyle = g; x.fillRect(bx, 0, bw, h);
    }
    x.restore();
  }

  // ── дата семисегментными цифрами ──
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function digitPath(x, ox, oy, H, segs) {
    const W = H * .56, t = H * .13, g = t * .2;
    const hz = (x0, x1, y) => { x.moveTo(x0, y); x.lineTo(x0 + t / 2, y - t / 2); x.lineTo(x1 - t / 2, y - t / 2); x.lineTo(x1, y); x.lineTo(x1 - t / 2, y + t / 2); x.lineTo(x0 + t / 2, y + t / 2); x.closePath(); };
    const vt = (xx, y0, y1) => { x.moveTo(xx, y0); x.lineTo(xx + t / 2, y0 + t / 2); x.lineTo(xx + t / 2, y1 - t / 2); x.lineTo(xx, y1); x.lineTo(xx - t / 2, y1 - t / 2); x.lineTo(xx - t / 2, y0 + t / 2); x.closePath(); };
    const L = ox + t / 2, R = ox + W - t / 2, T = oy + t / 2, M = oy + H / 2, B = oy + H - t / 2;
    for (const s of segs) {
      if (s === "a") hz(L + g, R - g, T);
      else if (s === "g") hz(L + g, R - g, M);
      else if (s === "d") hz(L + g, R - g, B);
      else if (s === "f") vt(L, T + g, M - g);
      else if (s === "b") vt(R, T + g, M - g);
      else if (s === "e") vt(L, M + g, B - g);
      else if (s === "c") vt(R, M + g, B - g);
    }
  }
  const dateText = (d) => `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`;
  function dateStamp(x, w, h, date) {
    const S = Math.min(w, h), H = S * .045;
    const text = dateText(date);
    const adv = H * .76, sp = H * .42, ap = H * .3;
    let total = 0;
    for (const ch of text) total += ch === "'" ? ap : ch === " " ? sp : adv;
    const ox = w - S * .055 - total, oy = h - S * .055 - H;
    x.save();
    x.translate(ox, oy); x.transform(1, 0, -.12, 1, H * .12, 0);
    x.beginPath();
    let cx = 0;
    for (const ch of text) {
      if (ch === "'") { x.rect(cx + H * .06, 0, H * .11, H * .3); cx += ap; }
      else if (ch === " ") cx += sp;
      else { digitPath(x, cx, 0, H, SEG[ch]); cx += adv; }
    }
    x.globalCompositeOperation = "screen";
    x.shadowColor = "rgba(255,100,20,.95)"; x.shadowBlur = H * .55; x.fillStyle = "rgba(255,130,45,.9)"; x.fill();
    x.shadowBlur = H * .12; x.fillStyle = "rgba(255,196,120,.85)"; x.fill();
    x.restore();
  }

  // ── рамка 35-мм плёнки с перфорацией ──
  function rrect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
  function filmBorder(img, film, cam, n) {
    const iw = img.width, ih = img.height, half = cam.fmt === "half";
    const vertical = half ? iw > ih : ih > iw;
    const A = vertical ? ih : iw, B = vertical ? iw : ih;
    const s = B / 24, reb = Math.round(5.5 * s), gap = Math.round(2.2 * s);
    const Lw = A + 2 * gap, Lh = B + 2 * reb;
    const d = mk(Lw, Lh), x = d.getContext("2d");
    x.fillStyle = "#0e0a0d"; x.fillRect(0, 0, Lw, Lh);
    const pitch = 4.75 * s, hw = 2.8 * s, hh = 1.98 * s;
    const start = (Lw - Math.floor(Lw / pitch) * pitch) / 2 + (pitch - hw) / 2;
    x.fillStyle = "#f3e9dd";
    for (let X = start - pitch; X < Lw; X += pitch) for (const yc of [2 * s, Lh - 2 * s]) { rrect(x, X, yc - hh / 2, hw, hh, .4 * s); x.fill(); }
    const fs = 1.35 * s;
    x.font = `700 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
    x.fillStyle = "#ee9a3e"; x.shadowColor = "rgba(238,140,50,.6)"; x.shadowBlur = s * .4;
    const topY = reb - .9 * s, botY = reb + B + .95 * s + fs * .74, nn = pad(n);
    x.fillText(`ЗЕРНО ${film.iso}`, gap + s, topY);
    if (A > 30 * s) x.fillText(film.code, gap + A * .6, topY);
    x.fillText(nn, gap + A * (half ? .1 : .2), botY);
    const tx = gap + A * (half ? .45 : .62), ty = botY - fs * .36;
    x.beginPath(); x.moveTo(tx, ty - fs * .32); x.lineTo(tx + fs * .55, ty); x.lineTo(tx, ty + fs * .32); x.closePath(); x.fill();
    x.fillText(nn + "A", tx + fs * .85, botY);
    x.shadowBlur = 0;
    if (A > 30 * s) {
      x.globalAlpha = .85;
      let bx = gap + A * .36; const by = reb + B + .75 * s;
      for (const bit of [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1]) { if (bit) x.fillRect(bx, by, .32 * s, s); bx += .55 * s; }
      x.globalAlpha = 1;
    }
    const out = vertical ? mk(Lh, Lw) : mk(Lw, Lh), o = out.getContext("2d");
    if (vertical) { o.save(); o.translate(Lh, 0); o.rotate(Math.PI / 2); o.drawImage(d, 0, 0); o.restore(); o.drawImage(img, reb, gap); }
    else { o.drawImage(d, 0, 0); o.drawImage(img, gap, reb); }
    return out;
  }

  function pipeline(src, f) {
    const s = f.set, cam = camById[s.cam], film = filmById[s.film];
    const flash = !!(s.flash && cam.flash);
    const orig = cropToFormat(src, cam);
    const geo = cam.barrel || cam.ca ? lensGeometry(orig, cam) : orig;
    let out = filmPass(geo, cam, film, s, f.seed, flash);
    const x = out.getContext("2d");
    if (s.leak) lightLeak(x, out.width, out.height, f.leakSeed, film.leak);
    if (s.date) dateStamp(x, out.width, out.height, new Date(f.shot));
    if (s.border) out = filmBorder(out, film, cam, f.n || 1);
    return { out, orig };
  }

  // ── пример кадра: рисуется кодом, чтобы приложение сразу показывало результат ──
  function sampleScene() {
    const w = 1500, h = 1000, c = mk(w, h), x = c.getContext("2d"), r = rng(11);
    let g = x.createLinearGradient(0, 0, 0, 720);
    g.addColorStop(0, "#4b7bb4"); g.addColorStop(.45, "#9db2d6"); g.addColorStop(.78, "#efc6a6"); g.addColorStop(1, "#ffcd88");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const sx = 1090, sy = 445;
    g = x.createRadialGradient(sx, sy, 0, sx, sy, 440);
    g.addColorStop(0, "rgba(255,238,196,.95)"); g.addColorStop(.13, "rgba(255,214,150,.7)"); g.addColorStop(1, "rgba(255,190,130,0)");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = "#fffbf2"; x.beginPath(); x.arc(sx, sy, 44, 0, 7); x.fill();
    for (let i = 0; i < 14; i++) {
      const cx = r() * w, cy = 70 + r() * 290, rx = 120 + r() * 230, ry = 16 + r() * 30;
      g = x.createRadialGradient(cx, cy, 0, cx, cy, rx);
      g.addColorStop(0, "rgba(255,242,236,.5)"); g.addColorStop(1, "rgba(255,242,236,0)");
      x.save(); x.translate(cx, cy); x.scale(1, ry / rx); x.translate(-cx, -cy);
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rx, 0, 7); x.fill(); x.restore();
    }
    x.fillStyle = "#7d7192"; x.beginPath(); x.moveTo(0, 700);
    for (let X = 0; X <= w; X += 18) x.lineTo(X, 612 - Math.sin(X / 85) * 10 - r() * 16);
    x.lineTo(w, 700); x.closePath(); x.fill();
    const blds = [[30, 250, 540, "#5b4d66"], [300, 200, 480, "#4c4058"], [520, 270, 590, "#66566e"], [810, 180, 505, "#53465f"], [1000, 310, 600, "#5e5068"], [1320, 170, 530, "#4a3f56"]];
    for (const [bx, bw, top, col] of blds) {
      x.fillStyle = col; x.fillRect(bx, top, bw, 770 - top);
      x.fillStyle = "rgba(255,190,140,.2)"; x.fillRect(bx, top, 7, 770 - top);
      const cols = Math.floor((bw - 12) / 26), rows = Math.floor((750 - top) / 30);
      for (let ci = 0; ci < cols; ci++) for (let ri = 0; ri < rows; ri++) {
        const lit = r() < .24;
        x.fillStyle = lit ? (r() < .5 ? "#ffd486" : "#fff0c4") : "rgba(30,26,44,.55)";
        x.fillRect(bx + 10 + ci * 26, top + 14 + ri * 30, 13, 15);
      }
    }
    g = x.createLinearGradient(0, 760, 0, h); g.addColorStop(0, "#4d5437"); g.addColorStop(1, "#1d2215");
    x.fillStyle = g; x.fillRect(0, 760, w, h - 760);
    x.fillStyle = "#5c5462"; x.beginPath(); x.moveTo(600, h); x.lineTo(770, 770); x.lineTo(830, 770); x.lineTo(1080, h); x.closePath(); x.fill();
    g = x.createLinearGradient(0, 770, 0, h); g.addColorStop(0, "rgba(255,205,140,.35)"); g.addColorStop(1, "rgba(255,205,140,0)");
    x.fillStyle = g; x.beginPath(); x.moveTo(760, 790); x.lineTo(840, 790); x.lineTo(930, h); x.lineTo(820, h); x.closePath(); x.fill();
    for (const [lx, ly, lh] of [[560, 640, 230], [1140, 660, 220]]) {
      x.fillStyle = "#231c27"; x.fillRect(lx, ly, 6, lh);
      g = x.createRadialGradient(lx + 3, ly, 0, lx + 3, ly, 40); g.addColorStop(0, "rgba(255,240,200,1)"); g.addColorStop(.3, "rgba(255,210,140,.6)"); g.addColorStop(1, "rgba(255,200,130,0)");
      x.fillStyle = g; x.beginPath(); x.arc(lx + 3, ly, 40, 0, 7); x.fill();
    }
    for (const [tx, ty, s] of [[110, 770, 1.25], [270, 800, .9], [1410, 780, 1.3], [1250, 815, .85]]) {
      x.fillStyle = "#2a2018"; x.fillRect(tx - 7 * s, ty, 14 * s, 150 * s);
      for (let k = 0; k < 9; k++) {
        const fx = tx + (r() - .5) * 150 * s, fy = ty - 20 * s + (r() - .6) * 150 * s, fr = (45 + r() * 40) * s;
        x.fillStyle = k % 2 ? "#2b3a22" : "#33462a"; x.beginPath(); x.arc(fx, fy, fr, 0, 7); x.fill();
        x.fillStyle = "rgba(255,200,120,.12)"; x.beginPath(); x.arc(fx + fr * .3, fy - fr * .3, fr * .6, 0, 7); x.fill();
      }
    }
    return c;
  }

  // ── хранилище плёнки на телефоне ──
  const idb = (() => {
    let dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = Promise.race([
        new Promise((res) => {
          try {
            const rq = indexedDB.open("zerno35", 1);
            rq.onupgradeneeded = () => { try { rq.result.createObjectStore("frames", { keyPath: "id" }); } catch (e) {} };
            rq.onsuccess = () => res(rq.result);
            rq.onerror = () => res(null);
            rq.onblocked = () => res(null);
          } catch (e) { res(null); }
        }),
        new Promise((res) => setTimeout(() => res(null), 2500))
      ]);
      return dbp;
    }
    async function run(mode, fn) {
      const db = await open();
      if (!db) return null;
      return new Promise((res) => {
        try {
          const t = db.transaction("frames", mode), rq = fn(t.objectStore("frames"));
          t.oncomplete = () => res(rq && "result" in rq ? rq.result : true);
          t.onerror = t.onabort = () => res(null);
        } catch (e) { res(null); }
      });
    }
    return {
      all: () => run("readonly", (s) => s.getAll()),
      put: (o) => run("readwrite", (s) => s.put(o)),
      clear: () => run("readwrite", (s) => s.clear())
    };
  })();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  // ── кадры ──
  let frames = [];
  let sampleCanvas = null;
  const sample = { id: "sample", isSample: true, n: 0, set: { ...state }, seed: 7, leakSeed: 3, shot: Date.now() };
  for (let s = 1; s < 50; s++) { if (Math.floor(rng(s * 7 + 3)() * 4) < 2) { sample.leakSeed = s; break; } }
  let current = sample;
  let origURL = null;
  let mode = "edit";            // "live" — видоискатель, "edit" — готовый кадр
  let returnToLive = false;

  function setURL(f, key, blob) {
    f[key] = blob;
    const old = f[key + "URL"];
    f[key + "URL"] = blob ? URL.createObjectURL(blob) : null;
    if (old) setTimeout(() => URL.revokeObjectURL(old), 4000);
  }
  function decodeBlob(blob) {
    return new Promise((res) => {
      if (!blob) return res(null);
      const u = URL.createObjectURL(blob), im = new Image();
      im.onload = () => { const c = mk(im.naturalWidth, im.naturalHeight); c.getContext("2d").drawImage(im, 0, 0); URL.revokeObjectURL(u); res(c); };
      im.onerror = () => { URL.revokeObjectURL(u); res(null); };
      im.src = u;
    });
  }
  function getSrc(f) {
    if (f.isSample) return Promise.resolve(sampleCanvas);
    if (!f._srcP) f._srcP = decodeBlob(f.src);
    return f._srcP;
  }
  const persistT = {};
  function persist(f) {
    if (f.isSample) return;
    clearTimeout(persistT[f.id]);
    persistT[f.id] = setTimeout(() => {
      idb.put({ id: f.id, n: f.n, set: f.set, seed: f.seed, leakSeed: f.leakSeed, shot: f.shot, src: f.src, out: f.out, thumb: f.thumb, saved: !!f.saved });
    }, 300);
  }

  // ── проявка ──
  let token = 0, devTimer = null;
  function requestDevelop(delay) { clearTimeout(devTimer); devTimer = setTimeout(developCurrent, delay == null ? 90 : delay); }
  async function developCurrent() {
    clearTimeout(devTimer);
    const my = ++token, f = current;
    dev.hidden = false;
    const src = await getSrc(f);
    if (my !== token) return false;
    if (!src) { dev.hidden = true; toast("Не получилось открыть кадр. Попробуй снять заново."); return false; }
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 16)));
    if (my !== token) return false;
    let res = null;
    try { res = pipeline(src, f); } catch (e) { console.error(e); }
    if (!res) { dev.hidden = true; toast("Не получилось проявить кадр. Попробуй фото поменьше."); return false; }
    const blob = await toBlob(res.out, "image/jpeg", .92);
    const thumb = f.isSample ? null : await toBlob(scaleDown(res.out, 360), "image/jpeg", .8);
    const ob = await toBlob(res.orig, "image/jpeg", .85);
    if (my !== token) return false;
    dev.hidden = true;
    if (!blob) { toast("Не хватило памяти на кадр. Закрой лишние приложения и попробуй ещё раз."); return false; }
    setURL(f, "out", blob);
    if (thumb) setURL(f, "thumb", thumb);
    if (origURL) URL.revokeObjectURL(origURL);
    origURL = ob ? URL.createObjectURL(ob) : null;
    if (current === f) photo.src = f.outURL;
    if (!f.isSample) { f.saved = false; persist(f); paintRollBtn(); if (!rollEl.hidden) renderRoll(); }
    return true;
  }

  // ── живой видоискатель ──
  let stream = null, facing = "environment", multiCam = false, liveDenied = false, resumeLive = false;
  let liveEver = ls.get(LIVEKEY) === "1";
  const gTint = $("gTint"), gVig = $("gVig"), gGrain = $("gGrain"), gDate = $("gDate");

  function layoutGate() {
    const vw = live.videoWidth, vh = live.videoHeight;
    if (!vw || !vh) { gate.style.visibility = "hidden"; return; }
    const fw = finder.clientWidth, fh = finder.clientHeight, k = Math.min(fw / vw, fh / vh);
    const dw = vw * k, dh = vh * k, r = formatRatio(camById[state.cam], vw >= vh);
    let cw = dw, ch = dw / r;
    if (ch > dh) { ch = dh; cw = dh * r; }
    Object.assign(gate.style, { visibility: "visible", left: (fw - cw) / 2 + "px", top: (fh - ch) / 2 + "px", width: cw + "px", height: ch + "px" });
    gate.style.setProperty("--gs", Math.min(cw, ch) + "px");
  }
  function applyLiveLook() {
    const cam = camById[state.cam], film = filmById[state.film], flash = !!(state.flash && cam.flash), t = cam.tint || [1, 1, 1];
    const con = (1 + (film.con + (cam.con || 0) + (flash ? .08 : 0)) * .9) * (1 - film.fade * .8);
    const sat = film.bw ? 1 : film.sat * (cam.sat || 1) * (flash ? 1.05 : 1);
    const bright = (flash ? 1.12 : 1) * (1 + film.fade * .6) * (1 + (film.gamma - 1) * .6);
    const blur = (cam.sharp || 0) < 0 ? Math.min(1.2, -cam.sharp * 1.4) : 0;
    live.style.filter = `${film.bw ? "grayscale(1) " : ""}contrast(${con.toFixed(3)}) saturate(${sat.toFixed(3)}) brightness(${bright.toFixed(3)})${blur ? ` blur(${blur.toFixed(2)}px)` : ""}`;
    if (film.bw) gTint.style.opacity = "0";
    else {
      const m = [film.wb[0] * t[0], film.wb[1] * t[1], film.wb[2] * t[2]], avg = (m[0] + m[1] + m[2]) / 3;
      const col = m.map((v) => Math.max(0, Math.min(255, Math.round(128 + (v - avg) * 1500))));
      gTint.style.background = `rgb(${col.join(",")})`; gTint.style.opacity = ".6";
    }
    const vig = (cam.vig || 0) + (film.vigAdd || 0) + (flash ? .15 : 0), vs = cam.vs != null ? cam.vs : .1;
    gVig.style.background = `radial-gradient(ellipse at center, rgba(20,8,24,0) ${Math.round(30 + vs * 120)}%, rgba(20,8,24,${Math.min(.92, vig * .9).toFixed(2)}) 100%)`;
    gGrain.style.opacity = Math.min(.6, film.grain * (state.grain / 50) * (cam.gm || 1) * .45).toFixed(2);
    gDate.hidden = !state.date;
    gDate.textContent = dateText(new Date());
    layoutGate();
  }
  async function countCams() {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      multiCam = list.filter((d) => d.kind === "videoinput").length > 1;
    } catch (e) { multiCam = false; }
    $("flipCam").hidden = mode !== "live" || !multiCam;
  }
  function stopLive() {
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
    try { live.srcObject = null; } catch (e) {}
  }
  async function startLive() {
    if (!canLive) return false;
    stopLive();
    let s = null;
    try {
      s = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: facing }, width: { ideal: 2560 }, height: { ideal: 1920 } } });
    } catch (e) {
      liveDenied = true;
      const denied = e && (e.name === "NotAllowedError" || e.name === "SecurityError");
      toast(denied
        ? "Нет доступа к камере. Разреши его в настройках браузера, а пока спуск откроет обычную камеру телефона"
        : "Камера не запустилась. Спуск откроет обычную камеру телефона", 4500);
      setMode("edit");
      return false;
    }
    stream = s; liveDenied = false; liveEver = true; ls.set(LIVEKEY, "1");
    live.srcObject = s;
    live.style.transform = facing === "user" ? "scaleX(-1)" : "";
    setMode("live");
    try { await live.play(); } catch (e) {}
    countCams();
    return true;
  }
  live.addEventListener("loadedmetadata", layoutGate);
  live.addEventListener("resize", layoutGate);
  if (window.ResizeObserver) new ResizeObserver(() => { if (mode === "live") layoutGate(); }).observe(finder);
  else window.addEventListener("resize", () => { if (mode === "live") layoutGate(); });

  function setMode(m) {
    mode = m;
    const isLive = m === "live";
    live.hidden = !isLive; gate.hidden = !isLive; photo.hidden = isLive;
    $("compare").hidden = isLive; $("finderSave").hidden = isLive; $("expand").hidden = isLive;
    $("flipCam").hidden = !isLive || !multiCam;
    $("toLive").hidden = isLive || !canLive || !(liveEver || liveDenied);
    $("camStart").hidden = isLive || !canLive || liveEver || liveDenied;
    tag.hidden = isLive || !current.isSample;
    $("btnShoot").setAttribute("aria-label", isLive || !canLive || liveDenied ? "Снять кадр" : "Включить камеру");
    $("reroll").disabled = !state.leak || isLive;
    if (isLive) applyLiveLook(); else stopLive();
  }

  function grabFrame() {
    const w = live.videoWidth, h = live.videoHeight;
    if (!w || !h) return null;
    const k = Math.min(1, MAX / Math.max(w, h));
    const c = mk(Math.round(w * k), Math.round(h * k)), x = c.getContext("2d");
    x.imageSmoothingQuality = "high";
    if (facing === "user") { x.translate(c.width, 0); x.scale(-1, 1); }
    x.drawImage(live, 0, 0, c.width, c.height);
    return c;
  }
  async function captureLive() {
    const c = grabFrame();
    if (!c) { toast("Камера ещё не готова, подожди секунду"); return; }
    finder.classList.remove("snap"); void finder.offsetWidth; finder.classList.add("snap");
    try { if (navigator.vibrate) navigator.vibrate(25); } catch (e) {}
    live.pause();
    await addShotCanvas(c, Date.now(), true);
  }

  // ── интерфейс ──
  const camsEl = $("cams"), filmsEl = $("films");
  const camEls = CAMS.map((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "cam"; b.dataset.id = c.id;
    const k = document.createElement("span"); k.className = "cam-k"; k.textContent = `${c.kind} · ${c.year}`;
    const n = document.createElement("span"); n.className = "cam-n"; n.textContent = c.name;
    b.append(k, n);
    b.addEventListener("click", () => {
      if (state.cam === c.id) return;
      state.cam = c.id; state.film = c.film;
      if (!c.flash) state.flash = false;
      changed();
      scrollFilmIntoView(true);
    });
    camsEl.appendChild(b);
    return b;
  });
  const filmEls = FILMS.map((f) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.id = f.id;
    const dot = document.createElement("span"); dot.className = "dot";
    dot.style.setProperty("--c1", f.c[0]); dot.style.setProperty("--c2", f.c[1]);
    b.append(dot, document.createTextNode(f.name));
    b.addEventListener("click", () => { if (state.film === f.id) return; state.film = f.id; changed(); });
    filmsEl.appendChild(b);
    return b;
  });

  function paintAll() {
    const cam = camById[state.cam], film = filmById[state.film];
    camEls.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === state.cam)));
    filmEls.forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.id === state.film));
      const native = b.dataset.id === cam.film;
      b.classList.toggle("native", native);
      b.title = native ? "Родная плёнка этой камеры" : "";
    });
    $("dLens").textContent = cam.lens;
    $("dText").textContent = cam.desc;
    $("tDate").setAttribute("aria-pressed", String(!!state.date));
    $("tLeak").setAttribute("aria-pressed", String(!!state.leak));
    $("tBorder").setAttribute("aria-pressed", String(!!state.border));
    $("tFlash").setAttribute("aria-pressed", String(!!state.flash));
    $("tFlash").hidden = !cam.flash;
    $("reroll").disabled = !state.leak || mode === "live";
    $("grain").value = state.grain; $("grainVal").textContent = state.grain;
    $("frameNo").textContent = pad(frames.length);
    $("isoLbl").textContent = "ISO " + film.iso;
    tag.hidden = mode === "live" || !current.isSample;
  }
  function centerIn(box, el, smooth) {
    if (!el) return;
    const l = el.offsetLeft, r = l + el.offsetWidth;
    if (l >= box.scrollLeft + 8 && r <= box.scrollLeft + box.clientWidth - 8) return;
    box.scrollTo({ left: Math.max(0, l - box.clientWidth / 2 + el.offsetWidth / 2), behavior: smooth ? "smooth" : "auto" });
  }
  function scrollFilmIntoView(smooth) { centerIn(filmsEl, filmEls.find((e) => e.dataset.id === state.film), smooth); }
  function scrollCamIntoView() {
    centerIn(camsEl, camEls.find((e) => e.dataset.id === state.cam), false);
    scrollFilmIntoView(false);
  }
  function changed(delay) {
    savePrefs(); paintAll();
    if (mode === "live") applyLiveLook();
    else { current.set = { ...state }; requestDevelop(delay); }
  }
  function bindToggle(id, key) { $(id).addEventListener("click", () => { state[key] = !state[key]; changed(); }); }
  bindToggle("tDate", "date"); bindToggle("tLeak", "leak"); bindToggle("tBorder", "border"); bindToggle("tFlash", "flash");
  $("reroll").addEventListener("click", () => { if (mode === "live") return; current.leakSeed = rand(); requestDevelop(0); });
  const grainIn = $("grain");
  grainIn.addEventListener("input", () => { $("grainVal").textContent = grainIn.value; if (mode === "live") { state.grain = +grainIn.value; applyLiveLook(); } });
  grainIn.addEventListener("change", () => { state.grain = +grainIn.value; changed(60); });

  const rollSvg = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M7 5v4M11 5v4M15 5v4M7 15v4M11 15v4M15 15v4"/></svg>';
  function paintRollBtn() {
    const n = frames.length, badge = $("rollBadge"), ic = $("rollIc");
    badge.hidden = n === 0; badge.textContent = n;
    const last = frames[n - 1], img = ic.querySelector("img");
    if (last && last.thumbURL) {
      if (img) img.src = last.thumbURL;
      else { const im = document.createElement("img"); im.alt = ""; im.src = last.thumbURL; ic.replaceChildren(im); }
    } else if (img) ic.innerHTML = rollSvg;
    $("frameNo").textContent = pad(n);
  }

  function selectFrame(f) {
    if (current !== f && !current.isSample) current._srcP = null;
    current = f;
    state = { ...f.set };
    if (origURL) { URL.revokeObjectURL(origURL); origURL = null; }
    ++token; clearTimeout(devTimer); dev.hidden = true;
    setMode("edit");
    paintAll(); scrollCamIntoView();
    if (f.outURL) photo.src = f.outURL; else requestDevelop(0);
  }

  // ── съёмка ──
  function loadFileToCanvas(file) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        const k = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight));
        const w = Math.max(1, Math.round(im.naturalWidth * k)), h = Math.max(1, Math.round(im.naturalHeight * k));
        const c = mk(w, h), x = c.getContext("2d");
        x.imageSmoothingQuality = "high"; x.drawImage(im, 0, 0, w, h);
        URL.revokeObjectURL(u); res(c);
      };
      im.onerror = () => { URL.revokeObjectURL(u); rej(new Error("decode")); };
      im.src = u;
    });
  }
  function rollFull() {
    if (frames.length < ROLL) return false;
    openRoll(); toast("Плёнка закончилась: 36 из 36");
    return true;
  }
  async function addShotCanvas(src, shot, backToLive) {
    dev.hidden = false;
    const srcBlob = await toBlob(src, "image/jpeg", .92);
    const n = (frames.length ? frames[frames.length - 1].n : 0) + 1;
    const f = {
      id: "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      n, set: { ...state }, seed: rand(), leakSeed: rand(), shot, src: srcBlob, saved: false
    };
    f._srcP = Promise.resolve(src);
    if (!current.isSample) current._srcP = null;
    frames.push(f); current = f;
    if (origURL) { URL.revokeObjectURL(origURL); origURL = null; }
    paintAll(); paintRollBtn();
    returnToLive = backToLive;
    const ok = await developCurrent();
    if (ok && current === f) {
      if (mode !== "live") photo.src = f.outURL;
      openViewer(f);
    } else if (mode === "live") {
      live.play().catch(() => {});
    }
  }
  async function addShotFile(file, fromCamera) {
    if (!file || rollFull()) return;
    const wasLive = mode === "live";
    dev.hidden = false;
    let src;
    try { src = await loadFileToCanvas(file); }
    catch (e) { dev.hidden = true; toast("Не получилось открыть фото. Попробуй JPG или PNG."); return; }
    await addShotCanvas(src, fromCamera ? Date.now() : (file.lastModified || Date.now()), wasLive);
  }
  $("btnShoot").addEventListener("click", () => {
    if (rollFull()) return;
    if (mode === "live") { if (stream) captureLive(); else startLive(); return; }
    if (canLive && !liveDenied) { startLive(); return; }
    $("shoot").click();
  });
  $("camStartBtn").addEventListener("click", startLive);
  $("toLive").addEventListener("click", startLive);
  $("flipCam").addEventListener("click", () => { facing = facing === "user" ? "environment" : "user"; startLive(); });
  $("btnPick").addEventListener("click", () => { if (!rollFull()) $("pick").click(); });
  $("shoot").addEventListener("change", (e) => { const f = e.target.files[0]; e.target.value = ""; addShotFile(f, true); });
  $("pick").addEventListener("change", (e) => { const f = e.target.files[0]; e.target.value = ""; addShotFile(f, false); });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (stream) { stopLive(); resumeLive = true; } }
    else if (resumeLive) { resumeLive = false; if (mode === "live" && viewer.hidden) startLive(); }
  });

  // ── сравнение с оригиналом ──
  const cmp = $("compare");
  let holding = false;
  async function ensureOrig() {
    if (origURL) return origURL;
    const f = current, s = await getSrc(f);
    if (!s || f !== current) return null;
    const b = await toBlob(cropToFormat(s, camById[f.set.cam]), "image/jpeg", .85);
    if (!b || f !== current) return null;
    origURL = URL.createObjectURL(b);
    return origURL;
  }
  function holdOn() { holding = true; ensureOrig().then((u) => { if (holding && u) { photo.src = u; cmp.setAttribute("aria-pressed", "true"); } }); }
  function holdOff() { if (!holding) return; holding = false; cmp.setAttribute("aria-pressed", "false"); if (current.outURL) photo.src = current.outURL; }
  cmp.addEventListener("pointerdown", (e) => { e.preventDefault(); holdOn(); });
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => cmp.addEventListener(ev, holdOff));
  cmp.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); holdOn(); } });
  cmp.addEventListener("keyup", holdOff);
  cmp.addEventListener("contextmenu", (e) => e.preventDefault());

  // ── сохранение и «поделиться» ──
  function fileName(f) {
    const d = new Date(f.shot), ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    return f.isSample ? `zerno35_primer_${f.set.cam}.jpg` : `zerno35_${ymd}_kadr${pad(f.n)}_${f.set.cam}.jpg`;
  }
  const fileFor = (f) => new File([f.out], fileName(f), { type: "image/jpeg", lastModified: f.shot });
  function markSaved(f) {
    f.saved = true; persist(f);
    if (!viewer.hidden) paintViewer();
    if (!rollEl.hidden) renderRoll();
  }
  async function shareFrame(f) {
    try { await navigator.share({ files: [fileFor(f)] }); return true; }
    catch (e) { if (!e || e.name !== "AbortError") toast("Не получилось открыть меню «Поделиться»"); return false; }
  }
  function downloadFrame(f) {
    const a = document.createElement("a");
    a.href = f.outURL; a.download = fileName(f);
    document.body.appendChild(a); a.click(); a.remove();
  }
  async function saveFrame(f) {
    if (!f || !f.out) return;
    if (isIOS && canShareFiles) {
      toast("В меню выбери «Сохранить изображение»", 4000);
      if (await shareFrame(f)) markSaved(f);
      return;
    }
    downloadFrame(f);
    markSaved(f);
    toast(isAndroid ? "Сохранено в «Загрузки», кадр появится в галерее" : "Фото скачано");
  }
  $("finderSave").addEventListener("click", () => saveFrame(current));

  // ── просмотр на весь экран ──
  let vFrame = null, lastFocus = null;
  const viewList = () => (vFrame && vFrame.isSample ? [vFrame] : frames);
  function openViewer(f) {
    if (!f || !f.outURL) return;
    vFrame = f; lastFocus = document.activeElement;
    if (returnToLive || mode === "live") live.pause(); else stopLive();
    paintViewer();
    viewer.hidden = false; document.body.classList.add("lock");
    $("vClose").focus();
  }
  function closeViewer() {
    viewer.hidden = true; vFrame = null;
    if (rollEl.hidden) document.body.classList.remove("lock");
    const back = returnToLive || mode === "live";
    returnToLive = false;
    if (back) {
      if (stream) { setMode("live"); live.play().catch(() => {}); }
      else startLive();
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function paintViewer() {
    const f = vFrame; if (!f) return;
    const list = viewList(), idx = list.indexOf(f);
    const cam = camById[f.set.cam], film = filmById[f.set.film];
    vImg.src = f.outURL || "";
    $("vTitle").textContent = f.isSample ? "Пример кадра" : "Кадр " + pad(f.n);
    $("vMeta").textContent = `${cam.name} · ${film.name}${f.set.flash && cam.flash ? " · вспышка" : ""} · ${fmtDate(f.shot)}`;
    $("vCount").textContent = f.isSample ? "" : `${idx + 1} из ${list.length}`;
    $("vPrev").disabled = idx <= 0;
    $("vNext").disabled = idx < 0 || idx >= list.length - 1;
    $("vPrev").hidden = $("vNext").hidden = list.length < 2;
    $("vShare").hidden = !canShareFiles || isIOS;
    const sv = $("vSave");
    sv.classList.toggle("done", !!f.saved);
    sv.innerHTML = f.saved
      ? '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Сохранено · сохранить ещё раз'
      : `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>${saveLabel}`;
  }
  function step(dir) {
    const list = viewList(), idx = list.indexOf(vFrame), next = list[idx + dir];
    if (next && next.outURL) { vFrame = next; paintViewer(); }
  }
  $("vClose").addEventListener("click", closeViewer);
  $("vPrev").addEventListener("click", () => step(-1));
  $("vNext").addEventListener("click", () => step(1));
  $("vSave").addEventListener("click", () => saveFrame(vFrame));
  $("vShare").addEventListener("click", () => { if (vFrame && vFrame.out) shareFrame(vFrame); });
  $("vEdit").addEventListener("click", () => {
    const f = vFrame; returnToLive = false;
    viewer.hidden = true; vFrame = null;
    if (rollEl.hidden) document.body.classList.remove("lock");
    if (f) selectFrame(f);
  });
  let sx = null, sy = null;
  const stage = $("vStage");
  stage.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; sx = e.clientX; sy = e.clientY; });
  stage.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = sy = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 90) step(dx < 0 ? 1 : -1);
  });
  stage.addEventListener("pointercancel", () => { sx = sy = null; });
  photo.addEventListener("click", () => openViewer(current));
  $("expand").addEventListener("click", () => openViewer(current));

  // ── плёнка ──
  const okIcon = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function renderRoll() {
    const box = $("thumbs");
    box.replaceChildren();
    frames.forEach((f) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "th";
      b.setAttribute("aria-label", `Кадр ${f.n}, ${camById[f.set.cam].name}${f.saved ? ", сохранён" : ""}`);
      if (f.thumbURL) { const im = document.createElement("img"); im.alt = ""; im.loading = "lazy"; im.src = f.thumbURL; b.appendChild(im); }
      const num = document.createElement("span"); num.className = "num"; num.textContent = pad(f.n); b.appendChild(num);
      if (f.saved) { const ok = document.createElement("span"); ok.className = "ok"; ok.innerHTML = okIcon; b.appendChild(ok); }
      b.addEventListener("click", () => { closeRoll(true); returnToLive = mode === "live"; openViewer(f); });
      box.appendChild(b);
    });
    $("rollCount").textContent = `${frames.length} из ${ROLL} кадров`;
    $("rollEmpty").hidden = frames.length > 0;
    $("rollFull").hidden = frames.length < ROLL;
    $("newRoll").hidden = frames.length === 0 || !$("confirm").hidden;
  }
  function openRoll() {
    $("confirm").hidden = true;
    renderRoll();
    rollEl.hidden = false; document.body.classList.add("lock");
    $("rollClose").focus();
  }
  function closeRoll(keepLock) {
    rollEl.hidden = true;
    if (!keepLock && viewer.hidden) document.body.classList.remove("lock");
  }
  $("btnRoll").addEventListener("click", openRoll);
  $("rollClose").addEventListener("click", () => closeRoll());
  $("rollBackdrop").addEventListener("click", () => closeRoll());
  $("newRoll").addEventListener("click", () => {
    const unsaved = frames.filter((f) => !f.saved).length;
    $("confirmText").textContent = unsaved
      ? `Все ${frames.length} кадров удалятся из приложения, ${unsaved} из них ещё не сохранены в галерею.`
      : `Все ${frames.length} кадров уже в галерее. Плёнка в приложении очистится.`;
    $("confirm").hidden = false; $("newRoll").hidden = true;
    $("confirmNo").focus();
  });
  $("confirmNo").addEventListener("click", () => { $("confirm").hidden = true; $("newRoll").hidden = false; });
  $("confirmYes").addEventListener("click", () => {
    frames.forEach((f) => { ["outURL", "thumbURL"].forEach((k) => { if (f[k]) URL.revokeObjectURL(f[k]); }); });
    frames = [];
    idb.clear();
    if (!current.isSample) {
      sample.set = { ...state }; current = sample;
      if (mode !== "live") developCurrent();
    }
    $("confirm").hidden = true;
    paintAll(); paintRollBtn(); renderRoll();
    toast("Новая плёнка заряжена: 36 кадров");
  });

  document.addEventListener("keydown", (e) => {
    if (!viewer.hidden) {
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    } else if (!rollEl.hidden && e.key === "Escape") closeRoll();
  });

  // ── установка на главный экран ──
  const inst = $("install");
  let deferredPrompt = null;
  function hideInstall() { inst.hidden = true; ls.set(HINTKEY, "1"); }
  $("installClose").addEventListener("click", hideInstall);
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferredPrompt = e;
    if (ls.get(HINTKEY) === "1") return;
    $("installBtn").hidden = false; inst.hidden = false;
  });
  $("installBtn").addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (e) {}
    deferredPrompt = null; hideInstall();
  });
  window.addEventListener("appinstalled", hideInstall);
  if (isIOS && !standalone && ls.get(HINTKEY) !== "1") {
    $("installText").textContent = "Чтобы поставить на главный экран: нажми «Поделиться» внизу Safari и выбери «На экран „Домой“».";
    inst.hidden = false;
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }

  // ── запуск ──
  setMode("edit");
  paintAll(); paintRollBtn(); scrollCamIntoView();
  sampleCanvas = sampleScene();
  sample.set = { ...state };
  const fontReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('700 20px "JetBrains Mono"'), new Promise((r) => setTimeout(r, 1500))]).catch(() => {})
    : Promise.resolve();
  fontReady.then(() => { if (current.isSample && mode !== "live") developCurrent(); });
  if (canLive && liveEver) startLive();
  idb.all().then((list) => {
    if (!Array.isArray(list) || !list.length) return;
    frames = list.filter((r) => r && r.src && r.set && camById[r.set.cam] && filmById[r.set.film]).sort((a, b) => a.n - b.n).map((r) => {
      const f = { ...r };
      f.outURL = f.out ? URL.createObjectURL(f.out) : null;
      f.thumbURL = f.thumb ? URL.createObjectURL(f.thumb) : null;
      return f;
    });
    paintRollBtn(); paintAll();
    const last = frames[frames.length - 1];
    if (last && current.isSample && viewer.hidden && mode !== "live") selectFrame(last);
  });
})();
