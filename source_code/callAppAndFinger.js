/**
 * callApp(clickTarget 触发点父级, e_href 计费打点链接, deeplinkurl 深度链接  ios中唤起APP, //唤起失败统计链接, //唤起失败 跳到落地页);
 * sendTrack(boolean true 不区分浏览器可用于跟app匹配  不同的浏览器判断为不同的用户, function 回调，用于发送{uuid:canvas信息,info:系统信息}到服务端的信息)
 * 判断是app否和网页是同一个用户时，需要sendTrack 参数0传递true 且在app中加载同一个页面 同样的内核打开
 * 
 */
//360唤起APP方案
/**
 * 获取 browser 信息
 */
function getBrowser() {
    var ua = window.navigator.userAgent || '';
    var isAndroid = /android/i.test(ua);
    var isIos = /iphone|ipad|ipod/i.test(ua);
    var isWechat = /micromessenger\/([\d.]+)/i.test(ua);
    var isWeibo = /(weibo).*weibo__([\d.]+)/i.test(ua);
    var isQQ = /qq\/([\d.]+)/i.test(ua);
    var isQQBrowser = /(qqbrowser)\/([\d.]+)/i.test(ua);
    var isQzone = /qzone\/.*_qz_([\d.]+)/i.test(ua);

    var isOriginalChrome = /chrome\/[\d.]+ Mobile Safari\/[\d.]+/i.test(ua) && isAndroid;

    var isSafari = /safari\/([\d.]+)$/i.test(ua) && isIos && ua.indexOf('Crios') < 0 && ua
        .indexOf('Mozilla') === 0;

    return {
        isAndroid: isAndroid,
        isIos: isIos,
        isWechat: isWechat,
        isWeibo: isWeibo,
        isQQ: isQQ,
        isQQBrowser: isQQBrowser,
        isQzone: isQzone,
        isOriginalChrome: isOriginalChrome,
        isSafari: isSafari
    };
}
var browser = getBrowser();
/**
 * 获取页面隐藏属性的前缀
 * 如果页面支持 hidden 属性，返回 '' 就行
 * 如果不支持，各个浏览器对 hidden 属性，有自己的实现，不同浏览器不同前缀，遍历看支持哪个
 */
function getPagePropertyPrefix() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    var correctPrefix = void 0;

    if ('hidden' in document) return '';

    prefixes.forEach(function (prefix) {
        if (prefix + 'Hidden' in document) {
            correctPrefix = prefix;
        }
    });

    return correctPrefix || false;
}
/**
 * 判断页面是否隐藏（进入后台）
 */
function isPageHidden() {
    var prefix = getPagePropertyPrefix();
    if (prefix === false) return false;

    var hiddenProperty = prefix ? prefix + 'Hidden' : 'hidden';
    return document[hiddenProperty];
}
/**
 * 获取判断页面 显示|隐藏 状态改变的属性
 */
function getVisibilityChangeProperty() {
    var prefix = getPagePropertyPrefix();
    if (prefix === false) return false;

    return prefix + 'visibilitychange';
}
/**
 * 检测是否唤端成功
 * @param {function} cb - 唤端失败回调函数
 */
function checkOpen(cb, timeout) {
    var visibilityChangeProperty = getVisibilityChangeProperty();
    var timer = setTimeout(function () {
        var hidden = isPageHidden();
        if (!hidden) {
            cb();
        }
    }, timeout);

    if (visibilityChangeProperty) {
        document.addEventListener(visibilityChangeProperty, function () {
            clearTimeout(timer);
        });
        return;
    }

    window.addEventListener('pagehide', function () {
        clearTimeout(timer);
    });
}
/**
 * 获取 ios 大版本号
 */
function getIOSVersion() {
    var verion = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(verion[1], 10);
}
/**
 * 通过 iframe 唤起-ios9以上版本不支持
 * @param {string}} [uri] - 需要打开的地址
 */
function evokeByIFrame(uri) {
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.frameborder = '0';
        iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
        document.body.appendChild(iframe);
    }

    iframe.src = uri;
}

/**
 * 
 * @param {*} clickTarget 触发点父级
 * @param {*} e_href 计费打点链接
 * @param {*} deeplinkurl //深度链接  ios中唤起APP
 * @param {*} staturl //唤起失败统计链接
 * @param {*} landurl //唤起失败 跳到落地页
 */
