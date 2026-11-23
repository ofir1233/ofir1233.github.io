const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const p = await b.newPage({ viewport:{width:1370,height:770} });
  const errs=[]; p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); }); p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('http://localhost:8001/.claude/fyi/door/index.html?auto=0',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1200);
  await p.evaluate(()=>scrollTo(0,45));
  const ts = (process.argv[2]||'0,1.3,2.4,3.79,5.9,7.05,8.14,9.7,10.6,12.9').split(',').map(Number);
  fs.mkdirSync('shots/_f',{recursive:true});
  for (let i=0;i<ts.length;i++){ await p.evaluate(t=>window.__door.seek(t), ts[i]); await p.waitForTimeout(450); await p.screenshot({path:`shots/_f/f${i}.png`}); }
  fs.writeFileSync('shots/_f/ts.json', JSON.stringify(ts));
  console.log('errors', errs);
  await b.close();
})();
