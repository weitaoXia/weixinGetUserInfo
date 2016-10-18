var g = {
	type: "xianggu",
	link: "",
	shareImg: "img/b.jpg",
	isSubscribe: 0,
	num: 0,
	result: 0,
};
if(is_weixn()) {
	var code = getUrlParameterByName("code");
	g.openid = getOpenid(code);
	g.isSubscribe = isSubscribe(g.openid);
	if(g.isSubscribe == 1) {
		$("#GameScoreLayer-share").hide()
	}
}
setWeixinShare({
	type: g.type,
	openid: g.openid,
	tongyi: 1,
	link: g.link,
	img: g.shareImg,
	TimelineTitle: "你摘了多少只香菇？看看有多蓝瘦！这游戏太魔性了",
	FriendTitle: "这游戏太魔性了",
	FriendDesc: "你摘了多少只香菇？看看有多蓝瘦！",
	fun1: function() {},
	fun2: function() {}
});
if(isDesktop) {
	document.write('<div id="gameBody">')
}
var body, blockSize, GameLayer = [],
	GameLayerBG, touchArea = [],
	GameTimeLayer;
var transform, transitionDuration;

function init(a) {
	showWelcomeLayer();
	body = document.getElementById("gameBody") || document.body;
	body.style.height = window.innerHeight + "px";
	transform = typeof(body.style.webkitTransform) != "undefined" ? "webkitTransform" : (typeof(body.style.msTransform) != "undefined" ? "msTransform" : "transform");
	transitionDuration = transform.replace(/ransform/g, "ransitionDuration");
	GameTimeLayer = document.getElementById("GameTimeLayer");
	GameLayer.push(document.getElementById("GameLayer1"));
	GameLayer[0].children = GameLayer[0].querySelectorAll("div");
	GameLayer.push(document.getElementById("GameLayer2"));
	GameLayer[1].children = GameLayer[1].querySelectorAll("div");
	GameLayerBG = document.getElementById("GameLayerBG");
	if(GameLayerBG.ontouchstart === null) {
		GameLayerBG.ontouchstart = gameTapEvent
	} else {
		GameLayerBG.onmousedown = gameTapEvent;
		document.getElementById("landscape-text").innerHTML = "点我开始玩耍";
		document.getElementById("landscape").onclick = winOpen
	}
	gameInit();
	window.addEventListener("resize", refreshSize, false);
	setTimeout(function() {
		var b = document.getElementById("ready-btn");
		b.className = "btn";
		b.innerHTML = " 预备，上！";
		b.style.backgroundColor = "#F00";
		b.onclick = function() {
			closeWelcomeLayer()
		}
	}, 500)
}

function winOpen() {
	window.open(location.href + "?r=" + Math.random(), "nWin", "height=500,width=320,toolbar=no,menubar=no,scrollbars=no");
	var a = window.open("about:blank", "_self");
	a.opener = null;
	a.close()
}
var refreshSizeTime;

function refreshSize() {
	clearTimeout(refreshSizeTime);
	refreshSizeTime = setTimeout(_refreshSize, 200)
}

function _refreshSize() {
	countBlockSize();
	for(var e = 0; e < GameLayer.length; e++) {
		var k = GameLayer[e];
		for(var d = 0; d < k.children.length; d++) {
			var h = k.children[d],
				c = h.style;
			c.left = (d % 4) * blockSize + "px";
			c.bottom = Math.floor(d / 4) * blockSize + "px";
			c.width = blockSize + "px";
			c.height = blockSize + "px"
		}
	}
	var l, b;
	if(GameLayer[0].y > GameLayer[1].y) {
		l = GameLayer[0];
		b = GameLayer[1]
	} else {
		l = GameLayer[1];
		b = GameLayer[0]
	}
	var m = ((_gameBBListIndex) % 10) * blockSize;
	l.y = m;
	l.style[transform] = "translate3D(0," + l.y + "px,0)";
	b.y = -blockSize * Math.floor(l.children.length / 4) + m;
	b.style[transform] = "translate3D(0," + b.y + "px,0)"
}

function countBlockSize() {
	blockSize = body.offsetWidth / 4;
	body.style.height = window.innerHeight + "px";
	GameLayerBG.style.height = window.innerHeight + "px";
	touchArea[0] = window.innerHeight - blockSize * 0;
	touchArea[1] = window.innerHeight - blockSize * 3
}
var _gameBBList = [],
	_gameBBListIndex = 0,
	_gameOver = false,
	_gameStart = false,
	_gameTime, _gameTimeNum, _gameScore;

