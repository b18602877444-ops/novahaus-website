from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas


BRAND = Path(__file__).resolve().parents[1]
LOGO = BRAND / "logo"
PNG = BRAND / "png"
PDF = BRAND / "pdf"

BLACK = "#0B0B0B"
GOLD = "#C8A24A"
WHITE = "#FFFFFF"
MUTED = "#77736A"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\segoeui.ttf"


def svg_mark(color=GOLD, transform=""):
    return f'''<g transform="{transform}" fill="none" stroke="{color}" stroke-width="112" stroke-linecap="square" stroke-linejoin="miter">
  <path d="M192 792V208L512 500L832 208V792" />
  <path d="M192 500H832" />
  <path d="M512 500V792" />
</g>'''


def svg_wordmark(color=BLACK, x=512, y=900, size=72, tracking=18):
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="Space Grotesk, Inter, Arial, sans-serif" font-size="{size}" font-weight="600" letter-spacing="{tracking}" text-anchor="middle">NOVAHAUS</text>'


def write_svg(path, width, height, content, title, background=None):
    bg = f'<rect width="100%" height="100%" fill="{background}" />' if background else ""
    document = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">NOVAHAUS C2 premium geometric N/H identity. The logo lockup uses NOVAHAUS only.</desc>
  {bg}
  {content}
