"use strict";

var Geometry = require('../module/geometry.js');
class Transform {
    constructor() {
        this.position = new Geometry.Vector2(0,0) ;
        this.rotation = new Geometry.Vector2(0,0) ;
        this.angle = 0;
        this.scale = new Geometry.Vector2(2,2);
    }
}
module.exports = Transform ;