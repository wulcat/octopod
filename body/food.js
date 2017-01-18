"use strict";
var Geometry = require('../module/geometry.js');
var Component = require('../module/component.js');
class Food {
    constructor(id , position , size) {
        this.id = id ;
        this.mass = 1 ;
        this.Transform = new Component.Transform(id,"star");

        this.Transform.position = position || new Geometry.Vector2() ;
        this.Transform.scale = size || new Geometry.Vector2(1,1); 
    }
    getData() {
        var object_food = {} ;

        object_food["type"] = "food" ;
        object_food["id"] = this.id ;
        // object_food["mass"] = this.mass ;
        object_food["Transform"] = this.Transform ;

        return object_food ;    
    }
}
module.exports = Food ;