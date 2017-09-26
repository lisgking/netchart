import Path from 'zrender/graphic/Path';

let OrganizationShape = Path.extend({
    type: 'Organization Shape',
    zlevel: 2,
    shape: {
        cx: 600,
        cy: 600,
        r: 30
    },
    style: {
        fill: '#3da1f9',
        text: '机构'
    },
    buildPath: function (ctx, shape, inBundle) {
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    },
    draggable: true
});

export { OrganizationShape };