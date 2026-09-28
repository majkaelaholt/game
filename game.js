/* Velvet Hour — The House on Nocturne Street
   Campaign-first cozy puzzle RPG. No external dependencies. */
'use strict';

const SAVE_KEY = 'velvetHouse_nocturne_v1';
const LEGACY_KEY = 'velvetHourMak_v2';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = arr => [...arr].sort(()=>Math.random()-.5);

const CHAPTERS = [
  {
    numeral:'I', name:'The Front Room', room:'atelier', icon:'🪞',
    kicker:'OPEN THE FIRST DOOR',
    summary:'Turn the dustiest room in the house into a tiny styling atelier—and prove Velvet House can be useful to someone besides you.',
    reward:'Unlock the Scent Lab + Mina',
    objectives:[
      {id:'frontReset', label:'Restore the front room', detail:'Complete the room reset', need:1, action:'reset-front'},
      {id:'sourced', label:'Source two display pieces', detail:'Win 2 thrift briefs', need:2, action:'thrift'},
      {id:'styled', label:'Finish your first client look', detail:'Score B or better', need:1, action:'style'},
      {id:'rep', label:'Build local reputation', detail:'Reach 15 reputation', need:15, stat:'reputation'}
    ],
    boss:{name:'The First Window', detail:'Style a three-part storefront display for Jules.', action:'boss-style'}
  },
  {
    numeral:'II', name:'The Scent Bar', room:'lab', icon:'🧪',
    kicker:'MAKE THE HOUSE SMELL LIKE IT BELONGS TO YOU',
    summary:'Mina thinks the old side room could become a scent bar. Restore it, learn the note system, and bottle something worth putting your name on.',
    reward:'Unlock the Night Kitchen + Bea',
    objectives:[
      {id:'labReset', label:'Restore the scent cabinet', detail:'Sort the abandoned stock', need:1, action:'reset-lab'},
      {id:'scentPractice', label:'Learn the note pyramid', detail:'Complete 2 scent studies', need:2, action:'scent-study'},
      {id:'scentCommission', label:'Bottle Mina’s commission', detail:'Score B or better', need:1, action:'scent-commission'},
      {id:'minaBond', label:'Earn Mina’s trust', detail:'Reach 1 heart', need:1, relation:'mina'}
    ],
    boss:{name:'House Signature No. 01', detail:'Build the first official Velvet House fragrance.', action:'boss-scent'}
  },
  {
    numeral:'III', name:'The Night Kitchen', room:'kitchen', icon:'🧁',
    kicker:'SOMETHING WARM AFTER MIDNIGHT',
    summary:'Bea wants to run late-night bakes through the house. Get the kitchen functional, handle real orders, and survive one very opinionated tasting table.',
    reward:'Unlock the Archive + Rowan',
    objectives:[
      {id:'kitchenReset', label:'Make the kitchen usable', detail:'Restore the prep stations', need:1, action:'reset-kitchen'},
      {id:'baked', label:'Fill two bakery orders', detail:'Score B or better twice', need:2, action:'bake'},
      {id:'budget', label:'Price the menu correctly', detail:'Solve Bea’s costing sheet', need:1, action:'budget'},
      {id:'beaBond', label:'Become Bea’s reliable backup', detail:'Reach 1 heart', need:1, relation:'bea'}
    ],
    boss:{name:'The Midnight Tasting', detail:'Complete a multi-stage bake for invited guests.', action:'boss-bake'}
  },
  {
    numeral:'IV', name:'The Locked Archive', room:'archive', icon:'📚',
    kicker:'THE HOUSE KEPT RECEIPTS',
    summary:'A false wall opens behind the kitchen shelves. Rowan recognizes the symbols inside. The house has a history—and apparently opinions.',
    reward:'Unlock the Grand Showcase + final chapter',
    objectives:[
      {id:'archiveReset', label:'Restore the reading table', detail:'Sort the damaged archive', need:1, action:'reset-archive'},
      {id:'ciphers', label:'Decode three house fragments', detail:'Solve 3 archive puzzles', need:3, action:'cipher'},
      {id:'fragments', label:'Recover two memory fragments', detail:'Find both hidden records', need:2, action:'fragment'},
      {id:'rowanBond', label:'Get Rowan to stop being cryptic', detail:'Reach 1 heart', need:1, relation:'rowan'}
    ],
    boss:{name:'The Room Behind the Room', detail:'Solve the archive’s chained lock puzzle.', action:'boss-archive'}
  },
  {
    numeral:'V', name:'Moonlight Opening', room:'showcase', icon:'🌙',
    kicker:'MAKE IT LOOK INTENTIONAL',
    summary:'Every restored room feeds one final event: the Velvet House moonlight opening. Build the showcase, choose what the house stands for, and earn your sign above the door.',
    reward:'Unlock After Hours freeplay',
    objectives:[
      {id:'finalStyle', label:'Prepare the showcase look', detail:'Complete the final style brief', need:1, action:'final-style'},
      {id:'finalScent', label:'Bottle the opening fragrance', detail:'Complete the final scent brief', need:1, action:'final-scent'},
      {id:'finalBake', label:'Prepare the midnight table', detail:'Complete the final bake', need:1, action:'final-bake'},
      {id:'finalLore', label:'Choose the house inscription', detail:'Solve the final archive clue', need:1, action:'final-lore'},
      {id:'rep', label:'Become known in Velvet City', detail:'Reach 100 reputation', need:100, stat:'reputation'}
    ],
    boss:{name:'The Moonlight Opening', detail:'A four-room mastery gauntlet. Your house, your rules.', action:'festival'}
  },
  {
    numeral:'✦', name:'After Hours', room:'showcase', icon:'✨',
    kicker:'THE HOUSE IS OPEN',
    summary:'The campaign is complete. Replay mastered challenges, deepen relationships, collect keepsakes, and improve your personal bests.',
    reward:'You already won. Now make it yours.', objectives:[], boss:null
  }
];

const NPCS = {
  jules:{name:'Jules', icon:'🧷', color:'#8d5069', tagline:'thrift curator • professional enabler', unlock:0,
    intro:'Jules runs Old Market’s best rack and has extremely strong opinions about “boring basics.”',
    talks:[
      {q:'A client says she wants to look “interesting, but not like I tried.” Jules raises an eyebrow. What do you pull first?', choices:['One strong texture + simple base','Four statement pieces at once','All black with zero contrast'], good:0},
      {q:'Jules finds a great jacket with one missing button. Their verdict?', choices:['Leave it—imperfect means ruined','Check repair cost before deciding','Buy it at full price immediately'], good:1}
    ]},
  mina:{name:'Mina', icon:'🪻', color:'#7b6295', tagline:'perfumer • terrifyingly good nose', unlock:1,
    intro:'Mina treats fragrance like architecture. She notices when you call everything sweet “vanilla.”',
    talks:[
      {q:'Mina hands you a bright citrus scent that disappears quickly. Which explanation would impress her?', choices:['Top notes are usually more volatile','The bottle is too small','Citrus always means weak perfume'], good:0},
      {q:'A blend is sweet but flat. Mina asks what you would add.', choices:['Another sugary base note','A contrasting lift or texture','More of every note'], good:1}
    ]},
  bea:{name:'Bea', icon:'🥐', color:'#9b6d51', tagline:'night baker • chaos in an apron', unlock:2,
    intro:'Bea can eyeball flour and somehow still gets mad when anyone else does it.',
    talks:[
      {q:'Bea’s brownies look done at the edges but the center still jiggles like batter. What do you say?', choices:['Pull them now','Give them more time and check again','Turn the oven off and hope'], good:1},
      {q:'A customer wants a half batch. Bea points at 3/4 cup sugar. New amount?', choices:['3/8 cup','1/2 cup','1/4 cup'], good:0}
    ]},
  rowan:{name:'Rowan', icon:'🗝️', color:'#586981', tagline:'archivist • speaks in footnotes', unlock:3,
    intro:'Rowan claims not to believe in haunted buildings while carrying three books about haunted buildings.',
    talks:[
      {q:'A margin note repeats every third symbol. Rowan asks what you check first.', choices:['The repeating interval','The prettiest symbol','Whether the paper smells old'], good:0},
      {q:'Two sources disagree about a date. Best next move?', choices:['Pick the older book automatically','Compare provenance and context','Average the dates'], good:1}
    ]}
};

const KEEPSAKES = [
  ['🧥','Burgundy Window Jacket','Earned from the First Window'],
  ['🧴','House Signature No. 01','Your first official Velvet House scent'],
  ['🍰','Midnight Tasting Card','Bea wrote “acceptable” and underlined it twice'],
  ['🗝️','Brass Archive Key','Recovered from the room behind the room'],
  ['🌙','Moonlight House Sign','Proof that the doors are officially open']
];

function freshState(){
  return {
    version:1, started:false, prologue:0, day:1, actions:3, coins:60, reputation:0, chapter:0,
    progress:{frontReset:0,sourced:0,styled:0,labReset:0,scentPractice:0,scentCommission:0,kitchenReset:0,baked:0,budget:0,archiveReset:0,ciphers:0,fragments:0,finalStyle:0,finalScent:0,finalBake:0,finalLore:0},
    bossDone:[false,false,false,false,false],
    relations:{jules:0,mina:0,bea:0,rowan:0},
    skills:{styling:{level:1,xp:0},scent:{level:1,xp:0},baking:{level:1,xp:0},lore:{level:1,xp:0},focus:{level:1,xp:0}},
    mastery:{}, keepsakes:[], chapterFlags:{}, nightLog:[], lifetimeActions:0, legacyGift:false,
    journalTab:'campaign', lastScreen:'house', sideDone:{}, highScores:{}
  };
}
let state = loadState();
let currentScreen = state.lastScreen || 'house';
let currentRoom = null;
let activeGame = null;

