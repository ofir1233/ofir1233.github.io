# contact strip: python3 strip.py out.png label1=file1 label2=file2 ...
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]; items = [a.split('=', 1) for a in sys.argv[2:]]
cols = 5; tw = 640; ims = []
for lab, f in items:
    im = Image.open(f).convert('RGB'); im = im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS); ims.append((lab, im))
th = ims[0][1].height; rows = (len(ims) + cols - 1) // cols; pad = 14; lab_h = 34
sheet = Image.new('RGB', (cols * tw + (cols + 1) * pad, rows * (th + lab_h) + (rows + 1) * pad), (255, 255, 255))
d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 22)
except Exception: font = ImageFont.load_default()
for i, (lab, im) in enumerate(ims):
    x = pad + (i % cols) * (tw + pad); y = pad + (i // cols) * (th + lab_h + pad)
    d.text((x, y + 4), lab, fill=(23, 27, 32), font=font); sheet.paste(im, (x, y + lab_h))
sheet.save(out); print(out, sheet.size)
