const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
const path = require('path');
const OUT = path.join(__dirname, '..', 'shots');
const URL = 'http://localhost:8001/.claude/fyi/alternates/phone-door/index.html';
const which = process.argv[2] || 'all';
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const errs = [];
  async function page(w, h, q, dpr) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr || 2 });
    const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    await p.goto(URL + (q || ''), { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(900);
    return p;
  }
  if (which === 'all' || which === 'desk') {
    let p = await page(1370, 770, '?still=1');
    await p.screenshot({ path: OUT + '/1370-rest.png' });
    p = await page(1370, 770, '?still=1&state=near');
    await p.screenshot({ path: OUT + '/1370-near.png' });
    p = await page(1370, 770, '?still=1&state=open');
    await p.screenshot({ path: OUT + '/1370-open.png' });
    p = await page(1440, 900, '?still=1');
    await p.screenshot({ path: OUT + '/1440-rest.png' });
  }
  if (which === 'all' || which === 'flat') {
    const p = await page(520, 960, '?flat=1');
    await p.screenshot({ path: OUT + '/screen-flat.png' });
  }
  if (which === 'all' || which === 'mob') {
    let p = await page(390, 844, '?still=1');
    await p.screenshot({ path: OUT + '/390-rest.png', fullPage: true });
    p = await page(390, 844, '?still=1&state=open');
    await p.screenshot({ path: OUT + '/390-open.png', fullPage: true });
  }
  if (which === 'all' || which === 'strip') {
    const p = await page(1370, 770, '', 1);
    await p.evaluate(() => { window.__door.freeze(); window.__door.go(); });
    const times = [0, 120, 240, 380, 540, 720, 920, 1200];
    let t = 0; const info = [];
    for (let i = 0; i < times.length; i++) {
      const s = await p.evaluate(ms => window.__door.advance(ms), times[i] - t); t = times[i];
      info.push(times[i] + 'ms ang ' + s.ang.toFixed(1) + ' take ' + s.take.toFixed(2));
      await p.screenshot({ path: OUT + '/_f' + i + '.png' });
    }
    console.log(info.join('\n'));
  }
  if (which === 'mid') {
    const p = await page(1370, 770, '', 2);
    await p.evaluate(() => { window.__door.freeze(); window.__door.go(); });
    await p.evaluate(() => window.__door.advance(200)); await p.screenshot({ path: OUT + '/_mid-200.png' });
    await p.evaluate(() => window.__door.advance(260)); await p.screenshot({ path: OUT + '/_mid-460.png' });
  }
  if (which === 'live') {
    const p = await page(1370, 770, '', 1);
    const st = () => p.evaluate(() => { const s = window.__door.state(); return [s.S.ang.toFixed(1), s.S.take.toFixed(2), s.mode, s.L.rest.toFixed(1), s.L.near.toFixed(1)].join(' '); });
    console.log('rest', await st());
    await p.mouse.move(300, 400); await p.waitForTimeout(900); console.log('far pointer', await st());
    await p.mouse.move(820, 420, { steps: 8 }); await p.waitForTimeout(1200); console.log('near pointer', await st());
    await p.screenshot({ path: OUT + '/_live-near.png' });
    await p.mouse.move(200, 596, { steps: 8 }); await p.waitForTimeout(1200); console.log('on button', await st());
    await p.mouse.move(700, 5, { steps: 4 }); await p.mouse.move(700, -5); await p.waitForTimeout(2500); console.log('left', await st());
    await p.waitForTimeout(5200); console.log('idle beat', await st());
    await p.mouse.click(1000, 400); await p.waitForTimeout(600); console.log('clicked +600', await st());
    await p.waitForTimeout(1200); console.log('+1800', await st()); await p.screenshot({ path: OUT + '/_live-open.png' });
    await p.waitForTimeout(2500); console.log('+4300', await st()); await p.screenshot({ path: OUT + '/_live-reset.png' });
    await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(700); console.log('enter on door', await st());
    const q = await page(1370, 770, '', 1);
    await q.emulateMedia({ reducedMotion: 'reduce' }); await q.reload({ waitUntil: 'domcontentloaded' }); await q.waitForTimeout(700);
    await q.mouse.click(1000, 400); await q.waitForTimeout(300);
    console.log('reduced', await q.evaluate(() => { const s = window.__door.state(); return [s.S.ang.toFixed(1), s.S.take, s.mode].join(' '); }));
  }
  if (which === 'focus') {
    const p = await page(1370, 770, '');
    await p.keyboard.press('Tab'); await p.waitForTimeout(700);
    await p.screenshot({ path: OUT + '/_focus-btn.png' });
    await p.keyboard.press('Tab'); await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + '/_focus-door.png' });
    console.log(await p.evaluate(() => document.activeElement.className));
  }
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
