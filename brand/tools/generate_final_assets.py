from pathlib import Path
import sys

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


TOOLS = Path(__file__).resolve().parent
BRAND = TOOLS.parent
FINAL = BRAND / "final"

sys.path.insert(0, str(TOOLS))
import render_brand_assets as base  # noqa: E402


BLACK = base.BLACK
GOLD = base.GOLD
WHITE = base.WHITE
MUTED = base.MUTED


def write_final_svgs():
    base.write_svg(
        FINAL / "Logo_Master.svg",
        1024,
        1024,
        base.svg_mark() + base.svg_wordmark(),
        "NOVAHAUS Master Logo",
    )
    base.write_svg(
        FINAL / "Logo_Black.svg",
        1024,
        1024,
        base.svg_mark(color=BLACK) + base.svg_wordmark(color=BLACK),
        "NOVAHAUS Black Logo",
    )
    base.write_svg(
        FINAL / "Logo_White.svg",
        1024,
        1024,
        base.svg_mark(color=WHITE) + base.svg_wordmark(color=WHITE),
        "NOVAHAUS White Logo",
    )
    base.write_svg(
        FINAL / "Logo_Gold.svg",
        1024,
        1024,
        base.svg_mark(color=GOLD) + base.svg_wordmark(color=GOLD),
        "NOVAHAUS Gold Logo",
    )
    base.write_svg(
        FINAL / "Favicon.svg",
        1024,
        1024,
        base.svg_mark(color=GOLD),
        "NOVAHAUS Favicon",
        BLACK,
    )
    base.write_svg(
        FINAL / "Horizontal_Logo.svg",
        1600,
        520,
        base.svg_mark(transform="translate(40 24) scale(.46)")
        + base.svg_wordmark(x=1110, y=302, size=82, tracking=20),
        "NOVAHAUS Horizontal Logo",
    )
    base.write_svg(
        FINAL / "Horizontal_White.svg",
        1600,
        520,
        base.svg_mark(color=GOLD, transform="translate(40 24) scale(.46)")
        + base.svg_wordmark(color=WHITE, x=1110, y=302, size=82, tracking=20),
        "NOVAHAUS Horizontal White Logo",
    )
    base.write_svg(
        FINAL / "Vertical_Logo.svg",
        1024,
        1024,
        base.svg_mark() + base.svg_wordmark(),
        "NOVAHAUS Vertical Logo",
    )


def write_final_pngs():
    base.vertical_png(4096, 4096, (0, 0, 0, 0), GOLD, BLACK).save(FINAL / "Logo_Transparent.png")
    base.vertical_png(4096, 4096, WHITE, GOLD, BLACK).save(FINAL / "Logo_White.png")
    base.vertical_png(4096, 4096, BLACK, GOLD, WHITE).save(FINAL / "Logo_Black.png")
    base.vertical_png(4096, 4096, GOLD, BLACK, BLACK).save(FINAL / "Logo_Gold.png")

    base.vertical_png(4096, 4096, BLACK, GOLD, WHITE).save(FINAL / "Social_Avatar.png")
    base.horizontal_png(2400, 520, (0, 0, 0, 0), GOLD, BLACK).save(FINAL / "Website_Header_Logo.png")
    base.horizontal_png(2400, 720, (0, 0, 0, 0), GOLD, BLACK).save(FINAL / "Horizontal_Logo.png")
    base.vertical_png(4096, 4096, (0, 0, 0, 0), GOLD, BLACK).save(FINAL / "Vertical_Logo.png")

    for size in (16, 32, 48, 64, 128, 256):
        base.vertical_png(size, size, BLACK, GOLD, WHITE).save(FINAL / f"Favicon_{size}.png")
    base.vertical_png(180, 180, BLACK, GOLD, WHITE).save(FINAL / "Apple_Touch_Icon.png")