function loadState(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){return mergeState(freshState(),JSON.parse(raw));}
  }catch(e){}
  const s=freshState();
  try{ if(localStorage.getItem(LEGACY_KEY)){s.legacyGift=true;} }catch(e){}
  return s;
}
function mergeState(base, saved){
  const out={...base,...saved};
  out.progress={...base.progress,...(saved.progress||{})};
  out.relations={...base.relations,...(saved.relations||{})};
  out.skills={...base.skills,...(saved.skills||{})};
  out.mastery={...(saved.mastery||{})};
  out.chapterFlags={...(saved.chapterFlags||{})};
  out.sideDone={...(saved.sideDone||{})};
  out.highScores={...(saved.highScores||{})};
  return out;
}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2300);}
function grade(score){return score>=95?'S':score>=85?'A':score>=66?'B':score>=58?'C':score>=42?'D':'F';}
function scoreStars(score){return score>=90?3:score>=75?2:score>=60?1:0;}
function skillNeed(l){return 90+l*35;}
function gainSkill(key,amount){
  const s=state.skills[key]; if(!s)return;
  s.xp+=amount;
  while(s.level<5 && s.xp>=skillNeed(s.level)){s.xp-=skillNeed(s.level);s.level++;toast(`${skillLabel(key)} reached level ${s.level}.`);}
}
function skillLabel(k){return ({styling:'Styling',scent:'Scentcraft',baking:'Baking',lore:'Lore',focus:'Focus'})[k]||k;}
function relationHearts(id){return Math.floor((state.relations[id]||0)/25);}
function chapter(){return CHAPTERS[state.chapter];}
function objectiveValue(o){if(o.stat)return state[o.stat]||0;if(o.relation)return relationHearts(o.relation);return state.progress[o.id]||0;}
function objectiveDone(o){return objectiveValue(o)>=o.need;}
function chapterReady(){return chapter().objectives.length>0 && chapter().objectives.every(objectiveDone);}
function chapterProgressPct(){const c=chapter();if(!c.objectives.length)return 100;return Math.round(c.objectives.reduce((a,o)=>a+Math.min(1,objectiveValue(o)/o.need),0)/c.objectives.length*100);}
function nextObjective(){return chapter().objectives.find(o=>!objectiveDone(o));}
function unlockedRoom(room){const req={atelier:0,lab:1,kitchen:2,archive:3,showcase:4}[room]??0;return state.chapter>=req;}
function useAction(){if(state.actions<=0){toast('You’re out of actions tonight. End the night to continue.');return false;}state.actions--;state.lifetimeActions++;return true;}
function reward({score=70,coins=8,rep=4,skill='focus',xp=20}={}){
  const mult=score>=90?1.35:score>=75?1.15:score<50?.7:1;
  const c=Math.round(coins*mult), r=Math.round(rep*mult), x=Math.round(xp*mult);
  state.coins+=c;state.reputation+=r;gainSkill(skill,x);
  state.nightLog.push({type:'action',score,coins:c,rep:r,skill});
  save();return {coins:c,rep:r,xp:x};
}
function recordMastery(key,score){
  const m=state.mastery[key]||{plays:0,best:0,total:0};m.plays++;m.best=Math.max(m.best,score);m.total+=score;state.mastery[key]=m;
  state.highScores[key]=Math.max(state.highScores[key]||0,score);
}
function addProgress(id,amt=1){state.progress[id]=(state.progress[id]||0)+amt;save();}
function addRelation(id,amt){state.relations[id]=clamp((state.relations[id]||0)+amt,0,100);save();}
function addKeepsake(index){if(!state.keepsakes.includes(index))state.keepsakes.push(index);}

function setScreen(name){currentScreen=name;currentRoom=null;state.lastScreen=name;save();render();}
function setRoom(room){if(!unlockedRoom(room)){toast('That room is still locked by the campaign.');return;}currentRoom=room;currentScreen='room';render();}

function render(){
  renderHud();
  $$('.mobile-dock button').forEach(b=>b.classList.toggle('active',b.dataset.nav===currentScreen || (currentScreen==='room'&&b.dataset.nav==='house')));
  if(!state.started){renderStart();return;}
  if(currentScreen==='house')renderHouse();
  else if(currentScreen==='mission')renderMission();
  else if(currentScreen==='people')renderPeople();
  else if(currentScreen==='journal')renderJournal();
  else if(currentScreen==='room')renderRoom(currentRoom||chapter().room);
  else renderHouse();
}
function renderHud(){
  const c=chapter();$('#coins').textContent=state.coins;$('#reputation').textContent=state.reputation;$('#actionsLeft').textContent=state.actions;
  $('#chapterNumber').textContent=c.numeral;$('#chapterName').textContent=c.name;$('#chapterBar').style.width=chapterProgressPct()+'%';
}

function renderStart(){
  const legacy=state.legacyGift?`<div class="mission-chip main"><small>LEGACY TRUNK DETECTED</small><b>Your old Velvet Hour save left something behind. Start the campaign to open it.</b></div>`:'';
  $('#screen').innerHTML=`<section class="scene"><div class="scene-bg house-bg"></div>${houseArt(false)}<div class="scene-content"><div class="eyebrow">A COZY PUZZLE RPG</div><h1>The house on Nocturne Street is yours now.</h1><p class="scene-lead">Five rooms are shuttered. The Moonlight Opening won’t happen until they’re ready. Restore the house one chapter at a time, solve real challenges, help the people who wander in after dark, and decide what Velvet House becomes.</p><div class="scene-actions"><button class="btn gold" onclick="beginCampaign()">Open the envelope</button></div><div class="mission-strip">${legacy}<div class="mission-chip main"><small>HOW THIS VERSION WORKS</small><b>One main mission. Three actions per night. Every action is a minigame with a visible purpose.</b></div></div></div></section>`;
}
function beginCampaign(){
  state.started=true; if(state.legacyGift){state.coins+=40;state.chapterFlags.legacy=true;toast('Legacy trunk opened: +40 coins and a little emotional baggage.');}
  save(); showStory('prologue');
}

function houseArt(interactive=true){
  const rooms=[['kitchen','Night Kitchen','🧁'],['archive','Archive','📚'],['atelier','Front Atelier','🪞'],['lab','Scent Lab','🧪'],['showcase','Grand Showcase','🌙'],['foyer','Foyer','🗝️']];
  return `<div class="house-art"><div class="house-roof"></div><div class="house-frame">${rooms.map(([id,n,ic])=>{const ok=id==='foyer'||unlockedRoom(id);return `<div class="room ${id} ${ok?'unlocked':'locked'}" ${interactive&&ok&&id!=='foyer'?`onclick="setRoom('${id}')" style="cursor:pointer"`:''}><span class="room-icon">${ic}</span><span class="room-label">${n}</span>${id!=='foyer'?'<span class="window"></span>':''}</div>`}).join('')}</div></div>`;
}
function recommendedText(){
  if(state.chapter>=5)return {icon:'✨',title:'After Hours',body:'Replay any restored room, improve mastery scores, or deepen a relationship.',action:`setRoom('showcase')`,label:'Enter the house'};
  if(chapterReady()&&!state.bossDone[state.chapter])return {icon:'🏆',title:chapter().boss.name,body:`Everything is ready. ${chapter().boss.detail}`,action:`startAction('${chapter().boss.action}')`,label:'Begin chapter finale'};
  const o=nextObjective();
  if(!o)return {icon:'📓',title:'Check the journal',body:'You’ve completed the visible objectives.',action:`setScreen('mission')`,label:'Open mission'};
  if(o.stat==='reputation')return {icon:'✦',title:'Build reputation',body:'Complete any chapter activity well. B-rank or better earns the best reputation.',action:`setRoom('${chapter().room}')`,label:'Go to current room'};
  if(o.relation)return {icon:NPCS[o.relation].icon,title:`Talk to ${NPCS[o.relation].name}`,body:'Their relationship challenge is part of this chapter—not random side content.',action:`openPerson('${o.relation}')`,label:'Meet them'};
  return {icon:actionIcon(o.action),title:o.label,body:o.detail,action:`startAction('${o.action}')`,label:'Do this next'};
}
function renderHouse(){
  const rec=recommendedText();const c=chapter();
  $('#screen').innerHTML=`<section class="scene"><div class="scene-bg house-bg"></div>${houseArt(true)}<div class="scene-content"><div class="eyebrow">NIGHT ${state.day} • ${state.actions} ACTION${state.actions===1?'':'S'} LEFT</div><h1>${state.chapter>=5?'Velvet House is open.':'Restore the house. One room at a time.'}</h1><p class="scene-lead">${state.chapter>=5?'No deadline, no checklist panic. The campaign is complete; the rooms are yours to master.':`Right now, the story is about <b>${c.name}</b>. You can explore older rooms, but the game will always point back to the next meaningful step.`}</p><div class="scene-actions"><button class="btn primary" onclick="${rec.action}">${rec.icon} ${rec.label}</button><button class="btn ghost" onclick="setScreen('mission')">🎯 See the chapter plan</button>${state.actions===0?`<button class="btn gold" onclick="endNight()">🌘 End night</button>`:''}</div><div class="mission-strip"><div class="mission-chip main"><small>RECOMMENDED NEXT</small><b>${rec.title}</b><div class="mini-progress"><i style="width:${chapterProgressPct()}%"></i></div></div><div class="mission-chip"><small>CHAPTER</small><b>${c.numeral} · ${c.name}</b></div><div class="mission-chip"><small>HOUSE REPUTATION</small><b>${state.reputation} ✦</b></div></div></div></section>`;
}

