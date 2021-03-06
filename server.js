var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var app = require('./lib/app');

var socketio = require('socket.io');
var util = require('util');//console.log(util.inspect(obj,false,null));でオブジェクトの中身をターミナルで確認できるようにする為



var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

function send404(response) {
	response.writeHead(404, {
		'Content-Type': 'text/plain'
	});
	response.write('Error 404: resource not found. ていうか見つかりません');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200, {
			"content-type": mime.lookup(path.basename(filePath))
		}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function (exists) {
			if (exists) {
				fs.readFile(absPath, function (err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

var server = http.createServer(function (request, response) {
	var filePath = false;

	if (request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}

	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

server.listen(3000, function () {
	console.log("Server listening on port 3000.");
});


var io = socketio.listen(server);
var icons = [];
var ids = [];

io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	
	//io.sockets.socketsは配列になっている
	socket.emit('emit_fron_server_sendIcons', io.sockets.sockets.map(function(e) {
		return e.icon;
		
	}));


	socket.hoge = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
	
	console.log('clientから接続がありました');
	socket.on('emit_from_client', function (data) {
//		console.log(data);
		socket.emit('emit_from_server', 'you sended message ' + data);
		io.sockets.emit('emit_from_server', 'you sended message ' + data);
	});
	console.log('connection キター！');


	//iconのプロパティを更新する
	socket.on('emit_from_client_iconUpdate', function (data) {
		socket.icon = data;//socketオブジェクトの中にiconを格納
		console.log(socket.icon);
		socket.broadcast.emit('emit_from_server_iconUpdate', data);
	});

	socket.on('client_from_emit_icon_draw', function (data) {
		io.sockets.emit('server_from_emit_icon_draw', data);
	});
	
	
	socket.on('emit_from_client_mkIconBtn', function (data) {
		console.log(data);
	});


	socket.on('emit_from_client_join', function(data) {
		socket.icon = data;
		socket.broadcast.emit('emit_from_server_join', data);
		console.log('きてますよ〜');
		console.log(data);
	});


	socket.on('emit_from_client_iconPosChanged', function(data) {
		socket.icon.PosX = data.PosX;
		socket.icon.PosY = data.PosY;
		socket.broadcast.emit('emit_from_server_iconPosChanged', {uniqueId: socket.icon.uniqueId, PosX: socket.icon.PosX, PosY: socket.icon.PosY});
	});
	
	socket.on('emit_from_client_sendMsg', function(data) {
		socket.broadcast.emit('emit_from_server_sendMsg',{ uniqueId: socket.id, str: data.str, chatShowCount: data.chatShowCount});
	});
	
	
	socket.on('emit_from_client_voicePU', function(data) {
		socket.broadcast.emit('emit_from_server_voicePU', { uniqueId: socket.id ,countVoice: data});
	});
	
	
	socket.on('emit_from_client_peerCallConnected', function(data) {
		console.log(data);
		socket.broadcast.emit('emit_from_server_peerCallConnected', {uniqueId: socket.id, talkingNodesIds: data});
	});

	socket.on('emit_from_client_peerCallDisconnected', function(data) {
		console.log(data);
		socket.broadcast.emit('emit_from_server_peerCallDisconnected', {uniqueId: socket.id, talkingNodesIds: data});
	});
	
	socket.on('disconnect', function() {
		console.log(socket.id);
		console.log('disconnect');
		//サーバー側のiconはsocket.iconに格納されていて、disconnect時には勝手に消える為、削除処理不要
		socket.broadcast.emit('emit_from_server_iconRemove', socket.id);
	});
});//---end---io.sockets.on('connection'





