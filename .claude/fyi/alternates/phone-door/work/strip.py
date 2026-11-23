from PIL import Image, ImageDraw, ImageFont
import os
T=[0,120,240,380,540,720,920,1200]
fw,fh=685,385; pad=10; lab=30
W=Image.new('RGB',(4*fw+5*pad, 2*(fh+lab)+3*pad),(255,255,255))
d=ImageDraw.Draw(W)
try: f=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',18)
except: f=None
for i,t in enumerate(T):
    im=Image.open('shots/_f%d.png'%i).convert('RGB').resize((fw,fh),Image.LANCZOS)
    x=pad+(i%4)*(fw+pad); y=pad+(i//4)*(fh+lab+pad)
    W.paste(im,(x,y+lab)); d.text((x+2,y+5),'%d ms after the click'%t,fill=(23,27,32),font=f)
W.save('shots/strip-opening.png')
for i in range(len(T)): os.remove('shots/_f%d.png'%i)
