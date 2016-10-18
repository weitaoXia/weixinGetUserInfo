<?php
//scope=snsapi_base 实例
$appid='wx319d9c74146da371';
$redirect_uri = urlencode ( 'http://zt.berui.com/wChat/gzGetUserInfo.php' );
$url ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=$appid&redirect_uri=$redirect_uri&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
header("Location:".$url);
?>
