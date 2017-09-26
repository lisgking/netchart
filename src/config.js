import $ from 'jquery';

var C = 100000,
    CANVAS_WIDTH = $(window).width() || 600,
    CANVAS_HEIGHT = $(window).height() || 600,
    GRAB = 0.005,  //组合外部间距
    K = 0.04,
    MU = 0.92,
    NATLEN = 0,
    STEP = 0.2;  //组合内部间距

export {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    C,
    K,
    MU,
    GRAB,
    STEP,
    NATLEN
}