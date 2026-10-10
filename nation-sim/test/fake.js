(() => {
  const ss = sessionStorage, load = () => JSON.parse(ss.getItem('fakedb') || '{}'), save = o => ss.setItem('fakedb', JSON.stringify(o));
  const log = m => { const l = JSON.parse(ss.getItem('fakelog') || '[]'); l.push(m); ss.setItem('fakelog', JSON.stringify(l)); };
  const bytes = o => new TextEncoder().encode(JSON.stringify(o)).length;
  const snapOf = (id, v) => ({ id, exists: v !== undefined, data: () => v === undefined ? undefined : JSON.parse(JSON.stringify(v)), metadata:{fromCache:false,hasPendingWrites:false} });
  const docRef = path => ({ id: path.split('/').pop(), path,
    async get(){ return snapOf(this.id, load()[path]); },
    async set(d){ const b = bytes(d); log(['set', path, b]); if(b > 262144) throw {code:'invalid_argument', message:'too big'}; const o = load(); o[path] = d; save(o); },
    async delete(){ log(['del', path]); const o = load(); delete o[path]; save(o); },
    collection: sub => colRef(path + '/' + sub) });
  const colRef = path => {
    const q = (ord, lim) => ({ orderBy:(f,dir) => q([f,dir], lim), limit:n => q(ord, n),
      async get(){ const o = load(), n = path.split('/').length + 1; let ds = Object.keys(o).filter(k => k.startsWith(path + '/') && k.split('/').length === n).map(k => snapOf(k.split('/').pop(), o[k]));
        if(ord) ds.sort((a,b) => (b.data()[ord[0]]||0) - (a.data()[ord[0]]||0)); if(lim) ds = ds.slice(0, lim); return { docs: ds, size: ds.length, empty: !ds.length }; } });
    return Object.assign(q(), { doc: id => docRef(path + '/' + id) });
  };
  const db = { collection: colRef, doc: docRef };
  window.claude = { use: async n => n === 'db' ? db : n === 'user' ? { id: async () => 'u1' } : null };
  const lim = Number(ss.getItem('lslimit') || 0);
  if(lim){ const orig = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v){ if(this === localStorage && String(v).length > lim) throw new DOMException('full', 'QuotaExceededError'); return orig.call(this, k, v); }; }
  const pre = ss.getItem('preload'); if(pre !== null){ if(pre) localStorage.setItem('crisisroom.v3', pre); else localStorage.clear(); ss.removeItem('preload'); }
})();