</svg>
'''
    path.write_text(document, encoding="utf-8")


def create_svgs():
    write_svg(LOGO / "NOVAHAUS_Master.svg", 1024, 1024, svg_mark() + svg_wordmark(), "NOVAHAUS Master Logo")
    write_svg(LOGO / "NOVAHAUS_Vertical.svg", 1024, 1024, svg_mark() + svg_wordmark(), "NOVAHAUS Vertical Logo")
    write_svg(LOGO / "NOVAHAUS_Horizontal.svg", 1600, 520, svg_mark(transform="translate(40 24) scale(.46)") + svg_wordmark(x=1110, y=302, size=82, tracking=20), "NOVAHAUS Horizontal Logo")
    write_svg(LOGO / "NOVAHAUS_Horizontal_White.svg", 1600, 520, svg_mark(color=GOLD, transform="translate(40 24) scale(.46)") + svg_wordmark(color=WHITE, x=1110, y=302, size=82, tracking=20), "NOVAHAUS Horizontal White Logo")
    write_svg(LOGO / "NOVAHAUS_Reversed.svg", 1024, 1024, svg_mark(color=GOLD) + svg_wordmark(color=WHITE), "NOVAHAUS Reversed Logo", BLACK)
    write_svg(LOGO / "NOVAHAUS_Horizontal_Reversed.svg", 1600, 520, svg_mark(color=GOLD, transform="translate(40 24) scale(.46)") + svg_wordmark(color=WHITE, x=1110, y=302, size=82, tracking=20), "NOVAHAUS Reversed Horizontal Logo", BLACK)
    write_svg(LOGO / "NOVAHAUS_Mark.svg", 1024, 1024, svg_mark(), "NOVAHAUS C2 Mark")
    write_svg(LOGO / "NOVAHAUS_Favicon.svg", 1024, 1024, svg_mark(), "NOVAHAUS Favicon", BLACK)


def font(path, size):
    return ImageFont.truetype(path, size)


def scaled_points(points, scale, offset=(0, 0)):
    ox, oy = offset
    return [(int(ox + x * scale), int(oy + y * scale)) for x, y in points]


def draw_mark(draw, scale, offset, color, width=112):
    left = scaled_points([(192, 792), (192, 208), (512, 500), (832, 208), (832, 792)], scale, offset)
    cross = scaled_points([(192, 500), (832, 500)], scale, offset)
    stem = scaled_points([(512, 500), (512, 792)], scale, offset)
    stroke = max(1, int(width * scale))
    draw.line(left, fill=color, width=stroke, joint="curve")
    draw.line(cross, fill=color, width=stroke)
    draw.line(stem, fill=color, width=stroke)


def draw_tracked(draw, text, center_x, top_y, typeface, color, tracking):
    widths = [draw.textlength(char, font=typeface) for char in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = center_x - total / 2
    for char, char_width in zip(text, widths):
        draw.text((x, top_y), char, font=typeface, fill=color, anchor="lt")
        x += char_width + tracking


def new_image(width, height, bg):
    return Image.new("RGBA", (width, height), bg)


def vertical_png(width, height, bg, mark_color, text_color):
    image = new_image(width, height, bg)
    draw = ImageDraw.Draw(image)
    scale = min(width, height) / 1024
    draw_mark(draw, scale, ((width - 1024 * scale) / 2, 0), mark_color, 112)
    draw_tracked(draw, "NOVAHAUS", width / 2, int(838 * scale), font(FONT_BOLD, int(72 * scale)), text_color, 18 * scale)
    return image


def horizontal_png(width, height, bg, mark_color, text_color):
    image = new_image(width, height, bg)
    draw = ImageDraw.Draw(image)
    scale = min(height / 520, 0.54)
    offset = (int(38 * scale), int((height - 520 * scale) / 2))
    draw_mark(draw, scale, offset, mark_color, 112)
    draw_tracked(draw, "NOVAHAUS", int(width * 0.65), int(height * 0.42), font(FONT_BOLD, int(height * 0.23)), text_color, height * 0.032)
    return image


def save_pngs():
    transparent = (0, 0, 0, 0)
    vertical_png(4096, 4096, transparent, GOLD, BLACK).save(PNG / "NOVAHAUS_Master_Transparent.png")
    vertical_png(4096, 4096, BLACK, GOLD, WHITE).save(PNG / "NOVAHAUS_Master_Black_Background.png")
    vertical_png(4096, 4096, WHITE, GOLD, BLACK).save(PNG / "NOVAHAUS_Master_White_Background.png")
    vertical_png(4096, 4096, transparent, GOLD, BLACK).save(PNG / "NOVAHAUS_Vertical.png")
    horizontal_png(2400, 720, transparent, GOLD, BLACK).save(PNG / "NOVAHAUS_Horizontal.png")
    horizontal_png(2400, 720, BLACK, GOLD, WHITE).save(PNG / "NOVAHAUS_Horizontal_Black_Background.png")
    horizontal_png(2400, 720, WHITE, GOLD, BLACK).save(PNG / "NOVAHAUS_Horizontal_White_Background.png")
    horizontal_png(2400, 520, transparent, GOLD, BLACK).save(PNG / "NOVAHAUS_Website_Header.png")
    vertical_png(2048, 2048, BLACK, GOLD, WHITE).save(PNG / "NOVAHAUS_Social_Avatar.png")
    vertical_png(180, 180, BLACK, GOLD, WHITE).save(PNG / "apple-touch-icon.png")

    for size in (16, 32, 48, 64, 128, 256):
        vertical_png(size, size, BLACK, GOLD, WHITE).save(PNG / f"favicon-{size}x{size}.png")


def pdf_mark(c, cx, cy, scale, color):
    c.setStrokeColor(HexColor(color))
    c.setLineWidth(112 * scale)
    c.setLineCap(0)
    c.setLineJoin(0)
    pts = [(192, 792), (192, 208), (512, 500), (832, 208), (832, 792)]
    c.line(cx + (pts[0][0] - 512) * scale, cy + (pts[0][1] - 500) * scale, cx + (pts[1][0] - 512) * scale, cy + (pts[1][1] - 500) * scale)
    for start, end in zip(pts[1:], pts[2:]):
        c.line(cx + (start[0] - 512) * scale, cy + (start[1] - 500) * scale, cx + (end[0] - 512) * scale, cy + (end[1] - 500) * scale)
    c.line(cx + (192 - 512) * scale, cy, cx + (832 - 512) * scale, cy)
    c.line(cx, cy, cx, cy + (792 - 500) * scale)


def pdf_wordmark(c, x, y, size, color, align="center"):
    c.setFillColor(HexColor(color))
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(x, y, "NOVAHAUS") if align == "center" else c.drawString(x, y, "NOVAHAUS")


def make_master_pdf():
    path = PDF / "NOVAHAUS_Master.pdf"
    c = canvas.Canvas(str(path), pagesize=landscape(A4))
    width, height = landscape(A4)
    c.setFillColor(HexColor(BLACK))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica", 8)
    c.drawString(42, height - 42, "NOVAHAUS / MASTER LOGO")
    pdf_mark(c, 190, height / 2 + 25, 0.28, GOLD)
    pdf_wordmark(c, 190, 82, 22, WHITE)
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica", 30)
    c.drawString(385, height - 90, "NOVAHAUS")
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 11)
    c.drawString(388, height - 115, "C2 geometric N/H identity system")
    c.setStrokeColor(HexColor(GOLD))
    c.setLineWidth(1)
    c.line(388, height - 135, width - 54, height - 135)
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(388, height - 180, "PRIMARY")
    c.setFillColor(HexColor(BLACK))
    c.roundRect(388, height - 360, 170, 140, 8, fill=1, stroke=0)
    pdf_mark(c, 473, height - 290, 0.12, GOLD)
    pdf_wordmark(c, 473, height - 356, 11, WHITE)
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(588, height - 180, "REVERSED")
    c.setFillColor(HexColor(WHITE))
    c.roundRect(588, height - 360, 170, 140, 8, fill=1, stroke=0)
    pdf_mark(c, 673, height - 290, 0.12, GOLD)
    pdf_wordmark(c, 673, height - 356, 11, BLACK)
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 9)
    c.drawString(388, 58, "Primary Gold #C8A24A  ·  Black #0B0B0B  ·  White #FFFFFF")
    c.save()


def page_header(c, title, section):
    width, height = A4
    c.setFillColor(HexColor(BLACK))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica", 8)
    c.drawString(42, height - 42, f"NOVAHAUS / {section.upper()}")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 25)
    c.drawString(42, height - 94, title)
    c.setStrokeColor(HexColor(GOLD))
    c.setLineWidth(1)
    c.line(42, height - 115, width - 42, height - 115)


def make_guideline_pdf():
    path = PDF / "NOVAHAUS_Brand_Guideline.pdf"
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    page_header(c, "Premium Brand Guideline", "Brand System")
    pdf_mark(c, width / 2, 455, 0.31, GOLD)
    pdf_wordmark(c, width / 2, 245, 30, WHITE)
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, 205, "Minimal · Luxury · AI · Premium · International · Technology")
    c.showPage()

    page_header(c, "Logo Architecture", "01 / Logo")
    pdf_mark(c, width / 2, 520, 0.25, GOLD)
    pdf_wordmark(c, width / 2, 350, 24, WHITE)
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 10)
    c.drawString(42, 270, "The C2 mark merges N and H through a shared axis, diagonal structure and controlled negative space.")
    c.drawString(42, 252, "It is designed to read as a single institutional symbol rather than two separate initials.")
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 200, "Approved lockups")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica", 10)
    c.drawString(42, 180, "Master / Vertical / Horizontal / Reversed / Mark-only / Favicon")
    c.showPage()

    page_header(c, "Clear Space & Scale", "02 / Usage")
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 685, "Clear space")
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 10)
    c.drawString(42, 665, "Keep a minimum clear space equal to the width of the central stem on all sides.")
    pdf_mark(c, 180, 510, 0.18, GOLD)
    c.setStrokeColor(HexColor(GOLD))
    c.setDash(3, 3)
    c.rect(108, 438, 144, 144, fill=0, stroke=1)
    c.setDash()
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 350, "Minimum sizes")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica", 10)
    c.drawString(42, 330, "Mark-only: 16 px digital / 8 mm print")
    c.drawString(42, 312, "Horizontal lockup: 120 px digital / 28 mm print")
    c.drawString(42, 294, "Never compress, rotate, outline or add effects to the mark.")
    c.showPage()

    page_header(c, "Color & Typography", "03 / Visual Language")
    swatches = [(BLACK, "Black", "#0B0B0B"), (GOLD, "Primary Gold", "#C8A24A"), (WHITE, "White", "#FFFFFF")]
    x = 42
    for color, label, code in swatches:
        c.setFillColor(HexColor(color))
        c.roundRect(x, 535, 146, 112, 8, fill=1, stroke=0)
        c.setFillColor(HexColor(WHITE if color != WHITE else BLACK))
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 12, 555, label)
        c.setFont("Helvetica", 9)
        c.drawString(x + 12, 539, code)
        x += 166
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 455, "Primary display")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 28)
    c.drawString(42, 415, "Space Grotesk")
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 350, "Body and interface")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica", 24)
    c.drawString(42, 312, "Inter")
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 10)
    c.drawString(42, 255, "Use typography with generous tracking, controlled contrast and no decorative effects.")
    c.showPage()

    page_header(c, "Digital Applications", "04 / Product")
    c.setFillColor(HexColor(WHITE))
    c.roundRect(42, 420, 510, 170, 12, fill=1, stroke=0)
    pdf_mark(c, 120, 505, 0.1, GOLD)
    c.setFillColor(HexColor(BLACK))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(190, 512, "NOVAHAUS")
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 9)
    c.drawString(190, 492, "Website header / primary lockup")
    c.setFillColor(HexColor(GOLD))
    c.roundRect(42, 240, 160, 140, 22, fill=1, stroke=0)
    pdf_mark(c, 122, 310, 0.11, BLACK)
    c.setFillColor(HexColor(WHITE))
    c.roundRect(250, 240, 160, 140, 22, fill=1, stroke=0)
    pdf_mark(c, 330, 310, 0.11, BLACK)
    c.setFillColor(HexColor(GOLD))
    c.roundRect(458, 240, 94, 140, 22, fill=1, stroke=0)
    pdf_mark(c, 505, 310, 0.075, BLACK)
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 9)
    c.drawString(42, 205, "Website / App Icon / Social Avatar")
    c.showPage()

    page_header(c, "Print Applications", "05 / Editorial")
    c.setFillColor(HexColor(WHITE))
    c.roundRect(42, 370, 250, 170, 8, fill=1, stroke=0)
    c.setFillColor(HexColor(BLACK))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(64, 500, "NOVAHAUS")
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica", 8)
    c.drawString(64, 480, "AI AUTOMATION / BRAND / DIGITAL")
    c.setFillColor(HexColor(BLACK))
    c.setFont("Helvetica", 9)
    c.drawString(64, 430, "hello@novahaus.studio")
    c.setFillColor(HexColor(BLACK))
    c.rect(342, 370, 210, 170, fill=1, stroke=0)
    pdf_mark(c, 447, 455, 0.13, GOLD)
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica", 9)
    c.drawCentredString(447, 398, "NOVAHAUS")
    c.setFillColor(HexColor(GOLD))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(42, 300, "Application rule")
    c.setFillColor(HexColor(MUTED))
    c.setFont("Helvetica", 10)
    c.drawString(42, 278, "Use the flat master mark for production. Reserve metallic treatment for controlled presentation surfaces.")
    c.save()


if __name__ == "__main__":
    for directory in (LOGO, PNG, PDF):
        directory.mkdir(parents=True, exist_ok=True)
    create_svgs()
    save_pngs()
    make_master_pdf()
    make_guideline_pdf()
    print("Brand assets generated")
