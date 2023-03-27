from PIL import Image, ImageDraw, ImageFont
from textwrap import wrap
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))


def create_image(title: str):
    icon = Image.open(sys.path[0] + "/zoverflow.png")
    icon = icon.resize((int(icon.width * 0.85), int(icon.height * 0.85)))

    width = 1920
    height = 1080

    img = Image.new(mode="RGB", size=(width, height), color="#454545")

    img.paste(
        icon,
        (int(width / 4 - icon.size[0] / 2), int(height / 2 - icon.size[1] / 2)),
        icon,
    )

    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(sys.path[0] + "/Poppins.ttf", 106)
    draw.text(
        (int(2.75 * width / 4), int(height / 2)),
        "\n".join(wrap(title, width=15)),
        fill="#e5e5e3",
        font=font,
        align="center",
        anchor="mm",
    )

    return img
