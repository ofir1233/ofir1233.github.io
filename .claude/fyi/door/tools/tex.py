from PIL import Image, ImageDraw, ImageFilter
import random, math
random.seed(7)
def paint(name,size,base,pal,n,ang=-58,spread=22,lw=(7,18),ln=(40,120),acc=()):
    W,H=size
    im=Image.new('RGB',size,base); d=ImageDraw.Draw(im,'RGBA')
    for i in range(n):
        x=random.uniform(-40,W+40); y=random.uniform(-40,H+40)
        a=math.radians(ang+random.gauss(0,spread)); L=random.uniform(*ln); w=random.uniform(*lw)
        c=random.choice(pal) if random.random()>.06 or not acc else random.choice(acc)
        j=random.randint(-14,14); c=tuple(max(0,min(255,v+j)) for v in c)
        dx,dy=math.cos(a)*L/2,math.sin(a)*L/2
        d.line((x-dx,y-dy,x+dx,y+dy),fill=c+(random.randint(120,215),),width=int(w))
        # bristles
        for k in range(random.randint(2,4)):
            o=random.uniform(-w/2,w/2); nx,ny=-math.sin(a)*o,math.cos(a)*o
            s=random.choice((26,-22,40,-30))
            cc=tuple(max(0,min(255,v+s)) for v in c)
            d.line((x-dx+nx,y-dy+ny,x+dx*random.uniform(.3,1)+nx,y+dy*random.uniform(.3,1)+ny),fill=cc+(110,),width=random.choice((1,1,2)))
    im=im.filter(ImageFilter.GaussianBlur(.5))
    im.save(name,quality=88)
P=[(255,45,143),(255,45,143),(255,70,160),(244,24,124),(255,110,182),(232,30,150),(255,58,128),(255,140,196)]
paint('a/paint-pink.jpg',(960,480),(255,45,143),P,2600,ang=-80,spread=9,lw=(8,24),ln=(120,300),acc=[(255,190,220),(200,30,170)])
# neutral brush texture for overlay (mid grey strokes)
G=[(128,128,128),(150,150,150),(108,108,108),(170,170,170),(96,96,96),(140,140,140)]
paint('a/paint-grey.jpg',(640,640),(128,128,128),G,4200,ang=-40,spread=30,lw=(6,14),ln=(30,90))
# spray cloud (pink) with alpha
def spray(name,size,col,n,sig,blobs):
    W,H=size; im=Image.new('RGBA',size,col+(0,)); d=ImageDraw.Draw(im,'RGBA')
    core=Image.new('L',size,0); dc=ImageDraw.Draw(core)
    for (cx,cy,rx,ry,a) in blobs:
        dc.ellipse((cx-rx,cy-ry,cx+rx,cy+ry),fill=a)
    core=core.filter(ImageFilter.GaussianBlur(sig))
    px=core.load()
    sp=Image.new('L',size,0); ds=ImageDraw.Draw(sp)
    for i in range(n):
        x=random.uniform(0,W); y=random.uniform(0,H)
        v=px[int(x)%W,int(y)%H]/255
        if random.random()<v*1.25+.004:
            r=random.choice((.6,.6,.8,1,1,1.4,2.2)) if v<.5 else random.choice((.8,1,1.3,1.8))
            ds.ellipse((x-r,y-r,x+r,y+r),fill=random.randint(130,255))
    # soft body + speckle
    from PIL import ImageChops
    body=core.point(lambda v:int(min(255,max(0,(v-60))*1.25)))
    a=ImageChops.lighter(body.point(lambda v:int(v*.62)), sp.point(lambda v:int(v*.8)))
    im.putalpha(a); im.save(name)
spray('a/spray-pink.png',(900,700),(255,45,143),260000,46,[(430,330,250,170,255),(600,260,150,120,220),(300,420,170,110,200)])
spray('a/spray-cyan.png',(520,420),(34,205,240),90000,34,[(260,210,130,90,230)])
print('ok')
