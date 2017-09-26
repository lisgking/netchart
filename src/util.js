import _ from 'lodash';
var util = {};

/**
 * 画格栅栏
 * @param {*} path 
 * @param {*} width 
 * @param {*} height 
 * @param {*} strokeStyle 
 * @param {*} step 
 */
function drawGrid(path, width, height, strokeStyle, step) {
    for (var x = 0.5; x < width; x += step) {
        path.moveTo(x, 0);
        path.lineTo(x, height);
    }

    for (var y = 0.5; y < height; y += step) {
        path.moveTo(0, y);
        path.lineTo(width, y);
    }

    path.strokeStyle = strokeStyle;
    path.stroke();
}
/**
 * 
 * @param {*} path 
 * @param {*} x0 
 * @param {*} y0 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} style 
 * @param {*} color 
 * @param {*} width 
 */
function drawHead(path, x0, y0, x1, y1, x2, y2, style, color, width) {
    if (typeof (x0) == 'string') {
        x0 = parseInt(x0);
    }
    if (typeof (y0) == 'string') {
        y0 = parseInt(y0);
    }
    if (typeof (x1) == 'string') {
        x1 = parseInt(x1);
    }
    if (typeof (y1) == 'string') {
        y1 = parseInt(y1);
    }
    if (typeof (x2) == 'string') {
        x2 = parseInt(x2);
    }
    if (typeof (y2) == 'string') {
        y2 = parseInt(y2);
    }

    var radius = 3,
        twoPI = 2 * Math.PI;

    path.moveTo(x0, y0);
    path.lineTo(x1, y1);
    path.lineTo(x2, y2);

    switch (style) {
        case 0:
            var backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
            path.arcTo(x1, y1, x0, y0, .55 * backdist);
            break;
        case 1:
            path.moveTo(x0, y0);
            path.lineTo(x1, y1);
            path.lineTo(x2, y2);
            path.lineTo(x0, y0);
            break;
        case 2:
            path.stroke();
            break;
        case 3:
            var cpx = (x0 + x1 + x2) / 3;
            var cpy = (y0 + y1 + y2) / 3;
            path.quadraticCurveTo(cpx, cpy, x0, y0);
            break;
        case 4:
            var cp1x, cp1y, cp2x, cp2y, backdist;
            var shiftamt = 5;
            if (x2 == x0) {
                backdist = y2 - y0;
                cp1x = (x1 + x0) / 2;
                cp2x = (x1 + x0) / 2;
                cp1y = y1 + backdist / shiftamt;
                cp2y = y1 - backdist / shiftamt;
            } else {
                backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                var xback = (x0 + x2) / 2;
                var yback = (y0 + y2) / 2;
                var xmid = (xback + x1) / 2;
                var ymid = (yback + y1) / 2;
                var m = (y2 - y0) / (x2 - x0);
                var dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt;
                var dy = m * dx;
                cp1x = xmid - dx;
                cp1y = ymid - dy;
                cp2x = xmid + dx;
                cp2y = ymid + dy;
            }
            path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
            break;
    }
}
/**
 * 画带箭头的线
 * @param {Canvas} path canvas content上下文
 * @param {*} x1 线开始x坐标
 * @param {*} y1 线开始y坐标
 * @param {*} x2 线结束x坐标
 * @param {*} y2 线结束y坐标
 * @param {*} style 箭头样式:1、2、3、4
 * @param {*} which 1右箭头 2左箭头 3双向箭头
 * @param {*} angle 箭头角度
 * @param {*} d 
 * @param {*} color 箭头颜色
 * @param {*} width 
 */
function drawArrow(path, x1, y1, x2, y2, style, which, angle, d, color, width) {
    if (typeof (x1) == 'string') {
        x1 = parseInt(x1);
    }
    if (typeof (y1) == 'string') {
        y1 = parseInt(y1);
    }
    if (typeof (x2) == 'string') {
        x2 = parseInt(x2);
    }
    if (typeof (y2) == 'string') {
        y2 = parseInt(y2);
    }
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1;
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 9;
    d = typeof (d) != 'undefined' ? d : 10;
    color = typeof (color) != 'undefined' ? color : '#000';
    width = typeof (width) != 'undefined' ? width : 1;
    var toDrawHead = typeof (style) != 'function' ? drawHead : style;
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;
    if (which & 1) {
        tox = Math.round(x1 + (x2 - x1) * ratio);
        toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
        tox = x2;
        toy = y2;
    }

    if (which & 2) {
        fromx = x1 + (x2 - x1) * (1 - ratio);
        fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
        fromx = x1;
        fromy = y1;
    }

    path.moveTo(fromx, fromy);
    path.lineTo(tox, toy);

    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    var h = Math.abs(d / Math.cos(angle));
    if (which & 1) {
        var angle1 = lineangle + Math.PI + angle;
        var topx = x2 + Math.cos(angle1) * h;
        var topy = y2 + Math.sin(angle1) * h;
        var angle2 = lineangle + Math.PI - angle;
        var botx = x2 + Math.cos(angle2) * h;
        var boty = y2 + Math.sin(angle2) * h;
        toDrawHead(path, topx, topy, x2, y2, botx, boty, style, color, width);
    }

    if (which & 2) {
        var angle1 = lineangle + angle;
        var topx = x1 + Math.cos(angle1) * h;
        var topy = y1 + Math.sin(angle1) * h;
        var angle2 = lineangle - angle;
        var botx = x1 + Math.cos(angle2) * h;
        var boty = y1 + Math.sin(angle2) * h;
        toDrawHead(path, topx, topy, x1, y1, botx, boty, style, color, width);
    }
    path.closePath();
}

