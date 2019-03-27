// TODO: 将Date参数 改为1970年1月1日毫秒数
const formatDate = milliseconds => {
  const date = new Date(parseInt(milliseconds));
  return formatTime(date);
}

// Date 参数 时间格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取位置信息 gps坐标 （经度，纬度）
const getUserLocation = () => {
  return new Promise((resolve, reject)=>{
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const speed = res.speed;
        const accuracy = res.accuracy;
        resolve({latitude, longitude});
      },
    });
  });
}

const getRad = d => {
  return d * Math.PI / 180.0;
}

// 预计 未测
const getDistance = (la1, lo1, la2, lo2) => {
  // 角度转弧度
  let La1 = getRad(la1);
  let La2 = getRad(la2);
  // 经度差
  let la0 =  La1 - La2;
  // 纬度差
  let lb0 = getRad(lo1) - getRad(lo2);
  let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(la0 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(lb0 / 2), 2)));
  // 乘以地球半径
  distance = distance * 6378.137;
  distance = Math.round(distance * 10000) / 10000;
  distance = distance.toFixed(2) * 1000; //公里转化为m
  return distance;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getUserLocation: getUserLocation,
  getDistance: getDistance
}
