const {chromium} = require('playwright');
const fs = require('fs');
(async()=>{
 const browser = await chromium.launch({headless:true});
 const root='/home/jace/workspace/workers/ai-search-jace-pro/docs/evidence/ai-search';
 const results=[];
 for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,colorScheme:'light'});
  for(const [name,route] of [['home',''],['history','blog/a-history-of-ai-from-my-point-of-view/'],['patterns','blog/ai-agent-patterns-as-mermaid-diagrams/']]) {
   let before;
   for(const version of ['baseline','current']) {
    const response=await page.goto(`http://127.0.0.1:${version==='baseline'?18763:18762}/${route}`,{waitUntil:'networkidle'});
    if(response.status()!==200)throw Error(response.status());
    await page.evaluate(()=>document.fonts.ready);
    const body=await page.locator('body').innerText();
    if(version==='baseline')before=body; else if(body!==before)throw Error('Visible text changed');
    // Exercise the actual page at each viewport.
    await page.locator('main').waitFor();
    const path=`${root}/${name}-${label}-${version}.png`;
    await page.screenshot({path});
    results.push({name,label,version,path:path.split('/').pop(),width,height,status:response.status(),title:await page.title()});
   }
  }
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(root+'/browser-manifest.json',JSON.stringify(results,null,2)+'\n');
 console.log('PASS 12 real browser screenshots; visible body text unchanged at desktop/mobile');
})().catch(e=>{console.error(e);process.exit(1)});
