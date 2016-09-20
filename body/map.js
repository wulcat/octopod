"use strict"
// var Geometry = require('../module/geometry.js');
// var Component = require('../module/component.js');

// var Body = require('../module/body.js');
var Octopod = require('../module/octopod.js');
var Component = require('../module/component.js');
var Mathfw = require('../module/mathfw.js');
class Map {
    constructor(rect , type) {
        this.rect = rect ;
        this.foods= [] ;
        // this.players = [[],[]] ;
        this.players = [] ;
        this.quadTree = new Component.QuadTree(rect) ;
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

        // for(var i = 0 ; i < this.players.length ; i++) {
        //     this.quadTree.Insert(this.players[i]) ;
        // }
        // for(var i = 0 ; i < this.players.length ; i++) {
        //     for(var j = 0 ; j < this.players[i].length ; j++) {
        //         this.quadTree.Insert(this.players[i][j]) ;
        //     }
        // }
    }
    getObjectsInFieldView(player) {
        // var fie
        var gameObjectsInRange = this.quadTree.Retrieve(player , true); //for Camera
        var gameObjectsInFieldView = [] ;
        // console.log(gameObjectsInRange);
        for(var i = 0 ; i < gameObjectsInRange.length ; i++) {
            if( gameObjectsInRange[i].Transform.position.x > player.Camera.Rect.x && 
                gameObjectsInRange[i].Transform.position.y > player.Camera.Rect.y && 
                gameObjectsInRange[i].Transform.position.x < player.Camera.Rect.x + player.Camera.Rect.width &&
                gameObjectsInRange[i].Transform.position.y < player.Camera.Rect.y + player.Camera.Rect.height) {
                    gameObjectsInFieldView.push(gameObjectsInRange[i].getPlayer());
                }
        }

        return gameObjectsInFieldView ;
    }
}
module.exports = Map ;