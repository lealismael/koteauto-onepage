const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const fs=require('fs');const assert=require('assert');
const out=process.env.KOTEAUTO_EVIDENCE_DIR || require('path').join(require('os').tmpdir(),'koteauto-transition');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();const report=[];try{
for(const width of [1440,390,320]){const p=await b.newPage({viewport:{width,height:width===1440?810:844}});await p.goto('http://127.0.0.1:4173');const cdp=await p.context().newCDPSession(p);
for(const v of [0,.1,.19,.2,.3,.439,.44,.46,.5,.66,1,.45,.43,0]){
 await p.evaluate(v=>{const t=document.querySelector('.track');scrollTo({top:(t.offsetHeight-document.querySelector('.stage').offsetHeight)*v,behavior:'instant'})},v);await p.waitForTimeout(240);
 const state=await p.evaluate(()=>({p:document.documentElement.dataset.p,hero:document.querySelector('.hero-copy').getAttribute('aria-hidden')!=='true',intro:document.querySelector('.intro').getAttribute('aria-hidden')!=='true',cue:!document.querySelector('.transition-cue').hidden,opacity:getComputedStyle(document.querySelector('.intro h2')).opacity}));
 assert(state.hero||state.intro||state.cue,JSON.stringify(state));assert.equal(state.opacity,'1');
 const ax=await cdp.send('Accessibility.getFullAXTree');const names=ax.nodes.filter(n=>!n.ignored).map(n=>n.name?.value||'');
 assert.equal(names.includes('Do que você procura à decisão.'),state.intro);
 const records=await p.evaluate(()=>{const out=[];for(const container of document.querySelectorAll('.hero-copy,.intro,.transition-cue')){if(container.closest('[inert]')||container.hidden||getComputedStyle(container).visibility==='hidden')continue;const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;const s=getComputedStyle(el);if(s.visibility==='hidden')continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects()){if(r.bottom<0||r.top>innerHeight)continue;out.push({text:n.textContent.trim(),color:s.color,size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight)||400,x:r.x,y:r.y,w:r.width,h:r.height});}}}return out;});
 const id=`${width}-${report.length}`;
 if([.3,.46].includes(v))await p.screenshot({path:`${out}/passagem-${width}-${v}.png`});
 const style=await p.addStyleTag({content:'*{-webkit-text-fill-color:transparent!important;text-shadow:none!important}'});await p.screenshot({path:`${out}/fundo-${id}.png`});await style.evaluate(e=>e.remove());report.push({id,width,v,state,records});
}
await p.goto('http://127.0.0.1:4173');await p.locator('.cta').focus();
await p.evaluate(()=>scrollTo({top:(document.querySelector('.track').offsetHeight-document.querySelector('.stage').offsetHeight)*.3,behavior:'instant'}));await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>document.activeElement.className),'transition-cue');
await p.keyboard.press('Enter');await p.waitForFunction(()=>document.documentElement.dataset.travel==='done');assert.equal(await p.evaluate(()=>document.activeElement.tagName),'H2');
await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);assert.equal(await p.locator('.intro').getAttribute('aria-hidden'),null);assert(await p.locator('.intro h2').isVisible());await p.close();
}fs.writeFileSync(out+'/acessibilidade.json',JSON.stringify(report,null,2));console.log('42 estados: orientação visível, árvore acessível, opacidade; foco e botão intermediário passaram.');}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
