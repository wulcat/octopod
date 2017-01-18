/// <reference path="typings/index.d.ts" />
/// <reference path="typings/octopod.d.ts" />
"use strict";

var express = require('express') ;
var app = express() ;
var server = require('http').createServer(app) ;
var fw = require('socket.io')(server) ;

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest ;

var EventEmitter = require('events') ;

var repl = require('repl') ;
var replServer = repl.start('fw> ') ;

var Octopod = require('../module/octopod.js');

// Math.Interpolate = Octopod.Geometry.Math.Interpolate ;
// Math.Quaternion = Octopod.Geometry.Math.Quaternion ;
var port = process.env.PORT || 3000 ;

/**
 * @type {Octopod}
 */
var Players = [] ;

// var Foods = [] ;
var Maps = [] ;


if(port == 3000) {
    app.use(express.static(__dirname + '/__client__')) ;   
}
else {
    app.use(express.static(__dirname + '__server__/__client__')) ;
}

server.listen(port , function() {
    S_Init() ;
   console.log("server started at port %d" , port) ; 
});

function S_Init() {
    // var User = [] ;
    // var Facebook = [] ;

    // Players.push(User) ;
    // Players.push(Facebook) ;

    var Underwater = [] ;
    Maps.push(Underwater) ;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/__client__/webgl/index.html');
});

app.post('/', function (req , res) {
   // res.sendFile(__dirname+ '..__client__/index.html') ; // For facebook canvas
});

