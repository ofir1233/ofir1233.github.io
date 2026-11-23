/* v7 - feed: the LinkedIn campaign on the home page. Loaded deferred.
   A feed of other people's posts (skeletons) scrolls once, by two posts, and stops on Hear's post. The picture in the post
   is a plain image, there from the start. When the feed has stopped, the same scene as a 7 s loop is loaded and, once it is
   really drawing frames, shown over the still: the painting simply starts to move. The loop plays only while the block is
   on screen and the tab is visible.
   Nothing here is needed to read the block: without the class .hp-js it is at rest (see v7/feed.css), and the post, the six
   paintings and the button are plain links to work/hear-page.html. Reduced motion keeps it at rest: no scroll, no loop. */
(function () {
  var root = document.getElementById('campaign'); if (!root) return;
  var view = root.querySelector('.hp-view'), track = root.querySelector('.hp-track'), post = root.querySelector('.lp');
  var pt = post && post.querySelector('.pt'), vid = pt && pt.querySelector('video');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!view || !track || !post || reduce || !('IntersectionObserver' in window)) { root.classList.remove('hp-js'); return; }
  root.hpFeed = true; root.classList.add('hp-js');
  var lean = !!(navigator.connection && navigator.connection.saveData);
  var TOP = 48, FOOT = 64, stopped = false, rest = false, onScreen = false, shown = false, timer = 0;

  /* the loop: its file is asked for only when the feed is at rest and the block is on screen */
  function play() {
    if (!vid || lean || !rest || !onScreen || document.hidden) return;
    if (!vid.getAttribute('src')) vid.src = vid.getAttribute('data-loop');
    var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function pause() { if (vid && !vid.paused) vid.pause(); }
  function show() { if (!shown) { shown = true; pt.classList.add('on'); } }
  if (vid) vid.addEventListener('playing', function () {
    if (shown) return;
    if (vid.requestVideoFrameCallback) vid.requestVideoFrameCallback(show);
    else vid.addEventListener('timeupdate', function tu() { if (vid.currentTime > 0) { vid.removeEventListener('timeupdate', tu); show(); } });
  });

  function size() { view.style.height = (post.offsetHeight + TOP + FOOT) + 'px'; }
  function settle(anim) {
    size(); view.scrollTop = 0; track.classList.toggle('run', !!anim);
    track.style.transform = 'translate3d(0,' + (-(post.offsetTop - TOP)) + 'px,0)';
  }
  function arrived() { if (rest) return; rest = true; clearTimeout(timer); track.classList.remove('run'); play(); }
  function stop() {
    if (stopped) return; stopped = true;
    settle(true); timer = setTimeout(arrived, 1700);
  }
  track.addEventListener('transitionend', function (e) { if (e.target === track && e.propertyName === 'transform' && stopped) arrived(); });

  size();
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { stop(); o.disconnect(); } }, { threshold: .6 }).observe(view);
  /* on screen means most of the picture: the same measure the page uses to let one clip play at a time (index.html) */
  new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; if (onScreen) play(); else pause(); }, { threshold: .6 }).observe(pt);

  /* the post changes height with the window, the font and the orientation: keep the view on it. While the feed is still
     moving the target is only corrected, so the movement is not cut. */
  var again = function () { if (!stopped) size(); else settle(!rest); };
  if ('ResizeObserver' in window) new ResizeObserver(again).observe(post);
  addEventListener('resize', again); addEventListener('load', again);
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else play(); });
  /* back from the page cache: whatever was half way is finished, and the loop goes on only if the block is on screen */
  addEventListener('pageshow', function (e) { if (!e.persisted || !stopped) return; rest = false; settle(false); arrived(); });
  addEventListener('pagehide', pause);
})();
