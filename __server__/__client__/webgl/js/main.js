"use strict";
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
    }
}
class Vector2 {
    constructor(x,y) {
        this.x = x || 0 ;
        this.y = y || 0 ;
    }
}
class Transform {
    constructor() {
        this.position = new Vector2() ;
        this.size = new Vector2() ;
        this.angle = 0 ;
    }
}
//___________________________________________________________________
class Node {
    constructor(x,y) {
        this.x = this.ox = x || 0 ;
        this.y = this.oy = y || 0 ;

        this.vx = 0 ;
        thix.vy = 0 ;
    }
    get Get() {
        return this.calcGet() ;
    }
    calcGet() {
        return new Vector2(this.x , this.y);
    }
}
//___________________________________________________________________

var AXIS = {
    none : "none" ,
    horizontal : "horizontal" ,
    vertical : "vertical" ,
    both : "both"
};
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

class Camera {
    constructor(xView , yView , canvasWidth , canvasHeight , worldWidth , worldHeight) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        this.xDeadZone = 0 ;
        this.yDeadZone = 0 ;

        this.wView = canvasWidth ;
        this.hView = canvasHeight ;
        
        this.axis = AXIS.both ;

        this.follow = null ;

        this.viewportRect = new Rect(this.xView , this.yView , this.wView , this.hView) ;

        this.worldRect = new Rect(0 , 0 , worldWidth , worldHeight) ;
    }

    Target(position , xDeadZone , yDeadZone) {
        this.follow = position ;
        this.xDeadZone = xDeadZone ;
        this.yDeadZone =yDeadZone ;
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
    constructor(bound , position , size , angle ) {
        this.Transform = new Transform() ;

        this.Transform.position = position || new Vector2(0,0) ;
        this.Transform.size = size || new Vector2(1,1) ;
        this.Transform.angle = angle || 0 ;

        this.Bound = bound || new Vector2(50,50) ;
        this.newTransform = new Transform() ;

    }
    Translate(vec) {
        this.Transform.position.x += vec.x ;
        this.Transform.position.y += vec.y ;
    }
    Rotate(angle) {
        // this.
    }
    Draw(ctx , xView , yView) {
    
        var width = this.Bound.x ;
        var height = this.Bound.y ;
        
      
        var x = this.Transform.position.x - width/2 - xView ;
        var y = this.Transform.position.y - height/2 - yView ;

        var pStart = new Vector2(x , y-height/2) ;
        var p1 = new Vector2(x+width/2 , y-height/2) ;
        var p2 = new Vector2(x+width/2 , y);
        var radius = p1.x-pStart.x ;
        var r = 50 ;
        ctx.save() ;
        ctx.translate(x+width/2,y+height/2);
        ctx.rotate(this.Transform.angle) ;
        
        ctx.beginPath() ;
        // ctx.moveTo(pStart.x , pStart.y-r);

        // ctx.arcTo(p1.x+r , p1.y-r , p2.x +r, p2.y , radius);
        
        // ctx.arcTo(p2.x +r , p2.y+height/2 +r , x , y+height/2 +r, radius);

        // ctx.arcTo(x-width/2-r,y+height/2+r,x-width/2-r,y,radius);

        // ctx.arcTo(x-width/2-r,y-height/2-r , x+width/2 ,y-height/2-r,radius);
        // ctx.lineTo(pStart.x,pStart.y-r);
        // ctx.closePath();
        // ctx.shadowBlur = 20 ;
        // ctx.shadowColor = "blue";
        ctx.fillStyle = "blue";
        ctx.fill();

        ctx.fillRect(-width/2, -height/2, this.Bound.x, this.Bound.y);
        ctx.restore() ;
        // ctx.fillRect(x-width/2,y,5,5);
        // ctx.fillRect(x-width/2,y+height/2,5,5);

      
        //ctx.beginPath();

        //ctx.moveTo(this.Transform.position.x + this.Bound.x/2 , this.Transform.position.x + this.Bound.x/2);               // Create a starting point
             // Create a horizontal line
      //  ctx.arcTo(this.Transform.position.x - this.Bound.x/2 -xView, this.Transform.position.x - this.Bound.x/2 -yView , 150, 70, 50);  // Create an arc

        //ctx.stroke();  
        
        // ctx.restore();		
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
        ctx.strokeStyle="#66ccff";
        ctx.stroke() ;

        this.image = new Image() ;
        this.image.src = ctx.canvas.toDataURL("image/png") ;
        ctx = null ;
    }

    Draw(ctx , xView , yView) {
        ctx.shadowBlur=20;
        ctx.shadowColor="#66ccff";
        ctx.strokeStyle="#66ccff";
        ctx.clearRect( 0 , 0 , elements.canvas.width , elements.canvas.height);
        ctx.drawImage(this.image , xView , yView , elements.canvas.width , elements.canvas.height , 0 ,0 ,elements.canvas.width ,elements.canvas.height);
    }
}

