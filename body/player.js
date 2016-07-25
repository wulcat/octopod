"use strict";
var Octopod = require('../module/octopod.js');
var Component = require('../module/component.js');
// var Octopod = require('../module/octomath.js');
var OctoMath = require('../module/octomath.js');
class Player {
    constructor(oath , id , name) {
        this.oath = oath ;
        this.id = id ;
        this.name = name ;
        this.Transform = new Component.Transform() ;

        this.status = false ;
        this.mapid = rank ;
        this.maptype = type ;
    }
    Init(moveSpeed , jerkSpeed , jerkMax) {
        this.MoveSpeed = moveSpeed ;
        this.JerkMax = jerkMax ;
        this.Jerk = 0 ;
        this.JerkSpeed = jerkSpeed ;
        this.Speed = 0 ;
        // this.RotWidthMax = RotWidth ;
        // this.RotWidthMin = 3 ;
        this.__angle = 0 ;
    }
    setMap(rank , type) {
        this.mapid = rank ;
        this.maptype = type ;
    }
    getMap() {
        return this.maptype+this.mapid ;
    }
    Start(time) {
        if(time == null) time = 500 ;
        var t = this ;
        // t.Transform.angle = 0 ;
        this.Updating = setInterval ( function() { t.Update(); } , time) ;
    }
  
    Update() {
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
        // var LerpAngle = OctoMath.Interpolate.Lerp([this.Transform.angle] , [this.___angle] , 0.5) ;
        // console.log(this.__angle , newAngle);
        this.Transform.angle = newAngle ;
        newAngle = newAngle * Math.PI/180 ;

        this.Transform.position = OctoMath.Angle.MoveOver(this.Transform.position.x , this.Transform.position.y , newAngle , this.Speed) ;
    }
    Stop() {
        if(this.Updating != null || this.Updating != undefined) clearInterval(this.Updating);
        this.Speed = 0 ;
    }
}

module.exports = Player ;