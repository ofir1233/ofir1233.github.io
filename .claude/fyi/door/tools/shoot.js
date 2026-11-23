// node tools/shoot.js <out.png> <w> <h> <t|end> [selector-to-clip|-] [dpr]
const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async()=>{
  const [out,w,h,t,sel,dpr] = process.argv.slice(2);
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const p = await b.newPage({ viewport:{width:+w,height:+h}, deviceScaleFactor:+(dpr||1) });
  p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') console.log('console',m.type(),m.text()); }); p.on('pageerror',e=>console.log('PAGEERR',e.message));
  p.on('requestfailed',r=>console.log('REQFAIL',r.url()));
  await p.goto('http://localhost:8001/.claude/fyi/door/index.html?t='+t,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1200);
  const m = await p.evaluate(()=>{ const s=document.querySelector('#fyi').getBoundingClientRect(); return {secTop:s.top, secH:s.height, docW:document.documentElement.scrollWidth, docH:document.documentElement.scrollHeight}; });
  if (+w >= 600) await p.evaluate(({top,sh,vh})=>scrollTo(0, Math.max(0, top - Math.max(0,(vh - sh)/2))), {top:m.secTop, sh:m.secH, vh:+h});
  await p.waitForTimeout(150);
  if (sel && sel!=='-') await (await p.$(sel)).screenshot({path:out}); else await p.screenshot({path:out, fullPage: +w<600});
  console.log(out, JSON.stringify(m));
  await b.close();
})();
