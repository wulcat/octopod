"use strict";
var Component = require('../module/component.js');
class Food {
    constructor(position , size) {
        this.mass = 1 ;
        this.Transform = Component.Transform();

        this.transform.position = position || new Vector() ;
        this.transform.size = size || new Vector(1,1); 
    }
    getFood() {
        var object_food = {} ;

        object_food["mass"] = this.mass ;
        object_food["Transform"] = this.Transform ;

        return object_food ;    
    }
}
module.exports = Food ;