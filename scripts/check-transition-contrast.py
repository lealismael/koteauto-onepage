from pathlib import Path
from PIL import Image
import json,re,math,sys,tempfile
p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(tempfile.gettempdir())/'koteauto-transition'
def lum(c):
 a=[v/255 for v in c[:3]];a=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in a];return sum(x*w for x,w in zip(a,[.2126,.7152,.0722]))
results=[]
for state in json.loads((p/'acessibilidade.json').read_text()):
 im=Image.open(p/f"fundo-{state['id']}.png").convert('RGB')
 for r in state['records']:
  fg=[float(v) for v in re.findall(r'[\d.]+',r['color'])][:3];l=lum(fg);ratios=[]
  for y in range(max(0,math.ceil(r['y']+2)),min(im.height,math.floor(r['y']+r['h']-2)),3):
   for x in range(max(0,math.ceil(r['x']+2)),min(im.width,math.floor(r['x']+r['w']-2)),3):
    b=lum(im.getpixel((x,y)));ratios.append((max(l,b)+.05)/(min(l,b)+.05))
  if ratios:results.append({'width':state['width'],'p':state['v'],'text':r['text'],'ratio':round(min(ratios),3),'threshold':3 if r['size']>=24 or (r['size']>=18.667 and r['weight']>=700) else 4.5})
failures=[r for r in results if r['ratio']<r['threshold']]
(p/'contraste.json').write_text(json.dumps({'samples':len(results),'min':min(results,key=lambda r:r['ratio']),'failures':failures},ensure_ascii=False,indent=2))
print(json.dumps({'samples':len(results),'min':min(results,key=lambda r:r['ratio']),'failures':failures},ensure_ascii=False,indent=2))
