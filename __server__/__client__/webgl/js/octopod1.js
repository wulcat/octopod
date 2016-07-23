/// <reference path="../typings/phaser.d.ts" />
"use strict";
document.body.oncontextmenu = function() {return false ;} ;
// document.body.onmousedown = function() {};
// pingpong
var game ;
var player ;
var newRotation = 0 ;
var newPosition = {} ;
var food = [] ;


// var c ; 
var ctx ;
class Setting {
    constructor(length , radius , gravity , wind , friction) {
        this.length = length ;
        this.radius = radius ;
        this.gravity = gravity ;
        this.wind = wind ;
        this.friction = friction ;
    }
}
class Node {
    constructor(x,y) {
        this.x = this.ox = x || 0 ;
        this.y = this.oy = y || 0 ;
        this.vx = 0 ;
        this.vy = 0 ;
    }
}
class Tentacle {
    constructor(length , radius , spacing , friction) {
        this.length = length ;
        this.radius = radius ;
        this.spacing = spacing ;
        this.friction = friction ;

        this.nodes = [] ;

        for(var i = 0 ; i < this.length ; i++) {
            this.nodes.push(new Node()) ;
        }
    }
    translate(x,y) {
        this.nodes[0].x = x ;
        this.nodes[0].y = y ;
    }
    update(radii , _length , _friction , _wind , _gravity) {
        var i ;
        var j ;
        var s ;
        var c ;
        var dx ;
        var dy ;
        var da ;
        var px ;
        var py ;
        var node ;
        var prev = this.nodes[0] ;

        radii = this.radius * radii ;
        var step = radii/this.length ;

        for(i=1,j=0;i < this.length ;i++,j++){
            node = this.nodes[i] ;
            node.x += node.vx ;
            node.y += node.vy ;

            dx = prev.x - node.x ;
            dy = prev.y - node.y ;
            da = Math.atan2(dy , dx) ;

            px = node.x+Math.cos(da) * this.spacing * _length ;
            py = node.y+Math.sin(da) * this.spacing * _length ;

            node.x = prev.x - (px - node.x) ;
            node.y = prev.y - (py - node.y) ;

            node.vx = node.x - node.ox ;
            node.vy = node.y - node.oy ;

            node.vx *= this.friction * (1-_friction) ;
            node.vy *= this.friction * (1-_friction) ;

            node.vx += _wind ;
            node.vy += _gravity ;

            node.ox = node.x ;
            node.oy = node.y ;

            s = Math.sin(da+1.5707) ;
            c = Math.cos(da+1.5707) ;

            radii -= step ;
            prev = node ;
        }
    }

}
var RootTentacle = new Setting(10 , 3 , 0 , 0 , 0.02) ;
var Tentacles = new Tentacle(20 , 2 , 0.5 , 0.2) ;

