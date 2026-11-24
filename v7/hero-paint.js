/* v7 - the hero picture is painted in front of the visitor. Loaded deferred. Styles: v7/hero.css (hp-).
   The page opens on the painter's underdrawing of the hero picture, pencil on paper, and the paint arrives in the four roles of
   the colour system, in the order Foundations teaches them further down the page: ground (paper and light), structure (greys and
   the dark strokes), voice (the blues: sky, sea, the jacket), meaning (the warm colours: the coral, the flowers, the trees, the face).
   So the designer is the last thing to be painted, and the whole takes about a second and a half.
   How: the layers of the picture (the boulevard's sky, far city and street, then him) are drawn into one canvas exactly as they stand on the page, every pixel is given its share
   in each of the four roles, and one canvas of pencil lies over the picture; each frame only its transparency changes. The paint
   of a role does not arrive as a fade: it moves from left to right with a broken front, like a wide brush.
   Once per tab (sessionStorage), never with reduced motion, never if the page opens scrolled. The inline script in <head> sets
   html.hp-wait so the finished picture is not seen first; whatever goes wrong, the class is taken off and the picture is simply there. */
(function () {
  var root = document.documentElement; if (!root.classList.contains('hp-wait')) return;
  var fig = document.querySelector('#about .me-photo.me-v7'), inn = fig && fig.querySelector('.me-v7-in');
  var bgs = inn ? [].slice.call(inn.querySelectorAll('.me-v7-bg')) : [], fg = inn && inn.querySelector('.me-v7-fg');
  var over = false, cv = null, guard = setTimeout(end, Math.max(400, 2400 - performance.now()));
  function end() {
    if (over) return; over = true; clearTimeout(guard); root.classList.remove('hp-wait', 'hp-on');
    removeEventListener('scroll', away); removeEventListener('resize', leave);
    try { sessionStorage.setItem('hp', '1'); } catch (e) {}
  }
  /* the visitor moved on, or the window changed: the paint is simply finished */
  function leave() { if (over) return; var c = cv; end(); if (c) { c.style.opacity = '0'; setTimeout(function () { c.remove(); }, 280); } }
  function away() { if (scrollY > 90) leave(); }
  if (!bgs.length || !fg || scrollY > 40) { end(); return; }
  function ready(im) {
    if (im.complete && im.naturalWidth) return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
    return new Promise(function (res) { im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true }); });
  }
  Promise.all(bgs.concat([fg]).map(ready)).then(function () { if (over) return; if (scrollY > 40) { end(); return; } try { paint(); } catch (e) { end(); } });

  function ss(x, a, b) { var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function band(x, a, b, f) { return ss(x, a - f, a + f) * (1 - ss(x, b - f, b + f)); }
  /* an image as the page shows it (object-fit, object-position, its own box), drawn at scale k into the frame f */
  function put(cx, im, f, k) {
    var r = im.getBoundingClientRect(), cs = getComputedStyle(im), pos = cs.objectPosition.split(' '), nw = im.naturalWidth, nh = im.naturalHeight;
    if (!nw || !nh || r.width < 2) return;
    var s = cs.objectFit === 'cover' ? Math.max(r.width / nw, r.height / nh) : cs.objectFit === 'contain' ? Math.min(r.width / nw, r.height / nh) : 0;
    var dw = s ? nw * s : r.width, dh = s ? nh * s : r.height;
    var at = function (v, room) { v = v || '50%'; return v.indexOf('%') > 0 ? room * parseFloat(v) / 100 : parseFloat(v) || 0; };
    var x = r.left - f.left, y = r.top - f.top;
    cx.save(); cx.beginPath(); cx.rect(x * k, y * k, r.width * k, r.height * k); cx.clip();
    cx.drawImage(im, (x + at(pos[0], r.width - dw)) * k, (y + at(pos[1], r.height - dh)) * k, dw * k, dh * k);
    cx.restore();
  }
  function paint() {
    var f = inn.getBoundingClientRect(); if (f.width < 60 || f.height < 60) { end(); return; }
    var k = Math.min(Math.min(window.devicePixelRatio || 1, 2), Math.sqrt(430000 / (f.width * f.height)));
    var w = Math.round(f.width * k), h = Math.round(f.height * k), n = w * h;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var cx = c.getContext('2d', { willReadFrequently: true });
    bgs.forEach(function (im) { put(cx, im, f, k); }); put(cx, fg, f, k);
    var src = cx.getImageData(0, 0, w, h).data;
    var L = new Float32Array(n), B = new Uint8Array(n * 4), D = new Uint8Array(n), i, p, x, y;
    /* a slow, broken field for the front of the brush: value noise on a coarse grid, wider than it is high (a stroke) */
    var gw = Math.ceil(w / (46 * k)) + 2, gh = Math.ceil(h / (20 * k)) + 2, G = new Float32Array(gw * gh), seed = 7;
    for (i = 0; i < G.length; i++) { seed = (seed * 16807) % 2147483647; G[i] = seed / 2147483647; }
    for (y = 0, i = 0, p = 0; y < h; y++) {
      var gy = y / (20 * k), y0 = gy | 0, fy = gy - y0; fy = fy * fy * (3 - 2 * fy);
      for (x = 0; x < w; x++, i++, p += 4) {
        var r = src[p], g = src[p + 1], b = src[p + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, v = mx / 255, s = mx ? d / mx : 0, hh = 0;
        L[i] = (.299 * r + .587 * g + .114 * b) / 255;
        if (d) { hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
        var w0 = ss(v, .8, .9) * (1 - ss(s, .1, .18));                                  /* ground: paper and light */
        var w2 = band(hh, 190, 252, 8) * ss(s, .2, .3) * ss(v, .2, .3);                  /* voice: the blues */
        var w1 = Math.max((1 - ss(s, .16, .26)) * (1 - w0), 1 - ss(v, .2, .3)) * (1 - w2); /* structure: greys and the dark strokes */
        var w3 = Math.max(0, 1 - w0 - w1 - w2), sum = w0 + w1 + w2 + w3 || 1;          /* meaning: every warm, green and lilac thing */
        B[p] = 255 * w0 / sum; B[p + 1] = 255 * w1 / sum; B[p + 2] = 255 * w2 / sum; B[p + 3] = 255 * w3 / sum;
        var gx = x / (46 * k), x0 = gx | 0, fx = gx - x0; fx = fx * fx * (3 - 2 * fx);
        var q = y0 * gw + x0, nz = (G[q] * (1 - fx) + G[q + 1] * fx) * (1 - fy) + (G[q + gw] * (1 - fx) + G[q + gw + 1] * fx) * fy;
        D[i] = 255 * (.46 * x / w + .54 * nz);
      }
    }
    /* the underdrawing: the picture's light as a pale wash on paper, its edges as pencil (the same hand as Foundations) */
    var id = cx.createImageData(w, h), px = id.data, ks = .9 * w / 600;
    for (y = 0, i = 0, p = 0; y < h; y++) for (x = 0; x < w; x++, i++, p += 4) {
      var ex = x > 0 && x < w - 1 ? L[i + 1] - L[i - 1] : 0, ey = y > 0 && y < h - 1 ? L[i + w] - L[i - w] : 0;
      var t = .93 + .06 * L[i] - Math.min(.24, Math.max(0, Math.sqrt(ex * ex + ey * ey) * ks - .05));
      px[p] = 244 * t; px[p + 1] = 243 * t; px[p + 2] = 241 * t; px[p + 3] = 255;
    }
    cx.putImageData(id, 0, 0);
    c.className = 'hp-cv'; c.setAttribute('aria-hidden', 'true'); inn.appendChild(c); cv = c;
    clearTimeout(guard); root.classList.remove('hp-wait'); root.classList.add('hp-on'); /* hp-on: the paint is running; the signature waits for it (hero.js) */
    addEventListener('scroll', away, { passive: true }); addEventListener('resize', leave);
    var T0 = performance.now() + 420, DUR = 640, GAP = 300, lut = [new Float32Array(256), new Float32Array(256), new Float32Array(256), new Float32Array(256)];
    function frame(now) {
      if (over) return;
      var last = 0, j, e;
      for (j = 0; j < 4; j++) {
        var tt = (now - T0 - j * GAP) / DUR; tt = tt < 0 ? 0 : tt > 1 ? 1 : tt; if (j === 3) last = tt;
        for (e = 0; e < 256; e++) { var u = tt * 1.75 - e / 255 * .75; u = u < 0 ? 0 : u > 1 ? 1 : u; lut[j][e] = u * u * (3 - 2 * u) / 255; }
      }
      var l0 = lut[0], l1 = lut[1], l2 = lut[2], l3 = lut[3];
      for (var a = 0, o = 0; a < n; a++, o += 4) { var dd = D[a]; px[o + 3] = 255 - 255 * (B[o] * l0[dd] + B[o + 1] * l1[dd] + B[o + 2] * l2[dd] + B[o + 3] * l3[dd]); }
      cx.putImageData(id, 0, 0);
      if (last >= 1) { end(); c.remove(); } else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