var callApp = function (clickTarget, e_href, deeplinkurl, staturl, landurl) {

    if (clickTarget.getAttribute("e_href")) {
        clickTarget.setAttribute("href", "javascript:;") //阻止a链接跳转；
    }
    // 计费打点
    var imgId = "e_" + (new Date).getTime();
    var img = new Image;
    window[imgId] = img;
    img.onload = img.onerror = function () {
        window[imgId] = null
    };
    img.src = e_href;


    // 吊起失败打点，跳转落地页
    checkOpen(() => {
        var imgId = "e_landurl_" + (new Date).getTime();
        var img = new Image;
        window[imgId] = img;
        img.onload = img.onerror = function () {
            window[imgId] = null;
            window.location.href = landurl;
        };
        img.src = staturl; //下载落地页

    }, 2000)

    // 吊起app
    if (/:\/\//.test(deeplinkurl)) {
        if (browser.isIos) {
            if (getIOSVersion() < 9) {
                evokeByIFrame(deeplinkurl);
            } else {
                window.location.href = deeplinkurl;
            }
        } else {
            window.location.href = deeplinkurl;
        }

    }
}

function bin2hex(s) {
    var i, l, o = '',
        n;
    s += '';
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i)
            .toString(16);
        o += n.length < 2 ? '0' + n : n;
    }
    return o;
}

function getUUID(domain = "你好 觅友") {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "24px Arial";
    ctx.fillText(domain, 22, 33);
    ctx.moveTo(0, 60);
    ctx.lineTo(100, 60);
    ctx.stroke();
    //大家就随意创建一个canvas标签就是
    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    //然后用toDataURL方法对生成的canvas图像进行64码进制转换
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-16, -12));
    return crc;
}
/////////////////////////////////////////////
//获取浏览器相关信息
var baseInfo = { //不同的浏览器信息不同
    appName: navigator.appName, //浏览器的正式名称
    appVersion: navigator.appVersion, //浏览器的版本号
    cookieEnabled: navigator.cookieEnabled, // 返回用户浏览器是否启用了cookie
    mimeType: navigator.mimeTypes, // 浏览器支持的所有MIME类型的数组
}
var safeInfo = { //一般情况下不会改变
    language: navigator.language, //语言
    colorDepth: window.screen.colorDepth, //显示器颜色深度
    deviceMemory: navigator.deviceMemory, //内存/千兆字节
    pixelRatio: window.devicePixelRatio, //像素比
    hardwareConcurrency: navigator.hardwareConcurrency, //cpu内核数量
    screenResolution: screen.width + ',' + screen.height, //分辨率
    timezoneOffset: new Date().getTimezoneOffset(), //所在时区时间偏移
    platform: navigator.platform, //系统
    cpuClass: navigator.cpuClassd, //cpu等级
}

// 获取可用的多媒体输入输出设备
async function getEnumerateDevices() {
    try {
        return await navigator.mediaDevices.enumerateDevices()
            .then(d => {
                d.map(i => {
                    return 'id=' + i.deviceId.toString() + ';gid=' + i.groupId + ';gid=' + i.kind
                })
            })
    } catch (err) {
        return ''
    }
};
/**
 * 
 * @param {*} issafe true 不区分浏览器可用于跟app匹配  不同的浏览器判断为不同的用户
 * @param {*} callback 回调，用于发送到{uuid:canvas信息,info:系统信息}浏览器的信息
 */
async function sendTrack(issafe = false, showTable = false, showAlert = false, callback = () => {}) {
    let infos = issafe ? safeInfo : {
        ...safeInfo,
        ...baseInfo
    };
    let finalWork = () => {
        var bin = atob(window.btoa(unescape(Object.values(infos).concat(''))));
        let param = {
            uuid: getUUID("asdfa"),
            link: window.location.host + (window.location.host.pathname||''),
            info: bin2hex(bin.slice(-16, -12))
        }
        callback && callback(param)
        showTable && console.table(param);
        showAlert && alert('uuid:' + param.uuid + '====link:' + param.link + '====info:' + param.info);
    }
    let dd = await getEnumerateDevices()
    if (!dd) {
        finalWork()
    } else {
        dd.then(arr => {
            infos.enumerateDevices = arr.concat(',')
        }).finnally(() => {
            finalWork()
        })
    }

}
//callApp(clickTarget 触发点父级, e_href 计费打点链接, deeplinkurl 深度链接  ios中唤起APP, //唤起失败统计链接, //唤起失败 跳到落地页);
//sendTrack(boolean true 不区分浏览器可用于跟app匹配  不同的浏览器判断为不同的用户, function 回调，用于发送{uuid:canvas信息,info:系统信息}到服务端的信息)

var callAppAndFinger = new Object();
callAppAndFinger.callApp = callApp;
callAppAndFinger.sendTrack = sendTrack;
window.callAppAndFinger = callAppAndFinger;