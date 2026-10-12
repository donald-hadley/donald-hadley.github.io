# School Games

The menu is `SchoolGames/index.html`. All four games live in this section:

- `AdditionSubtraction/` — addition and subtraction
- `GreaterLessThan/` — comparing numbers
- `PictureWords/` — picture-word practice
- `BirbQuiz/` — Quarter 1 vocabulary

Each game has an `index.html` and `game.js`. The school menu and games use shared
styles and the book logo from the repository's `assets/` folder. Keep those
assets and all game files together when deploying. The two math games celebrate
correct answers and wait three seconds before the next question.

Use **All games** inside a game to return to this section. Use **Home** on the
school menu to return to the general site, or **Family Tree** to visit the archive.

## Update Picture Words

Add or rename images in `SchoolGames/PictureWords/Images/`. From the **repository
root**, run:

```sh
python3 scripts/generate_picture_tags.py
```

This recreates `SchoolGames/PictureWords/tags.js` with filename-based words,
letter counts, and built-in categories. Apply custom catalog edits after
regenerating, then publish the catalog and images together. Players do not
need Python.

See the [repository README](../README.md) for publishing and local preview steps.
