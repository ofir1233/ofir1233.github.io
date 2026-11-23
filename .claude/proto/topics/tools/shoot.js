// usage: node shoot.js '[{name,w,h,q,seek,full,info,dpr,play}]'
const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async () => {
  const jobs = JSON.parse(process.argv[2]);
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.dpr || 1, reducedMotion: j.calm ? 'reduce' : 'no-preference' });
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(j.name, m.type().toUpperCase(), m.text()); });
    p.on('pageerror', e => console.log(j.name, 'PAGEERROR', e.message));
    await p.goto('http://localhost:8001/.claude/proto/topics/index.html' + (j.q || '?auto=0'), { waitUntil: 'domcontentloaded' });
    await p.evaluate(() => window.tpProto.ready);
    await p.waitForTimeout(800);
    if (j.seek !== undefined) { await p.evaluate(v => { const P = window.tpProto, B = P.B; const t = typeof v === 'string' ? (v === 'end' ? P.T : v === 'rest' ? P.REST : B[+v.slice(1)] - 0.14) : v; P.seek(t); }, j.seek); await p.waitForTimeout(500); }
    if (j.rel !== undefined) { await p.evaluate(v => { const P = window.tpProto; P.seek(P.B[4] + v); }, j.rel); await p.waitForTimeout(j.after || 600); }
    if (j.play) { await p.evaluate(() => window.tpProto.play(window.tpProto.REST, window.tpProto.T)); await p.waitForFunction(() => !window.tpProto.playing, null, { timeout: 30000 }); await p.waitForTimeout(j.after || 900); }
    if (j.info) console.log(j.name, JSON.stringify(await p.evaluate(() => ({ T: +tpProto.T.toFixed(2), B: tpProto.B.map(v => +v.toFixed(2)), parts: tpProto.parts, block: Math.round(document.querySelector('.tp-block').getBoundingClientRect().height), sw: document.documentElement.scrollWidth, stage: Math.round(document.querySelector('.ct-stage').getBoundingClientRect().width) }))));
    await p.screenshot({ path: 'shots/' + j.name + '.png', fullPage: !!j.full });
    await p.close();
  }
  await b.close();
})();
