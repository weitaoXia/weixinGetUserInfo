<?php
$appid = "wx319d9c74146da371";  
$secret = "eed63f5028903195173245452101837b"; 
$code = $_GET["code"];
 
//第一步:取全局access_token
$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$secret";
$token = getJson($url);
 
//第二步:取得openid
$oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code";
$oauth2 = getJson($oauth2Url);
  
//第三步:根据全局access_token和openid查询用户信息  
$access_token = $token["access_token"];  
$openid = $oauth2['openid'];  
$get_user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=$openid&lang=zh_CN";
$userinfo = getJson($get_user_info_url);
 
//打印用户信息
$name = $userinfo[nickname];
$headImg = $userinfo[headimgurl];
$sex = $userinfo[sex];
$city = $userinfo[city]; 

if($userinfo[subscribe] === 1){
   
}else{
    header("Location: http://zt.berui.com/weChat/guanzhu.html"); 
}

echo $subscribe_msg;
function getJson($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    curl_close($ch);
    return json_decode($output, true);
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>你能搞到多少香菇？？？</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width,target-densitydpi=device-dpi" />
		<script src="http://libs.baidu.com/zepto/1.1.4/zepto.min.js"></script>
		<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
		<script src="img/wxcommon.min926.js"></script>
		<script src="img/createjs.js" type="text/javascript" charset="utf-8"></script>
		<script src="img/head.js"></script>
		<link rel="stylesheet" href="img/style.css">
	</head>

	<body onLoad="init()">
		<div id="wx_pic" style="margin:0 auto;display:none">
			<img src="img/300.jpg">
		</div>
		<div id="GameScoreLayer" class="BBOX SHADE bgc1" style="display:none;">
			<div style="padding:0 5%;">
				<span><?php echo $name?></span><span id="GameScoreLayer-text"></span><br/>
				<!--<div id="GameScoreLayer-score"style="margin-bottom:1em;">香菇</div>-->
				<!--<div id="GameScoreLayer-bast">最佳</div>--><br/>
				<div><img src="<?php echo $headImg?>" style="width: 160px;height: 160px;border-radius: 160px;"></div><br/>
				<div id="GameScoreLayer-btn" class="BOX">
					<div class="btn BOX-S" onclick="replayBtn()">重来</div>&nbsp;
					<div class="btn BOX-S" onclick="share()">分享到朋友圈</div>&nbsp;</div><br/>
				<div id="GameScoreLayer-share" class="BOX">
					<div id="mebtn" class="btn BOX-S" onclick="window.open(mebtnopenurl)">更多好玩</div>
				</div>
				<div id="toushu">投诉</div>
			</div>
		</div>
		<div class="container" id="container" style="display:none">
			<div class="page input js_show">
				<div class="page__bd">
					<div class="weui-cells__title">请选择投诉该网页的原因</div>
					<div class="weui-cells weui-cells_checkbox"><label class="weui-cell weui-check__label" for="s10"><div class="weui-cell__hd"><input type="checkbox"name="checkbox1"class="weui-check"id="s10"><i class="weui-icon-checked"></i></div><div class="weui-cell__bd"><p>网页包含不适当的内容对我造成骚扰</p></div></label><label class="weui-cell weui-check__label" for="s11"><div class="weui-cell__hd"><input type="checkbox"name="checkbox1"class="weui-check"id="s11"><i class="weui-icon-checked"></i></div><div class="weui-cell__bd"><p>网页包含诱导分享性质的内容</p></div></label><label class="weui-cell weui-check__label" for="s12"><div class="weui-cell__hd"><input type="checkbox"name="checkbox1"class="weui-check"id="s12"><i class="weui-icon-checked"></i></div><div class="weui-cell__bd"><p>网页可能包含谣言信息</p></div></label></div>
					<div class="weui-btn-area">
						<a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">确定</a>
					</div>
				</div>
			</div>
		</div>
		<div id="welcome" class="SHADE BOX-M">
			<div class="welcome-bg FILL"></div>
			<div class="FILL BOX-M" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:5;">
				<div style="margin:0 8% 0 9%;">
					<div style="font-size:2.6em; color:#FEF002;">你能摘到多少只香菇？</div><br/>
					<div style="font-size:2.2em; color:#fff; line-height:1.5em;">从最下面的蓝瘦开始，<br/>20秒内看你能摘到多少个</div><br/><br/>
					<div id="ready-btn" class="btn loading" style="display:inline-block; margin:0 auto; width:8em; height:1.7em; line-height:1.7em; font-size:2.2em; color:#fff;"></div>
				</div>
			</div>
		</div>
		<div id="landscape" class="SHADE BOX-M" style="background:rgba(0,0,0,.9);">
			<div class="welcome-bg FILL"></div>
			<div id="landscape-text" style="color:#fff;font-size:3em;">请竖屏玩耍</div>
		</div>
		<div id="share-wx">
			<p style="text-align: right; padding-left: 10px;"><img src="img/2000.png" id="share-wx-img" style="max-width: 280px; padding-right: 25px;"></p>
		</div>
		<script src="img/s.js"></script>
		
	</body>

</html>
