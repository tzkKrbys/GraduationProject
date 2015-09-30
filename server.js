var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var app = require('./lib/app');

var socketio = require('socket.io');


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



//function listen(server) {
//	console.log('listen!!!!!!!!!!!!');
//	io = socketio.listen(server);
//	io.set('log level', 1);
//	io.sockets.on('connection', function (socket) {
//		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
//		joinRoom(socket, 'Lobby');
//		handleMessageBroadcasting(socket, nickNames);
//		handleNameChangeAttempts(socket, nickNames, namesUsed);
//		handleRoomJoining(socket);
//		socket.on('rooms', function () {
//			socket.emit('rooms', io.sockets.manager.rooms);
//		});
//		handleClientDisconnection(socket, nickNames, namesUsed);
//		//追加したやつ
//		socket.on('emit_from_client', function (data) {
//			console.log(data);
//		});
//	});
//};



//var app = require('./lib/app');
//app.listen(server);





//function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
//	var name = 'Guest' + guestNumber;
//	nickNames[socket.id] = name;
//	socket.emit('nameResult', {
//		success: true,
//		name: name
//	});
//	namesUsed.push(name);
//	return guestNumber + 1;
//}
//
//function joinRoom(socket, room) {
//	socket.join(room);
//	currentRoom[socket.id] = room;
//	socket.emit('joinResult', {
//		room: room
//	});
//	socket.broadcast.to(room).emit('message', {
//		text: nickNames[socket.id] + ' has joined ' + room + '.'
//	});
//
//	var usersInRoom = io.sockets.clients(room);
//	if (usersInRoom.length > 1) {
//		var usersInRoomSummary = 'Users currently in ' + room + ': ';
//		for (var index in usersInRoom) {
//			var userSocketId = usersInRoom[index].id;
//			if (userSocketId != socket.id) {
//				if (index > 0) {
//					usersInRoomSummary += ', ';
//				}
//				usersInRoomSummary += nickNames[userSocketId];
//			}
//		}
//		usersInRoomSummary += '.';
//		socket.emit('message', {
//			text: usersInRoomSummary
//		});
//	}
//}
//
//function handleNameChangeAttempts(socket, nickNames, namesUsed) {
//	socket.on('nameAttempt', function (name) {
//		if (name.indexOf('Guest') == 0) {
//			socket.emit('nameResult', {
//				success: false,
//				message: 'Names cannot begin with "Guest".'
//			});
//		} else {
//			if (namesUsed.indexOf(name) == -1) {
//				var previousName = nickNames[socket.id];
//				var previousNameIndex = namesUsed.indexOf(previousName);
//				namesUsed.push(name);
//				nickNames[socket.id] = name;
//				delete namesUsed[previousNameIndex];
//				socket.emit('nameResult', {
//					success: true,
//					name: name
//				});
//				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
//					text: previousName + ' is now known as ' + name + '.'
//				});
//			} else {
//				socket.emit('nameResult', {
//					success: false,
//					message: 'That name is already in use.'
//				});
//			}
//		}
//	});
//}
//
//function handleMessageBroadcasting(socket) {
//	socket.on('message', function (message) {
//		socket.broadcast.to(message.room).emit('message', {
//			text: nickNames[socket.id] + ': ' + message.text
//		});
//	});
//}
//
//function handleRoomJoining(socket) {
//	socket.on('join', function (room) {
//		socket.leave(currentRoom[socket.id]);
//		joinRoom(socket, room.newRoom);
//	});
//}
//
//function handleClientDisconnection(socket) {
//	socket.on('disconnect', function () {
//		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
//		delete namesUsed[nameIndex];
//		delete nickNames[socket.id];
//	});
//}




var io = socketio.listen(server);
var icons = [];
var ids = [];

io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	
	
	socket.emit('emit_fron_server_sendIcons', io.sockets.sockets.map(function(e) {
		console.log('io.sockets.sockets　；　' + io.sockets.sockets);
		console.log('io.sockets.sockets[0]　；　' + io.sockets.sockets[0]);
		console.log('io.sockets.sockets[0][0]　；　' + io.sockets.sockets[0][0]);
		console.log('io.sockets.sockets[0][1]　；　' + io.sockets.sockets[0][1]);
		console.log('io.sockets.sockets[1]　；　' + io.sockets.sockets[1]);
		console.log('210行目　e　' + e);
		console.log('210行目　' + e.icon);
		return e.icon;
		
	}));
