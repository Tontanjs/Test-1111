/* ================= DATA =================
   Every baseline value with a source is real (checked 10 Oct 2026). Everything marked "game" is a model assumption.
   To extend the game, add rows here: controls (CTL), one-off policies (POL), projects (PROJ), countries (WORLD). */
const ASOF = '10 ต.ค. 2026';
const SRC = {
  te26:{t:'Wikipedia, "Results of the 2026 Thai general election"',d:'อ่านเมื่อ 10 ต.ค. 2026',u:'https://en.wikipedia.org/wiki/Results_of_the_2026_Thai_general_election'},
  pmvote:{t:'Malay Mail, "Thailand’s Anutin re-elected PM after crushing rival in parliamentary vote"',d:'19 มี.ค. 2026',u:'https://www.malaymail.com/news/world/2026/03/19/thailands-anutin-reelected-pm-after-crushing-rival-in-parliamentary-vote/213208'},
  dipcoal:{t:'The Diplomat, "Thai Prime Minister Announces Coalition Agreement With Pheu Thai Party"',d:'ก.พ. 2026',u:'https://thediplomat.com/2026/02/thai-prime-minister-announces-coalition-agreement-with-pheu-thai-party/'},
  refer26:{t:'Wikipedia, "2026 Thai constitutional referendum"',d:'อ่านเมื่อ 10 ต.ค. 2026',u:'https://en.wikipedia.org/wiki/2026_Thai_constitutional_referendum'},
  botmpc:{t:'Bangkok Post, "BoT upgrades GDP growth forecast"',d:'2026',u:'https://www.bangkokpost.com/business/general/3276059/bot-upgrades-gdp-growth-forecast'},
  bot25:{t:'ธนาคารแห่งประเทศไทย, Monetary Policy Committee’s Decision 6/2025',d:'17 ธ.ค. 2025',u:'https://www.bot.or.th/en/news-and-media/news/mpc/news-20251217-ZJSmv2EY.html'},
  bud27:{t:'The Nation, "Thailand pushes 3.788tn-baht budget as deficit spending tests fiscal discipline"',d:'2026',u:'https://www.nationthailand.com/business/economy/40068021'},
  debt26:{t:'Xinhua, "Thailand keeps public debt ceiling unchanged"',d:'เม.ย. 2026',u:'https://english.news.cn/asiapacific/20260423/d736a338fec84aa1ae7867a7a7a884ff/c.html'},
  hhd:{t:'SCB EIC, Flash: Household debt',d:'23 เม.ย. 2026',u:'https://www.scbeic.com/en/detail/file/product/10081/hhv4r0omku/Flash-household-debt-EN-20260423.pdf'},
  rate26:{t:'The Nation, "Thailand Secures “Stable Outlook” Trio as Fitch Upgrades Rating"',d:'ก.ย. 2026',u:'https://www.nationthailand.com/business/economy/40071245'},
  vat807:{t:'Forvis Mazars, "Thailand maintains 7% VAT rate for another year"',d:'ส.ค. 2026',u:'https://www.forvismazars.com/th/en/insights/doing-business-in-thailand/tax/thailand-maintains-7-vat-rate-for-another-year'},
  nida3:{t:'The Nation, "Support for Anutin and Bhumjaithai falls in latest NIDA Poll"',d:'ก.ย. 2026',u:'https://www.nationthailand.com/news/politics/40071547'},
  wbpot:{t:'World Bank (ผ่าน Malaya Business Insight), "WB trims Thailand’s GDP growth outlook"',d:'11 ก.ย. 2025',u:'https://malaya.com.ph/business/world-business/wb-trims-thailands-gdp-growth-outlook'},
  fmult:{t:'Southeast Asian Journal of Economics, "Assessing the Impact of Thailand’s Government Consumption and Tax Shocks with a Non-recursive SVAR Model"',d:'2025',u:'https://so05.tci-thaijo.org/index.php/saje/article/view/275461'},
  pop26:{t:'Khaosod English, "Thailand’s population shrinks down to 65.8 million"',d:'27 มี.ค. 2026',u:'https://www.khaosodenglish.com/news/2026/03/27/thailands-population-shrinks-down-to-65-8-million/'},
  wage26:{t:'WageIndicator, "Minimum Wage – Thailand"',d:'อ่านเมื่อ 10 ต.ค. 2026',u:'https://wageindicator.org/salary/minimum-wage/thailand'},
  cpith:{t:'Khaosod English, "Anutin says Thailand ‘Fails’ after corruption score sinks to 19-year low"',d:'13 ก.พ. 2026',u:'https://www.khaosodenglish.com/featured/2026/02/13/anutin-says-thailand-fails-after-corruption-score-sinks-to-19-year-low/'},
  cpiasia:{t:'Morrison Foerster, "Corruption Perceptions Index 2025: Global Average Score Falls to Record Low; Asia Pacific Trends Diverge"',d:'13 ก.พ. 2026',u:'https://www.mofo.com/resources/insights/260213-corruption-perceptions-index-2025'},
  cpide:{t:'Transparency International Deutschland, ตาราง CPI 2025',d:'ก.พ. 2026',u:'https://www.transparency.de/fileadmin/Redaktion/Aktuelles/2026/CPI_2025/Tabelle_-_Kopie.pdf'},
  cpius:{t:'Transparency International US, "Transparency International Release Latest Corruption Perceptions Index"',d:'ก.พ. 2026',u:'https://us.transparency.org/news/transparency-international-release-latest-corruption-perceptions-index/'},
  gii25:{t:'WIPO, Global Innovation Index 2025 (ผ่าน Statranker และ Visual Capitalist)',d:'ก.ย. 2025',u:'https://statranker.org/digital-innovation/top-100-countries-by-global-innovation-index-2025/'},
  giith:{t:'The Nation, "Thailand ranks 45th in global innovation index 2025"',d:'ก.ย. 2025',u:'https://www.nationthailand.com/business/tech/40055528'},
  pisa22:{t:'OECD PISA 2022 Results Volume I (ตารางคณิตศาสตร์ ผ่าน The Hechinger Report)',d:'ธ.ค. 2023',u:'https://hechingerreport.org/wp-content/uploads/2023/12/Math-rankings-PISA-2022.pdf'},
  gdppc:{t:'Worldometer, "GDP per Capita (2025)" ข้อมูล IMF World Economic Outlook เม.ย. 2026',d:'อ่านเมื่อ 10 ต.ค. 2026',u:'https://www.worldometers.info/gdp/gdp-per-capita/?region=worldwide&year=2025&metric=nominal'},
  asean25:{t:'Seasia Stats, "ASEAN Economies: 2025 GDP Growth" และ Vietnamnet (เวียดนาม 8.02%)',d:'2026',u:'https://seasiastats.com/statistic/asean-economies-2025-gdp-growth-eeD3f'},
  imf26:{t:'IMF World Economic Outlook เม.ย. 2026 (ผ่าน Visual Capitalist สำหรับประมาณการปี 2026)',d:'เม.ย. 2026',u:'https://www.visualcapitalist.com/sp/ter02-2026-gdp-growth-forecasts-worlds-20-largest-economies/'},
  imfch1:{t:'IMF World Economic Outlook เม.ย. 2026 บทที่ 1',d:'เม.ย. 2026',u:'https://www.imf.org/-/media/files/publications/weo/2026/april/english/ch1.pdf'},
  rdth:{t:'วช. (NRCT), "Thailand’s Research and Development Index" (GERD/GDP 0.94% ปี 2023 ภาคเอกชน 67%)',d:'อ่านเมื่อ 10 ต.ค. 2026',u:'https://en.nrct.go.th/RaD/detail/442'}
};
const FACTS = [
  ['8 ก.พ. 2026 เลือกตั้ง ส.ส. 500 ที่นั่ง (แบ่งเขต 400 บัญชีรายชื่อ 100) ภูมิใจไทยราว 192 ที่นั่ง (แหล่งต่างกัน 191–193) ประชาชน 120 เพื่อไทย 74 กล้าธรรม 58 ประชาธิปัตย์ 21 บัญชีรายชื่อ: ประชาชน 30.56% ภูมิใจไทย 17.90% เพื่อไทย 15.43% ประชาธิปัตย์ 10.91%',['te26']],
  ['19 มี.ค. 2026 สภาเลือกนายอนุทิน ชาญวีรกูล เป็นนายกฯ 293 เสียง รัฐบาลผสมภูมิใจไทย เพื่อไทย และพรรคเล็ก ราว 292 เสียง',['pmvote','dipcoal']],
  ['ประชามติ 8 ก.พ. 2026 เห็นชอบให้จัดทำรัฐธรรมนูญใหม่ 60.16%',['refer26']],
  ['เศรษฐกิจปี 2025 โต 2.4% ธปท. คาดปี 2026 ราว 2.0–2.3% ดอกเบี้ยนโยบาย 1.00% ธนาคารโลกประเมินศักยภาพราว 2.7% ต่อปี',['botmpc','bot25','wbpot']],
  ['งบปี 2027 รายจ่าย 3.788 ล้านล้านบาท รายได้ราว 3.0 ล้านล้าน ขาดดุล 3.9% ของ GDP แผนการคลังตั้งเป้าขาดดุลต่ำกว่า 3% ภายในปี 2029',['bud27']],
  ['หนี้สาธารณะราว 66.4% ของ GDP (31 มี.ค. 2026) เพดาน 70% ประมาณการสิ้นปีงบ 2027 ที่ 69.36% หนี้ครัวเรือน 86.7% ของ GDP (ไตรมาส 4/2025)',['debt26','bud27','hhd']],
  ['อันดับความน่าเชื่อถือ Baa1 / BBB+ / BBB+ แนวโน้มมีเสถียรภาพ (ก.ย. 2026) VAT ตามกฎหมาย 10% ลดเหลือ 7% ถึง 30 ก.ย. 2027',['rate26','vat807']],
  ['ดัชนีการรับรู้การทุจริต (CPI) 2025: ไทย 33 คะแนน อันดับ 116 ต่ำสุดในรอบ 19 ปี',['cpith']],
  ['ดัชนีนวัตกรรมโลก (GII) 2025: ไทยอันดับ 45 (คะแนน 36.7) ค่าใช้จ่ายวิจัยและพัฒนา 0.94% ของ GDP (ปี 2023) ภาคเอกชนออก 67%',['giith','rdth']],
  ['PISA 2022 คณิตศาสตร์: ไทย 394 คะแนน ค่าเฉลี่ย OECD 472',['pisa22']],
  ['ค่าแรงขั้นต่ำ 337–400 บาทต่อวันตามจังหวัด ประชากรตามทะเบียน 65.8 ล้านคน และลดลง',['wage26','pop26']],
  ['NIDA Poll ไตรมาส 3/2026: นายอนุทิน 13.76% ตามหลังนายณัฐพงษ์ เรืองปัญญาวุฒิ 24.72%',['nida3']],
  ['ตัวคูณรายจ่ายบริโภคของรัฐไทยราว 0.9 ตัวคูณภาษีราว -0.7 (แบบจำลอง SVAR 2001–2023) แบบจำลองของเกมใช้ค่านี้',['fmult']]
];
/* world benchmark: latest sourced values. g26 = growth used for projections (IMF 2026 projection where sourced, else the 2025 actual). null = no sourced value */
const WORLD = [
  { k:'th', th:'ไทย',      gdppc:8057,  g25:2.4,  g26:2.0, cpi:33, gii:45, giis:36.7, pisa:394 },
  { k:'vn', th:'เวียดนาม',  gdppc:4829,  g25:8.02, g26:8.02, cpi:41, gii:44, giis:37.1, pisa:null },
  { k:'my', th:'มาเลเซีย',  gdppc:13949, g25:4.9,  g26:4.9, cpi:52, gii:34, giis:40.6, pisa:409 },
  { k:'id', th:'อินโดนีเซีย', gdppc:5082,  g25:5.11, g26:5.0, cpi:34, gii:55, giis:31.3, pisa:366 },
  { k:'ph', th:'ฟิลิปปินส์', gdppc:4270,  g25:4.4,  g26:4.4, cpi:32, gii:50, giis:33.6, pisa:355 },
  { k:'sg', th:'สิงคโปร์',  gdppc:99365, g25:5.0,  g26:5.0, cpi:84, gii:5,  giis:59.9, pisa:575 },
  { k:'kr', th:'เกาหลีใต้',  gdppc:36227, g25:null, g26:1.9, cpi:63, gii:4,  giis:null, pisa:527 },
  { k:'jp', th:'ญี่ปุ่น',    gdppc:35973, g25:0.6,  g26:0.7, cpi:71, gii:12, giis:53.6, pisa:536 },
  { k:'cn', th:'จีน',       gdppc:13968, g25:null, g26:4.4, cpi:43, gii:10, giis:null, pisa:null },
  { k:'in', th:'อินเดีย',    gdppc:2675,  g25:null, g26:6.5, cpi:39, gii:38, giis:38.2, pisa:null },
  { k:'us', th:'สหรัฐ',     gdppc:89991, g25:2.1,  g26:2.3, cpi:64, gii:3,  giis:61.7, pisa:465 },
  { k:'de', th:'เยอรมนี',   gdppc:null,  g25:0.2,  g26:0.8, cpi:77, gii:11, giis:55.5, pisa:475 }
];
const WORLD_SRC = ['gdppc','asean25','imf26','imfch1','cpith','cpiasia','cpide','cpius','gii25','giith','pisa22'];
/* GII: known 2025 (score, rank) pairs used to place Thailand's simulated score on the world ranking */
const GII_CURVE = [[61.7,3],[59.9,5],[55.5,11],[53.6,12],[40.6,34],[38.2,38],[37.1,44],[36.7,45],[33.6,50],[31.3,55]];

