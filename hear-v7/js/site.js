// Hear landing page v2.
(function(){
  const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const root=document.documentElement, header=document.getElementById('header');

  // Hero: the opening in the painting widens with the scroll. The script only reports how far the scroll has gone (--p, 0 → 1)
  // and the window's inner width (--vw, so a scrollbar never makes the box wider than the page); every size is worked out in CSS.
  const hero=document.getElementById('hero'), track=document.getElementById('heroTrack'), sticky=document.getElementById('heroSticky');
  let end=1, hold=0;
  function measure(){ hero.style.setProperty('--vw',root.clientWidth+'px');
    // On a tall window the frame is short for the screen, so less of it starts closed: the picture runs to the foot of the first screen.
    const ss=getComputedStyle(sticky), art0=document.getElementById('heroArt');
    if(ss.position==='sticky'&&art0.offsetHeight){ const top0=track.getBoundingClientRect().top+scrollY+(parseFloat(ss.paddingTop)||0), bh=art0.offsetHeight;
      hero.style.setProperty('--cut',cl((top0+bh-(innerHeight-(parseFloat(ss.paddingBottom)||0)))/bh,.08,.38).toFixed(4)) }
    else hero.style.removeProperty('--cut');
    const top=getComputedStyle(sticky).position==='sticky'?parseFloat(getComputedStyle(sticky).top)||0:0;   // the pinned box may sit below the header band
    // once the picture is fully open it stays for a little more scrolling (--hold) before the page moves on
    hold=getComputedStyle(sticky).position==='sticky'?Math.round(innerHeight*.45):0; hero.style.setProperty('--hold',hold+'px');
    end=Math.max(1,track.offsetTop+track.offsetHeight-sticky.offsetHeight-top-hold); update() }
  // The film this painting opens. Nothing plays by itself: once the frame has opened (or at once in the still layouts) a play button
  // shows on the picture, and pressing it plays the film in the frame with sound. It stops when the frame closes again or leaves the screen.
  const art=document.getElementById('heroArt'), vid=hero.querySelector('.hero__vid'), play=hero.querySelector('.hero__play'), sound=hero.querySelector('.hero__sound');
  let autod=false, userPaused=false, byScript=false;
  function start(auto){ if(!vid.getAttribute('src')) vid.src=vid.dataset.src; vid.controls=true; vid.muted=false;
    const pl=vid.play(); if(pl) pl.catch(()=>{ if(!auto) return; vid.muted=true; if(sound) sound.hidden=false; const p2=vid.play(); if(p2) p2.catch(()=>{}) }) }
  function halt(){ if(!vid.paused){ byScript=true; vid.pause() } }
  function gate(p){ if(!vid||!play) return; const pinned=getComputedStyle(sticky).position==='sticky', open=!pinned||p>=.8;
    art.classList.toggle('is-open',open);
    if(open&&!vid.getAttribute('src')){ vid.preload='metadata'; vid.src=vid.dataset.src }     // only the file's header, so it starts at once
    if(pinned&&p<.5) halt() }      // it never starts by itself; it stops when the frame closes again
  if(vid&&play){ play.hidden=false;
    play.addEventListener('click',()=>{ userPaused=false; start(false) });
    if(sound){ sound.addEventListener('click',()=>{ vid.muted=false; sound.hidden=true });
      vid.addEventListener('volumechange',()=>{ if(!vid.muted) sound.hidden=true }) }
    vid.addEventListener('playing',()=>art.classList.add('is-film','is-playing'));
    vid.addEventListener('pause',()=>{ if(vid.seeking) return; art.classList.remove('is-playing'); if(byScript) byScript=false; else if(!vid.ended) userPaused=true });
    vid.addEventListener('ended',()=>{ art.classList.remove('is-film','is-playing'); vid.controls=false; if(sound) sound.hidden=true; try{ vid.currentTime=0 }catch(e){} });
    if(window.IntersectionObserver) new IntersectionObserver(es=>{ if(!es[0].isIntersecting) halt() }).observe(art);   // never keeps talking off screen
  }
  function update(){ header.classList.toggle('is-scrolled',scrollY>4); const p=cl(scrollY/end); hero.style.setProperty('--p',p.toFixed(4)); gate(p) }
  let ticking=false; addEventListener('scroll',()=>{ if(!ticking){ ticking=true; requestAnimationFrame(()=>{ ticking=false; update() }) } },{passive:true});
  addEventListener('resize',measure); addEventListener('load',measure);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
  if(window.ResizeObserver) new ResizeObserver(measure).observe(track);
  measure();
  // The painting fades in over its blurred placeholder once it has been decoded.
  const pic=art.querySelector('img'), shown=()=>pic.classList.add('is-in');
  if(pic.decode) pic.decode().then(shown,shown); else if(pic.complete) shown(); else pic.addEventListener('load',shown);

  // Small-window menu
  const btn=document.querySelector('.nav__menu'), menu=document.getElementById('menu');
  function setMenu(open){ const had=menu.contains(document.activeElement); btn.setAttribute('aria-expanded',open); menu.hidden=!open; header.classList.toggle('is-open',open); if(!open&&had) btn.focus() }
  btn.addEventListener('click',()=>setMenu(btn.getAttribute('aria-expanded')!=='true'));
  menu.addEventListener('click',e=>{ if(e.target.closest('a')) setMenu(false) });
  addEventListener('keydown',e=>{ if(e.key==='Escape') setMenu(false) });
  matchMedia('(min-width:881px)').addEventListener('change',e=>{ if(e.matches) setMenu(false) });

  // Film player. The poster and the film are fetched only when it is opened.
  const film=document.getElementById('film'), video=film.querySelector('video');
  document.addEventListener('click',e=>{ if(!e.target.closest('[data-film]')) return; e.preventDefault();
    if(!video.src){ video.poster=video.dataset.poster; video.src=video.dataset.src }
    if(vid) vid.pause(); film.showModal(); video.play().catch(()=>{}) });
  film.addEventListener('close',()=>video.pause());
  film.querySelector('.film__close').addEventListener('click',()=>film.close());
  film.addEventListener('click',e=>{ if(e.target===film) film.close() });
})();
