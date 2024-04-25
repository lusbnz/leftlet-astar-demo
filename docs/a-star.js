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

function astar(startId, goalId) {
    let data = JSON.parse(localStorage.getItem('data'));
    let queue = [{
        id: startId,
        cost: distance(data[startId].lat, data[startId].lon, data[goalId].lat, data[goalId].lon),
        path: 0,
        parent: null,
        lat: data[startId].lat,
        lon: data[startId].lon
    }];
    let visited = new Set();

    let iterations = 0;

    let nodes = Object.keys(data).length;

    while (true) {
        if (++iterations > nodes) {
            console.info('No path between the two selected nodes');
            return null;
        }

        let current = queue.shift();

        if (current.id == goalId) {
            return current;
        } else {
            visited.add(current.id);
            let children = getChildren(current, goalId, data);

            let changedQueue = false;

            for (let child of children) {
                if (!visited.has(child.id)) {
                    queue.push(child);
                    changedQueue = true;
                }
            }

            if (queue.length > 0) {
                if (!changedQueue && iterations > 50) continue;

                queue.sort((a, b) => {
                    if (a.cost < b.cost) {
                        return -1;
                    } else if (a.cost > b.cost) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return null;
            }
        }
    }
}

function constructPath(node) {
    let path = [];

    while (node) {
        path.push([node.lat, node.lon]);
        node = node.parent;
    }

    return path;
}

function getChildren(parent, goalId, data) {
    let children = [];
    for (let c of data[parent.id].con) {
        let path = parent.path + distance(parent.lat, parent.lon, data[c].lat, data[c].lon);

        children.push({
            id: c,
            lat: data[c].lat,
            lon: data[c].lon,
            parent: parent,
            cost: path + distance(data[c].lat, data[c].lon, data[goalId].lat, data[goalId].lon),
            path: path
        });
    }
    return children;
}

function distance(lat1, lon1, lat2, lon2) {
    let d1 = Math.abs(lat1 - lat2) * Math.abs(lat1 - lat2);
    let d2 = Math.abs(lon1 - lon2) * Math.abs(lon1 - lon2);
    return Math.sqrt(d1 + d2);
}