/**
 * 画带箭头的曲线
 * @param {*} path 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 * @param {*} startangle 
 * @param {*} endangle 
 * @param {*} anticlockwise 
 * @param {*} style 
 * @param {*} which 
 * @param {*} angle 
 * @param {*} d 
 * @param {*} color 
 * @param {*} width 
 */
function drawArcedArrow(path, x, y, r, startangle, endangle, anticlockwise, style, which, angle, d, color, width) {
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1;
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
    d = typeof (d) != 'undefined' ? d : 10;
    color = typeof (color) != 'undefined' ? color : '#000';
    width = typeof (width) != 'undefined' ? width : 1;

    path.lineWidth = width;
    path.strokeStyle = color;
    path.arc(x, y, r, startangle, endangle, anticlockwise);
    path.stroke();
    var sx, sy, lineangle, destx, desty;
    path.strokeStyle = 'rgba(0,0,0,0)';
    if (which & 1) {
        sx = Math.cos(startangle) * r + x;
        sy = Math.sin(startangle) * r + y;
        lineangle = Math.atan2(x - sx, sy - y);
        if (anticlockwise) {
            destx = sx + 10 * Math.cos(lineangle);
            desty = sy + 10 * Math.sin(lineangle);
        } else {
            destx = sx - 10 * Math.cos(lineangle);
            desty = sy - 10 * Math.sin(lineangle);
        }
        drawArrow(path, sx, sy, destx, desty, style, 2, angle, d, color, width);
    }

    if (which & 2) {
        sx = Math.cos(endangle) * r + x;
        sy = Math.sin(endangle) * r + y;
        lineangle = Math.atan2(x - sx, sy - y);
        if (anticlockwise) {
            destx = sx - 10 * Math.cos(lineangle);
            desty = sy - 10 * Math.sin(lineangle);
        } else {
            destx = sx + 10 * Math.cos(lineangle);
            desty = sy + 10 * Math.sin(lineangle);
        }
        drawArrow(path, sx, sy, destx, desty, style, 2, angle, d, color, width);
    }
}

/**
 * 获得矩形的中心坐标
 * @param {*} x 左上角X坐标
 * @param {*} y 左上角y坐标
 * @param {*} width 矩形宽度
 * @param {*} height 矩形高度
 */
function getRectCenter(x, y, width, height) {
    var point = [(x + width / 2), (y + height / 2)];
    return point;
}

/**
 * 得到圆形环上坐标
 * @param {*} x 
 * @param {*} y 
 * @param {*} radius 
 * @param {*} size 
 * @param {*} index 
 */
function getArcPoint(x, y, radius, radian) {
    return {
        x: parseInt(x + Math.sin(radian) * radius),
        y: parseInt(y - Math.cos(radian) * radius)
    }
}

/**
 * 不规则四边形中心坐标
 * @param {*} Point1 
 * @param {*} Point2 
 * @param {*} Point3 
 * @param {*} Point4 
 */
function calCenterPoint(Point1, Point2, Point3, Point4) {
    var d = (Point4.x - Point1.x) * (Point2.y - Point3.y) - (Point3.x - Point2.x) * (Point1.y - Point4.y)
    var d1 = (Point2.y * Point3.x - Point2.x * Point3.y)
        * (Point4.x - Point1.x) - (Point1.y * Point4.x - Point1.x * Point4.y)
        * (Point3.x - Point2.x);
    var d2 = (Point1.y * Point4.x - Point1.x * Point4.y)
        * (Point2.y - Point3.y)
        - (Point2.y * Point3.x - Point2.x * Point3.y)
        * (Point1.y - Point4.y)
    var x = d1 / d;
    var y = d2 / d;
    return [x, y];
}

