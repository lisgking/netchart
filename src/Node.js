import _ from 'lodash';
import util from './util';
import {
    CompanyShape,
    OrganizationShape,
    FileShape,
    ProductShape,
    BusinessShape,
    TradeShape
} from './graphic/Shape';


function Node(id, posx, posy, opts) {
    this.identity = id;
    this.posx = posx;
    this.posy = posy;
    this.vx = 0;
    this.vy = 0;
    this.binded = false;
    this.opts = {
        color: '#3da1f9',
        radius:30
    };
    _.assignIn(this.opts, opts);
}

Node.prototype.draw = function (ctx) {
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posx, this.posy, 20, 0, Math.PI * 2, false);
        return ctx.fill();
    } else {
        var node = new CompanyShape({
            zlevel:3,
            shape: {
                cx: this.posx,
                cy: this.posy,
                r: this.opts.radius?this.opts.radius:30
            },
            style: {
                fill: this.opts.color,
                text: util.strInsert(this.opts.node_name),
            }
        })
        ctx.add(node);
        // node.on('mouseover', function () {
        //     console.log(this);
        //     ctx.addHover(this, {
        //         fill: 'yellow',
        //         lineWidth: 10,
        //         opacity: 1
        //     });
        //     // ctx.refresh();
        // });
        // node.on('mouseout', function () {
        //     console.log(this);
        //     ctx.clearHover(this);
        //     // ctx.trigger("refresh");
        // });
    }
};


Node.prototype.mouseon = function (e) {
    return Math.sqrt((this.posx - e.x) * (this.posx - e.x) + (this.posy - e.y) * (this.posy - e.y)) < this.opts.radius;
};

export { Node };