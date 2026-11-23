const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async()=>{
  const b = await chromium.launch({ channel:'chrome', headless:true });
  const p = await b.newPage({ viewport:{width:1500,height:1200} });
  p.on('console',m=>console.log('console',m.text())); p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8001/.claude/fyi/door/tools/build.html',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1500);
  for (const id of ['cover-a','cover-b','cover-c','poster']) await (await p.$('#'+id)).screenshot({path:`a/${id}.png`});
  await p.screenshot({path:'tools/check.png', fullPage:true});
  await b.close();
})();
