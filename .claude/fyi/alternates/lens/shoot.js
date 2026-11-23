const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
const URL='http://localhost:8001/.claude/fyi/alternates/lens/index.html';
const only = process.argv[2] || 'all';
(async()=>{
const b = await chromium.launch({ channel:'chrome', headless:true });
const errs=[];
async function open(w,h,opts={}){
  const c = await b.newContext({viewport:{width:w,height:h}, deviceScaleFactor: opts.dpr||1, hasTouch:!!opts.touch, isMobile:!!opts.touch});
  const p = await c.newPage();
  p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto(URL,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1200);
  await p.evaluate(()=>{ __lens.manual(true); });
  return p;
}
const adv=(p,ms)=>p.evaluate(ms=>__lens.advance(ms),ms);
if(only==='all'||only==='desk'){
  for(const [w,h,tag] of [[1370,770,'1370'],[1440,900,'1440']]){
    const p=await open(w,h);
    await adv(p,300);
    await p.screenshot({path:`shots/${tag}-rest.png`});
    if(tag==='1370'){
      await p.evaluate(()=>__lens.pointer(-1,-.2)); await adv(p,1500); await p.screenshot({path:'shots/1370-pointer-left.png'});
      await p.evaluate(()=>__lens.pointer(1,.3)); await adv(p,1500); await p.screenshot({path:'shots/1370-pointer-right.png'});
      await p.evaluate(()=>__lens.release()); await adv(p,4000);
      await p.evaluate(()=>__lens.start()); await adv(p,900); await p.screenshot({path:'shots/1370-mid-hold.png'});
      await adv(p,800+1400); await p.waitForTimeout(450); await p.screenshot({path:'shots/1370-sent.png'});
      // strip
      await adv(p,3000);
      const lens=await p.$('#lens'); const bb=await lens.boundingBox();
      const clip={x:bb.x-24,y:bb.y-22,width:bb.width+48,height:bb.height+44};
      const times=[0,300,800,1300,1680,1900,2150,3100];
      await p.evaluate(()=>{ __lens.S.idleT=0; });
      let t=0; let i=0;
      for(const tt of times){
        if(tt===0){ await p.screenshot({path:`shots/_f${i}.png`,clip}); await p.evaluate(()=>__lens.start()); }
        else { await adv(p,tt-t); t=tt; await p.screenshot({path:`shots/_f${i}.png`,clip}); }
        i++;
      }
      // early release
      await adv(p,2500); await p.waitForTimeout(500);
      await p.evaluate(()=>__lens.start()); await adv(p,800); await p.evaluate(()=>__lens.end()); await adv(p,160);
      await p.screenshot({path:'shots/1370-release-early.png'});
      await adv(p,500); await p.screenshot({path:'shots/1370-after-release.png'});
    }
    await p.context().close();
  }
}
if(only==='all'||only==='mob'){
  const p=await open(390,844,{touch:true,dpr:2});
  await adv(p,300);
  await p.screenshot({path:'shots/390-rest-top.png'});
  await p.screenshot({path:'shots/390-rest-full.png',fullPage:true});
  await p.evaluate(()=>document.querySelector('#lens').scrollIntoView({block:'center'}));
  await p.waitForTimeout(200);
  await p.screenshot({path:'shots/390-rest.png'});
  await p.evaluate(()=>__lens.start()); await adv(p,950);
  await p.screenshot({path:'shots/390-mid-hold.png'});
  await adv(p,750+1400); await p.waitForTimeout(450); await p.screenshot({path:'shots/390-sent.png'});
  await p.context().close();
}
console.log('errors:',errs.length?errs:'none');
await b.close();
})();
