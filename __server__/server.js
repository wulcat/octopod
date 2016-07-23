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
   console.log("server started at port %d" , port) ; 
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/__client__/webgl/index.html');
});

app.post('/', function (req , res) {
   // res.sendFile(__dirname+ '..__client__/index.html') ; // For facebook canvas
});

fw.on('connection' , function(socket) {
    console.log("connected : "+socket.id);

    var __player = new Octopod.Body.Player(socket.id , "test") ;
    Players[socket.id] = __player ;
    __player.Init(20 , 1 , 5);
    // __player.Start(200) ;

    Players[socket.id] = __player ;
    var status = false ;
    if(!Players[socket.id].status) status = S_Connect(socket,null,null,"Underwater") ;
    
    if(status) socket.emit('start');

    socket.on('disconnect' , function(){
        console.log(socket.id+" disconnected");
        Players[socket.id].Stop() ;
        Players[socket.id] = null ;
    });
    socket.on('MouseUpdate' , function(x,y) {
        Players[socket.id].__angle = Octopod.OctoMath.Angle.MouseToAngle(x,y);
        socket.emit('Direction' , Players[socket.id].Transform.angle , Players[socket.id].Transform.position);
    });
});
function S_Disconnect(socket) {}
function S_CreateMap(type) {
    var map = new Octopod.Body.Map( new Octopod.Geometry.Rect(0,0,7000,7000),
                                    type , Maps.length);
    Maps.push(map);
    return true ;
}
function S_Connect(socket,oath,auth,type) {

    if(Players[socket.id] != null) {
        if(Players[socket.id].status == true)
            S_Disconnect(socket) ;

        var rank = -1 ;
        for(var i = 0 ; i < Maps.length ; i++) {
            if(Maps[i].type == type && Maps[i].players.length <= 30) {
                rank = i ;
                break ;
            }
        }
        if(rank > -1) {
            var map = Maps[rank].GetMap() ;
            socket.join(map);

            Players[socket.id].status = true ;
            Players[socket.id].setMap(rank , type);

            Maps[rank].addPlayer(socket.id , -1);

            for(var i = 0 ; i < Maps[rank].players.length ; i++) {
            
            }
            for(var i = 0 ; i < Maps[rank].foods.length ; i++) {

            }
        }
        else {
            var result = S_CreateMap(type) ;
            if(result) {
                 S_Connect(socket,oath,auth,type) ;
            }
            else {
                return false ;
            }
        }
    }
    else {
        return false ;
    }
    // var i , k;
    // k=-1;
    // for(i = 0 ; i < Maps.length ; i++) {
    //     if(Maps[i].players.length < 30) {
    //         k = i ;
    //         break;
    //     }
    // }
    // if(k == -1) {
    //     k = S_Connect() ;
    // }



    // var rank = GetMap() ;
    // Maps[rank].Join(socket.id) ;
    // socket.join(Maps[rank].GetMap()) ;
    // fw.sockets.connected[socket.id].emit('');
    // socket.to(Maps[rank].GetMap()).broadcast.emit('');

    
}
// function GetMap() {
//     var i , k;
//     k=-1;
//     for(i = 0 ; i < Maps.length ; i++) {
//         if(Maps[i].players.length < 30) {
//             k = i ;
//             break;
//         }
//     }
//     if(k == -1) {
//         k = CreateMap() ;
//     }
//     return k ;
// }
// function CreateMap() {
//     var map = new Octopod.Body.Map(new Octopod.Geometry.Rect(0,0,7000,7000)) ;
//     Maps.push(map);
//     return Maps.length-1 ;
// }
var update_rate = setInterval(Update , 3000);
function Update() {
    for(var i = 0 ; i < Maps.length ;i++) {
        // Maps[i].Update() ;
        var food = Maps[i].AddFood() ;
        
    }
}
var update_rate = setInterval(Send , 1000);
function Send() {
    for(var i = 0 ; i < Maps.length ; i++) {
        for(var j = 0 ; j < Maps[i].players.length ; i++) {
            
        }
    }
}