function astar(startId, goalId) {
    let data = JSON.parse(localStorage.getItem('data'));
    let queue = [{
        id: startId,
        cost: manhattan(data[startId].lat, data[startId].lon, data[goalId].lat, data[goalId].lon),
        path: 0,
        parent: null,
        lat: data[startId].lat,
        lon: data[startId].lon,
        heuristic: 0,
    }];
    let visited = new Set();
    let nodesArray = [];
    let iterations = 0;

    while (true) {
        ++iterations;
        let current = queue.shift();

        nodesArray.push({
            id: current.id,
            lat: current.lat,
            lon: current.lon,
            cost: current.cost,
            path: current.path,
            heuristic: manhattan(current.lat, current.lon, data[goalId].lat, data[goalId].lon)
        });

        if (current.id == goalId) {
            console.log('Node children: ', nodesArray);
            return current;
        } else {
            visited.add(current.id);
            let children = getChildrenAstar(current, goalId, data);
            let changedQueue = false;
            nodesArray.push(children)

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

function getChildrenAstar(parent, goalId, data) {
    let children = [];
    for (let c of data[parent.id].con) {
        let path = parent.path + distance(parent.lat, parent.lon, data[c].lat, data[c].lon);
        let heuristic = manhattan(data[c].lat, data[c].lon, data[goalId].lat, data[goalId].lon);
        let totalCost = path + heuristic;

        children.push({
            id: c,
            lat: data[c].lat,
            lon: data[c].lon,
            parent: parent,
            cost: totalCost,
            path: path,
            heuristic: heuristic,
        });
    }

    return children;
}