//	guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
//	joinRoom(socket, 'Lobby');
//	handleMessageBroadcasting(socket, nickNames);
//	handleNameChangeAttempts(socket, nickNames, namesUsed);
//	handleRoomJoining(socket);
//	socket.on('rooms', function () {
//		socket.emit('rooms', io.sockets.manager.rooms);
//	});
//	handleClientDisconnection(socket, nickNames, namesUsed);


	
	
	
	
	
	
	
	socket.hoge = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
//	console.log(io.sockets.sockets);
	
	console.log('clientから接続がありました');
	socket.on('emit_from_client', function (data) {
//		console.log(data);
		socket.emit('emit_from_server', 'you sended message ' + data);
		io.sockets.emit('emit_from_server', 'you sended message ' + data);
	});
	console.log('connection キター！');
//
//	socket.on('client_from_emit_icon_move', function(data) {
//		console.log(data);
//	});
	
	socket.on('client_from_emit_icon_draw', function (data) {
		io.sockets.emit('server_from_emit_icon_draw', data);
//		console.log(data);
	});
	
	socket.on('emit_from_client_mkIconBtn', function (data) {
		console.log(data);
	});
//
//	socket.on('client_from_emit_joinIcon', function(data) {
//		console.log(data);
//		icons.push(data);
//		io.sockets.emit('server_from_emit_iconAdd', icons);
//	});
//	socket.on('emit_from_client_join', function (data) {
//		io.sockets.emit('server_from_emit_iconAdd', data);
//	});
	
	socket.on('emit_from_client_join', function(data) {
		socket.icon = data;
		socket.broadcast.emit('emit_from_server_join', data);
	});
	
	socket.on('emit_from_client_iconMove', function(data) {
		for (var i = 0; i < icons.length; i++) {
			if(icons[i].uniqueId == data.uniqueId) {
				icons[i].PosX = data.PosX;
				icons[i].PosY = data.PosY;
				socket.emit('emit_from_server_iconMove', icons[i])
			}
		}
	})
});


//function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
//	var name = 'Guest' + guestNumber;
//	nickNames[socket.id] = name;
//	socket.emit('nameResult', {
//		success: true,
//		name: name
//	});
//	namesUsed.push(name);
//	return guestNumber + 1;
//}


//function joinRoom(socket, room) {
//	socket.join(room);
//	
//	currentRoom[socket.id] = room;//ユーザーがこのルームに参加したことを記録する
//	
//	//ユーザーに新しいルームに入ったことを知らせる
//	socket.emit('joinResult', {
//		room: room
//	});
//	//ルームにいる他のユーザーに、このユーザーが入室したことを知らせる
//	socket.broadcast.to(room).emit('message', {
//		text: nickNames[socket.id] + ' has joined ' + room + '.'
//	});
//	//同じルームに、他に誰がいるのかの判定
//	var usersInRoom = io.sockets.clients(room);
//	
//	if (usersInRoom.length > 1) {//もしユーザーがいたら、その概要を作る
//		var usersInRoomSummary = 'Users currently in ' + room + ': ';
//		for (var index in usersInRoom) {
//			var userSocketId = usersInRoom[index].id;
//			if (userSocketId != socket.id) {
//				if (index > 0) {
//					usersInRoomSummary += ', ';
//				}
//				usersInRoomSummary += nickNames[userSocketId];
//			}
//		}
//		usersInRoomSummary += '.';
//		socket.emit('message', {
//			text: usersInRoomSummary
//		});
//	}
//}

//function joinRoom(socket, room) {
//	socket.join(room);
//	currentRoom[socket.id] = room;
//	socket.emit('joinResult', {
//		room: room
//	});
//	socket.broadcast.to(room).emit('message', {
//		text: nickNames[socket.id] + ' has joined ' + room + '.'
//	});
//	console.log('io.socketsですよー！：' + io.sockets.clients);
//	var usersInRoom = io.sockets.clients(room);
//	if (usersInRoom.length > 1) {
//		var usersInRoomSummary = 'Users currently in ' + room + ': ';
//		for (var index in usersInRoom) {
//			var userSocketId = usersInRoom[index].id;
//			if (userSocketId != socket.id) {
//				if (index > 0) {
//					usersInRoomSummary += ', ';
//				}
//				usersInRoomSummary += nickNames[userSocketId];
//			}
//		}
//		usersInRoomSummary += '.';
//		socket.emit('message', {
//			text: usersInRoomSummary
//		});
//	}
//}










