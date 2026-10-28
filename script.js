
// SERVIQ Analytics - Creative Dark Theme - Professional Charts
const CATS = ['IT','HR','Finance','Operations'];
const CAT_COLOR = {IT:'#60a5fa',HR:'#a78bfa',Finance:'#34d399',Operations:'#fbbf24'};
const PRIORITY = ['Critical','High','Medium','Low'];

let tickets = [];

const SAMPLE = [
  {title:'Password reset for finance team',category:'IT',subCategory:'Password Reset',department:'Finance',priority:'Medium',status:'Open',assignee:'Alex Rivera',requesterName:'Nthabiseng Molefe',email:'n.molefe@serviq.com',firstResponseMins:45,createdAt:new Date(Date.now()-86400000*1).toISOString(),description:'Unable to login to SAP after password expiry'},
  {title:'Payslip missing for April',category:'HR',subCategory:'Payslip',department:'HR',priority:'High',status:'Open',assignee:'Jordan Kim',requesterName:'Thabo Nkosi',email:'t.nkosi@serviq.com',firstResponseMins:120,createdAt:new Date(Date.now()-86400000*2).toISOString(),description:'Payslip not generated for April payroll'},
  {title:'Invoice discrepancy Q2',category:'Finance',subCategory:'Invoice',department:'Finance',priority:'Urgent',status:'In Progress',assignee:'Sam Chen',requesterName:'Lerato Dlamini',email:'l.dlamini@serviq.com',firstResponseMins:319,createdAt:new Date(Date.now()-86400000*3).toISOString(),description:'$240 overcharge duplicate subscription'},
  {title:'Warehouse rack maintenance',category:'Operations',subCategory:'Maintenance',department:'Operations',priority:'Medium',status:'In Progress',assignee:'Taylor Brooks',requesterName:'Kagiso Peters',email:'k.peters@serviq.com',firstResponseMins:362,createdAt:new Date(Date.now()-86400000*4).toISOString(),description:'Rack B12 needs safety check'},
  {title:'Network down in HR office',category:'IT',subCategory:'Network Issue',department:'HR',priority:'Critical',status:'Open',assignee:'Morgan Lee',requesterName:'Zanele Khumalo',email:'z.khumalo@serviq.com',firstResponseMins:15,createdAt:new Date(Date.now()-86400000*0.5).toISOString(),description:'HR office no internet since 9am'},
  {title:'Leave request not approved',category:'HR',subCategory:'Leave Request',department:'Operations',priority:'Low',status:'Resolved',assignee:'Sam Chen',requesterName:'Sipho Mbeki',email:'s.mbeki@serviq.com',firstResponseMins:610,resolutionMins:1754,createdAt:new Date(Date.now()-86400000*6).toISOString(),description:'Leave still pending manager approval'},
  {title:'Budget approval for Q3 tools',category:'Finance',subCategory:'Budget Approval',department:'Finance',priority:'High',status:'Resolved',assignee:'Alex Rivera',requesterName:'Priya Naidoo',email:'p.naidoo@serviq.com',firstResponseMins:249,createdAt:new Date(Date.now()-86400000*8).toISOString(),description:'Need approval for $5k software licenses'},
  {title:'Forklift procurement',category:'Operations',subCategory:'Procurement',department:'Operations',priority:'Low',status:'Closed',assignee:'Jordan Kim',requesterName:'David Smith',email:'d.smith@serviq.com',firstResponseMins:413,resolutionMins:993,createdAt:new Date(Date.now()-86400000*10).toISOString(),description:'Request for new forklift for warehouse'},
  {title:'Software install - Adobe Suite',category:'IT',subCategory:'Software Install',department:'IT',priority:'Low',status:'Resolved',assignee:'Morgan Lee',requesterName:'Aisha Patel',email:'a.patel@serviq.com',firstResponseMins:1271,resolutionMins:1517,createdAt:new Date(Date.now()-86400000*12).toISOString(),description:'Need Adobe Creative Suite on design machine'},
  {title:'Staff query - overtime policy',category:'HR',subCategory:'Staff Query',department:'HR',priority:'Medium',status:'In Progress',assignee:'Jordan Kim',requesterName:'Bongani Zulu',email:'b.zulu@serviq.com',firstResponseMins:783,createdAt:new Date(Date.now()-86400000*1.2).toISOString(),description:'Clarify overtime calculation for night shift'},
  {title:'Expense reimbursement delay',category:'Finance',subCategory:'Expense',department:'Operations',priority:'Medium',status:'Open',assignee:'Taylor Brooks',requesterName:'Fatima Hassan',email:'f.hassan@serviq.com',firstResponseMins:467,resolutionMins:751,createdAt:new Date(Date.now()-86400000*5).toISOString(),description:'Travel expense from client visit not reimbursed'},
  {title:'Facility cleaning schedule',category:'Operations',subCategory:'Facility',department:'HR',priority:'Low',status:'Closed',assignee:'Sam Chen',requesterName:'John Doe',email:'j.doe@serviq.com',firstResponseMins:2056,resolutionMins:3469,createdAt:new Date(Date.now()-86400000*9).toISOString(),description:'Update cleaning roster for winter'},
];

