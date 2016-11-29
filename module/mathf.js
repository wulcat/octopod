"use strict";

class Mathf {
    constructor() {}
    
    static Lerp(start , end , t) {
        var ps = 1-t ;
        var pe = t ;
        var r = 0 ;

        r = ps * start + pe * end;
        return r ;
    }
}

module.exports = Mathf ;