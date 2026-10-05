const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs'); const path = require('path'); const http = require('http'); const assert = require('assert');
const base=path.resolve(__dirname, '../dist');
const output=process.env.KOTEAUTO_EVIDENCE_DIR || path.join(require('os').tmpdir(), 'koteauto-qa'); fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname); if(name==='/')name='/index.html'; let p=path.join(base,name); if(!path.extname(p))p+='.html'; if(!p.startsWith(base+'/')||!fs.existsSync(p)){res.writeHead(404);return res.end('Not found');} const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp'};res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r)); const url=`http://127.0.0.1:${server.address().port}`; let browser; const report=[];
try {browser=await chromium.launch({headless:true});
for(const size of [{width:1440,height:810},{width:390,height:844},{width:320,height:568}]){
 const ctx=await browser.newContext({viewport:size}); const page=await ctx.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400) errors.push(r.url()+':'+r.status())});
 await page.goto(url); await page.waitForTimeout(150); assert.equal(await page.locator('.lab').count(),0);
 await page.screenshot({path:`${output}/home-${size.width}.png`});
 await page.locator('.cta').click(); await page.waitForFunction(()=>document.documentElement.dataset.travel==='done');
 assert.equal(await page.locator('.intro').getAttribute('aria-hidden'),'false'); assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2');
 const timing=await page.evaluate(()=>document.documentElement.dataset.travelMs); assert(Number(timing)>=1700&&Number(timing)<2400,timing);
 await page.waitForTimeout(350); await page.screenshot({path:`${output}/resumo-${size.width}.png`});
 await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(200);
 assert.equal(await page.locator('.step.reached').count(),4);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'overflow home');
 for(const slug of ['o-que-e-a-koteauto','como-funciona','avaliacao-do-usado','quanto-de-carro-consigo-comprar','para-concessionarias','privacidade-e-dados','perguntas-frequentes']){
  await page.goto(url+'/'+slug); assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+slug);
 }
 await page.goto(url+'/como-funciona'); await page.screenshot({path:`${output}/jornada-${size.width}.png`,fullPage:true});
 assert.deepEqual(errors,[]); report.push({width:size.width,timing,errors});await ctx.close();
}
for(const mode of ['reduce','nojs','short']){
 const ctx=await browser.newContext({viewport:{width:390,height:mode==='short'?480:844},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='nojs'});const page=await ctx.newPage();await page.goto(url); await page.waitForTimeout(150);assert(!(await page.locator('html').getAttribute('class')||'').includes('live'),mode);assert(await page.locator('.intro h2').isVisible());await page.locator('.cta').click(); await page.waitForTimeout(600);assert(await page.evaluate(()=>scrollY>0));report.push({mode,ok:true});await ctx.close();
}
const ctx=await browser.newContext({viewport:{width:1440,height:810}});const p=await ctx.newPage();await p.goto(url);await p.locator('.cta').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.documentElement.dataset.travel==='done');report.push({keyboard:true});
await p.goto(url);await p.locator('.cta').click();await p.waitForTimeout(200);await p.mouse.wheel(0,100);await p.waitForTimeout(300);assert.equal(await p.locator('html').getAttribute('data-travel'),'cancelled');report.push({cancel:true});
await p.goto(url+'/#como-funciona');await p.waitForTimeout(400);assert.equal(await p.locator('.intro').getAttribute('aria-hidden'),'false');report.push({directAnchor:true});
await p.goto(url);await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>document.activeElement.tagName),'H2');report.push({skipLink:true});
await p.goto(url);for(const progress of [0,.2,.5,.7,1,.7,.5,0]){await p.evaluate(v=>{const t=document.querySelector('.track');scrollTo({top:(t.offsetHeight-document.querySelector('.stage').offsetHeight)*v,behavior:'instant'})},progress);await p.waitForTimeout(200);assert.equal(await p.locator('.intro').getAttribute('aria-hidden'),progress>=.46?'false':'true');}report.push({reverse:true});await ctx.close();
fs.writeFileSync(output+'/resultado.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
