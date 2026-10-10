/* ================= SCREENS ================= */
let S = null, tab = 'overview', sec = 'fiscal', D = null, busy = null, note = null, confirmKey = null, repIdx = null, newsFilter = 'all', codeOut = '', coal = null;
const TABS = [['overview','ภาพรวม'],['decide','ตัดสินใจ'],['report','รายงานประจำปี'],['world','เทียบโลก'],['history','ประวัติศาสตร์'],['news','ข่าว'],['save','บันทึกและส่งต่อ']];
const SRCN = { gov:'รัฐบาล', law:'นิติบัญญัติ', event:'เหตุการณ์', proj:'โครงการ', mkt:'ตลาดการเงิน', pol:'การเมือง', press:'สื่อ', opp:'ฝ่ายค้าน', partner:'พรรคร่วม', biz:'ธุรกิจ', people:'ประชาชน', world:'ต่างประเทศ' };
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if(attrs) for(const [k,v] of Object.entries(attrs)){
    if(v == null || v === false) continue;
    if(k === 'text') el.textContent = v; else if(k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if(k === 'class') el.className = v; else if(v === true) el.setAttribute(k, ''); else el.setAttribute(k, v);
  }
  for(const c of kids.flat(9)) if(c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
const NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs, ...kids){ const el = document.createElementNS(NS, tag); if(attrs) for(const [k,v] of Object.entries(attrs)) if(v != null) el.setAttribute(k, v); for(const c of kids.flat(9)) if(c != null) el.append(c.nodeType ? c : document.createTextNode(String(c))); return el; }
const nf = (v, d) => v == null ? '–' : Number(v).toLocaleString('en-US', { minimumFractionDigits:d || 0, maximumFractionDigits:d || 0 });
const sign = (v, d) => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(d == null ? 1 : d);
const fmtWhen = ms => { try{ return new Date(ms).toLocaleString('th-TH-u-ca-gregory', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }); }catch(e){ return ''; } };
function card(title, sub, ...body){ return h('section',{class:'card'}, h('div',{class:'card-h'}, h('h3',{text:title}), sub ? h('span',{class:'tiny muted',text:sub}) : null), h('div',{class:'card-b'}, ...body)); }
function newDraft(){ return { ctl:{}, pol:[], proj:[], bud:null }; }
function spark(key, n){
  const H = S.hist.slice(-(n || 40)).map(x => x[key]).filter(v => typeof v === 'number'); if(H.length < 2) return null;
  const lo = Math.min(...H), hi = Math.max(...H), sp = hi - lo || 1, X = i => i / (H.length - 1) * 100, Y = v => 24 - (v - lo) / sp * 21 - 1.5;
  const line = H.map((v,i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return svg('svg',{class:'spark',viewBox:'0 0 100 26',preserveAspectRatio:'none','aria-hidden':'true'}, svg('polygon',{class:'ar',points:`0,26 ${line} 100,26`}), svg('polyline',{class:'ln',points:line}), svg('circle',{class:'pt',cx:100,cy:Y(H[H.length-1]),r:1.8}));
}
function kpi(label, val, unit, key, good, hint, cls){
  const H = S.hist, i = H.length - 1, past = i >= 4 ? H[i - 4] : null, d = past && H[i][key] != null && past[key] != null ? H[i][key] - past[key] : null;
  const dc = d == null || Math.abs(d) < 1e-9 ? 'flat' : (d > 0) === good ? 'up' : 'dn';
  return h('div',{class:'kpi ' + (cls || '')}, h('span',{class:'l',text:label}), h('span',{class:'v'}, val, unit ? h('small',{text:' ' + unit}) : null),
    d != null ? h('span',{class:'d ' + dc,text:`${sign(d, key === 'appr' || key === 'gdppc' || key === 'cpi' || key === 'gii' || key === 'pisa' ? 0 : 2)} ใน 1 ปี`}) : null, spark(key), hint ? h('span',{class:'h',text:hint}) : null);
}
function meter(label, v, good){ const cls = good ? (v >= 55 ? '' : v >= 45 ? 'neu' : v >= 35 ? 'warn' : 'bad') : (v <= 35 ? '' : v <= 60 ? 'warn' : 'bad');
  return h('div',{class:'meter ' + cls}, h('span',{text:label}), h('b',{text:String(Math.round(v))}), h('div',{class:'bar',role:'img','aria-label':`${label} ${Math.round(v)} จาก 100`}, h('i',{style:`width:${clamp(v,0,100)}%`}))); }

/* ---------- home ---------- */
function home(){
  const kids = [h('header',{class:'hero'},
    h('p',{class:'eyebrow',text:'เกมบริหารประเทศแบบสมจริง · เริ่ม ต.ค. 2569'}), h('h1',{text:'ประเทศไทย 2570+'}),
    h('p',{class:'lede',text:'คุณบริหารประเทศไทยทีละปีงบประมาณ ตั้งภาษี งบประมาณ การลงทุน การศึกษา วิจัย ปราบทุจริต สวัสดิการ สิ่งแวดล้อม และการรับมือการชุมนุม ผ่านช่องทางกฎหมายจริง ทุกตัวเลขคำนวณด้วยแบบจำลองที่ตรวจสอบได้ แล้วเทียบกับ 12 ประเทศ เลือกตั้งทุกสี่ปี เกมไม่จบ: แพ้แล้วรัฐบาลใหม่รับช่วงต่อ ประเทศเดินต่อรุ่นสู่รุ่น'})),
  ];
  if(note) kids.push(h('div',{class:'notice',role:'alert'}, note));
  const list = [...saves.values()].sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
  if(list.length) kids.push(h('section',{class:'stack'}, h('h2',{text:'เล่นต่อ'}), ...list.map(d => h('div',{class:'slot'},
    h('div',{class:'stack',style:'gap:2px'}, h('b',{text:d.name || 'ประเทศไทย'}), h('span',{class:'small muted',text:`${qLong(d.q)} · ${d.junta ? 'รัฐบาลหลังรัฐประหาร' : 'รัฐบาลพรรค' + PARTY[d.gov.lead].th + ' รุ่นที่ ' + d.gov.gen} · นิยม ${Math.round(GK.reduce((a,k) => a + GROUPS[k].w * d.pol.grp[k], 0))} · บันทึก ${fmtWhen(d.updatedAt)}`})),
    h('div',{class:'row'}, h('button',{class:'btn primary',id:'open-' + d.id,onclick:() => openSave(d.id)},'เล่นต่อ'),
      h('button',{class:'btn ghost sm',onclick:() => { if(confirmKey !== 'del' + d.id){ confirmKey = 'del' + d.id; render(); return; } confirmKey = null; removeSave(d.id); render(); }}, confirmKey === 'del' + d.id ? 'กดอีกครั้งเพื่อลบ' : 'ลบ')))),
    h('p',{class:'small muted',text: cloud.ready ? 'บันทึกเข้าบัญชีของคุณ เปิดจากเครื่องไหนก็เล่นต่อได้' : 'บันทึกในเบราว์เซอร์นี้ ใช้รหัสส่งต่อเพื่อย้ายเครื่อง'})));
  const nameIn = h('input',{type:'text',id:'new-name',value:'ประเทศไทยของฉัน','aria-label':'ชื่อเกม',maxlength:'40'});
  const aiSel = h('select',{id:'new-ai','aria-label':'ข่าวโดย Claude'}, h('option',{value:'on'},'เปิด: Claude เขียนข่าวและบทวิเคราะห์ปีละครั้ง'), h('option',{value:'off'},'ปิด: เล่นด้วยแบบจำลองล้วน ไม่ใช้โควตา'));
  const codeIn = h('textarea',{id:'import-code',placeholder:'วางรหัสส่งต่อที่ขึ้นต้นด้วย TH1: หรือ TH0:','aria-label':'รหัสส่งต่อ'});
  kids.push(h('div',{class:'grid2'},
    card('เริ่มประเทศใหม่', 'เริ่มที่ปีงบประมาณ 2570', h('label',{class:'f'}, 'ชื่อเกม', nameIn), h('label',{class:'f'}, 'ข่าวและบทวิเคราะห์', aiSel),
      h('button',{class:'btn primary',id:'btn-new',onclick:() => { S = newGame({ name:nameIn.value.trim() || 'ประเทศไทยของฉัน', claude:aiSel.value === 'on' }); D = newDraft(); tab = 'overview'; note = null; persist(true); render(); window.scrollTo(0,0); }},'เริ่มบริหารประเทศ'),
      h('p',{class:'tiny muted',text:'Claude เขียนข่าวปีละครั้ง ข้อความราว 5,000 ตัวอักษร ทั้งเกมเล่นได้ครบแม้ปิด Claude'})),
    card('รับเกมต่อจากคนอื่น', 'วางรหัสส่งต่อ', codeIn, h('button',{class:'btn',id:'btn-import',onclick:async () => { try{ S = await importCode(codeIn.value); D = newDraft(); tab = 'overview'; note = null; persist(true); render(); }catch(e){ note = 'นำเข้าไม่ได้: ' + (e.message || 'รหัสไม่ถูกต้อง'); render(); } }},'นำเข้าและเล่นต่อ'))));
  const order = []; FACTS.forEach(f => f[1].forEach(id => { if(!order.includes(id)) order.push(id); })); WORLD_SRC.forEach(id => { if(!order.includes(id)) order.push(id); });
  kids.push(h('div',{class:'grid2'},
    card('วิธีเล่น', null, h('ul',{class:'facts'},
      h('li',{text:'หนึ่งรอบคือหนึ่งปีงบประมาณ (ต.ค.–ก.ย.) ตั้งค่าการตัดสินใจในแท็บตัดสินใจ แล้วกดดำเนินปีงบประมาณ ระบบคำนวณทีละไตรมาสและออกรายงานประจำปี'}),
      h('li',{text:'ทุนทางการเมืองต่อปี 4–10 แต้มตามคะแนนนิยมและเสียงในสภา มติ ครม. ใช้ 1 แต้ม พระราชบัญญัติ 2 แต้มต่อขั้น แก้รัฐธรรมนูญ 3 แต้ม งบประมาณไม่ใช้แต้ม'}),
      h('li',{text:'กฎหมายใช้เวลาจริง: พระราชบัญญัติราว 3 ไตรมาส วุฒิสภาอาจยับยั้ง แก้รัฐธรรมนูญต้องผ่านประชามติ ธปท. และคณะกรรมการค่าจ้างเป็นอิสระ'}),
      h('li',{text:'หนี้สาธารณะเกินเพดาน 70% แล้วเพิ่มรายจ่ายใหม่ไม่ได้ บริษัทจัดอันดับลดอันดับได้'}),
      h('li',{text:'เลือกตั้งทุกสี่ปี (ครั้งแรก ม.ค.–มี.ค. 2573) คุณรวมเสียงจัดตั้งรัฐบาล ถ้าแพ้ คุณบริหารต่อในฐานะรัฐบาลชุดใหม่ นายกฯ อยู่ได้ไม่เกิน 8 ปี รัฐบาลอาจล้มด้วยศาล มติไม่ไว้วางใจ หรือรัฐประหาร แต่ประเทศเดินต่อ'}),
      h('li',{text:'ทุกครั้งที่กด เกมบันทึกเอง ปิดหน้าไปแล้วกลับมาเล่นต่อได้ทุกเมื่อ ใช้รหัสส่งต่อให้คนอื่นเล่นต่อได้'}))),
    card('ข้อเท็จจริงตั้งต้น', `ตรวจสอบ ณ ${ASOF}`, h('ol',{class:'facts'}, FACTS.map(f => h('li',null, f[0], h('sup',null, f[1].map(id => h('a',{href:'#src-' + id,text:`[${order.indexOf(id) + 1}]`})))))),
      h('details',null, h('summary',{text:'แหล่งที่มา'}), h('ol',{class:'sources'}, order.map(id => h('li',{id:'src-' + id}, h('a',{href:SRC[id].u,target:'_blank',rel:'noopener',text:SRC[id].t}), ` (${SRC[id].d})`)))),
      h('p',{class:'tiny muted',text:'ค่าที่ไม่มีแหล่ง เช่น ความพอใจของแต่ละกลุ่ม ต้นทุนนโยบาย ดัชนีโครงสร้าง และสัมประสิทธิ์ของแบบจำลอง เป็นค่าของเกม ระบุไว้ในหน้าเล่น'}))));
  return h('div',{class:'wrap stack',style:'gap:22px'}, ...kids);
}
function openSave(id){ const d = saves.get(id); if(!d){ return; } S = JSON.parse(JSON.stringify(d)); (S.custom || []).forEach(p => POLK[p.id] = p); D = newDraft(); tab = S.phase === 'election' ? 'overview' : 'overview'; note = null; render(); window.scrollTo(0,0); }

/* ---------- shell ---------- */
function shell(){
  const top = h('div',{class:'top'},
    h('div',{class:'top-in'},
      h('div',{class:'brand'}, h('b',{text:S.name}), h('span',{class:'tiny muted',text:`${qLong(S.q)} · ปีงบ ${beYear(fyOf(S.q))} · ${S.junta ? 'รัฐบาลหลังรัฐประหาร' : 'รัฐบาล' + PARTY[S.gov.lead].th + ' รุ่นที่ ' + S.gov.gen}`})),
      stat('คะแนนนิยม', approval(S) + '/100'), stat('เสียงรัฐบาล', S.junta ? '–' : govSeats(S) + '/500'), stat('ทุนการเมือง', S.phase === 'decide' ? String(S.pol.cap) : '–'),
      stat('หนี้/GDP', debtPct(S).toFixed(1) + '%', 'opt-hide'), stat('เลือกตั้ง', S.junta ? 'งด' : qLabel(S.nextElec), 'opt-hide'),
      h('span',{class:'tiny muted',id:'savestate',text:saveLabel()}),
      h('button',{class:'btn ghost sm',onclick:() => { persist(true); S = null; D = null; note = null; render(); window.scrollTo(0,0); }},'หน้าหลัก')),
    h('nav',{class:'tabs',role:'tablist','aria-label':'หน้าในเกม'}, TABS.map(([k,t]) => h('button',{class:'tab',role:'tab','aria-selected':String(tab === k),id:'tab-' + k,onclick:() => { tab = k; render(); window.scrollTo(0,0); }}, t, (k === 'overview' && S.phase === 'election') ? h('span',{class:'dot','aria-label':'มีเรื่องรอ'}) : null))));
  const body = tab === 'decide' ? decideTab() : tab === 'report' ? reportTab() : tab === 'world' ? worldTab() : tab === 'history' ? historyTab() : tab === 'news' ? newsTab() : tab === 'save' ? saveTab() : overviewTab();
  return [top, h('main',{class:'wrap stack',style:'padding-top:16px;gap:16px'}, note ? h('div',{class:'notice',role:'alert'}, note, ' ', h('button',{class:'btn ghost sm',onclick:() => { note = null; render(); }},'ปิด')) : null, body), tab === 'decide' && S.phase === 'decide' ? actionBar() : null];
}
function stat(k, v, cls){ return h('div',{class:'stat ' + (cls || '')}, h('span',{class:'k',text:k}), h('span',{class:'v',text:v})); }
function paintSave(){ const el = document.getElementById('savestate'); if(el) el.textContent = saveLabel(); }
function paintBusy(){ render(); }

/* ---------- overview ---------- */
function alerts(){
  const A = [], E = S.eco, P = S.pol;
  if(S.phase === 'election') A.push(['bad','!','ผลเลือกตั้งออกแล้ว จัดตั้งรัฐบาลด้านล่างก่อนเล่นต่อ']);
  if(S.phase === 'running') A.push(['warn','…','ปีงบประมาณนี้ยังไม่จบ กดดำเนินต่อด้านล่าง']);
  if(debtPct(S) >= E.ceil) A.push(['bad','!',`หนี้สาธารณะ ${debtPct(S).toFixed(1)}% เกินเพดาน ${E.ceil}% รายจ่ายถูกตัดและเพิ่มรายจ่ายใหม่ไม่ได้`]);
  else if(debtPct(S) >= E.ceil - 2) A.push(['warn','▲',`หนี้สาธารณะ ${debtPct(S).toFixed(1)}% ใกล้เพดาน ${E.ceil}%`]);
  if(P.court > 45) A.push(['warn','▲',`ความเสี่ยงคดีในศาลรัฐธรรมนูญ ${Math.round(P.court)}/100 เกิน 60 นายกฯ อาจพ้นตำแหน่ง`]);
  if(P.prot > 60) A.push(['warn','▲',`การชุมนุมสูง ${Math.round(P.prot)}/100 ความเชื่อมั่นลดและเสี่ยงรัฐประหาร`]);
  for(const k of Object.keys(P.par)) if(P.par[k] < 35) A.push(['warn','▲',`${PARTY[k].th}ไม่พอใจ (${Math.round(P.par[k])}/100) ต่ำกว่า 20 จะถอนตัว`]);
  if(!S.junta && govSeats(S) < 270) A.push(['warn','▲',`รัฐบาลมี ${govSeats(S)} เสียง ทุนการเมืองลดลง เสี่ยงแพ้มติไม่ไว้วางใจในไตรมาสแรกของปี`]);
  if(E.outlook < 0) A.push(['warn','▲','อันดับความน่าเชื่อถือมีแนวโน้มเป็นลบ']);
  if(!A.length) A.push(['good','✓','ไม่มีเรื่องเร่งด่วน ตั้งค่าการตัดสินใจของปีนี้แล้วดำเนินปีงบประมาณ']);
  return h('div',{class:'stack',style:'gap:6px'}, A.map(a => h('div',{class:'alert ' + a[0]}, h('span',{class:'ic','aria-hidden':'true',text:a[1]}), h('span',{text:a[2]}))));
}
function overviewTab(){
  const E = S.eco, rows = worldTable(S), rk = (k, asc) => { const r = rankOf(rows, k, asc); return r ? `อันดับ ${r[0]} จาก ${r[1]}` : ''; };
  const parts = [alerts()];
  if(S.phase === 'election') parts.push(electionPanel());
  if(S.phase === 'running') parts.push(h('div',{class:'row'}, h('button',{class:'btn primary',id:'btn-continue',onclick:continueRun},'ดำเนินปีงบประมาณต่อ')));
  parts.push(h('div',{class:'kpis'},
    kpi('เศรษฐกิจโต', E.g.toFixed(1), '%', 'g', true, `ศักยภาพ ${E.gp.toFixed(2)}%`),
    kpi('เงินเฟ้อ', E.pi.toFixed(1), '%', 'pi', false, 'เป้า ธปท. 1–3%'),
    kpi('ว่างงาน', E.u.toFixed(1), '%', 'u', false),
    kpi('ดอกเบี้ยนโยบาย', E.r.toFixed(2), '%', 'r', false, `ความน่าเชื่อถือ ธปท. ${Math.round(E.botcred * 100)}`),
    kpi('หนี้สาธารณะ', debtPct(S).toFixed(1), '% GDP', 'debt', false, `เพดาน ${E.ceil}% · ${RATING[E.rating]}`, debtPct(S) >= E.ceil ? 'bad' : debtPct(S) >= E.ceil - 2 ? 'warn' : ''),
    kpi('ขาดดุล', defPct(S).toFixed(1), '% GDP', 'def', false, `รายได้ ${S.fis.rev.toFixed(2)} รายจ่าย ${S.fis.spend.toFixed(2)} ล้านล้านบาท`),
    kpi('GDP ต่อหัว', nf(gdppc(S)), 'ดอลลาร์', 'gdppc', true, rk('gdppc')),
    kpi('คะแนนนิยมรัฐบาล', String(approval(S)), '/100', 'appr', true),
    kpi('ดัชนีคอร์รัปชัน (CPI)', String(cpiScore(S)), '/100', 'cpi', true, rk('cpi')),
    kpi('อันดับนวัตกรรม (GII)', String(giiRank(giiScore(S))), 'ของโลก', 'gii', false, rk('gii', true)),
    kpi('PISA คณิตศาสตร์ (คาด)', String(pisaEst(S)), 'คะแนน', 'pisa', true, rk('pisa')),
    kpi('R&D', rdPct(S).toFixed(2), '% GDP', 'rd', true, 'เป้าทางการ 2% ภายในปี 2580')));
  parts.push(h('div',{class:'grid2'},
    card('ดัชนีโครงสร้าง', '50 = จุดเริ่มปี 2569 · ค่าของเกม', ...IK.map(k => meter(IDX[k], S.idx[k], true))),
    card('ฐานเสียงและการเมือง', `นิยม ${approval(S)}/100 ถ่วงตามสัดส่วนกลุ่ม`, ...GK.map(g => meter(GROUPS[g].th, S.pol.grp[g], true)),
      meter('ความเสี่ยงคดีศาลรัฐธรรมนูญ', S.pol.court, false), meter('ระดับการชุมนุม', S.pol.prot, false),
      ...Object.keys(S.pol.par).map(k => meter(`ความพอใจของ${PARTY[k].th}`, S.pol.par[k], true)))));
  const latest = S.news.slice(-5).reverse();
  parts.push(card('ข่าวล่าสุด', null, h('div',{class:'feed'}, latest.map(newsItem)), h('button',{class:'btn ghost sm',onclick:() => { tab = 'news'; render(); }},'ดูข่าวทั้งหมด')));
  return h('div',{class:'stack',style:'gap:16px'}, ...parts);
}
function electionPanel(){
  const E = S.electionNow; if(!E) return null;
  if(!coal){ const A = autoCoalition(S); coal = A ? { lead:A.lead, partners:new Set(A.partners) } : { lead:PK.slice().sort((a,b) => E.seats[b] - E.seats[a])[0], partners:new Set() }; }
  const leads = PK.filter(k => E.seats[k] >= 40), total = E.seats[coal.lead] + [...coal.partners].reduce((a,p) => a + (willing(S, coal.lead, p) >= 40 ? E.seats[p] : 0), 0);
  const bar = h('div',{class:'seatbar',role:'img','aria-label':'สัดส่วนที่นั่ง'}, PK.map(k => h('i',{style:`width:${E.seats[k] / 5}%;background:${PARTY[k].col}`,title:`${PARTY[k].th} ${E.seats[k]}`})));
  const tbl = h('div',{class:'tbl'}, h('table',null, h('thead',null, h('tr',null, h('th',{text:'พรรค'}), h('th',{class:'num',text:'บัญชีรายชื่อ %'}), h('th',{class:'num',text:'เขต'}), h('th',{class:'num',text:'บัญชีรายชื่อ'}), h('th',{class:'num',text:'รวม'}), h('th',{class:'num',text:'เดิม'}), h('th',{text:'ร่วมรัฐบาล'}))),
    h('tbody',null, PK.slice().sort((a,b) => E.seats[b] - E.seats[a]).map(k => { const w = k === coal.lead ? null : willing(S, coal.lead, k);
      return h('tr',{class: k === coal.lead ? 'me' : ''}, h('td',null, h('span',{style:`display:inline-block;width:9px;height:9px;border-radius:2px;background:${PARTY[k].col};margin-right:6px`}), PARTY[k].th), h('td',{class:'num',text:E.share[k].toFixed(1)}), h('td',{class:'num',text:E.cons[k]}), h('td',{class:'num',text:E.list[k]}), h('td',{class:'num'}, h('b',{text:E.seats[k]})), h('td',{class:'num',text:S.pol.seats[k]}),
        h('td',null, k === coal.lead ? h('span',{class:'pill acc',text:'แกนนำ'}) : h('label',{class:'row',style:'gap:6px'}, h('input',{type:'checkbox',checked:coal.partners.has(k),onchange:ev => { if(ev.target.checked) coal.partners.add(k); else coal.partners.delete(k); render(); }}), h('span',{class:'pill ' + (w >= 60 ? 'good' : w >= 40 ? 'warn' : 'bad'),text: w >= 40 ? `พร้อม ${w}` : `ปฏิเสธ ${w}`})))); }))));
  return card('ผลการเลือกตั้งทั่วไป', qLong(E.q), bar, tbl,
    h('div',{class:'row'}, h('label',{class:'f'}, 'พรรคแกนนำจัดตั้งรัฐบาล', h('select',{id:'coal-lead',onchange:e => { coal = { lead:e.target.value, partners:new Set() }; render(); }}, leads.map(k => h('option',{value:k,selected:k === coal.lead}, `${PARTY[k].th} (${E.seats[k]})`)))),
      h('span',{class:'stat'}, h('span',{class:'k',text:'เสียงที่รวมได้'}), h('span',{class:'v',text:`${total} / 251`}))),
    h('div',{class:'row'}, h('button',{class:'btn primary',id:'btn-form',onclick:() => { const er = formGovernment(S, coal.lead, [...coal.partners]); if(er){ note = er; render(); return; } coal = null; note = null; persist(true); continueRun(); }},'จัดตั้งรัฐบาลและเล่นต่อ'),
      h('button',{class:'btn',onclick:() => { const A = autoCoalition(S); if(A){ coal = { lead:A.lead, partners:new Set(A.partners) }; render(); } else { note = 'ไม่มีพรรคใดรวมเสียงได้ถึง 251 จะเลือกตั้งใหม่ไตรมาสหน้า'; S.electionNow = null; S.nextElec = S.q + 1; S.phase = 'running'; persist(true); continueRun(); } }},'จัดชุดที่รวมเสียงได้มากที่สุด')),
    h('p',{class:'tiny muted',text:'คุณบริหารต่อในฐานะรัฐบาลที่จัดตั้งได้ ไม่ว่าพรรคใด ความพร้อมร่วมรัฐบาลมาจากพฤติกรรมการจัดตั้งรัฐบาลปี 2566 และ 2569 (ค่าของเกม) พรรคที่ต่ำกว่า 40 จะปฏิเสธ ที่นั่งเขตคำนวณจากการแกว่งของคะแนนตามกฎกำลังสาม'}));
}
function continueRun(){
  if(!S) return; const r = run(S);
  if(r === 'year'){ D = newDraft(); const rep = S.years[S.years.length - 1]; repIdx = S.years.length - 1; tab = 'report'; persist(true); render(); window.scrollTo(0,0); yearNews(S, rep); return; }
  if(r === 'election'){ coal = null; tab = 'overview'; }
  persist(true); render(); window.scrollTo(0,0);
}

/* ---------- decide ---------- */
function changes(){ return Object.keys(D.ctl).filter(id => D.ctl[id] !== pendingTarget(S, id)).length + D.pol.length + D.proj.length + (D.bud ? 1 : 0); }
function effSummary(c, from, to){
  if(from === to) return null;
  const bits = [], dv = (arr) => at(arr, to) - at(arr, from);
  const dc = dv(c.cost) + (c.rdv ? (c.rdv[to] - c.rdv[from]) / 100 * S.eco.gdp : 0), dr = dv(c.rev);
  if(Math.abs(dc) > 1e-6) bits.push(h('span',{class: dc > 0 ? 'n' : 'p',text:`รายจ่าย ${sign(dc * 1000, 0)} พันล้านบาท/ปี`}));
  if(Math.abs(dr) > 1e-6) bits.push(h('span',{class: dr > 0 ? 'p' : 'n',text:`รายได้ ${sign(dr * 1000, 0)} พันล้านบาท/ปี`}));
  for(const k of Object.keys(c.idx || {})){ const v = dv(c.idx[k]); if(v) bits.push(h('span',{class: v > 0 ? 'p' : 'n',text:`${IDX[k]} ${sign(v, 0)}`})); }
  if(c.pi){ const v = dv(c.pi); if(v) bits.push(h('span',{class: v > 0 ? 'n' : 'p',text:`เงินเฟ้อ ${sign(v, 2)}`})); }
  if(c.jump && c.jump.pi) bits.push(h('span',{class: to > from ? 'n' : 'p',text:`เงินเฟ้อครั้งเดียว ${sign(c.jump.pi * (to - from), 1)}`}));
  if(c.u){ const v = dv(c.u); if(v) bits.push(h('span',{class: v > 0 ? 'n' : 'p',text:`ว่างงาน ${sign(v, 2)}`})); }
  if(c.ext){ const v = dv(c.ext); if(v) bits.push(h('span',{class: v > 0 ? 'p' : 'n',text:`อุปสงค์ต่างประเทศ ${sign(v, 2)}`})); }
  const gu = [], gd = []; for(const g of Object.keys(c.grp || {})){ const v = dv(c.grp[g]); if(v > 0) gu.push(GROUPS[g].th + ' +' + v); if(v < 0) gd.push(GROUPS[g].th + ' ' + v); }
  if(gu.length) bits.push(h('span',{class:'p',text:'พอใจ: ' + gu.join(', ')})); if(gd.length) bits.push(h('span',{class:'n',text:'ไม่พอใจ: ' + gd.join(', ')}));
  if(c.court){ const v = dv(c.court); if(v > 0) bits.push(h('span',{class:'n',text:`ความเสี่ยงคดี +${v}`})); }
  if(c.senate && at(c.senate, to)) bits.push(h('span',{class:'n',text:`วุฒิสภาอาจยับยั้ง ${Math.round(at(c.senate, to) * 100)}%`}));
  return h('p',{class:'eff'}, ...bits.flatMap((b,i) => i ? [' · ', b] : [b]));
}
function ctlCard(c){
  const cur = lvl(S, c.id), pendT = pendingTarget(S, c.id), pend = S.pend.find(x => x.id === c.id && x.kind === 'ctl'), sel = D.ctl[c.id] != null ? D.ctl[c.id] : pendT, ch = sel !== pendT, P = PATHS[c.path];
  const why = ch ? blocked(S, c.id, sel) : null;
  return h('div',{class:'ctl' + (ch ? ' changed' : '') + (pend ? ' pending' : '')},
    h('div',{class:'ctl-l'}, h('h4',{text:c.th}), h('div',{class:'row',style:'gap:4px'}, h('span',{class:'pill',text:P.th}), P.q ? h('span',{class:'pill',text:`มีผลใน ${P.q} ไตรมาส`}) : h('span',{class:'pill',text:'มีผลต้นปีงบ'}), P.cap ? h('span',{class:'pill acc',text:`ทุน ${P.cap}/ขั้น`}) : h('span',{class:'pill',text:'ไม่ใช้ทุน'})),
      h('p',{class:'tiny muted',text:c.note}), pend ? h('p',{class:'tiny',text:`อยู่ระหว่างดำเนินการ: "${c.opts[pend.lvl]}" ถึงกำหนด ${qLabel(pend.due)}`}) : null),
    h('div',{class:'ctl-r'}, h('div',{class:'opts',role:'group','aria-label':c.th}, c.opts.map((o,i) => h('button',{class:'opt' + (i === cur ? ' cur' : ''),type:'button','aria-pressed':String(i === sel),disabled:S.phase !== 'decide' || (!!pend && i !== pendT),
      title: i === cur ? 'ระดับที่มีผลอยู่' : '', onclick:() => { if(i === pendT) delete D.ctl[c.id]; else D.ctl[c.id] = i; render(); }}, o))),
      ch ? effSummary(c, pendT, sel) : h('p',{class:'tiny faint',text: i18cur(c, cur)}), why ? h('p',{class:'tiny',style:'color:var(--bad)',text:why}) : null));
}
const i18cur = (c, cur) => `มีผลอยู่: ${c.opts[cur]}`;
function budgetBox(){
  const B = D.bud || S.fis.budget, ins = {}, sum = h('span',{class:'small'});
  const upd = () => { const t = BUDK.reduce((a,k) => a + (Number(ins[k].value) || 0), 0); sum.textContent = `รวม ${t}% ${t === 100 ? '✓' : '· ต้องเท่ากับ 100'}`; sum.style.color = t === 100 ? '' : 'var(--bad)'; };
  const grid = h('div',{class:'budget'}, BUDK.map(k => { ins[k] = h('input',{type:'number',id:'bud-' + k,min:'0',max:'60',value:String(B[k]),oninput:upd,onchange:() => { const v = {}; let t = 0; BUDK.forEach(x => { v[x] = clamp(Math.round(Number(ins[x].value) || 0), 0, 60); t += v[x]; }); D.bud = t === 100 ? v : null; if(t !== 100) D.budBad = true; else D.budBad = false; renderBar(); }});
    return h('label',null, `${BUDTH[k]} (เดิม ${BUD0[k]})`, ins[k]); }));
  upd();
  return card('งบรายด้าน', 'สัดส่วนรายจ่ายตามดุลยพินิจ % (ค่าของเกม)', grid, sum,
    h('p',{class:'tiny muted',text:'การศึกษาและโครงสร้างพื้นฐานเพิ่มศักยภาพระยะยาว ยุติธรรมและปราบทุจริตเพิ่มความโปร่งใส เกษตรและท้องถิ่นทำให้ชนบทและพรรคฐานท้องถิ่นพอใจ งบท้องถิ่นที่สูงเพิ่มการรั่วไหลเล็กน้อย กลาโหมทำให้ข้าราชการและทหารพอใจ'}));
}
function specialBox(){
  const pols = POL.concat(S.custom || []), ta = h('textarea',{id:'custom-text',maxlength:'800',placeholder:'เช่น เครดิตภาษีให้บริษัทที่จ้างผู้สูงอายุ หรือ กองทุนเปลี่ยนรถเมล์เป็นไฟฟ้า'});
  return h('div',{class:'stack'},
    card('นโยบายพิเศษ', 'ครั้งเดียวหรือถาวร', ...pols.map(p => { const why = polBlocked(S, p.id), on = D.pol.includes(p.id);
      return h('div',{class:'ctl' + (on ? ' changed' : '')}, h('div',{class:'ctl-l'}, h('h4',{text:p.th}), h('div',{class:'row',style:'gap:4px'}, h('span',{class:'pill',text:PATHS[p.path].th}), h('span',{class:'pill acc',text:`ทุน ${PATHS[p.path].cap}`}), p.custom ? h('span',{class:'pill',text:'นโยบายของคุณ'}) : null), h('p',{class:'tiny muted',text:p.note})),
        h('div',{class:'ctl-r'}, h('p',{class:'eff',text:[p.once ? `ใช้เงิน ${nf(p.once * 1000)} พันล้านบาท` : '', p.rev ? `รายได้ ${sign(p.rev * 1000, 0)} พันล้านบาท/ปี` : '', ...Object.keys(p.grp || {}).map(g => `${GROUPS[g].th} ${sign(p.grp[g], 0)}`)].filter(Boolean).join(' · ')}),
          h('button',{class:'opt',type:'button','aria-pressed':String(on),disabled:S.phase !== 'decide' || (!!why && !on),onclick:() => { D.pol = on ? D.pol.filter(x => x !== p.id) : D.pol.concat([p.id]); render(); }}, on ? 'เลือกแล้ว' : why || 'เลือกนโยบายนี้'))); })),
    card('นโยบายที่คุณคิดเอง', 'Claude แปลงเป็นต้นทุนและผลกระทบภายในขอบเขตเดียวกับรายการ', ta,
      h('button',{class:'btn',id:'btn-custom',disabled:!!busy || !S.claude || !hasClaude,onclick:async () => { const t = ta.value.trim(); if(!t) return; busy = 'custom'; render();
        try{ const p = await customPolicy(S, t); S.custom = (S.custom || []).concat([p]); POLK[p.id] = p; D.pol.push(p.id); note = null; persist(true); }catch(e){ note = copyFor(e && e.code); } finally{ busy = null; render(); } }}, busy === 'custom' ? h('span',{class:'busy',text:'กำลังประเมิน'}) : 'ให้ Claude ประเมินและเพิ่มในรายการ'),
      (!S.claude || !hasClaude) ? h('p',{class:'tiny muted',text:'ต้องเปิด Claude ในแท็บบันทึกและส่งต่อ และเปิดเกมในแอป Claude'}) : null),
    card('โครงการลงทุนภาครัฐ', 'ทุน 1 ต่อโครงการ · วงเงินเป็นค่าประมาณของเกม', ...PROJ.map(P => { const x = S.proj.find(y => y.id === P.id), on = D.proj.includes(P.id), why = projBlocked(S, P.id);
      const prog = x ? Math.min(1, (S.q - x.q0) / P.q) : 0;
      return h('div',{class:'ctl' + (on ? ' changed' : '')}, h('div',{class:'ctl-l'}, h('h4',{text:P.th}), h('p',{class:'tiny muted',text:`${nf(P.cost * 1e6)} ล้านบาท · ${P.q} ไตรมาส · โครงสร้างพื้นฐาน +${P.infra} · รั่วไหล ${Math.round(P.leak * 100)}%${P.ppp ? ' · ร่วมทุนเอกชน รัฐจ่ายครึ่งหนึ่ง' : ''}`})),
        h('div',{class:'ctl-r'}, x ? meter(x.done ? 'แล้วเสร็จ' : 'ความคืบหน้า', prog * 100, true) : h('button',{class:'opt',type:'button','aria-pressed':String(on),disabled:S.phase !== 'decide' || (!!why && !on),onclick:() => { D.proj = on ? D.proj.filter(y => y !== P.id) : D.proj.concat([P.id]); render(); }}, on ? 'เลือกแล้ว' : why || 'อนุมัติโครงการ'))); })));
}
function decideTab(){
  if(S.phase !== 'decide') return h('div',{class:'stack'}, alerts(), S.phase === 'running' ? h('button',{class:'btn primary',onclick:continueRun},'ดำเนินปีงบประมาณต่อ') : h('button',{class:'btn primary',onclick:() => { tab = 'overview'; render(); }},'ไปจัดตั้งรัฐบาล'));
  const cnt = s => s === 'budget' ? (D.bud ? 1 : 0) : s === 'special' ? D.pol.length + D.proj.length : CTL.filter(c => c.sec === s && D.ctl[c.id] != null && D.ctl[c.id] !== pendingTarget(S, c.id)).length;
  const nav = h('div',{class:'secnav',role:'group','aria-label':'หมวดการตัดสินใจ'}, SECTIONS.map(([k,t]) => h('button',{type:'button','aria-pressed':String(sec === k),onclick:() => { sec = k; render(); }}, t, cnt(k) ? h('span',{class:'n',text:cnt(k)}) : null)));
  const body = sec === 'budget' ? budgetBox() : sec === 'special' ? specialBox() : h('div',{class:'stack'}, CTL.filter(c => c.sec === sec).map(ctlCard));
  return h('div',{class:'stack',style:'gap:14px'}, h('div',{class:'row',style:'justify-content:space-between'}, h('h2',{text:`ตัดสินใจปีงบประมาณ ${beYear(fyOf(S.q))}`}), h('span',{class:'small muted',text:'ระดับที่ขีดเส้นใต้คือที่มีผลอยู่ เลือกระดับใหม่แล้วดูผลกระทบใต้ปุ่ม'})), nav, body);
}
function draftFiscal(){
  let dc = 0, dr = 0;
  for(const id of Object.keys(D.ctl)){ const c = CTLK[id], from = pendingTarget(S, id), to = D.ctl[id]; dc += at(c.cost, to) - at(c.cost, from) + (c.rdv ? (c.rdv[to] - c.rdv[from]) / 100 * S.eco.gdp : 0); dr += at(c.rev, to) - at(c.rev, from);
    if(id === 'spend') dc += S.fis.spend * (c.adj[to] - c.adj[from]) / 100; }
  let once = 0; D.pol.forEach(id => once += POLK[id].once || 0); D.proj.forEach(id => once += PROJK[id].cost / PROJK[id].q * 4 * (PROJK[id].ppp ? .5 : 1));
  return { dc, dr, once };
}
function renderBar(){ const el = document.getElementById('actionbar'); if(el) el.replaceWith(actionBar()); }
function actionBar(){
  const used = draftCost(S, D), cap = S.pol.cap, F = draftFiscal(), n = changes(), over = used > cap;
  const bar = h('div',{class:'capbar','aria-label':`ใช้ทุน ${used} จาก ${cap}`}, Array.from({length:Math.max(cap, used)}, (_,i) => h('i',{class: i < Math.min(used, cap) ? 'on' : i < used ? 'over' : ''})));
  return h('div',{class:'actionbar',id:'actionbar'}, h('div',{class:'actionbar-in'},
    h('div',{class:'stack',style:'gap:2px'}, h('span',{class:'tiny muted',text:`ทุนการเมือง ${used}/${cap}`}), bar),
    h('div',{class:'grow small'}, n ? `${n} การเปลี่ยนแปลง · รายจ่าย ${sign(F.dc * 1000, 0)} รายได้ ${sign(F.dr * 1000, 0)} พันล้านบาท/ปี${F.once ? ' · ใช้ครั้งเดียว/ปีแรก ' + nf(F.once * 1000) + ' พันล้าน' : ''}` : 'ยังไม่มีการเปลี่ยนแปลง ดำเนินปีงบประมาณด้วยนโยบายเดิมได้', D.budBad ? h('span',{style:'color:var(--bad)',text:' · งบรายด้านต้องรวม 100%'}) : null, over ? h('span',{style:'color:var(--bad)',text:' · ทุนไม่พอ'}) : null),
    n ? h('button',{class:'btn ghost',onclick:() => { D = newDraft(); render(); }},'ล้าง') : null,
    h('button',{class:'btn primary',id:'btn-run',disabled:over || !!D.budBad || !!busy,onclick:() => { const e = commit(S, D); if(e){ note = e; render(); return; } note = null; persist(false); continueRun(); }}, `ดำเนินปีงบประมาณ ${beYear(fyOf(S.q))} ▶`)));
}

/* ---------- annual report ---------- */
function reportTab(){
  if(!S.years.length) return card('รายงานประจำปี', null, h('p',{class:'muted',text:'รายงานฉบับแรกออกเมื่อจบปีงบประมาณ 2570 ตั้งค่าการตัดสินใจแล้วกดดำเนินปีงบประมาณ'}), h('button',{class:'btn primary',onclick:() => { tab = 'decide'; render(); }},'ไปหน้าตัดสินใจ'));
  if(repIdx == null || repIdx >= S.years.length) repIdx = S.years.length - 1;
  const R = S.years[repIdx], a = R.a, b = R.b;
  const sel = h('select',{id:'rep-year','aria-label':'เลือกปี',onchange:e => { repIdx = Number(e.target.value); render(); }}, S.years.map((y,i) => h('option',{value:String(i),selected:i === repIdx}, `ปีงบประมาณ ${beYear(y.fy)}`)));
  const row = (l, k, d, good, unit) => { const dv = b[k] - a[k]; return h('tr',null, h('td',{text:l}), h('td',{class:'num',text:nf(a[k], d) + (unit || '')}), h('td',{class:'num',text:nf(b[k], d) + (unit || '')}), h('td',{class:'num',style:`color:var(--${Math.abs(dv) < 1e-9 ? 'ink-3' : (dv > 0) === good ? 'good' : 'bad'})`,text:sign(dv, d)})); };
  const kt = h('div',{class:'tbl'}, h('table',null, h('thead',null, h('tr',null, h('th',{text:'ตัวชี้วัด'}), h('th',{class:'num',text:'ต้นปี'}), h('th',{class:'num',text:'สิ้นปี'}), h('th',{class:'num',text:'เปลี่ยน'}))), h('tbody',null,
    row('เศรษฐกิจโต (%)','g',2,true), row('ศักยภาพการเติบโต (%)','gp',2,true), row('เงินเฟ้อ (%)','pi',2,false), row('ว่างงาน (%)','u',2,false), row('ดอกเบี้ยนโยบาย (%)','r',2,false),
    row('หนี้สาธารณะ (% GDP)','debt',1,false), row('ขาดดุล (% GDP)','def',1,false), row('หนี้ครัวเรือน (% GDP)','hh',1,false), row('GDP ต่อหัว (ดอลลาร์)','gdppc',0,true),
    row('คะแนนนิยม','appr',0,true), row('ดัชนีคอร์รัปชัน CPI','cpi',0,true), row('อันดับนวัตกรรม GII','gii',0,false), row('PISA คณิตศาสตร์ (คาด)','pisa',0,true), row('R&D (% GDP)','rd',2,true))));
  const dm = R.decomp, parts = [['ศักยภาพการเติบโต', dm.gp - 2.7], ['แรงกระตุ้นการคลัง', dm.fis], ['ดอกเบี้ย', dm.mon], ['ภาคต่างประเทศ', dm.ext], ['ความเชื่อมั่น', dm.conf], ['แรงฉุดเชิงโครงสร้าง', dm.drag], ['หนี้ครัวเรือน', dm.hh]];
  const mx = Math.max(.5, ...parts.map(p => Math.abs(p[1])));
  const bars = h('div',{class:'bars'}, parts.map(([l,v]) => h('div',{class:'br'}, h('span',{text:l}), h('div',{class:'t'}, h('i',{class: v >= 0 ? 'p' : 'n',style: v >= 0 ? `left:50%;width:${v / mx * 50}%` : `right:50%;width:${-v / mx * 50}%`})), h('span',{class:'v',text:sign(v, 2)}))));
  const idt = h('div',{class:'tbl'}, h('table',null, h('thead',null, h('tr',null, h('th',{text:'ดัชนี'}), h('th',{class:'num',text:'ต้นปี'}), h('th',{class:'num',text:'สิ้นปี'}))), h('tbody',null, IK.map(k => h('tr',null, h('td',{text:IDX[k]}), h('td',{class:'num',text:a.idx ? a.idx[k] : '–'}), h('td',{class:'num',text:b.idx ? b.idx[k] : '–'}))))));
  return h('div',{class:'stack',style:'gap:16px'},
    h('div',{class:'row',style:'justify-content:space-between'}, h('h2',{text:`รายงานประจำปีงบประมาณ ${beYear(R.fy)}`}), sel),
    R.ai ? card('บทวิเคราะห์', 'เขียนโดย Claude จากตัวเลขของแบบจำลอง', h('p',{text:R.ai})) : (busy === 'news' && repIdx === S.years.length - 1 ? card('บทวิเคราะห์', null, h('p',{class:'busy muted',text:'Claude กำลังเขียน'})) : null),
    h('div',{class:'grid2'}, card('ตัวชี้วัดหลัก', `${qLabel(R.q0)} ถึง ${qLabel(R.q1 - 1)}`, kt),
      h('div',{class:'stack'}, card('ที่มาของการเติบโต', 'จุดเปอร์เซ็นต์ เฉลี่ยทั้งปี เทียบศักยภาพตั้งต้น 2.7%', bars, h('p',{class:'tiny muted',text:`ศักยภาพเฉลี่ยปีนี้ ${dm.gp.toFixed(2)}% ในนั้นมาจากดัชนีโครงสร้าง ${sign(dm.gpStruct, 2)} จุด ที่เหลือคือผลของสังคมสูงวัย`})),
        card('การคลัง', `${R.fis.rating}${R.fis.outlook < 0 ? ' แนวโน้มลบ' : ''}`, h('div',{class:'kpis'}, h('div',{class:'kpi'}, h('span',{class:'l',text:'รายได้'}), h('span',{class:'v'}, R.fis.rev.toFixed(2), h('small',{text:' ล้านล้าน/ปี'}))), h('div',{class:'kpi'}, h('span',{class:'l',text:'รายจ่าย'}), h('span',{class:'v'}, R.fis.spend.toFixed(2), h('small',{text:' ล้านล้าน/ปี'}))),
          h('div',{class:'kpi'}, h('span',{class:'l',text:'ขาดดุล'}), h('span',{class:'v'}, R.fis.def.toFixed(1), h('small',{text:' % GDP'}))), h('div',{class:'kpi'}, h('span',{class:'l',text:'หนี้'}), h('span',{class:'v'}, R.fis.debt.toFixed(1), h('small',{text:` % (เพดาน ${R.fis.ceil})`}))))))),
    h('div',{class:'grid2'}, card('ดัชนีโครงสร้าง', null, idt), card('เหตุการณ์สำคัญของปี', null, R.events.length ? h('ul',{class:'facts'}, R.events.slice(0, 14).map(t => h('li',{text:t}))) : h('p',{class:'muted',text:'ไม่มีเหตุการณ์ใหญ่'}))),
    card('ฐานเสียงสิ้นปี', null, h('div',{class:'grid3'}, GK.map(g => meter(GROUPS[g].th, R.grp[g], true)))));
}

/* ---------- world ---------- */
function worldTab(){
  const rows = worldTable(S), cols = [['gdppc','GDP ต่อหัว (ดอลลาร์)',0,false],['g','เติบโต (%)',1,false],['cpi','CPI คอร์รัปชัน',0,false],['gii','อันดับ GII',0,true],['pisa','PISA คณิต',0,false]];
  const ranks = Object.fromEntries(cols.map(([k,,,asc]) => [k, Object.fromEntries(rows.filter(r => r[k] != null).sort((x,y) => asc ? x[k] - y[k] : y[k] - x[k]).map((r,i) => [r.k, i + 1]))]));
  const tbl = h('div',{class:'tbl'}, h('table',null, h('thead',null, h('tr',null, h('th',{text:'ประเทศ'}), cols.map(([,l]) => h('th',{class:'num',text:l})))),
    h('tbody',null, rows.slice().sort((a,b) => (b.gdppc || 0) - (a.gdppc || 0)).map(r => h('tr',{class:r.me ? 'me' : ''}, h('td',{text:r.th + (r.me ? ' (คุณ)' : '')}), cols.map(([k,,d]) => h('td',{class:'num'}, r[k] == null ? '–' : nf(r[k], d), r[k] != null ? h('span',{class:'rk',text:` #${ranks[k][r.k]}`}) : null)))))));
  /* GDP per head over time: Thailand from the record, the others from their projection rule */
  const H = S.hist.filter((x,i) => i % 4 === 0 || i === S.hist.length - 1), yrs = H.map(x => cal(x.q).y), peers = ['my','vn','id','cn','kr'];
  const peerAt = (k, q) => { const w = WORLD.find(x => x.k === k); if(!w || w.gdppc == null) return null; let pc = w.gdppc; const n = Math.floor(q / 4); for(let i = 0; i < n; i++){ const gi = w.g26 * Math.pow(.97, i) + 2 * (1 - Math.pow(.97, i)); pc *= 1 + (gi + 2) / 100; } return pc; };
  const series = [{ k:'th', th:'ไทย', me:true, pts:H.map(x => x.gdppc) }].concat(peers.map(k => ({ k, th:WORLD.find(w => w.k === k).th, pts:H.map(x => peerAt(k, x.q)) })));
  const all = series.flatMap(s => s.pts).filter(v => v != null), lo = 0, hi = Math.max(...all) * 1.08, W = 640, Hh = 260, L = 52, Rm = 92, T = 12, Bm = 26;
  const X = i => L + (H.length < 2 ? 0 : i / (H.length - 1) * (W - L - Rm)), Y = v => T + (1 - (v - lo) / (hi - lo)) * (Hh - T - Bm);
  const ticks = [0, .25, .5, .75, 1].map(f => hi * f);
  const chart = svg('svg',{class:'chart',viewBox:`0 0 ${W} ${Hh}`,role:'img','aria-label':'GDP ต่อหัวของไทยเทียบประเทศเพื่อนบ้านตามเวลา'},
    ticks.map(t => [svg('line',{class:'ax',x1:L,x2:W - Rm,y1:Y(t),y2:Y(t)}), svg('text',{class:'gl',x:L - 6,y:Y(t) + 4,'text-anchor':'end'}, nf(t / 1000) + 'k')]),
    H.length > 1 ? [svg('text',{class:'gl',x:L,y:Hh - 6}, beYear(yrs[0])), svg('text',{class:'gl',x:W - Rm,y:Hh - 6,'text-anchor':'end'}, beYear(yrs[yrs.length - 1]))] : null,
    series.map(s => { const P = s.pts.map((v,i) => v == null ? null : `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).filter(Boolean); const lastV = s.pts[s.pts.length - 1];
      return P.length > 1 ? [svg('polyline',{class:s.me ? 'me' : 'peer',points:P.join(' ')}), svg('text',{class:'lab' + (s.me ? ' me' : ''),x:W - Rm + 6,y:Y(lastV) + 4}, s.th)] : null; }));
  return h('div',{class:'stack',style:'gap:16px'},
    h('h2',{text:'ไทยเทียบโลก'}),
    card('ตารางเทียบ 12 ประเทศ', `ณ ${qLong(S.q)} · เรียงตาม GDP ต่อหัว · # = อันดับในกลุ่มนี้`, tbl,
      h('p',{class:'tiny muted',text:'ไทยมาจากแบบจำลอง ประเทศอื่นใช้ค่าล่าสุดที่มีแหล่ง (IMF 2025–2026, TI CPI 2025, WIPO GII 2025, OECD PISA 2022) GDP ต่อหัวของประเทศอื่นเติบโตตามประมาณการ IMF ปี 2026 แล้วค่อยลู่เข้าหา 2% ต่อปี บวกเงินเฟ้อดอลลาร์ 2% (สมมติของเกม) ค่าอื่นคงที่ อัตราแลกเปลี่ยนคงที่ อันดับ GII ของไทยวางบนอันดับโลกจริงปี 2025 ช่อง "–" คือไม่มีข้อมูลที่ตรวจสอบได้'})),
    card('GDP ต่อหัวตามเวลา', 'ดอลลาร์สหรัฐ ราคาปัจจุบัน', h('div',{style:'overflow-x:auto'}, chart), h('div',{class:'legend'}, h('span',null, h('i',{style:'background:var(--chart-th)'}), 'ไทย (แบบจำลอง)'), h('span',null, h('i',{style:'background:var(--chart-peer)'}), 'ประเทศอื่น (ตามสมมติข้างต้น)'))));
}

/* ---------- history ---------- */
function historyTab(){
  const cur = S.junta ? 'รัฐบาลหลังรัฐประหาร' : `พรรค${PARTY[S.gov.lead].th} · นายกฯ รุ่นที่ ${S.gov.gen}${S.gov.pmName ? ' (' + S.gov.pmName + ')' : ''}`;
  const govs = S.govs.slice().reverse();
  return h('div',{class:'stack',style:'gap:16px'},
    h('h2',{text:'ประวัติศาสตร์ชาติในเกมนี้'}),
    card('รัฐบาลปัจจุบัน', `ตั้งแต่ ${qLong(S.gov.since)}`, h('p',null, h('b',{text:cur})), h('p',{class:'small muted',text:`ที่มา: ${S.gov.how} · นายกฯ อยู่มาแล้ว ${((S.q - S.gov.pmSince) / 4).toFixed(1)} ปี (สูงสุด 8 ปี) · เลือกตั้งครั้งหน้า ${S.junta ? 'หลังรัฐบาลหลังรัฐประหารครบวาระ' : qLong(S.nextElec)}`})),
    card('สมุดพกรัฐบาลแต่ละชุด', 'เกรดคำนวณจากการเติบโต เงินเฟ้อ หนี้ CPI นวัตกรรม การศึกษา ศักยภาพ และคะแนนนิยม', govs.length ? h('div',{class:'stack'}, govs.map(g => h('div',{class:'gov-card'},
      h('span',{class:'grade',text:g.grade}), h('b',{text:`${g.lead === 'junta' ? 'รัฐบาลหลังรัฐประหาร' : 'พรรค' + PARTY[g.lead].th} · นายกฯ รุ่นที่ ${g.gen}${g.pm ? ' (' + g.pm + ')' : ''}`}),
      h('span',{class:'small muted',text:`${qLong(g.from)} – ${qLong(g.to)} · ${g.how}`}),
      h('span',{class:'small',text:`โตเฉลี่ย ${g.avgG}% · เงินเฟ้อ ${g.avgPi}% · หนี้ ${sign(g.dDebt)} จุด · CPI ${sign(g.dCpi, 0)} · อันดับ GII ${sign(g.dGii, 0)} · PISA ${sign(g.dPisa, 0)} · ศักยภาพ ${sign(g.dGp, 2)} · GDP ต่อหัว ${nf(g.gdppc0)} → ${nf(g.gdppc1)} · นิยมตอนจบ ${g.appr} · คะแนน ${g.score}`})))) : h('p',{class:'muted',text:'ยังไม่มีรัฐบาลที่ครบวาระในเกมนี้'})),
    card('การเลือกตั้ง', null, S.elections.length ? h('div',{class:'stack'}, S.elections.slice().reverse().map(e => h('div',{class:'stack',style:'gap:4px'}, h('b',{text:`${qLong(e.q)} · รัฐบาลพรรค${PARTY[e.lead].th} ${e.total} เสียง`}),
      h('div',{class:'seatbar'}, PK.map(k => h('i',{style:`width:${e.seats[k] / 5}%;background:${PARTY[k].col}`,title:`${PARTY[k].th} ${e.seats[k]}`}))),
      h('span',{class:'tiny muted',text:PK.filter(k => e.seats[k]).sort((a,b) => e.seats[b] - e.seats[a]).map(k => `${PARTY[k].th} ${e.seats[k]}`).join(' · ')})))) : h('p',{class:'muted',text:'การเลือกตั้งครั้งแรกในเกม: ม.ค.–มี.ค. 2573'})));
}

/* ---------- news ---------- */
function newsItem(n){ return h('article',{class:'news' + (n.warn ? ' warn' : n.src === 'gov' ? ' gov' : '')}, h('div',{class:'m'}, h('span',{text:qLabel(n.q)}), h('span',{class:'pill',text:SRCN[n.src] || n.src})), h('b',{text:n.title}), n.body ? h('span',{class:'small',text:n.body}) : null,
  n.grp ? h('div',{class:'row',style:'gap:4px'}, Object.keys(n.grp).map(g => h('span',{class:'pill ' + (n.grp[g] > 0 ? 'good' : 'bad'),text:`${GROUPS[g].th} ${sign(n.grp[g], 0)}`}))) : null); }
function newsTab(){
  const cats = ['all','gov','law','event','pol','mkt','proj','press','opp','partner','biz','people','world'];
  const list = S.news.filter(n => newsFilter === 'all' || n.src === newsFilter).slice().reverse();
  return h('div',{class:'stack',style:'gap:12px'}, h('h2',{text:'ข่าวและเหตุการณ์'}),
    h('div',{class:'secnav'}, cats.map(c => h('button',{type:'button','aria-pressed':String(newsFilter === c),onclick:() => { newsFilter = c; render(); }}, c === 'all' ? 'ทั้งหมด' : SRCN[c]))),
    h('div',{class:'feed'}, list.length ? list.map(newsItem) : h('p',{class:'muted',text:'ไม่มีข่าวในหมวดนี้'})));
}

/* ---------- save and hand over ---------- */
function saveTab(){
  const out = h('textarea',{id:'export-code',readonly:true,class:'code','aria-label':'รหัสส่งต่อ'}); out.value = codeOut;
  return h('div',{class:'stack',style:'gap:16px'}, h('h2',{text:'บันทึกและส่งต่อ'}),
    h('div',{class:'grid2'},
      card('สถานะการบันทึก', null, h('p',{text:saveLabel()}), h('p',{class:'small muted',text:'เกมบันทึกเองทุกครั้งที่จบปีหรือเปลี่ยนรัฐบาล และทุกครั้งที่ออกจากหน้า เปิดหน้านี้เมื่อไรก็เล่นต่อจากเดิม'}), h('button',{class:'btn',onclick:() => { persist(true); note = 'บันทึกแล้ว'; render(); }},'บันทึกตอนนี้')),
      card('ส่งต่อเกมนี้', 'ให้คนอื่นเล่นต่อ หรือย้ายเครื่อง', h('button',{class:'btn primary',id:'btn-export',onclick:async () => { codeOut = await exportCode(S); render(); }},'สร้างรหัสส่งต่อ'), codeOut ? out : null,
        codeOut ? h('button',{class:'btn',onclick:ev => { const done = () => { ev.target.textContent = 'คัดลอกแล้ว'; }; try{ navigator.clipboard.writeText(codeOut).then(done).catch(() => { out.focus(); out.select(); }); }catch(e){ out.focus(); out.select(); } }},'คัดลอกรหัส') : null,
        h('p',{class:'tiny muted',text:'ผู้รับวางรหัสในหน้าหลัก หัวข้อ "รับเกมต่อจากคนอื่น" ประเทศ ประวัติรัฐบาล และทุกการตัดสินใจไปครบ'})),
      card('ตั้งค่า', null, h('label',{class:'row'}, h('input',{type:'checkbox',id:'set-ai',checked:S.claude,onchange:e => { S.claude = e.target.checked; persist(true); }}), 'ให้ Claude เขียนข่าวและบทวิเคราะห์ปีละครั้ง'),
        h('label',{class:'f'}, 'ชื่อเกม', h('input',{type:'text',id:'set-name',value:S.name,maxlength:'40',onchange:e => { S.name = e.target.value.trim() || S.name; persist(true); render(); }})),
        h('button',{class:'btn danger',onclick:() => { if(confirmKey !== 'delcur'){ confirmKey = 'delcur'; render(); return; } confirmKey = null; removeSave(S.id); S = null; render(); }}, confirmKey === 'delcur' ? 'กดอีกครั้งเพื่อลบเกมนี้ถาวร' : 'ลบเกมนี้'))));
}

/* ---------- boot ---------- */
function render(){
  const app = document.getElementById('app'); if(!app) return;
  app.replaceChildren(...(S ? shell() : [home()]).filter(Boolean));
}
function boot(data){
  readLocal();
  if(data && data.S && data.S.v === 'ns1'){ S = data.S; (S.custom || []).forEach(p => POLK[p.id] = p); D = data.D || newDraft(); tab = data.tab || 'overview'; }
  render(); initCloud();
  sampleP.then(sm => { if(!sm && !S){ note = COPY.off; render(); } });
}
const hot = window.claude && window.claude.hot;
try{ if(hot && typeof hot.snapshot === 'function') hot.snapshot(() => (S ? { S, D, tab } : {})); }catch(e){}
if(hot && typeof hot.ready === 'function') hot.ready(boot); else boot((hot && hot.data) || {});
window.addEventListener('pagehide', () => { if(S){ const d = compact(S); saves.set(d.id, d); writeLocal(); } });
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'hidden' && S) persist(true); });
