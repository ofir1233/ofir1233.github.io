from PIL import Image, ImageDraw, ImageFilter, ImageChops
import random, math
R='/Users/ofirnona/ofir1233.github.io/.claude/fyi/process/'
out='a/'
# avatars
av=Image.open(R+'brand/c1-avatars.jpg').convert('RGB')
crops={'theo':(415,40,715,340),'ines':(805,45,1105,345),'kofi':(45,545,345,845),'maya':(800,585,1110,895)}
for k,b in crops.items():
    av.crop(b).resize((176,176),Image.LANCZOS).save(out+f'av-{k}.jpg',quality=88)
# stickers
sh=Image.open(R+'brand/b2-stickers.jpg').convert('RGB')
def cut(name,box,thr=228):
    im=sh.crop(box); w,h=im.size
    px=im.load()
    # passable = not white-ish
    passable=Image.new('L',(w,h),0); pp=passable.load()
    for y in range(h):
        for x in range(w):
            r,g,b=px[x,y]
            if min(r,g,b)<thr: pp[x,y]=255
    # flood from borders
    white=ImageChops.invert(passable).filter(ImageFilter.MaxFilter(7))
    passable=ImageChops.invert(white); pp=passable.load()
    seen=Image.new('L',(w,h),0); sp=seen.load()
    stack=[(x,0) for x in range(w)]+[(x,h-1) for x in range(w)]+[(0,y) for y in range(h)]+[(w-1,y) for y in range(h)]
    while stack:
        x,y=stack.pop()
        if x<0 or y<0 or x>=w or y>=h: continue
        if sp[x,y] or not pp[x,y]: continue
        sp[x,y]=255
        stack.extend(((x+1,y),(x-1,y),(x,y+1),(x,y-1)))
    mask=ImageChops.invert(seen)
    mask=mask.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(0.8))
    rgba=im.convert('RGBA'); rgba.putalpha(mask)
    bb=mask.point(lambda v:255 if v>20 else 0).getbbox()
    rgba=rgba.crop(bb)
    rgba.save(out+name+'.png')
    print(name,rgba.size)
cut('st-ticket',(380,715,775,960))
cut('st-phones',(780,360,1140,690))
cut('st-mic',(5,325,345,700))
cut('st-can',(1215,665,1440,1010))
cut('st-wave',(1140,10,1536,335))
cut('st-record',(1140,355,1536,670))
# poster art and cover crops
q=Image.open(R+'styles/q1-phone-eye.jpg').convert('RGB')
q.crop((0,60,1024,1340)).resize((640,800),Image.LANCZOS).save(out+'poster-art.jpg',quality=86)
p=Image.open(R+'styles/p1-session.jpg').convert('RGB')
p.crop((1045,215,1175,345)).resize((320,320),Image.LANCZOS).save(out+'cover-a.jpg',quality=86)
s=Image.open(R+'styles/studio-session.jpg').convert('RGB')
s.crop((1700,450,2060,810)).resize((320,320),Image.LANCZOS).save(out+'cover-c.jpg',quality=86)
