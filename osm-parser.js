let nodes = {};

function parseNodes(osm) {
    nodes = {};

    if (osm.node) {
        for (let n of osm.node) {
            let attr = n["$"];
            nodes[attr["id"]] = {
                lat: parseFloat(attr["lat"]),
                lon: parseFloat(attr["lon"]),
                con: new Set()
            };
        }
    }

    return nodes;
};

function getAvgLatLon(nds) {
    let lat = 0;
    let lon = 0;

    for (let node of nds) {
        lat += (nodes[node["$"]["ref"]]["lat"]);
        lon += (nodes[node["$"]["ref"]]["lon"]);
    }

    return {
        lat: (lat / nds.length),
        lon: (lon / nds.length)
    };
}

function parseAddresses(osm) {
    let addresses = [];

    if (osm.way) {
        for (let way of osm.way) {
            let address = {};
            
            if (way.tag) {
                for (let attr of way.tag) {       
                    attr = attr["$"];             
                    if (attr["k"] == "building" && attr["v"] == "yes") {
                        address["building"] = true;
                    } else if (attr["k"] == "addr:housenumber" ||
                               attr["k"] == "addr:street") {
                        address[attr["k"]] = attr["v"];
                    }
                }
            }
            
            if (way.nd) {
                ll = getAvgLatLon(way.nd);
                address["lat"] = ll.lat;
                address["lon"] = ll.lon;
            }

            if (address.building && address["addr:street"] && address["addr:housenumber"]) {
                delete address["building"];
                addresses.push(address);
            }
        }
    }
    
    return addresses;
}

function createGraph(osm) {
    if (osm.way) {
        for (let way of osm.way) {
            if (way.tag) {
                let highway = false;
                let junction = false;

                for (let attr of way.tag) {       
                    attr = attr["$"];
                    if (attr["k"] == "highway") {
                        highway = true;
                    } else if (attr["k"] == "junction") {
                        junction = true;
                    }                    
                }

                if (junction) {
                    for (let j = 0; j < way.nd.length; j++) {
                        let curr = way.nd[j]["$"]["ref"];
                        for (let i = 0; i < way.nd.length; i++) {       
                            let next = way.nd[i]["$"]["ref"];
                            if (curr != next) {
                                nodes[next].con.add(curr);
                                nodes[curr].con.add(next);
                            }                            
                        }
                    }
                } else if (highway) {
                    for (let i = 1; i < way.nd.length; i++) {       
                        let prev = way.nd[i-1]["$"]["ref"];
                        let curr = way.nd[i]["$"]["ref"];
                        nodes[prev].con.add(curr);
                        nodes[curr].con.add(prev);
                    }
                }                
            }
        }
    }
};

function getNodes() {
    let out = {};

    for (let key in nodes) {
        if (nodes[key] && nodes[key].con && nodes[key].con.size > 0) {
            let node = nodes[key];
            node.con = Array.from(node.con);
            out[key] = node;
        }
    }

    return out;
};

module.exports = {
    parseNodes: parseNodes,
    parseAddresses: parseAddresses,
    createGraph: createGraph,
    getNodes: getNodes
};