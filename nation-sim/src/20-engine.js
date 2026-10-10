/* ================= ENGINE =================
   A deterministic quarterly model. A round is one Thai fiscal year (October to September). Elections fall in the
   quarter the House term ends; nothing ends the game: governments change and the country goes on. */
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const TH_Q = ['ม.ค.–มี.ค.','เม.ย.–มิ.ย.','ก.ค.–ก.ย.','ต.ค.–ธ.ค.'];
const Q0 = { y:2026, q:4 };                      /* quarter index 0 = Oct–Dec 2026 */
const FIRST_ELECTION = 13;                        /* Jan–Mar 2030: the House elected in Feb 2026 reaches its four-year term */
function cal(i){ const t = (Q0.q - 1) + i; return { y: Q0.y + Math.floor(t / 4), q: (t % 4) + 1 }; }
const qLabel = i => { const c = cal(i); return `ไตรมาส ${c.q}/${c.y + 543}`; };
const qLong = i => { const c = cal(i); return `${TH_Q[c.q - 1]} ${c.y + 543}`; };
const fyOf = i => { const c = cal(i); return c.q === 4 ? c.y + 1 : c.y; };
const beYear = y => y + 543;
const MULT = { cons:.9, cap:.6, trans:.4, tax:.7 };   /* fiscal multipliers: consumption and tax from the Thai SVAR study; capital and transfers game values inside the Thai range */
const GDP_ANCHOR = 19.4;                              /* game anchor: nominal GDP (trillion baht a year) that matches the IMF 2025 GDP per head of US$8,057 at a constant exchange rate */
const POP0 = 65.8;

function rng(S){ S.seed = (S.seed * 48271) % 2147483647; return S.seed / 2147483647; }
const lvl = (S, id) => S.dec[id] != null ? S.dec[id] : CTLK[id].def;
const at = (arr, l) => arr ? (arr[l] != null ? arr[l] : 0) : 0;

function newGame(opt){
  const seats = {}; PK.forEach(k => seats[k] = PARTY[k].seats);
  const dec = {}; CTL.forEach(c => dec[c.id] = c.def);
  const S = {
    v:'ns1', id:'s' + Date.now().toString(36) + Math.random().toString(36).slice(2,6), created:Date.now(), updatedAt:Date.now(),
    name: opt.name || 'ประเทศไทยของฉัน', lang: opt.lang === 'en' ? 'en' : 'th', claude: opt.claude !== false, seed: Math.floor(Math.random() * 2e9) + 1,
    q:0, phase:'decide', remain:0, roundStart:0,
    eco:{ gp:2.7, gap:-0.7, gaps:[0,-0.2,-0.4,-0.55], g:2.0, pi:0.8, u:1.0, r:1.0, gdp:19.9, debt:13.2, xdebt:0, hh:86.7, ext:0, conf:50, botcred:.9, ceil:70, rating:0, outlook:0, badq:0, energy:0, pop:POP0 },
    fis:{ rev:3.0, spend:3.788, def:.788, budget:Object.assign({}, BUD0), adj:0 },
    idx:Object.fromEntries(IK.map(k => [k, 50])), eduHist:[50,50,50,50,50,50,50,50,50,50,50,50],
    pol:{ seats, gov:['bjt','pt','sg'], par:{ pt:60, sg:60 }, grp:{ rural:45, urban:40, middle:38, youth:28, elder:45, biz:45, state:55 }, court:10, prot:20, scandal:0, cap:8 },
    gov:{ lead:'bjt', gen:1, pmName:'อนุทิน ชาญวีรกูล', since:0, pmSince:-4, how:'สืบต่อจากการเลือกตั้ง ก.พ. 2569' },
    govs:[], elections:[], nextElec:FIRST_ELECTION, junta:0,
    last:{ share:Object.fromEntries(PK.map(k => [k, PARTY[k].list])), cons:Object.fromEntries(PK.map(k => [k, PARTY[k].cons])), cv:Object.fromEntries(PK.map(k => [k, PARTY[k].cv])) },
    dec, pend:[], once:[], proj:[], perm:{}, news:[], hist:[], years:[], log:[], decomp:[], electionNow:null
  };
  S.hist.push(snap(S));
  news(S, 'gov', 'เริ่มบริหารปีงบประมาณ 2570', 'งบประมาณปี 2570 เริ่ม 1 ต.ค. 2569 หนี้สาธารณะใกล้เพดาน คะแนนนิยมกำลังลด ตั้งค่าการตัดสินใจของปีนี้ในแท็บตัดสินใจ แล้วกดดำเนินปีงบประมาณ');
  return S;
}
const approval = S => Math.round(GK.reduce((a,k) => a + GROUPS[k].w * S.pol.grp[k], 0));
const govSeats = S => S.junta ? 0 : S.pol.gov.reduce((a,k) => a + (S.pol.seats[k] || 0), 0);
const debtPct = S => S.eco.debt / S.eco.gdp * 100;
const defPct = S => S.fis.def / S.eco.gdp * 100;
const RATING = ['BBB+','BBB','BBB-','BB+','BB'];
const gdppc = S => 8057 * (S.eco.gdp / GDP_ANCHOR) / (S.eco.pop / POP0);
const cpiScore = S => Math.round(33 + (S.idx.corr - 50) * .4);
const rdPct = S => +(CTLK.rdpub.rdv[lvl(S,'rdpub')] + .63 * (1 + (S.idx.rd - 50) / 40)).toFixed(2);
const pisaEst = S => Math.round(394 + (S.idx.edu - 50) * 1.2);
const giiScore = S => +(36.7 + (S.idx.rd - 50) * .15 + (S.idx.edu - 50) * .05 + (S.idx.corr - 50) * .05 + (S.idx.biz - 50) * .05 + (S.idx.infra - 50) * .03).toFixed(1);
function giiRank(score){
  const C = GII_CURVE; if(score >= C[0][0]) return Math.max(1, Math.round(3 - (score - C[0][0]) / 1.5));
  for(let i = 1; i < C.length; i++) if(score >= C[i][0]){ const [s0,r0] = C[i-1], [s1,r1] = C[i]; return Math.round(r1 + (score - s1) / (s0 - s1) * (r0 - r1)); }
  const [sl, rl] = C[C.length - 1]; return Math.min(139, Math.round(rl + (sl - score) * 2.5));
}
function snap(S){
  return { q:S.q, g:+S.eco.g.toFixed(2), pi:+S.eco.pi.toFixed(2), u:+S.eco.u.toFixed(2), r:S.eco.r, debt:+debtPct(S).toFixed(2), def:+defPct(S).toFixed(2), hh:+S.eco.hh.toFixed(1),
    appr:approval(S), seats:govSeats(S), gp:+S.eco.gp.toFixed(2), conf:Math.round(S.eco.conf), gdppc:Math.round(gdppc(S)), cpi:cpiScore(S), gii:giiRank(giiScore(S)), pisa:pisaEst(S), rd:rdPct(S),
    idx:Object.fromEntries(IK.map(k => [k, Math.round(S.idx[k])])), lead:S.junta ? 'junta' : S.gov.lead };
}
function news(S, src, title, body, extra){ S.news.push(Object.assign({ q:S.q, src, title, body }, extra || {})); if(S.news.length > 160) S.news.splice(0, S.news.length - 160); }
function logA(S, k, id, extra){ S.log.push(Object.assign({ q:S.q, k, id }, extra || {})); if(S.log.length > 500) S.log.splice(0, S.log.length - 500); }

