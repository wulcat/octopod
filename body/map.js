"use strict"
var Geometry = require('../module/geometry.js');
// var Component = require('../module/component.js');



// var Octopod = require('../module/octopod.js');
var Component = require('../module/component.js');
var Mathfw = require('../module/mathfw.js');

// var Body = require('../module/body.js');
var Food = require('../module/body.js').Food ;
class Map {
    constructor(rect , type) {
        this.rect = rect ;
        this.foods= [] ;
        // this.players = [[],[]] ;
        this.players = [] ;
        this.quadTree = new Component.QuadTree(rect) ;
        this.foodLength = 0 ;

        // for(var i = 0 ; i < 50 ; i++) // error on finding module Food
            // this.AddFood(new Food()) ;
    }
   
    AddFood(food) {
        var x , y ;
        x = Mathfw.RandomFloat(0,this.rect.width) ;
        y = Mathfw.RandomFloat(0,this.rect.height) ;

        // console.log(x,y);
        // var food = new Body.Food(this.foodLength , new Geometry.Vector2(x,y) ,
        //     new Geometry.Vector2(1,1)
        // )
        // food.x = x ;
        // food.y = y ;

        food.id = this.foodLength ;
        food.Transform.position.Renew(new Geometry.Vector2(x,y)) ;
        food.Transform.scale.Renew(new Geometry.Vector2(1,1)) ;
        food.Transform.id = food.id ;

        this.foods.push(food) ;
        this.quadTree.Insert(food.Transform);
        this.foodLength++ ;
    }
    UpdateFood() {
        for(var i = 0 ; i < this.foods.length ;i++) {
            if(this.foods[i].mass < 8) this.foods[i].mass += 1;
        }
    }
    Update() {

        // this.UpdateFood() ;

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
            if( gameObjectsInRange[i].Transform.position.x >= player.Camera.Rect.x && 
                gameObjectsInRange[i].Transform.position.y >= player.Camera.Rect.y && 
                gameObjectsInRange[i].Transform.position.x <= player.Camera.Rect.x + player.Camera.Rect.width &&
                gameObjectsInRange[i].Transform.position.y <= player.Camera.Rect.y + player.Camera.Rect.height &&
                gameObjectsInRange[i].id != player.id) {
                    gameObjectsInFieldView.push(gameObjectsInRange[i]);
                }
            // console.log(gameObjectsInRange[i].Transform.position.x+","+player.Camera.Rect.x+","+
            //             gameObjectsInRange[i].Transform.position.y+","+player.Camera.Rect.y+","+
            //             player.Camera.Rect.x+","+player.Camera.Rect.width+","+
            //             player.Camera.Rect.y+","+player.Camera.Rect.height+",") ;
        }

        // console.log(gameObjectsInRange) ;
        return gameObjectsInFieldView ;
    }
}
module.exports = Map ;