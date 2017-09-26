import Path from 'zrender/graphic/Path';

let CompanyShape = Path.extend({
    type: 'Company Shape',
    zlevel: 1,
    shape: {
        cx: 800,
        cy: 397,
        r: 30
    },
    style: {
        fill: '#3da1f9',
        text: '中国联合网络通\n信股份有限公司'
    },
    buildPath: function (ctx, shape, inBundle) {
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    },
    draggable: false
});

export { CompanyShape };