function S_Connected(socket) { // Will be trigged after few seconds as player is taking time to init the game
    socket.emit('connected') ;
}
fw.on('connection' , function(socket) {
    console.log("connected : "+socket.id);
    // socket.status = false ;
    // socket.emit('connected') ;
    setTimeout(S_Connected , 1000 , socket);
    // var __player = new Octopod.Body.sPlayer(socket.id , "test") ;
    // Players[socket.id] = __player ;
    // __player.Init(20 , 1 , 5);
    // __player.Start(200) ;

    // Players[socket.id] = __player ;
    // var status = false ;
    // if(!Players[socket.id].status) status = S_Connect(socket,null,null,"Underwater") ;
    
    // if(status) socket.emit('start');

    socket.on('init', function(oath , id , secId) {
        // if(socket.u_id != undefined)  {
            // var id = "3452436";
            // socket.u_id = id ;
            console.log("init : oath-"+oath+" , id-"+id+" , secid-"+secId);

            if(Players["/#"+id] == null) {
                 var __player = new Octopod.Body.Player(oath , id , secId) ;
                __player.Init(10,1,5);
                __player.AddTentacle() ;
                Players["/#"+id] = __player ;

                socket.init = true ;
                // Players[id] = __player ;
                socket.emit('init' , true);
            }
            else {
                //Send the previos player if connected as error
            }
            // switch (oath) {
            //     case "facebook" :
            //         Players[1][oathid] = __player ;
            //         break ;
            //     default :
            //         Players[0][socket.id] = __player ;
            //         break ;
            // }
        
        // }
    });
    socket.on('S_Connect' , function(name , type) {
        
        if(socket.init) {
            // var oathid = S_GetOathId(oath);
            // var player = Players[oathid]["/#"+id];
            var player = Players[socket.id];
            // console.log("/#"+id);
            // console.log(Players[oathid]["/#"+id]);
            // console.log(player);
            if(player.status == true) {
                socket.leave(player.getMap()) ;
                var mapid = S_GetMapId(type) ;
                S_Disconnect(mapid , player) ;
            }
            // console.log(oathid);
            
            if(name == "") {
                name = "Mystry" ;
            }

            var status = S_Connect(player,name,type) ;
            console.log("S_Connect : id-"+socket.id+" name-"+name+", type-"+type+" , status-"+status) ;
            if(status) {
                // update everything needed to client 
                // broadcast

                socket.join(player.getMap());
                socket.emit('joined');
                // console.log(Players[socket.id]);
                Players[socket.id].Start(200) ;
                // console.log(Players[socket.id]);
    //             for(var i = 0 ; i < Maps[player.mapid].foods.length ;i++) {
    // // socket.to(Maps[rank].GetMap()).broadcast.emit('');
    //                 fw.sockets.connected[socket.id].emit('SyncFood' , Maps[player.mapid].foods[i].getFood() );
    //             }
    //             for(var i = 0 ; i < Maps[player.mapid].players.length ;i++) {
    //                 for(var j = 0 ; j < Maps[player.mapid].players[i].length ; j++) {
    //                     fw.sockets.connected[socket.id].emit('SyncPlayer' , Players[Maps[players.mapid].players[i]].getPlayer());
    //                 }
    //             }
    //             fw.to(player.getMap()).broadcast.emit('SyncPlayer' , player.getPlayer() ) ;
            }
            // socket.oath = oath ;
            // socket.u_id = "/#"+id ;
        }
    });
    // socket.on("C_Ready" , function(oath , id , name , type) { 
    //     // fw.to(player.getMap()).broadcast.emit('SyncPlayer' , player.getPlayer() ) ;
    // });
    socket.on('disconnect' , function(){
        console.log(socket.id+" disconnected");
        // var oathid = S_GetOathId(socket.oath);
        var player = Players[socket.id] ;
        // var player = Players[oathid][socket.u_id] ;
        // console.log(Players);
        // console.log(player);
        var mapid = S_GetMapId(player.maptype);
        S_Disconnect(mapid , player);
        // Players[socket.id].Stop() ;
        // Players[socket.id] = null ;
    });
    socket.on('Bind-Tentacle' , function(x,y) { // trash in this branch



        // var angleToMouse = Octopod.OctoMath.Angle.MouseToAngle(x,y) * Math.PI/180 ;
        var player = Players[socket.id];

        // player.mousePos = new Octopod.Geometry.Vector2(x,y) ;
        player.focus = true ;
        // var d1 = Octopod.Geometry.Vector2.Distance(
        //     new Octopod.Geometry.Vector2(x,y) ,
        //     new Octopod.Geometry.Vector2() 
        // )
        // // var c_angle = player.Transform.angle ;

        // var boundX = Math.cos(angleToMouse-Math.PI/2)*player.totalLengthBound ;
        // // var boundY = Math.sin(angleToMouse-Math.PI/2)*player.totalLengthBound ;
        // var boundY = Math.sin(angleToMouse-Math.PI/2)*player.wideLengthMultiplier ;

        // var d2 = Octopod.Geometry.Vector2.Distance(
        //     new Octopod.Geometry.Vector2(boundX, boundY) ,
        //     new Octopod.Geometry.Vector2()
        // )

        // if(d1 > d2) {
        //     x = boundX ;
        //     y = boundY ;
        // }
        // console.log(x,y,d1,d2);
        // if(debug) {
        //     socket.emit("debug-Bind-Tentacle" , player.totalLengthBound ,
        //                                         player.wideLengthMultiplier ,
        //                                         angleToMouse ,
        //                                         x , y) ;
        // }
    });
    socket.on('MouseUpdate' , function(x,y) {
        // var oathid = S_GetOathId(oath) ;
        // console.log(x+","+y);
        // console.log(Players[socket.id]);
        var player = Players[socket.id] ;
        // var player = Players[oathid][socket.u_id] ;
        // console.log(player);
        player.__angle = Octopod.OctoMath.Angle.MouseToAngle(x,y) ; 
        // Players[socket.id].__angle = Octopod.OctoMath.Angle.MouseToAngle(x,y);
        // socket.emit('Direction' , Players[socket.id].Transform.angle , Players[socket.id].Transform.position);
        player.mousePos.Renew(new Octopod.Geometry.Vector2(x,y)) ;
        
        socket.emit('SyncPlayer' , player.getData() , true);
        
        // console.log(player.Camera.VisibleObjects);
        for(var i = 0 ; i < player.Camera.VisibleObjects.length ; i++) {
            // console.log(socket.id);
            // console.log(player.Camera.VisiblePlayers);
            socket.emit('SyncPlayer' , player.Camera.VisibleObjects[i].getData() , true) ;
        }
        
    });
    socket.on('SyncPlayer' , function() {
        var player = Players[socket.id] ;
        var mapid = S_GetMapId(player.maptype) ;
        
        var object_data = [] ;

        for(var i = 0 ; i < Maps[mapid][player.mapid].players.length ; i++) {
            object_data.push(Players["/#"+Maps[mapid][player.mapid].players[i]].getData());
        }
        for(var i = 0 ; i < Maps[mapid][player.mapid].foods.length ; i++) {
            object_data.push(Maps[mapid][player.mapid].foods[i].getData() );
        }
        socket.emit('SyncPlayer' , object_data , false);
    });
});

