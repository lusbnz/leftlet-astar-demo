function bfs(startId, goalId) {
    let data = JSON.parse(localStorage.getItem('data'));
    let queue = [{
        id: startId,
        path: 0,
        parent: null,
        lat: data[startId].lat,
        lon: data[startId].lon
    }];
    let visited = new Set();

    while (true) {
        let current = queue.shift();

        if (current.id == goalId) {
            return current;
        } else {
            visited.add(current.id);
            let children = getChildrenBfs(current, data);

            for (let child of children) {
                if (!visited.has(child.id)) {
                    queue.push(child);
                }
            }
        }
    }
}

function getChildrenBfs(parent, data) {
    let children = [];
    for (let c of data[parent.id].con) {
        children.push({
            id: c,
            lat: data[c].lat,
            lon: data[c].lon,
            parent: parent
        });
    }
    return children;
}
