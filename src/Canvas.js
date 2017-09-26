import zrender from 'zrender';
import { Graph } from "./Graph";
import $ from 'jquery';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from "./config"

function Canvas() {
    var _this = this;
    this.onCanvasMouseup = function (e) {
        return Canvas.prototype.onCanvasMouseup.apply(_this, arguments);
    };
    this.onCanvasMousemove = function (e) {
        return Canvas.prototype.onCanvasMousemove.apply(_this, arguments);
    };
    this.onCanvasMousedown = function (e) {
        return Canvas.prototype.onCanvasMousedown.apply(_this, arguments);
    };
    this.onDbClick = function (e) {
        return Canvas.prototype.onDbClick.apply(_this, arguments);
    };
    this.draw = function () {
        return Canvas.prototype.draw.apply(_this, arguments);
    };

    this.timer = {};
    this.graph = new Graph();
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGHT;
    this.binded = undefined;
}

Canvas.prototype.draw = function () {
    this.interval_id;
    var ctx,
        maincanvas = document.getElementById("maincanvas");
    maincanvas.width = this.width;
    maincanvas.height = this.height;
    // ctx = maincanvas.getContext("2d");
    var ctx = zrender.init(maincanvas);
    // ctx.clearRect(0, 0, this.width, this.height);
    this.graph.move();
    return this.graph.draw(ctx);
};


Canvas.prototype.resize = function () {
    var height, width;
    width = $(window).width();
    height = $(window).height() - 200;
    $('#maincanvas').attr({
        width: width,
        height: height
    });
    this.width = width;
    return this.height = height;
};

Canvas.prototype.getPosition = function (e) {
    var x, y;
    x = e.pageX - $('#maincanvas').position().left;
    y = e.pageY - $('#maincanvas').position().top;
    return {
        x: x,
        y: y
    };
};

Canvas.prototype.onCanvasMousedown = function (e) {
    var graph, node, pos, _i, _len, _ref, _results;
    pos = this.getPosition(e);
    graph = this.graph;
    _ref = graph.nodes;
    _results = [];
    for (_i in _ref) {
        node = _ref[_i];
        if (node.mouseon(pos)) {
            this.binded = node;
            node.binded = true;
            break;
        } else {
            _results.push(void 0);
        }
    }
    return _results;
};

Canvas.prototype.onCanvasMousemove = function (e) {
    var pos;
    if (this.binded) {
        pos = this.getPosition(e);
        this.binded.posx = pos.x;
        this.binded.posy = pos.y;
        this.binded.vx = 0;
        return this.binded.vy = 0;
    }
};

Canvas.prototype.onCanvasMouseup = function (e) {
    console.log("MOUSE UP");
    if (this.binded) {
        this.binded.binded = true;
    }
    return this.binded = undefined;
};

Canvas.prototype.onDbClick = function (e) {
    console.log("onDbClick");
    var nodes = this.graph.nodes;
    Object.keys(nodes).forEach(function (key) {
        var node = nodes[key];
        node.binded = false;
    });
    return this.binded = undefined;
};



Canvas.prototype.init = function (nodes, edges) {
    var self = this;
    clearInterval(this.timer);
    var graph = new Graph(nodes);
    edges.forEach(function (edge) {
        graph.addedge(edge.from, edge.to, edge);
    });
    this.graph = graph;
    // this.ctx.on("refresh",function(){
    //     console.log(self);
    //     self.draw();
    // })
    return this.timer = setInterval(this.draw, 20);

}

export { Canvas };