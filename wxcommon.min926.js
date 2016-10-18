var wxData = {
        isGetUser: !1,
        user: null,
        friend: null
    },
    prefix = "http://www.kuashou.com/Action/Action/",
    dataUrl = {
        guanzhu: "guanzhu.php",
        answer: "answer.php",
        getMyAnswer: "getMyAnswer.php",
        isShare: "share_num.php",
        oath: "isOath.php",
        getUser: "queryUsers.php",
        shareToTongyi: "share.php"
    };
for (k in dataUrl) {
    if (dataUrl[k].indexOf("http") < 0) {
        dataUrl[k] = prefix + dataUrl[k]
    }
}
window.weixin = {
    openid: ""
};
console.log(1111);

function isSubscribe(b) {
    var a = 0;
    wxData.isGetUser ? "" : getUser(b);
    a = wxData.user.subscribe;
    return a
}

function getLongOpenid(b, c) {
    if (isEmpty(c)) {
        c = 864000
    }
    $hostname = window.location.hostname;
    if ($hostname.indexOf("kuashou.com") >= 0) {
        var a = getUrlParameterByName("openid");
        if (!isEmpty(a)) {
            setCookie("openid", a, c, "/", "")
        } else {
            if (!isEmpty(getCookie("openid"))) {
                a = getCookie("openid")
            } else {
                a = oath(b);
                if (!isEmpty(a)) {
                    setCookie("openid", a, c, "/", "")
                }
            }
        } if (isEmpty(a)) {
            checkLogin()
        } else {
            return a
        }
    } else {
        var a = getUrlParameterByName("openid");
        if (!isEmpty(a)) {
            setCookie("openid", a, c, "/", "")
        } else {
            a = getCookie("openid")
        } if (isEmpty(a)) {
            checkCrossLogin()
        } else {
            return a
        }
    }
}

function getOpenid(b, c) {
    if (isEmpty(c) || c > 0) {
        return getLongOpenid(b, c)
    } else {
        if (c == 0) {
            $hostname = window.location.hostname;
            if ($hostname.indexOf("kuashou.com") >= 0) {
                var a;
                if (!isEmpty(b)) {
                    a = oath(b)
                }
                if (isEmpty(a)) {
                    checkLogin()
                } else {
                    return a
                }
            } else {
                var a = getUrlParameterByName("openid");
                if (isEmpty(a)) {
                    checkCrossLogin()
                } else {
                    return a
                }
            }
        }
    }
}

function extend(d, c) {
    var e;
    for (e in c) {
        if (c.hasOwnProperty(e)) {
            d[e] = c[e]
        }
    }
    return d
}

