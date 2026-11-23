// checks the controls for real: step click holds at its end, drag scrubs, keyboard focus, and the live page answers a real mouse after the play
const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1370, height: 1000 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8001/.claude/proto/topics/index.html?auto=0', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => window.tpProto.ready); await p.waitForTimeout(700);
  const B = await p.evaluate(() => tpProto.B);
  // click step 2: plays stage 2 only and holds
  await p.click('.tp-steps li:nth-child(2) button'); await p.waitForFunction(() => !tpProto.playing); 
  console.log('after click step 2: t =', (await p.evaluate(() => tpProto.t)).toFixed(2), 'expected', B[2].toFixed(2));
  // drag along the steps: scrub
  const r1 = await p.locator('.tp-steps li:nth-child(1)').boundingBox(), r4 = await p.locator('.tp-steps li:nth-child(4)').boundingBox();
  await p.mouse.move(r1.x + 10, r1.y + 20); await p.mouse.down(); await p.mouse.move(r1.x + r1.width / 2, r1.y + 20, { steps: 5 });
  console.log('scrub mid step 1: t =', (await p.evaluate(() => tpProto.t)).toFixed(2));
  await p.mouse.move(r4.x + r4.width / 2, r4.y + 20, { steps: 8 }); await p.waitForTimeout(300);
  console.log('scrub mid step 4: t =', (await p.evaluate(() => tpProto.t)).toFixed(2), 'range', B[3].toFixed(2), B[4].toFixed(2));
  await p.screenshot({ path: 'shots/x-scrub-mid-stage4.png' });
  await p.mouse.up();
  // keyboard: focus ring on a step
  await p.focus('.tp-again'); await p.keyboard.press('Tab'); await p.waitForTimeout(150);
  await p.screenshot({ path: 'shots/x-focus-step.png', clip: { x: 60, y: 170, width: 800, height: 120 } });
  console.log('focused:', await p.evaluate(() => document.activeElement.textContent.trim()));
  // full play, then a real mouse on the live page
  await p.evaluate(() => tpProto.play(tpProto.REST, tpProto.T)); await p.waitForFunction(() => !tpProto.playing, null, { timeout: 30000 }); await p.waitForTimeout(600);
  const fr = p.frames().find(f => /topics=hi/.test(f.url()));
  const tile = await fr.locator('.tp-tile >> nth=0').boundingBox();
  await p.mouse.move(tile.x + tile.width / 2, tile.y + tile.height / 2, { steps: 6 }); await p.waitForTimeout(400);
  console.log('real hover on first tile: hot =', await fr.evaluate(() => !!document.querySelector('.tp-tile.hot')), '| pointer-events:', await p.evaluate(() => getComputedStyle(document.querySelector('.tp-hi')).pointerEvents));
  await p.screenshot({ path: 'shots/x-live-real-hover.png' });
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