/* ---- political capital and the cost of a decision ---- */
function capFor(S){ const a = approval(S); return S.junta ? 6 : 8 + (a >= 50 ? 2 : 0) - (a < 25 ? 2 : 0) - (govSeats(S) < 270 ? 2 : 0); }
function ctlCost(S, id, to){ const c = CTLK[id], from = pendingTarget(S, id); if(to === from) return 0; const p = PATHS[c.path]; return p.cap ? Math.max(1, Math.abs(to - from)) * p.cap : 0; }
const pendingTarget = (S, id) => { const p = S.pend.find(x => x.id === id && x.kind === 'ctl'); return p ? p.lvl : lvl(S, id); };
function draftCost(S, D){
  let n = 0;
  for(const id of Object.keys(D.ctl || {})) n += ctlCost(S, id, D.ctl[id]);
  for(const id of D.pol || []) n += PATHS[POLK[id].path].cap;
  n += (D.proj || []).length;
  return n;
}
/* what blocks a control change: legal and political limits that exist in the real system */
function blocked(S, id, to){
  const c = CTLK[id], from = lvl(S, id);
  if(S.junta && ['charter','decent'].includes(id) && to > 0) return 'รัฐบาลหลังรัฐประหารไม่เดินหน้าเรื่องนี้';
  if((c.path === 'act' || c.path === 'const') && to !== from && govSeats(S) < 251 && !S.junta) return 'รัฐบาลเสียงข้างน้อย ผ่านกฎหมายไม่ได้';
  if(S.pend.some(x => x.id === id && x.kind === 'ctl')) return 'มีร่างเรื่องนี้ค้างอยู่ในกระบวนการ';
  const addsCost = (at(c.cost, to) > at(c.cost, from)) || (c.rdv && to > from) || (id === 'spend' && to > from);
  if(addsCost && debtPct(S) >= S.eco.ceil) return `หนี้ ${debtPct(S).toFixed(1)}% ชนเพดาน ${S.eco.ceil}% เพิ่มรายจ่ายไม่ได้จนกว่าจะลดหนี้หรือขยายเพดาน`;
  return null;
}
function polBlocked(S, id){
  const p = POLK[id];
  if(p.perm && S.perm[id]) return 'มีผลอยู่แล้ว';
  if(S.pend.some(x => x.id === id)) return 'อยู่ระหว่างดำเนินการ';
  if(p.path === 'act' && govSeats(S) < 251 && !S.junta) return 'รัฐบาลเสียงข้างน้อย';
  if(p.once > 0 && debtPct(S) >= S.eco.ceil) return 'หนี้ชนเพดาน';
  return null;
}
function projBlocked(S, id){ if(S.proj.some(x => x.id === id)) return 'เริ่มแล้ว'; if(debtPct(S) >= S.eco.ceil) return 'หนี้ชนเพดาน'; return null; }