function is_weixn() {
    return false;
    var a = navigator.userAgent.toLowerCase();
    if (a.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
}

function getWxData(c) {
    var b = {
        code: getUrlParameterByName("code") || "",
        openid: getUrlParameterByName("openid") || "",
        isSubscribe: 0,
        isBangding: 0,
        isShare: 0,
        shareTimeline: 0,
        shareFriend: 0,
        user: {}
    };
    if (!is_weixn()) {
        b = {
            isWeixin: 0
        };
        return b
    }
    c = c || {};
    extend(b, c);
    if (isEmpty(b.openid)) {
        b.openid = getOpenid(b.code)
    }
    var a = getShare(b.openid, b.type);
    b.shareFriend = parseInt(a.share_num);
    b.shareTimeline = parseInt(a.share_num2);
    if (b.shareFriend > 0 || b.shareTimeline > 0) {
        b.isShare = 1
    } else {
        b.isShare = 0
    }
    wxData.isGetUser ? "" : getUser(openid);
    b.user = wxData.user;
    b.isSubscribe = parseInt(b.user.subscribe);
    b.isBangding = parseInt(b.user.bangding);
    return b
}

function getUser(b) {
    var a;
    postapi(dataUrl.getUser, {
        action: "getUser",
        openid: b,
        friendOpenid: getUrlParameterByName("friendOpenid")
    }, function(c) {
        wxData.user = c.users;
        wxData.friend = c.friend;
        wxData.isGetUser = !0
    });
    return a
}

function getFriend() {
    wxData.isGetUser ? "" : getUser(openid);
    var a = wxData.friend;
    return a
}

function answer(b, c, a) {
    var c;
    postapi(dataUrl.answer, {
        openid: b,
        answer: c,
        type: a
    }, function(d) {})
}

function getMyAnswer(b, a) {
    var c;
    postapi(dataUrl.getMyAnswer, {
        openid: b,
        type: a
    }, function(d) {
        c = d.answer
    });
    return c
}

function sendResult(b, c, a) {
    postapi(dataUrl.getUser, {
        action: "sendResult",
        openid: b,
        answer: c,
        type: a
    }, function(d) {})
}

function getShare(c, a) {
    var b = {
        share_num: 0,
        share_num2: 0
    };
    postapi(dataUrl.isShare, {
        openid: c,
        type: a
    }, function(d) {
        b.share_num = d.share_num;
        b.share_num2 = d.share_num2
    });
    return b
}

function isShare(c, a) {
    var b = 0;
    postapi(dataUrl.isShare, {
        openid: c,
        type: a
    }, function(d) {
        if (d.share_num > 0 || d.share_num2 > 0) {
            b = 1
        }
    });
    return b
}

function isResult(c, b) {
    var a = 0;
    postapi(dataUrl.isShare, {
        openid: c,
        type: b
    }, function(d) {
        if (d.content != null) {
            a = d.content
        }
    });
    return a
}

function isBanding(a) {
    var b = 0;
    wxData.isGetUser ? "" : getUser(a);
    b = wxData.user.isBanding;
    return b
}

function oath(b) {
    var a = "";
    postapi(dataUrl.getUser, {
        action: "isOath",
        code: b
    }, function(c) {
        a = c.openid
    });
    return a
}

function checkLogin(b) {
    var a = window.location.href.split("#")[0];
    var e = a.split("?")[0];
    var c = a.split("?")[1];
    if (c != "" && c != undefined) {
        if (c.indexOf("&code") >= 0) {
            var d = "&code=" + getUrlParameterByName("code");
            c = c.replace(d, "")
        } else {
            if (c.indexOf("code") >= 0) {
                var d = "code=" + getUrlParameterByName("code");
                c = c.replace(d, "")
            } else {
                if (c.indexOf("&state=") >= 0) {
                    var d = "&state=" + getUrlParameterByName("state");
                    c = c.replace(d, "")
                } else {
                    if (c.indexOf("state=") >= 0) {
                        var d = "state=" + getUrlParameterByName("state");
                        c = c.replace(d, "")
                    }
                }
            }
        }
    }
    uri3 = e + (c ? ("?" + encodeURI(c)) : "");
    //location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx08c72788a426b27c&redirect_uri=" + encodeURIComponent(uri3) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
}

function jump(a) {
    //window.location.href = a
}

function checkCrossLogin(b) {
    var a = location.href.split("#")[0];
    var d = a.split("?")[0];
    var c = a.split("?")[1];
    uri3 = d + (c ? ("?" + encodeURI(c)) : "");
    var a = "http://www.taimo.cn/2015/open.php?rurl=" + encodeURIComponent(uri3);
    //jump("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx08c72788a426b27c&redirect_uri=" + encodeURIComponent(a) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect")
}

function getUrlParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = new RegExp("[\\?&]" + a + "=([^&#]*)"),
        b = c.exec(location.search);
    return b === null ? "" : decodeURIComponent(b[1].replace(/\+/g, " "))
}

function postapi(url, mtparmas, callback, extra) {
    $.ajax({
        type: "POST",
        url: url,
        data: mtparmas,
        async: false,
        success: function(data) {
            if (data.ret == undefined) {
                data = eval("(" + data + ")")
            }
            if (data.ret == 13) {
                checkLogin()
            } else {
                callback(data, extra)
            }
        },
        error: function(data) {}
    })
}

function isEmpty(a) {
    if (a == "" || a == undefined || a == null) {
        return true
    } else {
        return false
    }
}

