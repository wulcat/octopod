"use strict";

var Vector2 = require("../module/geometry.js").Vector2 ;
var Mathf = require("../module/mathf.js") ;

class Particle {
    constructor(pos) {
        this.pos = pos ;
        this.lastPos = pos ;
    }
}
class PinConstraint {
    constructor(par) {
        this.parent = par ;
        this.pos = new Vector2(0,0);
        this.pos.Renew(par.pos);  
    }
    Relax(stepCoef) {
        this.parent.pos.Renew(this.pos) ;
    }
}
class DistanceConstraint {
    constructor(par1 , par2 , stiffness , distance) {
        this.parent = par1 ;
        this.child = par2 ;

        this.stiffness = stiffness ;
        this.distance = typeof distance != "undefined" ? distance : Vector2.Distance(par1.pos , par2.pos) ;
    }
    Relax(stepCoef) {
        var normal = Vector2.Sub(this.parent.pos , this.child.pos) ;
        var m = Vector2.Square(normal) ;

        normal = Vector2.Scale( normal , 
                                ((this.distance*this.distance - m)/m)*this.stiffness*stepCoef) ;

        this.parent.pos = Vector2.Add(this.parent.pos , normal);
        this.child.pos = Vector2.Sub(this.child.pos , normal);
    }
}
class AngleConstraint {
    constructor(startPar , centerPar , endPar , stiffness) {
        this.start = startPar ;
        this.center = centerPar ;
        this.end = endPar ;
        this.stiffness = stiffness ;

        this.angle = Vector2.AngleBetween2(startPar.pos , centerPar.pos , endPar.pos) ;
    }
    Relax(stepCoef) {
        var angle = Vector2.AngleBetween2(this.start.pos , this.center.pos , this.end.pos) ;
        var diff = angle - this.angle ;

        if(diff <= -Math.PI) 
            diff += 2*Math.PI ;
        else if(diff >= Math.PI)
            diff -= 2*Math.PI ;

        diff *= stepCoef*this.stiffness ;

        this.start.pos = Vector2.Rotate(this.center.pos , this.start.pos , diff);
        this.end.pos = Vector2.Rotate(this.center.pos , this.end.pos , -diff);
        this.center.pos = Vector2.Rotate(this.start.pos, this.center.pos , diff);
        this.center.pos = Vector2.Rotate(this.end.pos, this.center.pos , -diff);
    }
}
class Tentacle {
    constructor(origin , depth , branchLength , segementCoef , theta) {
        this.particles = [] ;
        this.constraints = [] ;

        this.gravity = new Vector2(0,0.2);
        this.friction = 0.99;
        this.groundFriction = 0.8;

        this.origin = origin ;
        this.base = new Particle(origin) ;
        this.root = new Particle(Vector2.Add(origin , new Vector2(0,10)) );

        this.Pin(this.base) ;
        this.Pin(this.root) ;

        var branch = this.CreateConstraint(this.base , 0 , depth , segementCoef , new Vector2(0,-1) , branchLength , theta, 0.7) ;

        this.constraints.push(new AngleConstraint(this.root , this.base , branch , 1) ) ;
    }
    Pin(particle) {
        this.particles.push(particle) ;
        var pc = new PinConstraint(particle , particle.pos) ;
        this.constraints.push(pc) ;
        
        return pc ;
    }
    CreateConstraint(parent , i , nMax , coef , vec_normal , branchLength , theta , lineCoef) {
        var particle = new Particle(Vector2.Add(parent.pos , Vector2.Scale(vec_normal , branchLength*coef) )) ;
        this.particles.push(particle);
    
        var dc = new DistanceConstraint(parent , particle , lineCoef) ;

        this.constraints.push(dc) ;

        if(i < nMax) {
            var a = this.CreateConstraint(  particle ,
                                            i+1 , 
                                            nMax , 
                                            coef*coef , 
                                            Vector2.Rotate(new Vector2(0,0) , vec_normal , -theta),
                                            branchLength , theta , lineCoef);

            var jointStrength = Mathf.Lerp(0.7 , 0 , i/nMax) ;

            this.constraints.push(new AngleConstraint(  parent , 
                                                        particle , 
                                                        a , 
                                                        jointStrength)) ;
        }
        return particle ;
    }
    Update(x1,y1) {
        

        var i , j , particles;
        i=0 ;
        j=0 ;
        particles = this.particles ;

        for(i in particles) {

            var velocity = Vector2.Sub( Vector2.Scale(particles[i].pos , this.friction) , 
                                        particles[i].lastPos) ;

            var velocity = Vector2.Sub(  particles[i].pos , 
                                         particles[i].lastPos) ;

            velocity = Vector2.Scale(velocity , this.friction) ;

            if(particles[i].pos.y >= this.height - 1 && Vector2.Square(velocity) > 0.000001 ) {
                var m = Vector2.Length(velocity) ;
                velocity.x /= m ;
                velocity.y /= m ;
                velocity = Vector2.Scale(velocity , m*this.groundFriction) ;
            }
                particles[i].lastPos.Renew(particles[i].pos) ;
                particles[i].pos.Renew(Vector2.Add(particles[i].pos , this.gravity)) ;
                // particles[i].pos.Renew(Vector2.Add(particles[i].pos , velocity)) ; 
        }

        var steps = 16 ;
        var stepCoef = 1/steps ;
        var constraints = this.constraints ;

        if(x1 && y1)
            this.particles[this.particles.length-1].pos.Renew(new Vector2(x1,y1));

        for(var i = 0 ; i < steps ; ++i) {
            for(j in constraints) {
                constraints[j].Relax(stepCoef) ;
            }
        }

        // this.particles[1].pos.Renew(x1,y1);
        // bounds checking
        // for (i in particles)
        //     this.bounds(particles[i]);
    }
}

module.exports = Tentacle ;