/* politics: seats after the 2026 election; list = 2026 party-list share; cons = constituency seats; cv = constituency vote share
   (Kla Tham 11.28% sourced, the rest game estimates consistent with the seat results) */
const PARTY = {
  bjt:{ th:'ภูมิใจไทย', seats:192, list:17.90, cons:173, cv:30, col:'#2B5C8A' },
  pt:{ th:'เพื่อไทย', seats:74, list:15.43, cons:58, cv:16, col:'#C0392B' },
  pp:{ th:'ประชาชน', seats:120, list:30.56, cons:88, cv:26, col:'#E67E22' },
  kt:{ th:'กล้าธรรม', seats:58, list:1.79, cons:56, cv:11.28, col:'#7D6608' },
  dem:{ th:'ประชาธิปัตย์', seats:21, list:10.91, cons:10, cv:6, col:'#5DADE2' },
  sg:{ th:'พรรคเล็ก (สายรัฐบาล)', seats:26, list:12.0, cons:10, cv:6, col:'#7F8C8D' },
  so:{ th:'พรรคเล็กอื่น', seats:9, list:11.41, cons:5, cv:4.72, col:'#B2BABB' }
};
const PK = Object.keys(PARTY);
/* how willing a lead party is to govern with each partner (0-100, game; from coalition behaviour in 2023 and 2026) */
const WILLING = {
  bjt:{ pt:70, kt:55, dem:55, sg:80, so:60, pp:10 }, pt:{ bjt:65, kt:60, dem:45, sg:75, so:60, pp:35 },
  pp:{ pt:40, dem:25, kt:15, bjt:10, sg:30, so:40 }, kt:{ bjt:55, pt:60, dem:50, sg:75, so:60, pp:10 },
  dem:{ bjt:55, pt:45, kt:50, sg:70, so:55, pp:25 }, sg:{ bjt:70, pt:65, kt:65, dem:55, so:60, pp:20 }, so:{ bjt:55, pt:55, kt:55, dem:50, sg:60, pp:40 }
};
/* social groups: electorate weights (game) */
const GROUPS = {
  rural:{ th:'เกษตรกรและชนบท', w:.30 }, urban:{ th:'แรงงานในเมือง', w:.22 }, middle:{ th:'ชนชั้นกลาง', w:.16 },
  youth:{ th:'คนรุ่นใหม่', w:.12 }, elder:{ th:'ผู้สูงอายุ', w:.12 }, biz:{ th:'ภาคธุรกิจ', w:.04 }, state:{ th:'ข้าราชการและทหาร', w:.04 }
};
const GK = Object.keys(GROUPS);
/* which parties a group drifts to when unhappy with the government (game) */
const LEAN = { rural:['pt','kt'], urban:['pp','pt'], middle:['pp','dem'], youth:['pp'], elder:['dem','pt'], biz:['bjt','dem'], state:['bjt','kt'] };
/* which parties each group already favours: a government led by one of them starts with goodwill there (game) */
const BASE = { pt:{rural:6,urban:3}, pp:{youth:10,urban:4,middle:3,state:-8}, bjt:{rural:3,biz:3,state:3}, dem:{middle:3,elder:3}, kt:{rural:4,state:3} };
/* structural indexes (0-100, 50 = the 2026 starting point; game) */
const IDX = { edu:'คุณภาพการศึกษา', rd:'วิจัยและนวัตกรรม', corr:'ความโปร่งใส', biz:'บรรยากาศการลงทุน', infra:'โครงสร้างพื้นฐาน', env:'สิ่งแวดล้อมและอากาศ', health:'สาธารณสุข', equal:'ความเท่าเทียม', rights:'สิทธิเสรีภาพ' };
const IK = Object.keys(IDX);
const PATHS = {
  cab:{ th:'มติ ครม.', q:1, cap:1 }, decree:{ th:'พระราชกฤษฎีกา', q:1, cap:1 }, act:{ th:'พระราชบัญญัติ', q:3, cap:2 },
  wage:{ th:'คณะกรรมการค่าจ้าง', q:2, cap:1 }, budget:{ th:'งบประมาณประจำปี', q:0, cap:0 }, bot:{ th:'ท่าทีต่อ ธปท.', q:1, cap:1 }, const:{ th:'แก้รัฐธรรมนูญและประชามติ', q:5, cap:3 }
};
const SECTIONS = [
  ['fiscal','ภาษีและการคลัง'], ['invest','การลงทุนและ BOI'], ['edu','การศึกษาและทักษะ'], ['rd','วิจัยและนวัตกรรม'], ['corr','ปราบทุจริต'],
  ['social','แรงงานและสวัสดิการ'], ['env','สิ่งแวดล้อมและพลังงาน'], ['politics','การเมืองและการชุมนุม'], ['budget','งบรายด้าน'], ['special','นโยบายพิเศษและโครงการ']
];
/* the decision sheet. Each control has levels; arrays give the effect at each level (index = level).
   cost/rev: trillion baht a year; kind: fiscal multiplier class; idx: target shift of a structural index; grp: target shift of a group's satisfaction;
   par: partner-party satisfaction per quarter; pi/u: inflation/unemployment points; ext: external demand; prot: protest pressure; court: court-case risk.
   Values are game estimates unless a comment says otherwise. senate: chance the Senate rejects a move away from level 0. */
