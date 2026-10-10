(() => {
  const reply = pr => pr.includes('@@POLICY') ? '@@POLICY\n{"th":"เครดิตภาษีจ้างผู้สูงอายุ","path":"act","once":0.9,"rev":-0.02,"kind":"trans","idx":{"edu":20,"equal":3},"grp":{"elder":30,"biz":2},"court":0,"note":"รายได้ภาษีหาย"}'
    : '@@NEWS\n{"src":"press","title":"ข่าวทดสอบประจำปี","body":"รายละเอียด","grp":{"rural":2,"youth":-9}}\n{"src":"opp","title":"ฝ่ายค้านวิจารณ์งบ","body":"รายละเอียด"}\n@@ANALYSIS\nบทวิเคราะห์ทดสอบประจำปี';
  const use0 = window.claude.use;
  window.claude.use = async n => n === 'sample' ? (async (pr) => { const l = JSON.parse(sessionStorage.getItem('plen') || '[]'); l.push(pr.length); sessionStorage.setItem('plen', JSON.stringify(l)); return { text: reply(pr) }; }) : use0(n);
})();
