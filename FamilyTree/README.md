# Family-tree webpage

Open `index.html` in a web browser. The page works offline: its scripts, family data, and images are bundled in this directory. No installation or server is required.

The default view shows the paternal Hadley line. Use **Explore** for all parent–child relationships or the selected person’s connected family. Search covers all 113 profiles, including people with no recorded parent–child links. Select a person for dates, images, excerpts, and sources; select an arrow for relationship evidence. Drag to pan, use the zoom buttons or scroll to zoom, and choose **Fit tree** to restore the overview.

Arrows run from parent to child, with older generations above their children. Green means reported; amber means provisional; red marks conflict or excluded leads; purple marks adoption; cyan marks a separate family. Excluded pedigree leads are hidden until enabled. These labels retain the vault’s evidence status, and headstone dates retain priority. The earlier English paternal links remain provisional.

To refresh after updating the vault’s structured data, run from the vault root:

```sh
python3 Web/build.py
```

The refresh uses Python 3 and Graphviz’s `dot` command, reads `Data/People/`, `Data/relationships.json`, `Data/sources.json`, and `Data/graph-views.json`, and regenerates `data.js` and copied images in `assets/`. Viewing the finished page needs neither Python nor Graphviz. The page is a snapshot; edit the vault’s source data and rebuild to update it.

## Place in the main site

This directory is the Family Tree area of the GithubPages site. The navigation
bar links to the general home page and School Games. Its data and images remain
self-contained in this directory.

The build command above runs in the original family vault, which contains the
`Data/` sources and `Web/` folder. After rebuilding there, copy the refreshed
`data.js` and `assets/` into this directory. The copied `build.py` cannot rebuild
from this deployment folder alone because the vault sources are not included.