function renderMission(){
  const c=chapter();const rec=recommendedText();
  const objectiveHtml=c.objectives.length?c.objectives.map(o=>{
    const val=objectiveValue(o),done=objectiveDone(o);return `<div class="objective ${done?'complete':''}"><div class="objective-icon">${done?'✓':actionIcon(o.action||'talk')}</div><div><b>${o.label}</b><small>${o.detail} · ${Math.min(val,o.need)}/${o.need}</small></div>${done?'':`<button class="btn ghost" onclick="${o.relation?`openPerson('${o.relation}')`:o.stat?`setRoom('${c.room}')`:`startAction('${o.action}')`}">Go</button>`}</div>`}).join(''):`<p class="muted">The main campaign is complete. This page is now your victory lap.</p>`;
  $('#screen').innerHTML=`<section class="surface"><div class="surface-head"><div><div class="eyebrow">CAMPAIGN</div><h1>${c.numeral}. ${c.name}</h1></div><p>${c.summary}</p></div><div class="grid"><div class="span-8"><div class="mission-hero"><div class="eyebrow">MAIN MISSION • ${chapterProgressPct()}%</div><h2>${c.kicker}</h2><p class="muted small">Complete these in any order. The chapter finale unlocks only when the room is genuinely ready.</p><div class="objective-list">${objectiveHtml}</div>${chapterReady()&&c.boss&&!state.bossDone[state.chapter]?`<div class="divider"></div><button class="btn gold" onclick="startAction('${c.boss.action}')">🏆 Begin finale: ${c.boss.name}</button>`:''}</div></div><div class="span-4"><div class="recommended-card"><div class="eyebrow">DO THIS NEXT</div><div class="big-icon">${rec.icon}</div><h3>${rec.title}</h3><p>${rec.body}</p><button class="btn primary" onclick="${rec.action}">${rec.label}</button></div><div class="card" style="margin-top:14px"><h3>Tonight</h3><p class="small muted">You have <b>${state.actions}</b> action${state.actions===1?'':'s'} left. There is no punishment for ending early.</p>${sideQuestHtml()}${state.actions===0?`<button class="btn gold" onclick="endNight()">End the night</button>`:''}</div></div><div class="card span-12"><h3>Where this is going</h3>${chapterPathHtml()}</div></div></section>`;
}
function chapterPathHtml(){return `<div class="chapter-path">${CHAPTERS.slice(0,5).map((x,i)=>`<div class="chapter-node ${i<state.chapter?'done':i===state.chapter?'current':''}"><div class="node-dot">${i<state.chapter?'✓':x.numeral}</div><div><h4>${x.icon} ${x.name}</h4><p>${i<state.chapter?'Restored.':i===state.chapter?x.summary:x.reward}</p></div></div>`).join('')}</div>`;}
function sideQuest(){
  const ids=Object.keys(NPCS).filter(id=>state.chapter>=NPCS[id].unlock);
  const id=ids[(state.day+state.chapter)%ids.length];
  const key=`${state.day}-${id}`; return {id,key,n:NPCS[id]};
}
function sideQuestHtml(){const q=sideQuest();const done=state.sideDone[q.key];return `<div class="divider"></div><div class="side-task"><div><b>${q.n.icon} ${q.n.name} has a small favor</b><small>${done?'Done tonight.':'Optional relationship challenge · costs 1 action'}</small></div>${done?'✓':`<button class="btn ghost" onclick="openPerson('${q.id}',true)">Visit</button>`}</div>`;}

function renderPeople(){
  const cards=Object.entries(NPCS).map(([id,n])=>{const unlocked=state.chapter>=n.unlock;const hearts=relationHearts(id);return `<div class="person-card ${unlocked?'':'locked-person'}"><div class="person-art" style="background:radial-gradient(circle at 50% 35%,rgba(255,255,255,.12),transparent 24%),linear-gradient(145deg,${n.color},#211620)">${unlocked?n.icon:'🔒'}</div><div class="person-copy"><div class="eyebrow">${unlocked?n.tagline:'LOCKED BY CAMPAIGN'}</div><h3>${unlocked?n.name:'Someone you haven’t met'}</h3><p class="small muted">${unlocked?n.intro:`Restore more of Velvet House to meet them.`}</p><div class="heartbar"><i style="width:${state.relations[id]}%"></i></div><small>${'♥'.repeat(hearts)}${'♡'.repeat(4-hearts)}</small>${unlocked?`<div style="margin-top:10px"><button class="btn ghost" onclick="openPerson('${id}')">Talk</button></div>`:''}</div></div>`}).join('');
  $('#screen').innerHTML=`<section class="surface"><div class="surface-head"><div><div class="eyebrow">RELATIONSHIPS</div><h1>People, not random encounters.</h1></div><p>Each person enters because a chapter introduces them. Talking is a “read the room” challenge, and relationship milestones feed back into the campaign.</p></div><div class="people-grid">${cards}</div></section>`;
}

