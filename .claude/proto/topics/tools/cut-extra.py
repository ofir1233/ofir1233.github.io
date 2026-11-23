# Two more cuts for stage 4, made after the critics' pass. Run from this folder, after cut-art.py (it does not touch the other files).
#   art/cloud-front.webp  the same cut as cut-art.py makes, with the stray streak of paint at its left end taken out
#   art/cloud-back.webp   the plate's top-left cloud (hidden by the heading's clean corner where the sky shows it), to sit on the
#                         sky's upper edge so that edge is a cloud, not a ruled line
from PIL import Image, ImageChops, ImageDraw, ImageFilter
sky = Image.open('plates/sky_final.png').convert('RGB')
def lut(f): return [max(0, min(255, int(f(i)))) for i in range(256)]
def cloud(box, poly, out_w, feather=16):
    c = sky.crop(box); H, S, V = c.convert('HSV').split(); w, h = c.size
    a = ImageChops.multiply(S.point(lut(lambda s: (128 - s) * 3.0)), V.point(lut(lambda v: (v - 150) * 4)))
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(w * x, h * y) for x, y in poly], fill=255)
    a = ImageChops.multiply(a.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.2)), m.filter(ImageFilter.GaussianBlur(feather)))
    cl = c.convert('RGBA'); cl.putalpha(a); bb = a.point(lut(lambda v: 255 if v > 10 else 0)).getbbox(); cl = cl.crop(bb)
    return cl.resize((out_w, round(cl.height * out_w / cl.width)), Image.LANCZOS)
# the front cloud, as in cut-art.py
cl = cloud((1090, 930, 2048, 1310), [(0, .80), (.10, .58), (.30, .32), (.50, .10), (.98, .04), (1, .86), (.82, 1), (.04, 1)], 680)
a = cl.getchannel('A'); k = Image.new('L', cl.size, 255); ImageDraw.Draw(k).rectangle((0, 80, 118, 156), fill=0)      # the streak
cl.putalpha(ImageChops.multiply(a, k.filter(ImageFilter.GaussianBlur(6)))); cl.save('art/cloud-front.webp', quality=90, method=6); print('cloud-front', cl.size)
# the back cloud
cb = cloud((20, 20, 600, 290), [(.02, .30), (.10, .06), (.38, .04), (.60, .30), (.98, .66), (.98, .98), (.30, .98), (.02, .72)], 600, feather=10)
cb.save('art/cloud-back.webp', quality=90, method=6); print('cloud-back', cb.size)
