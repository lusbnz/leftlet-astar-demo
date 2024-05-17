let ab = true;
let aid = -1;
let bid = -1;
let currentMap = 'OpenStreetMap';
const mymap = L.map('mapid').setView([21.00269, 105.85159], 16);
const lineB = L.polyline([], { color: 'blue', weight: 3 }).addTo(mymap);
const lineG = L.polyline([], { color: 'green', weight: 3 }).addTo(mymap);
const lineA = L.polyline([], { color: 'red', weight: 3 }).addTo(mymap);
const a = L.marker([0, 0], { draggable: true }).addTo(mymap);
const b = L.marker([1, 1], { draggable: true }).addTo(mymap);
let currentPathA = [];
let currentIndexA = 0;
let currentPathB = [];
let currentIndexB = 0;
let currentPathG = [];
let currentIndexG = 0;

function renderPathPartially() {
    const offset = 0.00000;
    if (currentIndexA < currentPathA.length) {
        lineA.addLatLng(currentPathA[currentIndexA]);
        currentIndexA++;
        setTimeout(renderPathPartially, 200);
    }
    if (currentIndexB < currentPathB.length) {
        const latlngB = currentPathB[currentIndexB];
        const latlngBOffset = L.latLng(latlngB[0] + offset, latlngB[1] + offset);
        lineB.addLatLng(latlngBOffset);
        currentIndexB++;
        setTimeout(renderPathPartially, 200);
    }
    if (currentIndexG < currentPathG.length) {
        const latlngG = currentPathG[currentIndexG];
        const latlngGOffset = L.latLng(latlngG[0] - offset, latlngG[1] - offset);
        lineG.addLatLng(latlngGOffset);
        currentIndexG++;
        setTimeout(renderPathPartially, 200);
    }
}

function renderPathIncrementally(pathA, pathB, pathG) {
    currentPathA = pathA;
    currentIndexA = 0;
    currentPathB = pathB;
    currentIndexB = 0;
    currentPathG = pathG;
    currentIndexG = 0;
    renderPathPartially();
}

mymap.on('click', (e) => {
    let nn = nearestNeighbour(e.latlng["lat"], e.latlng["lng"]);

    if (ab) {
        a.setLatLng(nn);
        aid = nn.id;
        ab = false;
    } else {
        b.setLatLng(nn);
        bid = nn.id;
        ab = true;
    }

    if (aid > 0 && bid > 0) {
        // a.setLatLng([0, 0]);
        // b.setLatLng([1, 1]);
        lineA.setLatLngs([]);
        lineB.setLatLngs([]);
        lineG.setLatLngs([]);
        let pathA = constructPath(astar(aid, bid), 'Astar');
        let pathB = constructPath(bfs(aid, bid), 'BFS');
        let pathG = constructPath(greedy(aid, bid), 'Greedy');
        renderPathIncrementally(pathA, pathB, pathG);

        aid = -1;
        bid = -1;
        ab = true;
    }
});

a.on('dragend', (e) => {
    aid = null;
    let nn = nearestNeighbour(e.target.getLatLng().lat, e.target.getLatLng().lng);
    aid = nn.id;
    let pathA = constructPath(astar(aid, bid), 'Astar');
    let pathB = constructPath(bfs(aid, bid), 'BFS');
    let pathG = constructPath(greedy(aid, bid), 'Greedy');
    lineA.setLatLngs(pathA);
    lineB.setLatLngs(pathB);
    lineG.setLatLngs(pathG);
});

b.on('dragend', (e) => {
    bid = null;
    let nn = nearestNeighbour(e.target.getLatLng().lat, e.target.getLatLng().lng);
    bid = nn.id;
    let pathA = constructPath(astar(aid, bid), 'Astar');
    let pathB = constructPath(bfs(aid, bid), 'BFS');
    let pathG = constructPath(greedy(aid, bid), 'Greedy');
    lineA.setLatLngs(pathA);
    lineB.setLatLngs(pathB);
    lineG.setLatLngs(pathG);
});

const baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
    }),
    "Google Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }),
};

var scale = L.control.scale();
scale.addTo(mymap);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
}).addTo(mymap);

const overlayMaps = {};

fetch("map.json")
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("data", JSON.stringify(data.nodes));
        let l = 0;
        for (let k in data.nodes) l++;
        let circles = [];
        for (let key in data.nodes) {
            if (data.nodes.hasOwnProperty(key)) circles.push(L.circle([data.nodes[key].lat, data.nodes[key].lon], { radius: 1 }));
        }
        let circlesLayer = L.layerGroup(circles);
        overlayMaps[`${l} Nodes`] = circlesLayer;
        L.control.layers(baseMaps, overlayMaps).addTo(mymap);
    });


(() => {
    let data = JSON.parse(localStorage.getItem('data'));
    let circles = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) circles.push(L.circle([data[key].lat, data[key].lon], { radius: 1 }));
    }
    let circlesLayer = L.layerGroup(circles);
})();