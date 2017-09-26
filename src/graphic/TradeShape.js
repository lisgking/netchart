import Path from 'zrender/graphic/Path';

let TradeShape = Path.extend({
    type: 'Trade Shape',
    zlevel: 2,
    shape: {
        cx: 500,
        cy: 500,
        r: 30
    },
    style: {
        fill: '#54ff00',
        text: '行业'
    },
    buildPath: function (ctx, shape, inBundle) {
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    },
    draggable: true
});

export { TradeShape };