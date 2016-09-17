"use strict";

var Geometry = require("../module/geometry.js");

class Camera {
    constructor(width,height) {
        // this.Rect = new Geometry.Rect(x,y,width,height) ;
        this.scale = new Geometry.Vector2(width,height);
    }
    getVisibleObjects(){
        var object_data = [] ;
        
    }
    
}

module.exports = Camera ;