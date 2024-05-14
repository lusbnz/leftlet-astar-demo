function astar(startId, goalId) {
    let data = JSON.parse(localStorage.getItem('data'));
    let queue = [{
        id: startId,
        cost: manhattan(data[startId].lat, data[startId].lon, data[goalId].lat, data[goalId].lon),
        path: 0,
        parent: null,
        lat: data[startId].lat,
        lon: data[startId].lon,
    }];
    let visited = new Set();
    let logArray = [];
    let iterations = 0;

    while (true) {
        ++iterations;
        let current = queue.shift();

        logArray.push({
            id: current.id,
            lat: current.lat,
            lon: current.lon,
            f: current.cost,
            g: current.path,
            h: manhattan(current.lat, current.lon, data[goalId].lat, data[goalId].lon)
        });

        if (current.id == goalId) {
            console.log("Total Cost Astar:", current.cost);
            console.log(logArray);
            return current;
        } else {
            visited.add(current.id);
            let children = getChildrenAstar(current, goalId, data, logArray);

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
                console.log(logArray);
                return null;
            }
        }
    }
}

function getChildrenAstar(parent, goalId, data, logArray) {
    let children = [];
    for (let c of data[parent.id].con) {
        let path = parent.path + distance(parent.lat, parent.lon, data[c].lat, data[c].lon);
        let heuristic = manhattan(data[c].lat, data[c].lon, data[goalId].lat, data[goalId].lon);
        let totalCost = path + heuristic;

        logArray.push({
            id: c,
            parent: parent.id,
            lat: data[c].lat,
            lon: data[c].lon,
            f: totalCost,
            g: path,
            h: heuristic
        });

        children.push({
            id: c,
            lat: data[c].lat,
            lon: data[c].lon,
            parent: parent,
            cost: totalCost,
            path: path,
        });
    }

    return children;
}
