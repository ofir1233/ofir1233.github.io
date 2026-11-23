from PIL import Image, ImageFilter, ImageChops, ImageDraw, ImageMath
import subprocess, os
from pp import pushpull
W,H=1600,832
OUT='/Users/ofirnona/ofir1233.github.io/.claude/review/hear-page/depth/robot/'
src=Image.open('src.png').convert('RGB')
man=Image.open('m_man_raw.png'); mid=Image.open('m_mid_raw.png'); table=Image.open('m_table.png').point(lambda v:255 if v>127 else 0)
cup=Image.open('m_cup.png'); bq=Image.open('m_bq.png'); rob=Image.open('m_rob.png'); bill=Image.open('m_bill_raw.png')
def dil(m,r):
    while r>0:
        k=min(r,10); m=m.filter(ImageFilter.MaxFilter(2*k+1)); r-=k
    return m
def ero(m,r):
    while r>0:
        k=min(r,10); m=m.filter(ImageFilter.MinFilter(2*k+1)); r-=k
    return m
def U(*a):
    o=a[0]
    for m in a[1:]: o=ImageChops.lighter(o,m)
    return o
def I(*a):
    o=a[0]
    for m in a[1:]: o=ImageChops.darker(o,m)
    return o
def N(m): return ImageChops.invert(m)
def alpha_of(M): return ero(M,1).filter(ImageFilter.GaussianBlur(1.5))

# ================= NEAR =================
core=ero(man,2)
near_rgb=pushpull(src,core)
near_a=alpha_of(man)
near=near_rgb.copy(); near.putalpha(near_a)

# ================= MID =================
man_d=dil(man,2)
mid_known=I(ero(mid,2),N(man_d))
work=src.copy()
# 1) continue the table rim under the man's jaw by mirroring it along the edge
edge=[(140,640),(160,627),(180,616),(200,607.2),(220,598.2),(240,590.2),(260,583.2),(280,576.2),(300,570.2)]
def ey(x):
    for (x0,y0),(x1,y1) in zip(edge,edge[1:]):
        if x0<=x<=x1: return y0+(y1-y0)*(x-x0)/(x1-x0)
sp=src.load(); wp=work.load(); mdp=man_d.load(); kp=mid_known.load(); mp=mid.load()
rim=Image.new('L',(W,H),0); rp=rim.load()
XM=213
import math
for x in range(160,XM+6):
    xs=2*XM-x
    y0=int(round(ey(x)))
    for y in range(y0-2,y0+20):
        d=y-ey(x); fy=ey(xs)+d; ya=int(math.floor(fy)); t=fy-ya
        if mdp[x,y] and mp[x,y] and not mdp[xs,ya] and not mdp[xs,ya+1]:
            a=sp[xs,ya]; b=sp[xs,ya+1]
            wp[x,y]=tuple(int(round(a[i]*(1-t)+b[i]*t)) for i in range(3)); rp[x,y]=255
mid_known=U(mid_known,rim)
# 2) exemplar fill of the table under the man, 70 px inside his outline, from plain table only
T=I(mid,man_d,N(rim))
bandT=I(dil(N(man_d),70),T)
objs=U(dil(U(bq,rob,bill),6),dil(cup,34))
plain=I(ero(table,16),N(dil(man,8)),N(objs))
st=Image.new('L',(W,H),64)
st.paste(128,mask=mid_known)
st.paste(0,mask=I(plain,mid_known))
st.paste(255,mask=bandT)
st.save('st_mid.pgm'); work.save('in_mid.ppm')
subprocess.run(['./inpaint','in_mid.ppm','st_mid.pgm','out_mid.ppm','outmask_mid.pgm','6','140','1'],check=True,stderr=subprocess.DEVNULL)
work=Image.open('out_mid.ppm').convert('RGB'); kn=Image.open('outmask_mid.pgm').convert('L')
# 3) everything still unknown (deep under the man, 2 px edge band): push-pull
mid_rgb=pushpull(work,kn)
deepT=I(T,N(kn))
soft=mid_rgb.filter(ImageFilter.GaussianBlur(2.5))
mid_rgb=Image.composite(soft,mid_rgb,deepT.filter(ImageFilter.GaussianBlur(3)))
mid_a=alpha_of(mid)
midL=mid_rgb.copy(); midL.putalpha(mid_a)

# ================= FAR =================
far_inp=Image.open('far_inp.png').convert('RGB'); deep=Image.open('far_deep.png'); filled=Image.open('far_filled.png')
far=pushpull(far_inp,deep.point(lambda v:0 if v>127 else 255))
far=Image.composite(far.filter(ImageFilter.GaussianBlur(3)),far,deep.filter(ImageFilter.GaussianBlur(4)))
hole=Image.open('hole_far.png')
# take the hard pixel mosaic off the exemplar fill
soft=far.filter(ImageFilter.GaussianBlur(0.7))
far=Image.composite(soft,far,ero(hole,1).filter(ImageFilter.GaussianBlur(1.0)))
# tone-match the fill to the real pixels along the hole boundary (membrane correction), so no seam outlines the erased shapes
def F01(m): return ImageMath.lambda_eval(lambda g: g['float'](g['m'])/255.0, m=m)
def LP(f): return f.resize((W//6,H//6),Image.BOX).resize((W,H),Image.BICUBIC)
m_out=F01(I(dil(hole,4),N(hole))); m_in=F01(I(hole,N(ero(hole,4))))
wo=LP(m_out); wi=LP(m_in)
valid=ImageMath.lambda_eval(lambda g: g['convert']((g['a']>0.08)*(g['b']>0.08)*255,'L'), a=wo, b=wi)
d8=[]
for cr,cf in zip(src.split(),far.split()):
    lr=LP(ImageMath.lambda_eval(lambda g: g['float'](g['c'])*g['m'], c=cr, m=m_out))
    lf=LP(ImageMath.lambda_eval(lambda g: g['float'](g['c'])*g['m'], c=cf, m=m_in))
    d8.append(ImageMath.lambda_eval(lambda g: g['convert'](g['min'](g['max']((g['lr']/(g['wo']+1e-6)-g['lf']/(g['wi']+1e-6))/2.0+128.5,0.0),255.0),'L'), lr=lr, lf=lf, wo=wo, wi=wi))
dext=pushpull(Image.merge('RGB',d8),valid).filter(ImageFilter.GaussianBlur(5))
fall=F01(N(ero(hole,30).filter(ImageFilter.GaussianBlur(20))))
corr=[ImageMath.lambda_eval(lambda g: g['convert'](g['min'](g['max'](g['float'](g['c'])+g['min'](g['max']((g['float'](g['d'])-128.0)*2.0,-45.0),45.0)*g['f']+0.5,0.0),255.0),'L'), c=c, d=d, f=fall) for c,d in zip(far.split(),dext.split())]
far=Image.merge('RGB',corr)
far=Image.composite(far,src,hole)
far.save('far_full.png')

# ================= CARRIER =================
carrier=bill.filter(ImageFilter.GaussianBlur(2))

os.makedirs(OUT,exist_ok=True)
near.save(OUT+'near.webp',lossless=True,quality=100,method=6)
midL.save(OUT+'mid.webp',lossless=True,quality=100,method=6)
far.save(OUT+'far.webp',lossless=True,quality=100,method=6)
carrier.save(OUT+'carrier.png')
near.save('near.png'); midL.save('mid.png')
