//全局配置参数

//属性============================================================================
//WebApi地址（图片，文件地址）
const webApiUrl='http://127.0.0.1:40001/';

//样式
//欢迎栏背景色配置[#347ebd,#0089dc,#1e89e0,#006bc7]
const pageTopStyle={'background':'#347ebd'};
//页面搜索条样式class（toolbar为控件自带，也可配置在MasterPage.vue）
const pageToolBarClass='toolbar';
//主列表Table表头样式
//const headerCellStyle={'color':'#909399','background':'#F2F6FC'};
const headerCellStyle={'color':'#606266','background':'#F2F6FC','font-size':'14px'};
//与上面一样，未用
function f_HeaderCellStyle({row, column, rowIndex, columnIndex}) {
  return 'color:white;background-color:#347ebd';
}
//主列表Table单元格样式
const cellStyle={'padding':'10px 0px','font-size':'14px'};
//分页控件样式class（配置在MasterPage.vue）
const pageBarClass='pageBarClass';



//主列表Table高度
const pagetableHeight=window.innerHeight-270+'px';
//分页控件每页显示条数
const pageSize=10;
//分页操作列控件类型，1：图标，2：button，3：文字
const pageButtonType=1;
//行政区域配置，空字符串：全国，具体区域用逗号分隔，如：'11,42'
const cityConfig='36';



//方法============================================================================
//随机数
function getRandom () {
  var tem = Math.round(Math.random() * 100)
  return tem;
};
//是否为空
var isNullOrEmpty = function (val) {
  if (typeof val == 'undefined')
    return true;
  if (val === null || val === '')
    return true;
  if (toStr(val).length == 0)
    return true;
  if (toStr(val).trim().length == 0)
    return true;
  return false;
};
//转字符串
var toStr = function (v) {
  /// <summary> 转换为字符串，如果无法转换，则返回空字符串'' </summary>
  if (v == null)
    return '';
  return v + '';
};
//字符替换
String.prototype.replaceAll = function (s1, s2) {
  var r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
  return this.replace(r, s2);
};
//转Int
var toInt = function (v) {
  /// <summary> 转换为整数，如果无法转换，则返回0 </summary>
  return parseInt(toFloat(v));
}
//转Float
var toFloat = function (v) {
  /// <summary> 转换为浮点数，如果无法转换，则返回0 </summary>
  if (v == null)
    return 0.0;
  if (typeof (v) == 'number')
    return v;
  var result = parseFloat(v.replaceAll(',', ''));
  if (isNaN(result))
    return 0.0;
  return result;
};
//加减乘除计算
var CallFloat=function (c, d, n) {

  /**
   * c：第一个操作数
   * d：第二个操作数
   * n：运算类型： 0为+  1为-  2为乘  3为除
   */
    //Modified by:lijun,date:2009-02-13 解决类型未转换进行Replace问题
  var re = /\s/g;
  var a = c.toString().replace(re, "");
  var b = d.toString().replace(re, "");
  a = a.replaceAll(',', '');
  b = b.replaceAll(',', '');
  //laixianbin 修复乘法小数点过长溢出问题 切除6位小数点以后的数据
  a = a.indexOf(".") > 0 ? a.substr(0, a.indexOf(".") + 7) : a;
  b = b.indexOf(".") > 0 ? b.substr(0, b.indexOf(".") + 7) : b;

  var cutN = "10000000000000";
  var cutZero = "00000000000";

  var dot = ".";

  //将小数输入为整数

  var adot = a.indexOf(dot) > 0 ? a.length - a.indexOf(dot) : 0;
  var bdot = b.indexOf(dot) > 0 ? b.length - b.indexOf(dot) : 0;

  var cutA = adot > 0 ? parseInt(cutN.substr(0, adot)) : 1;
  var cutB = bdot > 0 ? parseInt(cutN.substr(0, bdot)) : 1;

  var maxcutAB = Math.max(cutA, cutB);
  var mincutAB = Math.min(cutA, cutB);

  var cutAB = maxcutAB / mincutAB;
  var numA = 0; var numB = 0;

  var inzero = cutZero.substr(0, (cutAB.toString()).length - 1);
  var cutLen = (maxcutAB.toString()).length - 1;

  if (adot == bdot) {
    numA = parseInt(a.replace(dot, ""), 10);
    numB = parseInt(b.replace(dot, ""), 10);
  } else if (adot > bdot) {
    numA = parseInt(a.replace(dot, ""), 10);
    numB = parseInt(b.replace(dot, "") + inzero, 10);
  } else {
    numB = parseInt(b.replace(dot, ""), 10);
    numA = parseInt(a.replace(dot, "") + inzero, 10);
  }

  var numAB = "0.0";
  var lastN = "0.0";

  switch (n) {
    case 0: //加
      numAB = ((numA + numB) / maxcutAB).toString();
      break;

    case 1: //减
      numAB = ((numA - numB) / maxcutAB).toString();
      break;

    case 2: //乘
      numAB = (Math.abs(numA * numB)).toString();
      cutLen = cutLen * 2;
      break;

    case 3: //除
      numAB = (numA / numB).toString();
      break;
  }
  //对乘法的特别处理
  if (n == 2) {
    if (numAB.length <= cutLen) {
      numAB = cutZero.substr(0, cutLen - numAB.length + 1) + numAB;
    }
    if (Math.abs(numA * numB) != numA * numB) {
      numAB = "-" + numAB;
    }

    numAB = numAB.slice(0, numAB.length - cutLen) + "." + numAB.slice(numAB.length - cutLen);
  }
  return parseFloat(numAB).toString();
};






//导出============================================================================
export default
{
  //属性
  webApiUrl,
  pageSize,
  pageButtonType,
  pageTopStyle,
  pagetableHeight,
  pageToolBarClass,
  pageBarClass,
  f_HeaderCellStyle,
  headerCellStyle,
  cellStyle,
  cityConfig,

  //方法
  getRandom,
  isNullOrEmpty,
  CallFloat,
  toStr,
  toFloat,
  toInt,
}
