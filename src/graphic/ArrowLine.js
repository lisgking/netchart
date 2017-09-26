import Path from 'zrender/graphic/Path';
import util from '../util';

let ArrowLine = Path.extend({
    type: 'Arrow Line',
    zlevel: 2,
    shape: {
        xStart: 0,
        yStart: 0,
        xEnd: 0,
        yEnd: 0,
        style: 1,    //箭头样式:1、2、3、4
        which: 1,    //箭头方向
        angle: 120,  //箭头角度
    },
    style: {
        fill: '#fff',
        text: '从属'
    },
    buildPath: function (ctx, shape, inBundle) {
        var xStart = shape.x1;
        var yStart = shape.y1;
        var xEnd = shape.x2;
        var yEnd = shape.y2;
        var style = shape.style;
        var which = shape.which;
        var angle = shape.angle;
        
        util.drawArrow(ctx, xStart, yStart, xEnd, yEnd, style, which, angle,10,"blue",1);
    }
});

export { ArrowLine };