function gameInit() {
	createjs.Sound.registerSound({
		src: "img/1.mp3",
		id: "err"
	});
	createjs.Sound.registerSound({
		src: "img/2.mp3",
		id: "end"
	});
	createjs.Sound.registerSound({
		src: "img/3.mp3",
		id: "tap"
	});
	gameRestart()
}

function gameRestart() {
	console.log("gameRestart");
	_gameBBList = [];
	_gameBBListIndex = 0;
	_gameScore = 0;
	_gameOver = false;
	_gameStart = false;
	_gameTimeNum = 2000;
	GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
	countBlockSize();
	refreshGameLayer(GameLayer[0]);
	refreshGameLayer(GameLayer[1], 1)
}

function gameStart() {
	_gameStart = true;
	_gameTime = setInterval(gameTime, 10)
}

function gameOver() {
	_gameOver = true;
	clearInterval(_gameTime);
	setTimeout(function() {
		GameLayerBG.className = "";
		showGameScoreLayer()
	}, 1500);
	console.log(shareText(_gameScore));
	var a = shareText(_gameScore).replace("<br/><br/>", "");
	retSetWeixinShare({
		result: g.type,
		openid: g.openid,
		tongyi: 1,
		link: g.link,
		img: g.shareImg,
		TimelineTitle: a,
		FriendTitle: "不服来测！",
		FriendDesc: a,
		fun1: function() {},
		fun2: function() {}
	})
}

function gameTime() {
	_gameTimeNum--;
	if(_gameTimeNum <= 0) {
		GameTimeLayer.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;时间到！";
		gameOver();
		GameLayerBG.className += " flash";
		createjs.Sound.play("end")
	} else {
		GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum)
	}
}

function creatTimeText(b) {
	var a = (100000 + b + "").substr(-4, 4);
	a = "&nbsp;&nbsp;" + a.substr(0, 2) + "'" + a.substr(2) + "''";
	return a
}
var _ttreg = / t{1,2}(\d+)/,
	_clearttClsReg = / t{1,2}\d+| bad/;

function refreshGameLayer(f, a, h) {
	var d = Math.floor(Math.random() * 1000) % 4 + (a ? 0 : 4);
	for(var c = 0; c < f.children.length; c++) {
		var e = f.children[c],
			b = e.style;
		b.left = (c % 4) * blockSize + "px";
		b.bottom = Math.floor(c / 4) * blockSize + "px";
		b.width = blockSize + "px";
		b.height = blockSize + "px";
		e.className = e.className.replace(_clearttClsReg, "");
		if(d == c) {
			_gameBBList.push({
				cell: d % 4,
				id: e.id
			});
			e.className += " t" + (Math.floor(Math.random() * 1000) % 5 + 1);
			e.notEmpty = true;
			d = (Math.floor(c / 4) + 1) * 4 + Math.floor(Math.random() * 1000) % 4
		} else {
			e.notEmpty = false
		}
	}
	if(a) {
		f.style.webkitTransitionDuration = "0ms";
		f.style.display = "none";
		f.y = -blockSize * (Math.floor(f.children.length / 4) + (h || 0)) * a;
		setTimeout(function() {
			f.style[transform] = "translate3D(0," + f.y + "px,0)";
			setTimeout(function() {
				f.style.display = "block"
			}, 100)
		}, 200)
	} else {
		f.y = 0;
		f.style[transform] = "translate3D(0," + f.y + "px,0)"
	}
	f.style[transitionDuration] = "150ms"
}

function gameLayerMoveNextRow() {
	for(var a = 0; a < GameLayer.length; a++) {
		var b = GameLayer[a];
		b.y += blockSize;
		if(b.y > blockSize * (Math.floor(b.children.length / 4))) {
			refreshGameLayer(b, 1, -1)
		} else {
			b.style[transform] = "translate3D(0," + b.y + "px,0)"
		}
	}
}

