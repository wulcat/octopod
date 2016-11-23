"use strict";

class Vector2 {
    constructor(x,y) {
        this.x = x || 0 ;
        this.y = y || 0 ;
    }
    Renew(vec) {
        this.x = vec.x || 0 ;
        this.y = vec.y || 0 ;
    }
    static Distance(vec1 , vec2) {
        var a = vec1.x - vec2.x ;
        a *= a ;
        var b = vec1.y - vec2.y ;
        b *= b ;
        return  Math.sqrt(a+b) ;
    }
    static Sub(vec1 , vec2) {
        var m = new Vector2(vec1.x - vec2.x , vec1.y - vec2.y) ;
        return m ;
    }
    static Square(vec) {
        return vec.x*vec.x + vec.y*vec.y ;
    }
    static Length(vec) {
        return Math.sqrt(Vector2.Square(vec)) ;
    }
    static Scale(vec1 , coef) {
        var m = new Vector2(vec1.x * coef , vec1.y * coef) ;
        return m ;
    }
    static Add(vec1 , vec2) {
        var m = new Vector2(vec1.x + vec2.x , vec1.y + vec2.y) ;
        return m ;
    }
    static Rotate(origin , vec , theta) {
        var x = vec.x - origin.x ;
        var y = vec.y - origin.y ;

        return new Vector2(x*Math.cos(theta) - y*Math.sin(theta) + origin.x ,
                           x*Math.sin(theta) + y*Math.cos(theta) + origin.y) ;
    }
    static AngleBetween(vec1 , vec2) {
        var x = vec1.x * vec2.y - vec1.y * vec2.x ;
        var y = vec1.x * vec2.x + vec1.y * vec2.y ;

        return Math.atan2(x,y) ;
    }

    static AngleBetween2(vec1 , vec2 , vec3) {
        var vLeft = Vector2.Sub(vec1 , vec2) ;
        var vRight = Vector2.Sub(vec3 , vec2) ;

        return Vector2.AngleBetween(vLeft , vRight) ;
    }
}

module.exports = Vector2 ;