/* ---- the round: apply the decision sheet, then run the fiscal year quarter by quarter ---- */
function commit(S, D){
  const cost = draftCost(S, D); if(cost > S.pol.cap) return `ใช้ทุนการเมือง ${cost} เกินที่มี ${S.pol.cap}`;
  for(const id of Object.keys(D.ctl || {})){
    const to = D.ctl[id], from = lvl(S, id); if(to === pendingTarget(S, id)) continue;
    const why = blocked(S, id, to); if(why) return `${CTLK[id].th}: ${why}`;
  }
  S.pol.cap -= cost;
  for(const id of Object.keys(D.ctl || {})){
    const c = CTLK[id], to = D.ctl[id]; if(to === pendingTarget(S, id)) continue;
    if(c.path === 'budget'){ setLevel(S, id, to); logA(S, 'ctl', id, { to }); continue; }
    S.pend.push({ kind:'ctl', id, lvl:to, due:S.q + PATHS[c.path].q }); logA(S, 'ctl', id, { to });
    news(S, 'gov', `เสนอ: ${c.th} → ${c.opts[to]}`, `ช่องทาง${PATHS[c.path].th} คาดว่ามีผล ${qLabel(S.q + PATHS[c.path].q)}`);
  }
  for(const id of D.pol || []){ const p = POLK[id]; S.pend.push({ kind:'pol', id, due:S.q + PATHS[p.path].q }); logA(S, 'pol', id); news(S, 'gov', `เสนอ: ${p.th}`, `ช่องทาง${PATHS[p.path].th}`); }
  for(const id of D.proj || []){ const P = PROJK[id]; S.proj.push({ id, q0:S.q, done:false }); logA(S, 'proj', id); news(S, 'gov', `อนุมัติโครงการ: ${P.th}`, `วงเงินราว ${(P.cost * 1e6).toLocaleString('en-US')} ล้านบาท ก่อสร้าง ${P.q} ไตรมาส`); }
  if(D.bud){ S.fis.budget = Object.assign({}, D.bud); logA(S, 'budget', 'shares'); }
  S.roundStart = S.q; S.remain = 4; S.phase = 'running'; S.decomp = [];
  return null;
}
function setLevel(S, id, to){
  const c = CTLK[id], from = lvl(S, id); S.dec[id] = to;
  const d = to - from, j = c.jump || {};
  if(j.pi) S.eco.pi += j.pi * d;
  if(j.conf && d) S.eco.conf = clamp(S.eco.conf + j.conf * Math.sign(d), 0, 100);
  if(c.ceilv) S.eco.ceil = c.ceilv[to];
}
/* run quarters until the round ends or an election stops it; returns 'election', 'year' or null */
function run(S){
  while(S.remain > 0 && S.phase === 'running'){
    step(S); S.remain--;
    if(S.phase === 'election') return 'election';
  }
  if(S.remain <= 0 && S.phase === 'running'){ yearReport(S); S.phase = 'decide'; S.pol.cap = capFor(S); return 'year'; }
  return null;
}

/* ---- legislation in progress reaches its due quarter ---- */
function lawStep(S){
  S.pend = S.pend.filter(x => {
    if(S.q < x.due) return true;
    if(x.kind === 'ctl'){
      const c = CTLK[x.id], from = lvl(S, x.id), sen = at(c.senate, x.lvl);
      if((c.path === 'act' || c.path === 'const') && govSeats(S) < 251 && !S.junta){ news(S, 'law', `ไม่ผ่าน: ${c.th}`, 'รัฐบาลไม่มีเสียงข้างมาก', { warn:1 }); return false; }
      if(sen && rng(S) < sen){ news(S, 'law', `วุฒิสภาไม่เห็นชอบ: ${c.th}`, `ร่างที่ให้ "${c.opts[x.lvl]}" ตกไป`, { warn:1 }); return false; }
      if(c.path === 'const'){ const yes = 46 + (approval(S) - 40) * .5 + (S.pol.grp.youth - 40) * .25; if(yes < 50){ news(S, 'law', `ประชามติไม่ผ่าน: ${c.th}`, `เห็นชอบราว ${Math.round(yes)}%`, { warn:1 }); return false; } news(S, 'law', `ประชามติผ่าน: ${c.th}`, `เห็นชอบราว ${Math.round(yes)}%`); }
      let to = x.lvl;
      if(c.path === 'wage' && to > from && rng(S) < .4){ to = Math.max(from, to - 1); news(S, 'law', 'คณะกรรมการค่าจ้างให้ไม่เต็มที่ขอ', `ได้ "${c.opts[to]}"`); }
      if(c.path === 'bot'){ setLevel(S, x.id, to); S.eco.botcred = clamp(S.eco.botcred + at(c.botcred, to), .3, 1); return false; }
      setLevel(S, x.id, to); news(S, 'law', `มีผล: ${c.th}`, c.opts[to]);
      return false;
    }
    const p = POLK[x.id];
    if(p.path === 'act' && govSeats(S) < 251 && !S.junta){ news(S, 'law', `ไม่ผ่าน: ${p.th}`, 'รัฐบาลไม่มีเสียงข้างมาก', { warn:1 }); return false; }
    if(p.senate && rng(S) < p.senate){ news(S, 'law', `วุฒิสภาไม่เห็นชอบ: ${p.th}`, '', { warn:1 }); return false; }
    applyPol(S, p); news(S, 'law', `มีผล: ${p.th}`, p.note);
    return false;
  });
}
function applyPol(S, p){
  if(p.once) S.once.push({ amt:p.once, kind:p.kind || 'cons' });
  if(p.perm) S.perm[p.id] = S.q;
  const j = p.jump || {}; if(j.conf) S.eco.conf = clamp(S.eco.conf + j.conf, 0, 100);
  if(p.court) S.pol.court = clamp(S.pol.court + p.court, 0, 100);
  if(p.ext) S.eco.ext += p.ext;
  for(const g of Object.keys(p.grp || {})) S.pol.grp[g] = clamp(S.pol.grp[g] + p.grp[g] * .7, 0, 100);
  for(const k of Object.keys(p.par || {})) if(S.pol.par[k] != null) S.pol.par[k] = clamp(S.pol.par[k] + p.par[k], 0, 100);
  if(p.idx && !p.perm) for(const k of Object.keys(p.idx)) S.idx[k] = clamp(S.idx[k] + p.idx[k], 0, 100);
}

