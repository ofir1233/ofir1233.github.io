# Art for stage 4, cut from the two painted plates in plates/.
#   sky_final.png (2048x1360)      -> art/sky.webp (far plane; its low right cloud painted out, because that cloud is the front one)
#                                     art/cloud-front.webp (that cloud, alpha from its difference to the blue around it)
#   elements_final.png (1600x1072) -> art/city.webp, art/hydrangeas.webp, art/wisteria.webp (alpha by flooding the grey ground)
# Each cut is exported at twice the size it is shown at (see topics.css), except the sky (native) and the wisteria (native: 2x of 460).
from PIL import Image, ImageChops, ImageDraw, ImageFilter
sky = Image.open('plates/sky_final.webp').convert('RGB'); el = Image.open('plates/elements_final.webp').convert('RGB')
def lut(f): return [max(0, min(255, int(f(i)))) for i in range(256)]

# ── the grey ground: flooded from the plate's edges and from the gaps between the pieces. The tolerance is low on purpose:
#    white facades, the white beam and white petals touch the ground, and they differ from it by more than this.
KEY = (255, 0, 255); g = el.copy()
for seed in [(3, 3), (1596, 1068), (3, 1068), (800, 500), (640, 100), (1300, 640), (1560, 800), (60, 120), (740, 1050), (1450, 1040), (300, 130), (20, 600)]:
    if g.getpixel(seed) != KEY: ImageDraw.floodfill(g, seed, KEY, thresh=13)
notground = Image.eval(ImageChops.difference(g, Image.new('RGB', g.size, KEY)).convert('L'), lambda v: 0 if v == 0 else 255)
# islands of ground shut in between leaves: flat patches of the ground's own colour, at least a few pixels across (petals and facades
# are lighter than the ground and never flat, so they are left alone)
d = ImageChops.difference(el, Image.new('RGB', el.size, (233, 232, 229))); r_, g_, b_ = d.split()
near = ImageChops.lighter(ImageChops.lighter(r_, g_), b_).point(lut(lambda v: 255 if v <= 4 else 0))
isl = near.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(7)); isl = ImageChops.multiply(isl, near)
notground = ImageChops.multiply(notground, ImageChops.invert(isl))
def piece(name, box, out_w, keep=None, inward=3):
    a = notground.crop(box)
    if keep: m = Image.new('L', el.size, 0); ImageDraw.Draw(m).polygon(keep, fill=255); a = ImageChops.multiply(a, m.crop(box))
    a = a.filter(ImageFilter.MinFilter(inward)).filter(ImageFilter.GaussianBlur(.6))      # 1px inward (2 where a pale fringe showed on blue), then a slight feather
    bb = a.getbbox(); im = el.crop(box).convert('RGBA'); im.putalpha(a); im = im.crop(bb)
    full = im.size; im = im.resize((out_w, round(im.height * out_w / im.width)), Image.LANCZOS) if out_w and out_w < im.width else im
    im.save('art/' + name + '.webp', quality=90, method=6); print(name, 'cut', full, 'exported', im.size); return im
city = piece('city', (0, 160, 740, 1060), 608, keep=[(0, 160), (650, 160), (650, 500), (740, 500), (740, 1060), (0, 1060)])
hyd = piece('hydrangeas', (760, 530, 1420, 1068), 488, inward=5)
wis = piece('wisteria', (640, 0, 1600, 600), 0, keep=[(640, 0), (1600, 0), (1600, 600), (1260, 600), (1260, 525), (900, 525), (760, 330), (640, 300)])

# ── the front cloud: how far each pixel is from the blue around it (less colour, more light)
box = (1090, 930, 2048, 1310); c = sky.crop(box); H, S, V = c.convert('HSV').split()
a = ImageChops.multiply(S.point(lut(lambda s: (128 - s) * 3.0)), V.point(lut(lambda v: (v - 150) * 4)))
w, h = c.size; m = Image.new('L', (w, h), 0)
ImageDraw.Draw(m).polygon([(0, h * .80), (w * .10, h * .58), (w * .30, h * .32), (w * .50, h * .10), (w * .98, h * .04), (w, h * .86), (w * .82, h), (w * .04, h)], fill=255)
a = ImageChops.multiply(a.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.2)), m.filter(ImageFilter.GaussianBlur(16)))
cl = c.convert('RGBA'); cl.putalpha(a); bb = a.point(lut(lambda v: 255 if v > 10 else 0)).getbbox(); cl = cl.crop(bb); full = cl.size
cl = cl.resize((680, round(cl.height * 680 / cl.width)), Image.LANCZOS); cl.save('art/cloud-front.webp', quality=90, method=6); print('cloud-front cut', full, 'exported', cl.size)

# ── the sky without that cloud: sky from the same rows, further left, is laid over it through a soft mask
hole = Image.new('L', sky.size, 0); hole.paste(a.point(lut(lambda v: 255 if v > 6 else 0)).filter(ImageFilter.MaxFilter(31)), box[:2])
ImageDraw.Draw(hole).rectangle((1100, 1360 - 4, 2048, 1360), fill=0); hole = hole.filter(ImageFilter.GaussianBlur(14))
shift = 880; donor = ImageChops.offset(sky, shift, 0)
far = Image.composite(donor, sky, hole); far.save('art/sky.webp', quality=84, method=6); print('sky', far.size)

# ── checks: every cut at 200% on the page ground and on sky blue; and at 100% over the sky itself
def check(im, name):
    big = im.resize((im.width * 2, im.height * 2), Image.LANCZOS) if im.width * 2 <= 1900 else im
    sh = Image.new('RGB', (big.width * 2 + 30, big.height + 20), (244, 243, 241)); ImageDraw.Draw(sh).rectangle((big.width + 20, 0, sh.width, sh.height), fill=(58, 140, 236))
    sh.paste(big, (10, 10), big); sh.paste(big, (big.width + 20, 10), big); sh.save('shots/x-cut-' + name + '.png')
    bg = far.crop((300, 300, 300 + im.width + 80, 300 + im.height + 80)).copy(); bg.paste(im, (40, 40), im); bg.save('shots/12-cut-' + name + '-over-sky-100pct.png')
for im, n in [(city, 'city'), (hyd, 'hydrangeas'), (wis, 'wisteria'), (cl, 'cloud-front')]: check(im, n)
far.resize((1024, 680)).save('shots/x-sky-far.png')
