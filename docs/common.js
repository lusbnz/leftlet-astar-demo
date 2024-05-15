function nearestNeighbour(lat, lon) {
    let data = JSON.parse(localStorage.getItem('data'));
    let id = "";
    let gd = 99999999;

    for (let key in data) {
        let d = distance(lat, lon, data[key].lat, data[key].lon);

        if (d < gd) {
            gd = d;
            id = key;
        }
    }

    return {
        id: id,
        data: data[id],
        lat: data[id].lat,
        lng: data[id].lon
    };
};

function constructPath(node, algo) {
    let path = [];
    let pathFull = [];
    let to_compare = 0;
    while (node) {
        path.push([node.lat, node.lon]);
        pathFull.push([node.id, node.lat, node.lon]);
        node = node.parent;
    }
    for (let i = 0; i < pathFull.length - 1; i++) {
        to_compare = to_compare + distance(pathFull[i][1], pathFull[i][2], pathFull[i + 1][1], pathFull[i + 1][2]);
    }
    console.log(`Distance ${algo}: `, to_compare);
    {
        algo === 'Astar' &&
            console.log('Path Astar: ', pathFull.reverse());
    }

    return path;
}

function distance(lat1, lon1, lat2, lon2) {
    let d1 = Math.abs(lat1 - lat2) * Math.abs(lat1 - lat2);
    let d2 = Math.abs(lon1 - lon2) * Math.abs(lon1 - lon2);
    return Math.sqrt(d1 + d2);
}

function manhattan(lat1, lon1, lat2, lon2) {
    let d1 = Math.abs(lat1 - lat2);
    let d2 = Math.abs(lon1 - lon2);
    return Math.abs(d1 + d2);
}