function S_GetOathId(oath) {
    switch (oath) {
        case "facebook" :
            return 1 ;
        case "user" :
            return 0 ;
        default :
            return 0 ;
    }
}
function S_GetMapId(type) {
    switch (type) {
        case "underwater" :
            return 0 ;
        default :
            return 0 ;
    }
}
function S_GetMapType(id) {
    switch (id) {
        case 0 :
            return "underwater" ;
        default :
            return "underwater" ;
    }
}

function S_CreateMap(type) {
    // console.log("Creating Map");
    var map = new Octopod.Body.Map( new Octopod.Geometry.Rect(0,0,5000,5000) );
    var mapid = S_GetMapId(type) ;
    Maps[mapid].push(map);
    // console.log(Maps[mapid][0].players);
    return true ;
}
function S_Connect(player ,name , type) {
        // console.log(i)
        var rank = -1 ;
        var mapid = S_GetMapId(type) ; 
        // console.log(Maps);
        for(var i = 0 ; i < Maps[mapid].length ; i++) {
            // console.log(Maps[mapid][i].players.length);
            if(Maps[mapid][i].players.length <= 30) {
                rank = i ;
                break ;
            }
        }
        // console.log(rank);
        // console.log(oathid);
        if(rank > -1) {
            player.status = true ;
            player.setMap(rank , type);
            player.name = name ;
            // console.log()
            Maps[mapid][rank].players.push(player.id);
            var object_data = [] ;

            for(var i = 0 ; i < Maps[mapid][rank].players.length ; i++) {
                object_data.push( Players["/#"+Maps[mapid][rank].players[i] ].getData() );
            }
            Maps[mapid][rank].quadTree.Insert(player.Transform) ;
            // console.log(player.id);
            fw.sockets.connected["/#"+player.id].emit('SyncPlayer' , object_data , false) ;
            return true ;
        }
        else {
            var result = S_CreateMap(type) ;
            if(result) {
                return S_Connect(player,name,type) ;
            }
            else {
                return false ;
            }
        }
}
function S_Disconnect(mapid , player) {
    player.Stop() ;
    Maps[mapid][player.mapid].players.splice (
        Maps[mapid][player.mapid].players.indexOf (
            player.id
        ) , 1
    );

    // There is no broadcasted mesg afte player leaves
    //socket.leave(Players[socket.zu_id].getMap) ;
}
var debug = true ;
var update_rate = setInterval(Update , 1100); // ._. works with 0.11 sec per frame too
function Update() {
    for(var i = 0 ; i < Maps.length ;i++) {
        // Maps[i].Update() ;
        for(var j = 0 ; j < Maps[i].length ; j++) {
            // Maps[i][j].Update() ;
            // Maps[i][j].quadTree.Clear() ;
            // for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
            //     Maps[i][j].quadTree.Insert(Players["/#"+Maps[i][j].players[k]] ) ;
            // }
            // for(var k = 0 ; k < Maps[i][j].foods.length ; k++) {
            //     Maps[i][j].quadTree.Insert(Maps[i][j].foods[k] ) ;
            // }
            // var food = new Octopod.Body.Food() ;

            // for(var m = 0 ; m< 20 ; m++) {
            //     Maps[i][j].AddFood(
            //         new Octopod.Body.Food(-1)
            //     ) ;
            // }

            // CollisionCheck(Players)
            // var x , y ;
            // x = Math
            // Maps[i][j].AddFood() ;
            // fw.to( S_GetMapType(i) + j).emit('SyncFood' , Maps[i][j].foods[Maps[i][j].foods.length-1].getData() ) ;
        }
        // var food = Maps[i].AddFood() ;   
    }
}
// var send_rate = setInterval(Send , 1000);
function CollisionCheck(transPlayer , transPoints , indexType , indexId) {
    var map = Maps[indexType][indexId] ;

    var transforms = map.quadTree.Retrieve(transPlayer) ; 
    for(var i = 0 ; i < transforms.length ; i++) {
        // var players = map.quadTree.Retrieve(player) ;
        if(transPlayer.id != transforms[i].id) {
            var dis = Octopod.Geometry.Vector2.Distance(transPlayer.position , transforms[i].position) ;
            if(dis < (transform.size+transforms[i].size)/2) {
                //kill him
                console.log("Collision betwenn "+transPlayer.id+" : "+transforms[i].id) ;
            }
        }
    }

    // Calculate the distance between all points create a new transform forming a rect :) :/ <3 
    // var transforms = map.quadTree.Retrieve(camera) ;

}
function C2Collision(pos1 , rad1 , pos2 , rad2 ) {
    var  dis = Octopod.Geometry.Vector2.Distance(pos1 , pos2) ;
    if(dis < (rad1+rad2)/2)
        return true ;
    else 
        return false ;
}
function RCCollision(rect1 , trans1) {
    var d1 , d2 , d3 , d4 ;
    d1 = Vector2.Distance(rect1.topLeft , trans1.position) ;
    d2 = Vector2.Distance(rect1.topRight , trans1.position) ;
    d3 = Vector2.Distance(rect1.bottomLeft , trans1.position) ;
    d4 = Vector2.Distance(rect1.bottomRight , trans1.position) ;

    if(d1 - trans1.size < 0) 
        return true ;
    else if(d2 - trans1.size < 0) 
        return true ;
    else if(d3 - trans1.size < 0) 
        return true ;
    else if(d4 - trans1.size < 0) 
        return true ;
    else return false ;
}

