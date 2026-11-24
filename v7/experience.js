/* v7 - Experience: four passes on one cord (v7/experience.css). */
(() => {
  const xb = document.getElementById('xb');
  if (!xb) return;
  const bs = [...xb.querySelectorAll('.xb-b')], btns = [...xb.querySelectorAll('.xb-list button')], says = [...xb.querySelectorAll('.xb-say > div')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* behind the front pass, nearest first: all hang from the one clip and turn a little further each */
  const FAN = [1.6, 3.2, 4.8];
  let front = 0;
  const lay = () => {
    const back = [0, 1, 2, 3].filter(i => i !== front);
    bs.forEach(b => {
      const i = +b.dataset.i, k = back.indexOf(i), on = i === front;
      b.classList.toggle('front', on);
      b.style.setProperty('--x', '0px'); b.style.setProperty('--y', '0px');
      b.style.setProperty('--r', on ? '0deg' : FAN[k] + 'deg');
      b.style.zIndex = on ? 5 : 4 - k; b.style.setProperty('--k', on ? 0 : k);
    });
  };
  const swing = b => { if (reduce) return; b.classList.remove('swing'); void b.offsetWidth; b.classList.add('swing'); };
  /* the picked pass lifts 28px clear of the stack, comes in front at 220ms, settles; one short swing when it lands */
  let t1, t2;
  const pick = i => {
    if (i === front) return;
    clearTimeout(t1); clearTimeout(t2);
    const b = bs.find(x => +x.dataset.i === i);
    xb.classList.add('settle');
    btns.forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.i === i)));
    says.forEach(s => s.classList.toggle('on', +s.dataset.i === i));
    if (reduce) { front = i; lay(); return; }
    b.style.setProperty('--y', '-28px');
    t1 = setTimeout(() => { front = i; lay(); t2 = setTimeout(() => swing(b), 620); }, 220);
  };
  btns.forEach(x => x.addEventListener('click', () => pick(+x.dataset.i)));
  /* a back pass comes forward; the front one, pressed, hands over to the next job (after the last, back to Hear) */
  bs.forEach(b => b.addEventListener('click', () => pick(+b.dataset.i === front ? (front + 1) % 4 : +b.dataset.i)));
  lay();
  if (reduce || !('IntersectionObserver' in window)) { xb.classList.add('in'); return; }
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); xb.classList.add('in'); swing(bs.find(b => b.classList.contains('front'))); }
  }, { threshold: .35 });
  io.observe(xb.querySelector('.xb-stage'));
})();
