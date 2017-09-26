import ZRender from 'zrender';
import _ from 'lodash';
import util from './util';
import {ArrowLine} from './graphic/ArrowLine';
import Line from 'zrender/graphic/shape/Line';

function Edge(u, v, opts) {
    this.begin = u;
    this.end = v;
    this.opts = {
        name: ""
    }
    _.assignIn(this.opts, opts);
}

Edge.prototype.draw = function (ctx) {
    var u, v;
    u = this.begin;
    v = this.end;
    var radius = this.end.opts.radius||30;
    var endAngle = util.getAngle( v.posx, v.posy,u.posx, u.posy);
    var endPoint = util.calArcPoint([v.posx, v.posy], radius, endAngle);
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.moveTo(u.posx, u.posy);
        ctx.lineTo(v.posx, v.posy);//endPoint[0],endPoint[1]);
        ctx.closePath();
        ctx.stroke();
    } else {
        var line = new ArrowLine({
            zlevel: 2,
            shape: {
                x1: u.posx,
                y1: u.posy,
                x2: endPoint[0],//v.posx,
                y2: endPoint[1],
                style:4,
                angle:0.3
            },
            style: {
                lineDash: this.opts.lineDash ? this.opts.lineDash : "",
                stroke: 'rgb(100, 100, 100)',
                fill: 'rgb(100, 100, 100)',
                text: this.opts.relation_name
            }
        });
        ctx.add(line);
        return line;
    }

};

export { Edge };