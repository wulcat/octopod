"use strict"
// var Geometry = require('../module/geometry.js');
// var Component = require('../module/component.js');

// var Body = require('../module/body.js');
var Octopod = require('../module/octopod.js');
var Mathfw = require('../module/mathfw.js');
class Map {
    constructor(rect , type) {
        this.rect = rect ;
        this.foods= [] ;
        this.players = [[],[]] ;
    }
   
    AddFood() {
        var x , y ;
        x = Mathfw.RandomFloat(0,this.rect.width) ;
        y = Mathfw.RandomFloat(0,this.rect.height) ;

        var food = new Octopod.Body.Food(new Geometry.Vector2(x,y) ,
            new Geometry.Vector2(1,1)
        )
        this.foods.push() ;
    }
    UpdateFood() {
        for(var i = 0 ; i < this.foods.length ;i++) {
            if(this.food[i].mass < 8) this.food[i].mass += 1;
        }
    }
    Update() {
        this.UpdateFood() ;
    }
}
module.exports = Map ;