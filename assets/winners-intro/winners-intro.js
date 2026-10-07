/* #FindingTAIWAN 2.0 — 2026 得獎名單 進場動畫
   用法：<div data-winners-intro></div> 放在 #winners-2026 內，載入本檔即可。
   進入畫面時播放一次（4 秒），尊重 prefers-reduced-motion。 */
(function () {
  var ASSET = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, '')) || '';
  var BLUE = '#1574e6', GREEN = '#38e58c';
  var EYE_W = 760, EYE_H = EYE_W * 465 / 1090;
  var CUE = { Eye: 1.3, Look: 2.1, Blink: 3.4, End: 4.0 };
  var LOOK = 55;

  var cl = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var oCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var ioCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var oBack = function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  var p = function (f, t, a, b) { return f(cl((t - a) / (b - a), 0, 1)); };

  function build(host) {
    host.style.cssText += ';position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:' + BLUE + ';border-radius:inherit;';
    var stage = document.createElement('div');
    stage.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;';
    host.appendChild(stage);

    var eye = document.createElement('div');
    eye.style.cssText = 'position:absolute;left:' + (1920 - EYE_W) / 2 + 'px;top:175px;width:' + EYE_W + 'px;height:' + EYE_H + 'px;transform-origin:50% 46%;filter:drop-shadow(0 12px 28px rgba(0,0,0,.22));opacity:0;';
    eye.innerHTML = '<img alt="" src="' + ASSET + 'assets/eye-outline.png" style="position:absolute;inset:0;width:100%;height:100%">' +
      '<img alt="" src="' + ASSET + 'assets/eye-iris.png" style="position:absolute;inset:0;width:100%;height:100%;transform-origin:41.7% 46.45%">';
    var iris = eye.children[1];
    stage.appendChild(eye);

    var title = document.createElement('div');
    title.style.cssText = 'position:absolute;left:0;right:0;top:390px;display:flex;flex-direction:column;align-items:center;';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:baseline;gap:6px;';
    var chars = [
      { c: '2026', f: "'Montserrat',sans-serif", s: 210, col: GREEN, gap: 36 },
      { c: '得', s: 168 }, { c: '獎', s: 168 }, { c: '名', s: 168 }, { c: '單', s: 168 }
    ];
    var glyphs = chars.map(function (ch) {
      var w = document.createElement('div');
      w.style.cssText = 'overflow:hidden;padding-right:14px;line-height:1.15;margin-right:' + (ch.gap || 0) + 'px;';
      var g = document.createElement('div');
      g.textContent = ch.c;
      g.style.cssText = "font-family:" + (ch.f || "'Noto Sans TC',sans-serif") + ";font-weight:900;font-style:italic;font-size:" + ch.s + "px;color:" + (ch.col || '#fff') + ";letter-spacing:-.01em;text-shadow:0 6px 18px rgba(0,0,0,.18);transform:translateY(110%);";
      w.appendChild(g); row.appendChild(w); return g;
    });
    var sub = document.createElement('div');
    sub.style.cssText = "margin-top:18px;display:flex;align-items:center;gap:18px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:30px;letter-spacing:.24em;color:#fff;opacity:0;";
    sub.innerHTML = '<span style="width:12px;height:12px;border-radius:6px;background:' + GREEN + '"></span><span>#FindingTAIWAN<span style="color:' + GREEN + '">_2.0</span> · WINNERS</span>';
    title.appendChild(row); title.appendChild(sub); stage.appendChild(title);

    function fit() { stage.style.transform = 'scale(' + host.clientWidth / 1920 + ')'; }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(host); else window.addEventListener('resize', fit);

    function render(T) {
      glyphs.forEach(function (g, i) {
        var k = p(oBack, T, .1 + i * .08, .7 + i * .08);
        g.style.transform = 'translateY(' + (1 - k) * 110 + '%) skewY(' + (1 - k) * 8 + 'deg)';
      });
      var k = p(oCubic, T, .75, 1.25);
      sub.style.opacity = k; sub.style.transform = 'translateY(' + (1 - k) * 20 + 'px)';
      title.style.top = (390 + p(ioCubic, T, CUE.Eye - .15, CUE.Eye + .6) * 200) + 'px';

      var open = p(oBack, T, CUE.Eye, CUE.Eye + .55);
      var L = CUE.Look, len = CUE.Blink - L;
      var m = -p(ioCubic, T, L, L + len * .3) + 2 * p(ioCubic, T, L + len * .4, L + len * .72) - p(ioCubic, T, L + len * .8, L + len);
      iris.style.transform = 'translateX(' + LOOK * m + 'px) rotate(' + 14 * m + 'deg)';
      var s = CUE.Blink + .02;
      var lid = 1 - .95 * p(ioCubic, T, s, s + .09) + .95 * p(oCubic, T, s + .09, s + .24);
      eye.style.opacity = cl(open * 3, 0, 1);
      eye.style.transform = 'scaleY(' + Math.max(.02, open * lid) + ') scaleX(' + (.9 + .1 * open) + ')';
    }

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { render(CUE.End); return; }
    render(0);

    function play() {
      var t0 = null;
      (function tick(now) {
        if (t0 === null) t0 = now;
        var T = (now - t0) / 1000;
        render(Math.min(T, CUE.End));
        if (T < CUE.End) requestAnimationFrame(tick);
      })(performance.now());
    }
    if (!window.IntersectionObserver) return play();
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); play(); }
    }, { threshold: .5 });
    io.observe(host);
  }

  function init() { document.querySelectorAll('[data-winners-intro]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
