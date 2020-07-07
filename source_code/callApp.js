//360唤起APP方案


callApp(clickTarget, e_href, deeplinkurl, staturl, landurl);
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

{/* <a class="alink" 
href="https://www.zhipin.com/?sid=sem_pz_360m_title" 
e_href="https://v.tf.360.cn/search/vclk?p=b10dejcBNm9_Zx12sJTuTsZWKvAOY7DiyNqt1lWEqw3IUrnwVmeXI3ppUXXvKIL4qgsPh99LiL_E8ce7SQHg4DvibCo7xKAU7BW3ABlkJiDRtybSOoN7hriNnahvUvcg70iGcdMI-DEpG3K_6wmcciRgQnXr9-NVCyH1LJqG30f9PNKm-blePmNUGvI-EzRsGXKcoenYScs2GzUvFyBn4bapmw_Pc7zteLpHXb3ZPeJCK0GP7MevXuG5tu1j2vCGXZXFw3W4s0ioqzlSpGDHhEs7AQgQRtg09qk-mKmdORqDblhz-4bLwnReZZjBXUYjbl2TEALv7qA13oHM0B-kI3rW7R3f4TxIM5SRExfeUlOuFWKLnVzDps5f6JGE4eOsiEe0DHVN1baFVdB9eLb_KP3e_h34PF_UGArq-hXmjw&src=home_next&srcg=home_next&source_type=4" 
target="_blank"> */}
 
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