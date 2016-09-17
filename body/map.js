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
        this.quadTree = new Octopod.Component.QuadTree(rect) ;
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
        this.quadTree.Clear() ;
        this.UpdateFood() ;

        for(var i = 0 ; i < this.players.length ; i++) {
            for(var j = 0 ; j < this.players[i].length ; j++) {
                this.quadTree.Insert(this.players[i][j]) ;
            }
        }
    }
    getObjectsInFieldView(fieldView) {
        var gameObjectsInRange = this.quadTree.Retrieve(fieldView);
        var gameObjectsInFieldView = [] ;

        for(var i = 0 ; i < gameObjectsInRange.length ; i++) {
            if( gameObjectsInRange[i].Transform.position.x > fieldView.x && 
                gameObjectsInRange[i].Transform.position.y > fieldView.y && 
                gameObjectsInRange[i].Transform.position.x < fieldView.x + fieldView.width &&
                gameObjectsInRange[i].Transform.position.y < fieldView.y + fieldView.height) {
                    gameObjectsInFieldView.push(gameObjectsInRange[i].getPlayer());
                }
        }

        return gameObjectsInFieldView ;
    }
}
module.exports = Map ;