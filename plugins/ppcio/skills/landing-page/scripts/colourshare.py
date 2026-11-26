# python3 colourshare.py shot.png brand.md -> share of the page's colour (photos hidden) that is in their brand's hues
import sys,re,colorsys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); im.thumbnail((360,4000))
txt=open(sys.argv[2]).read() if len(sys.argv)>2 else ''
hexes=re.findall(r'#[0-9a-fA-F]{6}\b',txt)[:6]
def hls(h): return colorsys.rgb_to_hls(int(h[1:3],16)/255,int(h[3:5],16)/255,int(h[5:7],16)/255)
bh=[(hls(h)[0]*360,hls(h)[1]) for h in hexes if hls(h)[2]>0.2]
on=off=0; offc={}
for r,g,b in im.getdata():
    h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255)
    if s<0.18 or l<0.06 or l>0.96: continue
    ok=any(min(abs(h*360-x),360-abs(h*360-x))<=20 and (abs(l-bl)<=0.3 or l>0.85) for x,bl in bh)
    if ok: on+=1
    else: off+=1; k=int(h*360)//30*30; offc[k]=offc.get(k,0)+1
t=on+off
if not bh: print('COLOUR: no brand hexes found in brand.md'); sys.exit(0)
share=round(100*on/t) if t else 100
top=sorted(offc.items(),key=lambda x:-x[1])[:2]
print(f'COLOUR: {share}% of the coloured area (photos hidden) is in their brand hues {", ".join(hexes)}; off-brand hues near {", ".join(str(k)+"deg" for k,_ in top) or "none"}')
sys.exit(0 if share>=60 else 3)
