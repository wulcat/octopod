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
    constructor(bound , position , size , rotation ) {
        this.Transform = new Transform() ;
        this.Transform.position = position || new Vector2(0,0) ;
        this.Transform.size = size || new Vector2(1,1) ;
        this.Transform.rotation = rotation || 0 ;
        this.Bound =bound || new Vector2(50,50) ;
        this.newTransform = new Transform() ;
    }
    Translate(vec) {
        this.Transform.position.x += vec.x ;
        this.Transform.position.y += vec.y ;
        console.log(this.Transform.position);
    }
    Draw(ctx , xView , yView) {
        var _position = this.Transform.position ;
        // ctx.save() ;
        // ctx.beginPath)()
        ctx.fillStyle = "black" ;

        ctx.fillRect((_position.x-this.Bound.x/2) - xView, (_position.y-this.Bound.y/2) - yView, this.Bound.x, this.Bound.y);
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
        // canvas.style.display = "none" ;
        canvas.width = this.width ;
        canvas.height = this.height ;
        
        var ctx = canvas.getContext("2d");

        // ctx.canvas.width = this.width ;
        // ctx.canvas.height = this.height ;

        // var rows = ~~(this.width/44) + 1;
        // var columns = ~~(this.height/44) + 1;
        // var rows = 500 ;
        // var columns = 300 ;

        // var color = "black" ;
        // ctx.save() ;
        // ctx.fillStyle = "black" ;

        // ctx.beginPath() ;
        // ctx.rect(0,0,this.width , this.height) ;
        // ctx.fillStyle = color ;
        // ctx.fill() ;
        // ctx.closePath() ;
        
        // for(var x = 0 , i=0 ; i < rows ; x+=44 , i++) {
        //     ctx.beginPath() ;

        //     for(var y = 0 , j=  0 ; j < columns ; y+=44 , j++) {
        //         ctx.rect (x,y,40,40) ;
        //     }
        //     ctx.fillStyle = color ;
        //     ctx.fill() ;
        //     ctx.closePath() ;
        // }
        // var doo = document.getElementById("imgg");

        // ctx.restore() ;
        // ctx.drawImage(doo , this.width , this.height);
        // var ptr = ctx.createPattern(doo , 'repeat') ;
        // ctx.fillStyle = ptr ;
        // ctx.fillRect(0,0,this.width, this.height);
        ctx.shadowBlur=20;
        ctx.shadowColor="#66ccff";
         var bound = 100; 
        var startX = 0  ;
        // var startY = player.Transform.position.y - window.innerHeight /2 - bound ;
        // var startX = 100 ;
        var startY = 0 ;
        var distance = 50 ;
        var length = 100 ;
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
        ctx.strokeStyle="#66ccff";
        ctx.stroke() ;
        
        // ctx.fillStyle = ptr ;
        // ctx.fillRect(0,0,this.width, this.height);

        this.image = new Image() ;
        this.image.src = ctx.canvas.toDataURL("image/png") ;
        // this.image.src = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/game.jpg" ;
        // this.image = ptr ;
        // this.image.width = 5000 ;
        // this.image.height = this.height;
        // console.log(this.image);
        ctx = null ;
    }

    Draw(ctx , xView , yView) {
        // var sx , sy , dx , dy ;
        // var sWidth , sHeight , dWidth , dHeight ;

        // sx = xView ;
        // sy = yView ;

        // sWidth = ctx.canvas.width ;
        // sHeight = ctx.canvas.height ;

        // if(this.image.width - sx < sWidth) {
        //     sWidth = this.image.width - sx ;
        // }
        // if(this.image.height - sy < sHeight) {
        //     sHeight = this.image.height - sy ;
        // }

        // dx = 0 ;
        // dy = 0 ;

        // dWidth = sWidth ;
        // dHeight = sHeight ;
        // ctx.beginPath() ;
        
        // elements.canvas.width = elements.canvas.width ;
        // elements.canvas.height = elements.canvas.height ;
        // var sdf = new Image() ;
        
        ctx.clearRect( 0 , 0 , elements.canvas.width , elements.canvas.height);
      
       
        ctx.drawImage(this.image , xView , yView , elements.canvas.width , elements.canvas.height , 0 ,0 ,elements.canvas.width ,elements.canvas.height);
        // ctx.fill();
        // ctx.drawImage(this.image , sx , sy , sWidth , sHeight , dx , dy , dWidth , dHeight);
         
        
        ctx.stroke();
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
        player.newTransform.rotation = angle ;
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
        width : 5000 ,
        height : 3000 ,
        map : new Map(5000, 3000)
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
var __interpolateMoveSpeed = 2 ;
function Update() {
    
    if(isNaN(player.Transform.position.x) || isNaN(player.Transform.position.y)) {
        player.Transform.position.x = player.newTransform.position.x + window.innerWidth/2 ;
        player.Transform.position.y = player.newTransform.position.y + window.innerHeight/2 ;
    }
    else {
        player.Transform.position.x = Lerp(player.Transform.position.x , player.newTransform.position.x + window.innerWidth/2 , __interpolateMoveSpeed * 0.05) ;
        player.Transform.position.y = Lerp(player.Transform.position.y , player.newTransform.position.y + window.innerHeight/2 , __interpolateMoveSpeed * 0.05) ;
    }
    // player.Translate(new Vector2(5,5)) ;
    
    
    camera.Update();
    room.map.Draw(elements.ctx , camera.xView , camera.yView) ;
    // elements.ctx.clearRect(0 , 0 , elements.canvas.width , elements.canvas.height); 

    
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