
import echarts from 'echarts';
import $ from 'jquery';
import _ from 'lodash';
import {node_types} from './config';

var main = document.getElementById('main');
$(main).css({ "width": $("body").width(), "height": $("body").height() })
console.log(echarts);
var myChart = echarts.init(main);
var url = "http://kg.graph.com/graph/graph/get-graph";
// var url = "data/data.json";
myChart.showLoading();

$.ajax({
    type: "POST",
    // type: "GET",
    url: url,
    data: { "notice_id": "4759092" },
    dataType: "json",
    success: function (msg) {
        myChart.hideLoading();
        var nodes = msg.result.nodes;
        var links = msg.result.ships;
        var categories = [];
        var legendColor = [];
        Object.keys(node_types).forEach(function(key){
            var type = node_types[key];
            debugger;
            if(type.visible){
                categories[type.category] = {
                    name:type.type_name,
                    value:type.category
                }
                legendColor[type.category] = type.itemStyle.normal.color;
            }
        });
        categories = _.compact(categories);
        legendColor = _.compact(legendColor);
        // for (var i = 0; i < 9; i++) {
        //     categories[i] = {
        //         name: '类目' + i
        //     };
        // }

        nodes.forEach(function (node) {
            node.name = node.node_name;
            _.assignIn(node,node_types[node.node_type]);
            
            // node.category = node.attributes.modularity_class;
        });
        console.log(nodes);
        var option = {
            title: {
                text: '知识图谱',
                subtext: 'Default layout',
                top: 'top',
                left: 'left'
            },
            tooltip: {},
            color:legendColor,
            legend: [{
                // selectedMode: 'single',
                data: categories.map(function (a) {
                    return a.name;
                })
            }], 
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                name: '知识图谱',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                edgeSymbol: ['', 'arrow'],
                categories: categories,
                focusNodeAdjacency: true,
                roam: true,
                label: {
                    normal: {
                        show:true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                lineStyle: {
                    normal: {
                        curveness: 0.1,
                        color: 'source',
                    },

                },
                force: {
                    repulsion: 650,
                    gravity: 0.25,
                    edgeLength: [100, 150]
                },
            }]
        };

        myChart.setOption(option);
    }
});
