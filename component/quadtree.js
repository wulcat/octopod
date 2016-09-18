"use strict";

var Geometry = require("../module/geometry.js") ;

class Quadtree {
    constructor(rect , max_objects , max_levels , level) {
        this.max_objects = max_objects ;
        this.max_levels = max_levels ;

        this.level = level || 0 ;
        this.rect = rect ;

        this.objects = [] ;
        this.nodes = [] ;
    }

    Split() {
        var nextLevel = this.level + 1 ;
        var subWidth = Math.round( this.rect.width / 2) ;
        var subHeight = Math.round( this.rect.height / 2 );
        var x = Math.round( this.rect.x) ;
        var y = Math.round(this.rect.y) ;

        this.nodes[0] = new Quadtree(   
            new Geometry.Rect(x+subWidth,y,subWidth,subHeight) ,
            this.max_objects , 
            this.max_levels, 
            nextLevel) ;

        this.nodes[1] = new Quadtree(   
            new Geometry.Rect(x,y,subWidth,subHeight) ,
            this.max_objects , 
            this.max_levels, 
            nextLevel) ;

        this.nodes[2] = new Quadtree(   
            new Geometry.Rect(x,y+subHeight,subWidth,subHeight) ,
            this.max_objects , 
            this.max_levels, 
            nextLevel) ;

        this.nodes[3] = new Quadtree(   
            new Geometry.Rect(x+subWidth,y+subHeight,subWidth,subHeight) ,
            this.max_objects , 
            this.max_levels, 
            nextLevel) ;
    }

    getIndex(player , camera) {
        var index = -1 ;
		// var	verticalMidpoint 	= this.rect.x + (this.rect.width / 2) ;
		var	verticalMidpoint 	= this.rect.x + (this.rect.width / 2) ;
		var	horizontalMidpoint 	= this.rect.y + (this.rect.height / 2) ;
		
		if(camera) {
			var topQuadrant = (player.Camera.y < horizontalMidpoint && player.Camera.y < horizontalMidpoint) ;

				
				//rect can completely fit within the bottom quadrants
			var bottomQuadrant = (player.Camera.y+player.Camera.height > horizontalMidpoint);
			
			//rect can completely fit within the left quadrants
			if( player.Camera.x < verticalMidpoint && player.Camera.x + player.Camera.width < verticalMidpoint ) {
				if( topQuadrant ) {
					index = 1;
				} else if( bottomQuadrant ) {
					index = 2;
				}
				
			//rect can completely fit within the right quadrants	
			} else if( player.Camera.x > verticalMidpoint ) {
				if( topQuadrant ) {
					index = 0;
				} else if( bottomQuadrant ) {
					index = 3;
				}
			}
		}
		else {
			//rect can completely fit within the top quadrants
			var topQuadrant = (player.Transform.position.y-player.Transform.scale.y/2 < horizontalMidpoint && player.Transform.position.y + player.Transform.scale/2 < horizontalMidpoint) ;
			// var topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint) ;
				
				//rect can completely fit within the bottom quadrants
			var bottomQuadrant = (player.Transform.position.y+player.Transform.scale.y > horizontalMidpoint);
			
			//rect can completely fit within the left quadrants
			if( player.Transform.position.x - player.Transform.scale.x/2 < verticalMidpoint && player.Transform.position.x + player.Transform.scale.x/2 < verticalMidpoint ) {
				if( topQuadrant ) {
					index = 1;
				} else if( bottomQuadrant ) {
					index = 2;
				}
				
			//rect can completely fit within the right quadrants	
			} else if( player.Transform.position.x - player.Transform.scale.x/2 > verticalMidpoint ) {
				if( topQuadrant ) {
					index = 0;
				} else if( bottomQuadrant ) {
					index = 3;
				}
			}
		}
	 
		return index;
    }

    Insert(player) { //player with transform
        var i = 0 ;
        var index ;
	 	
	 	//if we have subnodes ...
		if( typeof this.nodes[0] !== 'undefined' ) {
			index = getIndex( player );
	 
		  	if( index !== -1 ) {
				this.nodes[index].Insert( player );	 
			 	return;
			}
		}
	 
	 	this.objects.push( player );
		
		if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
			
			//split if we don't already have subnodes
			if( typeof this.nodes[0] === 'undefined' ) {
				Split();
			}
			
			//add all objects to there corresponding subnodes
			while( i < this.objects.length ) {
				
				index = getIndex( this.objects[ i ] );
				
				if( index !== -1 ) {					
					this.nodes[index].Insert( this.objects.splice(i, 1)[0] );
				} else {
					i = i + 1;
			 	}
		 	}
		}
    }

    Retrieve(player , camera) {
        var index = this.getIndex( player , camera) ;
		var	returnObjects = this.objects ;
		// console.log(this.objects);
		// console.log("returned objects - "+returnObjects);
		//if we have subnodes ...
		if( typeof this.nodes[0] !== 'undefined' ) {
			
			//if rect fits into a subnode ..
			if( index !== -1 ) {
				returnObjects = returnObjects.concat( this.nodes[index].Retrieve( player  , camera) );
				
			//if rect does not fit into a subnode, check it against all subnodes
			} else {
				for( var i=0; i < this.nodes.length; i=i+1 ) {
					returnObjects = returnObjects.concat( this.nodes[i].Retrieve( player , camera) );
				}
			}
		}
		return returnObjects ;
    }
    Clear() {
        this.objects = [];
	 
		for( var i=0; i < this.nodes.length; i=i+1 ) {
			if( typeof this.nodes[i] !== 'undefined' ) {
				this.nodes[i].Clear();
		  	}
		}
		this.nodes = [];
    }
}

module.exports = Quadtree ;