"use strict"
var Mathfw = require('../module/mathfw.js');
var Body = require('../module/body.js');
var Geometry = require('../module/geometry.js');
class Map {
    constructor(rect) {
        this.rect = rect ;
        this.foods= [] ;
        this.players = [] ;
    }
    Join(id) {
        this.players.push(id);
    }
    AddFood() {
        var x , y ;
        x = Mathfw.RandomFloat(0,this.rect.width) ;
        y = Mathfw.RandomFloat(0,this.rect.height) ;

        var food = new Body.Food(new Geometry.Vector2(x,y) ,
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