function renderJournal(){
  const tabs=[['campaign','Campaign'],['skills','Mastery'],['keepsakes','Keepsakes'],['records','Records']];
  const content=journalContent(state.journalTab);
  $('#screen').innerHTML=`<section class="surface"><div class="surface-head"><div><div class="eyebrow">YOUR JOURNAL</div><h1>Everything that matters, in one place.</h1></div><p>No giant settings maze. This tracks the campaign, what you’re getting better at, and the things you’ve actually earned.</p></div><div class="journal-layout"><div class="journal-tabs">${tabs.map(([id,l])=>`<button class="${state.journalTab===id?'active':''}" onclick="setJournalTab('${id}')">${l}</button>`).join('')}</div><div class="card">${content}</div></div></section>`;
}
function setJournalTab(t){state.journalTab=t;save();renderJournal();}
function journalContent(t){
  if(t==='campaign')return `<h2>Campaign map</h2><p class="small muted">${chapter().summary}</p><div class="divider"></div>${chapterPathHtml()}`;
  if(t==='skills')return `<h2>Challenge mastery</h2><p class="small muted">Skills improve from performance, not button presses. Best scores remain visible so there’s a reason to replay.</p><div class="divider"></div>${Object.entries(state.skills).map(([k,s])=>`<div class="skill-row"><b>${skillLabel(k)}</b><div><div class="progress"><i style="width:${s.level>=5?100:Math.round(s.xp/skillNeed(s.level)*100)}%"></i></div><small class="muted">${s.level>=5?'Mastered':`${s.xp}/${skillNeed(s.level)} XP`}</small></div><b>Lv.${s.level}</b></div>`).join('')}<div class="divider"></div><h3>Personal bests</h3>${Object.keys(state.highScores).length?Object.entries(state.highScores).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="side-task"><b>${prettyAction(k)}</b><span class="tag gold">${grade(v)} · ${v}%</span></div>`).join(''):`<p class="muted small">Complete a challenge and it’ll appear here.</p>`}`;
  if(t==='keepsakes')return `<h2>House keepsakes</h2><p class="small muted">These are chapter trophies, not random inventory clutter.</p><div class="collection-grid">${KEEPSAKES.map((it,i)=>state.keepsakes.includes(i)?`<div class="collection-item"><span class="icon">${it[0]}</span><b>${it[1]}</b><small>${it[2]}</small></div>`:`<div class="collection-item" style="opacity:.38"><span class="icon">🔒</span><b>Locked keepsake</b><small>Complete a chapter finale.</small></div>`).join('')}</div>`;
  return `<h2>House record</h2><div class="result-grid"><div class="result-stat"><b>${state.day}</b><small>Nights played</small></div><div class="result-stat"><b>${state.lifetimeActions}</b><small>Challenges played</small></div><div class="result-stat"><b>${state.reputation}</b><small>Reputation</small></div><div class="result-stat"><b>${state.chapter>=5?'5/5':`${state.chapter}/5`}</b><small>Rooms restored</small></div><div class="result-stat"><b>${Object.values(state.relations).reduce((a,b)=>a+Math.floor(b/25),0)}</b><small>Relationship hearts</small></div><div class="result-stat"><b>${state.keepsakes.length}</b><small>Keepsakes</small></div></div><div class="divider"></div><button class="btn ghost" onclick="exportSave()">Export save</button>`;
}

function renderRoom(room){
  const meta={
    atelier:{name:'The Front Atelier',icon:'🪞',eyebrow:'ROOM I',desc:'A styling mirror, one clothing rack, and exactly enough confidence to call it an atelier.',bg:'atelier-bg'},
    lab:{name:'The Scent Lab',icon:'🧪',eyebrow:'ROOM II',desc:'Old apothecary drawers, blotter paper, glass bottles, and Mina judging your ratios from three feet away.',bg:'lab-bg'},
    kitchen:{name:'The Night Kitchen',icon:'🧁',eyebrow:'ROOM III',desc:'Warm lights, cold counters, and Bea insisting that “a little chaotic” is a legitimate mise en place.',bg:'kitchen-bg'},
    archive:{name:'The Locked Archive',icon:'📚',eyebrow:'ROOM IV',desc:'Shelves inside shelves. Margin notes. A suspicious amount of brass hardware. Rowan is delighted.',bg:'archive-bg'},
    showcase:{name:'The Grand Showcase',icon:'🌙',eyebrow:'ROOM V',desc:'Everything you learned in the other rooms eventually ends up here, under one very flattering spotlight.',bg:'showcase-bg'}
  }[room];
  const stations=roomStations(room);
  $('#screen').innerHTML=`<section class="room-scene"><div class="backdrop ${meta.bg}"></div>${roomArtMarkup(room)}<div class="room-inner"><div class="eyebrow">${meta.eyebrow} • ${state.actions} ACTION${state.actions===1?'':'S'} LEFT</div><h1>${meta.icon} ${meta.name}</h1><p>${meta.desc}</p><div class="scene-actions"><button class="btn ghost" onclick="setScreen('house')">← Back to house</button><button class="btn ghost" onclick="setScreen('mission')">🎯 Mission</button>${state.actions===0?`<button class="btn gold" onclick="endNight()">🌘 End night</button>`:''}</div><div class="room-stations">${stations}</div></div></section>`;
}

function roomArtMarkup(room){
  const art={
    atelier:`<div class="room-art atelier-art"><div class="art-window"></div><div class="art-mirror">✦</div><div class="art-rack"><i></i><span>🧥</span><span>👚</span><span>👜</span></div><div class="art-rug"></div><div class="art-lamp">●</div></div>`,
    lab:`<div class="room-art lab-art"><div class="art-window"></div><div class="art-shelves"><b>🧴</b><b>🪻</b><b>⚗️</b><b>🍐</b><b>🧪</b><b>🌼</b></div><div class="art-table"><span>🧴</span><span>🧪</span><span>📜</span></div><div class="art-glow"></div></div>`,
    kitchen:`<div class="room-art kitchen-art"><div class="art-window"></div><div class="art-cabinets"></div><div class="art-oven">♨</div><div class="art-counter"><span>🥣</span><span>🧁</span><span>🍰</span></div><div class="art-pendant">●</div></div>`,
    archive:`<div class="room-art archive-art"><div class="art-books left">📚<br>📕<br>📚</div><div class="art-books right">📖<br>📚<br>📓</div><div class="art-desk">📜 &nbsp; 🗝️</div><div class="art-lampdesk">◉</div><div class="art-door">✦</div></div>`,
    showcase:`<div class="room-art showcase-art"><div class="art-moon">☾</div><div class="art-plinth one">🧥</div><div class="art-plinth two">🧴</div><div class="art-plinth three">🍰</div><div class="art-curtain left"></div><div class="art-curtain right"></div><div class="art-stars">✦ · ✧ · ✦</div></div>`
  };
  return art[room]||'';
}

function roomStations(room){
  const c=state.chapter;
  const make=(icon,name,desc,action,purpose,disabled=false)=>`<button class="station" ${disabled?'disabled':`onclick="startAction('${action}')"`}><span class="station-icon">${icon}</span><b>${name}</b><small>${desc}</small><div class="purpose">${purpose}</div></button>`;
  if(room==='atelier')return [
    make('🧹','Restore & Reset','Sort the room’s chaos into the right zones.','reset-front',state.progress.frontReset?'Practice · Focus XP':'MAIN OBJECTIVE'),
    make('🛍️','Source the Rack','Read a brief and identify the strongest thrift find.','thrift',state.progress.sourced>=2?'Practice · coins':'MAIN OBJECTIVE'),
    make('🪞','Style a Client','Build a look by reasoning from a client brief.','style',state.progress.styled?'Practice · Styling XP':'MAIN OBJECTIVE')
  ].join('');
  if(room==='lab')return [
    make('🧺','Restore Cabinet','Sort mystery bottles and tools by purpose.','reset-lab',state.progress.labReset?'Practice · Focus XP':'MAIN OBJECTIVE'),
    make('🔬','Note Study','Classify notes by role and fragrance family.','scent-study',state.progress.scentPractice>=2?'Practice · Scentcraft XP':'MAIN OBJECTIVE'),
    make('🧴','Blend Commission','Translate a scent brief into a balanced formula.','scent-commission',state.progress.scentCommission?'Practice · coins':'MAIN OBJECTIVE')
  ].join('');
  if(room==='kitchen')return [
    make('🧽','Restore Stations','Sort kitchen equipment and rescue the prep flow.','reset-kitchen',state.progress.kitchenReset?'Practice · Focus XP':'MAIN OBJECTIVE'),
    make('🍰','Fill an Order','Sequence a recipe, scale an ingredient, then judge doneness.','bake',state.progress.baked>=2?'Practice · Baking XP':'MAIN OBJECTIVE'),
    make('🧾','Cost the Menu','Use unit cost and yield to choose a sustainable price.','budget',state.progress.budget?'Practice · coins':'MAIN OBJECTIVE')
  ].join('');
  if(room==='archive')return [
    make('🗂️','Restore Archive','Sort records by the system hidden in their labels.','reset-archive',state.progress.archiveReset?'Practice · Focus XP':'MAIN OBJECTIVE'),
    make('🔐','Decode a Cipher','Solve patterns, sequences, and small logic deductions.','cipher',state.progress.ciphers>=3?'Practice · Lore XP':'MAIN OBJECTIVE'),
    make('🕯️','Recover a Fragment','Use clues from the room to identify a hidden record.','fragment',state.progress.fragments>=2?'Practice · Lore XP':'MAIN OBJECTIVE')
  ].join('');
  return [
    make('🪩','Style Showcase','Build the outfit story for opening night.','final-style',state.progress.finalStyle?'Replay · Styling':'FINAL PREP'),
    make('🧴','Opening Scent','Bottle the fragrance guests will remember.','final-scent',state.progress.finalScent?'Replay · Scentcraft':'FINAL PREP'),
    make('🍰','Midnight Table','Finish the bake service for the opening.','final-bake',state.progress.finalBake?'Replay · Baking':'FINAL PREP'),
    make('📜','House Inscription','Solve the final archive clue and choose the sign.','final-lore',state.progress.finalLore?'Replay · Lore':'FINAL PREP'),
    state.chapter>=5?make('🏆','Festival Gauntlet','Replay the four-room mastery challenge.','festival','POSTGAME CHALLENGE'):''
  ].join('');
}

function actionIcon(a=''){if(a.includes('style')||a==='thrift')return '🪞';if(a.includes('scent'))return '🧪';if(a.includes('bake')||a==='budget')return '🧁';if(a.includes('archive')||a==='cipher'||a==='fragment'||a.includes('lore'))return '📚';if(a.includes('reset'))return '🧹';if(a.includes('boss')||a==='festival')return '🏆';return '💌';}
function prettyAction(a){return ({'reset-front':'Room Reset',thrift:'Thrift Brief',style:'Client Styling','scent-study':'Note Study','scent-commission':'Scent Commission',bake:'Bakery Order',budget:'Menu Costing',cipher:'Archive Cipher',fragment:'Memory Fragment','boss-style':'First Window','boss-scent':'House Signature','boss-bake':'Midnight Tasting','boss-archive':'Locked Room',festival:'Moonlight Opening'})[a]||a.replace(/-/g,' ').replace(/\b\w/g,m=>m.toUpperCase());}

function startAction(action){
  if(!state.started)return;
  if(action.startsWith('boss-')||action==='festival'){
    if(state.actions<=0){toast('You need one action to attempt a finale.');return;}
  } else if(state.actions<=0){toast('No actions left tonight. End the night first.');return;}
  const map={
    'reset-front':()=>startSortGame('frontReset','Front Room Reset','house'),
    'reset-lab':()=>startSortGame('labReset','Scent Cabinet Reset','scent'),
    'reset-kitchen':()=>startSortGame('kitchenReset','Kitchen Reset','bake'),
    'reset-archive':()=>startSortGame('archiveReset','Archive Reset','archive'),
    thrift:startThriftGame,style:()=>startStyleGame('styled'),
    'scent-study':startScentStudy,'scent-commission':()=>startScentBlend('scentCommission'),
    bake:()=>startBakeGame('baked'),budget:startBudgetGame,cipher:startCipherGame,fragment:startFragmentGame,
    'final-style':()=>startStyleGame('finalStyle',true),'final-scent':()=>startScentBlend('finalScent',true),'final-bake':()=>startBakeGame('finalBake',true),'final-lore':()=>startCipherGame('finalLore',true),
    'boss-style':()=>startBoss('style'),'boss-scent':()=>startBoss('scent'),'boss-bake':()=>startBoss('bake'),'boss-archive':()=>startBoss('archive'),festival:startFestival
  };
  if(map[action])map[action]();else toast('That activity is not available yet.');
}

function openModal(html,theme=''){const m=$('#modal');$('#modalCard').className=`modal-card ${theme?'theme-'+theme:''}`;$('#modalCard').innerHTML=html;m.classList.remove('hidden');}
function closeModal(){if(activeGame&&activeGame.lockClose){toast('Finish the challenge or use Abandon.');return;}$('#modal').classList.add('hidden');activeGame=null;}
function modalHead(kicker,title,instruction,theme=''){return `<div class="modal-head"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2></div><button class="close" onclick="abandonGame()">×</button></div><p class="game-instruction">${instruction}</p>`;}
function abandonGame(){activeGame=null;$('#modal').classList.add('hidden');}
function finishGame(key,score,{progressId=null,progressAmt=1,coins=8,rep=4,skill='focus',xp=22,relation=null,boss=false,finaleIndex=null,customMsg=''}={}){
  recordMastery(key,score);
  if(progressId && score>=66)addProgress(progressId,progressAmt);
  if(relation && score>=58)addRelation(relation,score>=85?15:10);
  const r=reward({score,coins,rep,skill,xp});
  const g=grade(score);activeGame=null;
  save();
  openModal(`${modalHead('CHALLENGE COMPLETE',`${g}-Rank · ${score}%`,'Your result changed something concrete in the house.')}<div class="result-grade">${g}</div><div class="result-grid"><div class="result-stat"><b>+${r.coins}</b><small>coins</small></div><div class="result-stat"><b>+${r.rep}</b><small>reputation</small></div><div class="result-stat"><b>+${r.xp}</b><small>${skillLabel(skill)} XP</small></div></div><p class="small muted">${customMsg||resultMessage(score,progressId)}</p><button class="btn primary" onclick="closeResultAndRender()">Back to the house</button>`);
}
function closeResultAndRender(){closeModal();render();}
function resultMessage(score,pid){if(score>=90)return pid?'That was strong enough to advance the objective—and then some.':'Personal best material.';if(score>=66)return pid?'Objective advanced. B-rank is enough to count.':'Solid work.';if(score>=58)return 'You learned from it, but this chapter objective needs a B-rank or better.';return 'No penalty beyond the spent action. Try again when you feel like it.';}

// -------- SORT / RESTORATION --------
const SORT_SETS={
  front:[['Silver chain belt','Display'],['Empty coffee cup','Trash'],['Price tags','Worktable'],['Burgundy blouse','Display'],['Loose receipts','Worktable'],['Broken hanger','Trash']],
  lab:[['Blotter strips','Tools'],['Vanilla absolute','Materials'],['Cracked vial','Discard'],['Glass pipette','Tools'],['Bergamot oil','Materials'],['Mystery sludge','Discard']],
  kitchen:[['Offset spatula','Tools'],['Expired cream','Discard'],['Flour bag','Pantry'],['Whisk','Tools'],['Sugar jar','Pantry'],['Burnt parchment','Discard']],
  archive:[['Undated flyer','Ephemera'],['Ledger volume','Records'],['Molded clipping','Quarantine'],['Receipt book','Records'],['Festival ticket','Ephemera'],['Water-damaged file','Quarantine']]
};
function startSortGame(progressId,title,theme){
  if(!useAction())return;
  const set=progressId.includes('lab')?SORT_SETS.lab:progressId.includes('kitchen')?SORT_SETS.kitchen:progressId.includes('archive')?SORT_SETS.archive:SORT_SETS.front;
  activeGame={type:'sort',progressId,title,theme,items:shuffle(set),i:0,correct:0};renderSortGame();
}
function renderSortGame(){const g=activeGame,item=g.items[g.i];const cats=[...new Set(g.items.map(x=>x[1]))];openModal(`${modalHead('RESTORATION CHALLENGE',g.title,'Sort each object into the correct zone. You need at least 4/6 for B-rank.',g.theme)}<div class="game-status"><span class="score-pill">Item ${g.i+1}/${g.items.length}</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>${item[0]}</blockquote></div><div class="puzzle-grid ${cats.length===3?'three':'two'}">${cats.map(c=>`<button class="puzzle-btn" onclick="sortPick('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('')}</div>`,`$${g.theme}`.slice(1));}
function sortPick(choice){const g=activeGame;if(!g)return;if(choice===g.items[g.i][1])g.correct++;g.i++;if(g.i>=g.items.length){const score=Math.round(g.correct/g.items.length*100);finishGame(g.progressId,score,{progressId:g.progressId,coins:5,rep:4,skill:'focus',xp:25});}else renderSortGame();}