function VisibleObjects(transform , indexType , indexId) {
    var map = Maps[indexType][indexId] ;

    var transforms = map.quadTree.Retrieve(transform) ; 
    return transforms ;
}
function Send() {
    // for(var i = 0 ; i < Maps.length ; i++) { // Sends  players custom object
    //     for(var j = 0 ; j < Maps[i].length ; j++) {
    //         for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
    //             for(var m = 0 ; m < Maps[i][j].players[k].length ; m++) {
    //                 // fw.to( S_GetMapType(i) + j ).emit('SyncPlayer' , Players[k][Maps[i][j].players[k][m]].getPlayer() );
    //             }
    //         }
    //     }
    // }

    for(var i = 0 ; i < Maps.length ; i++) { // Sends  players custom object
        for(var j = 0 ; j < Maps[i].length ; j++) {
            for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
                var player = Players[ "/#"+Maps[i][j].players[k] ] ;

                var transform = player.Transform ;

                var map = Maps[i][j] ;

                // var transforms = map.quadTree.Retrieve(transform) ;
                var newTrans = new Octopod.Component.Transform(-1) ;
                newTrans.position.x = player.shiftCenterX + player.Transform.position.x ;
                newTrans.position.y = player.Transform.position.y ;

                newTrans.scale.x = player.wideLengthMultiplier ;
                newTrans.scale.y = player.totalLengthBound ;

                var transforms = map.quadTree.Retrieve(newTrans) ;

                var check = false ;

                for(var m = 0 ; m < transforms.length ; m++) { // dosn't makes sense :/ 
                    if(transform.id != transforms[m].id)
                        check = C2Collision(transform.position , transform.size , 
                                            transforms[m].position , transforms[m].size) ;
                    
                    console.log(transforms[m].id) ;
                    //take later
                }
                var balls = [] ;
                // var newTrans = new Octopod.Component.Transform(-1) ;
                // newTrans.position.x = player.shiftCenterX + player.transform.position.x ;
                // newTrans.position.y = player.transform.position.y ;

                // newTrans.size.x = player.wideLengthMultiplier ;
                // newTrans.size.y = player.totalLengthBound ;

                // transforms = map.quadTree.Retrieve(newTrans) ; //
                // var dir = 
                for(var m = 0 ; m < player.tentacles.length ; m++) {
                    var pars = player.tentacles[m].particles ;
                    for(var n = 0 ; n < pars.length ; n++) {
                        var dis , dir , angle , parts;
                        if(n == 0) {
                            dis = Vector2.Distance(transform.position , pars[n].pos) ;
                            dis -= transform.size/2 ;
                            dir = Vector2.Sub(transform.position , pars[n-1].pos) ; 
                        } 
                        else {
                            dis = Vector2.Distance(pars[n-1].pos , pars[n].pos) ;
                            // dis -= 2*player.tentacles[m].size ;
                            dir = Vector2.Sub(pars[n].pos,pars[n-1].pos) ;
                        }
                        parts = Math.round(dis/player.tentacles[n].size) + 1;
                        angle = Octopod.OctoMath.Angle.MouseToAngle(dir.x , dir.y) ;
                        
                        // for(var l = 0 ; l < )
                        for(var o = 1 ; o < parts ; o++) {
                            // var dir ;
                            // if (n==0)
                            //     dir = Vector2.Sub(pars[n].pos,pars[n-1].pos) ; 
                            // else
                            //     dir = Vekctor2.Sub(pars[n].pos,pars[n-1].pos) ;
                            var pos = Octopod.OctoMath.Angle.MoveOver(pars[n].pos.x , pars[n].pos.y , angle , o*dis) ;
                            // var trans = new Octopod.Component.Transform(-1) ;
                            // trans.pos = 
                            balls.push(pos) ;
                        }

                    }
                }
                for(var n = 0 ; n < transforms.length ; n++) {
                    for(var m = 0 ; m < balls.length ; m++) {
                        check = C2Collision(balls[m] , 2 , transforms[n].position , transforms[n].size) ;
                        console.log(transforms[n].id) ;
                        // fw.sockets.connnected[["/#"+player.id]].emit("Update" , transforms)
                        if (check) break ;
                    }
                }


                for(var o = 0 ; o < transforms.length ;o++) {
                    fw.sockets.connnected[["/#"+player.id]].emit('Update' , transforms[o]) ;
                    // or later combine with broadcast ;
                    //socket.to( Maps[Rank].getMap() ).broadcast.emit('Update',data ) ;
                }
                // for(var m = 0 ; m < transforms.length ; m++) {
                //     for(var n = 0 ; n < rects.length ; n++) {
                //         check = RCCollision(rect[n] , transforms[m]) ;

                //         if(check) break ;
                //     }
                // }
                // first find the anglel between
                // secondly rotate the the y axis two points by the angle 
                // then create a new rect by joinng two points 

                // Create big transform having scale of range as dia. 
                // retrieve all the transform from the quadTree
                // check

                


                // var gameObjects = Maps[i][j].getObjectsInFieldView(player) ;
                // console.log(player);
                // CollisionCheck(player.Transform , i, j);

                // player.Camera.VisibleObjects = gameObjects ;

                // console.log(gameObjects);
                // plae
                // for(var m = 0 ; m < gameObjects.length ; m++) {
                //     fw.sockets.connected[Maps[i][j].players[k]].emit('SyncPlayer', gameObjects[k].getPlayer());
                    
                // }
            }
        }
    }
}