function gameTapEvent(d) {
	if(_gameOver) {
		return false
	}
	var b = d.target;
	var f = d.clientY || d.targetTouches[0].clientY,
		a = (d.clientX || d.targetTouches[0].clientX) - body.offsetLeft,
		c = _gameBBList[_gameBBListIndex];
	if(f > touchArea[0] || f < touchArea[1]) {
		return false
	}
	if((c.id == b.id && b.notEmpty) || (c.cell == 0 && a < blockSize) || (c.cell == 1 && a > blockSize && a < 2 * blockSize) || (c.cell == 2 && a > 2 * blockSize && a < 3 * blockSize) || (c.cell == 3 && a > 3 * blockSize)) {
		if(!_gameStart) {
			gameStart()
		}
		createjs.Sound.play("tap");
		b = document.getElementById(c.id);
		b.className = b.className.replace(_ttreg, " tt$1");
		_gameBBListIndex++;
		_gameScore++;
		gameLayerMoveNextRow()
	} else {
		if(_gameStart && !b.notEmpty) {
			createjs.Sound.play("err");
			gameOver();
			b.className += " bad"
		}
	}
	return false
}

function createGameLayer() {
	var d = '<div id="GameLayerBG">';
	for(var c = 1; c <= 2; c++) {
		var e = "GameLayer" + c;
		d += '<div id="' + e + '" class="GameLayer">';
		for(var b = 0; b < 10; b++) {
			for(var a = 0; a < 4; a++) {
				d += '<div id="' + e + "-" + (a + b * 4) + '" num="' + (a + b * 4) + '" class="block' + (a ? " bl" : "") + '"></div>'
			}
		}
		d += "</div>"
	}
	d += "</div>";
	d += '<div id="GameTimeLayer"></div>';
	return d
}

function closeWelcomeLayer() {
	var a = document.getElementById("welcome");
	a.style.display = "none"
}

function showWelcomeLayer() {
	var a = document.getElementById("welcome");
	a.style.display = "block"
}

function showGameScoreLayer() {
	var a = document.getElementById("GameScoreLayer");
	var d = document.getElementById(_gameBBList[_gameBBListIndex - 1].id).className.match(_ttreg)[1];
	a.className = a.className.replace(/bgc\d/, "bgc" + d);
	document.getElementById("GameScoreLayer-text").innerHTML = shareText(_gameScore);
	var b = cookie("bast-score");
	if(!b || _gameScore > b) {
		b = _gameScore;
		cookie("bast-score", b, 100)
	}
	a.style.display = "block"
}

function hideGameScoreLayer() {
	var a = document.getElementById("GameScoreLayer");
	a.style.display = "none"
}

function replayBtn() {
	gameRestart();
	hideGameScoreLayer()
}

function backBtn() {
	gameRestart();
	hideGameScoreLayer();
	showWelcomeLayer()
}

function shareText(a) {
	var result = '';
	if(a <= 49) {
		result += "一共摘了" + a + "只香菇！好蓝瘦~";
	} else if(a <= 99) {
		result += "一共摘了" + a + "只香菇！好蓝瘦~";
	} else if(a <= 149) {
		result += "一共摘了" + a + "只香菇！我还是有点蓝瘦~";
	} else if(a <= 199) {
		result += "一夜" + a + "只香菇！我不蓝瘦了~";
	} else if(a <= 399) {
		result += "一夜" + a + "只香菇！我不蓝瘦了~";
	} else {
		result += "一共摘了" + a + "只香菇！好蓝瘦~";
	}

	document.title = result;
	return result;
}

function toStr(a) {
	if(typeof a == "object") {
		return JSON.stringify(a)
	} else {
		return a
	}
	return ""
}

function cookie(name, value, time) {
	if(name) {
		if(value) {
			if(time) {
				var date = new Date();
				date.setTime(date.getTime() + 86400000 * time), time = date.toGMTString()
			}
			return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ? "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") : "") : ""), !0
		}
		return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"), value = value && "string" == typeof value[1] ? unescape(value[1]) : !1, (/^(\{|\[).+\}|\]$/.test(value) || /^[0-9]+$/g.test(value)) && eval("value=" + value), value
	}
	var data = {};
	value = document.cookie.replace(/\s/g, "").split(";");
	for(var i = 0; value.length > i; i++) {
		name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]))
	}
	return data
}
document.write(createGameLayer());

function share() {
	document.getElementById("share-wx").style.display = "block";
	document.getElementById("share-wx").onclick = function() {
		this.style.display = "none"
	}
}
$("#toushu").click(function() {
	$("#container").show()
});
$(".weui-check__label").click(function() {
	$(this).find(".weui-check").attr("checked", "checked");
	$(this).find("p").css("color", "green")
});
$("#showTooltips").click(function() {
	$("#toushu").hide();
	$("#container").hide()
});