
import { Canvas } from './Canvas';
import $ from 'jquery';
import util from './util';


var canvas = new Canvas();
$("#maincanvas").mousemove(canvas.onCanvasMousemove).mousedown(canvas.onCanvasMousedown).dblclick(canvas.onDbClick).mouseup(canvas.onCanvasMouseup);
// var id = canvas.changeGraph("twostar");

var p = new Promise((resolve, reject) => {
    var ajax = $.ajax({
        type: "POST",
        // url: 'data/entitys.json',
        url: 'http://kg.graph.com/graph/graph/get-nodes',
        data: { notice_id: "4759092" },
        dataType: 'json'
    });
    ajax.done(function (msg) {
        resolve(msg.result);
    });
});

p.then(function(nodes){
    var ajax = $.ajax({
        type: "POST",
        // url: 'data/relation.json',
        url: 'http://kg.graph.com/graph/graph/get-relations',
        data: { notice_id: "4759092" },
        dataType: 'json'
    });
    ajax.done(function (msg) {
        var edges = msg.result;
        // var times = canvas.init(nodes,edges);
        setRelation(nodes,edges);
    });
})


function setRelation(nodes,edges){
    var ajax = $.ajax({
        type: "POST",
        // url: 'data/relation.json',
        url: 'http://kg.graph.com/graph/graph/get-entity-types',
        dataType: 'json'
    });
    ajax.done(function(msg){
        var node_typs = msg.result;
        var new_edge = [];
        Object.keys(node_typs).forEach(function(key){
            var obj = node_typs[key];
            if(obj.is_hide==="1")return;
            //加入虚拟节点
            nodes[key] = _.assignIn(v_node_types[obj.id],obj);

            var v_nodes = util.getVirtualTypeList(nodes,obj.id);
            console.log(edges);
            
            v_nodes.forEach(function(n){
                new_edge = new_edge.concat(util.formatEdgeData(edges,v_nodes,nodes,key));
            });
        });
        new_edge = new_edge.concat(edges);
        console.log(new_edge);
        Object.keys(nodes).map(function(key){
            var node = nodes[key];
            nodes[key] =  _.assignIn(node_types[node.entity_type_id],node);
        });
        var times = canvas.init(nodes,new_edge);
    });
}

//虚拟节点结构
var v_node_types = {
    1:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"公司",
        "virtual_type":2,
        "color":"#3da1f9",
        "radius":50,
    },
    2:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"人物",
        "virtual_type":2,
        "color":"#ebcc40",
        "radius":38,
    },
    3:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"产品",
        "virtual_type":2,
        "radius":38,
        "color":"#ff0600",
    },
    4:{
        'identity':"",
        "node_type":"virtual",
        "node_name":"业务",
        "virtual_type":2,
        "color":"#ff9e00",
        "radius":38,
    },
    5:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"文件",
        "virtual_type":2,
        "color":"#63c715",
        "radius":38,
    },
    6:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"行业",
        "virtual_type":2,
        "color":"#63c715",
        "radius":38,
    }
};

var node_types = {
    1:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"公司",
        "virtual_type":2,
        "color":"#3da1f9",
        "radius":50,
    },
    2:{
        "identity":"",
        "color":"#ebcc40",
        "radius":30,
    },
    3:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"产品",
        "virtual_type":2,
        "radius":30,
        "color":"#ff0600",
    },
    4:{
        'identity':"",
        "node_type":"virtual",
        "node_name":"业务",
        "virtual_type":2,
        "color":"#ff9e00",
        "radius":30,
    },
    5:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"文件",
        "virtual_type":2,
        "color":"#63c715",
        "radius":30,
    },
    6:{
        "identity":"",
        "node_type":"virtual",
        "node_name":"行业",
        "virtual_type":2,
        "color":"#63c715",
        "radius":30,
    }
};