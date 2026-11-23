import json,sys
from PIL import Image, ImageDraw, ImageFont
ts=json.load(open('shots/_f/ts.json'))
out=sys.argv[1] if len(sys.argv)>1 else 'shots/contact-strip.png'
cols=2; fw,fh=685,385; rows=(len(ts)+cols-1)//cols
W=Image.new('RGB',(cols*fw+(cols+1)*10, rows*(fh+34)+10),(255,255,255))
d=ImageDraw.Draw(W)
try: f=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',18)
except: f=None
for i,t in enumerate(ts):
    im=Image.open(f'shots/_f/f{i}.png').resize((fw,fh),Image.LANCZOS)
    x=10+(i%cols)*(fw+10); y=10+(i//cols)*(fh+34)
    W.paste(im,(x,y+26)); d.text((x,y+2),f'{i+1}.  t = {t:.2f}s',fill=(20,20,20),font=f)
W.save(out); print(out,W.size)
