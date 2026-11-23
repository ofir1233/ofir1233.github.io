import sys
sys.path.insert(0,'/private/tmp/claude-501/depth-robot')
from PIL import Image, ImageFilter, ImageChops, ImageDraw, ImageOps
from pp import pushpull
S='/Users/ofirnona/ofir1233.github.io/.claude/fyi/process/styles/'
OUT='../art/'
src=Image.open(S+'q1-phone-eye.jpg').convert('RGB'); W,H=src.size
def M(n): return Image.open('fg-q1-phone-eye/VNGenerateForegroundInstanceMaskRequest-%d.png'%n).convert('L').resize((W,H),Image.BICUBIC)
man=M(1); wom=M(2)
_d=ImageDraw.Draw(man); _d.polygon([(-1,1218),(40,1236),(130,1266),(200,1289),(272,1304),(262,1560),(-1,1560)],fill=0)
def dil(m,r): return m.filter(ImageFilter.MaxFilter(2*r+1))
def ero(m,r): return m.filter(ImageFilter.MinFilter(2*r+1))
def alpha(m): return ero(m.point(lambda v:255 if v>127 else 0),1).filter(ImageFilter.GaussianBlur(1.1))
def poly(pts,blur=0):
    im=Image.new('L',(W,H),0); ImageDraw.Draw(im).polygon(pts,fill=255)
    return im.filter(ImageFilter.GaussianBlur(blur)) if blur else im
# hand: wrist line then generous outside
wrist=[(-40,960),(30,850),(110,800),(220,788),(300,808),(365,862)]
rest=[(700,880),(700,1560),(250,1560),(270,1300),(200,1285),(130,1262),(40,1232),(-40,1215)]
side=poly([(-40,700),(372,700),(376,872),(418,930),(464,992),(494,1052),(542,1132),(597,1252),(626,1340),(632,1560),(-40,1560)],1.2)
P_hand=ImageChops.multiply(poly(wrist+rest,10),side)
def shift(pts,d): return [(x+d*0.25,y+d) for x,y in pts]
P_cut=ImageChops.multiply(poly(shift(wrist,46)+rest,5),side)
# fist bottom: keep crisp by hard polygon there
a_man=alpha(man); a_wom=alpha(wom)
a_hand=ImageChops.multiply(a_man,P_hand)
a_body=ImageChops.multiply(a_man,ImageChops.invert(P_cut))
_d=ImageDraw.Draw(a_body); _d.rectangle([0,1180,345,1536],fill=0)
# far: remove both figures
known=ImageChops.invert(dil(ImageChops.lighter(man,wom).point(lambda v:255 if v>40 else 0),4))
far=pushpull(src,known)
# soften the filled area a touch so it reads as out of focus
def save(rgb,a,name):
    im=rgb.copy(); 
    if a is not None: im.putalpha(a)
    im=ImageOps.mirror(im)
    im.save(OUT+name,quality=84,method=6)
    print(name,im.size)
save(far,None,'room-far.webp')
save(src,a_wom,'room-her.webp')
save(src,a_body,'room-him.webp')
save(src,a_hand,'room-hand.webp')
# previews
def prev(layers,name):
    bg=Image.new('RGB',(W,H),(0,200,60))
    for rgb,a in layers: bg.paste(rgb,(0,0),a)
    ImageOps.mirror(bg).resize((W//2,H//2)).save(name)
prev([(src,a_hand)],'pv-hand.png'); prev([(src,a_body)],'pv-body.png'); prev([(src,a_wom)],'pv-her.png')
ImageOps.mirror(far).resize((W//2,H//2)).save('pv-far.png')
# stickers
q3=Image.open(S+'q3-dog.jpg').convert('RGB')
q3.crop((250,330,790,870)).resize((360,360),Image.LANCZOS).save(OUT+'st-dog.webp',quality=86)
src.crop((0,372,150,600)).resize((240,365),Image.LANCZOS).save(OUT+'st-paint.webp',quality=86)
src.crop((120,10,270,190)).save(OUT+'st-leaf.webp',quality=86)