// -------- THRIFT BRIEF --------
const THRIFT_ROUNDS=[
  {brief:'Find something dark, textured, and easy to build an outfit around.',options:[['Brown leopard shoulder bag',['dark','texture','versatile']],['Neon floral scarf',['bright','floral']],['White sequin shrug',['light','sparkle']],['Plain gray tee',['neutral']]],need:['dark','texture','versatile']},
  {brief:'The window needs one silver accent without turning futuristic.',options:[['Silver chain belt',['silver','accent']],['Chrome space boots',['silver','futuristic']],['Gold charm necklace',['gold','accent']],['Black cardigan',['dark','basic']]],need:['silver','accent']},
  {brief:'Jules wants “Y2K, but grown.” Choose the strongest piece.',options:[['Burgundy fitted moto jacket',['y2k','polished','burgundy']],['Hot-pink slogan tee',['y2k','juvenile']],['Office blazer',['polished']],['Cow-print pajama pants',['novelty']]],need:['y2k','polished']}
];
function startThriftGame(){if(!useAction())return;activeGame={type:'thrift',rounds:shuffle(THRIFT_ROUNDS).slice(0,3),i:0,correct:0};renderThrift();}
function renderThrift(){const g=activeGame,r=g.rounds[g.i];openModal(`${modalHead('SOURCE THE RACK','Thrift Brief','Read the brief. Pick the piece that satisfies the most important constraints—not simply the rarest-looking thing.','style')}<div class="game-status"><span class="score-pill">Brief ${g.i+1}/3</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>“${r.brief}”</blockquote></div><div class="puzzle-grid two">${shuffle(r.options.map((o,i)=>({o,i}))).map(x=>`<button class="puzzle-btn" onclick="thriftPick(${x.i})"><b>${x.o[0]}</b><br><small class="muted">${x.o[1].join(' · ')}</small></button>`).join('')}</div>`,'style');}
function thriftPick(i){const g=activeGame,r=g.rounds[g.i];const tags=r.options[i][1];const best=Math.max(...r.options.map(o=>r.need.filter(n=>o[1].includes(n)).length));const got=r.need.filter(n=>tags.includes(n)).length;if(got===best)g.correct++;g.i++;if(g.i>=g.rounds.length){const score=Math.round(g.correct/3*100);if(score>=66)addProgress('sourced',1);finishGame('thrift',score,{coins:12,rep:5,skill:'styling',xp:24,customMsg:score>=66?'One display-worthy piece is now sourced for the atelier.':'The rack stays a little empty. Replay when you want another shot.'});}else renderThrift();}

// -------- STYLE --------
const STYLE_ROUNDS=[
 {brief:'Dinner after work. She wants dark Y2K, but still intentional.',answers:['Burgundy fitted top + black flares + silver bag','Logo hoodie + pajama pants','Three leopard pieces together'],good:0},
 {brief:'The outfit already has patterned jeans. What keeps it balanced?',answers:['Add another loud patterned top','Use a simpler top and let the jeans lead','Match every accessory to the pattern'],good:1},
 {brief:'She wants visual interest without feeling overdressed.',answers:['Mix one texture with a clean silhouette','Add maximum jewelry everywhere','Remove every accessory'],good:0}
];
function startStyleGame(progressId,final=false){if(!useAction())return;activeGame={type:'style',progressId,final,rounds:shuffle(STYLE_ROUNDS),i:0,correct:0};renderStyleGame();}
function renderStyleGame(){const g=activeGame,r=g.rounds[g.i];openModal(`${modalHead(g.final?'OPENING PREP':'CLIENT CHALLENGE',g.final?'Showcase Styling':'Style a Client','Use the brief to choose the strongest styling decision. Three decisions make the full look.','style')}<div class="game-status"><span class="score-pill">Decision ${g.i+1}/3</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>${r.brief}</blockquote></div><div class="puzzle-grid">${r.answers.map((a,i)=>`<button class="puzzle-btn" onclick="stylePick(${i})">${a}</button>`).join('')}</div>`,'style');}
function stylePick(i){const g=activeGame,r=g.rounds[g.i];if(i===r.good)g.correct++;g.i++;if(g.i>=3){const score=Math.round(g.correct/3*100);finishGame(g.final?'final-style':'style',score,{progressId:g.progressId,coins:g.final?14:10,rep:g.final?9:6,skill:'styling',xp:g.final?35:27});}else renderStyleGame();}

// -------- SCENT STUDY --------
const NOTES=[
 {n:'Bergamot',role:'Top',family:'Citrus'},{n:'Pear',role:'Top',family:'Fruity'},{n:'Orange Blossom',role:'Heart',family:'Floral'},{n:'Jasmine',role:'Heart',family:'Floral'},{n:'Vanilla',role:'Base',family:'Gourmand'},{n:'Sandalwood',role:'Base',family:'Woody'},{n:'Marshmallow',role:'Base',family:'Gourmand'},{n:'Pink Pepper',role:'Top',family:'Spicy'}
];
function startScentStudy(){if(!useAction())return;activeGame={type:'scentStudy',questions:shuffle(NOTES).slice(0,5),i:0,correct:0,phase:0};renderScentStudy();}
function renderScentStudy(){const g=activeGame,n=g.questions[g.i];const askRole=g.phase===0;const opts=askRole?['Top','Heart','Base']:['Citrus','Fruity','Floral','Gourmand','Woody','Spicy'];openModal(`${modalHead('SCENT STUDY','Build the Note Pyramid',askRole?'First: where does this note usually sit in a simple fragrance pyramid?':'Now: which family best describes it?','scent')}<div class="game-status"><span class="score-pill">Note ${g.i+1}/${g.questions.length}</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>${n.n}</blockquote></div><div class="puzzle-grid three">${opts.map(o=>`<button class="puzzle-btn" onclick="scentStudyPick('${o}')">${o}</button>`).join('')}</div>`,'scent');}
function scentStudyPick(v){const g=activeGame,n=g.questions[g.i];const correct=g.phase===0?n.role:n.family;if(v===correct)g.correct++;if(g.phase===0){g.phase=1;renderScentStudy();}else{g.phase=0;g.i++;if(g.i>=g.questions.length){const score=Math.round(g.correct/(g.questions.length*2)*100);finishGame('scent-study',score,{progressId:'scentPractice',coins:7,rep:4,skill:'scent',xp:30});}else renderScentStudy();}}

