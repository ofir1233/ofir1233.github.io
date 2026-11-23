/* Films the block.
     node film.js            everything: steps the clock 1/30 s a frame from the resting frame to the end of stage 4 (a pure function
                             of t), records stage 5 in real time (it drives the live page with real events), then makes the films,
                             the contact strips and the crops in film/
     node film.js quick      only stages 1 to 3 + 0.4 s, and the strips
     node film.js a b dir    only the stepped frames from a to b seconds into dir (for looking at one transition while working) */
const { chromium } = require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const HERE = __dirname, FF = '/opt/homebrew/bin/ffmpeg', URL = 'http://localhost:8001/.claude/proto/topics/index.html?auto=0';
const a = process.argv.slice(2), quick = a[0] === 'quick', range = a.length >= 2 && !quick;
const OUT = path.join(HERE, 'film'), FR = range ? (a[2] || path.join(OUT, 'frames-part')) : path.join(OUT, 'frames');
const ff = args => execFileSync(FF, ['-y', '-loglevel', 'error'].concat(args), { stdio: 'inherit' });
(async () => {
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1370, height: 860 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => window.tpProto.ready);
  const info = await p.evaluate(() => { const q = document.querySelector('.ct-stage').getBoundingClientRect(); return { B: tpProto.B, T: tpProto.T, REST: tpProto.REST, loDone: tpProto.S.loDone, hiDone: tpProto.S.hiDone, win: { x: Math.round(q.left) - 8, y: Math.round(q.top) - 8, w: Math.round(q.width) + 16, h: Math.round(q.height) + 16 } }; });
  const B = info.B, from = range ? +a[0] : info.REST, to = range ? +a[1] : quick ? B[3] + .4 : B[4];
  const times = []; let n = 0;
  for (let t = from; t <= to + 1e-6; t += 1 / 30) {
    await p.evaluate(tt => { window.tpProto.seek(tt); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
    await p.screenshot({ path: path.join(FR, 'f' + String(n).padStart(4, '0') + '.png') });
    times.push(+t.toFixed(4)); n++;
  }
  fs.writeFileSync(path.join(FR, 'info.json'), JSON.stringify({ info, times, from, to }));
  console.log('stepped frames', n, 'from', from, 'to', to.toFixed(2), '| B', B.map(v => v.toFixed(2)).join(' '), '| loDone', info.loDone.toFixed(2), 'hiDone', info.hiDone.toFixed(2));
  if (range) { if (errs.length) console.log('ERRORS', errs.slice(0, 5)); await b.close(); return; }
  /* the films of stages 1 to 3 */
  const n13 = times.filter(t => t <= B[3] + .4 + 1e-6).length;
  const enc = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart'];
  ff(['-framerate', '30', '-i', path.join(FR, 'f%04d.png'), '-frames:v', String(n13), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2'].concat(enc, [path.join(OUT, 'stages-1-3.mp4')]));
  ff(['-framerate', '15', '-i', path.join(FR, 'f%04d.png'), '-frames:v', String(n13), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-r', '30'].concat(enc, [path.join(OUT, 'stages-1-3-slow.mp4')]));
  console.log('stages-1-3.mp4, stages-1-3-slow.mp4:', n13, 'frames');
  if (!quick) {
    /* stage 5 answers real events with the product's own timers and transitions, so it is recorded as it plays: the browser's
       screencast frames carry their own times, and are laid on a 30 fps grid from the moment the play starts */
    const S5 = path.join(OUT, 'frames-s5'); fs.rmSync(S5, { recursive: true, force: true }); fs.mkdirSync(S5, { recursive: true });
    const cdp = await p.context().newCDPSession(p), shots = [];
    cdp.on('Page.screencastFrame', f => { shots.push({ ts: f.metadata.timestamp, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
    await p.evaluate(tt => window.tpProto.seek(tt), B[4]); await p.waitForTimeout(400);
    await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
    await p.waitForTimeout(250);
    const t0 = await p.evaluate(([x, y]) => { window.tpProto.play(x, y); return Date.now() / 1000; }, [B[4], info.T]);
    await p.waitForTimeout((info.T - B[4] + 1.3) * 1000);
    await cdp.send('Page.stopScreencast');
    let m = 0, j = 0; const dur = info.T - B[4] + 1.1;
    for (let k = 1; k / 30 <= dur; k++) { const at = t0 + k / 30; while (j + 1 < shots.length && shots[j + 1].ts <= at) j++; fs.writeFileSync(path.join(S5, 'g' + String(m++).padStart(4, '0') + '.png'), Buffer.from(shots[j].data, 'base64')); }
    console.log('stage 5 recorded:', shots.length, 'screencast frames in', dur.toFixed(2), 's (', (shots.length / (dur + .25)).toFixed(1), 'a second ) laid on', m, 'frames');
    ff(['-framerate', '30', '-i', path.join(FR, 'f%04d.png'), '-framerate', '30', '-i', path.join(S5, 'g%04d.png'), '-filter_complex', '[0:v]scale=1370:860,setsar=1[a];[1:v]scale=1370:860,setsar=1[b];[a][b]concat=n=2:v=1,scale=trunc(iw/2)*2:trunc(ih/2)*2[v]', '-map', '[v]'].concat(enc, [path.join(OUT, 'full.mp4')]));
    console.log('full.mp4');
    fs.rmSync(S5, { recursive: true, force: true });
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5));
  await b.close();
  execFileSync('python3', [path.join(HERE, 'strips.py'), FR, OUT], { stdio: 'inherit' });
})();
