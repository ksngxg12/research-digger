/* Pure filters are shared by the page and offline verification. */
function filterReports(rows, f={}) {
  const q=(f.keyword||'').trim().toLowerCase();
  return rows.filter(r=>(!f.month||r.date.startsWith(f.month))&&(!f.theme||r.themes.includes(f.theme))&&(!q||[r.id,r.date,r.title,r.keywords,...r.themes].join(' ').toLowerCase().includes(q)));
}
function filterPapers(rows,f={}) {
  const q=(f.keyword||'').trim().toLowerCase();
  return rows.filter(p=>(!f.direction||p.tags.includes(f.direction))&&(!f.drive||p.drive===f.drive)&&(!f.no||p.no_role===f.no)&&(!f.therapy||p.therapy===f.therapy)&&(!f.version||p.version.includes(f.version))&&(!q||[p.title,p.zh,p.doi,p.authors,p.note,...p.tags].join(' ').toLowerCase().includes(q)));
}
function escapeHTML(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
if (typeof document!=='undefined') {
  const el=id=>document.getElementById(id);
  const options=(id,values)=>{const e=el(id);if(e)for(const v of [...new Set(values)].filter(Boolean).sort())e.add(new Option(v,v));};
  if(el('archive-results')){
    options('archive-theme',REPORTS.flatMap(r=>r.themes));
    const draw=()=>{const rows=filterReports(REPORTS,{month:el('archive-month').value,theme:el('archive-theme').value,keyword:el('archive-keyword').value});el('archive-count').textContent=`显示 ${rows.length} / ${REPORTS.length} 期`;
      el('archive-results').innerHTML=rows.map(r=>`<article class="archive-row"><div><b>${escapeHTML(r.date)} · 第${escapeHTML(r.id)}期</b><span>${escapeHTML(r.summary)}</span></div><a href="${escapeHTML(r.url)}">${escapeHTML(r.title)} →</a></article>`).join('')||'<p>没有匹配报告，请清空或调整筛选条件。</p>';};
    for(const id of ['archive-month','archive-theme','archive-keyword'])el(id).addEventListener('input',draw);
    el('archive-reset').addEventListener('click',()=>{for(const id of ['archive-month','archive-theme','archive-keyword'])el(id).value='';draw();});draw();
  }
  if(el('paper-results')){
    options('paper-direction',PAPERS.flatMap(p=>p.tags));options('paper-drive',PAPERS.map(p=>p.drive));options('paper-no',PAPERS.map(p=>p.no_role));options('paper-therapy',PAPERS.map(p=>p.therapy));options('paper-version',PAPERS.flatMap(p=>p.version));
    const keys=['keyword','direction','drive','no','therapy','version'];
    const draw=()=>{const rows=filterPapers(PAPERS,Object.fromEntries(keys.map(k=>[k,el('paper-'+k).value])));el('paper-count').textContent=`显示 ${rows.length} / ${PAPERS.length} 条独立研究记录`;
      el('paper-results').innerHTML=rows.map(p=>`<article class="paper"><span class="paper-tags">${escapeHTML(p.tags.join(' · '))}</span><strong><a href="${escapeHTML(p.url)}" target="_blank" rel="noopener">${escapeHTML(p.title)}</a></strong><small>${escapeHTML(p.journal)} · ${escapeHTML(p.date)} · ${escapeHTML(p.doi||'DOI未核实')}</small><p>${escapeHTML(p.note)}</p><p class="small">驱动：${escapeHTML(p.drive)} · NO：${escapeHTML(p.no_role)}<br>治疗：${escapeHTML(p.therapy)} · 版本：${escapeHTML(p.version.join(' / '))}</p><a href="${escapeHTML(p.report_url)}">报告${escapeHTML(p.report)}中的分析 →</a></article>`).join('')||'<p>没有匹配文献，请清空或调整筛选条件。</p>';};
    for(const k of keys)el('paper-'+k).addEventListener('input',draw);
    el('paper-reset').addEventListener('click',()=>{for(const k of keys)el('paper-'+k).value='';draw();});draw();
  }
}