// var PreviousRotation = 0 ;
window.onload = function() {
    game = new Phaser.Game(1024  , 768 , Phaser.AUTO , '' , {   preload : preload ,
                                                                create : create ,
                                                                update : update ,
                                                                render : render
                                                            });

    var KEYBOARD ;
    var __interpolateAngleSpeed = 1.5 ;
    var __interpolateMoveSpeed = 1.5 ;

    
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE ;
        game.time.advancedTiming = true; /** */
        KEYBOARD = game.input.keyboard.createCursorKeys() ;

        game.load.image("demo_head_1" , "webgl/res/sprite/demo/Head_1.png");
        game.load.image("demo_food_1" , "webgl/res/sprite/demo/icon16.png");
    }
    // var graphics;
    // var newPart ;
    function create() {
        
        player = game.add.sprite( 0 + window.innerWidth/2 , 0 + window.innerHeight/2 , "demo_head_1" );
        player.scale.setTo(player.scale.x/4 , player.scale.y/4);
        player.anchor.set(0.5);

        for(var i = 0 ; i < 500 ; i++) {     
            var posX = Math.floor(Math.random() * (4096 - 0 + 1)) + 0;
            var posY = Math.floor(Math.random() * (4096 - 0 + 1)) + 0;
            var newFood = game.add.sprite(posX , posY , "demo_food_1") ;
            food.push(newFood);
        }
        game.world.setBounds(0, 0, 4096, 4096);
        game.camera.follow(player);
        
        // newPart = player.addChild(game.add.sprite(window.innerWidth/2 , window.innerHeight/2  , "demo_head_1")) ;
        // newPart.scale.setTo(newPart.scale.x/4 , newPart.scale.y/4);
        // newPart.anchor.set(0.5);
        // var x = player.position.x + (newPart.position.x  - player.position.x)*Math.cos(30) - (newPart.position.y  - player.position.y)*Math.sin(30) ; ;
        // var y = player.position.x + (newPart.position.x  - player.position.x)*Math.sin(30) + (newPart.position.y  - player.position.y)*Math.cos(30) ; 
        // newPart.position.x = x ;
        // newPart.position.y = y ;
        // Tentacles.translate(400 , 400);
        // graphics = game.add.graphics(0, 0);
        // var c = document.getElementById("Canvas");
        // var c = Phaser.Canvas ;
        // c.
        game.canvas.id = "Octopod" ;
        var cd = document.getElementById("Octopod") ;
        ctx= cd.getContext("2d");
        cd.
        console.log(ctx) ;
        // console.log(c);
        // game.canvas.id = 'foobar';
        // console.log(game);
  
    }
    
    function update() {
        if(!isConnected) return ;
        
        // if(isNaN(newPart.position.x) || isNaN(newPart.position.y)) {
        //     newPart.position.x = player.position.x ;
        //     newPart.position.y = player.position.y ;   
        // }
        // else {
        //     // newPart.position.x = Math.abs( Math.abs(player.position.x) - Math.abs(newPart.position.x) ) + player.position.x ;
        //     // newPart.position.y = Math.abs( Math.abs(player.position.y) - Math.abs(newPart.position.y) ) + player.position.y ;
        //     var x = 0 + (newPart.position.x  - 0 )*Math.cos(30) - (newPart.position.y  - 0 )*Math.sin(30) ;
        //     var y = 0+ (newPart.position.x  - 0)*Math.sin(30) + (newPart.position.y  - 0)*Math.cos(30) ;
        //     // console.log(player.position.x , newPart.position.x); 
        //     newPart.position.x = x ;
        //     newPart.position.y = y ;
        // }
        player.rotation = ( LerpAngle(player.rotation*180/Math.PI , newRotation , __interpolateAngleSpeed * 0.05) * Math.PI/180 );
        if(isNaN(player.position.x) || isNaN(player.position.y)) {
            player.position.x = newPosition.x + window.innerWidth/2 ;
            player.position.y = newPosition.y + window.innerHeight/2 ;
        }
        else {
            player.position.x = Phaser.Math.linear(player.position.x , newPosition.x + window.innerWidth/2 , __interpolateMoveSpeed * 0.05) ;
            player.position.y = Phaser.Math.linear(player.position.y , newPosition.y + window.innerHeight/2 , __interpolateMoveSpeed * 0.05) ;
        }

        Tentacles.update(RootTentacle.radius , RootTentacle.length , RootTentacle.friction , RootTentacle.wind , RootTentacle.gravity);


        // graphics.beginFill(0xFF3300);
        // graphics.lineStyle(10, 0xffd900, 1);
    
        // graphics.moveTo(0,0);
        // for(var i=0 ; i < Tentacles.nodes.length - 2 ; i++) {
        //     // console.log(Tentacles.nodes[i].x) ;
        //     graphics.quadraticCurveTo(Tentacles.nodes[i].x , Tentacles.nodes[i].y , Tentacles.nodes[i+1].x ,Tentacles.nodes[i+1].y);
        // }

        // graphics.endFill();

        ctx.moveTo(Tentacles.nodes[0].x, Tentacles.nodes[0].y);

        var i = 1 ;
        for (i = 1; i < points.length - 2; i ++)
        {
            var xc = (Tentacles.nodes[i].x + Tentacles.nodes[i + 1].x) / 2;
            var yc = (Tentacles.nodes[i].y + Tentacles.nodes[i + 1].y) / 2;
            ctx.quadraticCurveTo(Tentacles.nodes[i].x, Tentacles.nodes[i].y, xc, yc);
        }
        // curve through the last two points
        ctx.quadraticCurveTo(Tentacles.nodes[i].x, Tentacles.nodes[i].y, Tentacles.nodes[i+1].x,Tentacles.nodes[i+1].y);
    }
        
    function render() {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        game.debug.cameraInfo(game.camera, 32, 32);
        // game.debug.spriteCoords(newPart, 32, 500);
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


};


      // player.body.allowRotation = false;
        // player.body.allowRotation = false ;
        // game.physics.arcade.enable(player);
        // player.body.gravity.y = 10; 
        // player.body.bounce.y = 0.2;
        // player.body.collideWorldBounds = true;
        // socket = io.connect() ;
        // sendUpdate = setInterval(socket_MouseUpdate , 200) ;
  // game.anchor.setTo(0.5 , 0.5);
        // game.physics.startSystem(Phaser.Physics.ARCADE);