/**
 * 角度转弧度
 * @param {*} degrees 角度
 */
function getRadian(degrees) {
    return (Math.PI / 180) * degrees;
}

/**
 * 计算两个点的中间坐标
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function calMiddlePoint(x1, y1, x2, y2) {
    var x3 = (x1 + x2) / 2;
    var y3 = (y1 + y2) / 2;
    return [x3, y3];
}

/**
 * 计算两个点之间的距离
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function calDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var distance = Math.sqrt(dx * dx + dy + dy)
    return distance;
}

/**
 * 在nodes数组中找到与id相同的值。
 * @param {*} nodes 
 * @param {*} id 
 */
function getNodeById(nodes, id) {
    return nodes.filter(function (node) {
        return node.getId() === id;
    });
}

function calAngle(start, end) {
    var diff_x = end.x - start.x,
        diff_y = end.y - start.y;
    //返回角度,不是弧度
    return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
}

function calArcPoint(point, radius, angle) {

    var x = point[0] + Math.sin(this.getRadian(angle)) * radius;//point[0] + radius * Math.cos(angle * Math.PI / 180);
    var y = point[1] - Math.cos(this.getRadian(angle)) * radius;//radius * Math.sin(angle * Math.PI / 180);
    return [x, y];
}

function getAngle(px, py, mx, my) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
    var x = Math.abs(px - mx);
    var y = Math.abs(py - my);
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var cos = y / z;
    var radina = Math.acos(cos);//用反三角函数求弧度
    var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

    if (mx > px && my > py) {//鼠标在第四象限
        angle = 180 - angle;
    }

    if (mx == px && my > py) {//鼠标在y轴负方向上
        angle = 180;
    }

    if (mx > px && my == py) {//鼠标在x轴正方向上
        angle = 90;
    }

    if (mx < px && my > py) {//鼠标在第三象限
        angle = 180 + angle;
    }

    if (mx < px && my == py) {//鼠标在x轴负方向
        angle = 270;
    }

    if (mx < px && my < py) {//鼠标在第二象限
        angle = 360 - angle;
    }
    return angle;
}

function formatNodeData(nodes){
    return nodes.map(function(node){


    });

}



function addVirtualNode(nodes,v_nodes){
    //维护虚拟节点关系
    v_nodes.forEach(function(v_node){
        nodes.push(v_node);
    });
}

var node_types={
    //
    0:{
        radius:50,
    }
}

/**
 * 从节点集合里取得虚拟类型的节点集合
 * @param {*} nodes 
 * @param {*} virtual_type 
 */
function getVirtualTypeList(nodes,virtual_type){
    return Object.keys(nodes).filter(function(key){
        var node = nodes[key];
        return node.entity_type_id == virtual_type;
    });
}

function formatEdgeData(edges,v_nodes,nodes,key){
    var cache = [];
    v_nodes.forEach(function(identity){
        //取得to和type相同的edge，并从edges中删除
        var toEdges = _.remove(edges,function(edge){
            return identity == edge.to ;//&& nodes[edge.from].entity_type_id === "1";
        });
        //将from和to分为两个数组
        var from_to = getToAndFrom(toEdges)
        //得到虚拟节点
        var virtualNode = nodes[key];
        //from节点去重复
        var froms = _.uniq(from_to.froms);
        var tos = _.uniq(from_to.tos);
        //set froms
        cache = cache.concat(setFroms(froms,virtualNode.identity));
        cache = cache.concat(setTos(virtualNode.identity,tos));
    });
    return cache;
}

function setTos(from,tos){
    return tos.map(function(to){
        return {
            from:from,
            to:to
        }
    });
}

function setFroms(froms,to){
    return froms.map(function(from){
        return {
            from:from,
            to:to
        }
    });
}

function getToAndFrom(edges){
    var obj = {
        froms:[],
        tos:[]
    };
    edges.forEach(function(edge){
        obj.froms.push(edge.from);
        obj.tos.push(edge.to);
    });
    return obj;
}

function strInsert(str){
    return str.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{10}\x01?/g,"$&\n").replace(/\x01/g,"");
}

export default util = {
    drawGrid: drawGrid,
    drawHead: drawHead,
    drawArrow: drawArrow,
    getRectCenter: getRectCenter,
    getArcPoint: getArcPoint,
    getRadian: getRadian,
    calMiddlePoint: calMiddlePoint,
    calDistance: calDistance,
    calCenterPoint: calCenterPoint,
    getNodeById: getNodeById,
    getAngle: getAngle,
    calArcPoint: calArcPoint,
    getVirtualTypeList:getVirtualTypeList,
    formatEdgeData:formatEdgeData,
    strInsert:strInsert
}