function mapOldCategory(c){c=(c||'').toLowerCase();if(['billing','finance'].includes(c))return'Finance';if(['technical','it'].includes(c))return'IT';if(['service','operations','request'].includes(c))return'Operations';if(['complaint','hr'].includes(c))return'HR';return CATS.includes(c)?c:'Operations';}

async function loadTickets(){
  try{
    const r = await fetch('/api/records?collection=tickets');
    if(r.ok){ const data = await r.json(); if(data.records && data.records.length){ tickets = data.records.map(rec=>{ const v=rec.value||rec; return {...v, category: mapOldCategory(v.category), id: rec.id}}); render(); return; } }
  }catch(e){}
  tickets = SAMPLE.map(s=>({...s, category: mapOldCategory(s.category)}));
  render();
}

function filtered(){
  const q = document.getElementById('search').value.toLowerCase();
  const cat = document.getElementById('f-category').value;
  const pri = document.getElementById('f-priority').value;
  const sta = document.getElementById('f-status').value;
  const range = document.getElementById('f-range').value;
  let cutoff = 0; if(range!=='all'){ cutoff = Date.now() - parseInt(range)*86400000; }
  return tickets.filter(t=>{
    if(q && !(t.title+t.description+t.requesterName).toLowerCase().includes(q)) return false;
    if(cat!=='all' && t.category!==cat) return false;
    if(pri!=='all' && t.priority!==pri) return false;
    if(sta!=='all' && t.status.toLowerCase()!==sta.toLowerCase()) return false;
    if(cutoff && new Date(t.createdAt).getTime()<cutoff) return false;
    return true;
  });
}