// if(KEYBOARD.left.isDown) {
        //     console.log("pressing left") ;
        // }
        // if(KEYBOARD.right.isDown) {
        //     socket.disconnect() ;
        // }

        // if(game.input.activePointer.leftButton.isDown) {
        //     ds += 1000;
        // }
        // game.physics.arcade.moveToPointer(player, 300);23
        // for(var i = 0; i< ds ; i++) {
        //     move (  game.input.activePointer.x - window.innerWidth/2 ,
        //             game.input.activePointer.y - window.innerHeight/2 ,
        //             1 , false);
        // }

        // move (  game.input.activePointer.x - window.innerWidth/2 ,
        //         game.input.activePointer.y - window.innerHeight/2 ,
        //         1 , true);

    
    // var totalUpdates = 0;
    // var ds = 10000 ;
    // var jerk = 5 ;
    // var jerkBoost = 0.1;
    // var rotSpeed = 0.5 ;
    // function move(x,y,speed , bool) {


    //     if(jerk > 5) {
    //         jerkBoost = - Math.abs(jerkBoost);
    //     }
    //     else if(jerk < 0.7) {
    //         jerkBoost = Math.abs(jerkBoost);
    //     }
    //     jerk += jerkBoost ;
    //     var _speed = speed * jerk ;

    //     if(jerk <2) {
    //         rotSpeed = 1 ;
    //     }
    //     else {
    //         rotSpeed = 0.4 ;
    //     }
    //     var __angle = Math.atan2(x,-y) ;
    //     var newAngle = LerpAngle(player.rotation*180/Math.PI , __angle*180/Math.PI  , rotSpeed * 0.05) * Math.PI/180 ;


    //     player.rotation = newAngle ;
    //     var x =  (Math.cos(newAngle - 1.573) * _speed) ;
    //     var y = (Math.sin(newAngle - 1.573) * _speed) ;

    //     player.position.x += x;

    //     player.position.y += y;
    // }
    // function LerpAngleShort(start , end , amount) {
    //     var shortest_angle=( ( ( (end - start) % 180 ) + 270) % 180) + 180;
    //     return shortest_angle * amount;
    // }

    	// wrapper for our game "classes", "methods" and "objects"
	window.Game = {};
	
	// wrapper for "class" Rectangle
	(function(){
		function Rectangle(left, top, width, height){
			this.left = left || 0;
			this.top = top || 0;
            this.width = width || 0;
			this.height = height || 0;
			this.right = this.left + this.width;
			this.bottom = this.top + this.height;
		}
		
		Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
			this.left = left;
            this.top = top;
            this.width = width || this.width;
            this.height = height || this.height
            this.right = (this.left + this.width);
            this.bottom = (this.top + this.height);
		}
		
		Rectangle.prototype.within = function(r) {
			return (r.left <= this.left && 
					r.right >= this.right &&
					r.top <= this.top && 
					r.bottom >= this.bottom);
		}		
		
		Rectangle.prototype.overlaps = function(r) {
			return (this.left < r.right && 
					r.left < this.right && 
					this.top < r.bottom &&
					r.top < this.bottom);
		}

		// add "class" Rectangle to our Game object
		Game.Rectangle = Rectangle;
	})();	

	// wrapper for "class" Camera (avoid global objects)
	(function(){
	
		// possibles axis to move the camera
		var AXIS = {
			NONE: "none", 
			HORIZONTAL: "horizontal", 
			VERTICAL: "vertical", 
			BOTH: "both"
		};

		// Camera constructor
		function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
		{
			// position of camera (left-top coordinate)
			this.xView = xView || 0;
			this.yView = yView || 0;
			
			// distance from followed object to border before camera starts move
			this.xDeadZone = 0; // min distance to horizontal borders
			this.yDeadZone = 0; // min distance to vertical borders
			
			// viewport dimensions
			this.wView = canvasWidth;
			this.hView = canvasHeight;			
			
			// allow camera to move in vertical and horizontal axis
			this.axis = AXIS.BOTH;	
		
			// object that should be followed
			this.followed = null;
			
			// rectangle that represents the viewport
			this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);				
								
			// rectangle that represents the world's boundary (room's boundary)
			this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);
			
		}

		// gameObject needs to have "x" and "y" properties (as world(or room) position)
		Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone)
		{		
			this.followed = gameObject;	
			this.xDeadZone = xDeadZone;
			this.yDeadZone = yDeadZone;
		}					
		
		Camera.prototype.update = function()
		{
			// keep following the player (or other desired object)
			if(this.followed != null)
			{		
				if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
				{		
					// moves camera on horizontal axis based on followed object position
					if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
						this.xView = this.followed.x - (this.wView - this.xDeadZone);
					else if(this.followed.x  - this.xDeadZone < this.xView)
						this.xView = this.followed.x  - this.xDeadZone;
					
				}
				if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
				{
					// moves camera on vertical axis based on followed object position
					if(this.followed.y - this.yView + this.yDeadZone > this.hView)
						this.yView = this.followed.y - (this.hView - this.yDeadZone);
					else if(this.followed.y - this.yDeadZone < this.yView)
						this.yView = this.followed.y - this.yDeadZone;
				}						
				
			}		
			
			// update viewportRect
			this.viewportRect.set(this.xView, this.yView);
			
			// don't let camera leaves the world's boundary
			if(!this.viewportRect.within(this.worldRect))
			{
				if(this.viewportRect.left < this.worldRect.left)
					this.xView = this.worldRect.left;
				if(this.viewportRect.top < this.worldRect.top)					
					this.yView = this.worldRect.top;
				if(this.viewportRect.right > this.worldRect.right)
					this.xView = this.worldRect.right - this.wView;
				if(this.viewportRect.bottom > this.worldRect.bottom)					
					this.yView = this.worldRect.bottom - this.hView;
			}
			
		}	
		
		// add "class" Camera to our Game object
		Game.Camera = Camera;
		
	})();

	// wrapper for "class" Player
	(function(){
		function Player(x, y){
			// (x, y) = center of object
			// ATTENTION:
			// it represents the player position on the world(room), not the canvas position
			this.x = x;
			this.y = y;				
			
			// move speed in pixels per second
			this.speed = 200;		
			
			// render properties
			this.width = 50;
			this.height = 50;
		}
		
		Player.prototype.update = function(step, worldWidth, worldHeight){
			// parameter step is the time between frames ( in seconds )
			
			// check controls and move the player accordingly
			if(Game.controls.left)
				this.x -= this.speed * step;
			if(Game.controls.up)
				this.y -= this.speed * step;
			if(Game.controls.right)
				this.x += this.speed * step;
			if(Game.controls.down)
				this.y += this.speed * step;		
			
			// don't let player leaves the world's boundary
			if(this.x - this.width/2 < 0){
				this.x = this.width/2;
			}
			if(this.y - this.height/2 < 0){
				this.y = this.height/2;
			}
			if(this.x + this.width/2 > worldWidth){
				this.x = worldWidth - this.width/2;
			}
			if(this.y + this.height/2 > worldHeight){
				this.y = worldHeight - this.height/2;
			}
		}
		
		Player.prototype.draw = function(context, xView, yView){		
			// draw a simple rectangle shape as our player model
			context.save();		
			context.fillStyle = "black";
			// before draw we need to convert player world's position to canvas position			
			context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
			context.restore();			
		}
		
		// add "class" Player to our Game object
		Game.Player = Player;
		
	})();

	// wrapper for "class" Map
	(function(){
		function Map(width, height){
			// map dimensions
			this.width = width;
			this.height = height;
			
			// map texture
			this.image = null;
		}
		
		// generate an example of a large map
		Map.prototype.generate = function(){
			var ctx = document.createElement("canvas").getContext("2d");		
			ctx.canvas.width = this.width;
			ctx.canvas.height = this.height;		
			
			var rows = ~~(this.width/44) + 1;
			var columns = ~~(this.height/44) + 1;
			
			var color = "red";				
			ctx.save();			
			ctx.fillStyle = "red";		    
			for (var x = 0, i = 0; i < rows; x+=44, i++) {
				ctx.beginPath();			
				for (var y = 0, j=0; j < columns; y+=44, j++) {            
					ctx.rect (x, y, 40, 40);				
				}
				color = (color == "red" ? "blue" : "red");
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();			
			}		
			ctx.restore();	
			
			// store the generate map as this image texture
			this.image = new Image();
			this.image.src = ctx.canvas.toDataURL("image/png");					
			
			// clear context
			ctx = null;
		}
		
		// draw the map adjusted to camera
		Map.prototype.draw = function(context, xView, yView){					
			// easiest way: draw the entire map changing only the destination coordinate in canvas
			// canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
			//context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
			
			// didactic way:
			
			var sx, sy, dx, dy;
            var sWidth, sHeight, dWidth, dHeight;
			
			// offset point to crop the image
			sx = xView;
			sy = yView;
			
			// dimensions of cropped image			
			sWidth =  context.canvas.width;
			sHeight = context.canvas.height;

			// if cropped image is smaller than canvas we need to change the source dimensions
			if(this.image.width - sx < sWidth){
				sWidth = this.image.width - sx;
			}
			if(this.image.height - sy < sHeight){
				sHeight = this.image.height - sy; 
			}
			
			// location on canvas to draw the croped image
			dx = 0;
			dy = 0;
			// match destination with source to not scale the image
			dWidth = sWidth;
			dHeight = sHeight;									
			
			context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);			
		}
		
		// add "class" Map to our Game object
		Game.Map = Map;
		
	})();

	// Game Script
	(function(){
		// prepaire our game canvas
		var canvas = document.getElementById("gameCanvas");
		var context = canvas.getContext("2d");

		// game settings:	
		var FPS = 30;
		var INTERVAL = 1000/FPS; // milliseconds
		var STEP = INTERVAL/1000 // seconds
		
		// setup an object that represents the room
		var room = {
			width: 5000,
			height: 3000,
			map: new Game.Map(5000, 3000)
		};
		
		// generate a large image texture for the room
		room.map.generate();
		 
		// setup player
		var player = new Game.Player(50, 50);
		
		// setup the magic camera !!!
		var camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);		
		camera.follow(player, canvas.width/2, canvas.height/2);
		
		// Game update function
		var update = function(){			
			player.update(STEP, room.width, room.height);
			camera.update();
		}
			
		// Game draw function
		var draw = function(){
			// clear the entire canvas
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			// redraw all objects
			room.map.draw(context, camera.xView, camera.yView);		
			player.draw(context, camera.xView, camera.yView);		
		}
		
		// Game Loop
		var gameLoop = function(){        				
			update();
			draw();
		}	
		
		// <-- configure play/pause capabilities:
		
		// I'll use setInterval instead of requestAnimationFrame for compatibility reason,
		// but it's easy to change that.
		
		var runningId = -1;
		
		Game.play = function(){	
			if(runningId == -1){
				runningId = setInterval(function(){
					gameLoop();
				}, INTERVAL);
				console.log("play");
			}
		}
		
		Game.togglePause = function(){		
			if(runningId == -1){
				Game.play();
			}
			else
			{
				clearInterval(runningId);
				runningId = -1;
				console.log("paused");
			}
		}	
		
		// -->
		
	})();

	// <-- configure Game controls:

	Game.controls = {
		left: false,
		up: false,
		right: false,
		down: false,
	};

	window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
			case 37: // left arrow
				Game.controls.left = true;
				break;
			case 38: // up arrow
				Game.controls.up = true;
				break;
			case 39: // right arrow
				Game.controls.right = true;
				break;
			case 40: // down arrow
				Game.controls.down = true;
				break;
		}
	}, false);

	window.addEventListener("keyup", function(e){
		switch(e.keyCode)
		{
			case 37: // left arrow
				Game.controls.left = false;
				break;
			case 38: // up arrow
				Game.controls.up = false;
				break;
			case 39: // right arrow
				Game.controls.right = false;
				break;
			case 40: // down arrow
				Game.controls.down = false;
				break;
			case 80: // key P pauses the game
				Game.togglePause();
				break;		
		}
	}, false);

	// -->

	// start the game when page is loaded
	window.onload = function(){	
		Game.play();
	}