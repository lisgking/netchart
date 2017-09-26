class Spring {
    layout (nodes, edges) {
        //2计算每次迭代局部区域内两两节点间的斥力所产生的单位位
        let area = 1024 * 768;
        let k = Math.sqrt(area / parseFloat(nodes.length));
        let diffx, diffy, diff;

        let dispx = new Map();
        let dispy = new Map();

        let ejectfactor = 6;

        nodes.forEach(function (node1, v) {
            dispx.set(node1.id, 0.0);
            dispy.set(node1.id, 0.0);
            nodes.forEach(function (node2, u) {
                if (u != v) {
                    diffx = node1.x - node2.x;
                    diffy = node1.x - node2.x;
                    diff = Math.sqrt(diffx * diffx + diffy * diffy);
                    if (diff < 30) {
                        ejectfactor = 5;
                    }
                    if (diff > 0 && diff < 250) {
                        let id = node1.id;
                        dispx.set(id, dispx.get(id) + diffx / diff * k * k / diff * ejectfactor);
                        dispy.set(id, dispy.get(id) + diffy / diff * k * k / diff * ejectfactor);
                    }
                }
            });
        });
        //3. 计算每次迭代每条边的引力对两端节点所产生的单位位移（一般为负值）
        let condensefactor = 3;
        let visnodeS = null, visnodeE = null;
        edges.forEach(function (edge, e) {
            let eStartId = edge.getStartId();
            let eEndId = edge.getEndId();
            visnodeS = getNodeById(nodes, eStartId);
            visnodeE = getNodeById(nodes, eEndId);

            diffx = visnodeS.x - visnodeE.x;
            diffy = visnodeS.y - visnodeE.y;
            diff = Math.sqrt(diffx * diffx + diffy * diffy);

            dispx.set(eStartId, dispx.get(eStartId) - diffx * diff / k * condensefactor);
            dispy.set(eStartId, dispy.get(eStartId) - diffy * diff / k * condensefactor);
            dispx.set(eEndId, dispx.get(eEndId) + dispx * diff / k * condensefactor);
            dispy.set(eEndId, dispy.get(eEndId) + diffy * diff / k * condensefactor);
        });
        //set x,y
        let maxt = 4, maxty = 3;
        nodes.forEach(function (node) {
            let dx = dispx.get(node.id);
            let dy = dispy.get(node.id);

            let disppx = Math.floor(dx);
            let disppy = Math.floor(dy);
            if (disppx < -maxt) {
                disppx = -maxt;
            }
            if (disppx > maxt) {
                disppx = maxt;
            }
            if (disppy < -maxty) {
                disppy = -maxty;
            }
            if (disppy > maxty) {
                disppy = maxty;
            }
            node.x = (node.x + disppx);
            node.y = (node.y + disppy);
        });
        return nodes;
    }
}

class Node {
    constructor(opts) {
        this.x = opts.x;
        this.y = opts.y;
        this.id = opts.id;
    }
}

class Edge {
    constructor(opts){
        this.startNode = opts.startNode;
        this.endNode = opts.endNode;
    }

    getStartId(){
        return this.startNode.id;
    }

    getEndId(){
        return this.endNode.id;
    }

}

export {Spring,Node,Edge};