const CTL = [
  { id:'vat', sec:'fiscal', th:'อัตรา VAT', path:'decree', def:0, opts:['7% (ปัจจุบัน)','8%','9%','10% (อัตราตามกฎหมาย)'],
    rev:[0,.13,.26,.39], kind:'tax', jump:{pi:.6}, grp:{rural:[0,-3,-6,-9],urban:[0,-4,-8,-11],middle:[0,-4,-7,-10],elder:[0,-3,-5,-8]}, par:{pt:[0,-1,-2,-3]},
    note:'ทุก 1% ได้รายได้ราว 1.3 แสนล้านบาทต่อปี (ค่าของเกม) เงินเฟ้อขึ้นครั้งเดียวตอนปรับ' },
  { id:'cit', sec:'fiscal', th:'ภาษีเงินได้นิติบุคคล', path:'act', def:2, opts:['15%','17%','20% (ปัจจุบัน)','23%','25%'],
    rev:[-.15,-.09,0,.07,.11], kind:'tax', idx:{biz:[12,6,0,-5,-9]}, grp:{biz:[10,5,0,-6,-10],youth:[-1,0,0,1,1]}, ext:[.15,.08,0,-.06,-.1],
    note:'ภาษีต่ำดึงการลงทุนระยะยาว แต่รายได้หายทันที' },
  { id:'pit', sec:'fiscal', th:'ภาษีเงินได้บุคคลและความมั่งคั่ง', path:'act', def:1, opts:['ลดอัตราสูงสุดเหลือ 30%','35% (ปัจจุบัน)','เพิ่มขั้น 40% และภาษีความมั่งคั่ง'],
    rev:[-.04,0,.06], kind:'tax', idx:{equal:[-3,0,5]}, grp:{middle:[3,0,-4],biz:[2,0,-6],youth:[-1,0,4],urban:[0,0,2]}, par:{bjt:[1,0,-1],sg:[1,0,-2]}, senate:[0,0,.3],
    note:'เพิ่มรายได้และลดความเหลื่อมล้ำ กลุ่มทุนต่อต้าน' },
  { id:'spend', sec:'fiscal', th:'รายจ่ายรวมเทียบแผนการคลัง', path:'budget', def:2, opts:['-5%','-3%','ตามแผน','+3%','+5%'], adj:[-5,-3,0,3,5],
    note:'เพิ่มรายจ่ายกระตุ้นเศรษฐกิจระยะสั้นด้วยตัวคูณ 0.9 แต่เพิ่มหนี้ ลดรายจ่ายช่วยหนี้แต่กดการเติบโต' },
  { id:'bot', sec:'fiscal', th:'ท่าทีต่อธนาคารแห่งประเทศไทย', path:'bot', def:0, opts:['เคารพความเป็นอิสระ','ขอให้ผ่อนคลายนโยบาย','กดดันต่อสาธารณะ'],
    botcred:[0,-.02,-.08], grp:{biz:[0,2,3],middle:[0,0,-2]}, note:'ธปท. เป็นอิสระตามกฎหมาย อาจไม่ทำตาม การกดดันลดความน่าเชื่อถือของนโยบายการเงิน' },
  { id:'ceil', sec:'fiscal', th:'เพดานหนี้สาธารณะ', path:'cab', def:0, opts:['70% ของ GDP (ปัจจุบัน)','75% ของ GDP'], ceilv:[70,75], jump:{conf:-4},
    note:'คณะกรรมการนโยบายการเงินการคลังรัฐขยายได้ บริษัทจัดอันดับจับตา' },

  { id:'boi', sec:'invest', th:'สิทธิประโยชน์ BOI', path:'cab', def:1, opts:['ลดลง','คงเดิม','เพิ่มสิทธิประโยชน์','แข่งเต็มที่ (ยกเว้นภาษีนาน + เงินอุดหนุน)'],
    rev:[.01,0,-.02,-.05], kind:'tax', idx:{biz:[-6,0,6,11]}, ext:[-.1,0,.15,.3], grp:{biz:[-5,0,4,7]}, note:'ดึง FDI แต่สูญรายได้ภาษี ประเทศเพื่อนบ้านแข่งด้วยสิทธิประโยชน์คล้ายกัน' },
  { id:'reg', sec:'invest', th:'ปฏิรูปกฎระเบียบและใบอนุญาต', path:'act', def:0, opts:['คงเดิม','ทบทวนใบอนุญาต (กิโยตินกฎหมาย)','ปฏิรูปเต็มรูปแบบ + บริการจุดเดียว'],
    cost:[0,.002,.005], kind:'cons', idx:{biz:[0,6,12],corr:[0,2,4]}, grp:{biz:[0,3,6],state:[0,-2,-5]}, note:'ลดต้นทุนธุรกิจและช่องทางเรียกรับ ข้าราชการบางส่วนต่อต้าน' },
  { id:'fown', sec:'invest', th:'เปิดให้ต่างชาติถือหุ้นในธุรกิจบริการ', path:'act', def:0, opts:['คงเดิม','เปิดบางสาขา','เปิดกว้าง'],
    idx:{biz:[0,4,8]}, ext:[0,.1,.2], grp:{biz:[0,2,3],middle:[0,-1,-3],rural:[0,0,-1]}, par:{sg:[0,-1,-2]}, senate:[0,.15,.35], note:'ดึงทุนและเทคโนโลยี ผู้ประกอบการไทยบางกลุ่มเสียเปรียบ' },
  { id:'sector', sec:'invest', th:'อุตสาหกรรมเป้าหมาย', path:'cab', def:0, opts:['กระจายทั่วไป','EV และแบตเตอรี่','เซมิคอนดักเตอร์และอิเล็กทรอนิกส์','ดาต้าเซ็นเตอร์และ AI','การแพทย์และชีวภาพ'],
    cost:[0,.008,.01,.008,.006], kind:'cap', idx:{biz:[0,3,4,4,3],rd:[0,2,4,3,4]}, ext:[0,.12,.15,.12,.08], grp:{biz:[0,2,3,3,2],youth:[0,1,2,3,1]}, env:[0,1,-1,-2,0],
    note:'เลือกจุดเน้นได้หนึ่งด้าน ดาต้าเซ็นเตอร์ใช้ไฟและน้ำมาก' },

  { id:'teach', sec:'edu', th:'ปฏิรูปครูและหลักสูตร', path:'act', def:0, opts:['คงเดิม','หลักสูตรฐานสมรรถนะ','ปฏิรูปครู (คัดเลือก อบรม ค่าตอบแทน)','ปฏิรูปเต็มรูปแบบ'],
    cost:[0,.01,.03,.05], kind:'cons', idx:{edu:[0,4,9,14]}, grp:{youth:[0,2,4,5],middle:[0,1,3,4],state:[0,0,-2,-4]}, note:'ผลต่อคะแนนนักเรียนและผลิตภาพมาช้า หลายปีกว่าจะเห็นในการเติบโต' },
  { id:'tvet', sec:'edu', th:'อาชีวศึกษาทวิภาคี', path:'cab', def:0, opts:['คงเดิม','ขยายทวิภาคี','ร่วมเอกชน + เครดิตภาษี','ระบบทักษะแห่งชาติ'],
    cost:[0,.005,.012,.02], kind:'cons', idx:{edu:[0,2,4,6],biz:[0,2,4,5]}, u:[0,-.03,-.06,-.08], grp:{urban:[0,2,3,4],biz:[0,2,3,4]}, note:'ลดปัญหาแรงงานไม่ตรงความต้องการ' },
  { id:'digital', sec:'edu', th:'ทักษะดิจิทัลและ AI', path:'cab', def:0, opts:['คงเดิม','ดิจิทัลในโรงเรียน','โครงการ AI ระดับชาติ'],
    cost:[0,.004,.01], kind:'cons', idx:{edu:[0,2,4],rd:[0,1,3]}, grp:{youth:[0,2,4]}, note:'เตรียมแรงงานสำหรับอุตสาหกรรมใหม่' },

  { id:'rdpub', sec:'rd', th:'งบวิจัยภาครัฐ', path:'budget', def:1, opts:['0.2% ของ GDP','0.31% (ปัจจุบัน)','0.5%','0.75%','1.0%'], rdv:[.2,.31,.5,.75,1.0],
    idx:{rd:[-4,0,6,12,18]}, note:'ปี 2023 ไทยลงทุน R&D 0.94% ของ GDP ภาคเอกชนออก 67% ภาครัฐราว 0.31% (วช.) ต้นทุนคิดตามสัดส่วน GDP' },
  { id:'rdtax', sec:'rd', th:'สิทธิลดหย่อนภาษีวิจัยเอกชน', path:'act', def:0, opts:['ลดหย่อนปกติ','ลดหย่อนเพิ่ม','ลดหย่อนสูงสุด + เครดิตภาษี'],
    rev:[0,-.005,-.015], kind:'tax', idx:{rd:[0,4,8],biz:[0,1,2]}, grp:{biz:[0,2,3]}, note:'กระตุ้น R&D ภาคเอกชนซึ่งเป็นสองในสามของทั้งประเทศ' },
  { id:'startup', sec:'rd', th:'สตาร์ตอัปและนวัตกรรม', path:'cab', def:0, opts:['ไม่มีมาตรการเพิ่ม','กองทุนร่วมลงทุนภาครัฐ','กองทุน + วีซ่าสตาร์ตอัป + แซนด์บ็อกซ์'],
    cost:[0,.005,.01], kind:'cap', idx:{rd:[0,3,6],biz:[0,1,3]}, grp:{youth:[0,2,3],biz:[0,1,2]}, note:'ผลตอบแทนไม่แน่นอน บางกองทุนขาดทุน' },
  { id:'ip', sec:'rd', th:'ทรัพย์สินทางปัญญา', path:'cab', def:0, opts:['คงเดิม','เร่งพิจารณาสิทธิบัตรและบังคับใช้'],
    cost:[0,.001], kind:'cons', idx:{rd:[0,2],biz:[0,1]}, note:'ลดงานค้างพิจารณาสิทธิบัตร' },

  { id:'nacc', sec:'corr', th:'หน่วยงานปราบทุจริต', path:'act', def:0, opts:['คงเดิม','เพิ่มงบและบุคลากร','เพิ่มอำนาจสอบสวนและความเป็นอิสระ'],
    cost:[0,.002,.004], kind:'cons', idx:{corr:[0,4,8]}, court:[0,2,5], par:{sg:[0,-1,-2],kt:[0,-1,-2]}, note:'คดีทุจริตเพิ่มขึ้น รวมถึงคดีของฝ่ายรัฐบาลเอง' },
  { id:'egp', sec:'corr', th:'เปิดข้อมูลจัดซื้อจัดจ้าง', path:'cab', def:0, opts:['คงเดิม','เปิดข้อมูลจัดซื้อ','เปิดข้อมูลทั้งหมด + ตรวจสอบแบบเรียลไทม์'],
    cost:[0,.001,.003], kind:'cons', idx:{corr:[0,5,9]}, grp:{middle:[0,2,3],youth:[0,1,3]}, par:{sg:[0,-1,-2]}, note:'ลดการรั่วไหลของโครงการรัฐ' },
  { id:'assets', sec:'corr', th:'บังคับใช้การแสดงบัญชีทรัพย์สิน', path:'act', def:0, opts:['คงเดิม','บังคับใช้จริงจังทุกระดับ'],
    idx:{corr:[0,4]}, grp:{state:[0,-3],middle:[0,2]}, court:[0,3], par:{sg:[0,-1],kt:[0,-1]}, note:'นักการเมืองและข้าราชการบางส่วนไม่พอใจ' },
  { id:'whistle', sec:'corr', th:'คุ้มครองผู้แจ้งเบาะแส', path:'act', def:0, opts:['ไม่มีกฎหมายเฉพาะ','ออกกฎหมายคุ้มครองและให้รางวัล'],
    cost:[0,.001], kind:'cons', idx:{corr:[0,3],rights:[0,1]}, grp:{middle:[0,2],youth:[0,2]}, note:'ข่าวอื้อฉาวถูกเปิดโปงมากขึ้นในช่วงแรก' },

  { id:'minw', sec:'social', th:'ค่าแรงขั้นต่ำ', path:'wage', def:0, opts:['คงเดิม','ปรับ 3% ต่อปี','ปรับ 5% ต่อปี','400 บาททั่วประเทศ'],
    pi:[0,.1,.2,.3], u:[0,.03,.07,.15], idx:{equal:[0,1,2,3]}, grp:{urban:[0,3,5,8],rural:[0,1,2,3],biz:[0,-2,-4,-8]}, par:{pt:[0,1,1,2]}, note:'คณะกรรมการไตรภาคีอาจให้ไม่เต็มที่ขอ ต้นทุน SME เพิ่ม' },
  { id:'pension', sec:'social', th:'เบี้ยยังชีพผู้สูงอายุ', path:'act', def:0, opts:['คงเดิม (ขั้นบันได 600–1,000 บาท)','เพิ่มทุกขั้น 200 บาท','1,000 บาทถ้วนหน้า'],
    cost:[0,.04,.12], kind:'trans', idx:{equal:[0,2,4]}, grp:{elder:[0,5,12],rural:[0,2,4],youth:[0,0,-2]}, par:{pt:[0,1,2]}, note:'ภาระถาวรที่เพิ่มตามจำนวนผู้สูงอายุ' },
  { id:'uhc', sec:'social', th:'หลักประกันสุขภาพ', path:'cab', def:0, opts:['คงเดิม','เพิ่มงบรายหัว','ปฏิรูปปฐมภูมิ + สุขภาพจิต'],
    cost:[0,.02,.04], kind:'cons', idx:{health:[0,5,10]}, grp:{elder:[0,3,5],rural:[0,2,3],urban:[0,1,2]}, note:'สังคมสูงวัยทำให้ต้นทุนเพิ่มทุกปี' },
  { id:'cash', sec:'social', th:'เงินโอนสวัสดิการ', path:'cab', def:0, opts:['คงเดิม','เพิ่มเงินบัตรสวัสดิการ','เงินอุดหนุนเด็กเล็กถ้วนหน้า'],
    cost:[0,.03,.05], kind:'trans', idx:{equal:[0,3,5],edu:[0,0,2]}, grp:{rural:[0,3,4],urban:[0,2,3]}, par:{pt:[0,1,1]}, note:'ลดความยากจน ระวังการคัดกรองผิดพลาด' },
  { id:'hhdebt', sec:'social', th:'แก้หนี้ครัวเรือน', path:'cab', def:0, opts:['คงเดิม','ปรับโครงสร้างหนี้ร่วม ธปท.','พักหนี้วงกว้าง'],
    cost:[0,.02,.06], kind:'trans', hh:[0,-.3,-.8], botcred:[0,0,-.02], grp:{rural:[0,3,6],urban:[0,2,4]}, par:{pt:[0,1,2]}, note:'พักหนี้วงกว้างเสี่ยงวินัยการชำระหนี้' },

  { id:'renew', sec:'env', th:'พลังงานหมุนเวียน', path:'cab', def:0, opts:['แผนเดิม','เร่งเป้าหมาย 40% ภายในปี 2035','ตลาดไฟฟ้าเสรี + หมุนเวียน 50%'],
    cost:[0,.01,.02], kind:'cap', idx:{env:[0,5,9],biz:[0,1,3]}, pi:[0,.05,.1], grp:{youth:[0,2,4]}, note:'ค่าไฟช่วงเปลี่ยนผ่านอาจสูงขึ้น' },
  { id:'carbon', sec:'env', th:'ภาษีคาร์บอน', path:'act', def:0, opts:['ไม่มี','อัตราต่ำ','ภาษีคาร์บอน + ตลาดคาร์บอน'],
    rev:[0,.01,.03], kind:'tax', idx:{env:[0,3,6]}, pi:[0,.05,.12], grp:{biz:[0,-2,-5],youth:[0,2,3]}, note:'สอดคล้องมาตรการปรับคาร์บอนก่อนข้ามพรมแดนของยุโรป' },
  { id:'pm25', sec:'env', th:'ฝุ่น PM2.5', path:'act', def:0, opts:['คงเดิม','มาตรการช่วงฤดูฝุ่น','พ.ร.บ. อากาศสะอาดเต็มรูปแบบ'],
    cost:[0,.003,.01], kind:'cons', idx:{env:[0,4,8],health:[0,1,3]}, grp:{middle:[0,3,6],rural:[0,-2,-5],youth:[0,2,4]}, note:'ห้ามเผากระทบเกษตรกร' },
  { id:'energy', sec:'env', th:'ราคาพลังงาน', path:'cab', def:0, opts:['ราคาตามตลาด','ตรึงดีเซลและค่าไฟบางส่วน','ตรึงเต็มที่'],
    cost:[0,.03,.07], kind:'trans', pi:[0,-.15,-.35], idx:{env:[0,-2,-4]}, grp:{rural:[0,3,5],urban:[0,3,5],biz:[0,2,3]}, note:'กองทุนน้ำมันติดลบ บิดเบือนการใช้พลังงาน' },

  { id:'protest', sec:'politics', th:'แนวทางรับมือการชุมนุม', path:'cab', def:1, opts:['เปิดเวทีเจรจา','ปล่อยชุมนุมตามกฎหมาย','จำกัดพื้นที่และเวลา','สลายการชุมนุม'],
    prot:[-5,-1,2,-6], idx:{rights:[6,3,-3,-10]}, grp:{youth:[4,1,-4,-10],urban:[2,0,-2,-5],state:[-3,0,3,5],middle:[1,0,0,-3]}, court:[0,0,0,4], jump:{conf:0},
    note:'สลายการชุมนุมลดการชุมนุมระยะสั้น แต่สร้างแรงต้านและภาพลักษณ์ระหว่างประเทศเสีย' },
  { id:'media', sec:'politics', th:'เสรีภาพสื่อ', path:'cab', def:1, opts:['คุ้มครองเสรีภาพสื่อ','คงเดิม','กดดันสื่อและควบคุมออนไลน์'],
    idx:{rights:[5,0,-8],corr:[2,0,-3]}, grp:{youth:[2,0,-5],middle:[1,0,-3],state:[-1,0,2]}, scandal:[1.2,1,.7], note:'สื่อเสรีเปิดโปงข่าวอื้อฉาวมากขึ้น แต่ความโปร่งใสดีขึ้น' },
  { id:'charter', sec:'politics', th:'รัฐธรรมนูญฉบับใหม่', path:'const', def:0, opts:['ชะลอ','เดินหน้าตามคำวินิจฉัยศาล','เร่งยกร่างโดย สสร. เลือกตั้ง'],
    idx:{rights:[0,3,6]}, grp:{youth:[-3,3,8],state:[1,0,-6],urban:[0,1,3]}, court:[0,3,8], prot:[2,-2,-5], senate:[0,.3,.5], note:'ต้องผ่านรัฐสภาและประชามติ เคยถูกขัดขวางในศาลรัฐธรรมนูญ' },
  { id:'decent', sec:'politics', th:'กระจายอำนาจ', path:'act', def:0, opts:['คงเดิม','เพิ่มงบและภารกิจท้องถิ่น','เลือกตั้งผู้ว่าราชการนำร่อง'],
    cost:[0,.01,.012], kind:'cons', idx:{corr:[0,1,2],infra:[0,2,3]}, grp:{youth:[0,2,5],urban:[0,2,4],state:[0,-3,-7],rural:[0,2,2]}, par:{sg:[0,1,-2]}, senate:[0,0,.4], note:'กระทรวงมหาดไทยและพรรคฐานท้องถิ่นต่อต้าน' },
  { id:'conscript', sec:'politics', th:'การเกณฑ์ทหาร', path:'act', def:0, opts:['เกณฑ์แบบเดิม','สมัครใจเป็นหลัก','สมัครใจทั้งหมด'],
    cost:[0,.005,.012], kind:'cons', grp:{youth:[0,5,9],state:[0,-4,-8]}, coup:[1,1.1,1.25], senate:[0,.2,.35], note:'กองทัพต่อต้าน ต้องเพิ่มค่าตอบแทนทหารอาสา' }
];
const CTLK = Object.fromEntries(CTL.map(c => [c.id, c]));
/* one-off measures */
const POL = [
  { id:'handout', th:'แจกเงินดิจิทัล 5,000 บาท', path:'cab', once:.2, kind:'trans', grp:{rural:5,urban:5,elder:2,biz:-2,middle:-2}, par:{pt:8}, jump:{conf:-2}, note:'ตัวคูณต่ำ ใช้เงินราว 2 แสนล้านบาทครั้งเดียว' },
  { id:'stim', th:'พ.ร.ก. กู้เงินลงทุนเร่งด่วน 3 แสนล้านบาท', path:'act', once:.3, kind:'cap', idx:{infra:4}, court:10, jump:{conf:2}, note:'ต้องอ้างความเร่งด่วน หนี้เข้าใกล้เพดาน' },
  { id:'farm', th:'ประกันรายได้เกษตรกร 1 ปี', path:'cab', once:.08, kind:'trans', grp:{rural:8}, par:{pt:4,kt:4}, idx:{corr:-1}, note:'เสี่ยงรั่วไหล โครงการแบบนี้ในอดีตขาดทุนสูง' },
  { id:'visa', th:'ขยายวีซ่าฟรีและโปรโมทท่องเที่ยว', path:'cab', once:.01, kind:'cons', ext:.2, grp:{biz:4,urban:2}, note:'มีข้อกังวลอาชญากรรมข้ามชาติ' },
  { id:'casino', th:'กฎหมายสถานบันเทิงครบวงจร', path:'act', once:0, rev:.03, idx:{biz:3,corr:-3}, grp:{biz:5,elder:-6,middle:-4}, court:8, prot:4, senate:.35, perm:true, note:'ดึงการลงทุน แต่เสี่ยงฟอกเงิน ฝ่ายศาสนาต่อต้าน' },
  { id:'scam', th:'ปราบแก๊งคอลเซ็นเตอร์และบัญชีม้า', path:'cab', once:.005, kind:'cons', idx:{corr:2}, grp:{elder:5,middle:4,urban:3,rural:3}, note:'ได้รับความนิยม การค้าชายแดนบางจุดเสียหาย' }
];
const POLK = Object.fromEntries(POL.map(p => [p.id, p]));
/* public investment: cost in trillion baht over build quarters (game estimates); on completion the infrastructure index rises */
const PROJ = [
  { id:'hsr2', th:'รถไฟความเร็วสูงไทย–จีน ระยะ 2', cost:.34, q:12, infra:8, grp:{rural:3,biz:3}, leak:.12 },
  { id:'landbridge', th:'แลนด์บริดจ์ ชุมพร–ระนอง (ร่วมทุนเอกชน)', cost:.3, q:16, infra:10, grp:{biz:5}, leak:.15, env:-4, ppp:true },
  { id:'transit', th:'ส่วนต่อขยายรถไฟฟ้าและตั๋วร่วม', cost:.1, q:8, infra:4, grp:{urban:5,middle:4}, leak:.08 },
  { id:'water', th:'บริหารจัดการน้ำลุ่มเจ้าพระยา', cost:.15, q:10, infra:4, grp:{rural:5}, leak:.12, flood:.5 },
  { id:'grid', th:'สายส่งอัจฉริยะและพลังงานหมุนเวียน (ร่วมทุนเอกชน)', cost:.12, q:8, infra:3, env:5, grp:{biz:3,youth:2}, leak:.08, ppp:true },
  { id:'broadband', th:'อินเทอร์เน็ตความเร็วสูงทุกหมู่บ้าน', cost:.05, q:6, infra:3, idxx:{edu:2}, grp:{rural:3,youth:2}, leak:.1 },
  { id:'airport', th:'ขยายท่าอากาศยานและเชื่อมต่อ EEC', cost:.12, q:10, infra:5, grp:{biz:4,urban:2}, leak:.1 }
];
const PROJK = Object.fromEntries(PROJ.map(p => [p.id, p]));
const BUDK = ['edu','health','welfare','infra','defense','agri','local','justice','env'];
const BUDTH = { edu:'การศึกษา', health:'สาธารณสุข', welfare:'สวัสดิการ', infra:'โครงสร้างพื้นฐาน', defense:'กลาโหม', agri:'เกษตร', local:'ท้องถิ่น', justice:'ยุติธรรมและปราบทุจริต', env:'สิ่งแวดล้อม' };
const BUD0 = { edu:16, health:12, welfare:13, infra:18, defense:6, agri:7, local:22, justice:3, env:3 };   /* game shares of discretionary spending, % */
/* the government's medium-term deficit path (% of GDP). FY2027 from the budget bill; later years game interpolation toward the plan's "under 3% by 2029" */
const PLANDEF = y => y <= 2027 ? 3.9 : y === 2028 ? 3.5 : y === 2029 ? 2.9 : 2.8;