/* ---- one quarter ---- */
function step(S){
  const E = S.eco, F = S.fis, P = S.pol, I = S.idx, c = cal(S.q), ev = [];
  lawStep(S);
  /* fiscal: plan deficit path, the decision sheet, one-off outlays, projects, extra interest */
  const fy = fyOf(S.q), planDef = PLANDEF(fy);
  let polCost = 0, polRev = 0, impulse = 0, piAdd = 0, uAdd = 0, extAdd = 0;
  for(const ct of CTL){ const l = lvl(S, ct.id), k = ct.kind || 'cons';
    const cost = at(ct.cost, l); if(cost){ polCost += cost; impulse += MULT[k] * cost; }
    const rev = at(ct.rev, l); if(rev){ polRev += rev; impulse -= MULT.tax * rev; }
    piAdd += at(ct.pi, l); uAdd += at(ct.u, l); extAdd += at(ct.ext, l);
    if(ct.hh) E.hh = Math.max(40, E.hh + at(ct.hh, l));
    if(ct.botcred && ct.path !== 'bot') E.botcred = clamp(E.botcred + at(ct.botcred, l) / 4, .3, 1); }
  const rdCost = (CTLK.rdpub.rdv[lvl(S,'rdpub')] - .31) / 100 * E.gdp; polCost += rdCost; impulse += MULT.cons * rdCost;
  for(const id of Object.keys(S.perm)){ const p = POLK[id]; if(p.rev){ polRev += p.rev; impulse -= MULT.tax * p.rev; } }
  let onceSpend = 0; S.once.forEach(o => { onceSpend += o.amt; impulse += MULT[o.kind] * o.amt * 4; }); S.once = [];
  let projSpend = 0;
  S.proj.forEach(x => { const Pj = PROJK[x.id]; if(x.done) return; const per = Pj.cost / Pj.q * (Pj.ppp ? .5 : 1), leak = clamp(Pj.leak + (50 - I.corr) / 400, 0, .4);
    projSpend += per; impulse += MULT.cap * per * 4 * (1 - leak);
    if(S.q - x.q0 + 1 >= Pj.q){ x.done = true; x.leak = leak;
      news(S, 'proj', `แล้วเสร็จ: ${Pj.th}`, `ดัชนีโครงสร้างพื้นฐาน +${(Pj.infra * (1 - leak)).toFixed(1)} (หักการรั่วไหล ${Math.round(leak * 100)}%)`); } });
  const adj = CTLK.spend.adj[lvl(S,'spend')] + (F.forceCut || 0);
  const revBase = 3.0 * Math.pow(E.gdp / 19.9, 1.1);
  F.rev = revBase + polRev;
  const baseSpend = revBase + planDef / 100 * E.gdp;
  const interestX = Math.max(0, E.xdebt) * (.03 + E.rating * .004);
  F.spend = baseSpend * (1 + adj / 100) + polCost + interestX;
  impulse += MULT.cons * baseSpend * adj / 100;
  F.def = F.spend - F.rev;
  const qDef = F.def / 4 + onceSpend + projSpend;
  E.debt += qDef; E.xdebt += qDef - planDef / 100 * E.gdp / 4;
  /* structural indexes move slowly toward targets set by policy, budget and finished projects */
  const B = F.budget, tgt = {};
  IK.forEach(k => tgt[k] = 50);
  for(const ct of CTL){ const l = lvl(S, ct.id); for(const k of Object.keys(ct.idx || {})) tgt[k] += at(ct.idx[k], l); if(ct.env) tgt.env += at(ct.env, l); }
  for(const id of Object.keys(S.perm)){ const p = POLK[id]; for(const k of Object.keys(p.idx || {})) tgt[k] += p.idx[k]; }
  tgt.edu += (B.edu - BUD0.edu) * .8; tgt.health += (B.health - BUD0.health) * .8; tgt.equal += (B.welfare - BUD0.welfare) * .6; tgt.infra += (B.infra - BUD0.infra) * .5 + (B.local - BUD0.local) * .2;
  tgt.corr += (B.justice - BUD0.justice) * 1.5 - (B.local - BUD0.local) * .15; tgt.env += (B.env - BUD0.env) * 1.0;
  S.proj.forEach(x => { if(!x.done) return; const Pj = PROJK[x.id]; tgt.infra += Pj.infra * (1 - (x.leak || Pj.leak)); if(Pj.env) tgt.env += Pj.env; if(Pj.idxx) for(const k of Object.keys(Pj.idxx)) tgt[k] += Pj.idxx[k]; });
  if(S.junta){ tgt.rights -= 15; tgt.corr -= 4; }
  tgt.equal -= Math.max(0, E.u - 1) * 2;
  IK.forEach(k => { const sp = k === 'infra' ? .05 : .06; I[k] = clamp(I[k] + sp * (clamp(tgt[k], 0, 100) - I[k]), 0, 100); });
  S.eduHist.push(I.edu); if(S.eduHist.length > 12) S.eduHist.shift();
  /* shocks: game probabilities shaped by Thai history */
  const R = () => rng(S), waterDone = S.proj.some(x => x.id === 'water' && x.done);
  if((c.q === 3 || c.q === 4) && R() < .2 * (waterDone ? .5 : 1)){ ev.push(['flood','น้ำท่วมภาคกลางและอีสาน','พื้นที่เกษตรเสียหาย รัฐเยียวยาราว 2 หมื่นล้านบาท']); E.gap -= .3; P.grp.rural -= 5; E.debt += .02; }
  if((c.q === 1 || c.q === 2) && R() < .1){ ev.push(['drought','ภัยแล้งจากเอลนีโญ','ผลผลิตเกษตรลด ราคาอาหารขึ้น']); E.pi += .2; P.grp.rural -= 4; }
  if(R() < .06){ ev.push(['oil','ราคาน้ำมันโลกพุ่ง','ต้นทุนพลังงานเพิ่ม เงินเฟ้อขยับขึ้น']); E.energy = .8; }
  if(R() < .06){ ev.push(['global','เศรษฐกิจโลกชะลอตัว','ส่งออกและท่องเที่ยวชะลอ']); E.ext -= .6; }
  if(R() < .04){ ev.push(['boom','การค้าโลกฟื้นตัวแรง','คำสั่งซื้อสินค้าไทยเพิ่ม']); E.ext += .5; }
  const scandalP = (.1 + Math.max(0, (50 - I.corr) / 200)) * at(CTLK.media.scandal, lvl(S,'media'));
  if(!S.junta && R() < scandalP){ ev.push(['scandal','ข่าวอื้อฉาวในรัฐบาล','มีผู้ยื่นเรื่องต่อ ป.ป.ช. และศาลรัฐธรรมนูญ']); P.court = clamp(P.court + 15, 0, 100); P.scandal++; GK.forEach(g => P.grp[g] -= 2); }
  if((S.q === 0 || S.q === 1) && !S.trade && R() < .5){ S.trade = 1; ev.push(['trade','ไทยกับสหรัฐลงนามข้อตกลงการค้า','ความไม่แน่นอนเรื่องภาษีนำเข้าลดลง']); E.ext += .3; E.conf += 3; }
  ev.forEach(e => news(S, 'event', e[1], e[2], { ev:e[0] }));
  /* macro: potential growth from ageing and the structural indexes; output gap toward its target; BOT rule; debt */
  const eduLag = S.eduHist[0];
  const gpBase = Math.max(1.0, 2.7 - .0125 * S.q);
  const gpStruct = .012 * (eduLag - 50) + .015 * (I.rd - 50) + .01 * (I.corr - 50) + .012 * (I.biz - 50) + .01 * (I.infra - 50);
  E.gp = gpBase + gpStruct;
  E.ext = E.ext * .75 + extAdd * .25;
  const drag = Math.min(0, S.q <= 5 ? -1.6 : -1.6 + (S.q - 5) * .1);
  const parts = { fis: impulse / E.gdp * 100, mon: -.3 * (E.r - 1.0), ext:E.ext, conf:.03 * (E.conf - 50), drag, hh: -Math.max(0, E.hh - 87) * .05 };
  const target = parts.fis + parts.mon + parts.ext + parts.conf + parts.drag + parts.hh;
  const gap0 = E.gap; E.gap = .7 * E.gap + .3 * target;
  E.gaps.push(gap0); if(E.gaps.length > 4) E.gaps.shift();
  E.g = E.gp + (E.gap - E.gaps[0]);
  S.decomp.push({ gp:E.gp, gpStruct, ...Object.fromEntries(Object.entries(parts).map(([k,v]) => [k, v * .3])) });
  const anchor = 1.0 * E.botcred + E.pi * (1 - E.botcred);
  E.pi = .55 * E.pi + .45 * anchor + .15 * (E.gap + 1.2) + piAdd * .3 + E.energy; E.energy *= .4;
  E.u = clamp(1.0 - .12 * E.gap + uAdd, .4, 8);
  const rStar = 1.0 + .8 * (E.pi - 1.0) + .3 * (E.gap + 1.2);
  if(Math.abs(rStar - E.r) >= .375) E.r = clamp(E.r + Math.sign(rStar - E.r) * .25, .25, 8);
  E.gdp *= 1 + (E.g + Math.max(0, E.pi)) / 100 / 4;
  E.pop *= 1 - .0005;
  E.hh = Math.max(40, E.hh - .1);
  /* ratings and the debt ceiling */
  const dp = debtPct(S), df = defPct(S);
  if(dp > E.ceil || df > 5){ E.badq++;
    if(E.badq === 2 && E.outlook === 0){ E.outlook = -1; news(S, 'mkt', 'บริษัทจัดอันดับปรับแนวโน้มเป็นลบ', `หนี้ ${dp.toFixed(1)}% ของ GDP ขาดดุล ${df.toFixed(1)}%`); E.conf -= 4; }
    if(E.badq >= 6 && E.rating < 4){ E.rating++; E.outlook = 0; E.badq = 2; news(S, 'mkt', `ลดอันดับความน่าเชื่อถือเป็น ${RATING[E.rating]}`, 'ต้นทุนกู้ยืมของรัฐเพิ่ม', { warn:1 }); E.conf -= 8; } }
  else { E.badq = Math.max(0, E.badq - 1); if(E.badq === 0 && E.outlook < 0){ E.outlook = 0; news(S, 'mkt', 'แนวโน้มอันดับความน่าเชื่อถือกลับเป็นมีเสถียรภาพ', ''); }
    if(E.rating > 0 && dp < E.ceil - 8 && df < 3 && R() < .05){ E.rating--; news(S, 'mkt', `เพิ่มอันดับความน่าเชื่อถือเป็น ${RATING[E.rating]}`, 'วินัยการคลังดีขึ้นต่อเนื่อง'); } }
  F.forceCut = dp > E.ceil ? -3 : 0;
  if(dp > E.ceil && c.q === 4) news(S, 'law', 'หนี้สาธารณะเกินเพดาน', `สำนักงบประมาณตัดรายจ่าย 3% และห้ามเพิ่มรายจ่ายใหม่จนกว่าหนี้จะต่ำกว่า ${E.ceil}%`, { warn:1 });
  E.conf = clamp(E.conf + (E.g - 2) + .2 * (I.biz - 50) / 4 - .05 * Math.max(0, P.prot - 50), 0, 100) * .9 + 5;
  /* society: each group drifts toward a target set by the economy, the decision sheet, the budget and who governs */
  const pol = {}; GK.forEach(g => pol[g] = 0);
  for(const ct of CTL){ const l = lvl(S, ct.id); for(const g of Object.keys(ct.grp || {})) pol[g] += at(ct.grp[g], l); }
  for(const id of Object.keys(S.perm)){ const p = POLK[id]; for(const g of Object.keys(p.grp || {})) pol[g] += p.grp[g] * .5; }
  const base = S.junta ? { state:8, youth:-12, urban:-6, middle:-4 } : (BASE[S.gov.lead] || {});
  const misery = Math.max(0, E.pi - 1.5) * 4 + Math.max(0, E.u - 1) * 6, growth = (E.g - 2) * 3;
  const G = {
    rural: 45 + growth - misery + (B.agri - BUD0.agri) * .8 + (B.local - BUD0.local) * .3 + (I.equal - 50) * .1,
    urban: 42 + growth - misery * 1.2 + (I.equal - 50) * .1, middle: 40 + growth * .8 - misery - Math.max(0, E.hh - 85) * .3 + (I.corr - 50) * .25 + (I.env - 50) * .1,
    youth: 32 + growth * .6 - (E.u - 1) * 5 + (I.env - 50) * .1 + (I.edu - 50) * .1 + (I.rights - 50) * .25, elder: 46 - misery * 1.3 + (I.health - 50) * .2 + (B.welfare - BUD0.welfare) * .6,
    biz: 45 + growth * 2 + (E.conf - 50) * .3 - (E.r - 1) * 3 + (I.biz - 50) * .15, state: 55 + (B.defense - BUD0.defense) * 1.2 - (P.prot - 30) * .1
  };
  const inOffice = S.q - S.gov.since, honeymoon = Math.max(0, 4 - inOffice) * .6 - Math.min(inOffice, 16) * .25;
  GK.forEach(g => { const t = clamp(G[g] + pol[g] + (base[g] || 0) + honeymoon - P.scandal * 1.5, 0, 100); P.grp[g] = clamp(P.grp[g] + .3 * (t - P.grp[g]), 0, 100); });
  P.scandal = Math.max(0, P.scandal - .25);
  let protTgt = (50 - P.grp.youth) * .6 + (50 - P.grp.urban) * .3 - (I.rights - 50) * .2;
  for(const ct of CTL) protTgt += at(ct.prot, lvl(S, ct.id)) * 2;
  if(S.perm.casino) protTgt += 4;
  P.prot = clamp(P.prot + .3 * (protTgt - P.prot * .5), 0, 100);
  P.court = clamp(P.court * .9, 0, 100);
  for(const ct of CTL) if(ct.court){ const v = at(ct.court, lvl(S, ct.id)); if(v) P.court = clamp(P.court + v * .25, 0, 100); }
  /* coalition partners */
  if(!S.junta) for(const k of Object.keys(P.par)){
    if(!P.gov.includes(k)){ delete P.par[k]; continue; }
    let d = (approval(S) - 40) * .1 - .5;
    for(const ct of CTL) if(ct.par && ct.par[k]) d += at(ct.par[k], lvl(S, ct.id));
    if(k === 'pt') d += (P.grp.rural - 45) * .08; if(k === 'sg' || k === 'so') d += (B.local - BUD0.local) * .4 + (B.infra - BUD0.infra) * .2 + S.proj.filter(x => !x.done).length * .2;
    P.par[k] = clamp(P.par[k] + d, 0, 100);
    if(P.par[k] < 20){ P.gov = P.gov.filter(x => x !== k); delete P.par[k]; news(S, 'pol', `${PARTY[k].th}ถอนตัวจากรัฐบาล`, `รัฐบาลเหลือ ${govSeats(S)} เสียงจาก 500`, { warn:1 }); }
  }
  /* how governments change: courts, censure, coups, the eight-year limit, the end of a term */
  const pmYears = (S.q - S.gov.pmSince) / 4;
  if(!S.junta && pmYears >= 8){ newPM(S, 'ครบวาระ 8 ปีตามรัฐธรรมนูญ'); }
  else if(!S.junta && rng(S) < Math.max(0, (P.court - 60) / 150)){ newPM(S, 'ศาลรัฐธรรมนูญวินิจฉัยให้นายกรัฐมนตรีพ้นจากตำแหน่ง'); P.court = 20; }
  if(!S.junta && c.q === 1 && S.q > 0){ const gs = govSeats(S), defect = approval(S) < 25 ? 15 : 0;
    if(gs - defect < 251){ news(S, 'pol', 'สภาลงมติไม่ไว้วางใจผ่าน นายกรัฐมนตรียุบสภา', `รัฐบาลมี ${gs} เสียง ไม่พอ 251 เลือกตั้งใหม่ไตรมาสหน้า`, { warn:1 }); S.nextElec = S.q + 1; }
    else news(S, 'pol', 'อภิปรายไม่ไว้วางใจประจำปี รัฐบาลรอด', `รัฐบาล ${gs} เสียง`); }
  const coupMul = at(CTLK.conscript.coup, lvl(S,'conscript'));
  if(!S.junta && P.prot > 85 && approval(S) < 22 && rng(S) < .05 * coupMul){ coup(S); }
  if(S.junta){ S.junta--; if(S.junta === 0){ S.nextElec = S.q + 1; news(S, 'pol', 'รัฐบาลหลังรัฐประหารประกาศจัดเลือกตั้ง', 'เลือกตั้งทั่วไปไตรมาสหน้า'); } }
  /* next quarter */
  S.q++;
  S.hist.push(snap(S)); if(S.hist.length > 400) S.hist.splice(0, S.hist.length - 400);
  if(S.q === S.nextElec && !S.junta){ S.phase = 'election'; S.electionNow = election(S); news(S, 'pol', `เลือกตั้งทั่วไป ${qLong(S.q)}`, 'ผลการเลือกตั้งออกแล้ว จัดตั้งรัฐบาลให้ได้อย่างน้อย 251 เสียงในแท็บภาพรวม'); }
}
function closeGov(S, how){
  const g = S.gov, H = S.hist.filter(x => x.q >= g.since && x.q <= S.q);
  if(H.length < 2) return;
  const a = H[0], b = H[H.length - 1], avg = k => H.reduce((s,x) => s + x[k], 0) / H.length;
  const card = { lead:g.lead, gen:g.gen, pm:g.pmName || null, from:g.since, to:S.q, how, avgG:+avg('g').toFixed(2), avgPi:+avg('pi').toFixed(2), dDebt:+(b.debt - a.debt).toFixed(1),
    dCpi:b.cpi - a.cpi, dGii:a.gii - b.gii, dPisa:b.pisa - a.pisa, dGp:+(b.gp - a.gp).toFixed(2), gdppc0:a.gdppc, gdppc1:b.gdppc, appr:b.appr };
  const score = 50 + 6 * (card.avgG - 2) - 4 * Math.max(0, card.avgPi - 3) - 1.2 * Math.max(0, card.dDebt) + 1.2 * card.dCpi + .5 * card.dGii + .15 * card.dPisa + 12 * card.dGp + .2 * (card.appr - 40);
  card.score = Math.round(score); card.grade = score >= 70 ? 'A' : score >= 60 ? 'B' : score >= 48 ? 'C' : score >= 38 ? 'D' : 'F';
  S.govs.push(card);
}
function newPM(S, why){
  closeGov(S, why);
  const lead = S.gov.lead;
  S.gov = { lead, gen:(S.gov.gen || 1) + 1, pmName:null, since:S.q, pmSince:S.q, how:why };
  news(S, 'pol', `นายกรัฐมนตรีคนใหม่จากพรรค${PARTY[lead] ? PARTY[lead].th : lead}`, `${why} สภาเลือกนายกฯ คนใหม่จากพรรคร่วมรัฐบาลเดิม คุณบริหารต่อในฐานะผู้นำรุ่นที่ ${S.gov.gen}`, { warn:1 });
}
function coup(S){
  closeGov(S, 'รัฐประหาร');
  S.junta = 8; S.gov = { lead:'junta', gen:(S.gov.gen || 1) + 1, pmName:null, since:S.q, pmSince:S.q, how:'รัฐประหาร' };
  S.dec.charter = 0; S.dec.protest = Math.max(S.dec.protest, 2); S.dec.media = 2; S.pend = S.pend.filter(x => x.id !== 'charter');
  S.eco.conf = clamp(S.eco.conf - 8, 0, 100);
  news(S, 'pol', 'กองทัพยึดอำนาจ', 'ยุบสภา งดใช้รัฐธรรมนูญบางส่วน ประกาศจัดเลือกตั้งภายในสองปี คุณบริหารต่อในฐานะรัฐบาลรักษาการภายใต้ข้อจำกัด', { warn:1 });
}

