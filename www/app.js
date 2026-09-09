'use strict';

/* ---------- static data ---------- */
const FLOURS=[
 {id:'pizzeria',name:'Pizzeria',brand:'Caputo',w:270,wLabel:'260–280',hyd:[60,65],ferm:[24,48],fermLabel:'24–48 h'},
 {id:'nuvola',name:'Nuvola',brand:'Caputo',w:265,wLabel:'260–270',hyd:[62,70],ferm:[16,36],fermLabel:'16–36 h'},
 {id:'cuoco',name:'Cuoco',brand:'Caputo',w:310,wLabel:'300–320',hyd:[62,72],ferm:[36,96],fermLabel:'36–96 h'},
 {id:'napoletana',name:'Napoletana',brand:'Dallagiovanna',w:280,wLabel:'270–290',hyd:[60,66],ferm:[24,60],fermLabel:'24–60 h'},
 {id:'t65',name:'T65 tradition',brand:'Grande surface',w:180,wLabel:'~180',hyd:[58,62],ferm:[6,14],fermLabel:'6–14 h'}];
const METHODS=[
 {id:'direct',emoji:'🍞',name:'Direct',diff:'Débutant',dl:1,desc:"Tous les ingrédients dans une seule pâte. Le plus simple, le plus contrôlable, celui qui apprend le plus vite.",
  what:"Pas de pré-ferment : farine, eau, sel et levure sont pétris ensemble et la pâte fermente d'un seul tenant, en masse puis en pâtons.",
  why:"Idéal pour apprendre à lire une pâte et pour juger l'effet d'un seul réglage à la fois. C'est aussi le protocole des napolitaines de pizzeria.",
  stars:{gout:3,alv:3,ext:4,ctrl:5},minH:6},
 {id:'biga',emoji:'🥖',name:'Biga',diff:'Avancé',dl:3,desc:"Pré-ferment sec, autour de 45 % d'hydratation, incorporé au pétrissage final.",
  what:"Une part de la farine (50 à 100 %) est pré-fermentée très peu hydratée, à 16–20 °C pendant 14 à 24 h : elle devient un bloc parfumé, presque friable.",
  why:"C'est la méthode du cornicione spectaculaire et de l'alvéolage irrégulier, avec un goût profond de blé et de fermentation. Exige de la précision sur la température.",
  stars:{gout:5,alv:5,ext:5,ctrl:3},minH:20},
 {id:'poolish',emoji:'💧',name:'Poolish',diff:'Intermédiaire',dl:2,desc:"Pré-ferment liquide à 100 % d'hydratation, doux et prévisible.",
  what:"Une part de la farine est mélangée à son poids d'eau et à un peu de levure, puis fermente 8 à 16 h : le mélange bulle et sent la crème.",
  why:"Rend la pâte souple, très extensible et facile à étaler, avec un goût plus doux que la biga. C'est le meilleur premier pas hors du direct.",
  stars:{gout:4,alv:4,ext:5,ctrl:4},minH:14},
 {id:'levain',emoji:'🌱',name:'Levain naturel',diff:'Expert',dl:4,desc:"Fermentation sans levure industrielle, portée par un levain chef actif.",
  what:"Un levain rafraîchi 6 à 10 h avant apporte levures et bactéries lactiques ; il compte pour 10 à 25 % du poids de farine, avec son eau.",
  why:"Acidité fine, meilleure conservation, digestibilité. Mais la vitesse dépend de l'activité du levain : il faut savoir lire la pâte plutôt que la montre.",
  stars:{gout:5,alv:4,ext:3,ctrl:2},minH:20},
 {id:'pate_fermentee',emoji:'🥣',name:'Pâte fermentée',diff:'Intermédiaire',dl:2,desc:"Un morceau de pâte de la fournée précédente, déjà salé, comme ferment.",
  what:"On garde 15 à 25 % de la pâte d'une session passée (farine, eau, sel et levure déjà en place) et on l'incorpore au pétrissage final.",
  why:"Zéro gaspillage et un supplément de goût immédiat, sans gérer de pré-ferment dédié. La façon la plus économe d'aller vers la maturation longue.",
  stars:{gout:4,alv:3,ext:4,ctrl:4},minH:10}];
const GOALS=[
 {id:'classique',emoji:'🍕',label:'Classique napolitaine',note:"Cornicione net, centre fin et souple, l'équilibre attendu."},
 {id:'cornicione',emoji:'☁️',label:'Cornicione très développé',note:"Bord haut et aérien, quitte à un centre plus fin."},
 {id:'alveolage',emoji:'🫧',label:'Alvéolage important',note:"Grosses bulles irrégulières dans le bord et la mie."},
 {id:'extensible',emoji:'🥖',label:'Pâte très extensible',note:"Elle s'étale sans revenir ni se déchirer."},
 {id:'gout',emoji:'😋',label:'Plus de goût, maturation longue',note:"Blé, fermentation, légère acidité."},
 {id:'rapide',emoji:'⚡',label:'Protocole rapide',note:"Manger ce soir ou demain, sans planifier trois jours."},
 {id:'auto',emoji:'🎯',label:'Je ne sais pas — recommande-moi',note:"Le moteur décide avec ta farine, ta température et ton temps."}];
const YEASTS=[{id:'fresh',label:'Fraîche',f:1},{id:'dry',label:'Sèche active',f:0.4},{id:'instant',label:'Instantanée',f:0.33}];
const LEVELS=[{id:'debutant',label:'Débutant',max:1},{id:'confirme',label:'Confirmé',max:2},{id:'expert',label:'Expert',max:4}];
const PREHEAT={'Ooni Koda 16':22,'Four à gaz portable':25,'Four ménager + pierre':45};
const BAKE={'Ooni Koda 16':75,'Four à gaz portable':90,'Four ménager + pierre':300};
const OVENS=Object.keys(PREHEAT);
const FLOW_SIMPLE=['start','simple','recap'];
const FLOW_CUSTOM=['start','quantite','quand','format','paton','farine','objectif','methode','fermentation','recette','recap'];
const KICK={quantite:'Étape 1',quand:'Étape 2',format:'Étape 3',paton:'Étape 4',farine:'Étape 5',objectif:'Étape 6',methode:'Étape 7',fermentation:'Étape 8',recette:'Étape 9',recap:'Étape 10'};

/* ---------- state ---------- */
function defaultState(){
  const d=new Date(); d.setDate(d.getDate()+((6-d.getDay()+7)%7||7));
  return {mode:'',stepId:'start',launched:false,level:'confirme',count:4,dateStr:d.toISOString().slice(0,10),timeStr:'20:00',diameter:30,styleId:'napoletana',
   flourId:'pizzeria',ballWeight:270,hydration:65,saltRaw:30,yeastId:'fresh',tAmb:21,tFridge:4,doughTemp:23,
   goal:'classique',method:'direct',fermType:'mixte',organisation:'masse',duration:48,
   prefFlourPct:70,prefHyd:45,prefHours:16,prefTemp:18,levainPct:20,levainHyd:100,pfPct:20,
   ovenModel:'Ooni Koda 16',
   autolyse:false,autolyseMin:30,expert:false,compare:false,doneSteps:[]};
}
let ST=defaultState();
let livePanelOn=true;

function loadState(){
  try{
    const rawPrefs=localStorage.getItem('pizza.uiprefs');
    if(rawPrefs){const p=JSON.parse(rawPrefs); if(typeof p.livePanelOn==='boolean') livePanelOn=p.livePanelOn;}
  }catch(e){}
  try{
    const rawSession=JSON.parse(localStorage.getItem('pizza.session'));
    if(rawSession&&rawSession.launched){ ST=Object.assign(defaultState(),rawSession); return; }
  }catch(e){}
  try{
    const rawDraft=JSON.parse(localStorage.getItem('pizza.draft'));
    if(rawDraft){ ST=Object.assign(defaultState(),rawDraft,{launched:false}); return; }
  }catch(e){}
}
function persistSession(){ try{ const c=Object.assign({},ST); localStorage.setItem('pizza.session',JSON.stringify(c)); }catch(e){} }
function persistDraft(){ try{ if(!ST.launched){ const c=Object.assign({},ST); localStorage.setItem('pizza.draft',JSON.stringify(c)); } }catch(e){} }
function persistPrefs(){ try{ localStorage.setItem('pizza.uiprefs',JSON.stringify({livePanelOn})); }catch(e){} }
function clearSession(){ try{ localStorage.removeItem('pizza.session'); }catch(e){} }

