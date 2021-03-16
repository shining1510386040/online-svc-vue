
/**
 * 获取url参数
 *  */
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

/**
 * 格式化日期
 * @param {*日期} date 
 * @param {*格式 } fmt 
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

// 工单状态转化
export function workOrderStatusConvert(cellValue) {
  if (cellValue == 0) {
    return "已创建";
  } else if (cellValue == 1) {
    return "待反馈";
  } else if (cellValue == 2) {
    return "已反馈";
  } else if (cellValue == 3) {
    return "处理中";
  } else if (cellValue == 4) {
    return "待评价";
  } else if (cellValue == 5) {
    return "已评价";
  } else if (cellValue == 6) {
    return "已关闭";
  } else {
    return "";
  }
}