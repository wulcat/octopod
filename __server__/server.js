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
    var User = [] ;
    var Facebook = [] ;

    Players.push(User) ;
    Players.push(Facebook) ;

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

    socket.on('init', function(oath , id) {
        // if(socket.u_id != undefined)  {
            // var id = "3452436";
            // socket.u_id = id ;
            console.log("init : oath -"+oath+" , id -"+id);
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
            socket.emit('init' , true);
        // }
    });
    socket.on('S_Connect' , function(oath , id , type) {
        
        if(socket.init) {
            var oathid = S_GetOathId(oath);
            var player = Players[oathid]["/#"+id];
            // console.log("/#"+id);
            // console.log(Players[oathid]["/#"+id]);
            // console.log(player);
            if(player.status == true) {
                socket.leave(player.getMap()) ;
                var typeid = S_GetMapId(type) ;
                S_Disconnect(typeid , player , oathid) ;
            }
            // console.log(oathid);
            var status = S_Connect(player,oathid,type) ;
            console.log("S_Connect : oath-"+oath+" , id-"+id+" , type-"+type+" , status-"+status) ;
            if(status) {
                // update everything needed to client 
                // broadcast
                socket.join(player.getMap());
                socket.emit('joined');
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
            socket.oath = oath ;
            socket.u_id = "/#"+id ;
        }
    });
    // socket.on("C_Ready" , function(oath , id , name , type) { 
    //     // fw.to(player.getMap()).broadcast.emit('SyncPlayer' , player.getPlayer() ) ;
    // });
    socket.on('disconnect' , function(){
        console.log(socket.id+" disconnected");
        var oathid = S_GetOathId(socket.oath);
        var player = Players[oathid][socket.u_id] ;
        // console.log(Players);
        // console.log(player);
        var mapid = S_GetMapId(player.maptype);
        S_Disconnect(mapid , player ,oathid);
        // Players[socket.id].Stop() ;
        // Players[socket.id] = null ;
    });
    socket.on('MouseUpdate' , function(oath ,id, x,y) {
        var oathid = S_GetOathId(oath) ;

        var player = Players[oathid][socket.u_id] ;
        console.log(player);
        player.___angle = Octopod.OctoMath.Angle.MouseToAngle(x,y) ; 
        // Players[socket.id].__angle = Octopod.OctoMath.Angle.MouseToAngle(x,y);
        // socket.emit('Direction' , Players[socket.id].Transform.angle , Players[socket.id].Transform.position);

        fw.to(player.getMap()).emit('SyncPlayer' , player.getPlayer() );
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
function S_Connect(player,oathid , type) {
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
            Maps[mapid][rank].players[oathid].push(player.id);
            return true ;
        }
        else {
            var result = S_CreateMap(type) ;
            if(result) {
                return S_Connect(player,oathid,type) ;
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
            Maps[i][j].Update() ;
            // Maps[i][j].AddFood() ;
            // fw.to( S_GetMapType(i) + j).emit('SyncFood' , Maps[i][j].foods[Maps[i][j].foods.length-1].getFood() ) ;
        }
        // var food = Maps[i].AddFood() ;   
    }
}
var send_rate = setInterval(Send , 1000);
function Send() {
    for(var i = 0 ; i < Maps.length ; i++) { // Sends  players custom object
        for(var j = 0 ; j < Maps[i].length ; j++) {
            for(var k = 0 ; k < Maps[i][j].players.length ; k++) {
                for(var m = 0 ; m < Maps[i][j].players[k].length ; m++) {
                    // fw.to( S_GetMapType(i) + j ).emit('SyncPlayer' , Players[k][Maps[i][j].players[k][m]].getPlayer() );
                }
            }
        }
    }

}