/* ---------- pure engine (ported from the design reference) ---------- */
function rate(t){ return Math.pow(2,(t-20)/10); }
function eatDate(){ const d=new Date((ST.dateStr||'2026-09-12')+'T'+(ST.timeStr||'20:00')); return isNaN(d)?new Date():d; }
function availH(){ return Math.max(2,(eatDate()-new Date())/3600000); }
function flour(){ return FLOURS.find(f=>f.id===ST.flourId); }
function method(){ return METHODS.find(m=>m.id===E().m); }
function methodDefaults(m){ if(m==='biga')return{prefFlourPct:70,prefHyd:45,prefHours:16,prefTemp:18}; if(m==='poolish')return{prefFlourPct:30,prefHyd:100,prefHours:12,prefTemp:18}; return {}; }
function E(){
  const o={m:ST.method,dur:ST.duration,ferm:ST.fermType,org:ST.organisation,prefFlourPct:ST.prefFlourPct,prefHyd:ST.prefHyd,prefHours:ST.prefHours,prefTemp:ST.prefTemp};
  if(ST.mode==='simple'){ const r=reco('auto'); o.m=r.m; o.dur=r.dur; o.ferm=r.ferm; o.org=r.org; Object.assign(o,methodDefaults(r.m)); }
  return o;
}
function hasPref(){ return ['biga','poolish','levain','pate_fermentee'].includes(E().m); }
function prefH(){ const ef=E(); return ef.m==='biga'||ef.m==='poolish'?ef.prefHours:ef.m==='levain'?8:1; }
function r5(v){ return Math.round(v*2)/2; }
function phases(){
  const ef=E(), D=Math.max(4,ef.dur);
  if(ef.ferm==='ambient'){ const ba=ef.org==='masse'?D*0.6:D*0.35; return {ba:r5(ba),bf:0,pf:0,pa:r5(D-ba)}; }
  const startAmb=ef.ferm==='fridge'?1:2, temper=ef.ferm==='fridge'?3:4;
  const R=Math.max(2,D-startAmb-temper);
  const bf=ef.org==='masse'?R*0.65:R*0.3;
  return {ba:startAmb,bf:r5(bf),pf:r5(R-bf),pa:temper};
}
function equivFinal(){ const p=phases(); return p.ba*rate(ST.tAmb)+p.bf*rate(ST.tFridge)+p.pf*rate(ST.tFridge)+p.pa*rate(ST.tAmb); }
function recipe(){
  const ef=E(), salt=ST.saltRaw/10, yk=YEASTS.find(y=>y.id===ST.yeastId), total=ST.count*ST.ballWeight;
  const noYeast=ef.m==='levain'||ef.m==='pate_fermentee';
  let prefYpct=0,yPctOnFlour=0;
  if(ef.m==='biga'||ef.m==='poolish'){
    const eqPref=Math.max(1,ef.prefHours*rate(ef.prefTemp));
    prefYpct=Math.min(1.2,Math.max(0.05,2.2/eqPref))*yk.f;
    yPctOnFlour=prefYpct*ef.prefFlourPct/100;
  } else if(!noYeast){
    yPctOnFlour=Math.min(1.5,Math.max(0.05,3.0/Math.max(1,equivFinal())))*yk.f;
  }
  const F=total/(1+ST.hydration/100+salt/100+yPctOnFlour/100);
  const W=F*ST.hydration/100, Sg=F*salt/100, Y=F*yPctOnFlour/100;
  const o={total,F,W,S:Sg,Y,salt,yPctOnFlour,prefYpct,noYeast};
  if(ef.m==='biga'||ef.m==='poolish'){
    o.pF=F*ef.prefFlourPct/100; o.pW=o.pF*ef.prefHyd/100; o.pY=o.pF*prefYpct/100;
    o.fF=F-o.pF; o.fW=W-o.pW; o.fS=Sg; o.fY=0;
  } else if(ef.m==='levain'){
    const lev=F*ST.levainPct/100; o.pF=lev/(1+ST.levainHyd/100); o.pW=lev-o.pF; o.pY=0; o.levWeight=lev;
    o.fF=F-o.pF; o.fW=W-o.pW; o.fS=Sg; o.fY=0;
  } else if(ef.m==='pate_fermentee'){
    const pw=total*ST.pfPct/100; o.pF=pw/(1+ST.hydration/100+salt/100); o.pW=o.pF*ST.hydration/100; o.pS=o.pF*salt/100; o.pfWeight=pw; o.pY=0;
    o.fF=F-o.pF; o.fW=W-o.pW; o.fS=Sg-o.pS; o.fY=0;
  }
  return o;
}
function reco(g0){
  const f=flour(), av=availH(), lvl=LEVELS.find(l=>l.id===ST.level), why=[];
  let m='direct',dur=24,ferm='mixte',org='masse';
  const gRaw=g0||ST.goal; const goal=gRaw==='auto'?(av>=40&&f.w>=270?'gout':'classique'):gRaw;
  if(av<11){ m='direct'; dur=Math.max(6,Math.floor(av-2)); ferm='ambient'; why.push('il te reste '+Math.round(av)+' h avant le service : seul un direct à température ambiante tient dans ce créneau'); }
  else if(goal==='rapide'){ m='direct'; dur=Math.min(12,Math.floor(av-2)); ferm='ambient'; why.push('objectif rapide : fermentation courte à '+ST.tAmb+' °C, sans passage au froid'); }
  else if((goal==='cornicione'||goal==='alveolage')&&f.w>=260&&av>=30&&lvl.max>=3){ m='biga'; dur=Math.min(30,Math.floor(av-18)); ferm='mixte'; org='masse'; why.push('objectif '+(goal==='cornicione'?'cornicione haut':'alvéolage ouvert')+' : la biga est la méthode qui pousse le bord le plus loin'); why.push('W '+f.wLabel+' — la farine encaisse une pré-fermentation longue'); }
  else if(goal==='extensible'&&av>=20){ m='poolish'; dur=Math.min(24,Math.floor(av-14)); ferm='mixte'; why.push("objectif extensibilité : le poolish détend la pâte et facilite l'étalage"); why.push('accessible dès le niveau intermédiaire, plus prévisible que la biga'); }
  else if(goal==='gout'&&av>=50&&f.w>=270){ m=lvl.max>=3?'biga':'direct'; dur=m==='biga'?30:Math.min(72,Math.floor(av-4)); ferm='mixte'; why.push('objectif goût : maturation longue au froid, la levure descend et les arômes montent'); why.push(lvl.max>=3?'niveau suffisant pour piloter un pré-ferment':'protocole gardé en direct pour rester lisible à ton niveau'); }
  else{ m='direct'; dur=f.w>=260?Math.min(48,Math.max(24,Math.floor(av-4))):Math.min(14,Math.floor(av-3)); ferm='mixte'; why.push('objectif classique : direct au froid, le meilleur rapport effort / régularité'); why.push('W '+f.wLabel+' → '+(f.w>=260?"jusqu'à 48 h de maturation sans risque":'fermentation courte, cette farine ne tient pas plus')); }
  if(ST.tAmb>=25) why.push('il fait '+ST.tAmb+' °C chez toi : la part au froid est augmentée pour éviter la surfermentation');
  if(lvl.max<3&&(m==='biga')) m='poolish';
  if(dur>f.ferm[1]){ dur=f.ferm[1]; why.push(f.brand+' '+f.name+' ne tient pas au-delà de '+f.ferm[1]+' h : la durée est plafonnée là'); }
  dur=Math.max(6,Math.min(96,dur));
  const mm=METHODS.find(x=>x.id===m);
  return {m,dur,ferm,org,why,title:mm.name+' — '+dur+' h',name:mm.name,
    line:mm.name+' · '+dur+' h de pâte finale · '+(ferm==='ambient'?'ambiante '+ST.tAmb+' °C':ferm==='fridge'?'réfrigérateur '+ST.tFridge+' °C':'mixte ambiante + froid')+' · fermentation en '+(org==='masse'?'masse puis pâtons':'pâtons')};
}
function applyReco(){ const r=reco(); Object.assign(ST,{method:r.m,duration:r.dur,fermType:r.ferm,organisation:r.org},methodDefaults(r.m)); }
function timelineData(){
  const p=phases(), ef=E(), Ed=eatDate(), m=60000, at=min=>new Date(Ed.getTime()-min*m);
  const oven=ST.ovenModel||'Ooni Koda 16', pre=PREHEAT[oven]||22;
  const outFridge=at(p.pa*60), boulage=new Date(outFridge.getTime()-p.pf*60*m);
  const knead=new Date(boulage.getTime()-(p.bf+p.ba)*60*m);
  const rows=[]; const rec=recipe();
  if(hasPref()){
    const prefStart=new Date(knead.getTime()-prefH()*60*m);
    if(ef.m==='biga'||ef.m==='poolish'){
      rows.push({d:new Date(prefStart.getTime()-15*m),label:'Préparer la '+(ef.m==='biga'?'biga':'poolish'),note:(ef.m==='biga'?'Farine, eau à 45 % et levure, mélange grossier sans pétrir.':'Farine, eau à poids égal et levure, fouet, couvrir.')+' '+Math.round(rec.pF)+' g de farine, '+Math.round(rec.pW)+" g d'eau.",dur:'15 min'});
      rows.push({d:prefStart,label:'Fermentation du pré-ferment',note:ef.prefHours+' h à '+ef.prefTemp+' °C. '+(ef.m==='biga'?'Prête quand elle sent le lactique et se déchire en filaments.':'Prêt quand la surface bulle et se creuse légèrement.'),dur:ef.prefHours+' h'});
    } else if(ef.m==='levain'){
      rows.push({d:prefStart,label:'Rafraîchir le levain',note:'Levain à '+ST.levainHyd+' % — '+Math.round(rec.levWeight||0)+' g nécessaires. À utiliser au pic, quand il a doublé.',dur:'8 h'});
    } else {
      rows.push({d:prefStart,label:'Sortir la pâte fermentée',note:Math.round(rec.pfWeight||0)+' g de pâte de la session précédente, tempérée 1 h avant le pétrissage.',dur:'1 h'});
    }
  }
  if(ST.autolyse) rows.push({d:new Date(knead.getTime()-ST.autolyseMin*m),label:'Autolyse',note:'Farine et eau seules, sans sel ni levure, '+ST.autolyseMin+' min à '+ST.tAmb+' °C.',dur:ST.autolyseMin+' min'});
  rows.push({d:new Date(knead.getTime()-25*m),label:'Pétrissage final',note:'Incorporation'+(hasPref()?' du pré-ferment, ':' ')+'du sel en fin de pétrissage. Pâte cible '+ST.doughTemp+' °C.',dur:'25 min'});
  rows.push({d:knead,label:'Fin du pétrissage — début de fermentation',note:'Pâte lisse, voile de gluten. Repos en masse '+p.ba+' h à '+ST.tAmb+' °C.',dur:p.ba+' h'});
  if(p.bf>0) rows.push({d:new Date(knead.getTime()+p.ba*60*m),label:'Masse au réfrigérateur',note:'Maturation au froid à '+ST.tFridge+' °C, contenant fermé et légèrement huilé.',dur:p.bf+' h'});
  rows.push({d:boulage,label:'Boulage',note:'Pâtons de '+ST.ballWeight+' g, tension régulière, soudure bien fermée dessous.',dur:'10 min'});
  if(p.pf>0) rows.push({d:boulage,label:'Pâtons au réfrigérateur',note:'Appret au froid en bac fariné, pâtons espacés.',dur:p.pf+' h'});
  rows.push({d:outFridge,label:p.pf>0?'Sortir les pâtons du réfrigérateur':'Appret des pâtons',note:p.pa+' h à '+ST.tAmb+' °C : les pâtons doivent devenir souples et bombés, pas gonflés.',dur:p.pa+' h'});
  rows.push({d:at(60),label:'Préparer les garnitures',note:'Mozzarella égouttée 30 min, tomates écrasées à la main, basilic lavé.',dur:'30 min'});
  rows.push({d:at(pre),label:'Préchauffer le four',note:oven+' à pleine puissance. Sole 430–480 °C au thermomètre infrarouge.',dur:pre+' min'});
  rows.push({d:Ed,label:'🍕 Première pizza',note:ST.count+' pizzas de '+ST.diameter+' cm, '+(BAKE[oven]||75)+' s chacune.',dur:'~'+Math.ceil(ST.count*2.5)+' min',hot:true});
  rows.sort((a,b)=>a.d-b.d);
  return rows.map(r=>({day:cap(dayFmt(r.d)),time:hmFmt(r.d),label:r.label,note:r.note,dur:r.dur,hot:!!r.hot,ts:r.d.getTime()}));
}
function n0(v){ return Math.round(v).toLocaleString('fr-FR'); }
function n1(v){ return v.toFixed(1).replace('.',','); }
function n2(v){ return v.toFixed(2).replace('.',','); }
function g(v){ return v<1?n2(v)+' g':v<10?n1(v)+' g':n0(v)+' g'; }
function dayFmt(d){ return d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'short'}); }
function hmFmt(d){ return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function starsFmt(nn){ return '★★★★★'.slice(0,nn)+'☆☆☆☆☆'.slice(0,5-nn); }
function fmtCd(ms){
  const past=ms<0; ms=Math.abs(ms);
  if(ms<60000) return past?"à l'instant":'maintenant';
  const h=Math.floor(ms/3600000), mn=Math.floor(ms%3600000/60000);
  const t=h>0?h+' h '+String(mn).padStart(2,'0'):mn+' min';
  return (past?'en retard de ':'dans ')+t;
}
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- notifications: delegates to Notify (see notify.js) ----------
   Notify picks native Capacitor local notifications when running as the
   Android app (works even app-closed/locked-phone), and falls back to the
   plain Web Notifications API (foreground/tab-open only) on a website. */
function clearNotifTimers(){ Notify.cancelAll(); }
function scheduleNotifications(){
  Notify.cancelAll();
  if(!ST.launched) return;
  Notify.scheduleAll(timelineData(), ST.doneSteps||[]);
}
function requestNotifPermission(){ Notify.requestPermission().then(scheduleNotifications); }

/* ---------- render ---------- */
const root=document.getElementById('app');

function flow(){ return ST.mode==='simple'?FLOW_SIMPLE:FLOW_CUSTOM; }
function idx(){ return Math.max(0,flow().indexOf(ST.stepId)); }

function chip(label,sel,action,arg){ return `<button class="chip ${sel?'sel':''}" data-click="${action}" data-val="${esc(arg)}">${esc(label)}</button>`; }

function render(){
  const s=ST, ef=E(), rec=recipe(), f=flour(), M=method(), p=phases(), tl=timelineData(), rc=reco();
  const fl=flow(), i=idx(), id=s.stepId, lvl=LEVELS.find(l=>l.id===s.level);
  const hasP=hasPref(), oven=s.ovenModel||'Ooni Koda 16';
  const av=availH();
  const negW=rec.fW<0||rec.fF<0;
  const flourFit=(x,h)=> h>=x.ferm[0]&&h<=x.ferm[1] ? 'green' : (h>=x.ferm[0]*0.8&&h<=x.ferm[1]*1.2 ? 'amber' : 'red');
  const fitOfCurrent=flourFit(f,ef.dur);
  const recapWarn = negW || fitOfCurrent==='red';

  let html='';
  html+=`<div id="topbar">
    <div class="brand">PIZZA<span>ASSISTANT</span></div>
    <div class="mode-label">${s.launched?'Session lancée':(s.mode==='simple'?'Mode simple':s.mode==='custom'?'Moteur de protocoles':'Nouvelle pizza')}</div>
    <div class="step-counter">
      ${(!s.launched && id!=='start') ? `<button class="panel-toggle" data-click="toggleLivePanel">${livePanelOn?'Masquer le résumé':'Afficher le résumé'}</button>` : ''}
      <span>${s.launched?'Terminé':(id==='start'?'Départ':'Écran '+(i+1)+' / '+fl.length)}</span>
    </div>
  </div>`;

  html+=`<div id="progressbar">${Array.from({length:fl.length},(_,k)=>`<div class="pbar-cell ${(k<=i||s.launched)?'done':''}"></div>`).join('')}</div>`;

  html+=`<div id="layout">`;
  html+=`<div id="main">`;

  if(!s.launched && id==='start') html+=screenStart(lvl);
  if(!s.launched && id==='simple') html+=screenSimple(rc);
  if(!s.launched && id==='quantite') html+=screenQuantite();
  if(!s.launched && id==='quand') html+=screenQuand(tl);
  if(!s.launched && id==='format') html+=screenFormat();
  if(!s.launched && id==='paton') html+=screenPaton(rec);
  if(!s.launched && id==='farine') html+=screenFarine(ef,flourFit);
  if(!s.launched && id==='objectif') html+=screenObjectif();
  if(!s.launched && id==='methode') html+=screenMethode(rc,ef,M,lvl,av);
  if(!s.launched && id==='fermentation') html+=screenFermentation(ef,p,hasP,rec);
  if(!s.launched && id==='recette') html+=screenRecette(ef,rec,f,hasP,M,p);
  if(!s.launched && id==='recap') html+=screenRecap(ef,rec,f,M,tl,hasP,recapWarn,fitOfCurrent,oven,s);
  if(s.launched) html+=screenDashboard(tl,rec,M,s);

  html+=`</div>`; // #main

  if(livePanelOn && !s.launched && id!=='start') html+=panel(ef,rec,f,M,fitOfCurrent,negW);

  html+=`</div>`; // #layout

  if(!s.launched){
    const canBack=i>0, canNext=i<fl.length-1;
    const nextLabel = fl[i+1]==='recap' ? 'Voir mon protocole' : 'Continuer';
    const footHint={start:"Deux façons d'y aller : rapide ou pilotée",simple:'Le coach choisit le protocole',quantite:'Compte 1,5 pizza par adulte',quand:'Le planning se calcule depuis cette heure',format:'30 cm = napolitaine classique',paton:'Le pâton fait le cornicione',farine:'Le W doit tenir la durée choisie',objectif:'C’est cette réponse qui pilote le moteur',methode:'Méthode ≠ durée',fermentation:'Le froid ralentit, il ne stoppe pas',recette:'Levure = estimation, pas dogme',recap:'Vérifie ton planning avant de lancer'}[id]||'';
    html+=`<div id="actionbar">
      ${canBack?`<button class="btn actionbar-back" data-click="prev">← Retour</button>`:''}
      <div class="foot-hint">${esc(footHint)}</div>
      ${canNext?`<div class="actionbar-next"><button class="btn btn-primary" data-click="next">${esc(nextLabel)} <span style="margin-left:10px">→</span></button></div>`:''}
    </div>`;
  }

  root.innerHTML=html;
}

/* ---------- screens ---------- */
function screenStart(lvl){
  return `<div class="screen">
    <div class="eyebrow">Nouvelle session</div>
    <h1 class="title">Le coach fait la méthode.<br>Toi, tu fais la pizza.</h1>
    <p class="lede">Le moteur de protocoles combine une méthode de pâte, un régime de fermentation, une organisation et une durée, puis en déduit les quantités et l'heure de chaque geste.</p>
    <div class="choice-row">
      <button class="choice-card primary" data-click="goSimple">
        <div class="ct">Je veux juste faire des pizzas</div>
        <div class="cd">Quatre réponses : combien, quand, quelle température, quelle farine. Le coach choisit le protocole, l'hydratation, la levure et le planning.</div>
        <div class="cg">2 écrans · recommandé</div>
      </button>
      <button class="choice-card" data-click="goCustom">
        <div class="ct">Je pilote la méthode</div>
        <div class="cd">Direct, biga, poolish, levain ou pâte fermentée. Tu règles les phases, les températures, les pourcentages du pré-ferment.</div>
        <div class="cg">10 écrans · mode avancé dispo</div>
      </button>
    </div>
    <div class="box" style="margin-top:22px">
      <div class="box-label">Ton niveau — le coach n'ira pas plus loin que ça sans te le dire</div>
      <div class="chips">${LEVELS.map(l=>chip(l.label,ST.level===l.id,'setLevel',l.id)).join('')}</div>
    </div>
  </div>`;
}

function screenSimple(rc){
  return `<div class="screen med">
    <div class="eyebrow">Mode simple</div>
    <h1 class="title mid">Quatre réponses</h1>
    <p class="lede tight">Le reste, le coach s'en occupe : méthode, hydratation, levure, planning.</p>
    <div class="stepper">
      <button class="stepper-btn" data-click="dec" data-key="count" data-min="1" data-max="20">−</button>
      <div><div class="stepper-num" data-shownum="count">${ST.count}</div><div class="stepper-unit">pizzas</div></div>
      <button class="stepper-btn plus" data-click="inc" data-key="count" data-min="1" data-max="20">+</button>
    </div>
    <div class="field-row" style="margin-top:12px">
      <div class="field"><label>Repas — date</label><input type="date" value="${ST.dateStr}" data-bind="dateStr"></div>
      <div class="field narrow"><label>Heure</label><input type="time" value="${ST.timeStr}" data-bind="timeStr"></div>
    </div>
    <div class="slider-block">
      <div class="slider-head"><span>Température chez toi</span><b data-shownum="tAmb">${ST.tAmb} °C</b></div>
      <input type="range" min="14" max="30" step="1" value="${ST.tAmb}" data-bind="tAmb" data-fmt="tempC">
    </div>
    <div style="margin-top:12px">
      <div class="box-label">Farine disponible</div>
      <div class="chips">${FLOURS.map(x=>chip(x.brand+' '+x.name,ST.flourId===x.id,'setFlour',x.id)).join('')}</div>
    </div>
    <div class="box dark" style="margin-top:20px;padding:18px">
      <div class="box-label">✨ Le coach s'occupe du reste</div>
      <div style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-top:6px">${esc(rc.title)}</div>
      <div style="font-size:14px;color:var(--on-dark-70);margin-top:6px">${esc(rc.line)}</div>
    </div>
  </div>`;
}

function screenQuantite(){
  return `<div class="screen narrow">
    <div class="eyebrow">${KICK.quantite} — Quantité</div>
    <h1 class="title mid">Combien de pizzas ?</h1>
    <p class="lede tight">Une pizzaiola napolitaine sort une pizza toutes les 2 à 3 minutes. Compte 1,5 pizza par adulte gourmand.</p>
    <div class="stepper lg">
      <button class="stepper-btn lg" data-click="dec" data-key="count" data-min="1" data-max="20">−</button>
      <div><div class="stepper-num lg" data-shownum="count">${ST.count}</div><div class="stepper-unit">pizzas</div></div>
      <button class="stepper-btn lg plus" data-click="inc" data-key="count" data-min="1" data-max="20">+</button>
      <div style="margin-left:auto;text-align:right;font-size:12px;color:var(--ink-60);line-height:1.4">Service estimé<div style="font-size:20px;font-weight:800;color:var(--ink)" data-shownum="serviceMin">${Math.ceil(ST.count*2.5)} min</div></div>
    </div>
    <div class="chips" style="margin-top:14px">${[2,4,6,8].map(n=>chip(n+' pizzas',ST.count===n,'setCount',n)).join('')}</div>
  </div>`;
}

function screenQuand(tl){
  return `<div class="screen narrow">
    <div class="eyebrow">${KICK.quand} — Objectif</div>
    <h1 class="title mid">Quand veux-tu manger ?</h1>
    <p class="lede tight">Tout le planning se calcule à l'envers depuis cette heure. Tu peux la changer plus tard, les étapes suivront.</p>
    <div class="field-row">
      <div class="field" style="flex:1 1 200px"><label>Date</label><input type="date" value="${ST.dateStr}" data-bind="dateStr"></div>
      <div class="field narrow" style="flex:0 1 140px"><label>Heure</label><input type="time" value="${ST.timeStr}" data-bind="timeStr"></div>
    </div>
    <div class="chips" style="margin-top:14px">
      <button class="chip" data-click="setWhen" data-val="0">Ce soir 20:00</button>
      <button class="chip" data-click="setWhen" data-val="1">Demain 20:00</button>
      <button class="chip" data-click="setWhen" data-val="-1">Samedi 20:00</button>
    </div>
    <div class="box tint" style="margin-top:22px;padding:16px">
      <div class="box-label" style="color:var(--ink-55)">Service</div>
      <div style="font-size:22px;font-weight:800;letter-spacing:-.01em">${esc(cap(eatDate().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})))} — ${hmFmt(eatDate())}</div>
      <div style="font-size:13px;color:var(--ink-60);margin-top:4px">Premier geste : ${esc(tl[0].label.toLowerCase())}, ${esc(tl[0].day.toLowerCase())} à ${tl[0].time}.</div>
    </div>
  </div>`;
}

function screenFormat(){
  const styleNote={napoletana:"Cornicione gonflé, centre fin et souple, cuisson très courte à 450 °C. Le style pour lequel cet assistant est réglé.",moderne:"Même base, hydratation plus haute et alvéolage plus ouvert. Prévois 67–72 % d'eau.",romaine:"Pâte fine et croustillante, plus d'huile, cuisson plus longue et plus douce.",ny:"Pâton plus lourd, un peu d'huile et de sucre, four autour de 300 °C."}[ST.styleId];
  return `<div class="screen narrow">
    <div class="eyebrow">${KICK.format} — Format</div>
    <h1 class="title mid">Quel diamètre ?</h1>
    <p class="lede tight">La napolitaine classique se sert en 30 cm. Au-delà de 32 cm, l'enfournement devient délicat sur une pelle de 12 pouces.</p>
    <div class="diam-grid">${[{v:28,n:'compacte'},{v:30,n:'classique'},{v:32,n:'généreuse'},{v:34,n:'expert'}].map(d=>`<button class="diam-card ${ST.diameter===d.v?'sel':''}" data-click="setDiam" data-val="${d.v}"><div class="dv">${d.v} cm</div><div class="dn">${d.n}</div></button>`).join('')}</div>
    <div class="box" style="margin-top:22px">
      <div class="box-label">Style de pizza</div>
      <div class="chips">${[{id:'napoletana',l:'Napoletana'},{id:'moderne',l:'Napoletana moderne'},{id:'romaine',l:'Romaine'},{id:'ny',l:'New York'}].map(x=>chip(x.l,ST.styleId===x.id,'setStyle',x.id)).join('')}</div>
      <div style="font-size:13px;color:var(--ink-65);margin-top:12px">${esc(styleNote)}</div>
    </div>
  </div>`;
}

function screenPaton(rec){
  const ballReco=ST.diameter<=28?[230,260]:ST.diameter<=30?[250,280]:[280,320];
  const advice=ST.ballWeight<ballReco[0]?'un peu léger pour '+ST.diameter+' cm':ST.ballWeight>ballReco[1]?'généreux — cornicione épais':'dans la fourchette';
  return `<div class="screen narrow">
    <div class="eyebrow">${KICK.paton} — Pâtons</div>
    <h1 class="title mid">Poids d'un pâton</h1>
    <p class="lede tight">Le poids commande l'épaisseur du cornicione. Pour ${ST.diameter} cm, la fourchette napolitaine est ${ballReco[0]}–${ballReco[1]} g.</p>
    <div class="box pad20">
      <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
        <div class="stepper-num lg" data-shownum="ballWeight">${ST.ballWeight}</div><div style="font-size:16px;color:var(--ink-60)">g / pâton</div>
        <div style="margin-left:auto;text-align:right"><div class="box-label" style="margin:0">Pâte totale</div><div style="font-size:22px;font-weight:800" data-shownum="totalDough">${n0(rec.total)} g</div></div>
      </div>
      <input type="range" min="180" max="360" step="5" value="${ST.ballWeight}" data-bind="ballWeight" style="margin-top:16px">
      <div class="slider-minmax"><span>180 g</span><span data-shownum="ballAdvice">${esc(advice)}</span><span>360 g</span></div>
    </div>
  </div>`;
}

function screenFarine(ef,flourFit){
  return `<div class="screen wide">
    <div class="eyebrow">${KICK.farine} — Farine</div>
    <h1 class="title mid">Quelle farine ?</h1>
    <p class="lede tight">Le W mesure la force de la farine : c'est lui qui dit combien de temps la pâte peut fermenter sans s'affaisser. L'indicateur compare la farine à ta durée actuelle (${ef.dur} h).</p>
    <div class="flour-list">
      ${FLOURS.map(x=>{
        const fit=flourFit(x,ef.dur);
        const verdict={green:'très adaptée à '+ef.dur+' h',amber:'adaptée, surveille la pâte',red:ef.dur>x.ferm[1]?'trop faible pour '+ef.dur+' h':'gâchée sur '+ef.dur+' h seulement'}[fit];
        const sel=ST.flourId===x.id;
        return `<button class="opt-card" data-click="setFlour" data-val="${x.id}">
          ${sel?`<div class="opt-tag"><div class="sq"></div><div class="tt">Sélectionnée</div></div>`:''}
          <div class="flour-row">
            <span class="dot ${fit}"></span>
            <div class="flour-name">${esc(x.name)}</div>
            <div class="flour-brand">${esc(x.brand)}</div>
            <div class="flour-w">W ${x.wLabel}</div>
          </div>
          <div class="flour-note">Hydratation conseillée ${x.hyd[0]}–${x.hyd[1]} % · fermentation ${esc(x.fermLabel)} · ${esc(verdict)}</div>
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

function screenObjectif(){
  return `<div class="screen wide">
    <div class="eyebrow">${KICK.objectif} — Résultat visé</div>
    <h1 class="title mid">Quel résultat recherches-tu ?</h1>
    <p class="lede tight">C'est cette réponse qui orientera le moteur : la même farine ne se travaille pas pareil selon qu'on cherche un cornicione spectaculaire ou une pâte fine et nette.</p>
    <div class="goal-list">
      ${GOALS.map(gg=>`<button class="goal-card" data-click="setGoal" data-val="${gg.id}">
        <div class="goal-emoji">${gg.emoji}</div>
        <div class="goal-body"><div class="goal-title">${esc(gg.label)}</div><div class="goal-note">${esc(gg.note)}</div></div>
        ${ST.goal===gg.id?`<div class="goal-chosen">Choisi</div>`:''}
      </button>`).join('')}
    </div>
  </div>`;
}

function screenMethode(rc,ef,M,lvl,av){
  const fitScore=m=>{ const goal=ST.goal, st=m.stars; let sc=st.gout+st.alv+st.ext+st.ctrl;
    if(goal==='cornicione'||goal==='alveolage') sc=st.alv*3+st.gout;
    if(goal==='extensible') sc=st.ext*3+st.ctrl;
    if(goal==='gout') sc=st.gout*3+st.alv;
    if(goal==='rapide') sc=st.ctrl*3-m.minH/10;
    if(goal==='classique') sc=st.ctrl*2+st.gout+st.alv;
    return sc; };
  const best=[...METHODS].sort((a,b)=>fitScore(b)-fitScore(a))[0];
  let out=`<div class="screen widest">
    <div class="eyebrow">${KICK.methode} — Moteur de protocoles</div>
    <h1 class="title mid">Quelle méthode de pâte ?</h1>
    <p class="lede tight">Une méthode, ce n'est pas une durée : c'est la façon dont la farine rencontre l'eau et la levure. Le reste des réglages suit à l'écran suivant.</p>
    <button class="reco-card" data-click="applyReco">
      <div class="reco-kick">✨ Recommandé pour moi</div>
      <div class="reco-title">${esc(rc.title)}</div>
      <div class="reco-line">${esc(rc.line)}</div>
      <div class="reco-why">${rc.why.map(t=>`<div>— ${esc(t)}</div>`).join('')}</div>
      <div class="reco-cta">Appliquer ce protocole →</div>
    </button>
    <div class="method-list">`;
  METHODS.forEach(m=>{
    const tooHard=lvl.max<m.dl, tooShort=av<m.minH+4;
    const sel=ef.m===m.id;
    out+=`<button class="opt-card" data-click="setMethod" data-val="${m.id}">
      ${sel?`<div class="opt-tag"><div class="sq"></div><div class="tt">Méthode retenue</div></div>`:''}
      <div class="method-head">
        <div class="method-emoji">${m.emoji}</div>
        <div class="method-name">${esc(m.name)}</div>
        <div class="diff-badge diff-${m.dl}">${esc(m.diff)}</div>
        <div class="fit-label">${m.id===best.id?'meilleur pour ton objectif':''}</div>
      </div>
      <div class="method-desc">${esc(m.desc)}</div>
      ${(tooHard||tooShort)?`<div class="method-warn">⚠ ${tooShort?('il te reste '+Math.round(av)+' h : trop court pour cette méthode'):('niveau '+m.diff.toLowerCase()+" — tu peux le choisir, mais le coach t'accompagnera pas à pas")}</div>`:''}
    </button>`;
  });
  out+=`</div>
    <div class="box" style="margin-top:14px;padding:18px">
      <div class="box-label" style="color:var(--accent)">${esc(M.name)} — c'est quoi, au fond ?</div>
      <div style="font-size:14px;line-height:1.6">${esc(M.what)}</div>
      <div style="font-size:14px;line-height:1.6;margin-top:8px;color:var(--ink-75, var(--ink-70))"><strong>Pourquoi l'utiliser :</strong> ${esc(M.why)}</div>
    </div>
    <button class="btn" style="margin-top:12px" data-click="toggleCompare">${ST.compare?'Masquer le comparateur':'Comparer les méthodes'}</button>`;
  if(ST.compare){
    const rows=[{k:'Difficulté',get:m=>m.diff},{k:'Temps minimum',get:m=>m.minH+' h'},{k:'Goût',get:m=>starsFmt(m.stars.gout)},{k:'Alvéolage',get:m=>starsFmt(m.stars.alv)},{k:'Extensibilité',get:m=>starsFmt(m.stars.ext)},{k:'Contrôle',get:m=>starsFmt(m.stars.ctrl)}];
    out+=`<div class="table-wrap"><table class="compare"><thead><tr><th>Critère</th>${METHODS.map(m=>`<th>${esc(m.name)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map(row=>`<tr><td>${esc(row.k)}</td>${METHODS.map(m=>`<td>${esc(row.get(m))}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>
    <div class="warn-box"><p><span style="text-transform:uppercase;letter-spacing:.1em;font-size:11px;display:block;margin-bottom:4px">Recommandation : ${esc(best.name.toUpperCase())}</span>Pour « ${esc(GOALS.find(gg=>gg.id===ST.goal).label.toLowerCase())} » avec ${esc(f_brand_name())} et ${Math.round(av)} h devant toi, c'est cette méthode qui colle le mieux.</p></div>`;
  }
  out+=`</div>`;
  return out;
  function f_brand_name(){ const ff=flour(); return ff.brand+' '+ff.name; }
}

function screenFermentation(ef,p,hasP,rec){
  const M=method();
  let out=`<div class="screen wider">
    <div class="eyebrow">${KICK.fermentation} — Fermentation</div>
    <h1 class="title mid">Comment ça fermente ?</h1>
    <p class="lede tight">Trois réglages : où la pâte fermente, si elle fermente en masse ou en pâtons, et combien de temps au total.</p>
    <div class="two-col">
      <div class="box">
        <div class="box-label">Régime</div>
        <div class="chips">${[{id:'ambient',l:'Ambiante'},{id:'fridge',l:'Réfrigérateur'},{id:'mixte',l:'Mixte'}].map(o=>chip(o.l,ef.ferm===o.id,'setFerm',o.id)).join('')}</div>
      </div>
      <div class="box">
        <div class="box-label">Organisation</div>
        <div class="chips">${[{id:'masse',l:'En masse puis pâtons'},{id:'patons',l:'Surtout en pâtons'}].map(o=>chip(o.l,ef.org===o.id,'setOrg',o.id)).join('')}</div>
      </div>
    </div>
    <div class="box" style="margin-top:12px">
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><div class="box-label" style="margin:0">Durée de la pâte finale</div><div style="margin-left:auto;font-size:26px;font-weight:800;letter-spacing:-.02em" data-shownum="duration">${ef.dur} h</div></div>
      <div class="chips" style="margin-top:10px">${[8,12,24,48,72].map(h=>chip(h+' h',ef.dur===h,'setDuration',h)).join('')}</div>
      <input type="range" min="6" max="96" step="1" value="${ef.dur}" data-bind="duration" style="margin-top:12px">
      <div class="phase-badges">
        ${p.ba>0?`<div class="pb amb">Masse ${p.ba} h ambiante</div>`:''}
        ${p.bf>0?`<div class="pb cold">Masse ${p.bf} h froid</div>`:''}
        ${p.pf>0?`<div class="pb coldlight">Pâtons ${p.pf} h froid</div>`:''}
        ${p.pa>0?`<div class="pb warm">Pâtons ${p.pa} h ambiante</div>`:''}
      </div>
    </div>
    <div class="two-col" style="margin-top:12px">
      <div class="box"><div class="slider-head"><span>Température ambiante</span><b data-shownum="tAmb">${ST.tAmb} °C</b></div><input type="range" min="14" max="30" step="1" value="${ST.tAmb}" data-bind="tAmb"></div>
      <div class="box"><div class="slider-head"><span>Température du frigo</span><b data-shownum="tFridge">${ST.tFridge} °C</b></div><input type="range" min="2" max="10" step="1" value="${ST.tFridge}" data-bind="tFridge"></div>
    </div>
    <div class="box" style="margin-top:12px">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div style="flex:1 1 240px"><div style="font-size:15px;font-weight:800">🟤 Autolyse avant pétrissage</div><div style="font-size:12px;color:var(--ink-65)">Farine et eau seules d'abord : le gluten se forme sans effort, la pâte devient plus extensible.</div></div>
        <button class="chip ${ST.autolyse?'sel':''}" data-click="toggleAutolyse">${ST.autolyse?'Activée':'Désactivée'}</button>
      </div>
      ${ST.autolyse?`<div style="margin-top:12px"><div class="slider-head"><span>Durée d'autolyse</span><b data-shownum="autolyseMin">${ST.autolyseMin} min</b></div><input type="range" min="20" max="240" step="10" value="${ST.autolyseMin}" data-bind="autolyseMin"></div>`:''}
    </div>`;
  if(hasP){
    const sliders = (ef.m==='biga'||ef.m==='poolish') ? [
      {key:'prefFlourPct',label:'Part de la farine en pré-ferment',display:ef.prefFlourPct+' %',min:10,max:100,step:5,value:ef.prefFlourPct},
      {key:'prefHyd',label:'Hydratation du pré-ferment',display:ef.prefHyd+' %',min:40,max:110,step:5,value:ef.prefHyd},
      {key:'prefHours',label:'Durée de fermentation du pré-ferment',display:ef.prefHours+' h',min:6,max:36,step:1,value:ef.prefHours},
      {key:'prefTemp',label:'Température du pré-ferment',display:ef.prefTemp+' °C',min:4,max:26,step:1,value:ef.prefTemp}
    ] : ef.m==='levain' ? [
      {key:'levainPct',label:'Levain sur le poids de farine',display:ST.levainPct+' %',min:5,max:35,step:1,value:ST.levainPct},
      {key:'levainHyd',label:'Hydratation du levain',display:ST.levainHyd+' %',min:50,max:125,step:5,value:ST.levainHyd}
    ] : [
      {key:'pfPct',label:'Pâte fermentée sur le poids total',display:ST.pfPct+' %',min:5,max:35,step:1,value:ST.pfPct}
    ];
    const note=(ef.m==='biga'||ef.m==='poolish')?`Le moteur retire cette farine et cette eau du pétrissage final : ${g(rec.pF)} de farine et ${g(rec.pW)} partent dans le pré-ferment, ${g(rec.fF)} et ${g(rec.fW)} restent pour la pâte finale. La levure est calculée sur la durée et la température du pré-ferment, pas sur la fermentation finale.`
      : ef.m==='levain' ? `Le levain apporte ${g(rec.pF)} de farine et ${g(rec.pW)} d'eau : les deux sont déduits du pétrissage final, l'hydratation affichée reste celle de la pâte totale. Aucune levure ajoutée.`
      : `La pâte fermentée apporte déjà farine, eau et sel : ${g(rec.pF)}, ${g(rec.pW)} et ${g(rec.pS||0)} sont déduits du pétrissage final.`;
    out+=`<div class="pref-block">
      <div class="pref-title">Pré-ferment — ${esc(M.name)}</div>
      <div class="pref-sliders">
        ${sliders.map(s=>`<div><div class="slider-head"><span>${esc(s.label)}</span><b data-shownum="${s.key}">${esc(s.display)}</b></div><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.value}" data-bind="${s.key}"></div>`).join('')}
      </div>
      <div class="pref-note">${esc(note)}</div>
    </div>`;
  }
  out+=`</div>`;
  return out;
}

function screenRecette(ef,rec,f,hasP,M,p){
  const salt=rec.salt, hydIn=ST.hydration>=f.hyd[0]&&ST.hydration<=f.hyd[1];
  const yk=YEASTS.find(y=>y.id===ST.yeastId);
  const hydVerdict = hydIn ? `Dans la plage de ${f.name}. Pâte maniable.` : (ST.hydration>f.hyd[1] ? `Au-dessus de ${f.name} : pâte collante, travaille les mains humides.` : `En dessous : pâte ferme, cornicione plus serré.`);
  const saltNote = salt<2.5 ? 'Peu salé : fermentation plus rapide, goût plus plat.' : salt>3.2 ? 'Très salé : freine la levure, prolonge la fermentation.' : 'Standard napolitain (2,5–3 %).';
  const waterTemp = Math.max(2,Math.min(40,Math.round(ST.doughTemp*3-ST.tAmb*2-6)));
  const yeastGrams = rec.noYeast ? '0' : n2(hasP?rec.pY:rec.Y);
  const yeastWhy = rec.noYeast
    ? `Cette méthode ne prend pas de levure industrielle : le ferment (${M.name.toLowerCase()}) apporte sa propre population. La vitesse dépend de son activité — allonge ou raccourcis la fermentation en lisant la pâte, pas la montre.`
    : hasP ? `Estimation : ${ef.prefHours} h à ${ef.prefTemp} °C dans le pré-ferment équivalent à environ ${Math.round(ef.prefHours*rate(ef.prefTemp))} h à 20 °C. À cette échéance il faut ${n2(rec.prefYpct)} % de levure ${yk.label.toLowerCase()} sur la farine du pré-ferment, soit ${g(rec.pY)}. Le pétrissage final n'en reçoit pas : le pré-ferment est déjà actif.`
    : `Estimation : ${ef.dur} h dont ${p.bf+p.pf} h à ${ST.tFridge} °C équivalent à environ ${Math.round(equivFinal())} h à 20 °C. À cette échéance il faut ${n2(rec.yPctOnFlour)} % de levure ${yk.label.toLowerCase()} sur le poids de farine, soit ${g(rec.Y)}. Une pièce plus chaude, une farine plus faible ou une levure plus vieille changent le résultat : un pâton prêt est bombé, souple et légèrement gonflé.`;
  let out=`<div class="screen wider">
    <div class="eyebrow">${KICK.recette} — Recette</div>
    <h1 class="title mid">Hydratation &amp; levure</h1>
    <p class="lede tight">L'hydratation, c'est le poids d'eau par rapport à la farine. Plus il est élevé, plus la pâte est légère et alvéolée — et plus elle colle.</p>
    <div class="box pad20">
      <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
        <div style="font-size:clamp(40px,6vw,56px);font-weight:800;line-height:1;letter-spacing:-.03em" data-shownum="hydration">${ST.hydration} %</div>
        <div style="margin-left:auto;font-size:13px;color:var(--ink-65);text-align:right;max-width:34ch" data-shownum-hint="hydVerdict">${esc(hydVerdict)}</div>
      </div>
      <input type="range" min="55" max="80" step="1" value="${ST.hydration}" data-bind="hydration" style="margin-top:14px">
      <div class="slider-minmax"><span>55 % — facile</span><span>conseillé ${f.hyd[0]}–${f.hyd[1]} %</span><span>80 % — expert</span></div>
    </div>
    <div class="two-col" style="margin-top:12px">
      <div class="box">
        <div class="box-label">Sel — <b data-shownum="saltPct">${n1(salt)}</b> % de la farine</div>
        <input type="range" min="20" max="35" step="1" value="${ST.saltRaw}" data-bind="saltRaw">
        <div style="font-size:12px;color:var(--ink-60)" data-shownum-hint="saltNote">${esc(saltNote)}</div>
      </div>
      <div class="box">
        <div class="box-label">${rec.noYeast?'Ferment — pas de levure industrielle':'Levure disponible'}</div>
        <div class="chips">${YEASTS.map(y=>chip(y.label,ST.yeastId===y.id,'setYeast',y.id)).join('')}</div>
        <div style="font-size:12px;color:var(--ink-60);margin-top:8px">${rec.noYeast?"Cette méthode se passe de levure : c'est le ferment qui travaille. Le choix ci-dessus ne sert qu'aux protocoles levurés.":'Conversion automatique : fraîche = 1, sèche active = 0,4, instantanée = 0,33.'}</div>
      </div>
    </div>
    <button class="btn" style="margin-top:12px" data-click="toggleExpert">${ST.expert?'Masquer le mode avancé':'Mode avancé'}</button>`;
  if(ST.expert){
    const rows=[{label:'Hydratation',value:ST.hydration+' %'},{label:'Sel',value:n1(salt)+' %'},{label:'Levure',value:rec.noYeast?'—':n2(rec.yPctOnFlour)+' %'},{label:'W farine',value:f.wLabel},{label:'Méthode',value:M.name},{label:hasP?'Part pré-ferment':'Pré-ferment',value:hasP?(ef.m==='levain'?ST.levainPct+' %':ef.m==='pate_fermentee'?ST.pfPct+' %':ef.prefFlourPct+' %'):'aucun'},{label:'Hydratation pré-ferment',value:hasP?(ef.m==='levain'?ST.levainHyd+' %':ef.m==='pate_fermentee'?ST.hydration+' %':ef.prefHyd+' %'):'—'},{label:'Fermentation pré-ferment',value:hasP?prefH()+' h':'—'},{label:'Fermentation finale',value:ef.dur+' h'},{label:'Ambiante',value:ST.tAmb+' °C'},{label:'Frigo',value:ST.tFridge+' °C'},{label:'Pâte cible',value:ST.doughTemp+' °C'}];
    out+=`<div class="box" style="margin-top:12px">
      <div class="box-label">Mode avancé — tous les paramètres</div>
      <div class="grid-tiles">${rows.map(r=>`<div class="tile"><div class="tile-label">${esc(r.label)}</div><div class="tile-value">${esc(r.value)}</div></div>`).join('')}</div>
      <div style="margin-top:12px"><div class="slider-head"><span>Température de pâte cible en fin de pétrissage</span><b data-shownum="doughTemp">${ST.doughTemp} °C</b></div><input type="range" min="20" max="28" step="1" value="${ST.doughTemp}" data-bind="doughTemp"></div>
      <div style="font-size:12px;color:var(--ink-60);margin-top:4px">Eau de coulage conseillée : <span data-shownum-hint="waterTemp">${waterTemp}</span> °C (règle des températures, farine à ${ST.tAmb} °C).</div>
    </div>`;
  }
  out+=`<div class="warn-box"><p><span style="text-transform:uppercase;letter-spacing:.1em;font-size:11px;display:block;margin-bottom:4px">Levure recommandée : ${esc(yeastGrams)} g</span>${esc(yeastWhy)}</p></div>
  </div>`;
  return out;
}

function screenRecap(ef,rec,f,M,tl,hasP,recapWarn,fitOfCurrent,oven,s){
  const yk=YEASTS.find(y=>y.id===ST.yeastId);
  const ing = hasP ? (ef.m==='levain' ? [
      {label:'Levain',value:g(rec.levWeight||0),note:ST.levainHyd+' % hydratation'},
      {label:'dont farine',value:g(rec.pF),note:'déduite du total'},
      {label:'dont eau',value:g(rec.pW),note:'déduite du total'},
      {label:'Rafraîchi',value:'8 h avant',note:'à utiliser au pic'}]
    : ef.m==='pate_fermentee' ? [
      {label:'Pâte fermentée',value:g(rec.pfWeight||0),note:ST.pfPct+' % du poids total'},
      {label:'dont farine',value:g(rec.pF),note:'déduite du total'},
      {label:'dont eau',value:g(rec.pW),note:'déduite du total'},
      {label:'dont sel',value:g(rec.pS||0),note:'déduit du total'}]
    : [
      {label:'Farine',value:g(rec.pF),note:ef.prefFlourPct+' % de la farine'},
      {label:'Eau',value:g(rec.pW),note:ef.prefHyd+' % hydratation'},
      {label:'Levure',value:g(rec.pY),note:n2(rec.prefYpct)+' % · '+yk.label.toLowerCase()},
      {label:'Fermentation',value:ef.prefHours+' h',note:'à '+ef.prefTemp+' °C'}])
    : [
      {label:'Farine',value:g(rec.F),note:f.brand+' '+f.name},
      {label:'Eau',value:g(rec.W),note:ST.hydration+' % · 18–20 °C'},
      {label:'Sel',value:g(rec.S),note:n1(rec.salt)+' % de la farine'},
      {label:'Levure',value:rec.noYeast?'—':g(rec.Y),note:rec.noYeast?'aucune levure ajoutée':yk.label.toLowerCase()}];
  const finalMix=[{label:'Farine',value:g(Math.max(0,rec.fF)),note:'le reste du sac'},{label:'Eau',value:g(Math.max(0,rec.fW)),note:'hydratation finale '+ST.hydration+' %'},{label:'Sel',value:g(Math.max(0,rec.fS!==undefined?rec.fS:rec.S)),note:n1(rec.salt)+' % de la farine'},{label:'Levure ajoutée',value:'—',note:'le pré-ferment suffit'}];
  const protocolTitle = M.name+' — '+ef.dur+' h'+(hasP&&(ef.m==='biga'||ef.m==='poolish')?' + '+ef.prefHours+' h de pré-ferment':'');
  const recapLine = ST.count+' pizzas · '+ST.diameter+' cm · '+ST.ballWeight+' g/pâton · '+ST.hydration+' % hydratation · '+(ef.ferm==='ambient'?'ambiante':ef.ferm==='fridge'?'froid':'mixte')+' · '+f.brand+' '+f.name;
  const totalSpan = (ef.dur+(hasP?prefH():0))+' h du premier geste au service';
  const recapWarnText = (rec.fW<0||rec.fF<0) ? "Ton pré-ferment demande plus d'eau ou de farine que la recette totale. Baisse sa part ou son hydratation." : f.brand+' '+f.name+' (W '+f.wLabel+") n'est pas taillée pour "+ef.dur+' h de fermentation : change de farine ou raccourcis la durée.';

  let out=`<div class="screen recap">
    <div class="eyebrow">${KICK.recap} — Ton protocole</div>
    <h1 class="title">${esc(protocolTitle)}</h1>
    <div style="font-size:15px;color:var(--ink-60);margin-bottom:18px">${esc(recapLine)}</div>
    <div class="box-label">${hasP?(ef.m==='biga'?'La biga — à préparer en premier':ef.m==='poolish'?'Le poolish — à préparer en premier':ef.m==='levain'?'Le levain':'La pâte fermentée'):'Ta pâte — tout en une fois'}</div>
    <div class="grid-tiles">${ing.map(x=>`<div class="tile recipe"><div class="tile-label">${esc(x.label)}</div><div class="tile-value">${esc(x.value)}</div><div class="tile-note">${esc(x.note)}</div></div>`).join('')}</div>`;
  if(hasP){
    out+=`<div class="box-label" style="margin-top:12px">Pétrissage final — le reste</div>
    <div class="grid-tiles">${finalMix.map(x=>`<div class="tile recipe"><div class="tile-label">${esc(x.label)}</div><div class="tile-value">${esc(x.value)}</div><div class="tile-note">${esc(x.note)}</div></div>`).join('')}</div>`;
  }
  out+=`<div class="footnote">Les poids sont calculés. La levure, elle, est une estimation basée sur tes durées et tes températures — juge la pâte, pas la balance.</div>`;
  if(recapWarn) out+=`<div class="warn-box"><p>⚠ ${esc(recapWarnText)}</p></div>`;
  out+=`<div style="margin-top:26px;display:flex;align-items:baseline;gap:10px;padding-bottom:8px;border-bottom:2px solid var(--ink-40)">
      <h2 style="font-size:20px;font-weight:800;margin:0">Ton planning</h2>
      <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-50)">${esc(totalSpan)}</div>
    </div>
    <div>${tl.map(t=>`<div class="timeline-row">
      <div class="tl-when"><div class="tl-day">${esc(t.day)}</div><div class="tl-time">${t.time}</div></div>
      <div class="tl-bar ${t.hot?'hot':''}"></div>
      <div class="tl-body"><div class="tl-label ${t.hot?'hot':''}">${esc(t.label)}</div><div class="tl-note">${esc(t.note)}</div></div>
      <div class="tl-dur">${esc(t.dur)}</div>
    </div>`).join('')}</div>
    <div class="box" style="margin-top:22px;padding:18px">
      <div class="box-label">Cuisson — ${esc(oven)}</div>
      <div style="font-size:14px;line-height:1.6">Cible sole 430–480 °C · ${BAKE[oven]||75} s par pizza · une rotation toutes les 20 s. Préchauffage estimé ${PREHEAT[oven]||22} min.</div>
      <div class="box-label" style="margin-top:12px">Modèle de four</div>
      <div class="chips">${OVENS.map(o=>chip(o,ST.ovenModel===o,'setOven',o)).join('')}</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
      <button class="btn btn-primary" style="flex:1 1 260px;justify-content:flex-start;padding:18px 20px;font-size:16px" data-click="launch">Lancer ma session pizza <span style="margin-left:auto">→</span></button>
      ${ST.mode==='simple'?`<button class="btn" style="flex:0 1 240px;padding:18px 20px;font-size:14px" data-click="openAdvanced">Afficher les paramètres avancés</button>`:''}
    </div>
  </div>`;
  return out;
}

function screenDashboard(tl,rec,M,s){
  const now=s.now||Date.now(), doneSet=s.doneSteps||[];
  const nextIdx=tl.findIndex((_,k)=>!doneSet.includes(k));
  const hasNext=nextIdx>=0, sessionDone=doneSet.length>=tl.length&&tl.length>0;
  const nextStep=hasNext?tl[nextIdx]:null;
  const msTo=nextStep?nextStep.ts-now:0;
  const ef=E();
  const protocolTitle = M.name+' — '+ef.dur+' h'+(hasPref()&&(ef.m==='biga'||ef.m==='poolish')?' + '+ef.prefHours+' h de pré-ferment':'');
  const recapLine = s.count+' pizzas · '+s.diameter+' cm · '+s.ballWeight+' g/pâton · '+s.hydration+' % hydratation · '+(ef.ferm==='ambient'?'ambiante':ef.ferm==='fridge'?'froid':'mixte')+' · '+flour().brand+' '+flour().name;
  let out=`<div class="screen dash">
    <div class="eyebrow" style="color:var(--green)">Session en cours</div>
    <h1 class="title" style="font-size:clamp(28px,4.4vw,42px);line-height:1.06;letter-spacing:-.025em">${esc(protocolTitle)}</h1>
    <div style="font-size:14px;color:var(--ink-60);margin-bottom:18px">${esc(recapLine)}</div>`;
  if(sessionDone) out+=`<div class="done-banner"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.85">Toutes les étapes sont faites</div><div style="font-size:26px;font-weight:800;letter-spacing:-.02em;margin-top:6px">🍕 Buon appetito.</div></div>`;
  if(hasNext){
    const over=msTo<0;
    out+=`<div class="next-card">
      <div class="next-top"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--on-dark-accent)">Prochaine étape</div>${over?`<div class="late-badge">En retard</div>`:''}</div>
      <div class="next-label">${esc(nextStep.label)}</div>
      <div class="next-cd-row"><div class="next-cd">${esc(fmtCd(msTo))}</div><div class="next-when">prévu ${esc(nextStep.day)} à ${nextStep.time}</div></div>
      <div class="next-note">${esc(nextStep.note)}</div>
      <button class="btn btn-dark" style="margin-top:16px;padding:12px 18px;font-size:15px" data-click="markNext">✓ C'est fait — étape suivante</button>
    </div>`;
  }
  out+=`<div class="progress-row"><div class="lbl">Progression</div><div class="val">${doneSet.length} / ${tl.length} étapes</div></div>
    <div class="progress-track"><div class="progress-fill" style="width:${tl.length?Math.round(doneSet.length/tl.length*100):0}%"></div></div>
    <div>${tl.map((t,k)=>{
      const isDone=doneSet.includes(k), isActive=k===nextIdx&&!isDone, isUp=!isDone&&!isActive;
      const cd=isActive?fmtCd(t.ts-now):'';
      return `<div class="timeline-row">
        <div class="tl-when live"><div class="tl-day">${esc(t.day)}</div><div class="tl-time">${t.time}</div></div>
        <div class="tl-mark ${isDone?'done':isActive?'active':'upcoming'}">${isDone?'✓':''}</div>
        <div class="tl-body">
          <div class="tl-label" style="color:${isDone?'var(--ink-40)':isActive?'var(--accent)':'var(--ink)'}">${esc(t.label)}</div>
          <div class="tl-note">${esc(t.note)}</div>
          ${isActive?`<div class="tl-cd">${esc(cd)}</div>`:''}
        </div>
        <div class="tl-actions"><button class="tl-btn ${isDone?'done':''}" data-click="toggleDone" data-val="${k}">${isDone?'Fait ✓':'Marquer fait'}</button></div>
      </div>`;
    }).join('')}</div>
    <div class="box" style="margin-top:22px">
      <div class="box-label">🔔 Notifications</div>
      <div style="font-size:13px;color:var(--ink-70);line-height:1.55">${notifStatusText()}</div>
    </div>
    <button class="btn" style="margin-top:16px" data-click="restart">Modifier ma session</button>
  </div>`;
  return out;
}
function notifStatusText(){
  const base="Ta session est sauvegardée sur cet appareil : tu peux fermer l'appli et la retrouver ici.";
  return Notify.statusText()+" "+base;
}

function panel(ef,rec,f,M,fitOfCurrent,negW){
  const protocolTitle = M.name+' — '+ef.dur+' h'+(hasPref()&&(ef.m==='biga'||ef.m==='poolish')?' + '+ef.prefHours+' h de pré-ferment':'');
  const yk=YEASTS.find(y=>y.id===ST.yeastId);
  const ing = hasPref() ? (ef.m==='levain' ? [
      {label:'Levain',value:g(rec.levWeight||0)},{label:'dont farine',value:g(rec.pF)},{label:'dont eau',value:g(rec.pW)},{label:'Rafraîchi',value:'8 h avant'}]
    : ef.m==='pate_fermentee' ? [
      {label:'Pâte fermentée',value:g(rec.pfWeight||0)},{label:'dont farine',value:g(rec.pF)},{label:'dont eau',value:g(rec.pW)},{label:'dont sel',value:g(rec.pS||0)}]
    : [
      {label:'Farine',value:g(rec.pF)},{label:'Eau',value:g(rec.pW)},{label:'Levure',value:g(rec.pY)},{label:'Fermentation',value:ef.prefHours+' h'}])
    : [
      {label:'Farine',value:g(rec.F)},{label:'Eau',value:g(rec.W)},{label:'Sel',value:g(rec.S)},{label:'Levure',value:rec.noYeast?'—':g(rec.Y)}];
  const recipeHeading = hasPref() ? (ef.m==='biga'?'La biga — à préparer en premier':ef.m==='poolish'?'Le poolish — à préparer en premier':ef.m==='levain'?'Le levain':'La pâte fermentée') : "Ta pâte — tout en une fois";
  const liveRows=[{l:'Méthode',v:M.emoji+' '+M.name},{l:'Difficulté',v:M.diff},{l:'Objectif',v:GOALS.find(gg=>gg.id===ST.goal).label},{l:'Fermentation',v:ef.dur+' h · '+(ef.ferm==='ambient'?'ambiante':ef.ferm==='fridge'?'froid':'mixte')},{l:'Pizzas',v:ST.count+' × '+ST.diameter+' cm'},{l:'Pâtons',v:ST.ballWeight+' g'},{l:'Hydratation',v:ST.hydration+' %'},{l:'Farine',v:f.brand+' '+f.name},{l:'Pâte totale',v:n0(rec.total)+' g'},{l:'Service',v:hmFmt(eatDate())}];
  const liveHint = negW ? '⚠ Pré-ferment incohérent avec la recette : baisse sa part ou son hydratation.' : fitOfCurrent==='red' ? `⚠ ${f.brand} ${f.name} ne tient pas ${ef.dur} h de fermentation.` : 'Tout se recalcule à chaque réglage : méthode, levure, planning et quantités.';
  return `<div id="panel">
    <div class="box-label">Ton protocole en direct</div>
    <div class="panel-title">${esc(protocolTitle)}</div>
    <div class="panel-rows">${liveRows.map(r=>`<div class="panel-row"><div class="k">${esc(r.l)}</div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>
    <div class="panel-recipe">
      <div class="panel-recipe-title">${esc(recipeHeading)}</div>
      <div class="panel-recipe-grid">${ing.map(x=>`<div style="flex:1 1 84px"><div class="pv">${esc(x.value)}</div><div class="pl">${esc(x.label)}</div></div>`).join('')}</div>
    </div>
    <div class="panel-hint">${esc(liveHint)}</div>
  </div>`;
}

/* ---------- live number updates during slider drag (avoids full re-render mid-drag) ---------- */
const LIVE_FMT={
  tAmb:v=>v+' °C', tFridge:v=>v+' °C', doughTemp:v=>v+' °C', autolyseMin:v=>v+' min',
  hydration:v=>v+' %', ballWeight:v=>v, duration:v=>v+' h',
  prefFlourPct:v=>v+' %', prefHyd:v=>v+' %', prefHours:v=>v+' h', prefTemp:v=>v+' °C',
  levainPct:v=>v+' %', levainHyd:v=>v+' %', pfPct:v=>v+' %'
};
function liveNumberUpdate(key,val){
  document.querySelectorAll('[data-shownum="'+key+'"]').forEach(el=>{
    if(LIVE_FMT[key]) el.textContent=LIVE_FMT[key](val);
  });
  if(key==='saltRaw'){ document.querySelectorAll('[data-shownum="saltPct"]').forEach(el=>{ el.textContent=n1(val/10); }); }
  if(key==='ballWeight'){ document.querySelectorAll('[data-shownum="totalDough"]').forEach(el=>{ el.textContent=n0(ST.count*val)+' g'; }); }
}

/* ---------- actions ---------- */
function afterChange(){ persistDraft(); if(ST.launched){ persistSession(); scheduleNotifications(); } render(); }
function scrollTop(){ window.scrollTo(0,0); }

function doAction(t){
  const click=t.dataset.click;
  if(!click) return;
  switch(click){
    case 'goSimple': ST.mode='simple'; ST.stepId='simple'; ST.goal='auto'; afterChange(); scrollTop(); break;
    case 'goCustom': ST.mode='custom'; ST.stepId='quantite'; afterChange(); scrollTop(); break;
    case 'openAdvanced': { const r=reco('auto'); Object.assign(ST,{mode:'custom',stepId:'objectif',expert:true,method:r.m,duration:r.dur,fermType:r.ferm,organisation:r.org},methodDefaults(r.m)); afterChange(); scrollTop(); break; }
    case 'setLevel': ST.level=t.dataset.val; afterChange(); break;
    case 'setFlour': ST.flourId=t.dataset.val; afterChange(); break;
    case 'setStyle': ST.styleId=t.dataset.val; afterChange(); break;
    case 'setGoal': ST.goal=t.dataset.val; afterChange(); break;
    case 'setMethod': Object.assign(ST,{method:t.dataset.val},methodDefaults(t.dataset.val)); afterChange(); break;
    case 'setFerm': ST.fermType=t.dataset.val; afterChange(); break;
    case 'setOrg': ST.organisation=t.dataset.val; afterChange(); break;
    case 'setYeast': ST.yeastId=t.dataset.val; afterChange(); break;
    case 'setOven': ST.ovenModel=t.dataset.val; afterChange(); break;
    case 'setDiam': ST.diameter=+t.dataset.val; afterChange(); break;
    case 'setCount': ST.count=+t.dataset.val; afterChange(); break;
    case 'setDuration': ST.duration=+t.dataset.val; afterChange(); break;
    case 'inc': { const k=t.dataset.key,max=+t.dataset.max; ST[k]=Math.min(max,ST[k]+1); afterChange(); break; }
    case 'dec': { const k=t.dataset.key,min=+t.dataset.min; ST[k]=Math.max(min,ST[k]-1); afterChange(); break; }
    case 'setWhen': { const o=+t.dataset.val; const d=new Date(); if(o<0) d.setDate(d.getDate()+((6-d.getDay()+7)%7||7)); else d.setDate(d.getDate()+o); ST.dateStr=d.toISOString().slice(0,10); ST.timeStr='20:00'; afterChange(); break; }
    case 'toggleAutolyse': ST.autolyse=!ST.autolyse; afterChange(); break;
    case 'toggleExpert': ST.expert=!ST.expert; afterChange(); break;
    case 'toggleCompare': ST.compare=!ST.compare; afterChange(); break;
    case 'toggleLivePanel': livePanelOn=!livePanelOn; persistPrefs(); render(); break;
    case 'applyReco': applyReco(); afterChange(); break;
    case 'next': { const fl=flow(), i=idx(); ST.stepId=fl[Math.min(fl.length-1,i+1)]; afterChange(); scrollTop(); break; }
    case 'prev': { const fl=flow(), i=idx(); ST.stepId=fl[Math.max(0,i-1)]; afterChange(); scrollTop(); break; }
    case 'launch': ST.launched=true; ST.doneSteps=[]; ST.now=Date.now(); persistSession(); requestNotifPermission(); scheduleNotifications(); render(); scrollTop(); break;
    case 'restart': clearSession(); clearNotifTimers(); ST.launched=false; ST.stepId='recap'; ST.doneSteps=[]; afterChange(); scrollTop(); break;
    case 'markNext': { const tl=timelineData(); const doneSet=ST.doneSteps||[]; const ni=tl.findIndex((_,k)=>!doneSet.includes(k)); if(ni>=0){ ST.doneSteps=[...doneSet,ni]; persistSession(); scheduleNotifications(); render(); } break; }
    case 'toggleDone': { const k=+t.dataset.val; const d=ST.doneSteps||[]; ST.doneSteps=d.includes(k)?d.filter(x=>x!==k):[...d,k]; persistSession(); scheduleNotifications(); render(); break; }
  }
}

root.addEventListener('click',e=>{
  const t=e.target.closest('[data-click]');
  if(t) doAction(t);
});
root.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.bind && t.type==='range'){
    const key=t.dataset.bind, val=+t.value;
    ST[key]=val;
    liveNumberUpdate(key,val);
  }
});
root.addEventListener('change',e=>{
  const t=e.target;
  if(!t.dataset.bind) return;
  const key=t.dataset.bind;
  if(t.type==='range'){ afterChange(); return; }
  const val = (t.type==='date'||t.type==='time') ? t.value : (t.value===''?t.value:(+t.value));
  ST[key]=val;
  afterChange();
});

/* ---------- boot ---------- */
loadState();
if(ST.launched){ ST.now=Date.now(); scheduleNotifications(); }
render();
setInterval(()=>{ if(ST.launched){ ST.now=Date.now(); render(); } },1000);
