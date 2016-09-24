"use strict";

var Geometry = require("../module/geometry.js");

class Camera {
    constructor(x,y,width,height) {
        this.Rect = new Geometry.Rect(x,y,width,height) ;
        // this.scale = new Geometry.Vector2(width,height);
        this.VisibleObjects = [] ;
        // this.VisibleFoods = [] ;
    }
}

module.exports = Camera ;