// -------- SCENT BLEND --------
const SCENT_BRIEFS=[
 {text:'Sweet and soft, but with enough brightness that it never becomes syrupy.',best:{top:'Bergamot',heart:'Orange Blossom',base:'Vanilla'}},
 {text:'Fluffy gourmand with a clean floral center and a playful opening.',best:{top:'Pear',heart:'Jasmine',base:'Marshmallow'}},
 {text:'Warm, polished, and less dessert-like than the other house blends.',best:{top:'Pink Pepper',heart:'Orange Blossom',base:'Sandalwood'}}
];
function startScentBlend(progressId,final=false){if(!useAction())return;const brief=final?SCENT_BRIEFS[0]:pick(SCENT_BRIEFS);activeGame={type:'scentBlend',progressId,final,brief,picks:{top:null,heart:null,base:null},phase:'notes'};renderScentBlend();}
function renderScentBlend(){const g=activeGame;if(g.phase==='notes'){
  const groups={top:NOTES.filter(n=>n.role==='Top'),heart:NOTES.filter(n=>n.role==='Heart'),base:NOTES.filter(n=>n.role==='Base')};
  openModal(`${modalHead(g.final?'OPENING PREP':'COMMISSION','Translate the Scent Brief','Choose one top, heart, and base note. Then you’ll balance the formula.','scent')}<div class="brief-card"><blockquote>“${g.brief.text}”</blockquote></div><div class="perfume-pyramid">${['top','heart','base'].map(role=>`<div class="pyramid-col"><div class="eyebrow">${role.toUpperCase()}</div>${groups[role].map(n=>`<button class="note-chip ${g.picks[role]===n.n?'selected':''}" onclick="pickBlendNote('${role}','${n.n}')">${n.n}<br><small class="muted">${n.family}</small></button>`).join('')}</div>`).join('')}</div><button class="btn primary" ${Object.values(g.picks).every(Boolean)?'':'disabled'} onclick="blendToBalance()">Balance formula →</button>`,'scent');
 }else renderBlendBalance();}
function pickBlendNote(role,n){activeGame.picks[role]=n;renderScentBlend();}
function blendToBalance(){activeGame.phase='balance';activeGame.ratio=35;renderBlendBalance();}
function renderBlendBalance(){const g=activeGame;openModal(`${modalHead('FORMULATION','Balance the Accord','Aim for the highlighted zone. The marker moves; stop it when the blend feels balanced.','scent')}<div class="brief-card"><b>${g.picks.top} / ${g.picks.heart} / ${g.picks.base}</b><p class="small muted">Think “lift → body → lasting warmth,” not equal amounts.</p></div><div class="meter"><div class="meter-target" style="left:43%;width:18%"></div><div id="blendMarker" class="meter-marker" style="left:0"></div></div><div style="margin-top:15px"><button class="btn gold" onclick="stopBlendMeter()">Bottle it</button></div>`,'scent');startMeter('blendMarker');}
let meterTimer=null,meterPos=0,meterDir=1;
function startMeter(id){clearInterval(meterTimer);meterPos=2;meterDir=1;meterTimer=setInterval(()=>{meterPos+=meterDir*2;if(meterPos>=98||meterPos<=2)meterDir*=-1;const el=document.getElementById(id);if(el)el.style.left=meterPos+'%';else clearInterval(meterTimer);},28);}
function stopBlendMeter(){clearInterval(meterTimer);const g=activeGame;const noteScore=['top','heart','base'].reduce((s,k)=>s+(g.picks[k]===g.brief.best[k]?1:0),0)/3*70;const balance=Math.max(0,30-Math.abs(meterPos-52)*1.4);const score=Math.round(clamp(noteScore+balance,0,100));finishGame(g.final?'final-scent':'scent-commission',score,{progressId:g.progressId,coins:g.final?15:12,rep:g.final?9:6,skill:'scent',xp:g.final?38:30});}