/* ---- elections: vote shares move with each group's satisfaction; constituency seats by a cube-law swing; list seats by share ---- */
function election(S){
  const P = S.pol, gov = new Set(S.junta ? [] : P.gov), L = S.last, share = {};
  PK.forEach(k => share[k] = L.share[k]);
  for(const g of GK){ const d = (P.grp[g] - 45) / 100 * GROUPS[g].w * 100;
    if(d > 0){ const lead = S.gov.lead; if(PARTY[lead]) share[lead] += d * .45; gov.forEach(k => { if(k !== lead) share[k] += d * .25 / Math.max(1, gov.size - 1); }); }
    else { const to = LEAN[g].filter(k => !gov.has(k) || LEAN[g].length === 1); (to.length ? to : LEAN[g]).forEach(k => share[k] += -d / (to.length || LEAN[g].length) * .7); if(gov.size) gov.forEach(k => share[k] += d * .5 / gov.size); } }
  let tot = 0; PK.forEach(k => { share[k] = Math.max(.5, share[k]); tot += share[k]; }); PK.forEach(k => share[k] = share[k] / tot * 100);
  const cons = {}, cv = {}; let ct = 0;
  PK.forEach(k => { cv[k] = Math.max(.5, L.cv[k] + share[k] - L.share[k]); cons[k] = Math.max(.01, L.cons[k]) * Math.pow(cv[k] / Math.max(.5, L.cv[k]), 3) + .01; ct += cons[k]; });
  const seats = {}, cs = {}; let used = 0;
  PK.forEach(k => { cs[k] = Math.floor(cons[k] / ct * 400); used += cs[k]; });
  PK.slice().sort((x,y) => (cons[y] / ct * 400 % 1) - (cons[x] / ct * 400 % 1)).slice(0, 400 - used).forEach(k => cs[k]++);
  const list = {}; let lu = 0; PK.forEach(k => { list[k] = Math.floor(share[k]); lu += list[k]; });
  PK.slice().sort((x,y) => (share[y] % 1) - (share[x] % 1)).slice(0, 100 - lu).forEach(k => list[k]++);
  PK.forEach(k => seats[k] = cs[k] + list[k]);
  return { q:S.q, share, seats, cons:cs, list, cv };
}
function willing(S, lead, p){
  let w = (WILLING[lead] || {})[p]; if(w == null) return 0;
  if(S.pol.par[p] != null && S.pol.gov.includes(lead)) w += (S.pol.par[p] - 50) / 2;
  return clamp(Math.round(w), 0, 100);
}
function formGovernment(S, lead, partners){
  const E = S.electionNow; if(!E) return 'ยังไม่มีผลเลือกตั้ง';
  const refuse = partners.filter(p => willing(S, lead, p) < 40), ok = partners.filter(p => !refuse.includes(p));
  const seats = E.seats[lead] + ok.reduce((a,p) => a + E.seats[p], 0);
  if(refuse.length && seats < 251) return `${refuse.map(p => PARTY[p].th).join(', ')} ปฏิเสธร่วมรัฐบาล ได้เพียง ${seats} เสียง`;
  if(seats < 251) return `รวมได้ ${seats} เสียง ยังไม่ถึง 251`;
  const prevLead = S.gov.lead, samePM = lead === prevLead && !S.junta && (S.q - S.gov.pmSince) / 4 < 8;
  closeGov(S, lead === prevLead ? 'ชนะเลือกตั้ง ได้เป็นรัฐบาลต่อ' : 'แพ้เลือกตั้ง เปลี่ยนรัฐบาล');
  S.elections.push({ q:E.q, seats:E.seats, share:E.share, lead, partners:ok, total:seats });
  S.last = { share:E.share, cons:E.cons, cv:E.cv };
  PK.forEach(k => S.pol.seats[k] = E.seats[k]);
  S.pol.gov = [lead].concat(ok); S.pol.par = Object.fromEntries(ok.map(p => [p, 60]));
  S.gov = { lead, gen: samePM ? S.gov.gen : (S.gov.gen || 1) + 1, pmName: samePM ? S.gov.pmName : null, since:S.q, pmSince: samePM ? S.gov.pmSince : S.q, how:'จัดตั้งหลังเลือกตั้ง' };
  S.nextElec = S.q + 16; S.junta = 0; S.electionNow = null; S.phase = 'running';   /* run() finishes the fiscal year and writes its report */
  S.pol.court = Math.min(S.pol.court, 20); S.pol.cap = Math.max(S.pol.cap, 4);
  news(S, 'pol', `จัดตั้งรัฐบาลพรรค${PARTY[lead].th}`, `${ok.length ? 'ร่วมกับ ' + ok.map(p => PARTY[p].th).join(', ') + ' · ' : ''}${seats} เสียง${samePM ? '' : ' · นายกรัฐมนตรีรุ่นที่ ' + S.gov.gen}`);
  logA(S, 'form', lead, { partners:ok, seats });
  return null;
}
/* the strongest feasible government, for a one-tap formation */
function autoCoalition(S){
  const E = S.electionNow; if(!E) return null;
  const leads = PK.filter(k => E.seats[k] >= 40).sort((a,b) => E.seats[b] - E.seats[a]);
  for(const lead of leads){
    const cand = PK.filter(p => p !== lead && willing(S, lead, p) >= 40).sort((a,b) => willing(S, lead, b) - willing(S, lead, a) || E.seats[b] - E.seats[a]);
    const pick = []; let seats = E.seats[lead];
    for(const p of cand){ if(seats >= 251 && pick.length >= 1) break; pick.push(p); seats += E.seats[p]; }
    if(seats >= 251) return { lead, partners:pick, seats };
  }
  return null;
}

