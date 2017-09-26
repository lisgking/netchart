import { Node } from "./Node";
import { Edge } from "./Edge";
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    C,
    K,
    MU,
    GRAB,
    STEP,
    NATLEN
} from "./config"

function Graph(node_stack) {
    this.node_stack = node_stack ? node_stack : {}
    this.nodes = {};
    this.adj = {};
    this.edges = [];
    this.id_node_dict = {};
}

function centralGrabx(x) {
    return -GRAB * (x - CANVAS_WIDTH / 2);
};

function centralGraby(y) {
    return -GRAB * (y - CANVAS_HEIGHT / 2);
};

function springPow(node, targetnode) {
    var Fx, Fy, x, y;
    x = node.posx - targetnode.posx;
    y = node.posy - targetnode.posy;
    Fx = -K * x;
    Fy = -K * y;
    return {
        x: Fx,
        y: Fy
    };
};

function elecPow(node, targetnode) {
    var Fx, Fy, r, sgnx, sgny, x, y;
    x = node.posx - targetnode.posx;
    y = node.posy - targetnode.posy;
    sgnx = (x > 0 ? 1 : -1);
    sgny = (y > 0 ? 1 : -1);
    r = x * x + y * y;
    Fx = C * sgnx * Math.abs(x) / (r * Math.sqrt(r) + 10);
    Fy = C * sgny * Math.abs(y) / (r * Math.sqrt(r) + 10);
    return {
        x: Fx,
        y: Fy
    };
};

Graph.prototype.addnode = function (node_id, color) {
    var newnode, x, y;
    x = Math.random() * CANVAS_WIDTH;
    y = Math.random() * CANVAS_HEIGHT;
    newnode = new Node(node_id, x, y, this.node_stack[node_id]);
    this.nodes[node_id] = newnode;
    this.adj[node_id] = new Array();
    return this.id_node_dict[node_id] = newnode;
};

Graph.prototype.addedge = function (u, v,opts) {
    if (!(u in this.id_node_dict)) {
        this.addnode(u);
    }
    if (!(v in this.id_node_dict)) {
        this.addnode(v);
    }
    this.adj[u].push(this.id_node_dict[v]);
    this.adj[v].push(this.id_node_dict[u]);
    return this.edges.push(new Edge(this.id_node_dict[u], this.id_node_dict[v], opts));
};

Graph.prototype.draw = function (ctx) {
    var edge, node, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = this.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        edge = _ref[_i];
        edge.draw(ctx);
    }
    _ref1 = this.nodes;
    _results = [];
    for (_j in _ref1) {
        node = _ref1[_j];
        _results.push(node.draw(ctx));
    }
    return _results;
};

Graph.prototype.move = function () {
    var elecPowVec, node, springPowVec, target, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    _ref = this.nodes;
    _results = [];
    for (_i in _ref) {
        node = _ref[_i];
        if (node.binded) {
            continue;
        }
        x = node.posx;
        y = node.posy;
        _ref1 = this.nodes;
        for (_j in _ref1) {
            target = _ref1[_j];
            if (node !== target) {
                elecPowVec = elecPow(node, target);
                node.vx += elecPowVec.x * STEP;
                node.vy += elecPowVec.y * STEP;
            }
        }
        node.vx += centralGrabx(x) * STEP;
        node.vy += centralGraby(y) * STEP;
        _ref2 = this.adj[node.identity];
        for (_k in _ref2) {
            target = _ref2[_k];
            springPowVec = springPow(node, target);
            node.vx += springPowVec.x;
            node.vy += springPowVec.y;
        }
        node.vx *= MU;
        node.vy *= MU;
        node.posx += node.vx * STEP;
        _results.push(node.posy += node.vy * STEP);
    }
    return _results;
};

export { Graph };

