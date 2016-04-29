navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

navigator.getUserMedia({
	audio: true, //ハウリング防止のため
	video: true
}, function (stream) {
	var video = document.createElement('video');
	video.src = window.URL.createObjectURL(stream);
	video.autoplay = true;
	document.body.appendChild(video);
}, function (err) {
	console.log(err);
});

//var peer = new Peer({key: 'API key'});
var peer = new Peer({
	key: '9c3b3585-c22d-4012-951a-cda1997a691b'
}); // PeerJSのサイトで取得したAPI keyを設定

peer.on('open', function (id) {
	console.log(id);
});

function callTo(peerId) {
	var call = peer.call(peerId, myStream);

	call.on('stream', function (othersStream) {
		$('#others-video').prop('src', URL.createObjectURL(othersStream));
	});
}

peer.on('call', function (call) {
	call.answer(myStream);

	call.on('stream', function (othersStream) {
		$('#others-video').prop('src', URL.createObjectURL(othersStream));
	});
});



< !DOCTYPE html >
	< html lang = "ja" >
	< head >
	< meta charset = "UTF-8" / >
	< title > ビデオチャット < /title> < style >
	* {
		padding: 0;
		margin: 0;
	}
body {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: url(images / IMG_2214.jpg) no - repeat center center fixed;
	background - size: cover;
	color: #fff;
}#
others - video {
		border: 6 px solid #68a;
margin-left: 10%;
}
# video {

				border - radius: 10 px;
				border: 6 px solid #66aa9a;
/*				position: fixed;
width: 100px;
height: 100px;
left: 50%;
top: 10px;
margin-left: -50px;*/
}
.videoWindow {
width: 40%;
border-radius: 10px;
}
.videoArea {
text-align: center;
}
</style>
<script type= "text/javascript"
				src = "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js" > < /script>
					<!--<script src="http://cdn.peerjs.com/0.3/peer.min.js"></script>-->
					< script src = "https://skyway.io/dist/0.3/peer.js" > < /script> < script >
					navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

				var myStream;
				//var peer = new Peer({key: 'u60h2h5eb9ms4i'});//peerjsのサイトで取得したAPI KEYを指定（クラウド上のPeerServerを利用するためのAPIキーです。）var peer = new Peer([id], [options]);[id]string他のピアがこのピアへ接続するときに使われるIDです。もしIDが指定されない場合、ブローカサーバがIDを生成します。
				var peer = new Peer({
					key: '9c3b3585-c22d-4012-951a-cda1997a691b'
				});
				var setOthersStream = function (stream) { //相手の動画を表示する為の
					$('#others-video').prop('src', URL.createObjectURL(stream));
				};

				var setMyStream = function (stream) {
					myStream = stream;
					$('#video').prop('src', URL.createObjectURL(stream)); //URL.createObjectURL()はFileオブジェクトを引数に指定することでページ内で利用できるオブジェクトのURLを生成します。生成されたオブジェクトURLはページを閉じた際に破棄されます。オブジェクトURLは動画や音声ファイルなどを直接表示する際に有効でしょう
				};

				peer.on('open', function (id) { //peer.on('open', function(id) { ... });onメソッドはpeerイベントのリスナを設定します。idはブローカーIDです（コンストラクタで指定されるか、サーバによって割付けされます）。
					$('#peer-id').text(id);
				});

				peer.on('call', function (call) { //peer.on('call', function(mediaConnection) { ... });リモートのpeerがあなたに発信してきたときに発生します。mediaConnectionはこの時点でアクティブではありません。つまり、最初に応答する必要があります（mediaConnection.answer([stream]);）。その後、streamイベントをlistenできます。
					call.answer(myStream);
					call.on('stream', setOthersStream);
				});

				$(function () {
					navigator.getUserMedia({
						audio: true,
						video: true
					}, setMyStream, function () {});
					$('#call').on('click', function () {
						var call = peer.call($('#others-peer-id').val(), myStream);
						console.log(call);
						call.on('stream', setOthersStream);
					});
				});

				peer.on('error', function (e) {
					console.log(e.message);
				});
				/*document.addEventListener('click',function(event){
				var text = prompt('コメントを入力してください');
				if(text){

				}
				})*/
				< /script> < /head>

				< body >
					< p > あなたのID: < span id = "peer-id" > < /span></p >
					< div id = "dial" >
					< input type = "text"
				id = "others-peer-id"
				placeholder = "相手のIDを入力" / > < button id = "call" > コール < /button> < /div> < div class = "videoArea" >
					<!--		<video id="video" class="videoWindow" autoplay muted></video>-->
					< video id = "video"
				class = "videoWindow"
				autoplay muted > < /video> < video id = "others-video"
				class = "videoWindow"
				autoplay > < /video> < /div> < /body> < /html>