class Mouse {
    constructor(canvas) {
        this.position = new Vector2() ;
        var t = this ;
        canvas.addEventListener("mousemove" , function(event) {
            t.position = t.calcMouseAxis(event) ;
        })
    }
    calcMouseAxis(event) {
        return new Vector2(event.clientX , event.clientY) ;
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
        intervals.update = setInterval(Update , 1000/30);
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
        // var newRotation = angle ;
        player.newTransform.angle = angle ;
        console.log(angle);
        player.newTransform.position = position ;
        // var newPosition = position ;
    });
}
function Send() {
    socket.emit('MouseUpdate' , MouseHandler.position.x - window.innerWidth/2 ,  MouseHandler.position.y - window.innerHeight/2);
}
function ClearCanvas() {
    elements.ctx.clearRect(0,0,elements.canvas.width , elements.canvas.height);
    // room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
}


//___________________________________________________________________



window.onresize = function() {
    // elements.canvas.width = window.innerWidth ;
    // elements.canvas.height = window.innerHeight ;

    var canvas = document.getElementById("game") ;
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;
    var ctx = canvas.getContext("2d") ;
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
        width : 7000 ,
        height : 7000 ,
        map : new Map(7000, 7000)
    };

    room.map.Generate() ;

    camera = new Camera(0,0, canvas.width , canvas.height , room.width , room.height);

    player = new Body(new Vector2(50,50) , new Vector2(100,100)) ;
    camera.Target(player.Transform.position , canvas.width/2 , canvas.height/2);

    camera.Update() ;
    
    ctx.clearRect(0 , 0 , canvas.width , canvas.height) ;
    room.map.Draw(ctx , camera.xView , camera.yView);
    
    loaded = true ;

    intervals.preUpdate = setInterval(PreUpdate , INTERVAL);
}
var player ;

function PreUpdate() {
    // elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);
    room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
}

function Loading() {
    elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height);
}
function Lerp (s,e,t) {
        var ps = 1-t ;
        var pe = t ;
        var r = 0 ;

        r = ps * s + pe * e ;
        return r ;
}
function LerpAngle(start, end , amount)
    {
        var difference = Math.abs(end - start);
        if (difference > 180)
        {
            // We need to add on to one of the values.
            if (end > start)
            {
                // We'll add it on to start...
                start += 360;
            }
            else
            {
                // Add it on to end.
                end += 360;
            }
        }

        // Interpolate it.
        var value = (start + ((end - start) * amount));

        // Wrap it..
        var rangeZero = 360;

        if (value >= 0 && value <= 360)
            return value;

        return (value % rangeZero);
    }

var __interpolateMoveSpeed = 1.5 ;
var __interpolateAngleSpeed = 1.5 ;
var test = true ;
function Update() {
    player.Transform.angle = (LerpAngle(player.Transform.angle * 180/Math.PI , player.newTransform.angle , __interpolateAngleSpeed * 0.05 )* Math.PI/180 );
    
    if(isNaN(player.Transform.position.x) || isNaN(player.Transform.position.y)) {
        // player.Transform.position.x = player.newTransform.position.x + window.innerWidth/2 ;
        // player.Transform.position.y = player.newTransform.position.y + window.innerHeight/2 ;
    }
    else {
        // player.Transform.position.x = Lerp(player.Transform.position.x , player.newTransform.position.x + window.innerWidth/2 , __interpolateMoveSpeed * 0.05) ;
        // player.Transform.position.y = Lerp(player.Transform.position.y , player.newTransform.position.y + window.innerHeight/2 , __interpolateMoveSpeed * 0.05) ;
    }

    // player.Translate(new Vector2(5,5)) ;
    camera.Update();

    room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
    player.Draw(elements.ctx , camera.xView , camera.yView) ;
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