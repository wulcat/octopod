"use strict";

var Geometry = require('../module/geometry.js');
class Transform {
    constructor(id , type) {
        this.id = id || 0 ;
        this.type = type ;
        this.position = new Geometry.Vector2(0,0) ;
        this.rotation = new Geometry.Vector2(0,0) ; //no need
        this.angle = 0;
        this.scale = new Geometry.Vector2(2,2);
        this.size = 1 ;
    }
}
module.exports = Transform ;