function changeLink(b) {
    if (b.indexOf("friendOpenid") < 0) {
        var a = getUrlParameterByName("openid");
        if (isEmpty(a)) {
            a = getOpenid(getUrlParameterByName("code"))
        }
        if (b.indexOf("?") >= 0) {
            b += "&friendOpenid=" + a
        } else {
            b += "?friendOpenid=" + a
        }
    }
    return b
}

function retSetWeixinShare(a) {
    if (!isEmpty(a.img)) {
        window.ShareData.img = a.img
    }
    if (!isEmpty(a.link)) {
        window.ShareData.link = a.link
    }
    if (!isEmpty(a.TimelineTitle)) {
        window.ShareData.TimelineTitle = a.TimelineTitle
    }
    if (!isEmpty(a.FriendTitle)) {
        window.ShareData.FriendTitle = a.FriendTitle
    }
    if (!isEmpty(a.FriendDesc)) {
        window.ShareData.FriendDesc = a.FriendDesc
    }
    var b = new Object();
    extend(b, a);
    if (!isEmpty(a.NormalSuccess)) {
        if (window.ShareData.tongyi == 1) {
            var c = b.NormalSuccess;
            a.NormalSuccess = function() {
                shareCommon(window.ShareData.share_opt, 0);
                c()
            }
        }
        window.ShareData.NormalSuccess = a.NormalSuccess
    }
    if (!isEmpty(a.TimelineSuccess)) {
        if (window.ShareData.tongyi == 1) {
            var c = b.TimelineSuccess;
            a.TimelineSuccess = function() {
                shareCommon(window.ShareData.share_opt, 1);
                c()
            }
        }
        window.ShareData.TimelineSuccess = a.TimelineSuccess
    }
    console.log(111);
    reset_weixin_share()
}

function getCookie(a) {
    var b = new RegExp("(^| )" + a + "(?:=([^;]*))?(;|$)"),
        c = document.cookie.match(b);
    return c ? (c[2] ? unescape(c[2]) : "") : null
}

function setCookie(b, d, a, f, c, e) {
    var g = new Date(),
        a = arguments[2] || null,
        f = arguments[3] || "/",
        c = arguments[4] || null,
        e = arguments[5] || false;
    a ? g.setMinutes(g.getMinutes() + parseInt(a)) : "";
    document.cookie = b + "=" + escape(d) + (a ? ";expires=" + g.toGMTString() : "") + (f ? ";path=" + f : "") + (c ? ";domain=" + c : "") + (e ? ";secure" : "")
}

function delCookie(a, e, c, d) {
    var b = getCookie(a);
    if (b != null) {
        var f = new Date();
        f.setMinutes(f.getMinutes() - 1000);
        e = e || "/";
        document.cookie = a + "=;expires=" + f.toGMTString() + (e ? ";path=" + e : "") + (c ? ";domain=" + c : "") + (d ? ";secure" : "")
    }
}

function shareCommon(b, a) {
    $.ajax({
        url: dataUrl.getUser,
        data: {
            action: "shareToTongyi",
            openid: b.openid,
            type: b.type,
            shareTo: a
        },
        dataType: "json",
        type: "POST",
        cache: false,
        success: function(c) {},
        error: function() {
            alert("抱歉，提交失败，请稍后再试")
        }
    })
}

function setWeixinShare(a) {
    if (!isEmpty(a.NormalSuccess)) {
        a.fun1 = a.NormalSuccess
    }
    if (!isEmpty(a.TimelineSuccess)) {
        a.fun2 = a.TimelineSuccess
    }
    if (!isEmpty(a.tongyi) && a.tongyi == 1) {
        if (isEmpty(a.fun1)) {
            a.fun1 = function() {
                shareCommon(a, 0)
            }
        } else {
            var d = new Object();
            extend(d, a);
            var e = d.fun1;
            a.fun1 = function() {
                shareCommon(a, 0);
                e()
            }
        } if (isEmpty(a.fun2)) {
            a.fun2 = function() {
                shareCommon(a, 1)
            }
        } else {
            var c = new Object();
            extend(c, a);
            var b = c.fun2;
            a.fun2 = function() {
                shareCommon(a, 1);
                b()
            }
        }
    } else {
        if (isEmpty(a.fun1)) {
            a.fun1 = function() {
                shareCommon(a, 0)
            };
            a.fun2 = function() {
                shareCommon(a, 1)
            }
        }
    }
    window.ShareData = {
        share_opt: a,
        tongyi: a.tongyi,
        link: a.link,
        img: a.img,
        TimelineTitle: a.TimelineTitle,
        FriendTitle: a.FriendTitle,
        FriendDesc: a.FriendDesc,
        TimelineSuccess: isEmpty(a.fun2) ? a.fun1 : a.fun2,
        NormalSuccess: a.fun1
    };
    set_weixin_share()
}

