"use strict";

class Vector2 {
    constructor(x,y) {
        this.x = x || 0 ;
        this.y = y || 0 ;
    }
    static Distance(vec1 , vec2) {
        var a = vec1.x - vec2.x ;
        a *= a ;
        var b = vec1.y - vec2.y ;
        b *= b ;
        // var distance = Math.sqrt(a+b);
        return  Math.sqrt(a+b) ;
    }
}

module.exports = Vector2 ;