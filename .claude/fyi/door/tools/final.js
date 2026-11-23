const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
const U = 'http://localhost:8001/.claude/fyi/door/index.html';
(async()=>{
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const errs=[];
  const open = async (w,h,q,dpr=1) => { const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:dpr }); p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.text()); }); p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('requestfailed',r=>errs.push('REQFAIL '+r.url())); await p.goto(U+q,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1300); return p; };
  const centre = p => p.evaluate(()=>{ const s=document.querySelector('#fyi').getBoundingClientRect(); scrollTo(0, Math.max(0, s.top + scrollY - Math.max(0,(innerHeight - s.height)/2))); });
  // desktop 1370x770
  for (const [name,t] of [['01-rest-1370',0],['02-beat1-peak-1370',3.79],['03-beat2-peak-1370',8.14],['04-beat3-poster-leaving-1370',10.62],['05-final-1370','end']]) {
    const p = await open(1370,770,'?t='+t); await centre(p); await p.waitForTimeout(200); await p.screenshot({path:`shots/${name}.png`}); await p.close();
  }
  { const p = await open(1440,900,'?t=end'); await centre(p); await p.waitForTimeout(200); await p.screenshot({path:'shots/06-final-1440.png'}); await p.close(); }
  // phone screens close up (objects hidden so the screens read clean)
  for (const [i,t] of [[1,3.79],[2,8.14],[3,'end']]) {
    const p = await open(1370,770,'?t='+t,2); await p.addStyleTag({content:'.rec,.pst,.tkt,.wv,.ink,.sk,.bg-cyan,.bg-dots{display:none!important}'}); await p.waitForTimeout(150);
    await (await p.$('#ph')).screenshot({path:`shots/_scr${i}.png`}); await p.close();
  }
  // mobile 390x844, full page
  for (const [name,t] of [['08-rest-390',0],['09-final-390','end'],['_m1',3.79],['_m2',8.14]]) {
    const p = await open(390,844,'?t='+t,2); await p.screenshot({path:`shots/${name}.png`, fullPage:true}); await p.close();
  }
  // live: autoplay, drag scrub, overflow
  { const p = await open(1370,770,''); await centre(p);
    await p.waitForTimeout(15500);
    const end = await p.evaluate(()=>({beat:document.querySelector('#fyi').dataset.beat, n:document.querySelector('#tktN').textContent, sw:document.documentElement.scrollWidth}));
    const r = await p.evaluate(()=>{ const r=document.querySelector('.trk').getBoundingClientRect(); return {x:r.left,y:r.top+20,w:r.width}; });
    await p.mouse.move(r.x+r.w*.9, r.y); await p.mouse.down(); await p.mouse.move(r.x+r.w*.6, r.y,{steps:6}); await p.mouse.move(r.x+r.w*.5, r.y,{steps:6});
    const mid = await p.evaluate(()=>({beat:document.querySelector('#fyi').dataset.beat, pst:getComputedStyle(document.querySelector('#pst')).visibility, rec:getComputedStyle(document.querySelector('#rec')).visibility}));
    await p.mouse.up(); await p.waitForTimeout(400);
    const after = await p.evaluate(()=>document.querySelector('#fyi').dataset.beat);
    console.log('autoplay end', end, 'scrub mid', mid, 'after release', after);
    await p.close(); }
  console.log('errors', errs);
  await b.close();
})();
