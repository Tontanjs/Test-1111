const { chromium } = require('playwright');
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
fs.mkdirSync(__dirname + '/out', { recursive:true });
const errs = [];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1360,height:900} });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if(m.type() === 'error' && !m.text().includes('ERR_FAILED')) errs.push('console ' + m.text()); });
  await p.route('**/*', r => r.request().url().startsWith('http://t.local/') ? r.fulfill({ contentType:'text/html; charset=utf-8', body: html }) : r.abort());
  await p.addInitScript({ path: __dirname + '/fake.js' }); await p.addInitScript({ path: __dirname + '/gm.js' });
  await p.goto('http://t.local/'); await p.waitForTimeout(600);
  await p.screenshot({ path:__dirname + '/out/s-home.png', fullPage:true });
  await p.click('#btn-new'); await p.waitForTimeout(300);
  await p.screenshot({ path:__dirname + '/out/s-overview.png', fullPage:true });
  await p.click('#tab-decide'); await p.waitForTimeout(200);
  // choose some options
  const clickOpt = async (sec, label, idx) => { await p.click(`.secnav button:has-text("${sec}")`); await p.locator(`.ctl:has(h4:text-is("${label}")) .opt`).nth(idx).click(); };
  await clickOpt('ภาษีและการคลัง', 'อัตรา VAT', 1);
  await clickOpt('การศึกษาและทักษะ', 'ปฏิรูปครูและหลักสูตร', 2);
  await clickOpt('ปราบทุจริต', 'เปิดข้อมูลจัดซื้อจัดจ้าง', 1);
  await clickOpt('วิจัยและนวัตกรรม', 'งบวิจัยภาครัฐ', 2);
  await p.click('.secnav button:has-text("นโยบายพิเศษและโครงการ")'); await p.fill('#custom-text', 'เครดิตภาษีบริษัทที่จ้างผู้สูงอายุ'); await p.click('#btn-custom'); await p.waitForTimeout(400);
  await p.locator('.ctl:has(h4:text-is("อินเทอร์เน็ตความเร็วสูงทุกหมู่บ้าน")) .opt').click().catch(e => console.log('proj', String(e).slice(0,80)));
  await p.screenshot({ path:__dirname + '/out/s-decide.png', fullPage:false });
  console.log('BAR', await p.locator('#actionbar').innerText());
  for(let y = 0; y < 9; y++){
    if(await p.locator('#btn-form').count()){ console.log('ELECTION at y', y, (await p.locator('.card:has-text("ผลการเลือกตั้ง") table').innerText()).split('\n').slice(0,4).join(' / ')); await p.screenshot({ path:__dirname + '/out/s-election.png', fullPage:true }); await p.click('#btn-form'); await p.waitForTimeout(400); continue; }
    if(await p.locator('#btn-continue').count()){ await p.click('#btn-continue'); await p.waitForTimeout(300); continue; }
    await p.click('#tab-decide'); await p.waitForTimeout(150);
    const run = p.locator('#btn-run'); if(!(await run.count())){ console.log('no run btn y', y, (await p.locator('main').innerText()).slice(0,200)); break; }
    if(await run.isDisabled()){ console.log('run disabled', await p.locator('#actionbar').innerText()); await p.click('#actionbar button:has-text("ล้าง")'); }
    await p.click('#btn-run'); await p.waitForTimeout(500);
  }
  await p.click('#tab-report'); await p.waitForTimeout(200); await p.screenshot({ path:__dirname + '/out/s-report.png', fullPage:true });
  await p.click('#tab-world'); await p.waitForTimeout(200); await p.screenshot({ path:__dirname + '/out/s-world.png', fullPage:true });
  await p.click('#tab-history'); await p.waitForTimeout(200); console.log('HIST', (await p.locator('main').innerText()).slice(0, 700).replace(/\n/g,' / '));
  await p.click('#tab-save'); await p.click('#btn-export'); await p.waitForTimeout(500);
  const code = await p.inputValue('#export-code'); console.log('code', code.slice(0, 10), code.length);
  // import on a fresh page
  await p.click('button:has-text("หน้าหลัก")'); await p.fill('#import-code', code); await p.click('#btn-import'); await p.waitForTimeout(400);
  console.log('IMPORTED', await p.locator('.brand').innerText());
  // reload: resume from saves
  await p.reload(); await p.waitForTimeout(700); console.log('SLOTS', await p.locator('.slot').count());
  // phone layout
  await p.setViewportSize({ width:390, height:844 }); await p.locator('.slot button.primary').first().click(); await p.waitForTimeout(300); await p.click('#tab-decide');
  await p.screenshot({ path:__dirname + '/out/s-phone.png', fullPage:false });
  console.log('overflow', await p.evaluate(() => document.documentElement.scrollWidth));
  console.log('prompts', await p.evaluate(() => sessionStorage.getItem('plen')));
  console.log('errors', errs);
  await b.close();
})();