function render(){
  const list = filtered();
  document.getElementById('k-total').textContent = list.length;
  const avg = list.length? Math.round(list.reduce((a,b)=>a+(b.firstResponseMins||0),0)/list.length):0;
  const medArr = list.map(t=>t.firstResponseMins||0).sort((a,b)=>a-b); const med = medArr.length? medArr[Math.floor(medArr.length/2)]:0;
  document.getElementById('k-avg').textContent = avg+'m'; document.getElementById('k-med').textContent = med+'m';
  const slaBreaches = list.filter(t=> (t.firstResponseMins||0) > (t.slaHours||24)*60).length;
  document.getElementById('k-sla').textContent = list.length? Math.round(slaBreaches/list.length*100)+'%':'0%'; document.getElementById('k-sla-count').textContent=slaBreaches;
  const byCat = {}; list.forEach(t=>byCat[t.category]=(byCat[t.category]||0)+1); const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('k-topcat').textContent = top? top[0]:'-'; document.getElementById('k-topcat-count').textContent = top? top[1]+' tickets':'';
  document.getElementById('rowCount').textContent = list.length+' tickets';

  const tbody = document.getElementById('tbody'); tbody.innerHTML='';
  list.forEach(t=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><b>${t.title}</b><br><span class="hint">${t.subCategory||''} • ${t.description.slice(0,60)}...</span></td><td><span class="badge ${t.category.toLowerCase()}">${t.category}</span></td><td><span class="badge" style="background:${t.priority==='Critical'?'rgba(248,113,113,0.15)':t.priority==='High'?'rgba(251,146,60,0.15)':t.priority==='Medium'?'rgba(250,204,21,0.15)':'rgba(74,222,128,0.15)'};color:${t.priority==='Critical'?'#fca5a5':t.priority==='High'?'#fdba74':t.priority==='Medium'?'#fde68a':'#86efac'}">${t.priority}</span></td><td>${t.status}</td><td>${t.department}</td><td>${t.assignee||'-'}</td><td>${new Date(t.createdAt).toLocaleDateString()}</td><td>${t.firstResponseMins||0}m</td>`;
    tbody.appendChild(tr);
  });

  drawVolume(list); drawCat(list); drawStatus(list); drawResp(list); drawInsights(list);
}

// PROFESSIONAL VOLUME CHART WITH GRID LINES + VISIBLE TEXT
function drawVolume(list){
  const canvas=document.getElementById('volumeChart'); 
  const ctx=canvas.getContext('2d'); 
  const dpr = window.devicePixelRatio||1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr,dpr);
  const W = rect.width; const H = 260;
  ctx.clearRect(0,0,W,H);

  const days=14; 
  const buckets={}; 
  const labels=[];
  for(let i=days-1;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const key=d.toISOString().slice(0,10); buckets[key]=0; labels.push({key, label: d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}); }
  list.forEach(t=>{ const k=new Date(t.createdAt).toISOString().slice(0,10); if(buckets[k]!==undefined) buckets[k]++; });
  const vals=labels.map(l=>buckets[l.key]); 
  const max=Math.max(1,...vals,3);

  const padL=50, padR=20, padT=20, padB=40;
  const chartW=W-padL-padR; const chartH=H-padT-padB;

  // Grid lines - horizontal
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=padT + (chartH/4)*i;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y); ctx.stroke();
    // Y axis labels
    const val = Math.round(max - (max/4)*i);
    ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.textAlign='right';
    ctx.fillText(val, padL-10, y+3);
  }
  // Vertical grid
  ctx.strokeStyle='rgba(255,255,255,0.03)';
  labels.forEach((_,i)=>{
    const x=padL + i*(chartW/(labels.length-1||1));
    ctx.beginPath(); ctx.moveTo(x,padT); ctx.lineTo(x,padT+chartH); ctx.stroke();
  });

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0,padT,0,padT+chartH);
  grad.addColorStop(0,'rgba(124,58,237,0.4)'); grad.addColorStop(1,'rgba(124,58,237,0)');
  ctx.fillStyle=grad;
  ctx.beginPath();
  vals.forEach((v,i)=>{
    const x=padL + i*(chartW/(vals.length-1||1));
    const y=padT+chartH - (v/max)*chartH;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  vals.slice().reverse().forEach((v,i)=>{
    const idx=vals.length-1-i;
    const x=padL + idx*(chartW/(vals.length-1||1));
    const y=padT+chartH;
    ctx.lineTo(x,y);
  });
  ctx.closePath(); ctx.fill();

  // Line
  ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2.5; ctx.lineJoin='round';
  ctx.beginPath();
  vals.forEach((v,i)=>{
    const x=padL + i*(chartW/(vals.length-1||1));
    const y=padT+chartH - (v/max)*chartH;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Dots + values
  vals.forEach((v,i)=>{
    const x=padL + i*(chartW/(vals.length-1||1));
    const y=padT+chartH - (v/max)*chartH;
    // Outer glow
    ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill();
    // Dot
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#a78bfa'; ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2); ctx.fill();
    // Value label
    if(v>0){
      ctx.fillStyle='#e2e8f0'; ctx.font='bold 11px Space Grotesk'; ctx.textAlign='center';
      ctx.fillText(v, x, y-12);
    }
  });

  // X labels - visible
  ctx.fillStyle='#cbd5e1'; ctx.font='11px JetBrains Mono'; ctx.textAlign='center';
  labels.forEach((l,i)=>{
    if(i%2===0 || labels.length<=7){
      const x=padL + i*(chartW/(labels.length-1||1));
      ctx.fillText(l.label, x, H-10);
    }
  });

  // Axis titles
  ctx.fillStyle='#64748b'; ctx.font='10px JetBrains Mono'; ctx.textAlign='left'; ctx.fillText('TICKETS', padL, 12);
}

function drawCat(list){
  const canvas=document.getElementById('catChart'); 
  const ctx=canvas.getContext('2d');
  const dpr = window.devicePixelRatio||1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr,dpr);
  const W=rect.width; const H=260;
  ctx.clearRect(0,0,W,H);

  const counts={}; CATS.forEach(c=>counts[c]=0); list.forEach(t=>{ if(counts[t.category]!==undefined) counts[t.category]++; });
  const total=list.length||1; let start=-Math.PI/2;

  const cx=W/2; const cy=H/2 -10; const r=Math.min(W,H)/2 -40;

  // Drop shadow
  ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=20; ctx.shadowOffsetY=10;

  Object.entries(counts).forEach(([cat,cnt])=>{
    if(cnt===0) return;
    const ang=(cnt/total)*Math.PI*2; 
    ctx.fillStyle=CAT_COLOR[cat]; 
    ctx.beginPath(); 
    ctx.moveTo(cx,cy); 
    ctx.arc(cx,cy,r,start,start+ang); 
    ctx.closePath(); 
    ctx.fill(); 
    start+=ang;
  });
  ctx.shadowColor='transparent';

  // Inner circle for donut
  ctx.fillStyle='#0a0a0f'; ctx.beginPath(); ctx.arc(cx,cy,r*0.55,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; ctx.stroke();

  // Center text
  ctx.fillStyle='#f8fafc'; ctx.font='bold 24px Space Grotesk'; ctx.textAlign='center'; ctx.fillText(total, cx, cy-2);
  ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.fillText('TOTAL', cx, cy+14);

  // External labels with lines - VISIBLE
  start=-Math.PI/2;
  Object.entries(counts).forEach(([cat,cnt])=>{
    if(cnt===0) return;
    const ang=(cnt/total)*Math.PI*2; const mid=start+ang/2;
    const x1=cx+Math.cos(mid)*(r+8); const y1=cy+Math.sin(mid)*(r+8);
    const x2=cx+Math.cos(mid)*(r+28); const y2=cy+Math.sin(mid)*(r+28);
    ctx.strokeStyle=CAT_COLOR[cat]; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.fillStyle='#e2e8f0'; ctx.font='12px Space Grotesk'; ctx.textAlign=x2>cx?'left':'right';
    ctx.fillText(`${cat} ${cnt} (${Math.round(cnt/total*100)}%)`, x2 + (x2>cx?4:-4), y2+3);
    start+=ang;
  });

  const legend=document.getElementById('catLegend'); legend.innerHTML=''; 
  Object.entries(counts).forEach(([cat,cnt])=>{ 
    const d=document.createElement('span'); 
    d.innerHTML=`<span class="dot" style="background:${CAT_COLOR[cat]}"></span>${cat} ${cnt} • ${Math.round(cnt/total*100)}%`; 
    legend.appendChild(d); 
  });
}

function drawStatus(list){
  const el=document.getElementById('statusBars'); 
  const statuses=['Open','In Progress','Resolved','Closed']; 
  const counts={}; statuses.forEach(s=>counts[s]=0); 
  list.forEach(t=>{ const s=t.status; if(counts[s]!==undefined) counts[s]++; else counts['Open']++; });
  const max=Math.max(1,...Object.values(counts)); 
  el.innerHTML=''; 
  const colors={Open:'#f87171','In Progress':'#fb923c',Resolved:'#34d399',Closed:'#94a3b8'};
  Object.entries(counts).forEach(([s,c])=>{ 
    const pct=c/max*100; 
    const div=document.createElement('div'); 
    div.style.margin='14px 0'; 
    div.innerHTML=`
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-weight:600;font-size:13px">${s}</span><span style="font-family:JetBrains Mono;font-size:12px;color:#94a3b8">${c} tickets • ${Math.round(c/(list.length||1)*100)}%</span></div>
      <div style="height:10px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)"><div style="width:${pct}%;height:100%;background:${colors[s]};border-radius:999px;box-shadow:0 0 10px ${colors[s]};transition:width 0.6s ease"></div></div>`; 
    el.appendChild(div); 
  });
}

function drawResp(list){
  const canvas=document.getElementById('respChart'); 
  const ctx=canvas.getContext('2d');
  const dpr = window.devicePixelRatio||1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr,dpr);
  const W=rect.width; const H=260;
  ctx.clearRect(0,0,W,H);

  const buckets=[0,0,0,0]; 
  list.forEach(t=>{ const m=t.firstResponseMins||0; if(m<60) buckets[0]++; else if(m<240) buckets[1]++; else if(m<1440) buckets[2]++; else buckets[3]++; });
  const labels=['<1 hour','1-4 hours','4-24 hours','>24 hours']; 
  const max=Math.max(1,...buckets);

  const padL=50, padR=20, padT=20, padB=40;
  const chartW=W-padL-padR; const chartH=H-padT-padB;

  // Horizontal grid lines
  ctx.strokeStyle='rgba(255,255,255,0.06)'; 
  for(let i=0;i<=4;i++){
    const y=padT + (chartH/4)*i;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y); ctx.stroke();
    const val = Math.round(max - (max/4)*i);
    ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.textAlign='right';
    ctx.fillText(val, padL-10, y+3);
  }

  buckets.forEach((v,i)=>{
    const barW=(chartW/buckets.length)-16; 
    const x=padL + i*(chartW/buckets.length)+8; 
    const barH=(v/max)*chartH; 
    const y=padT+chartH-barH;

    // Gradient
    const grad=ctx.createLinearGradient(0,y,0,y+barH);
    grad.addColorStop(0,'#a78bfa'); grad.addColorStop(1,'#7c3aed');
    ctx.fillStyle=grad;
    // Rounded top
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [8,8,0,0]);
    ctx.fill();

    // Glow
    ctx.shadowColor='rgba(124,58,237,0.4)'; ctx.shadowBlur=15; ctx.fill(); ctx.shadowColor='transparent';

    // Value on top - VISIBLE WHITE
    ctx.fillStyle='#f8fafc'; ctx.font='bold 13px Space Grotesk'; ctx.textAlign='center';
    ctx.fillText(v, x+barW/2, y-8);

    // Label - VISIBLE
    ctx.fillStyle='#cbd5e1'; ctx.font='11px JetBrains Mono'; ctx.textAlign='center';
    ctx.fillText(labels[i], x+barW/2, H-12);
  });
}

function drawInsights(list){
  const el=document.getElementById('insights'); const insights=[];
  const byCat={}; list.forEach(t=>byCat[t.category]=(byCat[t.category]||0)+1); const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  if(top) insights.push(`📊 <b>Top volume:</b> ${top[0]} with ${top[1]} tickets (${Math.round(top[1]/list.length*100)}% of total) — prioritize ${top[0]} backlog and allocate senior support.`);
  const avg=list.length? Math.round(list.reduce((a,b)=>a+(b.firstResponseMins||0),0)/list.length):0; 
  insights.push(`⏱️ <b>Response performance:</b> Average first response is ${avg} minutes. Median ${document.getElementById('k-med').textContent}. Target SLA 4h for Critical, 24h for Medium. ${avg>240?'⚠️ Above target — needs process review.':'✅ Within SLA.'}`);
  const sla=list.filter(t=> (t.firstResponseMins||0) > (t.slaHours||24)*60).length; 
  insights.push(`🚨 <b>SLA health:</b> ${sla} tickets breached SLA (${list.length?Math.round(sla/list.length*100):0}%). ${sla>2?'Focus on High/Critical tickets in IT and Finance queue.':'SLA compliance is strong.'}`);
  const open=list.filter(t=>t.status==='Open').length; 
  insights.push(`📈 <b>Workload:</b> ${open} tickets still open — triage queue Critical → High → Medium → Low. Busiest category suggests staffing review for ${top?top[0]:'peak teams'}.`);
  insights.push(`✨ <b>Business insight:</b> Platform now produces measurable insights — ${list.length} tickets tracked across IT, HR, Finance, Operations. No Channel field — clean department view for executive reporting.`);
  el.innerHTML=insights.map(i=>`<div class="insight">${i}</div>`).join('');
}

document.getElementById('search').addEventListener('input',render);
document.getElementById('f-category').addEventListener('change',render);
document.getElementById('f-priority').addEventListener('change',render);
document.getElementById('f-status').addEventListener('change',render);
document.getElementById('f-range').addEventListener('change',render);

document.getElementById('exportCsv').addEventListener('click',()=>{
  const list=filtered(); const header=['Title','Category','SubCategory','Department','Priority','Status','Assignee','Requester','Email','FirstResponseMins','CreatedAt','Description'];
  const rows=list.map(t=>[t.title,t.category,t.subCategory||'',t.department,t.priority,t.status,t.assignee||'',t.requesterName||'',t.email||'',t.firstResponseMins||'',t.createdAt,t.description].map(v=>`"${(v+'').replace(/"/g,'""')}"`).join(','));
  const csv=[header.join(','),...rows].join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='serviq_tickets_no_channel.csv'; a.click();
});
document.getElementById('exportJson').addEventListener('click',()=>{
  const list=filtered(); const blob=new Blob([JSON.stringify(list,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='serviq_tickets_no_channel.json'; a.click();
});

loadTickets();