/* ---- the annual report, Cesim style ---- */
function yearReport(S){
  const H = S.hist, a = H.find(x => x.q === S.roundStart) || H[0], b = H[H.length - 1], D = S.decomp, avg = k => D.length ? D.reduce((s,x) => s + x[k], 0) / D.length : 0;
  const rep = { fy:fyOf(S.roundStart), q0:S.roundStart, q1:S.q, a, b,
    decomp:{ gp:avg('gp'), gpStruct:avg('gpStruct'), fis:avg('fis'), mon:avg('mon'), ext:avg('ext'), conf:avg('conf'), drag:avg('drag'), hh:avg('hh') },
    fis:{ rev:S.fis.rev, spend:S.fis.spend, def:defPct(S), debt:debtPct(S), ceil:S.eco.ceil, rating:RATING[S.eco.rating], outlook:S.eco.outlook },
    grp:Object.fromEntries(GK.map(g => [g, Math.round(S.pol.grp[g])])), seats:govSeats(S), events:S.news.filter(n => n.q >= S.roundStart && n.q < S.q && (n.src === 'event' || n.src === 'law' || n.src === 'pol' || n.src === 'mkt')).map(n => n.title),
    world:worldTable(S).map(r => ({ k:r.k, gdppc:r.gdppc, cpi:r.cpi, gii:r.gii, pisa:r.pisa, g:r.g })), ai:null };
  S.years.push(rep); if(S.years.length > 60) S.years.shift();
  return rep;
}

