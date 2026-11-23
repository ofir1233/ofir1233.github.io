// plays the block in real time and shoots N frames; prints the clock time of each
const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async () => {
  const w = +process.argv[2] || 1370, h = +process.argv[3] || 860, n = +process.argv[4] || 10, pre = process.argv[5] || 'strip';
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); }); p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8001/.claude/proto/topics/index.html?auto=0', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => window.tpProto.ready); await p.waitForTimeout(800);
  const T = await p.evaluate(() => window.tpProto.T), B = await p.evaluate(() => window.tpProto.B);
  const targets = [-0.5, 0.9, B[1] - 0.1, B[1] + 0.75, B[2] + 0.9, B[3] - 0.1, B[3] + 0.8, B[4] - 0.05, B[4] + 1.15, B[4] + 2.2].slice(0, n);
  const out = [];
  await p.screenshot({ path: `shots/${pre}-0.png` }); out.push(['rest', `shots/${pre}-0.png`]);
  const t0 = Date.now();
  await p.evaluate(() => window.tpProto.play(window.tpProto.REST, window.tpProto.T));
  for (let i = 1; i < targets.length; i++) {
    await p.waitForFunction(v => window.tpProto.t >= v, targets[i], { polling: 'raf', timeout: 30000 });
    const t = await p.evaluate(() => window.tpProto.t);
    await p.screenshot({ path: `shots/${pre}-${i}.png` }); out.push([t.toFixed(1) + ' s', `shots/${pre}-${i}.png`]);
  }
  await p.waitForFunction(() => !window.tpProto.playing, null, { timeout: 30000 });
  const wall = (Date.now() - t0) / 1000; await p.waitForTimeout(900);
  await p.screenshot({ path: `shots/${pre}-end.png` }); out.push(['end, live', `shots/${pre}-end.png`]);
  console.log('T', T.toFixed(2), 'wall', wall.toFixed(2), 'B', B.map(v => v.toFixed(2)).join(' '));
  console.log(out.map(o => `"${o[0]}=${o[1]}"`).join(' '));
  await b.close();
})();
