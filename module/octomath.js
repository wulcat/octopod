"use strict" ;
var Geometry = require("../module/geometry.js");
var Interpolate = {
     DotProduct : function(a,b) {
        var s = 0 ;
        for(var i = 0 ; i < a.length ; i++) {
            s += a[i] * b[i] ;
        }
        return s ;
    } ,
    Lerp : function(s,e,t) {
        var ps = 1-t ;
        var pe = t ;
        var r = [] ;
        for(var i = 0 ; i < s.length ; i++) {
            r.push(ps * s[i] + pe * e[i]) ;
        }
        return r ;
    } ,
    Slerp : function(s,e,t) {
        var cos = this.DotProduct(s,e);
        var sin = Math.sqrt(1 -cos*cos);
        if(sin===0) return this.Lerp(s , e, t);
        var angle = Math.acos(cos);
        var ps = Math.sin(angle * (1-t))/sin ;
        var pe = Math.sin(angle * t) / sin ;
        var r = [] ;
        for(var i = 0 ; i < s.length ; i++) {
            r.push(ps * s[i] + pe * e[i]) ;
        }
        return r ;
    }
}
var Quaternion = {
    QuaternionToEuler : function(quat , order){
        order = order || "YZX";
    
        var heading, attitude, bank;
        var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    
        switch(order){
        case "YZX":
            var test = x*y + z*w;
            if (test > 0.499) { // singularity at north pole
                heading = 2 * Math.atan2(x,w);
                attitude = Math.PI/2;
                bank = 0;
            }
            if (test < -0.499) { // singularity at south pole
                heading = -2 * Math.atan2(x,w);
                attitude = - Math.PI/2;
                bank = 0;
            }
            if(isNaN(heading)){
                var sqx = x*x;
                var sqy = y*y;
                var sqz = z*z;
                heading = Math.atan2(2*y*w - 2*x*z , 1 - 2*sqy - 2*sqz); // Heading
                attitude = Math.asin(2*test); // attitude
                bank = Math.atan2(2*x*w - 2*y*z , 1 - 2*sqx - 2*sqz); // bank
            }
            break;
        default:
            throw new Error("Euler order "+order+" not supported yet.");
        }
    
        // target.y = heading;
        // target.z = attitude;
        // target.x = bank;
        return [heading , attitude , bank];
    } ,
    EulerToQuaternion : function ( x, y, z, order ) {
        order = order || "XYZ";
    
        var c1 = Math.cos( x / 2 );
        var c2 = Math.cos( y / 2 );
        var c3 = Math.cos( z / 2 );
        var s1 = Math.sin( x / 2 );
        var s2 = Math.sin( y / 2 );
        var s3 = Math.sin( z / 2 );
    
        if ( order === 'XYZ' ) {
    
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 + s1 * s2 * c3;
            this.w = c1 * c2 * c3 - s1 * s2 * s3;
    
        } else if ( order === 'YXZ' ) {
    
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 - s1 * s2 * c3;
            this.w = c1 * c2 * c3 + s1 * s2 * s3;
    
        } else if ( order === 'ZXY' ) {
    
            this.x = s1 * c2 * c3 - c1 * s2 * s3;
            this.y = c1 * s2 * c3 + s1 * c2 * s3;
            this.z = c1 * c2 * s3 + s1 * s2 * c3;
            this.w = c1 * c2 * c3 - s1 * s2 * s3;
    
        } else if ( order === 'ZYX' ) {
    
            this.x = s1 * c2 * c3 - c1 * s2 * s3;
            this.y = c1 * s2 * c3 + s1 * c2 * s3;
            this.z = c1 * c2 * s3 - s1 * s2 * c3;
            this.w = c1 * c2 * c3 + s1 * s2 * s3;
    
        } else if ( order === 'YZX' ) {
    
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 + s1 * c2 * s3;
            this.z = c1 * c2 * s3 - s1 * s2 * c3;
            this.w = c1 * c2 * c3 - s1 * s2 * s3;
    
        } else if ( order === 'XZY' ) {
    
            this.x = s1 * c2 * c3 - c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 + s1 * s2 * c3;
            this.w = c1 * c2 * c3 + s1 * s2 * s3;
    
        }
    
        return [this.x,this.y,this.z,this.w] ;
    }
}

var Angle = {
    MoveOver : function(x , y , angle , speed) {
        x += Math.cos(angle-1.573) * speed ;
        y += Math.sin(angle-1.573) * speed ;
        return new Geometry.Vector2(x,y) ;
    } ,
    MouseToAngle : function(x,y) {
        var angle = Math.atan2(x,-y) ;
        angle = angle * 180/Math.PI ;
        return angle ;
    } ,
    LerpAngle : function(start, end , amount) {
        var difference = Math.abs(end - start);

        if (difference > 180) {
            if (end > start) { start += 360; }
            else { end += 360; }
        }

        var value = (start + ((end - start) * amount));
        var rangeZero = 360;

        if (value >= 0 && value <= 360) return value;

        return (value % rangeZero);
    }
}

var OctoMath = module.exports = {Interpolate : Interpolate , Quaternion : Quaternion , Angle : Angle}
// var Math = new math() ;
// module.exports = Math.Interpolate ;