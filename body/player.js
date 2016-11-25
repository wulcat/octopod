"use strict";
// var Octopod = require('../module/octopod.js');
var Geometry = require('../module/geometry.js');
var Component = require('../module/component.js');
// var Geometry = require('../module/geometry.js');
var OctoMath = require('../module/octomath.js');

var Tentacle = require('../body/tentacle.js') ;
class Player {
    constructor(oath , id , name , secId) {
        this.oath = oath ;
        this.id = id ;
        this.name = "mystry" ;
        this.Transform = new Component.Transform() ;
        // this.Camera = new Geometry.Rect(0,0,700,550);
        this.Camera = new Component.Camera(0,0,700,550);
        this.status = false ;
        
        this.tentacles = [] ;
        // this.oath = "socket" ;
        this.secId = secId ;
        // this.range = 0 ;
        this.wideLengthMultiplier = 120;
        this.totalLengthBound = 150 ;
        // this.mapid ; //= rank ;
        //this.maptype ; //= type ;
        this.mousePos = new Geometry.Vector2(0,0) ;
        this.focus = false ;
    }
    Init(moveSpeed , jerkSpeed , jerkMax) {
        this.MoveSpeed = moveSpeed ;
        
        this.Jerk = 0 ;
        this.JerkSpeed = jerkSpeed ;

        this.JerkMax = jerkMax ;
        
        this.Speed = 0 ;
        this.__angle = 0 ;
        // this.Camera = new Component.Camera(0,0,300,230) ;
        // this.RotWidthMax = RotWidth ;
        // this.RotWidthMin = 3 ;
    }
    setMap(rank , type) {
        this.mapid = rank ;
        this.maptype = type ;
    }
    getMap() {
        return this.maptype+this.mapid ;
    }
    // getView() {
    //     // var gameObjects 
    // }
    getData() {
        var object_player = {} ;

        object_player["type"] = "player" ;
        object_player["id"] = this.id ;
        object_player["name"] = this.name ;
        object_player["Transform"] = this.Transform ;
        object_player["oath"] = this.oath ;
        object_player["active"] = false ;
        object_player["tentacles"] = [] ;

        for(var i=0 ; i < this.tentacles.length ; i++) 
            object_player["tentacles"].push(this.tentacles[i].particles) ;

        return object_player ;
        
    }
    Start(time) {
        if(time == null) time = 500 ;
        var t = this ;
        // t.Transform.angle = 0 ;
        this.Updating = setInterval ( function() { t.Update(); } , time) ;
    }
    AddTentacle() {
        this.tentacles.push(new Tentacle(this.Transform.position , 5, 70, 0.95, (Math.PI/2)/3) ) ;
    }
    FocusTentacles(node) {
        for(var i = 0 ; i < this.tentacles.length ; i++) {}
            // this.tentacles[i].particles[18].pos.Renew(node) ;

    }       
    Update() {

        for(var i = 0 ; i < this.tentacles.length ; i++) {
            if(this.focus)
                this.tentacles[i].Update(this.mousePos.x , this.mousePos.y , true) ;
            else    
                this.tentacles[i].Update(this.mousePos.x , this.mousePos.y) ;
        }
        
        if(this.Jerk > this.JerkMax) {
            this.JerkSpeed = -Math.abs(this.JerkSpeed) ;
        }
        else if(this.Jerk < 2) {
            this.JerkSpeed = Math.abs(this.JerkSpeed) ;
        }
        if(this.Jerk < 2) {
            this.RotSpeed = 4 ;
        }
        else {
            this.RotSpeed = 3 ;
        }
        this.Jerk += this.JerkSpeed ;

        this.Speed = this.Jerk * this.MoveSpeed ;

        var newAngle = OctoMath.Angle.LerpAngle(this.Transform.angle , this.__angle , this.RotSpeed * 0.05) ;
        // var LerpAngle = OctoMath.Interpolate.Lerp([this.Transform.angle] , [this.__angle] , 0.5) ;

        this.Transform.angle = newAngle ;
        newAngle = newAngle * Math.PI/180 ;

        // this.Transform.position = OctoMath.Angle.MoveOver(this.Transform.position.x , this.Transform.position.y , newAngle , this.Speed) ;

        
        this.UpdateCamera() ;

        this.focus = false ;
    }
    UpdateCamera() {
        this.Camera.Rect.x = this.Transform.position.x - this.Camera.Rect.width/2 ;
        this.Camera.Rect.y = this.Transform.position.y - this.Camera.Rect.height/2 ;
    }
    Stop() {
        if(this.Updating != null || this.Updating != undefined) clearInterval(this.Updating);
        this.Speed = 0 ;
    }
}

module.exports = Player ;