def write_logo_usage_guide():
    path = FINAL / "Logo_Usage_Guide.pdf"
    page_width, page_height = A4
    c = canvas.Canvas(str(path), pagesize=A4)

    def header(label, title, page_number):
        c.setFillColor(HexColor(BLACK))
        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
        c.setFillColor(HexColor(GOLD))
        c.setFont("Helvetica-Bold", 9)
        c.drawString(48, page_height - 52, label)
        c.setFillColor(HexColor(WHITE))
        c.setFont("Helvetica-Bold", 30)
        c.drawString(48, page_height - 112, title)
        c.setStrokeColor(HexColor(GOLD))
        c.setLineWidth(1)
        c.line(48, page_height - 132, page_width - 48, page_height - 132)
        c.setFillColor(HexColor(MUTED))
        c.setFont("Helvetica", 8)
        c.drawRightString(page_width - 48, 34, f"NOVAHAUS / {page_number:02d}")

    def body(text, x, y, size=11, color=MUTED, font="Helvetica"):
        c.setFillColor(HexColor(color))
        c.setFont(font, size)
        c.drawString(x, y, text)

    header("NOVAHAUS / FINAL SYSTEM", "Logo Usage Guide", 1)
    body("The NOVAHAUS identity is a precise geometric N/H mark paired with a restrained wordmark.", 48, 616, 12, WHITE)
    body("Use the supplied master files for every production application.", 48, 592, 12, WHITE)
    c.setFillColor(HexColor(WHITE))
    c.rect(88, 250, 170, 170, fill=1, stroke=0)
    base.pdf_mark(c, 173, 342, 0.12, GOLD)
    c.setFillColor(HexColor(BLACK))
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(173, 275, "NOVAHAUS")
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(330, 386, "Primary master")
    body("Gold mark / black wordmark", 330, 360, 11)
    body("Use on light, quiet backgrounds.", 330, 338, 11)
    c.showPage()

    header("01 / VARIANTS", "Approved Variants", 2)
    variants = [("Logo_Master.svg", GOLD, BLACK), ("Logo_Black.svg", BLACK, BLACK), ("Logo_White.svg", WHITE, WHITE), ("Logo_Gold.svg", GOLD, GOLD)]
    backgrounds = [WHITE, WHITE, BLACK, BLACK]
    for index, (name, mark_color, text_color) in enumerate(variants):
        x = 48 + (index % 2) * 260
        y = 470 - (index // 2) * 220
        bg = backgrounds[index]
        c.setFillColor(HexColor(bg))
        c.roundRect(x, y, 220, 150, 12, fill=1, stroke=0)
        base.pdf_mark(c, x + 110, y + 102, 0.075, mark_color)
        c.setFillColor(HexColor(text_color))
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(x + 110, y + 52, "NOVAHAUS")
        body(name, x, y - 20, 9, WHITE)
    c.showPage()

    header("02 / CLEAR SPACE", "Protection Zone", 3)
    body("Keep a minimum clear space around the logo equal to the width of the inner vertical stem.", 48, 620, 11, WHITE)
    c.setStrokeColor(HexColor(GOLD))
    c.setLineWidth(2)
    c.rect(146, 290, 300, 220, fill=0, stroke=1)
    c.setFillColor(HexColor(GOLD))
    c.rect(196, 340, 200, 120, fill=0, stroke=1)
    base.pdf_mark(c, 296, 420, 0.07, GOLD)
    c.setFillColor(HexColor(WHITE))
    c.setFont("Helvetica-Bold", 15)
    c.drawCentredString(296, 365, "NOVAHAUS")
    body("Do not place text, borders or competing marks inside the protection zone.", 48, 230, 11)
    c.showPage()

    header("03 / MISUSE", "Never Distort", 4)
    body("Do not stretch, rotate, outline, bevel, add glow, or apply unapproved gradients.", 48, 620, 11, WHITE)
    examples = [("DO NOT STRETCH", 48, 414), ("DO NOT ROTATE", 300, 414), ("DO NOT GLOW", 48, 220), ("DO NOT OUTLINE", 300, 220)]
    for label, x, y in examples:
        c.setFillColor(HexColor("#1A1A1A"))
        c.roundRect(x, y, 200, 130, 10, fill=1, stroke=0)
        base.pdf_mark(c, x + 100, y + 90, 0.045, GOLD)
        c.setFillColor(HexColor(WHITE))
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(x + 100, y + 38, label)
    c.showPage()

    header("04 / APPLICATION", "Where To Use It", 5)
    applications = [
        ("Website", "Horizontal_Logo.svg", "Use the primary horizontal lockup on light surfaces."),
        ("Dark interface", "Horizontal_White.svg", "Use the white wordmark with the gold mark."),
        ("Avatar / favicon", "Favicon.svg", "Use the mark-only file at small sizes."),
        ("Print", "Logo_Master.svg", "Use vector masters for cards and letterheads."),
    ]
    for index, (title, file_name, description) in enumerate(applications):
        y = 530 - index * 92
        c.setFillColor(HexColor("#161616"))
        c.roundRect(48, y, page_width - 96, 64, 8, fill=1, stroke=0)
        c.setFillColor(HexColor(GOLD))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(68, y + 39, title)
        body(file_name, 190, y + 39, 9, WHITE)
        body(description, 190, y + 20, 9)
    c.showPage()

    c.save()


def main():
    FINAL.mkdir(parents=True, exist_ok=True)
    write_final_svgs()
    write_final_pngs()

    base.LOGO = FINAL
    base.PNG = FINAL
    base.PDF = FINAL
    base.make_master_pdf()
    base.make_guideline_pdf()
    (FINAL / "NOVAHAUS_Master.pdf").replace(FINAL / "Master_Logo.pdf")
    (FINAL / "NOVAHAUS_Brand_Guideline.pdf").replace(FINAL / "Brand_Guideline.pdf")
    write_logo_usage_guide()
    print("Final brand assets generated")


if __name__ == "__main__":
    main()
