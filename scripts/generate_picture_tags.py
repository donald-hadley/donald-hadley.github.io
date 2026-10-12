#!/usr/bin/env python3
"""Generate the browser-loadable Picture Words image catalog."""

import json
from pathlib import Path


IMAGE_EXTENSIONS = {
    ".avif", ".bmp", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"
}

CATEGORY_WORDS = {
    "actions": {"drink", "eat", "jump", "more", "run", "sleep", "stop"},
    "animals": {"bear", "bug", "cat", "chicken", "cow", "dinosaur", "dog", "goat", "horse", "mouse", "snake", "wolf"},
    "bathroom": {"bath", "brush", "comb", "diaper", "lotion", "potty", "sink", "toothbrush"},
    "body": {"arm", "ear", "eye", "foot", "hair", "hand", "leg", "mouth", "nose", "teeth", "tongue"},
    "clothing": {"diaper", "glasses", "hat", "pants", "shirt", "shoes", "shorts", "underwear"},
    "colors": {"blue", "gold", "green", "orange", "purple", "red", "silver", "yellow"},
    "directions": {"down", "left", "right", "up"},
    "electronics": {"battery", "charger", "computer", "cord", "ipad", "keyboard", "monitor", "mouse", "phone", "power", "radio", "remote", "switch", "tv"},
    "finance": {"money"},
    "food": {"apple", "banana", "blueberry", "carrot", "chicken", "chips", "cookie", "drink", "eat", "ice cream", "milk", "noodles", "onion", "orange", "oreo", "peach", "potato", "soda", "steak", "water"},
    "furniture": {"bed", "chair", "couch", "pillow", "shelf", "table"},
    "home": {"blanket", "clock", "door", "fan", "floor", "house", "light", "picture", "stairs", "trashcan"},
    "kitchen": {"bottle", "bowl", "fork", "knife", "plate", "refrigerator", "sink", "spoon", "stove"},
    "nature": {"flower", "grass", "lightning", "moon", "plant", "rock", "sand", "stars", "sun", "tree", "water"},
    "school": {"book", "map", "paper", "pen", "pencil", "picture"},
    "shapes": {"circle", "heart", "rectangle", "square", "triangle"},
    "tools": {"bucket", "drill", "hammer", "knife", "saw", "screw", "screwdriver", "wrench"},
    "toys": {"ball", "dinosaur", "slide", "swing", "trampoline"},
    "transportation": {"airplane", "boat", "bus", "car", "helicopter", "road", "truck"},
}


def tags_for(word: str) -> list[str]:
    """Return a letter-count tag followed by applicable semantic categories."""
    letter_count = sum(character.isalpha() for character in word)
    categories = sorted(
        category for category, words in CATEGORY_WORDS.items() if word.lower() in words
    )
    return [f"letters-{letter_count}", *categories]


def main() -> None:
    game_directory = Path(__file__).resolve().parent.parent / "SchoolGames" / "PictureWords"
    images_directory = game_directory / "Images"
    browser_file = game_directory / "tags.js"

    if not images_directory.is_dir():
        raise SystemExit(f"Images directory not found: {images_directory}")

    images = [
        {
            "file": path.relative_to(images_directory).as_posix(),
            "word": (word := path.stem.replace("_", " ").replace("-", " ")),
            "tags": tags_for(word),
        }
        for path in sorted(images_directory.rglob("*"), key=lambda item: item.as_posix().lower())
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    ]

    catalog = {
        "imageDirectory": images_directory.relative_to(game_directory).as_posix(),
        "images": images,
    }
    catalog_json = json.dumps(catalog, indent=2)
    instructions = """/*
PICTURE WORDS CATEGORIZATION INSTRUCTIONS

Review every image entry below and populate its tags array.
- Keep the existing file and word values unchanged.
- Add one or more useful, lowercase semantic category tags, such as animals,
  food, body, clothing, colors, shapes, tools, technology, or transportation.
- Every entry must have a letters-N tag, where N is the number of alphabetic
  letters in the word. Do not count spaces, hyphens, or punctuation.
- Reuse consistent category names across related images and allow an image to
  belong to multiple categories when appropriate.
- Preserve this JavaScript structure so index.html can load the catalog.
*/
"""
    browser_file.write_text(
        f"{instructions}window.PICTURE_WORDS_CATALOG = {catalog_json};\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(images)} images to {browser_file}")


if __name__ == "__main__":
    main()
