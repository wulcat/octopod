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
                __player.Init(20,1,5);
                
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
    socket.on('S_Connect' , function(type) {
        
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
            var status = S_Connect(player,type) ;
            console.log("S_Connect : id-"+socket.id+" , type-"+type+" , status-"+status) ;
            if(status) {
                // update everything needed to client 
                // broadcast

                socket.join(player.getMap());
                socket.emit('joined');
                // console.log(Players[socket.id]);
                Players[socket.id].Start() ;
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

        socket.emit('SyncPlayer' , player.getPlayer() , true);
        
        for(var i = 0 ; i < player.Camera.VisiblePlayers.length ; i++) {
            // console.log(player.Camera.VisiblePlayers);
            socket.emit('SyncPlayer' , player.Camera.VisiblePlayers[i] , true) ;
        }
    });
    socket.on('SyncPlayer' , function() {
        var player = Players[socket.id] ;
        var mapid = S_GetMapId(player.maptype) ;
        
        var object_data = [] ;

        for(var i = 0 ; i < Maps[mapid][player.mapid].players.length ; i++) {
            object_data.push(Players["/#"+Maps[mapid][player.mapid].players[i]].getPlayer());
        }
        socket.emit(object_data,false);
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
function S_Connect(player , type) {
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

            // console.log()
            Maps[mapid][rank].players.push(player.id);
            var object_data = [] ;

            for(var i = 0 ; i < Maps[mapid][rank].players.length ; i++) {
                object_data.push( Players["/#"+Maps[mapid][rank].players[i] ].getPlayer() );
            }
            // console.log(player.id);
            fw.sockets.connected["/#"+player.id].emit('SyncPlayer' , object_data , false) ;
            return true ;
        }
        else {
            var result = S_CreateMap(type) ;
            if(result) {
                return S_Connect(player,type) ;
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
}
var update_rate = setInterval(Update , 3000);
function Update() {
    for(var i = 0 ; i < Maps.length ;i++) {
        // Maps[i].Update() ;
        for(var j = 0 ; j < Maps[i].length ; j++) {
            Maps[i][j].Update() ;
            Maps[i][j].quadTree.Clear() ;
            for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
                Maps[i][j].quadTree.Insert(Players["/#"+Maps[i][j].players[k]]) ;
            }
            // Maps[i][j].AddFood() ;
            // fw.to( S_GetMapType(i) + j).emit('SyncFood' , Maps[i][j].foods[Maps[i][j].foods.length-1].getFood() ) ;
        }
        // var food = Maps[i].AddFood() ;   
    }
}
var send_rate = setInterval(Send , 1000);
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
                var gameObjects = Maps[i][j].getObjectsInFieldView(player) ;
                
                player.Camera.VisiblePlayers = gameObjects ;
                // console.log(gameObjects);
                // plae
                // for(var m = 0 ; m < gameObjects.length ; m++) {
                //     fw.sockets.connected[Maps[i][j].players[k]].emit('SyncPlayer', gameObjects[k].getPlayer());
                    
                // }
            }
        }
    }
}