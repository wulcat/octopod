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
class NodeIK {
    constructor(x,y) {
        this.x = this.ox = x || 0 ;
        this.y = this.oy = y || 0 ;

        this.vx = 0 ;
        this.vy = 0 ;
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
        this.control_contatiner ;
        this.ad_container ;
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
            this.nodes.push(new NodeIK());
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
        // var node = new NodeIK() ;
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
            if(player.newTransform.position.x > node.x) {
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

            if(node.y > player.newTransform.position.y) {
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
    constructor(bound , position , scale , angle ) {
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

class Mouse {
    constructor(canvas) {
        this.position = new Vector2() ;
        this.left = false ;
        this.leftDOWN = false ;
        this.leftUP = false ;
        var t = this ;
        canvas.addEventListener("mousemove" , function(event) {
            t.position = t.calcMouseAxis(event) ;
        });
        canvas.addEventListener("mousedown" , function() {
            t.leftDOWN = true ;
            t.left = true ;
        });
        canvas.addEventListener("mouseup" , function() {
            t.leftUP = true ;
            t.left = false ;
        });

    }
    calcMouseAxis(event) {
        return new Vector2(event.clientX , event.clientY) ;
    }
    Reset() {
        this.leftDOWN = false ;
        this.leftUP = false ;
    }
}

class Food {
    constructor(position , scale , radius , shear) {
        this.position = position || new Vector2() ;
        this.scale = scale || new Vector2() ;

        this.radius = radius || 0 ;
        this.nodes = [] ;
        for(var i = 0 ; i < shear ; i++) {
            this.nodes.push(new NodeIK());
        }
    }
    Update() {
        var node , prev , s ;
        s = this.nodes.length;
        for(var i = 0 ; i < s; i ++) {
            node = this.nodes[i] ;
            // var r = Mathf.RandomFloat(10,this.radius) ;
            var x = this.radius * Math.cos(Mathf.AngleToRad(i*360/s)) ;
            var y = this.radius * Math.sin(Mathf.AngleToRad(i*360/s)) ;
            // var x = cx+(radius+amplitude*Math.cos(sineCount*angle))*Math.cos(angle);
            // var y = cy+(radius+amplitude*Math.cos(sineCount*angle))*Math.sin(angle);

            node.x = x ;
            node.y = y ;

            // node.x += Math.sin(Mathf.AngleToRad(i*this.nodes.length)) ;
            // node.y += Math.sin(Mathf.AngleToRad(i*this.nodes.length)) ;

            prev = node ;
        }
        // this.nodes[s] = this.radius * Math.cos(Mathf.AngleToRad(360)) ;
        // this.nodes[s] = this.radius * Math.sin(Mathf.AngleToRad(360)) ;
    }
    Draw(ctx , xView , yView) {
        // var r = Mathf.RandomFloat(2,this.radius) ;
        

        var angle_sin = Math.sin(0) * this.scale.x;
        var angle_cos = Math.cos(0) * this.scale.y;
        
        ctx.save() ;
        ctx.setTransform(angle_cos, angle_sin , -angle_sin , angle_cos , this.position.x - xView , this.position.y - yView) ;
        ctx.beginPath() ;

        // var s = [] ;
        // var l = this.nodes.length * 2 ;
        // for(var i = 0 , j = 0; i < l ; i++) {
        //     if(i%2 ==0)
        //         s.push(this.nodes[j].x);
        //     else {
        //         s.push(this.nodes[j].y);
        //         j++ ;
        //     }
        // }
        // Drawf.Curve(ctx , s , 0.7 , 15 , false);

        var c = 0 ;
        var m = [] ;
        var t = 10 ;
        var r = 105 ;
        var s = 4 ;
        var st = Mathf.RandomFloat(0,360);
        for(var i = 0 ; i < t ; i++) {
            var d = 0 ;
            var g = (360-c) / (t-i) ;
            // while(d < 20) {
                d = Mathf.RandomFloat( (r/t)*2 , (360-c)/(t-i) ) ;
                
            // }
            // d ;
            // if(c+d > 360) break ;

            // console.log(c+d);
            // }
            // var c = d ;
            // while (d > 360/t)
                // d = Mathf.RandomFloat(c , 360) ;
            // var c = d ; 
            // m.push(c) ;
            c += d ;
            
            var x = r*Math.cos(Mathf.AngleToRad(c+st)) ;
            var y = r*Math.sin(Mathf.AngleToRad(c+st)) ;

            ctx.fillRect(x , y , s , s);
            s++ ;
            console.log("c:"+c+" d:"+d+" s:"+s+" g:"+g);
        }

        
        ctx.closePath();
        // Drawf.CurveThroughPoints(ctx , this.nodes , 0 , 0);

        // ctx.closePath();
        // var r = 0 ;
        // for(var i = 0 ; i < 360 ; i++) {
        //     if(i%20 == 0) r = Mathf.RandomFloat(10,this.radius) ;
        //     var x = r * Math.cos(Mathf.AngleToRad(i));
        //     var y = r * Math.sin(Mathf.AngleToRad(i)); 
        //     Drawf.CurveThroughPoints(ctx , )
        // }

        // for(var i = 0 ; i < 360 ; i++) {
        //     var r = Mathf.RandomFloat(2,this.radius) ;
        //     var x = r * Math.cos(Mathf.AngleToRad(i));
        //     var y = r * Math.sin(Mathf.AngleToRad(i)); 
        //     ctx.lineTo(x,y);
        // }
        // ctx.arc(0 , 0 , 70 , 0 , 2*Math.PI , true);
        // ctx.fillStyle = "green" ;
        ctx.stroke();
        // ctx.fill();
        ctx.restore() ;
    }
}

//___________________________________________________________________ Classes
var intervals = new Intervals() ;
var elements = new Elements() ;
var MouseHandler ;
elements.control_contatiner = document.getElementById("control-contatiner") ; 

var socket ;
var isConnected = false ;
var isInit = false ;
var loaded = false ;

var camera ;
var room ;

function Start() {
    if(loaded) {
        if(!isInit) {
            socket = io.connect() ;
            Init() ;
            isInit = true ;

            clearInterval(intervals.preUpdate);
            intervals.loading = setInterval(Loading , 20) ;
            // isConnected = true ;
        }
        else if(isConnected) {
            socket.connect() ;
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
    socket.on('start' , function(data) {
        elements.control_contatiner.style.display = "none" ;
        clearInterval(intervals.loading);
        // intervals.update = setInterval(Frame , 1000/30);
        intervals.update = setInterval(Frame , 1000);
        // intervals.Add(ClearCanvas , 500);
        intervals.send = setInterval(Send , 200) ;
    });
    socket.on('end' , function() {
        clearInterval(intervals.send) ;
        elements.control_contatiner.style.display = "flex" ;
        isConnected = false ;
    });
    socket.on('stop') , function() {
        clearInterval(intervals.send) ;
        socket.disconnect() ;
        celements.ontrol_contatiner.style.display = "flex" ;
        isConnected = false ;
    }
    socket.on('Direction' , function(angle , position) {
        player.newTransform.angle = angle ;
        position.x += elements.canvas.width ;
        position.y += elements.canvas.height ;
        player.newTransform.position = position ;
    });
}
function Send() {
    socket.emit('MouseUpdate' , MouseHandler.position.x - window.innerWidth/2 ,  MouseHandler.position.y - window.innerHeight/2);
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

    room.map.Draw(ctx , camera.xView , camera.yView);
}


window.onload = function() {

    var canvas = document.getElementById("game" );
    var ctx = canvas.getContext("2d");
    canvas.style.display = "flex" ;

    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;

    MouseHandler = new Mouse(canvas);
    elements.canvas = canvas ;
    elements.ctx = ctx ;

    var FPS =30 ;
    var INTERVAL = 1000/FPS ;
    var STEP = INTERVAL/1000 ;

    room = {
        width : 2000 ,
        height : 2000 ,
        map : new Map(2000, 2000)
    };

    room.map.Generate() ;

    camera = new Camera(0,0, canvas.width , canvas.height , room.width , room.height);

    player = new Body(new Vector2(50,50) , new Vector2(elements.canvas.width/2,elements.canvas.height/2) , new Vector2(1,1), 0) ;
    
    var food = new Food(new Vector2(500 , 500) , new Vector2(1,1) , 35 , 20);
    foods.push(food);
    camera.Target(player.Transform.position , canvas.width/2 , canvas.height/2);

    camera.Update() ;
    
    ctx.clearRect(0 , 0 , canvas.width , canvas.height) ;
    room.map.Draw(ctx , camera.xView , camera.yView);
    
    loaded = true ;

    intervals.preUpdate = setInterval(PreUpdate , INTERVAL);
}
var player ;
var foods = [] ;

function PreUpdate() {
    // elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);
    room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
}

function Loading() {
    elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);

}

function Frame() {
    Update() ;
    Draw() ;
}

var __interpolateMoveSpeed = 1.2 ;
var __interpolateAngleSpeed = 2.5 ;

function Draw() {

    camera.Update();

    room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
    
    for(var i = 0 ; i < foods.length ; i++) {
        foods[i].Draw(elements.ctx , camera.xView , camera.yView) ;
    }

    for(var i=0 ; i < player.tentacles.length ;i++) {
        player.tentacles[i].Draw(elements.ctx , camera.xView , camera.yView) ;
    }
    player.Draw(elements.ctx , camera.xView , camera.yView) ;

    
}
function Update() {
    // player.Rotate( Mathf.LerpAngle(Mathf.RadToAngle(player.Transform.angle) , player.newTransform.angle , __interpolateAngleSpeed * 0.05 , true) );

   // if(isNaN(player.Transform.position.x) || isNaN(player.Transform.position.y)) {
     //   console.log(player.newTransform.position.x);
       // player.Transform.position.x = player.newTransform.position.x ;//+ window.innerWidth/2 ;
       // player.Transform.position.y = player.newTransform.position.y ;//+ window.innerHeight/2 ;
    //}

    var pos = Vector2.Lerp(player.Transform.position  , player.newTransform.position  , __interpolateMoveSpeed * 0.05);
    // player.Translate(pos);

   	for(var i = 0 ; i< player.tentacles.length ; i++) {
        // player.tentacles[i].Move(player.Transform.position , false);
        player.tentacles[i].Update( player.radius , player.gravity , player.wind) ;
    }
    for(var i = 0 ; i < foods.length ; i++) {
        foods[i].Update() ;
    }
    MouseHandler.Reset() ;
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
       	