# Family & Learning

The root `index.html` is the general home page, with two main areas:

- **Family Tree** — the existing family archive and relationship explorer
- **School Games** — the game menu and all four learning games

## Folder layout

```text
index.html                         General home page
FamilyTree/                        Family explorer, data, and images
SchoolGames/index.html             School Games menu
SchoolGames/AdditionSubtraction/    Addition and subtraction
SchoolGames/GreaterLessThan/        Greater than and less than
SchoolGames/PictureWords/           Picture game, catalog, and images
SchoolGames/BirbQuiz/               Quarter 1 vocabulary
assets/                            Shared home/game styles and icons
scripts/generate_picture_tags.py   Local Picture Words catalog generator
.nojekyll                          Static publishing without Jekyll
```

The old root game folders now contain small redirect pages, and
`BirbQuiz_Q1.html` also redirects to its new location. Retain these redirects
if you want existing game bookmarks to keep working.

## Publish or redeploy

Upload or commit this folder's contents to the repository used for the site,
keeping the root `index.html`, both main areas, shared assets, and `.nojekyll`.
Include each game's `game.js`, the Picture Words catalog and images, and the
Family Tree's `app.js`, `data.js`, `style.css`, and images.

The publishing source should be the repository branch containing these files
and **/(root)** in **Settings → Pages → Deploy from a branch**. The published
site opens the new general home page. Relative links work under a repository
path such as `https://USERNAME.github.io/GithubPages/` and at a domain root.

No Python server is required for visitors. See
[GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Preview locally

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. Stop the preview with Ctrl+C.

## Update content

- [School Games](SchoolGames/README.md): game structure and regenerating the
  Picture Words catalog after changing images.
- [Family Tree](FamilyTree/README.md): using the family explorer and refreshing
  its generated snapshot from the original vault.

The included `FamilyTree/build.py` is the vault's build script. It needs the
vault's source data; it is not a build step for this static deployment folder.
