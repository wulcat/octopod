"use strict";

var Geometry = require("../module/geometry.js");
var Transform = require("../module/component.js").Transform ;
class Camera {
    constructor(x,y,width,height) {
        // this.Rect = new Geometry.Rect(x,y,width,height) ;
        this.Transform = new Transform() ;

        this.Transform.position = new Geometry.Vector2(x,y) ;
        this.Transform.scale = new Geometry.Vector2(width , height) ;
        this.Transform.id = -1 ;
        // this.scale = new Geometry.Vector2(width,height);
        this.VisibleObjects = [] ;
        // this.VisibleFoods = [] ;
    }
}

module.exports = Camera ;