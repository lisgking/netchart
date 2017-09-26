import Path from 'zrender/graphic/Path';

let ProductShape = Path.extend({
    type: 'Product Shape',
    zlevel: 2,
    shape: {
        cx: 600,
        cy: 600,
        r: 30
    },
    style: {
        fill: '#ff4b4b',
        text: '产品'
    },
    buildPath: function (ctx, shape, inBundle) {
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    },
    draggable: true
});

export { ProductShape };