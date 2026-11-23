from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageMath
W,H=1600,832
src=Image.open('src.png').convert('RGB')
R,G,B=src.split()
def poly(pts,S=4):
    im=Image.new('L',(W*S,H*S),0)
    ImageDraw.Draw(im).polygon([(x*S,y*S) for x,y in pts],fill=255)
    return im.resize((W,H),Image.BOX)
def thr(m,t=127): return m.point(lambda v:255 if v>t else 0)
def union(*ms):
    o=ms[0]
    for m in ms[1:]: o=ImageChops.lighter(o,m)
    return o
def inter(a,b): return ImageChops.darker(a,b)
def sub(a,b): return ImageChops.darker(a,ImageChops.invert(b))
def fillholes(m,seeds=((W-1,0),)):
    t=thr(m).copy()
    for s in seeds:
        if t.getpixel(s)==0: ImageDraw.floodfill(t,s,128)
    return t.point(lambda v:0 if v==128 else 255)
def keep(m,seeds):
    t=thr(m).copy()
    for s in seeds:
        if t.getpixel(s)==255: ImageDraw.floodfill(t,s,200)
        else: print('seed not in mask',s)
    return t.point(lambda v:255 if v==200 else 0)
def opening(m,k=3): return m.filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
def closing(m,k=3): return m.filter(ImageFilter.MaxFilter(k)).filter(ImageFilter.MinFilter(k))
def cond(expr):
    # expr: lambda over int images r,g,b -> boolean image
    out=ImageMath.lambda_eval(lambda a: a['convert'](expr(a['r'],a['g'],a['b'])*255,'L'),r=R,g=G,b=B)
    return out

# ---------- MAN ----------
head=thr(Image.open('v_head.png').convert('L'))
roi=poly([(0,650),(120,650),(150,690),(200,690),(212,650),(235,615),(262,602),(270,589),(282,584),(300,586),(305,600),(302,640),(312,660),(342,690),(354,720),(352,770),(344,800),(350,832),(0,832)])
nontable=cond(lambda r,g,b: ((g-r)<=30) | (b<=g))
skin=cond(lambda r,g,b: r>b)
fz=poly([(250,575),(312,575),(312,640),(250,640)])
nontable=union(sub(nontable,thr(fz)),inter(skin,thr(fz)))
body=inter(thr(roi),nontable)
man=union(head,body)
man=opening(man,3)
man=fillholes(man)
man=keep(man,[(100,500)])
man.save('m_man_raw.png')

# ---------- TABLE ----------
edge=[(200,606),(220,597),(240,589),(260,582),(280,575),(300,569),(320,563),(340,558),(360,553),(400,549),(450,546),(495,544),(520,541),(540,538),(560,536),(600,531),(650,527),(680,524.5),(700,523),(720,521.5),(760,518),(800,515),(850,512),(900,510),(940,509),(960,509),(1000,511),(1020,513),(1040,516),(1080,521),(1100,525),(1120,529),(1140,533),(1160,536),(1180,538),(1200,540),(1220,543),(1240,547),(1260,551),(1280,556),(1300,562),(1320,567),(1340,573),(1360,578),(1380,584),(1400,591),(1420,598),(1440,606),(1460,617),(1480,629),(1500,643),(1520,659),(1540,680),(1560,703),(1570,720),(1580,745),(1588,770),(1592,800),(1592,832)]
left=[(22,832),(26,802),(34,772),(46,742),(62,715),(80,692),(100,672),(120,655),(140,640),(160,627),(180,616)]
edge=[(x,y+1.2) for x,y in edge]
table=poly(left+edge)
table.save('m_table.png')

# ---------- CUP ----------
cup=thr(Image.open('v_cup.png').convert('L'))
cup.save('m_cup.png')
# ---------- BOUQUET ----------
bp=[(676,522),(678,514),(684,506),(692,501),(703,497),(716,494),(724,490),(736,488),(744,490),(742,482),(741,477),(746,472),(755,468),(753,461),(757,454),(762,450),(762,446),(768,441),(778,442),(781,450),(786,455),(792,461),(797,462),(803,459),(810,462),(813,470),(816,476),(820,468),(822,461),(828,456),(836,456),(840,462),(846,468),(851,470),(852,462),(857,457),(866,456),(873,459),(878,467),(881,473),(886,469),(893,467),(900,469),(904,477),(904,487),(912,485),(922,487),(931,493),(933,500),(927,504),(934,511),(934,535),(676,535)]
bq=thr(poly(bp))
reddish=cond(lambda r,g,b: ((r-g)>25) & ((r-b)>50))
bq=sub(bq,reddish)
bq=opening(bq,3)
bq=fillholes(bq)
bq=keep(bq,[(800,500)])
bq.save('m_bq.png')
# ---------- ROBOT ----------
rob=thr(union(Image.open('v_full.png').convert('L'),Image.open('v_rob.png').convert('L')))
rob.save('m_rob_raw.png')
sky=cond(lambda r,g,b: ((b-r)>60) & (b>150))
hh=thr(poly([(889,85),(918,85),(918,113),(889,113)]))
rob=sub(rob,inter(hh,sky))
rob=union(rob,thr(poly([(1375,455),(1432,452),(1436,470),(1440,490),(1441,503),(1437,510),(1425,513),(1412,513),(1405,516),(1392,518),(1380,517),(1376,512),(1372,480)])),
          thr(poly([(1378,515),(1384,520),(1390,540),(1396,560),(1401,580),(1404,598),(1380,598),(1370,515)])),
          thr(poly([(1318,400),(1345,410),(1348,460),(1338,462),(1318,410)])))
rob=fillholes(closing(rob,3),seeds=((0,0),(1360,340),(900,98),(1150,300),(1050,400)))
rob.save('m_rob.png')
mid=union(thr(table),cup,bq,rob)
mid=fillholes(mid,seeds=((0,0),(1360,340),(900,98),(1150,300),(1050,400)))
mid.save('m_mid_raw.png')
# ---------- BILL ----------
broi=thr(poly([(350,832),(350,792),(540,614),(572,596),(1010,628),(1060,640),(1060,712),(1012,765),(990,832)]))
paper=cond(lambda r,g,b: ((b-r)<12) & ((r-g)<28) & (r>150))
bill=inter(broi,paper)
bill=union(bill,thr(poly([(497,677),(521,655),(540,640),(548,638),(590,660),(530,700)])),
           thr(poly([(1000,632),(1035,634),(1045,645),(1049,660),(1048,680),(1042,695),(1030,703),(1015,703),(1003,698),(1000,690)])))
bill=opening(bill,5)
bill=fillholes(bill,seeds=((0,0),(700,560)))
bill=keep(bill,[(600,650)])
bill.save('m_bill_raw.png')

