export default {
  init: function (){
    const AK = "GqADfOTbVxt7vx6xWQpdrmb0RltCwGB6";
    const BMap_URL = "http://api.map.baidu.com/api?v=2.0&ak="+ AK +"&callback=onBMapCallback";
    return new Promise((resolve, reject) => {
      // 如果已加载直接返回
      if(typeof BMap !== "undefined") {
        resolve(BMap);
        return true;
      }
      // 百度地图异步加载回调处理
      window.onBMapCallback = function () {
        console.log("百度地图脚本初始化成功...");
        resolve(BMap);
      };

      // 插入script脚本
      let scriptNode = document.createElement("script");
      scriptNode.setAttribute("type", "text/javascript");
      scriptNode.setAttribute("src", BMap_URL);
      document.body.appendChild(scriptNode);
    });
  }
}

// export function baidu(ak) {
//   return new Promise(function (resolve, reject) {
//     window.onload = function () {
//       resolve(BMap)
//     }
//     var script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
//     script.onerror = reject;
//     document.head.appendChild(script);
//   })
// }
