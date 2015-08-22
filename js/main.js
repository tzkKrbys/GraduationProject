$(document).ready(function(){
	var mouseX, mouseY;// マウスの位置座標
	var canvas;//canvas
	var context;//context
	var canvas_w;//canvasのwidth
	var canvas_h;//canvasのheight
	// キー
	var g_bLeftPush = false;	// left
	var g_bRightPush = false;	// right
	var g_bUpPush = false;		// up
	var g_bDownPush = false;	// down
	//texture
	var my_icon_tex;
	//クラス
	var my_icon;
	//	onload
	//	最初に呼び出される関数
	onload = function () {
		// canvasに代入
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas_w = canvas.width;
		canvas_h = canvas.height;
		// canvas非対応
		if (!canvas || !canvas.getContext) {
			alert("html5に対応していないので、実行できません");
			return false;
		}



		// クラス生成
		my_icon = new My_icon();		// マリオクラス
		my_icon.Init( canvas_w/2, canvas_h/2 ); //初期化メソッド実行(初期の位置を引数に渡してcanvas要素中央に配置)

		LoadTex();           // texture load//imgのオブジェクトを生成
		requestNextAnimationFrame(animate);		// loopスタート
		// キーの登録
		window.addEventListener('keydown', KeyDown, true); //キーを押した時、呼び出される関数を指定
		window.addEventListener('keyup', KeyUp, true); //キーを離した時、呼び出される関数を指定

		canvas.onmousedown = beginDrag;
		canvas.onmousemove = drag;
		canvas.onmouseup = endDrag;
	};



	//	LoadTex
	//	アイコン画像のロード
	function LoadTex(){
		my_icon_tex = new Image();
		my_icon_tex.src = "../img/circleParis.png";
	}

	function animate(now) {//レンダリング関数
		Draw();		// 描画
		my_icon.Move(g_bRightPush,g_bLeftPush,g_bUpPush,g_bDownPush);//アイコンを動かす
		requestNextAnimationFrame(animate);//描画がloopする
	}

	//	Draw
	//	描画
	function Draw(){
		context.fillStyle = "rgb(255,255,255)";// 黒に設定。CanvasRenderingContext2Dオブジェクト
		context.clearRect(0,0,canvas_w,canvas_h);// 塗りつぶし。CanvasRenderingContext2Dオブジェクト
		my_icon.Draw(context,my_icon_tex,0,0); //my_iconオブジェクトの描画メソッド呼出(CanvasRenderingContext2Dオブジェクト,イメージオブジェクト,0,0)
		my_icon.DrawChat(str); //my_iconオブジェクトの描画メソッド呼出(CanvasRenderingContext2Dオブジェクト,str)
	}


	//キーを押した時
	function KeyDown(event) {
		var code = event.keyCode;       // どのキーが押されたか
		switch(code) {
				// ←キー
			case 37:
				g_bLeftPush = true;
				break;
				// →キー
			case 39:
				g_bRightPush = true;
				break;
				// ↑キー
			case 38:
				g_bUpPush = true;
				break;
				// ↓キー
			case 40:
				g_bDownPush = true;
				break;
		}
	}

	//キーを離した時
	function KeyUp(event) {
		code = event.keyCode;
		switch(code) {
				// ←キー
			case 37:
				g_bLeftPush = false;
				break;
			case 39:
				// →キー
				g_bRightPush = false;
				break;
			case 38:
				// ↑キー
				g_bUpPush = false;
				break;
			case 40:
				// ↓キー
				g_bDownPush = false;
				break;
		}
	}




	function mousePos(event) {// マウスの座標の取得
		// Canvasの左上のウィンドウ上での座標
		var ele = document.getElementById('canvas');
		var bounds = ele.getBoundingClientRect();//エレメントの絶対座標値を取得。戻り値はオブジェクトで左の座標値はleft、上の座標値はtopプロパティに入る
		var offsetX = bounds.left;
		var offsetY = bounds.top;

		// マウスが押された座標を取得
		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;

		// 円の上にあるかチェック
		var len = Math.sqrt(( mouseX - my_icon.PosX ) * ( mouseX - my_icon.PosX ) + ( mouseY - my_icon.PosY ) * ( mouseY - my_icon.PosY ));
		if (len <= my_icon.radius) {
			my_icon.onObj = true;
		} else {
			my_icon.onObj = false;
		}
	}

	function beginDrag(event) {
		mousePos(event);
		if (my_icon.onObj) {// マウスが円の上ならばドラッグ開始
			my_icon.dragging = true;
			my_icon.relX = my_icon.PosX-mouseX;
			my_icon.relY = my_icon.PosY-mouseY;
			canvas.style.cursor="move";//マウスカーソルの変更
		}
	}
	function drag(event) {
		mousePos(event);
		if (my_icon.dragging) {//ドラッグ中ならばアイコンを移動
			my_icon.PosX = mouseX + my_icon.relX;
			my_icon.PosY = mouseY + my_icon.relY;
			my_icon.Draw(context,my_icon_tex,0,0);
			//		draw();
		}
		else {
			if (my_icon.onObj && canvas.style.cursor != "pointer") {
				canvas.style.cursor="pointer";
			}
			if (!my_icon.onObj && canvas.style.cursor == "pointer") {
				canvas.style.cursor="default";
			}
		}
	}

	function endDrag(event) {
		my_icon.dragging = false;//ドラッグ終了
		canvas.style.cursor="default";
	}

	window.requestNextAnimationFrame =
		(function () {
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


	//My_iconクラス
	function My_icon(){
		// 変数(座標)
		this.PosX;					// x座標
		this.PosY;					// y座標
		this.AddNumX;				// x座標移動加算量
		this.AddNumY;				// y座標移動加算量
		this.radius = 20;			// 円の半径
		this.relX;					// 円の中心とマウスの相対位置
		this.relY;					// 円の中心とマウスの相対位置
		this.dragging = false;//ドラッグ中かどうか
		this.onObj = false;//マウスがアイコンに乗っかってるかどうか
	}

	/*初期化関数*/
	My_icon.prototype.Init = function(x,y){
		this.PosX = x;
		this.PosY = y;
		this.AddNumX = 4/*2*/;
		this.AddNumY = 4;
	}

	/*描画*/
	My_icon.prototype.Draw = function(img,tex,offsetX,offSetY){ //引数 … CanvasRenderingContext2Dオブジェクト,イメージオブジェクト,0,0
		img.save(); //現在の描画スタイル状態を一時的に保存//context . save() 現在の状態をスタックの最後に加えます。
		img.transform(-1, 0, 0, 1, 0, 0);//context . transform(m11, m12, m21, m22, dx, dy)下記の通りに引数に指定されたマトリックスを適用して、変換マトリックスを変更します。
		img.drawImage(tex, 0, 0, 160, 160, -this.PosX - this.radius, this.PosY - this.radius, this.radius * 2, this.radius * 2);//drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
		img.restore();//context . restore() スタックの最後の状態を抜き出し、その状態をコンテキストに復元します。
	}

	/*動き*/
	My_icon.prototype.Move = function(bRight,bLeft,bUp,bDown){
		// 右キーが押された
		if(bRight)
		{
			this.PosX += this.AddNumX;
		}
		// 左キーが押された
		else if(bLeft)
		{
			this.PosX -= this.AddNumX;
		}
		// 上キーが押された
		if(bUp) {
			this.PosY -= this.AddNumY;
		}
		// 下キーが押された
		else if(bDown) {
			this.PosY += this.AddNumY;
		}
		if(this.PosX < 0){
			this.PosX = 4;
		}else if(this.PosX > canvas_w){
			this.PosX = canvas_w - 4;
		}
		if(this.PosY < 0){
			this.PosY = 4;
		}else if(this.PosY > canvas_h){
			this.PosY = canvas_h - 4;
		}
	}
	//チャットの文字描画の為のメソッド
	My_icon.prototype.DrawChat = function(str){
		if(chatShowCount > 0){
			chatShowCount--;
			//カラー指定
			context.fillStyle = '#fff';
			//fontサイズ、書式
			context.font = "16px _sans";
			context.strokeStyle = '#fff';
			//文字の設置位置
			context.textBaseline = "top"; //top,middle,bottom...
			//表示文字と座標
			context.fillText(str, this.PosX, this.PosY); //ctx.fillText(文字列,x,y)
		}
	}

	var str;
	var chatShowCount;

	$('#button').on("click",function(){

		str = $('textarea').val();
		my_icon.DrawChat(str);
		chatShowCount = 500;
		$('textarea').val("");
		return false;
	});

	$(document).on("keydown", function(e) {
		if (e.keyCode == 13) { // Enterが押された
			$.noop();//何もしないことを明示的に記述
			if (e.shiftKey) { // Shiftキーも押された
				str = $('textarea').val();
				my_icon.DrawChat(str);
				chatShowCount = 500;
				$('textarea').val("");
				return false;
			}
		} else {
			$.noop();//何もしないことを明示的に記述
		}
	});
});