# A* Routing Demo

> [Demo](https://stefanhuber.github.io/osm-astar-demo/)

## Usage

 - Install dependencies `npm i`
 - Extract a small section from OSM (e.g., via [openstreetmap.org](https://www.openstreetmap.org/export#map=14/47.5855/12.2242)) and save it as `map.osm` in the project folder
 - Generate the routing graph representation with `npm run graph`
 - Change the bounding box according the `<bounds>` from the osm file inside the `index.html` (line 40-41)
 - `npm run serve` for local deployment
