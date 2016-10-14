"use strict";

class Mathf {
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

class Vector2 {
    constructor(x,y) {
        this.x = x || 0 ;
        this.y = y || 0 ;
    }
    static Lerp (start , end , t) {
        var x = Mathf.Lerp(start.x , end.x , t);
        var y = Mathf.Lerp(start.y , end.y , t);

        return new Vector2(x,y);
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

class Transform {
    constructor() {
        this.position = new Vector2() ;
        this.scale = new Vector2(1,1) ;
        this.angle = 0 ;
    }
    Translate(value) {
        this.position.x = value.x ;
        this.position.y = value.y ;
    }
    Rotate(value , rad) {
        if(rad) this.angle = Mathf.RadToAngle(value);
        else this.angle = value ;
    }
}
//___________________________________________________________________
class TentacleNode {
    constructor(x,y) {
        this.x = this.ox = x || 0 ;
        this.y = this.oy = y || 0 ;

        this.vx = 0 ;
        this.vy = 0 ;
    }
}
class FoodNode {
    constructor() {
        this.center = new Vector2() ;
        this.start = new Vector2() ;
        this.end = new Vector2() ;
    }
}
//___________________________________________________________________

class Rect {
    constructor(left , top , width , height) {
        this.left = left || 0 ;
        this.top = top || 0 ;
        this.width = width || 0 ;
        this.height = height || 0 ;

        this.right = this.left + this.width ;
        this.bottom = this.top + this.height ;
    }

    Init(left , top , width , height) {
        this.left = left ;
        this.top = top ;
        this.width = width || this.width ;
        this.height = height || this.height ;

        this.right = this.left + this.width ;
        this.bottom = this.top + this.height ;
    }

    Within(r) {
        return  (   r.left <= this.left && 
					r.right >= this.right &&
					r.top <= this.top && 
					r.bottom >= this.bottom
                );
    }
    Overlap(r) {
        return  (   this.left < r.right && 
					r.left < this.right && 
					this.top < r.bottom &&
					r.top < this.bottom
                );
    }
}

class Mouse {
    constructor(canvas) {
        this.position = new Vector2() ;
        this.left = false ;
        this.leftDOWN = false ;
        this.leftUP = false ;
        var t = this ;
        // console.log("moving "+this.position.x+","+this.position.y);;
        canvas.addEventListener("mousemove" , function(event) {
            t.position = t.calcMouseAxis(event) ;
            // console.log("moving "+this.position.x+","+this.position.y);;
        });
        canvas.addEventListener("mousedown" , function() {
            t.leftDOWN = true ;
            t.left = true ;
            // console.log("moving "+this.position.x+","+this.position.y);;
        });
        canvas.addEventListener("mouseup" , function() {
            t.leftUP = true ;
            t.left = false ;
            // console.log("moving "+this.position.x+","+this.position.y);;
        });

    }
    calcMouseAxis(event) {
        // console
        return new Vector2(event.clientX , event.clientY) ;
    }
    Reset() {
        this.leftDOWN = false ;
        this.leftUP = false ;
    }
}
class Keyboard {
    constructor(canvas) {
        this.enter = false ;
        this.enterDOWN = false ;
        this.enterDOWNCoolDown = true ;
        this.enterUP = false ;

        this.q = false ;
        this.qDOWN = false ;
        this.qDOWNCoolDown = true ;
        this.qUP = false ;

        this.s = false ;
        this.sDOWN = false ;
        this.sDOWNCoolDown = true ;
        this.sUP = false ;

        this.y = false ;
        this.yDOWN = false ;
        this.yDOWNCoolDown = true ;
        this.yUP = false ;

        this.u = false ;
        this.uDOWN = false ;
        this.uDOWNCoolDown = true ;
        this.uUP = false ;

        this.i = false ;
        this.iDOWN = false ;
        this.iDOWNCoolDown = true ;
        this.iUP = false ;

        this.o = false ;
        this.oDOWN = false ;
        this.oDOWNCoolDown = true ;
        this.oUP = false ;

        this.p = false ;
        this.pDOWN = false ;
        this.pDOWNCoolDown = true ;
        this.pUP = false ;


        var t = this ;
        canvas.addEventListener("keypress" , function(event) {
            const keyName = event.key;
            // console.log("sf");
            if (keyName === 'Control') {
                // not alert when only Control key is pressed.
                return;
            }

            if (event.ctrlKey) {
                // Even though event.key is not 'Control' (i.e. 'a' is pressed),
                // event.ctrlKey may be true if Ctrl key is pressed at the time.
                console.log(`Combination of ctrlKey + ${keyName}`);
            } else {
                console.log(`Key pressed ${keyName}`);
            }
        } , false);
        window.addEventListener("keydown" , function(event) {
            // console.log(event.keyCode);
            switch(event.keyCode) {
                case 13 :
                    t.enter = true ;
                    if(t.enterDOWNCoolDown == true) {
                        t.enterDOWN = true ;
                        t.enterDOWNCoolDown = false ;
                    }
                    break ;
                case 73 :
                    t.i = true ;
                    if(t.iDOWNCoolDown == true) {
                        t.iDOWN = true ;
                        t.iDOWNCoolDown = false ;
                    }
                    break ;
                case 79 :
                    t.o = true ;
                    if(t.oDOWNCoolDown == true) {
                        t.oDOWN = true ;
                        t.oDOWNCoolDown = false ;
                    }
                    break ;
                case 80 :
                    t.p = true ;
                    if(t.pDOWNCoolDown == true) {
                        t.pDOWN = true ;
                        t.pDOWNCoolDown = false ;
                    }
                    break ;
                case 81 :
                    t.q = true ;
                    if(t.qDOWNCoolDown == true) {
                        t.qDOWN = true ;
                        t.qDOWNCoolDown = false ;
                    }
                    break ;
                case 83 :
                    t.s = true ;
                    if(t.sDOWNCoolDown == true) {
                        t.sDOWN = true ;
                        t.qDOWNCoolDown = false ;
                    }
                    break ;
                case 85 :
                    t.u = true ;
                    if(t.uDOWNCoolDown == true) {
                        t.uDOWN = true ;
                        t.uDOWNCoolDown = false ;
                    }
                    break ;
                case 89 :
                    t.y = true ;
                    if(t.yDOWNCoolDown == true) {
                        t.yDOWN = true ;
                        t.yDOWNCoolDown = false ;
                    }
                    break ;
                default :
                    break ;
            }
        } , false);
        window.addEventListener("keyup" , function(event) {
            switch(event.keyCode) {
                case 13 :
                    t.enter = false ;
                    t.enterDOWNCoolDown = true ;
                    t.enterUP = true ;
                    break ;
                case 73 :
                    t.i = false ;
                    t.iDOWNCoolDown = true ;
                    t.iUP = true ;
                    break ;
                case 79 :
                    t.o = false ;
                    t.oDOWNCoolDown = true ;
                    t.oUP = true ;
                    break ;
                case 80 :
                    t.p = false ;
                    t.pDOWNCoolDown = true ;
                    t.pUP = true ;
                    break ;
                case 81 :
                    t.q = false ;
                    t.qDOWNCoolDown = true ;
                    t.qUP = true ;
                    break ;
                case 83 :
                    t.s = false ;
                    t.sDOWNCoolDown = true ;
                    t.sUP = true ;
                    break ;
                case 85 :
                    t.u = false ;
                    t.uDOWNCoolDown = true ;
                    t.uUP = true ;
                    break ;
                case 89 :
                    t.y = false ;
                    t.yDOWNCoolDown = true ;
                    t.yUP = true ;
                    break ;
                default :
                    break ;
            }
        } , false);
    }
    Reset() {
        this.enterDOWN = false ;
        this.enterUP = false ; 

        this.qDOWN = false ;
        this.qUP = false ;

        this.sDOWN = false ;
        this.sUP = false ;

        this.yDOWN = false ;
        this.yUP = false ;

        this.uDOWN = false ;
        this.uUP = false ;
        
        this.iDOWN = false ;
        this.iUP = false ;

        this.oDOWN = false ;
        this.oUP = false ;

        this.pDOWN = false ;
        this.pUP = false ;
    }
}

class Intervals {
    constructor() {
        this.preUpdate ;
        this.loading ;
        this.update ;
        this.send ;
        this.custom = [] ;
    }
    Add(update , period) {
        this.custom.push(setInterval(update , period)) ;
    }
}
class Elements {
    constructor() {
        this.canvas ;
        this.ctx ; 
        this.control_container ;
        this.ad_container ;
        this.display_container ;
        this.index_name ;
    }
}

class Drawf {
    static CurveThroughPoints(ctx , points , xView , yView) {
        if(!xView || !yView) { 
            xView = 0 ;
            yView = 0 ;
        }
        var i , n , a , b ,x ,y ;
        for(i = 1 , n = points.length - 2; i < n ;i++) {
            a = points[i] ;
            b = points[i+1] ;

            x = (a.x - 2 * xView + b.x) * 0.5 ;
            y = (a.y - 2 * yView + b.y) * 0.5 ;

            ctx.quadraticCurveTo(a.x - xView , a.y - yView , x , y);
        }
        a = points[i] ;
        b = points[i+1] ;
        ctx.quadraticCurveTo(a.x - xView, a.y - yView, b.x-xView , b.y-yView) ;
    }
    
    static Curve(ctx , points , tension , numOfSeg , close) {
        tension = (typeof tension === 'number') ? tension : 0.5;
        numOfSeg = (typeof numOfSeg === 'number') ? numOfSeg : 25;

        var pts,															// for cloning point array
            i = 1,
            l = points.length,
            rPos = 0,
            rLen = (l-2) * numOfSeg + 2 + (close ? 2 * numOfSeg: 0),
            res = new Float32Array(rLen),
            cache = new Float32Array((numOfSeg + 2) * 4),
            cachePtr = 4;

        pts = points.slice(0);

        if (close) {
            pts.unshift(points[l - 1]);										// insert end point as first point
            pts.unshift(points[l - 2]);
            pts.push(points[0], points[1]); 								// first point as last point
        }
        else {
            pts.unshift(points[1]);											// copy 1. point and insert at beginning
            pts.unshift(points[0]);
            pts.push(points[l - 2], points[l - 1]);							// duplicate end-points
        }

        // cache inner-loop calculations as they are based on t alone
        cache[0] = 1;														// 1,0,0,0

        for (; i < numOfSeg; i++) {

            var st = i / numOfSeg,
                st2 = st * st,
                st3 = st2 * st,
                st23 = st3 * 2,
                st32 = st2 * 3;

            cache[cachePtr++] =	st23 - st32 + 1;							// c1
            cache[cachePtr++] =	st32 - st23;								// c2
            cache[cachePtr++] =	st3 - 2 * st2 + st;							// c3
            cache[cachePtr++] =	st3 - st2;									// c4
        }

        cache[++cachePtr] = 1;												// 0,1,0,0

        // calc. points
        parse(pts, cache, l, tension);

        if (close) {
            pts = [];
            pts.push(points[l - 4], points[l - 3],
                    points[l - 2], points[l - 1], 							// second last and last
                    points[0], points[1],
                    points[2], points[3]); 								// first and second
            parse(pts, cache, 4, tension);
        }

        function parse(pts, cache, l, tension) {

            for (var i = 2, t; i < l; i += 2) {
                // tension = -tension;
                var pt1 = pts[i],
                    pt2 = pts[i+1],
                    pt3 = pts[i+2],
                    pt4 = pts[i+3],

                    t1x = (pt3 - pts[i-2]) * tension,
                    t1y = (pt4 - pts[i-1]) * tension,
                    t2x = (pts[i+4] - pt1) * tension,
                    t2y = (pts[i+5] - pt2) * tension,
                    c = 0, c1, c2, c3, c4;

                for (t = 0; t < numOfSeg; t++) {

                    c1 = cache[c++];
                    c2 = cache[c++];
                    c3 = cache[c++];
                    c4 = cache[c++];

                    res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                    res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
                }
            }
        }

        // add last point
        l = close ? 0 : points.length - 2;
        res[rPos++] = points[l++];
        res[rPos] = points[l];

        // add lines to path
        for(i = 0, l = res.length; i < l; i += 2)
            ctx.lineTo(res[i], res[i+1]);

        return res;
    }
}

class Tentacle {
    constructor(length , radius , spacing , friction) {
        this.length = length || 10 ;
        this.radius = radius || 10;
        this.spacing = spacing  || 20;
        this.friction = friction  || 0.8;
        this.angle = 0 ;
        this.scale = new Vector2() ;
        this.nodes = [] ;
        this.outer = [] ;
        this.inner = [] ;
        // this.theta = [] ;

        for(var i = 0 ; i < this.length ; i++) {
            this.nodes.push(new TentacleNode());
        }
    }
    Target(target , scale) {
        this.nodes[0] = target ;
        this.scale = scale ;
    }
    Move(value , instant) {
        this.nodes[0].x = value.x ;
        this.nodes[0].y = value.y ;

        if(instant) {
            var i , node ;
            for( i=1 ; i < this.length ; i++) {
                node = this.nodes[i];
                node.x = value.x ;
                node.y = value.y ;
            }
        }
    }
    Update(r , g , w) {
        var i = 0 ;
        var j = 0 ;
        var s = 0 ;
        var c = 0 ;
        var dx = 0 ;
        var dy = 0 ;
        var da = 0 ;
        var px = 0 ;
        var py = 0 
        var node ;
        // var node = new TentacleNode() ;
        var prev = this.nodes[0] ;

        var radius = r*this.radius ;
        var step = radius/this.length ;
        var d = 0.009 ; // as speed increase d++ and forceAngle++
        var forceAngle = Mathf.AngleToRad(10);

        for(i=1 , j=0 ; i < this.length ;i++ ,j++) {
            node = this.nodes[i] ;

            node.x += node.vx ;
            node.y += node.vy ;

            dx = prev.x - node.x ;
            dy = prev.y - node.y ;
            da = Math.atan2(dy , dx) ;

            px = node.x + Math.cos(da) * this.spacing ;
            py = node.y + Math.sin(da) * this.spacing ;

            node.x = prev.x - (px - node.x);
            node.y = prev.y - (py - node.y);

            node.vx = node.x - node.ox ;
            node.vy = node.y - node.oy ;

            node.vx *= this.friction * Mathf.RandomFloat(0.16,0.19) ; //* (1-f);
            node.vy *= this.friction * Mathf.RandomFloat(0.16,0.19) ; //* (1-f);

            node.vx += w ;
            node.vy += g ;
            if(Players[IDs[0]].newTransform.position.x > node.x) {
                if(this.angle > forceAngle) 
                    g += d ;
                else if(this.angle < -forceAngle)
                    g -= d ;
            }
            else {
                if(this.angle > forceAngle) 
                    g -= d ; 
                else if(this.angle < -forceAngle)
                    g += d ;
            }

            if(node.y > Players[IDs[0]].newTransform.position.y) {
                if(this.angle > forceAngle) 
                    w += d ;
                else if(this.angle < -forceAngle)
                    w -= d ;
            }
            else {
                if(this.angle > forceAngle) 
                    w -= d ;
                else if(this.angle < -forceAngle)
                    w += d ;
            }

            node.ox = node.x ;
            node.oy = node.y ;

            s = Math.sin(da+1.57079632679489661923) ;
            c = Math.cos(da+1.57079632679489661923) ;


            this.outer[j] = new Vector2(prev.x + c * radius , prev.y + s * radius) ;
            this.inner[j] = new Vector2(prev.x - c * radius , prev.y - s * radius) ;

            radius -= step ;
            prev = node ;
        }
    }

    Draw(ctx , xView , yView , angle , x , y) {
        var h , s ,v ,e ;
        s = this.outer[0] ;
        e = this.inner[0] ;

        if(typeof(this.outer[0]) == 'undefined' || typeof(this.inner[0]) == 'undefined') {
            return ;
        }
        var angle_sin = Math.sin(this.angle) * this.scale.x ;
        var angle_cos = Math.cos(this.angle) * this.scale.y;
        
        var x = (s.x+e.x)/2 ;
        var y = (s.y+e.y)/2 ;

        ctx.save();
        ctx.setTransform(angle_cos, angle_sin , -angle_sin , angle_cos , x - xView , y - yView);
        
        ctx.beginPath() ;
        // ctx.moveTo(s.x - xView, s.y - yView) ;
        ctx.moveTo(s.x - x , s.y-y) ;
        Drawf.CurveThroughPoints(ctx , this.outer , x , y);
        Drawf.CurveThroughPoints(ctx , this.inner.reverse() , x , y);
        ctx.lineTo(e.x - x,e.y - y);
        ctx.closePath() ;
        ctx.fillStyle = "#ff0000";
        ctx.fill() ;
        ctx.strokeStyle = "#e60000";
        ctx.lineWidth = 3 ;
        ctx.stroke() ;
        ctx.restore();

    }
}
class Camera {
    constructor(xView , yView , canvasWidth , canvasHeight , worldWidth , worldHeight) { // canvas widht and height will constant depending upon server size
        this.xView = xView || 0;
        this.yView = yView || 0;

        this.xDeadZone = 0 ;
        this.yDeadZone = 0 ;

        this.wView = canvasWidth ;
        this.hView = canvasHeight ;

        this.follow = null ;

        this.viewportRect = new Rect(this.xView , this.yView , this.wView , this.hView) ;

        this.worldRect = new Rect(0 , 0 , worldWidth , worldHeight) ;
    }

    Target(position , xDeadZone , yDeadZone) {
        this.follow = position ;
        this.xDeadZone = xDeadZone ;
        this.yDeadZone =yDeadZone ;
    }
    Viewport(width , height) {
        this.wView = width ;
        this.hView = height ;
        this.viewportRect = new Rect(this.xView , this.yView , this.wView , this.hView);
    }
    Update() {

        if(this.follow != null) {
                if(this.follow.x - this.xView + this.xDeadZone > this.wView)
                    this.xView = this.follow.x - (this.wView - this.xDeadZone);
                else if(this.follow.x - this.xDeadZone < this.xView)
                    this.xView = this.follow.x - this.xDeadZone ;
                if(this.follow.y - this.yView + this.yDeadZone > this.hView)
                    this.yView = this.follow.y - (this.hView - this.yDeadZone);
                else if(this.follow.y - this.yDeadZone < this.yView)
                    this.yView = this.follow.y - this.yDeadZone ;
        }

        this.viewportRect.Init(this.xView , this.yView);

        if(!this.viewportRect.Within(this.worldRect)) {
            if(this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left ;
            if(this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top ;
            if(this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView ;
            if(this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView ;
        }
    }
}

class Body {
    // static Instantiate() {

    // }
    constructor(bound , position , scale , angle ) {
        this.Name = "Mystry" ;
        this.Transform = new Transform() ;

        this.Transform.position = position || new Vector2(0,0) ;
        this.Transform.scale = scale || new Vector2(1,1) ;
        this.Transform.angle = angle || 0 ;

        this.Bound = bound || new Vector2(50,50) ;
        this.newTransform = new Transform() ;

        this.tentacles = [] ;
        this.Settings() ;
    }
    Settings() {
        this.gravity = 0 ;
        this.wind = 0 ;
        this.radius = 25 ;
    }
    AddTentacle(length , radius , spacing , friction) {
        var tentacle = new Tentacle(length , radius , spacing , friction) ;
        tentacle.Target(this.Transform.position , this.Transform.scale);
        // tentacle.angle = Mathf.RandomFloat(-Math.PI , Math.PI);
        tentacle.angle = Mathf.AngleToRad(Mathf.RandomInt(-180 , 180)) ; // Mathf.AngleToRad(45);
        // tentacle.Move(this.Transform.position , true);
        this.tentacles.push(tentacle);
    }
 
    Translate(vec) {
        this.Transform.position.x = vec.x ;
        this.Transform.position.y = vec.y ;

        var n = this.tentacles.length ;

        for(var i = 0 ; i < n ; i++) {
            this.tentacles[i].Update(this.radius , this.gravity , this.wind);
        }
    }
    Rotate(angle) {
        this.Transform.angle = angle ;
    }
    Draw(ctx , xView , yView) {
        var width = this.Bound.x ;
        var height = this.Bound.y ;

        // var x = this.Transform.position.x - width/2 - xView ;
        // var y = this.Transform.position.y - height/2 - yView ;
        var x = this.Transform.position.x - xView ;
        var y = this.Transform.position.y - yView ;
        var r = 35 ;

        var angle_sin = Math.sin(this.Transform.angle) * this.Transform.scale.x;
        var angle_cos = Math.cos(this.Transform.angle) * this.Transform.scale.y;


        ctx.save();
        ctx.setTransform(angle_cos, angle_sin , -angle_sin , angle_cos , x , y);

        ctx.beginPath() ;
        ctx.arc(0,0,r,0,2*Math.PI,false);
        ctx.strokeStyle = "#e60000";
        ctx.lineWidth = 10 ;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#e60000";
        ctx.fillStyle = "#ff0000";
        ctx.stroke();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.save() ;
       
        // console.log(ctx.measureText(width));
        ctx.font="23px Georgia";

        var width = ctx.measureText(this.Name).width/2 ;
        var height = parseInt(ctx.font)/4 ;

        ctx.setTransform(angle_cos, angle_sin , -angle_sin , angle_cos , x-width , y+height);
        
        // console.log(parseInt(ctx.font)) ;
        ctx.fillText(this.Name, 0 , 0);
        
        ctx.restore() ;
    }
}
class Map {
    constructor(width , height) {
        this.width = width ;
        this.height = height ;

        this.image = null ;
    }

    Generate() {
        var canvas = document.createElement('canvas') ;
        canvas.id = "canvas"

        canvas.width = this.width ;
        canvas.height = this.height ;
        
        var ctx = canvas.getContext("2d");

        ctx.shadowBlur=20;
        ctx.shadowColor="#66ccff";

        var startX = 0  ;
        var startY = 0 ;

        var distance = 50 ;
        var length = this.width/distance ;
        var heights = 40 ;
        ctx.beginPath();
        for(var k = 0 ; k < length ; k++) {
            for(var i = 0 ; i < length ; i++) {
                var j = i % 2 == 0 ? -1 : 1 ;
                ctx.moveTo(startX,startY);
                startX += distance ;
                ctx.quadraticCurveTo((startX-distance+startX)/2 , heights * j + startY , startX , startY) ;
            }
            startX =  0 ;
            startY = k*100 ;
        }
        for(var k = 0 ; k < length ; k++) {
            for(var i = 0 ; i < length ; i++) {
                var j = i % 2 == 0 ? -1 : 1 ;
                ctx.moveTo(startX,startY);
                startY += distance ;
                ctx.quadraticCurveTo(heights * j + startX , (startY-distance+startY)/2 , startX , startY) ;
            }
            startX = k*100 ;
            startY = -50 ;
        }

        ctx.closePath();
        ctx.strokeStyle="#66ccff" ;
        ctx.stroke() ;

        this.image = new Image() ;
        this.image.src = ctx.canvas.toDataURL("image/png") ;
        ctx = null ;
    }

    Draw(ctx , xView , yView) {
        // ctx.shadowBlur=20;
        // ctx.shadowColor="#66ccff";
        ctx.clearRect( 0 , 0 , elements.canvas.width , elements.canvas.height);
        ctx.drawImage(this.image , xView , yView , elements.canvas.width , elements.canvas.height , 0 ,0 ,elements.canvas.width ,elements.canvas.height);
    }
}

class Food {
    constructor(position , scale , radius , shear) {
        this.position = position || new Vector2() ;
        this.scale = scale || new Vector2() ;
        this.angle = 0 ;

        this.radius = radius || 0 ;
        this.nodesRoot = [] ;
        this.nodesJoint = [] ;
        this.newNodesRoot = [] ;
        this.newNodesJoint = [] ;
        for(var i = 0 ; i < 6 ; i++) {
            this.nodesRoot.push(new Vector2());
            this.newNodesRoot.push(new Vector2());
        }
        for(var i = 0 ; i <= this.nodesRoot.length ; i++) {
            this.nodesJoint.push(new Vector2());
            this.newNodesJoint.push(new Vector2());
        }
        this.tension = 1.8 ;
        this.numOfSeg = 60 ;
        this.newFormCount = 0 ;
    }
    Update() {
        this.newFormCount += 1;
        var nodeRoot , nodeJoint , prevnodeRoot , angle , amp , startAngle , length ,start , end;

        length = this.nodesRoot.length ;
        amp = 10 ;
        startAngle = Mathf.AngleToRad(Mathf.RandomFloat(4 , 45)) ;
        nodeRoot = this.nodesRoot[0] ;

        if(this.newFormCount > 30) {
            this.newFormCount = 0 ;
            for(var i = 0 ; i < length ; i++) {
                if(i==0) angle = startAngle ;
                else if (i==length -1) {
                    angle = startAngle - (startAngle + Math.PI*2 - angle)/2 ;  
                }
                else {
                    var eta = angle + Mathf.AngleToRad((360 - Mathf.RadToAngle(angle))/(length-i)) ;
                    angle = Mathf.RandomFloat(angle , eta) + Mathf.AngleToRad(10) ;
                }
                var x = (this.radius + amp*Math.sin(angle) ) * Math.cos(angle) ;
                var y = (this.radius + amp*Math.sin(angle) ) * Math.sin(angle) ;
                
                nodeRoot.x = x ;
                nodeRoot.y = y ;

                nodeRoot = this.nodesRoot[i+1] ;
            }
            
            start = this.nodesRoot[length-1] ;
            end = this.nodesRoot[0];

            for(var i = 1 ; i <= length ; i++) {
                var amp , m , a ;
                amp = 3 ;
                m = new Vector2() ;
                a = new Vector2() ;

                m.x = ( start.x + end.x )*2/3 ;
                m.y = ( start.y + end.y )*2/3 ;
                
                a.x = ( start.x + end.x )/2 ;
                a.y = ( start.y + end.y )/2 ;

                a.x = Mathf.RandomFloat(m.x , m.x+a.x) ;
                a.y = Mathf.RandomFloat(m.y , m.y+a.y) ;

                this.nodesJoint[i-1].x = a.x ;
                this.nodesJoint[i-1].y = a.y ;

                start = end ;
                end = this.nodesRoot[i];
            }
        }
        else {
            var start , center , end ;
            for(var i = 0 ; i < this.nodesRoot.length ; i++) {
                this.newNodesRoot[i] = Vector2.Lerp(this.newNodesRoot[i] , this.nodesRoot[i] , 0.01);
                this.newNodesRoot[i] = Vector2.Lerp(this.newNodesRoot[i] , this.nodesRoot[i] , 0.01);
            }
            for(var i = 0 ; i <= this.nodesRoot.length ; i++) {
                this.newNodesJoint[i] = Vector2.Lerp(this.newNodesJoint[i] , this.nodesJoint[i] , 0.01);    
            }
            // this.newNodesRoot[0] = Vector2.Lerp(this.newNodesRoot[0] , this.nodesRoot[0] , 0.1);
            // this.newNodesJoint[0] = Vector2.Lerp(this.newNodesJoint[0] , this.newNodesJoint[0] , 0.1);
            // this.newNodesRoot[1] = Vector2.Lerp(this.newNodesRoot[1] , this.nodesRoot[1] , 0.1);
        }
    }
    Draw(ctx , xView , yView) {
        this.angle += 0.01 ;
        var angle_sin = Math.sin(this.angle) * this.scale.x;
        var angle_cos = Math.cos(this.angle) * this.scale.y;
        
        ctx.save() ;
        ctx.setTransform(angle_cos, angle_sin , -angle_sin , angle_cos , this.position.x - xView , this.position.y - yView) ;
      
        var start , center , end ;

        start = this.newNodesRoot[this.nodesRoot.length-1] ;
        center = this.newNodesJoint[0] ;
        end = this.newNodesRoot[0] ;

        ctx.moveTo(start.x, start.y);
        var points = [] ;
        for(var i = 1 ; i < this.nodesJoint.length ; i++) {
            // ctx.lineTo(start.x , start.y);
            // ctx.lineTo(center.x , center.y);
            // ctx.lineTo(end.x , end.y);

            points.push(start.x);
            points.push(start.y);

            points.push(center.x);
            points.push(center.y);
            
            points.push(end.x);
            points.push(end.y);

            start = end;
            
            center = this.newNodesJoint[i];
            end = this.newNodesRoot[i];

        }
        
        Drawf.Curve(ctx, points ,this.tension,this.numOfSeg,true);
        
        ctx.closePath();
        ctx.fill();
        ctx.restore() ;
    }
}
// var daf = false ;
class MouseTentatcle {
    constructor(l,t1,t2,maxAngle) {
        this.length = l ;
        this.nodes = [] ;
        for(var i = 0 ; i < this.length ; i++) {
            this.nodes.push(new TentacleNode(0,0));
        }
        this.tension1 = t1 ;
        this.tension2 = t2 ;
        this.maxAngle = maxAngle ;

        var x = this.length * Math.PI/180 ;
        var y = Math.sin(Math.cos(x))*x ;

        this.nodes[this.nodes.length-1].x = x ;
        this.nodes[this.nodes.length-1].y = y ;
    }
    Update(posX , posY) {
        d2 = d2 == 0 ? 1 : d2 ;
        d1 = d1 == 0 ? 1 : d1 ;
        
        // var adf ;
        for(var i=0 ; i < this.length ; i++) {
            var angle = i * Math.PI/180 ;
            var x = angle ;
            var y = (Math.sin(Math.cos(angle- Math.PI/2)))*(angle - Math.PI/2) ;
            // adf = (Math.sin(Math.cos(angle- Math.PI/2)))*(angle - Math.PI/2) ;
            this.nodes[i].x = x ;
            this.nodes[i].y = y ;
        }

        var d1 = Vector2.Distance(new Vector2(0,0) , new Vector2(posX , 0));
        var d2 = Vector2.Distance(new Vector2(0,0) , new Vector2(this.nodes[this.nodes.length-1].x,this.nodes[this.nodes.length-1].y)) ;

        var m = d1/d2 ;

        for(var i = 0 ; i < this.length ; i++) {
            this.nodes[i].x *= m ;
            this.nodes[i].y *= 90 ;
            
            var angle = Math.acos(posX/debugData.totalLengthBound) ;
            var y = debugData.wideLengthMultiplier * Math.sin(angle) ;
            
            var angle1 = Math.atan2(posX,y) ;
            angle1 = Math.asin(Math.cos(angle1));
            this.nodes[i].y *= angle1 ;
        }
    }
    Draw(ctx , x , y , xView , yView) {

        x = x - xView ;
        y = y - yView ;
        ctx.save() ;

        ctx.setTransform(1,0,0,1,x,y)
        ctx.beginPath() ;
        for(var i = 0 ; i < this.length ; i++) {
            ctx.lineTo(this.nodes[i].x , this.nodes[i].y) ;
        }
        ctx.stroke() ;
        ctx.restore() ;
    }
}


//___________________________________________________________________End Classes
var intervals = new Intervals() ;
var elements = new Elements() ;
var MouseHandler ;
var KeyboardHandler ;
elements.control_container = document.getElementById("control-container") ; 
elements.display_container = document.getElementById("display-container") ;
elements.index_name = document.getElementById("player-name");
var socket ;
var isConnected = false ;
var isInit = false ;
var loaded = false ;
var Players = {} ;
var IDs = [] ;
// var player ;
var Foods = {} ;
var IDsFood = [] ;

var camera ;
var room ;

var debug = true ;

var World = {
    underwater : {  value : 0 , 
                    type : "underwater" }
}
var CurrentWorld = World.underwater ;
function SelectWorld(world) {
    //reset if anything exsits
    CurrentWorld = world ;
    //reinitiated if needed
}
// function CreateWorld(world) {
    
// }
// var name = "mystry" ;
// var type = "underwater";    
var canConnect = false ;
function Logged() {
    if(isInit) {
        return{ oath : "none" ,
                id : socket.id ,
                secId : "none" ,
                name : elements.index_name.value } ;
    }
}
// function Instantiate(type , position , size , angle) {
//     var object ;
//     return object ;
// }
function Start() { // Removed The oath and id stuff recieved from Logged() ;
    
    if(loaded) {
        if(!isInit) {
            socket = io.connect() ;
            Init() ;
            isInit = true ;

            // clearInterval(intervals.preUpdate);
            // intervals.loading = setInterval(Loading , 20) ;
            // isConnected = true ;
        }
        else if(!isConnected && canConnect) {
            // socket.connect() ;
            
            var result = Logged() ;
            // console.log(result.name);
            socket.emit('S_Connect' , result.name , CurrentWorld.type ) ;
            clearInterval(intervals.preUpdate);
            intervals.loading = setInterval(Loading , 20) ;
            // isConnected = true ;

           
        }
        else {
            alert("Already Connected") ;
        }
    }
}



function Init() {
    socket.on('connected' , function(data) {
        // Start() ;
        var result = Logged() ;
        socket.emit('init' , result.oath , result.id , result.secId) ;
    });
    socket.on('init' ,function(status) {
        canConnect = status ;
        Start() ;
    });
    socket.on('joined' , function(data) {
        elements.control_container.style.display = "none" ;
        elements.display_container.style.display = "flex" ;
        // elements.display_container.style.height = window.innerHeight+"px" ;
        clearInterval(intervals.loading);
        Prepare(data) ;
        intervals.update = setInterval(Frame , 1000/30);
        // intervals.update = setInterval(Frame , 1000);
        // intervals.Add(ClearCanvas , 500);
        intervals.send = setInterval(Send , 200) ;

        
        // room.Draw(ctx , camera.xView , camera.yView);
    });
    socket.on('end' , function() {
        clearInterval(intervals.send) ;
        elements.control_container.style.display = "flex" ;
        elements.display_container.style.display = "none" ;
        isConnected = false ;
    });
    socket.on('stop') , function() {
        clearInterval(intervals.send) ;
        // socket.disconnect() ;
        celements.ontrol_contatiner.style.display = "flex" ;
        elements.display_container.style.display = "none" ;
        isConnected = false ;
    }
    socket.on('Direction' , function(angle , position) { //obsolete
        player.newTransform.angle = angle ;
        position.x += elements.canvas.width ;
        position.y += elements.canvas.height ;
        player.newTransform.position = position ;
    });
    // socket.on('')
    socket.on('SyncPlayer' , function(data , single) {
        // var result = Logged() ;
        if(single) {
            // console.log(data.id +" , "+ socket.id);
            // console.log(IDs);
            if(typeof(Players[data.id]) !== 'undefined' || typeof(Foods[data.id]) !== 'undefined') {
                if(data.type == 'player') {
                    Players[data.id].newTransform.angle = data.Transform.angle ;

                    data.Transform.position.x += elements.canvas.width ;
                    data.Transform.position.y += elements.canvas.height ;

                    Players[data.id].newTransform.position = data.Transform.position ;
                }
                else if(data.type == 'food') {
                    Foods[data.id].position = data.Transform.position ;
                    Foods[data.id].angle = data.Transform.angle ;
                    Foods[data.id].scale = data.Transform.scale ;
                }
            }
            else {
                // var CurrentWorld
                // console.log("error");
                socket.emit('SyncPlayer') ;
            }
        }
        else {
            // console.log(data);
            IDs = [] ;
            Players = [] ;
            IDsFood = [] ;
            Foods = [] ;
            for(var i = 0 ; i < data.length ; i++) {
                
                // if(data[i].id == socket.id) {

                if(data[i].type == "player") {
                    Players[data[i].id] = new Body(new Vector2(50,50) , new Vector2(elements.canvas.width/2,elements.canvas.height/2) , new Vector2(1,1), 0) ;
                    Players[data[i].id].Name = data[i].name ;
                    // console.log(data[i].name);
                // }
                // else {
                    // Players[data[i].id] = data[i] ;
                // }
                    IDs.push(data[i].id) ;
                }
                else if(data[i].type == "food") {
                    Foods[data[i].id] = new Food (  data[i].Transform.position ,
                                                    data[i].Transform.scale ,
                                                    3,3 );
                    IDsFood.push(data[i].id) ;
                }

            }
            
        }
        // console.log(single) ;
        // console.log(data) ;
    });
    socket.on('SyncFood' , function(data) {
        Food[data.id] = data.Transform ;
    });
    //___________________________________________________________________
    socket.on('debug-Bind-Tentacle' , function(a,b,c,d,e) {
        debugData.totalLengthBound = a ;
        debugData.wideLengthMultiplier = b ;
        debugData.angleToMouse = Math.asin(Math.cos(c) ) ;
        debugData.maxBoundX = d ;
        debugData.maxBoundY = e ;
    });
    //___________________________________________________________________
}
//___________________________________________________________________
class DebugData {
    constructor() {
        this.totalLengthBound = 0 ;
        this.wideLengthMultiplier = 0 ;
        this.angleToMouse = 0 ;
        this.maxBoundX = 0 ;
        this.maxBoundY = 0 ;
    }
}
var debugData ;
if(debug)
    debugData = new DebugData() ;

//___________________________________________________________________
function Prepare(data) {
    // room = {
    //     width : 2000 ,
    //     height : 2000 ,
    //     map : new Map(2000, 2000)
    // };
    room = new Map(5000 , 5000);
    room.Generate() ;

    camera = new Camera(0,0, elements.canvas.width , elements.canvas.height , 5000 , 5000);

    // player = new Body(new Vector2(50,50) , new Vector2(elements.canvas.width/2,elements.canvas.height/2) , new Vector2(1,1), 0) ;
    
    // var food = new Food(new Vector2(500 , 500) , new Vector2(1,1) , 35 , 20);
    // Foods.push(food);
    camera.Target(Players[socket.id].Transform.position , elements.canvas.width/2 , elements.canvas.height/2);

    camera.Update() ;
    
    elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height) ;

    // socket.emit("C_Ready");
}
// var oath = "user";
// var id = 1 ;
function Send() {
    // var result = Logged() ;
    var x = MouseHandler.position.x - window.innerWidth/2 ;
    var y = MouseHandler.position.y - window.innerHeight/2 ;
    socket.emit('MouseUpdate' , x , y);

    // console.log(x+","+y) ;
}

//___________________________________________________________________



window.onresize = function() {
    // elements.canvas.width = window.innerWidth ;
    // elements.canvas.height = window.innerHeight ;

    var canvas = document.getElementById("game") ;
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;
    var ctx = canvas.getContext("2d") ;
    // camera.Viewport(canvas.width , canvas.height);
    ctx.clearRect(0 , 0 , canvas.width , canvas.height) ;

    if(room != null)
        room.Draw(ctx , camera. xView , camera.yView);
}

window.onload = function() {

    var canvas = document.getElementById("game" );
    var ctx = canvas.getContext("2d");
    canvas.style.display = "flex" ;

    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;

    MouseHandler = new Mouse(canvas) ;
    KeyboardHandler = new Keyboard(canvas) ;
    elements.canvas = canvas ;
    elements.ctx = ctx ;

    // var FPS =30 ;
    // var INTERVAL = 1000/FPS ;
    // var STEP = INTERVAL/1000 ;

    // room = {
    //     width : 2000 ,
    //     height : 2000 ,
    //     map : new Map(2000, 2000)
    // };

    // room.map.Generate() ;

    // camera = new Camera(0,0, canvas.width , canvas.height , room.width , room.height);

    // player = new Body(new Vector2(50,50) , new Vector2(elements.canvas.width/2,elements.canvas.height/2) , new Vector2(1,1), 0) ;
    
    // var food = new Food(new Vector2(500 , 500) , new Vector2(1,1) , 35 , 20);
    // Foods.push(food);
    // camera.Target(player.Transform.position , canvas.width/2 , canvas.height/2);

    // camera.Update() ;
    
    // ctx.clearRect(0 , 0 , canvas.width , canvas.height) ;
    // room.Draw(ctx , camera.xView , camera.yView);
    
    loaded = true ;

    intervals.preUpdate = setInterval(PreUpdate , 30);
}


function PreUpdate() {
    if(KeyboardHandler.enterDOWN) {
        Start() ;
    } 
    KeyboardHandler.Reset() ;
    // elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);
    // room.Draw(elements.ctx , camera.xView , camera.yView) ;
}

function Loading() {
    elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);

}
var customTent = new MouseTentatcle(90,50,30 , 50);
function Frame() {
    // console.log(event);
    
    Update() ;
    Draw() ;

    // if(debug) Debug(elements.ctx , Players[IDs[0]].Transform.position.x , Players[IDs[0]].Transform.position.y , camera.xView , camera.yView) ;
    
    // customTent.Update(debugData.maxBoundX , debugData.maxBoundY) ;
    // customTent.Draw(elements.ctx, Players[IDs[0]].Transform.position.x , Players[IDs[0]].Transform.position.y , camera.xView , camera.yView) ;
}

var __interpolateMoveSpeed = 1.2 ;
// var __interpolateAngleSpeed = 2.5 ;

function Draw() {

    

    room.Draw(elements.ctx , camera.xView , camera.yView) ;
    
    for(var i = 0 ; i < IDsFood.length ; i++) {
        Foods[IDsFood[i]].Draw(elements.ctx , camera.xView , camera.yView) ;
    }
    

    for(var i=0 ; i < IDs.length ;i++) {
        for(var j = 0 ; j < Players[IDs[i]].tentacles.length ; j++) { 
            Players[IDs[i]].tentacles[j].Draw(elements.ctx , camera.xView , camera.yView) ;
        }
        Players[IDs[i]].Draw(elements.ctx , camera.xView , camera.yView) ;
        // console.log(IDs[i] +" , "+socket.id);
    }

    
}
function Update() {
    if(MouseHandler.left) {
        socket.emit("Bind-Tentacle" , MouseHandler.position.x - window.innerWidth/2 , MouseHandler.position.y - window.innerHeight/2) ;
    }
    // Players[socket.id].Rotate( Mathf.LerpAngle(Mathf.RadToAngle(Players[socket.id].Transform.angle) , Players[socket.id].newTransform.angle , __interpolateAngleSpeed * 0.05 , true) );

   // if(isNaN(player.Transform.position.x) || isNaN(player.Transform.position.y)) {
     //   console.log(player.newTransform.position.x);
       // player.Transform.position.x = player.newTransform.position.x ;//+ window.innerWidth/2 ;
       // player.Transform.position.y = player.newTransform.position.y ;//+ window.innerHeight/2 ;
    //}
    for(var i = 0 ; i < IDs.length ; i++) {
        var pos = Vector2.Lerp( Players[IDs[i]].Transform.position  , 
                                Players[IDs[i]].newTransform.position  , 
                                __interpolateMoveSpeed * 0.05);
        Players[IDs[i]].Translate(pos);

        for(var j = 0 ; j < Players[IDs[i]].tentacles.length ; j++) {
            // player.tentacles[i].Move(player.Transform.position , false);
            Players[IDs[i]].tentacles[j].Update(Players[IDs[i]].radius , 
                                                Players[IDs[i]].gravity , 
                                                Players[IDs[i]].wind) ;
        }
    }

    // var pos = Vector2.Lerp(player.Transform.position  , player.newTransform.position  , __interpolateMoveSpeed * 0.05);
    // player.Translate(pos);

   	// for(var i = 0 ; i< player.tentacles.length ; i++) {
    //     // player.tentacles[i].Move(player.Transform.position , false);
    //     player.tentacles[i].Update( player.radius , player.gravity , player.wind) ;
    // }
    for(var i = 0 ; i < IDsFood.length ; i++) {
        Foods[IDsFood[i]].Update() ;
    }
    if(KeyboardHandler.qDOWN) {
        for(var i = 0 ; i < IDs.length ; i++) {
             Players[IDs[i]].AddTentacle(Mathf.RandomFloat(30,90) ,
                Mathf.RandomFloat(0.5,1) ,
                5 , 4);
        }
    }
    camera.Update();

    MouseHandler.Reset() ;
    KeyboardHandler.Reset() ;

}
function Debug(ctx , x , y , xView , yView) {
    // Debug.Log
    x = x - xView ;
    y = y - yView ;

    ctx.save() ;
    ctx.setTransform(1, 0 , 0 , 1 , x , y);
    ctx.beginPath() ;
    // ctx.arc(0,0,36,0,2*Math.PI,false);
    for(var i = 0 ; i < 360 ; i++) {
        var angle = i * Math.PI /180 ;
        var x1 = Math.sin(angle)*debugData.totalLengthBound  ;
        var y1 = Math.cos(angle)*debugData.wideLengthMultiplier ;
        ctx.lineTo(x1,y1);  
    }
    // console.log(debugData.wideLengthMultiplier);
    ctx.closePath() ;
    ctx.stroke() ;
    ctx.beginPath();
    ctx.moveTo(0,0); 
    ctx.lineTo(debugData.maxBoundX,debugData.maxBoundY);
    ctx.closePath();
    ctx.stroke() ;
    ctx.restore() ;
}
  // canvas.width = this.width;
    // canvas.height = this.height ;
    // canvas.style.display = "none" ;
    // canvas.style.width = "0px" ;
    // canvas.style.height = "0px" ;
    // document.removeChild(canvas);
    // elements.ctx = canvas.getContext("2d");
    // document.body.appendChild(canvas);
    // elements.canvas = canvas ;

      // ctx.moveTo(centerX1 , centerY1);
    
        // ctx.stroke() ;
        
        // ctx.beginPath() ;

        // ctx.arc(centerX1 ,centerY1 , r , Math.PI * 0.8 , Math.PI * 0.2 ) ;
        // ctx.closePath();
        // ctx.fillStyle = "grey";
        // ctx.fill();
        // ctx.stroke() ;
        // ctx.restore() ;
        // ctx.save() ;

         // ctx.fillRect(x-width/2,y,5,5);
        // ctx.fillRect(x-width/2,y+height/2,5,5);

      
        //ctx.beginPath();

        //ctx.moveTo(this.Transform.position.x + this.Bound.x/2 , this.Transform.position.x + this.Bound.x/2);               // Create a starting point
             // Create a horizontal line
      //  ctx.arcTo(this.Transform.position.x - this.Bound.x/2 -xView, this.Transform.position.x - this.Bound.x/2 -yView , 150, 70, 50);  // Create an arc

        //ctx.stroke();  
        
        // ctx.restore();	
         // ctx.save();
        // ctx.setTransform(angle_cos, angle_sin , -angle_sin*strech , angle_cos*strech , x , y);
        // // ctx.rotate(this.Transform.angle);
        // ctx.beginPath();
        // ctx.arc(0,0,r,0,2*Math.PI);
        // ctx.stroke();
        // ctx.clip();

        // // ctx.rotate(this.Transform.angle);
        // // ctx.setTransform(this.Transform.scale.x,0,0,this.Transform.scale.y + strech,x,y);
        
        // ctx.beginPath();
        // ctx.arc(0,0,r,0,2*Math.PI,false);
        // ctx.fillStyle = "red";
        // ctx.fill();

        // ctx.setTransform(angle_cos , angle_sin , -angle_sin , angle_cos , x , y);
        // // ctx.rotate(this.Transform.angle);
        // ctx.beginPath();
        // ctx.arc(0,-offset,r,0,2*Math.PI,false);
        // ctx.fillStyle = "#f2f2f2";
        // ctx.fill();
        // ctx.lineWidth = 0.5 ;
        // ctx.strokeStyle = "grey";
        // ctx.stroke();

        // ctx.setTransform(angle_cos, angle_sin , -angle_sin*strech , angle_cos*strech , x , y);

        // ctx.beginPath();
        // ctx.arc(0,0,r,0,2*Math.PI,false);
        // ctx.restore();

        // ctx.save();
        // ctx.shadowBlur = 6;
        // ctx.shadowColor = "darkred";

        // ctx.lineWidth = 2;
        // ctx.strokeStyle = "darkred" ;
        // ctx.stroke();
        // ctx.restore();

        

        // ctx.save() ;

        // ctx.translate(x,y);
        // // ctx.rotate(this.Transform.angle) ;
        // ctx.scale(this.Transform.scale.x+0.5,this.Transform.scale.y+0.5);
        // x = 0;
        // y = 0;
        // ctx.beginPath() ;
        // ctx.arc(x,y,r,0,Math.PI * 2 );
        
        // ctx.moveTo(x+r,y-r);
        // ctx.arc(x,y-r-10,r,0,Math.PI*2);
        // ctx.closePath() ;
        
        // ctx.restore();

        // ctx.save();
        // ctx.clip() ;
        
        // ctx.translate(this.Transform.position.x - width/2 - xView,this.Transform.position.y - height/2 - yView);
        // ctx.scale(this.Transform.scale.x,this.Transform.scale.y+0.5);
        
            
        // ctx.beginPath();
        // ctx.moveTo(x+r,y);
        

        // ctx.arc(x,y,r,0,Math.PI * 2);
        // ctx.closePath();
        // ctx.fillStyle = "#f2f2f2";
        // ctx.fill() ;
        // ctx.lineWidth = 2;
        // ctx.stroke() ;
        // ctx.restore() ;

        // // ctx.fillStyle = "cyan";
        // // ctx.fill() ;
        // ctx.lineWidth = 3;
        // ctx.stroke() ;


        // ctx.save() ;
        // ctx.translate(x,y) ;
        // ctx.rotate(this.Transform.angle) ;
        // ctx.scale(this.Transform.scale.x , this.Transform.scale.y+0.5);
        // ctx.beginPath() ;
        // ctx.arc(0,0,r,0,2*Math.PI);
        // ctx.closePath() ;
        // ctx.fillStyle = "cyan" ;
        // ctx.fill() ;
        // ctx.lineWidth = 2;
        // ctx.stroke();
        // ctx.restore() ;

        // ctx.save() ;
        // ctx.clip() ;
        // ctx.translate(x,y);
        // ctx.rotate(this.Transform.angle) ;
        // ctx.scale(this.Transform.scale.x , this.Transform.scale.y);
        // ctx.beginPath();
        // ctx.moveTo(r,-r-10);
        // ctx.arc(0,-r-10,r,0,Math.PI*2);
        // ctx.closePath();
        // ctx.fillStyle = "#f2f2f2";
        // ctx.fill();
        // ctx.shadowBlur = 2;
        // ctx.shadowColor = "black";
        // ctx.lineWidth = 1;
        // ctx.stroke();
        // ctx.restore();
        // ctx.stroke();






        
        // ctx.restore();
        // var pStart = new Vector2(x , y-height/2) ;
        // var p1 = new Vector2(x+width/2 , y-height/2) ;
        // var p2 = new Vector2(x+width/2 , y);

        // var curve = p1.x-pStart.x ;
        
        // var centerX1 = pStart.x  ;
        // var centerY1 = -height*2 ;

        
        

        // ctx.beginPath() ;
        // ctx.moveTo(pStart.x , pStart.y-r);

        // ctx.fillRect(pStart.x , pStart.y-r , 5, 5);

        // ctx.fillRect(x, y , 5, 5);

        // ctx.fillRect(p1.x+r ,p1.y-r  , 5, 5);

        // ctx.arcTo(p1.x+r , p1.y-r , p2.x +r, p2.y , curve);
        
        // ctx.arcTo(p2.x +r , p2.y+height/2 +r , x , y+height/2 +r, curve);

        // ctx.arcTo(x-width/2-r,y+height/2+r,x-width/2-r,y,curve);

        // ctx.arcTo(x-width/2-r,y-height/2-r , x+width/2 ,y-height/2-r,curve);
        // ctx.lineTo(pStart.x,pStart.y-r);
        // ctx.closePath();
        // // ctx.shadowBlur = 10 ;
        // // ctx.shadowColor = "blue";
        // // ctx.fillStyle = "blue";
        // ctx.stroke() ;
        // ctx.fill();


        // ctx.beginPath();
        // ctx.arc(centerX1 ,centerY1+35 , r+15 , Math.PI * 0.8 , Math.PI * 0.2 ) ;
        // ctx.closePath();
        // ctx.shadowBlur = 6 ;
        // ctx.shadowColor= "#blue";
        // ctx.fillStyle = "#f2f2f2";
        // // ctx.fill();
        // ctx.stroke() ;

        // ctx.restore() ;
       	
            // var amp = 10;
        // var startAngle = Mathf.AngleToRad(Mathf.RandomFloat(4 , 45)) ;
        // var angle = 0 ; 
        // for(var i = 0 ; i < length ; i++) {
        //     if(i==0) angle = startAngle ;
        //     else if (i==this.nodes.length -1) {
        //         angle = startAngle - (startAngle + Math.PI*2 - angle)/2 ;  
        //     }
        //     else {
        //         var eta = angle + Mathf.AngleToRad((360 - Mathf.RadToAngle(angle))/(this.nodes.length-i)) ;
        //         angle = Mathf.RandomFloat(angle , eta) + Mathf.AngleToRad(10) ;

        //     }
        //     var x = (this.radius + amp*Math.sin(angle) ) * Math.cos(angle) ;
        //     var y = (this.radius + amp*Math.sin(angle) ) * Math.sin(angle) ;
        //     if(i==0) ctx.moveTo(x,y); //
        //     ctx.lineTo(x, y) ;
            
        // }

          // ctx.beginPath() ;
        // for(var i = 0 ; i < this.nodes.length ; i++) {
        //     ctx.lineTo(this.nodes[i].x , this.nodes[i].y);
        // }


        // var loopLength = this.nodesJoint.length + this.nodesRoot.length ;