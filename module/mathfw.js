"use strict";
class Mathfw {
    static RandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    static RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static AngleToRad(angle) {
        var rad = angle * Math.PI / 180 ;
        return rad ;
    }
    static RadToAngle(rad) {
        var angle = rad * 180 / Math.PI ;
        return angle ;
    }
    static RotateAround(center , start , angle) {

    }
    static Lerp(start , end , t) {
        var ps = 1-t ;
        var pe = t ;
        var r = 0 ;

        r = ps * start + pe * end;
        return r ;
    }
    static LerpAngle(start , end , t , rad) {
        var d = Math.abs(end - start);
        if(d > 180)  { 
            if(end > start) start += 360; 
            else end += 360 ;
        }
        var value = ( start + ((end - start) * t)) ;
        if(value >= 0 && value <= 360) {
            if(rad)
            return Mathf.AngleToRad(value);
            else
            return value;
        }

        value %= 360 ;
        if(rad)
        return Mathf.AngleToRad(value);
        else
        return value;
    }
}
module.exports = Mathfw ;