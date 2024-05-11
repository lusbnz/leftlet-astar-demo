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

function constructPath(node) {
    let path = [];

    while (node) {
        path.push([node.lat, node.lon]);
        node = node.parent;
    }

    return path;
}

function distance(lat1, lon1, lat2, lon2) {
    let d1 = Math.abs(lat1 - lat2) * Math.abs(lat1 - lat2);
    let d2 = Math.abs(lon1 - lon2) * Math.abs(lon1 - lon2);
    return Math.sqrt(d1 + d2);
}
