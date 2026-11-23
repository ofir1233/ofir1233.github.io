const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async()=>{
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  const errs=[]; p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.text()); }); p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('http://localhost:8001/.claude/fyi/door/index.html',{waitUntil:'domcontentloaded'});
  const T = () => p.evaluate(()=>+document.querySelector('.trk-b:nth-child(3) .trk-l i').parentElement.parentElement.style.getPropertyValue('--f'));
  await p.waitForTimeout(1500);
  console.log('beat after 1.5s', await p.evaluate(()=>document.querySelector('#fyi').dataset.beat));
  await p.waitForTimeout(5000);
  console.log('beat after 6.5s', await p.evaluate(()=>document.querySelector('#fyi').dataset.beat));
  // frame pacing while playing
  const fps = await p.evaluate(()=>new Promise(r=>{ let n=0, t0=performance.now(); const f=()=>{ n++; if(performance.now()-t0<2000) requestAnimationFrame(f); else r(n/2); }; requestAnimationFrame(f); }));
  console.log('fps during play (headless)', fps);
  await p.waitForTimeout(8000);
  console.log('after 16.5s: beat', await p.evaluate(()=>document.querySelector('#fyi').dataset.beat), 'f3', await T());
  await p.screenshot({path:'shots/_1440-final.png'});
  // step 2
  await p.click('.trk-b[data-step="2"]');
  await p.waitForTimeout(6000);
  console.log('after step 2 click: beat', await p.evaluate(()=>document.querySelector('#fyi').dataset.beat), 'f3', await T(), 'rec vis', await p.evaluate(()=>getComputedStyle(document.querySelector('#rec')).visibility), 'pst vis', await p.evaluate(()=>getComputedStyle(document.querySelector('#pst')).visibility));
  await p.screenshot({path:'shots/_1440-step2.png'});
  // pointer depth
  await p.click('.trk-b[data-step="3"]'); await p.waitForTimeout(6500);
  await p.mouse.move(1300, 150); await p.waitForTimeout(100); await p.mouse.move(1340, 120); await p.waitForTimeout(1200);
  await p.screenshot({path:'shots/_1440-ptr-tr.png'});
  await p.mouse.move(200, 800); await p.waitForTimeout(100); await p.mouse.move(180, 820); await p.waitForTimeout(1200);
  await p.screenshot({path:'shots/_1440-ptr-bl.png'});
  console.log('errors', errs);
  // reduced motion
  const c2 = await b.newContext({ viewport:{width:1370,height:770}, reducedMotion:'reduce' }); const p2 = await c2.newPage();
  await p2.goto('http://localhost:8001/.claude/fyi/door/index.html',{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1200);
  console.log('reduced motion beat', await p2.evaluate(()=>document.querySelector('#fyi').dataset.beat), await p2.evaluate(()=>document.querySelector('#tktN').textContent));
  await p2.click('.trk-b[data-step="1"]'); await p2.waitForTimeout(300);
  console.log('rm after step1', await p2.evaluate(()=>document.querySelector('#fyi').dataset.beat), await p2.evaluate(()=>getComputedStyle(document.querySelector('#rec')).visibility));
  // 1100 wide
  const p3 = await b.newPage({ viewport:{width:1100,height:760} });
  await p3.goto('http://localhost:8001/.claude/fyi/door/index.html?t=end',{waitUntil:'domcontentloaded'}); await p3.waitForTimeout(1200);
  await p3.screenshot({path:'shots/_1100-final.png'});
  await b.close();
})();
