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

var Foods = [] ;
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
    var User = [] ;
    var Facebook = [] ;

    Players.push(User) ;
    Players.push(Facebook) ;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/__client__/webgl/index.html');
});

app.post('/', function (req , res) {
   // res.sendFile(__dirname+ '..__client__/index.html') ; // For facebook canvas
});

fw.on('connection' , function(socket) {
    console.log("connected : "+socket.id);

    // var __player = new Octopod.Body.sPlayer(socket.id , "test") ;
    // Players[socket.id] = __player ;
    // __player.Init(20 , 1 , 5);
    // __player.Start(200) ;

    // Players[socket.id] = __player ;
    // var status = false ;
    // if(!Players[socket.id].status) status = S_Connect(socket,null,null,"Underwater") ;
    
    // if(status) socket.emit('start');

    socket.on('init', function(oath , id) {
        // if(socket.u_id != undefined)  {
            // var id = "3452436";
            // socket.u_id = id ;
            var __player = new Octopod.Body.Player(oath , id) ;
            switch (oath) {
                case "facebook" :
                    Players[1][oathid] = __player ;
                    break ;
                default :
                    Players[0][socket.id] = __player ;
                    break ;
            }
            socket.init = true ;
            // Players[id] = __player ;    
        // }
    });
    socket.on('S_Connect' , function(oath , id , name , type) {
        if(socket.init) {
            var oathid = S_GetOathId(oath);
            var player = Players[oathid][id] ;

            if(player.status == true) {
                socket.leave(player.getMap()) ;
                var typeid = S_GetMapId(type) ;
                S_Disconnect(typeid , player , oathid) ;
            }

                
            var status = S_Connect(player,oathid,type) ;
            if(status) {
                // update everything needed to client 
                // broadcast
                socket.join(player.getMap());

                for(var i = 0 ; i < Maps[player.mapid].foods.length ;i++) {
    // socket.to(Maps[rank].GetMap()).broadcast.emit('');
                    fw.sockets.connected[socket.id].emit('SyncFood' , Maps[player.mapid].foods[i].getFood() );
                    
                }
                for(var i = 0 ; i < Maps[player.mapid].players.length ;i++) {
                    for(var j = 0 ; j < Maps[player.mapid].players[i].length ; j++) {
                        fw.sockets.connected[socket.id].emit('SyncPlayer' , Players[Maps[players.mapid].players[i]].getPlayer());
                    }
                }
                fw.to(player.getMap()).broadcast.emit('SyncPlayer' , player.getPlayer() ) ;
            }
            socket.oath = oath ;
            socket.u_id = id ;
        }
    });
    socket.on('disconnect' , function(){
        console.log(socket.id+" disconnected");
        var oathid = S_GetOathId(socket.oath);
        var player = Players[oathid][socket.u_id] ;
        console.log(Players);
        var mapid = S_GetMapId(player.maptype);
        S_Disconnect(mapid , player ,oathid);
        // Players[socket.id].Stop() ;
        // Players[socket.id] = null ;
    });
    socket.on('MouseUpdate' , function(oath ,id, x,y) {
        var oathid = S_GetOathId(oath) ;
        var player = Players[oathid][id] ;
         
        player.___angle = Octopod.OctoMath.Angle.MouseToAngle(x,y) ; 
        // Players[socket.id].__angle = Octopod.OctoMath.Angle.MouseToAngle(x,y);
        // socket.emit('Direction' , Players[socket.id].Transform.angle , Players[socket.id].Transform.position);

        fw.to(player.getMap()).emit('PlayerUpdate' , player.getPlayer() );
    });
});

function S_GetOathId(oath) {
    switch (oath) {
        case "facebook" :
            return 1 ;
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
    var map = new Octopod.Body.Map( new Octopod.Geometry.Rect(0,0,7000,7000) );
    var mapid = S_GetMapId(type) ;
    Maps[mapid].push(map);
    return true ;
}
function S_Connect(player,oathid , type) {
        var rank = -1 ;
        var mapid = S_GetMapId(type) ; 
        for(var i = 0 ; i < Maps.length ; i++) {
            if(Maps[mapid][i].players.length <= 30) {
                rank = i ;
                break ;
            }
        }

        if(rank > -1) {
            player.status = true ;
            player.setMap(rank , type);

            Maps[mapid][rank].players[oathid].push(player.id);
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
function S_Disconnect(mapid , player , oathid) {
    Maps[mapid][player.mapid].players[oathid].splice(Maps[mapid][player.mapid].players[oathid].indexOf(player.id) , 1);
}
var update_rate = setInterval(Update , 3000);
function Update() {
    for(var i = 0 ; i < Maps.length ;i++) {
        // Maps[i].Update() ;
        for(var j = 0 ; j < Maps[i].length ; j++) {
            Maps[i][j].AddFood() ;
        }
        var food = Maps[i].AddFood() ;
        
    }
}
var update_rate = setInterval(Send , 1000);
function Send() {
    for(var i = 0 ; i < Maps.length ; i++) { // Sends  players custom object
        for(var j = 0 ; j < Maps[i].length ; j++) {
            for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
                for(var m = 0 ; m < Maps[i][j].players[k].length ; m++) {
                    fw.to( S_GetMapType(i) + j ).emit('SyncPlayer' , Players[k][Maps[i][j].players[k][m]].getPlayer() );
                }
            }
        }
    }

}