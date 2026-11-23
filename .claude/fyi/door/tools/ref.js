const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async()=>{
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const p = await b.newPage({ viewport:{width:1370,height:770} });
  await p.goto('http://localhost:8001/index.html',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{ const s=document.querySelector('#fyi'); window.scrollTo(0, s.getBoundingClientRect().top+scrollY-20); });
  await p.waitForTimeout(1500);
  await p.screenshot({path:'tools/ref-block.png'});
  const info = await p.evaluate(()=>{
    const g=(sel,props)=>{const e=document.querySelector(sel); if(!e) return null; const c=getComputedStyle(e); const o={}; props.forEach(k=>o[k]=c.getPropertyValue(k)); const r=e.getBoundingClientRect(); o.rect=[r.x|0,r.y|0,r.width|0,r.height|0]; return o;};
    const P=['font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','background-image','padding','border-radius','box-shadow','margin-top'];
    return { sec:g('#fyi',P), label:g('#fyi .label',P), labelb:g('#fyi .label b',P), h2:g('#fyi h2',P), p:g('#fyi p',P), btn:g('#fyi .cs-more',P), btnAfter:(()=>{const c=getComputedStyle(document.querySelector('#fyi .cs-more'),'::after'); return {bg:c.backgroundImage,bgc:c.backgroundColor,w:c.width};})(), body:g('body',P), wrap:g('#fyi .wrap',P) };
  });
  console.log(JSON.stringify(info,null,1));
  await b.close();
})();