function get_broswer_info() {
    var a = navigator.userAgent.toLowerCase();
    if (a.match(/weibo/i) == "weibo") {
        return 1
    } else {
        if (a.indexOf("qq/") != -1) {
            return 2
        } else {
            if (a.match(/MicroMessenger/i) == "micromessenger") {
                var b = a.split("micromessenger")[1];
                b = b.substring(1, 6);
                b = b.split(" ")[0];
                if (b.split(".").length == 2) {
                    b = b + ".0"
                }
                if (b < "6.0.2") {
                    return 3
                } else {
                    return 4
                }
            } else {
                return 0
            }
        }
    }
}

function reset_weixin_share() {
    wx.ready(function() {
        wx.onMenuShareTimeline({
            title: window.ShareData.TimelineTitle,
            link: changeLink(window.ShareData.link),
            imgUrl: window.ShareData.img,
            success: function() {
                window.ShareData.TimelineSuccess()
            },
            cancel: function() {}
        });
        wx.onMenuShareAppMessage({
            title: window.ShareData.FriendTitle,
            desc: window.ShareData.FriendDesc,
            link: changeLink(window.ShareData.link),
            imgUrl: window.ShareData.img,
            type: "",
            dataUrl: "",
            success: function() {
                window.ShareData.NormalSuccess()
            },
            cancel: function() {}
        });
        wx.showOptionMenu()
    })
}

function set_weixin_share() {
    var broswer = get_broswer_info();
    if (broswer == 3) {
        function onBridgeReady() {
            WeixinJSBridge.call("showOptionMenu")
        }
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false)
            } else {
                if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)
                }
            }
        } else {
            onBridgeReady()
        }
        document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
            WeixinJSBridge.on("menu:share:timeline", function(argv) {
                WeixinJSBridge.invoke("shareTimeline", {
                    img_url: window.ShareData.img,
                    link: changeLink(window.ShareData.link),
                    title: window.ShareData.TimelineTitle,
                    desc: window.ShareData.TimelineTitle
                }, function(res) {
                    window.ShareData.TimelineSuccess()
                })
            });
            WeixinJSBridge.on("menu:share:appmessage", function(argv) {
                WeixinJSBridge.invoke("sendAppMessage", {
                    img_url: window.ShareData.img,
                    link: changeLink(window.ShareData.link),
                    title: window.ShareData.FriendTitle,
                    desc: window.ShareData.FriendDesc
                }, function(res) {
                    window.ShareData.NormalSuccess()
                })
            })
        }, false)
    } else {
        if (broswer == 4) {
            function contains(arr, str) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === str) {
                        return true
                    }
                }
                return false
            }
            var uri = window.location.href.split("#")[0];
            var path = uri.split("?")[0];
            var query = uri.split("?")[1];
            uri = path + (query ? ("?" + (query)) : "");
            var php_url = "http://www.kuashou.com/Action/Action/getwxjssign.php";
            $.post(php_url, {
                uri: uri
            }, function(data) {
                data = eval("(" + data + ")");
                console.log(data.appId);
                console.log(data.signature);
                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "chooseImage", "previewImage", "uploadImage", "downloadImage"]
                });
                wx.error(function(res) {})
            });
            reset_weixin_share()
        }
    }
}

function checkWebp() {
    try {
        return (document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0)
    } catch (a) {
        return false
    }
};