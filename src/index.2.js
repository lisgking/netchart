import lodash from 'lodash';
import zrender from 'zrender';
import {
    CompanyShape, OrganizationShape, ArrowLine,
    FileShape, ProductShape, BusinessShape, TradeShape
} from './graphic/Shape';
import util from './util';
import { Spring, Node } from './Spring';
import jquery from 'jquery';
import Line from 'zrender/graphic/shape/Line';
import Circle from 'zrender/graphic/shape/Circle';


// 初始化zrender
var canvas = document.getElementById("main");
canvas.style.width = document.body.offsetWidth + "px";
canvas.style.height = document.body.offsetHeight + "px";
var zr = zrender.init(canvas);

var nodeMap = new Map();

var companyShape = new CompanyShape({
    style: {
        fill: '#3da1f9',
        text: '中国联合网络通\n信股份有限公司'
    }
});
var inodes = [], iedges = [];
var start_x, start_y, initSize = 40.0;
for (var i = 0; i < 10; i++) {
    start_x = 0 + 1024 * 0.5;
    start_y = 0 + 768 * 0.5;
    var node = new Node({
        x: start_x,
        y: start_y,
        id: i
    });
    inodes.push(node);

}
var sp = new Spring();
var nodes = sp.layout(inodes, iedges);
//4.反复2,3步 迭代300次
for (var i = 0; i < 100; i++) {
    nodes = sp.layout(nodes, iedges);
}
nodes.forEach(function (node) {
    var file = new FileShape({
        shape: {
            cx: node.x,
            cy: node.y
        },
        style: {
            text: node.id
        }
    });
    zr.add(file);
});



var trade = new TradeShape();

var arrowLine = new ArrowLine({
    shape: {
        xStart: 100,
        yStart: 100,
        xEnd: 500,
        yEnd: 500
    }
});
var p = new Promise((resolve, reject) => {
    var ajax = jquery.ajax({
        type: "POST",
        url: 'http://kg.graph.com/graph/graph/get-entitys',
        data: { notice_id: "4759092" },
        dataType: 'json'
    });
    ajax.done(function (msg) {
        resolve(msg);
    });
});


p.then(function (nodes) {
    jquery.ajax({
        type: "POST",
        url: 'http://kg.graph.com/graph/graph/get-relations',
        data: { notice_id: "4759092" },
        dataType: 'json'
    }).done(function (relations) {
        // drawNode(nodes);
        debugger;
        var entitys = getEntitys(nodes.result);
        // drawLine(relations);
        //计算出不同实体的中心点
    })
});

function countPosition(nodes,x,y){
    nodes.forEach(function(node){
        
    });

}

function getEntitys(rs){
    var entitys = [];
    var entityTypes = getEntityTypes(rs);
    entityTypes.forEach(function(type){
        entitys = entitys.concat(type.entitys);
    });
    return entitys;
}

function getEntityTypes(rs) {
    return Object.keys(rs).map(function (key) {
        return rs[key];
    });
}

function drawNode(msg) {
    console.log(msg);
    let rs = Object.keys(msg.result);
    let length = rs.length;
    let radius = 300;
    let center = util.getRectCenter(0, 0, document.body.offsetWidth, document.body.offsetHeight);
    Object.keys(msg.result).map(function (key, i) {
        var radian = util.getRadian(360 / length * i);
        let point = util.getArcPoint(center[0], center[1], radius, radian);
        var obj = msg.result[key];
        if (obj.entitys) {
            var size = obj.entitys.length;
            obj.entitys.map(function (entity, j) {
                var radian = util.getRadian(360 / size * j);
                var radius = 150;
                var point1 = util.getArcPoint(point.x, point.y, radius, radian);
                var shape = shapeType[entity.entity_type_id]({ cx: point1.x, cy: point1.y, entity: entity });
                zr.add(shape);
                nodeMap.set(entity.identity, shape);
            });
        }
    });
}

