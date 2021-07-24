//var rocketChatSocket = new WebSocket("ws://chat.primavillage.id/websocket");
//
//var connectRequest = {
//    "msg": "connect",
//    "version": "1",
//    "support": ["1", "pre2", "pre1"]
//}
//rocketChatSocket.send(JSON.stringify(connectRequest));

function connect() {
    return new Promise(function(resolve, reject) {
        //var server = new WebSocket('wss://chat.primavillage.id/websocket');
        //var server = new WebSocket('wss://open.rocket.chat/websocket');
        var server = new WebSocket('ws://chat.local.test:3000/websocket');
        //var server = new WebSocket('ws://10.0.0.190:3000/websocket');

        server.onopen = function() {
            console.log("Berhasil terkoneksi");
            resolve(server);
            
            var connectRequest = {
                "msg": "connect",
                "version": "1",
                "support": ["1"]
            }

            console.log("Melakukan koneksi");
            server.send(JSON.stringify(connectRequest));
            var authToken = "";

            server.onmessage = function(msg){
                var data = JSON.parse(msg.data);
                console.log("Mendapat reply");
                if (typeof(data.session) == "undefined") {
                    console.log(data);
                } else {
                    //console.log(data.session);
                    console.log("Berhasil mendapatkan token");
                    document.cookie = 'X-Authorization=' + data.session;
                    authToken = data.session;
                }
            }

            console.log("Auth token nya adalah :");
            console.log(authToken);

            var loginRequest = {
                "msg": "method",
                "method": "login",
                "id": "42",
                "params": [
                    { 
                        "user": { "username": "coba" },
                        "password": {
                            "digest": "password123",
                            "algorithm": "sha-256"
                        },
                        "resume": "auth-token"
                    }
                ]
            }

            console.log("Melakukan login");
            server.send(JSON.stringify(loginRequest));

            var chatRequest = {
                "msg": "method",
                "method": "sendMessage",
                "id": "42",
                "params": [
                    {
                        "rid": "GENERAL",
                        "msg": "Hello World!"
                    }
                ]
            }

            console.log("Mengirim pesan");
            server.send(JSON.stringify(chatRequest));

        };

        server.onerror = function(err) {
            console.log("Gagal terkoneksi");
            console.log(err);
            reject(err);
        };
    });
}

function login() {

    var subscribeRequest = {
        "msg": "sub",
        "id": "unique-id",
        "name": "stream-notify-room",
        "params":[
            "room-id/event",
            false
        ]
    }

    rocketChatSocket.send(JSON.stringify(subscribeRequest));
}

/*
var request={
    "msg": "method",
    "method": "sendMessage",
    "id": "42",
    "params":
    [
        {
            "_id": "message-id",
            "rid": "room-id",
            "msg": "Hello World!"
        }
    ]
}

rocketChatSocket.send(JSON.stringify(request));
*/