// -------- BAKING --------
const BAKE_ORDERS=[
 {name:'Carrot Loaf',steps:['Mix dry ingredients','Whisk wet ingredients','Fold wet into dry','Fold in carrots','Bake'],scale:{q:'A recipe uses 1½ cups flour. Half batch?',a:'¾ cup',opts:['¾ cup','1 cup','½ cup']},done:{q:'Toothpick has a few moist crumbs, no wet batter. What now?',a:'Pull it',opts:['Pull it','Bake 15 more minutes','Turn temperature way up']}},
 {name:'Fudge Brownies',steps:['Melt butter','Whisk sugar + eggs','Add cocoa and flour','Fold until just combined','Bake'],scale:{q:'Recipe uses ⅔ cup cocoa. Half batch?',a:'⅓ cup',opts:['⅓ cup','½ cup','¼ cup']},done:{q:'Edges set, center has fudgy crumbs—not liquid. What now?',a:'Pull it',opts:['Pull it','Wait until toothpick is bone-dry','Add water']}},
 {name:'Vanilla Snack Cake',steps:['Cream butter + sugar','Beat in eggs','Add dry + milk alternately','Spread in pan','Bake'],scale:{q:'Recipe uses ¾ cup sugar. Double batch?',a:'1½ cups',opts:['1½ cups','1 cup','2¼ cups']},done:{q:'Center springs back lightly and tester is clean. What now?',a:'Pull it',opts:['Pull it','Bake until dark brown','Open oven and leave it inside']}},
];
function startBakeGame(progressId,final=false){if(!useAction())return;activeGame={type:'bake',progressId,final,order:pick(BAKE_ORDERS),chosen:[],phase:'sequence',correct:0};renderBake();}
function renderBake(){const g=activeGame;if(g.phase==='sequence'){
  const remaining=g.order.steps.filter(x=>!g.chosen.includes(x));openModal(`${modalHead(g.final?'OPENING PREP':'BAKERY ORDER',g.order.name,'Build the recipe in order. Pick the next correct step each time.','bake')}<div class="game-status"><span class="score-pill">Sequence ${g.chosen.length}/${g.order.steps.length}</span></div><div class="sequence-row">${g.chosen.map(x=>`<span class="sequence-card">✓ ${x}</span>`).join('')}</div><div class="divider"></div><div class="puzzle-grid two">${shuffle(remaining).map(x=>`<button class="puzzle-btn" onclick="bakeStep('${x.replace(/'/g,"\\'")}')">${x}</button>`).join('')}</div>`,'bake');
 }else if(g.phase==='scale')openModal(`${modalHead('BAKERY ORDER','Scale the Recipe','A little fraction math before the pan goes in.','bake')}<div class="brief-card"><blockquote>${g.order.scale.q}</blockquote></div><div class="puzzle-grid three">${g.order.scale.opts.map(x=>`<button class="puzzle-btn" onclick="bakeScale('${x}')">${x}</button>`).join('')}</div>`,'bake');
 else openModal(`${modalHead('BAKERY ORDER','Judge Doneness','The timer is a clue, not a verdict. Read the bake.','bake')}<div class="brief-card"><blockquote>${g.order.done.q}</blockquote></div><div class="puzzle-grid">${g.order.done.opts.map(x=>`<button class="puzzle-btn" onclick="bakeDone('${x.replace(/'/g,"\\'")}')">${x}</button>`).join('')}</div>`,'bake');}
function bakeStep(x){const g=activeGame;const expected=g.order.steps[g.chosen.length];if(x===expected)g.correct++;g.chosen.push(x);if(g.chosen.length>=g.order.steps.length){g.phase='scale';renderBake();}else renderBake();}
function bakeScale(x){const g=activeGame;if(x===g.order.scale.a)g.correct+=2;g.phase='done';renderBake();}
function bakeDone(x){const g=activeGame;if(x===g.order.done.a)g.correct+=2;const score=Math.round(g.correct/(g.order.steps.length+4)*100);finishGame(g.final?'final-bake':'bake',score,{progressId:g.progressId,coins:g.final?16:12,rep:g.final?9:6,skill:'baking',xp:g.final?38:30});}

// -------- BUDGET --------
const BUDGET_Q=[
 {q:'12 brownies cost $9.60 to make. Ingredient cost per brownie?',opts:['$0.80','$1.20','$0.60'],good:0},
 {q:'A loaf costs $4 to make. Which price leaves the strongest room for packaging + labor?',opts:['$4.25','$5.00','$8.00'],good:2},
 {q:'A $16 batch makes 8 slices. At $5/slice, gross revenue?',opts:['$24','$40','$80'],good:1}
];
function startBudgetGame(){if(!useAction())return;activeGame={type:'budget',qs:shuffle(BUDGET_Q),i:0,correct:0};renderBudget();}
function renderBudget(){const g=activeGame,q=g.qs[g.i];openModal(`${modalHead('KITCHEN MANAGEMENT','Cost the Menu','Tiny business math. No spreadsheet dungeon required.','bake')}<div class="game-status"><span class="score-pill">Question ${g.i+1}/3</span></div><div class="brief-card"><blockquote>${q.q}</blockquote></div><div class="puzzle-grid three">${q.opts.map((x,i)=>`<button class="puzzle-btn" onclick="budgetPick(${i})">${x}</button>`).join('')}</div>`,'bake');}
function budgetPick(i){const g=activeGame;if(i===g.qs[g.i].good)g.correct++;g.i++;if(g.i>=3){const score=Math.round(g.correct/3*100);finishGame('budget',score,{progressId:'budget',coins:10,rep:4,skill:'focus',xp:25});}else renderBudget();}

// -------- ARCHIVE --------
const CIPHERS=[
 {q:'2 · 4 · 8 · 16 · ?',opts:['18','24','32','30'],good:2,why:'Each number doubles.'},
 {q:'A1 · C3 · E5 · G7 · ?',opts:['H8','I9','J10','I8'],good:1,why:'Letters and numbers both advance by two.'},
 {q:'The margin marks pages 3, 6, 12, 24. Next?',opts:['27','30','48','36'],good:2,why:'The sequence doubles after 3.'},
 {q:'If NORTH = 5 and EAST = 4, ARCHIVE = ?',opts:['7','6','8','5'],good:0,why:'The code is simply word length.'}
];
function startCipherGame(progressId='ciphers',final=false){if(!useAction())return;activeGame={type:'cipher',progressId,final,qs:shuffle(CIPHERS).slice(0,3),i:0,correct:0};renderCipher();}
function renderCipher(){const g=activeGame,q=g.qs[g.i];openModal(`${modalHead(g.final?'OPENING PREP':'ARCHIVE PUZZLE',g.final?'House Inscription':'Decode the Margin','Solve the pattern. The Archive rewards noticing rules, not guessing lore.','archive')}<div class="game-status"><span class="score-pill">Cipher ${g.i+1}/3</span><span class="score-pill">Solved ${g.correct}</span></div><div class="brief-card"><blockquote>${q.q}</blockquote></div><div class="puzzle-grid two">${q.opts.map((x,i)=>`<button class="puzzle-btn" onclick="cipherPick(${i})">${x}</button>`).join('')}</div>`,'archive');}
function cipherPick(i){const g=activeGame;if(i===g.qs[g.i].good)g.correct++;g.i++;if(g.i>=g.qs.length){const score=Math.round(g.correct/3*100);finishGame(g.final?'final-lore':'cipher',score,{progressId:g.progressId,coins:g.final?14:9,rep:g.final?9:5,skill:'lore',xp:g.final?38:30});}else renderCipher();}

// -------- FRAGMENT DEDUCTION --------
const FRAGMENTS=[
 {clue:'The missing record is newer than the 1988 ledger, older than the 1996 flyer, and it is not a receipt.',opts:[['1992 Festival Program',true],['1984 Receipt Book',false],['1999 Menu Card',false]],title:'Fragment: Opening Night'},
 {clue:'Look for the item filed under a person, not an event; the initials are V.H., and the paper mentions “Nocturne.”',opts:[['Velma Hart letter',true],['Moonlight Festival poster',false],['Kitchen inventory',false]],title:'Fragment: The First Owner'}
];
function startFragmentGame(){if(!useAction())return;const idx=Math.min(state.progress.fragments,1);const f=FRAGMENTS[idx];activeGame={type:'fragment',f};openModal(`${modalHead('ARCHIVE SEARCH',f.title,'Use every clue. There is one record that satisfies all of them.','archive')}<div class="brief-card"><blockquote>${f.clue}</blockquote></div><div class="puzzle-grid">${f.opts.map((x,i)=>`<button class="puzzle-btn" onclick="fragmentPick(${i})">${x[0]}</button>`).join('')}</div>`,'archive');}
function fragmentPick(i){const g=activeGame;const score=g.f.opts[i][1]?100:45;finishGame('fragment',score,{progressId:'fragments',coins:8,rep:6,skill:'lore',xp:28,customMsg:score>=66?'You recovered a real piece of the house’s history. It has been added to the Archive.':'Wrong record. The clue stays available for another night.'});}

// -------- RELATIONSHIP CHALLENGE --------
function openPerson(id,side=false){const n=NPCS[id];if(!n||state.chapter<n.unlock){toast('You haven’t met them yet.');return;}currentScreen='people';if(state.actions<=0){toast('No actions left tonight.');renderPeople();return;}const q=pick(n.talks);activeGame={type:'talk',id,n,q,side};renderDialogue();}
function renderDialogue(){const g=activeGame,n=g.n,q=g.q;$('#screen').innerHTML=`<section class="dialogue-scene"><div class="dialogue-inner"><div class="eyebrow">READ THE ROOM • RELATIONSHIP CHALLENGE</div><div class="dialogue-stage"><div class="scene-detail"></div><div class="portrait-large">${n.icon}</div><div class="dialogue-box"><div class="dialogue-name">${n.name}</div><div class="dialogue-text">${q.q}</div><div class="choice-list">${q.choices.map((c,i)=>`<button class="choice" onclick="talkPick(${i})">${c}</button>`).join('')}</div></div></div><div class="scene-actions"><button class="btn ghost" onclick="abandonTalk()">← Leave without spending an action</button></div></div></section>`;}
function abandonTalk(){activeGame=null;setScreen('people');}
function talkPick(i){const g=activeGame;if(!useAction()){setScreen('people');return;}const score=i===g.q.good?100:55;const gain=score>=85?18:7;addRelation(g.id,gain);if(g.side)state.sideDone[g.side?`${state.day}-${g.id}`:'']=true;recordMastery(`talk-${g.id}`,score);const r=reward({score,coins:3,rep:3,skill:'focus',xp:15});save();activeGame=null;openModal(`${modalHead('RELATIONSHIP','You read the room.','People remember whether you actually listened.')}<div class="result-grade">${grade(score)}</div><p>${score>=85?`${g.n.name} looks impressed. +${gain} bond.`:`Not disastrous, but ${g.n.name} definitely files that answer away. +${gain} bond.`}</p><button class="btn primary" onclick="closeDialogueResult()">Continue</button>`);}
function closeDialogueResult(){closeModal();setScreen('people');}

// -------- BOSSES --------
function startBoss(kind){if(!chapterReady()){toast('Finish the chapter objectives first.');return;}if(!useAction())return;const cfg={
 style:{title:'The First Window',desc:'Three briefs. No hints. Score B or better to open the next room.',qs:STYLE_ROUNDS},
 scent:{title:'House Signature No. 01',desc:'Prove you understand note roles and balance.',qs:null},
 bake:{title:'The Midnight Tasting',desc:'A final order with sequence, math, and doneness.',qs:null},
 archive:{title:'The Room Behind the Room',desc:'A chained logic lock with four questions.',qs:CIPHERS}
 }[kind];
 activeGame={type:'boss',kind,cfg,step:0,correct:0};
 if(kind==='style')renderBossQuestions();else if(kind==='archive')renderBossQuestions();else if(kind==='scent')renderBossScent();else renderBossBake();
}
function renderBossQuestions(){const g=activeGame,qs=g.cfg.qs,q=qs[g.step];const opts=q.answers||q.opts;const good=q.good;openModal(`${modalHead('CHAPTER FINALE',g.cfg.title,g.cfg.desc,g.kind==='archive'?'archive':'style')}<div class="game-status"><span class="score-pill">Stage ${g.step+1}/${qs.length}</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>${q.brief||q.q}</blockquote></div><div class="puzzle-grid">${opts.map((x,i)=>`<button class="puzzle-btn" onclick="bossQuestionPick(${i},${good})">${x}</button>`).join('')}</div>`,g.kind==='archive'?'archive':'style');}
function bossQuestionPick(i,good){const g=activeGame;if(i===good)g.correct++;g.step++;if(g.step>=g.cfg.qs.length){const score=Math.round(g.correct/g.cfg.qs.length*100);finishBoss(score);}else renderBossQuestions();}
function renderBossScent(){const g=activeGame;g.sq=g.sq||shuffle(NOTES).slice(0,6);const n=g.sq[g.step];openModal(`${modalHead('CHAPTER FINALE','House Signature No. 01','Classify six notes correctly. This is the knowledge check before the bottle gets your house name.','scent')}<div class="game-status"><span class="score-pill">Note ${g.step+1}/6</span><span class="score-pill">Correct ${g.correct}</span></div><div class="brief-card"><blockquote>${n.n}</blockquote></div><div class="puzzle-grid three">${['Top','Heart','Base'].map(x=>`<button class="puzzle-btn" onclick="bossScentPick('${x}')">${x}</button>`).join('')}</div>`,'scent');}
function bossScentPick(v){const g=activeGame;if(v===g.sq[g.step].role)g.correct++;g.step++;if(g.step>=6)finishBoss(Math.round(g.correct/6*100));else renderBossScent();}
function renderBossBake(){const g=activeGame;g.bq=g.bq||[
 {q:'Half of 1½ cups flour?',o:['¾ cup','1 cup','½ cup'],a:0},{q:'What prevents a tough cake crumb?',o:['Mix forever','Mix just until combined','Add extra flour'],a:1},{q:'Tester has wet batter?',o:['Pull it','Keep baking and recheck','Freeze it'],a:1},{q:'24 cupcakes, 6 per box. Boxes needed?',o:['3','4','6'],a:1}
];const q=g.bq[g.step];openModal(`${modalHead('CHAPTER FINALE','The Midnight Tasting','Four rapid decisions. Bea is absolutely pretending not to watch.','bake')}<div class="game-status"><span class="score-pill">Stage ${g.step+1}/4</span></div><div class="brief-card"><blockquote>${q.q}</blockquote></div><div class="puzzle-grid three">${q.o.map((x,i)=>`<button class="puzzle-btn" onclick="bossBakePick(${i})">${x}</button>`).join('')}</div>`,'bake');}
function bossBakePick(i){const g=activeGame;if(i===g.bq[g.step].a)g.correct++;g.step++;if(g.step>=4)finishBoss(Math.round(g.correct/4*100));else renderBossBake();}
function finishBoss(score){const idx=state.chapter;recordMastery(`boss-${idx}`,score);const passed=score>=66;if(passed){state.bossDone[idx]=true;addKeepsake(idx);state.reputation+=15;state.coins+=20;state.nightLog.push({type:'finale',score,chapter:idx});save();activeGame=null;openModal(`${modalHead('CHAPTER COMPLETE',`${grade(score)}-Rank · ${CHAPTERS[idx].boss.name}`,'You proved the room works. The next part of the house can finally open.')}<div class="result-grade">${grade(score)}</div><p>${chapterCompleteStory(idx)}</p><div class="result-grid"><div class="result-stat"><b>+20</b><small>coins</small></div><div class="result-stat"><b>+15</b><small>reputation</small></div><div class="result-stat"><b>${KEEPSAKES[idx][0]}</b><small>keepsake</small></div></div><button class="btn gold" onclick="advanceChapter()">Open the next door →</button>`);}else{save();activeGame=null;openModal(`${modalHead('FINALE ATTEMPT',`${grade(score)}-Rank · Not quite`,'No chapter reset. No lost progress. You just need B-rank or better on the finale.')}<div class="result-grade">${grade(score)}</div><p class="small muted">Your objectives remain complete. Try the finale again on another action.</p><button class="btn primary" onclick="closeResultAndRender()">Back to house</button>`);}}
function chapterCompleteStory(i){return [
  'Jules hangs the burgundy jacket in the window. Someone outside actually stops to look. The house has its first reason to keep the lights on.',
  'Mina writes “Velvet House No. 01” on the label in tiny perfect lettering. The next door clicks open while neither of you is touching it.',
  'Bea leaves a handwritten tasting card on the counter. Behind the pantry shelving, you notice a seam in the wall that absolutely was not there yesterday.',
  'The last brass lock opens. Inside is the original moon-shaped house sign—and an invitation that was apparently waiting decades for someone to finish the rooms.'
 ][i]||'The house changes around you.';}
function advanceChapter(){closeModal();state.chapter=Math.min(state.chapter+1,5);save();currentScreen='house';render();toast(`${chapter().icon} ${chapter().name} unlocked.`);}

// -------- FESTIVAL --------
function startFestival(){if(state.chapter<4||!chapterReady()){toast('Finish the opening preparations first.');return;}if(!useAction())return;activeGame={type:'festival',step:0,correct:0,qs:[
 {room:'STYLE',q:'Patterned jeans are the focal point. Best supporting top?',o:['Simple fitted black top','Leopard blouse','Another printed top'],a:0},
 {room:'SCENT',q:'Which note usually gives the longest-lasting foundation?',o:['Bergamot','Vanilla','Pear'],a:1},
 {room:'BAKE',q:'A half batch of ¾ cup sugar is…',o:['⅜ cup','½ cup','¼ cup'],a:0},
 {room:'ARCHIVE',q:'4 · 8 · 16 · 32 · ?',o:['40','48','64'],a:2}
 ]};renderFestival();}
function renderFestival(){const g=activeGame,q=g.qs[g.step];openModal(`${modalHead('THE MOONLIGHT OPENING',`${q.room} · Stage ${g.step+1}/4`,'One challenge from every restored room. This is the whole campaign compressed into four decisions.','house')}<div class="game-status"><span class="score-pill">Correct ${g.correct}</span><span class="score-pill">Stage ${g.step+1}/4</span></div><div class="brief-card"><blockquote>${q.q}</blockquote></div><div class="puzzle-grid three">${q.o.map((x,i)=>`<button class="puzzle-btn" onclick="festivalPick(${i})">${x}</button>`).join('')}</div>`,'house');}
function festivalPick(i){const g=activeGame;if(i===g.qs[g.step].a)g.correct++;g.step++;if(g.step>=4){const score=Math.round(g.correct/4*100);if(score>=66){state.bossDone[4]=true;addKeepsake(4);state.reputation+=25;state.coins+=30;recordMastery('festival',score);save();activeGame=null;openModal(`${modalHead('VELVET HOUSE IS OPEN',`${grade(score)}-Rank · Moonlight Opening`,'The campaign is complete. Nothing disappears; the house simply becomes yours.')}<div class="result-grade">${grade(score)}</div><p>The sign goes above the door. Jules fixes the display. Mina lights the scent bar. Bea claims the kitchen. Rowan pretends the Archive was always supposed to open. For the first time, the house feels less like a project and more like a place.</p><button class="btn gold" onclick="finishCampaign()">Enter After Hours ✦</button>`);}else{recordMastery('festival',score);save();activeGame=null;openModal(`${modalHead('OPENING REHEARSAL',`${grade(score)}-Rank`,'The house stays ready. You only need to replay the gauntlet when you want another shot.')}<div class="result-grade">${grade(score)}</div><button class="btn primary" onclick="closeResultAndRender()">Back to house</button>`);}}else renderFestival();}
function finishCampaign(){closeModal();state.chapter=5;save();currentScreen='house';render();}

// -------- NIGHT LOOP --------
function endNight(){
  const actionsUsed=state.nightLog.filter(x=>x.type==='action'||x.type==='finale').length;
  const avg=actionsUsed?Math.round(state.nightLog.filter(x=>x.score!=null).reduce((a,x)=>a+x.score,0)/state.nightLog.filter(x=>x.score!=null).length):0;
  const rep=state.nightLog.reduce((a,x)=>a+(x.rep||0),0),coins=state.nightLog.reduce((a,x)=>a+(x.coins||0),0);
  $('#screen').innerHTML=`<section class="recap"><div class="eyebrow">NIGHT ${state.day} COMPLETE</div><div class="recap-emblem">${actionsUsed?grade(avg):'☾'}</div><h1>${nightTitle(avg,actionsUsed)}</h1><p class="muted">${nightLine()}</p><div class="recap-summary"><div class="recap-box"><b>${actionsUsed}</b><small>actions used</small></div><div class="recap-box"><b>${avg||'—'}${avg?'%':''}</b><small>average score</small></div><div class="recap-box"><b>+${rep}</b><small>reputation tonight</small></div></div><button class="btn gold" onclick="startNextNight()">Start night ${state.day+1} →</button></section>`;
  currentScreen='recap';
}
function nightTitle(avg,n){if(!n)return 'A quiet night still counts.';if(avg>=90)return 'You were locked in.';if(avg>=75)return 'The house moved forward.';return 'Progress, with fingerprints on it.';}
function nightLine(){const rec=recommendedText();return state.chapter>=5?'The lights stay on as long as you want them to.':`Next time, the clearest path is still: ${rec.title}.`;}
function startNextNight(){state.day++;state.actions=3;state.nightLog=[];save();currentScreen='house';render();}

// -------- STORY --------
function showStory(which){
  if(which==='prologue'){
    $('#screen').innerHTML=`<section class="dialogue-scene"><div class="dialogue-inner"><div class="eyebrow">PROLOGUE</div><div class="dialogue-stage"><div class="scene-detail"></div><div class="portrait-large">🏚️</div><div class="dialogue-box"><div class="dialogue-name">The envelope under the door</div><div class="dialogue-text">“VELVET HOUSE was never meant to be one thing. Open a room. Make it useful. When all five lights are on, put the moon back above the door.”</div><div class="choice-list"><button class="choice" onclick="finishPrologue()">Okay. One room at a time.</button></div></div></div></div></section>`;
  }
}
function finishPrologue(){currentScreen='mission';save();render();}

// -------- MENU / SAVE --------
function showMenu(){openModal(`${modalHead('SYSTEM','Velvet House Menu','The boring but necessary drawer.')}<div class="menu-list"><button onclick="endNight();closeModal()">🌘 End current night</button><button onclick="exportSave()">💾 Export save file</button><button onclick="document.getElementById('importFile').click()">📂 Import save file</button><button onclick="confirmReset()">🗑️ Reset campaign</button></div><input id="importFile" type="file" accept="application/json" hidden onchange="importSave(event)">`);}
function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`velvet-house-night-${state.day}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('Save exported.');}
function importSave(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=mergeState(freshState(),JSON.parse(r.result));save();closeModal();currentScreen='house';render();toast('Save imported.');}catch(err){toast('That file does not look like a Velvet House save.');}};r.readAsText(f);}
function confirmReset(){if(confirm('Reset the entire Velvet House campaign? This cannot be undone unless you exported a save.')){localStorage.removeItem(SAVE_KEY);state=freshState();currentScreen='house';closeModal();render();}}

// -------- EVENTS / HOOKS --------
$('#homeBtn').addEventListener('click',()=>setScreen('house'));
$('#chapterBtn').addEventListener('click',()=>setScreen('mission'));
$('#journalBtn').addEventListener('click',()=>setScreen('journal'));
$('#menuBtn').addEventListener('click',showMenu);
$$('.mobile-dock button').forEach(b=>b.addEventListener('click',()=>setScreen(b.dataset.nav)));
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&!activeGame)closeModal();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!activeGame)closeModal();});

// expose functions for inline handlers
Object.assign(window,{beginCampaign,setScreen,setRoom,startAction,endNight,startNextNight,setJournalTab,openPerson,abandonTalk,talkPick,sortPick,thriftPick,stylePick,scentStudyPick,pickBlendNote,blendToBalance,stopBlendMeter,bakeStep,bakeScale,bakeDone,budgetPick,cipherPick,fragmentPick,bossQuestionPick,bossScentPick,bossBakePick,festivalPick,closeModal,abandonGame,closeResultAndRender,closeDialogueResult,advanceChapter,finishCampaign,finishPrologue,showMenu,exportSave,importSave,confirmReset});
render();
