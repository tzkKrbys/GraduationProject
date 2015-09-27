var canvas;//canvas
var context;//context
var mouseX, mouseY;// マウスの位置座標
var canvasWidth;//canvasのwidth
var canvasHeight;//canvasのheight
// キー
var gBLeftPush = false;	// left
var gBRightPush = false;	// right
var gBUpPush = false;		// up
var gBDownPush = false;	// down
var myIcon;
var icons = [];

var socket;

var myUniqueId;

$(document).ready(function(){
//	function init() {//初期化関数
		// canvasに代入
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		// canvas非対応
		if (!canvas || !canvas.getContext) {
			alert("html5に対応していないので、実行できません");
			return false;
		}
		// キーの登録
		window.addEventListener('keydown', KeyDown, true); //キーを押した時、呼び出される関数を指定
		window.addEventListener('keyup', KeyUp, true); //キーを離した時、呼び出される関数を指定
	
		//キーを押した時
		function KeyDown(event) {
			var code = event.keyCode;       // どのキーが押されたか
			switch(code) {
				case 37:// ←キー
					gBLeftPush = true;
					break;
				case 39:// →キー
					gBRightPush = true;
					break;
				case 38:// ↑キー
					gBUpPush = true;
					break;
				case 40:// ↓キー
					gBDownPush = true;
					break;
				case 13:
					if (event.shiftKey) { // Shiftキーも押された
						myIcon.SendChat();
					}
			}
		}

		//キーを離した時
		function KeyUp(event) {
			code = event.keyCode;
			switch(code) {
				case 37:// ←キー
					gBLeftPush = false;
					break;
				case 39:// →キー
					gBRightPush = false;
					break;
				case 38:// ↑キー
					gBUpPush = false;
					break;
				case 40:// ↓キー
					gBDownPush = false;
					break;
			}
		}

		//エラー処理
		var errBack = function(e){
			console.log("Web Audio error:",e.code);
		};
		//WebAudioリクエスト成功時に呼び出されるコールバック関数
		function gotStream(stream){
			//streamからAudioNodeを作成
			var mediaStreamSource = audioContext.createMediaStreamSource(stream);
			mediaStreamSource.connect(filter);
			filter.connect(analyser);
			//出力Nodeのdestinationに接続
			analyser.connect(audioContext.destination);
			//mediaStreamSource.connect(audioContext.destination);
		}
		var audioObj = {"audio":true};
		//マイクの有無を調べる
		if(navigator.webkitGetUserMedia){
			//マイク使って良いか聞いてくる
			navigator.webkitGetUserMedia(audioObj,gotStream,errBack);
		}else{
			console.log("マイクデバイスがありません");
		}
//	};
//	init();
	socket = io.connect();
	console.log('connectしました。');
	
	
	
	
//	$('#myForm').submit(function (e) {
//		e.preventDefault();
//		socket.emit('emit_from_client', $('#msg').val());
//		console.log('emit_from_clientしました');
//		console.log($('#msg').val());
//	});

	socket.on('connect', function() {
		// クラス生成
		myIcon = new MyIcon();		// クラス
		myIcon.Init( canvasWidth/2, canvasHeight/2 ); //初期化メソッド実行(初期の位置を引数に渡してcanvas要素中央に配置)
//		myUniqueId = socket.id;
		
		//socket.emit('emit_from_client_join', {uniqueId:socket.id, pos});
		socket.on('emit_from_server_join', function(data) {
			console.log(data);
		});
//		myIcon.uniqueId = myUniqueId;
//		console.log(myIcon);
//		socket.emit('client_from_emit_joinIcon', myIcon);//iconをサーバーに送る

		
//		socket.on('server_from_emit_iconAdd', function (data) {//icons配列を受け取る
//			console.log(data);
//			icons = data;
//			for(var i = 0; i < data.length; i++) {
//				if(data[i].uniqueId === myUniqueId) {
//					console.log('発見！' + data[i]);
//					console.log(data[i]);
//					console.log(myIcon);
//				}
//			}
//		});
	});
//	$("#mkIconBtn").on('click', function (e) {
//		var data = 'aaa';
//		socket.emit('emit_from_client_mkIconBtn', data);
//		console.log(data);
//	});

//	$('#button').on("click",function(){
//		myIcon.SendChat();
//	});


//	$(document).on("keydown", function(e) {
//		if (e.keyCode == 13) { // Enterが押された
//			$.noop();//何もしないことを明示的に記述
//			if (e.shiftKey) { // Shiftキーも押された
//				myIcon.SendChat();
//			}
//		} else {
//			$.noop();//何もしないことを明示的に記述
//		}
//	});






	//canvas要素にイベント設定----------------------s
	canvas.onmousedown = function () {
		if(myIcon) {
			myIcon.beginDrag();
		}
	};
	canvas.onmousemove = function () {
		mousePos(event);//mouseX,mouseY座標を取得
		if(myIcon) {
			myIcon.drag();
		}
	};
	canvas.onmouseup = function () {
		if(myIcon) {
			myIcon.endDrag();
		}
	};

	//レンダリング関数-----------------------------------------------------
	window.requestNextAnimationFrame = (function () {
		var originalWebkitRequestAnimationFrame = undefined,
			wrapper = undefined,
			callback = undefined,
			geckoVersion = 0,
			userAgent = navigator.userAgent,
			index = 0,
			self = this;
		if (window.webkitRequestAnimationFrame) {
			wrapper = function (time) {
				if (time === undefined) {
					time = +new Date();
				}
				self.callback(time);
			};
			// Make the switch
			originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;
			window.webkitRequestAnimationFrame = function (callback, element) {
				self.callback = callback;
				// Browser calls the wrapper and wrapper calls the callback
				originalWebkitRequestAnimationFrame(wrapper, element);
			}
		}
		if (window.mozRequestAnimationFrame) {
			index = userAgent.indexOf('rv:');
			if (userAgent.indexOf('Gecko') != -1) {
				geckoVersion = userAgent.substr(index + 3, 3);
				if (geckoVersion === '2.0') {
					window.mozRequestAnimationFrame = undefined;
				}
			}
		}

		return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||

			function (callback, element) {
			var start,
				finish;

			window.setTimeout( function () {
				start = +new Date();
				callback(start);
				finish = +new Date();
				self.timeout = 1000 / 60 - (finish - start);
			}, self.timeout);
		};
	})();
	//レンダリング関数終了-----------------------------------------------------
	
	function animate(now) {//レンダリング関数
		//符号なし8bitArrayを生成
		var data = new Uint8Array(analyser.frequencyBinCount);
		//周波数データ
		analyser.getByteFrequencyData(data);
		//console.log(data);
		var volume = false;
		for(var i = 0; i < data.length; ++i) {
			//上部の描画
			//			context2.fillRect(i*5, 0, 5, data[i]*2);
			//下部の描画
			//			context2.fillRect(i*5, h, 5, -data[i]*2);
			//console.log( data[i] > 100 );
			if(data[i] > 200){
				volume = true;
			}
		}
		if( volume ){
			myIcon.countVoice = 100;
		}
		
		//	Draw
		//	描画
		function Draw(){
			context.fillStyle = "rgb(255,255,255)";// 白に設定。CanvasRenderingContext2Dオブジェクト
			context.clearRect(0,0,canvasWidth,canvasHeight);// 塗りつぶし。CanvasRenderingContext2Dオブジェクト
			if(myIcon) {
				myIcon.Draw(context,0,0); //myIconオブジェクトの描画メソッド呼出(CanvasRenderingContext2Dオブジェクト,イメージオブジェクト,0,0)
				myIcon.DrawChat(); //myIconオブジェクトの描画メソッド呼出(CanvasRenderingContext2Dオブジェクト,str)
				if(myIcon.countVoice){
					context.globalAlpha = myIcon.countVoice * 3 / 1000;
					context.fillStyle = "#ff0";
					context.beginPath();
					//円の設定（X中心軸,Y中心軸、半径、円のスタート度、円のエンド度、回転）
					//		context.arc(oldX, oldY, Math.sqrt(Math.pow(px, 2) + Math.pow(py, 2)), 0, Math.PI * 2, false); // full circle
					context.arc(myIcon.PosX, myIcon.PosY, 140, 0, Math.PI * 2, false); // full circle
					context.fill();
					context.globalAlpha = 1;
					myIcon.countVoice--;
				}
			}

		}
		Draw();		// 描画
		if(myIcon) {
			myIcon.Move(gBRightPush,gBLeftPush,gBUpPush,gBDownPush);//アイコンを動かす
		}
		requestNextAnimationFrame(animate);//描画がloopする
	}
	requestNextAnimationFrame(animate);		// loopスタート


	$('.micGainFxEmu').on("click",function(){
		myIcon.countVoice = 100;
	});







	function mousePos(event) {// マウスの座標の取得
		// Canvasの左上のウィンドウ上での座標
//		var ele = document.getElementById('canvas');
		var bounds = canvas.getBoundingClientRect();//エレメントの絶対座標値を取得。戻り値はオブジェクトで左の座標値はleft、上の座標値はtopプロパティに入る
		var offsetX = bounds.left;
		var offsetY = bounds.top;

		// マウスが押された座標を取得
		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;
	}







	var audioContext = new webkitAudioContext();
	//フィルター
	var filter = audioContext.createBiquadFilter();
	filter.type = 0;
	filter.frequency.value = 440;
	//analyserオブジェクトの生成
	var analyser = audioContext.createAnalyser();


});