function drawLine(msg) {
    console.log(msg);
    Object.keys(msg.result).map(function (key) {
        var obj = msg.result[key];
        var from = obj.entity;
        var to = obj.entity_relation;
        if (from.length === 0) return;
        if (from.length === 1 && to.length === 1) {
            //
            var startNode = nodeMap.get(from[0].identity);
            var endNode = nodeMap.get(to[0].identity);
            var line = new Line({
                shape: {
                    x1: startNode.shape.cx,
                    y1: startNode.shape.cy,
                    x2: endNode.shape.cx,
                    y2: endNode.shape.cy
                }
            })
            zr.add(line);
        } else {
            //创建中间连接点
            var fromePoints = [];
            from.forEach(function (e) {
                var node = nodeMap.get(e.identity);
                fromePoints.push([node.shape.cx, node.shape.cy]);
            });
            fromePoints.sort(function (a, b) {
                return a[0] < b[0];
            });
            var leftMinX = fromePoints.length > 0 ? fromePoints[fromePoints.length - 1] : null;
            fromePoints.sort(function (a, b) {
                return a[1] > b[1];
            });
            var leftMaxY = fromePoints.length > 0 ? fromePoints[fromePoints.length - 1] : null;

            var toPoints = [];
            to.forEach(function (e) {
                var node = nodeMap.get(e.identity);
                toPoints.push([node.shape.cx, node.shape.cy]);
            });
            toPoints.sort(function (a, b) {
                return a[0] < b[0];
            });
            var rightMinX = toPoints.length > 0 ? toPoints[toPoints.length - 1] : null;
            toPoints.sort(function (a, b) {
                return a[1] > b[1];
            });
            var rightMaxY = toPoints.length > 0 ? toPoints[toPoints.length - 1] : null;

            var centerPoint = util.calCenterPoint(
                { x: leftMinX[0], y: leftMinX[1] },
                { x: leftMaxY[0], y: leftMaxY[1] },
                { x: rightMinX[0], y: rightMinX[1] },
                { x: rightMaxY[0], y: rightMaxY[1] }
            )
            var centerNode = new Circle({
                shape: {
                    cx: centerPoint[0],
                    cy: centerPoint[1]
                },
                style: {
                    text: to.relation_name
                }
            });
            zr.add(centerNode);
            from.forEach(function (node) {
                var shape = nodeMap.get(node.identity);
                var line = new Line({
                    shape: {
                        x1: shape.shape.cx,
                        y1: shape.shape.cy,
                        x2: centerPoint[0],
                        y2: centerPoint[1]
                    }
                })
                zr.add(line);
            });

            to.forEach(function (node) {
                debugger;
                var shape = nodeMap.get(node.identity);
                var line = new Line({
                    shape: {
                        x1: shape.shape.cx,
                        y1: shape.shape.cy,
                        x2: centerPoint[0],
                        y2: centerPoint[1]
                    }
                })
                zr.add(line);
            });
        }
    });
}

function getMaxValue(arr) {
    var xValues = [],
        yValues = [];
    arr.forEach(function (a) {
        xValues.push(a[0]);
        yValues.push(a[1]);
    });
    xValues.sort();
    yValues.sort();
    var maxX = xValues[xValues.length - 1];
    var maxY = yValues[yValues.length - 1];
    return [maxX, maxY];
}



function drawShape(nodes) {
    nodes.forEach(function (node) {
        var shape = shapeType[node.type_name](node)
        zr.add(shape);
        if (node.entitys) {
            drawShape(node.entitys);
        }
    });
}


var shapeType = {
    //机构
    "1": function (opts) {
        if (opts.entity) {
            var org = new OrganizationShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                },
                style: {
                    text: formatStr(opts.entity.entity_name),
                    allText: opts.entity.entity_name
                }
            });
            return org;
        } else {
            var org = new OrganizationShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                }
            });
            return org;
        }
    },
    //人物
    "2": function (opts) {
        if (opts.entity) {
            var org = new OrganizationShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                },
                style: {
                    text: formatStr(opts.entity.entity_name),
                    allText: opts.entity.entity_name
                }
            });
            return org;
        } else {
            var org = new OrganizationShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                }
            });
            return org;
        }
    },
    //产品
    "3": function (opts) {
        if (opts.entity) {
            var product = new ProductShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                },
                style: {
                    text: formatStr(opts.entity.entity_name),
                    allText: opts.entity.entity_name
                }
            });
            return product;
        } else {
            var product = new ProductShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                }
            });
            return product;
        }

    },
    //业务
    "4": function (opts) {
        if (opts.entity) {
            var biz = new BusinessShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                },
                style: {
                    text: formatStr(opts.entity.entity_name),
                    allText: opts.entity.entity_name
                }
            });
            return biz;
        } else {
            var biz = new BusinessShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                }
            });
            return biz;
        }
    },
    //文件
    "5": function (opts) {
        if (opts.entity) {
            var file = new FileShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                },
                style: {
                    text: formatStr(opts.entity.entity_name),
                    allText: opts.entity.entity_name
                }
            });
            return file;
        } else {
            var file = new FileShape({
                shape: {
                    cx: opts.cx,
                    cy: opts.cy,
                }
            });
            return file;
        }
    },
    //行业
    "6": function (opts) {

    }


}

function formatStr(text) {
    return lodash.truncate(text, {
        'length': 8,
        'separator': /,? +/
    });
}

// zr.add(companyShape);
// zr.add(org);
// zr.add(file);
// zr.add(product);
// zr.add(biz);
// zr.add(trade);
// zr.add(arrowLine);
// zr.add(line);