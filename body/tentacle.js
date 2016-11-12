"use strict";

var Vector2 = require("../module/geometry.js").Vector2 ;
var Mathf = require("../module/mathf.js") ;
class Particle {
    constructor(pos) {
        this.pos = pos ;
        this.lastPos = pos ;
    }
}
class AngleConstraint {
    constructor(startPar , centerPar , endPar , stiffness) {
        this.start = startPar ;
        this.center = centerPar ;
        this.end = endPar ;

        this.angle = Vector2.AngleBetween2(startPar.pos , centerPar.pos , endPar.pos) ;

        this.stiffness = stiffness ;
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
class PinConstraint {
    constructor(par) {
        this.parent = par ;
        this.pos = par.pos ;
    }
    Relax(stepCoef) {
        this.parent.pos.Renew(this.pos) ;
        // this.parent.pos.x = pos.x ;
        // this.parent.pos.y = pos.y ;
    }
}
class DistanceConstraint {
    constructor(par1 , par2 , stiffness , distance) {
        this.parent = par1 ;
        this.child = par2 ;

        this.stiffness = stiffness ;
        this.distance = distance || Vector2.Distance(par1 , par2) ;
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
// class Composite {
//     constructor() {
//         this.particles = [] ;
//         this.costraints = [] ;
//     }
// }

class Tentacle {
    constructor(origin , depth , branchLength , segementCoef , theta) {
        this.particles = [] ;
        this.constraints = [] ;

        var lineCoef = 0.7 ;
        // simulation params
        this.gravity = new Vector2(0,0.2);
        this.friction = 0.99;
        this.groundFriction = 0.8;

        this.origin = origin ;
        this.base = new Particle(origin) ;
        this.root = new Particle(Vector2.Add(origin , new Vector2(0,10)) );

        // this.composite = new Composite() ;
        // this.composite.particles.push(this.base) ;
        // this.composite.particles.push(this.root) ;
        // this.composite.pin(0) ;
        // this.composite.pin(1) ;

        this.Pin(this.base) ;
        this.Pin(this.root) ;

        var branch = this.CreateConstraint(this.base , 0 , depth , segementCoef , new Vector2(0,-1) , branchLength , theta, lineCoef) ;

        this.constraints.push(new AngleConstraint(this.root , this.base , branch , 1) ) ;

        // this.composites.push(composite) ;
    }
    Pin(particle) {
        this.particles.push(particle) ;
        var pc = new PinConstraint(particle , particle.pos) ;
        this.constraints.push(pc) ;
        
        return pc ;
    }
    CreateConstraint(parent , i , nMax , coef , vec_normal , branchLength , theta , lineCoef) {
        var m = Vector2.Add(parent.pos , Vector2.Scale(vec_normal , branchLength*coef) );
        var particle = new Particle(m) ;
        this.particles.push(particle);

        var dc = new DistanceConstraint(parent , particle , lineCoef) ;

        this.constraints.push(dc) ;

        if(i < nMax) {
            var a = this.CreateConstraint(  particle ,
                                            i+1 , 
                                            nMax , 
                                            coef*coef , 
                                            Vector2.Rotate(vec_normal , new Vector2(0,0) , -theta));

            var jointStrength = Mathf.Lerp(0.7 , 0 , i/nMax) ;
            this.constraints.push(new AngleConstraint(  parent , 
                                                        particle , 
                                                        a , 
                                                        jointStrength)) ;
        }
        return particle ;
    }
    Update() {
        var i , j , particles;
        i=0 ;
        j=0 ;
        particles = this.particles ;

        for(i in this.particles) {

            var velocity = Vector2.Sub( Vector2.Scale(particles[i].pos , this.friction) , 
                                        particles[i].lastPos) ;

            if(particles[i].pos.y >= this.height - 1 && Vector2.Square(velocity) > 0.000001 ) {
                var m = Vector2.Length(velocity) ;
                velocity.x /= m ;
                velocity.y /= m ;
                velocity = Vector2.Scale(velocity , m*this.groundFriction) ;

                particles[i].lastPos.Renew(particles[i].pos) ;

                particles[i].pos = Vector2.Add(particles[i].pos , this.gravity);

                particles[i].pos = Vector2.Add(particles[i].pos , velocity) ; 
            }
            
            var stepCoef = 1/16 ;

            // if(node)
            //     this.particles[this.particles.length-1].pos.Renew(node) ;

            var constraints = this.constraints ;
            // console.log(constraints);
            for(var i = 0 ; i < 16 ; i++) {
                for(var j = 0 ; j < constraints.length ; j++) {
                    // console.log(constraints[j]);
                    constraints[j].Relax(stepCoef) ;

                }
            }
            // bounds checking
            // for (i in particles)
            //     this.bounds(particles[i]);
        }
    }
}

module.exports = Tentacle ;