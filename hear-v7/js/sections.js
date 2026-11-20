// Hear landing page v2: behaviour of the sections below the hero.
(function(){
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guard=f=>{ try{ f() }catch(e){ console.error(e) } };     // one block failing never takes the others with it
  // A window opens with its first thing large, and with the card and its glass frame drawn in around it: when there is little to show,
  // the plate is small. startBig makes the block large at once, works out how tall the card needs to be for it (wide windows only;
  // elsewhere the card keeps its size), squeezes the plate by --sq and places the block in the card's middle (--cy). endBig lets
  // the plate open to its full size and the block settle at the top; both glide (CSS transitions).
  function startBig(d,block,extra){ const card=d.closest('.card'), glass=d.closest('.glass'), body=d.querySelector('.demo__body'); if(!card||!glass||!body) return;
    const cs=getComputedStyle(d), bs=getComputedStyle(body);
    d.classList.add('is-snap','is-big'); block.style.setProperty('--cy','0px');
    const wide=matchMedia('(min-width:901px)').matches, frame=glass.offsetParent;
    // the card's full height, worked out from the frame (not read off the card, which may still be gliding from the last window)
    const full=wide&&frame?frame.clientHeight*.81-(glass.offsetHeight-card.offsetHeight):card.offsetHeight;
    const padT=parseFloat(cs.paddingTop)+parseFloat(bs.paddingTop), bh=block.offsetHeight+(extra||0), air=card.offsetWidth*.085;
    const want=wide?Math.min(full,bh+2*air):full;
    glass._by=d; glass.style.setProperty('--sq',((full-want)/2).toFixed(1)+'px'); block.style.setProperty('--cy',((want-bh)/2-padT).toFixed(1)+'px');
    void block.offsetHeight; requestAnimationFrame(()=>d.classList.remove('is-snap')) }
  // Whether a window is on screen is read off the painted frame around it, never off the window itself: the window's own box shrinks
  // when its plate draws in, so measuring it made a half-scrolled window start, shrink out of view, stop, grow back and start again
  // (a flicker). There is also a margin between starting (four tenths of the frame showing) and stopping (almost none of it).
  function onScreen(d,cb){ const fr=d.closest('.product__frame')||d; let on=false;
    new IntersectionObserver(es=>{ const r=es[es.length-1].intersectionRatio, next=r>=.4?true:r<.08?false:on; if(next!==on){ on=next; cb(on) } },{threshold:[0,.08,.4]}).observe(fr) }
  function endBig(d){ d.classList.remove('is-big','is-out'); const g=d.closest('.glass'); if(g&&(!g._by||g._by===d)){ g._by=null; g.style.setProperty('--sq','0px') } }      // only the window that drew the plate in may open it: a window that is being left must not undo the next one's

  // Paintings fade in once they have loaded (each frame already shows its painting's own colour). The script does the hiding,
  // so if it never runs the pictures are simply there.
  guard(()=>document.querySelectorAll('.closing__art img, .quote__art img').forEach(img=>{
    if(img.complete&&img.naturalWidth) return;
    img.classList.add('is-wait'); const done=()=>img.classList.remove('is-wait');
    img.addEventListener('load',done); img.addEventListener('error',()=>{ done(); img.style.visibility='hidden' }) }));      // a failed picture leaves its frame's colour, not a broken-image icon


  // Product: four steps, one small window each. It advances by itself while the window is in view, waits while the pointer
  // or the keyboard is on the steps or the window, and stops for good once you pick a step yourself.
  guard(function(){
    const sec=document.getElementById('product'); if(!sec) return;
    const list=sec.querySelector('.steps'), row=sec.querySelector('.tabsrow'), frame=sec.querySelector('.product__frame');
    if(!list||!row||!frame) return;
    const steps=[...sec.querySelectorAll('.step')], tabs=steps.map(s=>s.querySelector('.step__t')), short=[...row.querySelectorAll('.tab')];
    const demos=tabs.map(t=>document.getElementById(t.dataset.for)), DUR=7000, n=steps.length;
    let cur=0, timer=null, chosen=still, inView=false, held=false, live=false, left=DUR, started=0;
    const dur=()=>cur===0?11000:DUR;      // the first window plays a whole question and answer, so it stays open longer before the steps move on by themselves
    const narrow=matchMedia('(max-width:900px)');      // narrow windows use the tab row; there the list under the window is plain words

    function show(i){ cur=i;
      steps.forEach((s,j)=>{ const on=j===i;
        s.classList.toggle('is-active',on); s.classList.remove('is-running'); short[j].classList.toggle('is-active',on); short[j].classList.remove('is-running');
        short[j].setAttribute('aria-selected',on); short[j].tabIndex=on?0:-1;
        if(!narrow.matches){ tabs[j].setAttribute('aria-selected',on); tabs[j].tabIndex=on?0:-1 }
        demos[j].classList.toggle('is-active',on) }) }
    function mark(on){ for(const el of [list,row]) el.classList.toggle('is-held',on) }
    function run(ms){ clearTimeout(timer); live=false; if(chosen||!inView||held||scrolly()) return;
      if(ms>=dur()){ for(const el of [steps[cur],short[cur]]){ el.classList.remove('is-running'); void el.offsetWidth; el.style.setProperty('--dur',dur()+'ms'); el.classList.add('is-running') } }
      mark(false); left=ms; started=performance.now(); live=true;
      timer=setTimeout(()=>{ show((cur+1)%n); run(dur()) },ms) }
    function hold(){ if(chosen||held) return; held=true;
      if(live){ clearTimeout(timer); live=false; left=Math.max(600,left-(performance.now()-started)); mark(true) } else left=dur() }
    function release(){ if(!held) return; held=false; run(left) }
    const picked=()=>{ for(const el of [list,row]) el.classList.add('is-picked') };      // from now on the bar shows which step is open, not a clock
    if(still) picked();
    function pick(i,el){ if(scrolly()){ toStep(i); if(el) el.focus({preventScroll:true}); return }
      chosen=true; picked(); clearTimeout(timer); live=false; mark(false); show(i); if(el) el.focus() }

    function wire(set){ set.forEach((t,i)=>{
      t.addEventListener('keydown',e=>{ const k=e.key;
        if((k==='Enter'||k===' ')&&t.tagName!=='BUTTON'){ e.preventDefault(); pick(i,t); return }
        const to=k==='ArrowDown'||k==='ArrowRight'?(i+1)%n:k==='ArrowUp'||k==='ArrowLeft'?(i+n-1)%n:k==='Home'?0:k==='End'?n-1:-1;
        if(to>=0){ e.preventDefault(); pick(to,set[to]) } }) }) }
    wire(tabs); wire(short);
    // The list is a tablist only on wide windows; on narrow ones it carries no roles at all (the tab row is the control).
    function mode(){ const n=narrow.matches;
      if(n){ for(const a of ['role','aria-label','aria-orientation']) list.removeAttribute(a) }
      else { list.setAttribute('role','tablist'); list.setAttribute('aria-label','What Hear does'); list.setAttribute('aria-orientation','vertical') }
      tabs.forEach((t,j)=>{ if(n){ for(const a of ['role','aria-selected','aria-controls']) t.removeAttribute(a); t.removeAttribute('tabindex') }
        else { t.setAttribute('role','tab'); t.setAttribute('aria-controls',t.dataset.for); t.setAttribute('aria-selected',j===cur); t.tabIndex=j===cur?0:-1 } });
      reserve() }
    steps.forEach((s,i)=>s.addEventListener('click',()=>{ if(!narrow.matches&&!getSelection().toString()) pick(i) }));   // the whole step is the target; selecting its text is not a click
    short.forEach((t,i)=>t.addEventListener('click',()=>pick(i)));
    for(const el of [list,row,frame]){
      el.addEventListener('pointerenter',e=>{ if(e.pointerType==='mouse') hold() }); el.addEventListener('pointerleave',release);
      el.addEventListener('focusin',hold); el.addEventListener('focusout',e=>{ if(!sec.contains(e.relatedTarget)) release() }) }

    // Keep the list as tall as its tallest state, so opening a longer step never pushes the page.
    function reserve(){ list.style.minHeight=''; if(narrow.matches) return;      // narrow: the four texts share one cell, nothing to reserve
      // built from parts that never animate (titles, paddings, the tallest description), so it is right even while rows are still opening or closing
      const ds=steps.map(s=>s.querySelector('.step__d p').offsetHeight);
      const base=steps.reduce((h,s)=>h+s.querySelector('.step__t').offsetHeight+parseFloat(getComputedStyle(s).paddingBottom),0);
      list.style.minHeight=Math.ceil(base+Math.max(...ds))+1+'px' }
    addEventListener('resize',reserve); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(reserve);
    narrow.addEventListener('change',mode); mode();

    // Wide windows: the section pins and the scroll itself walks through the four steps, so none of them can be missed.
    const track=sec.querySelector('.product__track'), stick=sec.querySelector('.product__sticky');
    function scrolly(){ return !!track&&!still&&getComputedStyle(track).getPropertyValue('--scrolly').trim()==='1' }
    function span(){ return Math.max(1,track.offsetHeight-stick.offsetHeight) }
    function toStep(i){ const top=parseFloat(getComputedStyle(stick).top)||0; scrollTo({top:scrollY+track.getBoundingClientRect().top-top+(i+.4)/n*span(),behavior:'smooth'}) }
    let sTick=false;
    function onScroll(){ sTick=false; const on=scrolly(); sec.classList.toggle('is-scrolly',on);
      if(!on){ sec.style.removeProperty('--pp'); steps.forEach(s=>s.style.removeProperty('--sp')); return }
      const top=parseFloat(getComputedStyle(stick).top)||0, p=Math.max(0,Math.min(.9999,(top-track.getBoundingClientRect().top)/span())), f=p*n, i=Math.floor(f);
      if(i!==cur) show(i);
      steps[i].style.setProperty('--sp',(f-i).toFixed(3)); sec.style.setProperty('--pp',p.toFixed(4)) }
    const sReq=()=>{ if(!sTick){ sTick=true; requestAnimationFrame(onScroll) } };
    addEventListener('scroll',sReq,{passive:true}); addEventListener('resize',sReq); onScroll();

    new IntersectionObserver(es=>es.forEach(e=>{ inView=e.isIntersecting;
      if(inView) run(dur()); else { clearTimeout(timer); live=false; steps[cur].classList.remove('is-running'); short[cur].classList.remove('is-running') } }),{threshold:.5}).observe(frame);
  });

  // A slow drift on a few framed pictures and on the colour band, tied to the scroll.
  guard(function(){ if(still) return; const els=[...document.querySelectorAll('[data-plx]')]; if(!els.length) return; let t=false;
    function upd(){ t=false; const vh=innerHeight; for(const el of els){ const r=el.getBoundingClientRect(); if(r.bottom<0||r.top>vh) continue; el.style.setProperty('--plx',(((r.top+r.height/2)-vh/2)/vh).toFixed(3)) } }
    addEventListener('scroll',()=>{ if(!t){ t=true; requestAnimationFrame(upd) } },{passive:true}); upd() });

  // Stories: the three numbers count up once, when they come into view.
  guard(function(){ const st=document.querySelector('.stats'); if(!st) return; const cnts=[...st.querySelectorAll('.cnt')]; if(still||!cnts.length) return;
    new IntersectionObserver((es,io)=>{ if(!es[es.length-1].isIntersecting) return; io.disconnect();
      cnts.forEach(c=>{ const to=+c.dataset.to, t0=performance.now();
        (function tick(t){ const k=Math.max(0,Math.min(1,(t-t0)/1100)), e=1-Math.pow(1-k,3); c.textContent=Math.round(to*e); if(k<1) requestAnimationFrame(tick) })(t0) }) },{threshold:.5}).observe(st) });

  // Things that play once when they come into view.
  guard(function(){ document.querySelectorAll('[data-inview]').forEach(el=>new IntersectionObserver((es,io)=>{ if(es[es.length-1].isIntersecting){ el.classList.add('is-in'); io.disconnect() } },{threshold:.4}).observe(el)); });

  // Roles: pointing at a column, focusing it or tapping it opens it; the open one is a plain link.
  guard(function(){ const acc=document.querySelector('[data-racc]'); if(!acc) return; const items=[...acc.children]; let t=null;
    const open=i=>items.forEach(x=>x.classList.toggle('is-open',x===i));
    let wasOpen=true;      // whether the pressed item was already open: a press on a closed one opens it, a press on the open one follows its link
    items.forEach(i=>{
      i.addEventListener('pointerenter',e=>{ if(e.pointerType!=='mouse') return; clearTimeout(t); t=setTimeout(()=>open(i),90) });     // a short wait, so crossing the row does not open everything on the way
      i.addEventListener('pointerleave',()=>clearTimeout(t));
      i.addEventListener('focus',()=>open(i));
      i.addEventListener('pointerdown',()=>{ wasOpen=i.classList.contains('is-open') });
      i.addEventListener('click',e=>{ if(e.detail>0&&!wasOpen){ e.preventDefault(); clearTimeout(t); open(i) } wasOpen=true }) }) });

  // Learn (the ask screen): while its window is open and on screen, it plays the idea again and again. The ask screen rests for a moment, the field
  // is chosen (mark and field turn blue), the question is typed and sent, Hear goes through the conversations, the answer builds,
  // the next step is ticked. With reduced motion the finished answer is shown.
  guard(function(){ const d=document.getElementById('d-ask'); if(!d||still) return;
    const inp=d.querySelector('.d-in__t'), n=d.querySelector('.d-sub b'), src=d.querySelector('.demo__foot span'), q=d.querySelector('.d-q'); if(!inp||!q||!n||!src) return;
    const Q=q.textContent, N=+n.textContent, SRC=src.textContent, TOTAL=parseInt(SRC.replace(/\D/g,''),10)||0, REST=SRC.replace(/^[\d,]+/,'');
    let run=0, timers=[], seen=false;
    const later=(f,ms)=>timers.push(setTimeout(f,ms));
    const count=(el,to,ms,fmt,id)=>{ const t0=performance.now(); (function tick(t){ if(id!==run) return; const k=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-k,3); el.textContent=fmt(Math.round(to*e)); if(k<1) requestAnimationFrame(tick) })(t0) };
    function stop(){ run++; timers.forEach(clearTimeout); timers=[]; d.classList.remove('is-seq','is-focus','is-typing'); endBig(d); d.removeAttribute('data-ph'); inp.textContent=''; n.textContent=N; src.textContent=SRC; }
    function play(){ d.classList.add('is-snap'); stop(); const id=run; d.classList.add('is-seq'); d.dataset.ph='0'; let i=0;
      const box=d.querySelector('.d-ask'), g=d.closest('.glass'); if(box&&g) startBig(d,box,g.offsetWidth*.012346*11.6);      // the plate starts small, around the mark and the field (with room for the field to open)
      later(()=>d.classList.add('is-focus'),1300);
      later(function type(){ if(id!==run) return; inp.textContent=Q.slice(0,++i); d.classList.add('is-typing');
        if(i<Q.length) later(type,24+(Q[i-1]===' '?26:0));
        else { later(()=>{ endBig(d); d.dataset.ph='1'; count(src,TOTAL,1100,v=>v.toLocaleString('en-US')+REST,id) },650);
          later(()=>{ d.dataset.ph='2'; count(n,N,900,String,id) },2050);
          later(()=>{ d.dataset.ph='3' },3650);
          later(()=>d.classList.add('is-out'),8850); later(play,9200) } },1950) }
    const sync=()=>{ const on=d.classList.contains('is-active')&&seen, playing=d.classList.contains('is-seq'); if(on&&!playing) play(); else if(!on&&playing) stop() };
    new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['class']});
    onScreen(d,v=>{ seen=v; sync() }) });

  // Plates in depth (the product window, the AI-agents comparison, the integrations and security plates, the footer's sky): while the mouse is over one,
  // its plate tilts toward the pointer, closely but without snapping.
  // When the mouse leaves it does not just drop back: it is let go like something with weight, swings gently past level once and settles.
  guard(function(){ if(still) return; document.querySelectorAll('.product__frame, .agents__panel, .duo2__art, .racc__i, .stats--sky, #heroArt, .closing__art, .footer').forEach(fr=>{
    let tx=0, ty=0, x=0, y=0, vx=0, vy=0, raf=0, last=0, over=false;
    function tick(t){ const dt=Math.min(.034,(t-last)/1000||.016); last=t;
      const k=over?110:15, c=over?21:4.6;      // following: quick and critically damped; released: a slow spring, about two seconds, with one soft swing past level
      vx+=((tx-x)*k-vx*c)*dt; vy+=((ty-y)*k-vy*c)*dt; x+=vx*dt; y+=vy*dt;
      fr.style.setProperty('--tx',x.toFixed(4)); fr.style.setProperty('--ty',y.toFixed(4));
      if(Math.abs(tx-x)>.0008||Math.abs(ty-y)>.0008||Math.abs(vx)>.002||Math.abs(vy)>.002) raf=requestAnimationFrame(tick);
      else { raf=0; x=tx; y=ty; vx=vy=0; fr.style.setProperty('--tx',x); fr.style.setProperty('--ty',y) } }
    const go=()=>{ if(!raf){ last=performance.now(); raf=requestAnimationFrame(tick) } };
    fr.addEventListener('pointermove',e=>{ if(e.pointerType!=='mouse') return; over=true; const r=fr.getBoundingClientRect();
      tx=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2)); ty=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2)); go() });
    fr.addEventListener('pointerleave',()=>{ over=false; tx=0; ty=0; go() }) }) });

  // Coach with evidence: while its window is open and on screen it plays the idea. The call plays along its waveform, the playhead
  // stops at the moment that matters, what the agent said appears, then the coaching note, then the follow-up is ticked. Then again.
  guard(function(){ const d=document.getElementById('d-coach'); if(!d||still) return;
    const box=d.querySelector('.d-wavebox'), time=d.querySelector('.d-time'), rects=[...d.querySelectorAll('.d-wave line')]; if(!box||!time||!rects.length) return;
    const STOP=+box.dataset.stop||.5, END=time.textContent, m=END.split(':'), SECS=(+m[0])*60+(+m[1]);
    const xs=rects.map(r=>(+r.getAttribute('x1'))/560);      // each bar's place along the call, 0 → 1
    const HOTEND=Math.max(...rects.map((r,i)=>r.classList.contains('hot')?xs[i]:0))+.01;      // where the marked moment ends
    const fill=t=>rects.forEach((r,i)=>r.classList.toggle('on',xs[i]<t));
    let run=0, timers=[], seen=false;
    const later=(f,ms)=>timers.push(setTimeout(f,ms));
    const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
    function at(t){ box.style.setProperty('--t',t.toFixed(4)); rects.forEach((r,i)=>r.classList.toggle('on',xs[i]<t)); time.textContent=fmt(SECS*t/STOP) }
    function stop(){ run++; timers.forEach(clearTimeout); timers=[]; d.classList.remove('is-seq'); endBig(d); d.removeAttribute('data-ph'); at(STOP); rects.forEach(r=>r.classList.remove('on')); time.textContent=END }
    function play(){ d.classList.add('is-snap'); stop(); const id=run; d.classList.add('is-seq'); d.dataset.ph='0'; at(0); startBig(d,d.querySelector('.d-call'));
      later(()=>{ d.dataset.ph='1' },700);       // once the plate has drawn in, the call comes in, large, in its middle
      later(()=>{ const t0=performance.now(), D=2200;
        (function tick(t){ if(id!==run) return; const k=Math.min(1,(t-t0)/D), e=k<.85?k/.85*.93:.93+(1-Math.pow(1-(k-.85)/.15,2))*.07; at(STOP*e);      // steady play, easing to a stop on the moment
          if(k<1) requestAnimationFrame(tick); else { at(STOP); time.textContent=END; d.dataset.ph='2';      // the moment starts here: the time turns blue
            const t1=performance.now(), D2=950;      // and the call plays on through it, each bar turning blue as it passes
            (function sweep(t){ if(id!==run) return; const q=Math.min(1,(t-t1)/D2); fill(STOP+(HOTEND-STOP)*q); if(q<1) requestAnimationFrame(sweep) })(t1);
            later(()=>endBig(d),1350);      // it settles to its place at the top
            later(()=>{ d.dataset.ph='3' },2100); later(()=>{ d.dataset.ph='4' },2750); later(()=>{ d.dataset.ph='5' },3750); later(()=>{ d.dataset.ph='6' },4650); later(()=>d.classList.add('is-out'),9250); later(play,9600) } })(t0) },1200) }
    const sync=()=>{ const on=d.classList.contains('is-active')&&seen, playing=d.classList.contains('is-seq'); if(on&&!playing) play(); else if(!on&&playing) stop() };
    new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['class']});
    onScreen(d,v=>{ seen=v; sync() }) });

  // Compliance & QA: while its window is open and on screen it plays the idea. A rule added today and its words appear, the check runs
  // over every call (the count and the bar go all the way), the one call where it was missing is shown, the review is ticked. Then again.
  guard(function(){ const d=document.getElementById('d-comply'); if(!d||still) return;
    const cov=d.querySelector('.d-cov'), n=d.querySelector('.d-cov__n'); if(!cov||!n) return;
    const END=n.textContent, TOTAL=parseInt(END.replace(/\D/g,''),10)||0;
    let run=0, timers=[], seen=false;
    const later=(f,ms)=>timers.push(setTimeout(f,ms));
    const at=c=>{ cov.style.setProperty('--c',c.toFixed(4)); n.textContent=Math.round(TOTAL*c).toLocaleString('en-US') };
    function stop(){ run++; timers.forEach(clearTimeout); timers=[]; d.classList.remove('is-seq'); endBig(d); d.removeAttribute('data-ph'); at(1); n.textContent=END }
    function play(){ d.classList.add('is-snap'); stop(); const id=run; d.classList.add('is-seq'); d.dataset.ph='0'; at(0); startBig(d,d.querySelector('.d-rule'));
      later(()=>{ d.dataset.ph='1' },750);                       // once the plate has drawn in, the rule, large, in its middle
      later(()=>endBig(d),2000);             // the plate opens and the rule settles at the top
      later(()=>{ d.dataset.ph='2' },2700);
      later(()=>{ const t0=performance.now(), D=2100;
        (function tick(t){ if(id!==run) return; const k=Math.min(1,(t-t0)/D), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; at(e);
          if(k<1) requestAnimationFrame(tick); else { at(1); n.textContent=END; later(()=>{ d.dataset.ph='3' },550); later(()=>{ d.dataset.ph='4' },1500); later(()=>d.classList.add('is-out'),6050); later(play,6400) } })(t0) },3050) }
    const sync=()=>{ const on=d.classList.contains('is-active')&&seen, playing=d.classList.contains('is-seq'); if(on&&!playing) play(); else if(!on&&playing) stop() };
    new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['class']});
    onScreen(d,v=>{ seen=v; sync() }) });



  // Integrations plate: the tools simply light up one after another, never two at once (no waves from Hear, his call); Hear gives a light flicker at each change.
  guard(function(){ const web=document.querySelector('.pl__web'); if(!web) return; const chips=[...web.querySelectorAll('.pl__chips span')]; if(!chips.length) return;
    const core=web.querySelector('.pl__core'), still=matchMedia('(prefers-reduced-motion:reduce)').matches, STEP=1700, LIT=1150; let i=0, timer=0, on=false, tos=[];      // a tag is fully out before the next one lights
    const step=()=>{ if(!on) return; const c=chips[i++%chips.length]; c.classList.add('is-on'); if(core){ core.classList.remove('is-blink'); void core.offsetWidth; core.classList.add('is-blink') } tos.push(setTimeout(()=>c.classList.remove('is-on'),LIT)); if(tos.length>6) tos.shift(); timer=setTimeout(step,STEP) };
    const start=()=>{ if(on||still) return; on=true; step() }, stop=()=>{ on=false; clearTimeout(timer); tos.forEach(clearTimeout); tos=[]; chips.forEach(c=>c.classList.remove('is-on')) };
    new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?start():stop()),{threshold:.2}).observe(web) });

})();
