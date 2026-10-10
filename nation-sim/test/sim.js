const fs = require('fs');
const src = ['10-data.js','20-engine.js'].map(f => fs.readFileSync(__dirname + '/../src/' + f, 'utf8')).join('\n');
const run40 = new Function('mode', src + `
  const S = newGame({}); S.seed = 1234567 + (mode === 'rand' ? 99 : 0);
  const out = []; let bad = [];
  const pick = a => a[Math.floor(rng(S) * a.length)];
  for(let year = 0; year < 40; year++){
    const D = { ctl:{}, pol:[], proj:[] };
    if(mode === 'rand'){ for(let i = 0; i < 4; i++){ const c = pick(CTL); const to = Math.floor(rng(S) * c.opts.length); if(!blocked(S, c.id, to)) D.ctl[c.id] = to; }
      if(rng(S) < .3){ const p = pick(POL); if(!polBlocked(S, p.id)) D.pol.push(p.id); }
      if(rng(S) < .2){ const p = pick(PROJ); if(!projBlocked(S, p.id)) D.proj.push(p.id); } }
    if(mode === 'reform' && year === 0) Object.assign(D.ctl, { teach:2, egp:1, rdpub:2 });
    if(mode === 'reform' && year === 1) Object.assign(D.ctl, { nacc:1, tvet:1, reg:1 });
    if(mode === 'reform' && year === 2) Object.assign(D.ctl, { rdtax:1, startup:1, vat:1 });
    while(draftCost(S, D) > S.pol.cap){ const ks = Object.keys(D.ctl); if(ks.length) delete D.ctl[ks[0]]; else if(D.pol.length) D.pol.pop(); else D.proj.pop(); }
    const e = commit(S, D); if(e) out.push('  commit err: ' + e);
    let r = run(S), guard = 0;
    while(r === 'election' && guard++ < 5){ const A = autoCoalition(S); if(A){ const er = formGovernment(S, A.lead, A.partners); if(er) out.push('  form err ' + er); } else { out.push('  no coalition possible -> caretaker'); S.electionNow = null; S.nextElec = S.q + 1; S.phase = 'running'; } r = run(S); }
    const h = S.hist[S.hist.length - 1];
    const vals = JSON.stringify(S); if(/NaN|Infinity|null,null/.test(vals.replace(/"pisa":null|"gdppc":null|"g":null|"giis":null|"g25":null/g,''))) bad.push('year ' + year);
    if(year % 4 === 3 || r === 'election') out.push([beYear(fyOf(h.q - 1)), 'lead', h.lead, 'gen', S.gov.gen, 'g', h.g, 'pi', h.pi, 'r', h.r, 'debt', h.debt, 'def', h.def, 'appr', h.appr, 'seats', h.seats, 'gp', h.gp, 'gdppc', h.gdppc, 'cpi', h.cpi, 'gii', h.gii, 'pisa', h.pisa, 'rd', h.rd, 'prot', Math.round(S.pol.prot), 'rating', RATING[S.eco.rating]].join(' '));
  }
  out.push('govs: ' + S.govs.map(g => g.lead + '#' + g.gen + ' ' + g.grade + '(' + g.score + ') ' + g.how).join(' | '));
  out.push('elections: ' + S.elections.map(e => beYear(cal(e.q).y) + ':' + e.lead + ' ' + e.total).join(', '));
  out.push('bad: ' + bad.join(',') + ' size ' + JSON.stringify(S).length);
  return out.join('\\n');`);
for(const m of process.argv.slice(2)) { console.log('== ' + m); console.log(run40(m)); }
