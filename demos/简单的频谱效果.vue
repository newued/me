<template>
  <div class="qiuyemusic">
    <canvas width="300" height="60" id="cvs">
      您的浏览器不支持canvas，请更换高级版的浏览器！
    </canvas>
  </div>
</template>
<script>
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
var parseColor = function (hexStr) {
  return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
};
// zero-pad 1 digit to 2
var pad = function (s) {
  return (s.length === 1) ? '0' + s : s;
};
var gradientColors = function (start, end, steps, gamma) {
  var i, j, ms, me, output = [], so = [];
  gamma = gamma || 1;
  var normalize = function (channel) {
    return Math.pow(channel / 255, gamma);
  };
  start = parseColor(start).map(normalize);
  end = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
};
function createPu() {
  var array = [],
    interval;
  var cvs = document.getElementById("cvs");
  var cwidth = document.querySelector('.qiuyemusic').clientWidth,
    cheight = 60,
    meterWidth = 8, //柱宽
    meterNum = 30, //柱子个数
    gap =cwidth/meterNum-meterWidth, //柱间距
    ctx = cvs.getContext("2d");
    cvs.width=cwidth;
    var colorArr=gradientColors('#FF6FD8', '#3813C2', meterNum);
  // loop
  function renderFrame() {
    for (let k = 0; k < meterNum; k++) {
      array[k] = randomNum(10, cheight);
    }
    ctx.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
      var value = array[i];
      ctx.fillStyle = colorArr[i];
      ctx.fillRect(3+i * (meterWidth + gap), cheight - value, meterWidth, value);
    }
  }
  renderFrame();
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(renderFrame, 120);
}

export default {
  mounted() {
    createPu();
  }
};
</script>

<style lang="scss" scope>
.qiuyemusic {
  position: absolute;
  width:100%;
  bottom:0;
  text-align: center;
  canvas{background-color:initial;}
}
</style>