/* ---- the world: other countries follow their latest trend, converging slowly toward 2% growth (game); Thailand comes from the model ---- */
function worldTable(S){
  const yrs = Math.max(0, (S.q) / 4 - .25);
  return WORLD.map(w => {
    if(w.k === 'th') return { k:'th', th:'ไทย', gdppc:Math.round(gdppc(S)), g:+S.eco.g.toFixed(1), cpi:cpiScore(S), gii:giiRank(giiScore(S)), pisa:pisaEst(S), me:true };
    let pc = w.gdppc, g = w.g26;
    if(pc != null && g != null){ for(let i = 0; i < Math.floor(yrs + .25); i++){ const gi = g * Math.pow(.97, i) + 2 * (1 - Math.pow(.97, i)); pc *= 1 + (gi + 2) / 100; } }
    const gNow = g != null ? +(g * Math.pow(.97, yrs) + 2 * (1 - Math.pow(.97, yrs))).toFixed(1) : null;
    return { k:w.k, th:w.th, gdppc:pc != null ? Math.round(pc) : null, g:gNow, cpi:w.cpi, gii:w.gii, pisa:w.pisa };
  });
}
function rankOf(rows, key, asc){ const v = rows.filter(r => r[key] != null).sort((x,y) => asc ? x[key] - y[key] : y[key] - x[key]); const i = v.findIndex(r => r.me); return i < 0 ? null : [i + 1, v.length]; }
