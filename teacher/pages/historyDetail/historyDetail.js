// teacher/pages/historyDetail/historyDetail.js
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history_id: 0,
    history: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      history_id: options.history_id
    });

    that.fetchHistoryRecord();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取历史记录数据
   */
  fetchHistoryRecord: function() {
    const that = this;
    wx.request({
      url: `http://localhost:3000/api/attendance/history/${that.data.history_id}`,
      method:'get',
      success: function(res){
        if(res.statusCode == 200 && res.data){
          console.log(res.data);
          that.setData({
            history: that.formatHistoryRecord(res.data)
          });
        }
      },
      fail: function(res){
        if(res){
          console.log("fetch 历史数据失败", res);
        }
      }
    });

    //mock 
  //   const tempData = {
  //     history_id: 0,
  //     course_id: 0,
  //     course_name: '计算机基础',
  //     bookin_time: 1546935816129,
  //     total: 65,
  //     absence: [
  //       {
  //         stu_id: 0,
  //         stu_name: "小一"
  //       }, {
  //         stu_id: 1,
  //         stu_name: "小二"
  //       }, {
  //         stu_id: 4,
  //         stu_name: "小四"
  //       }
  //     ]
  //   }
    
  //   const formatData = that.formatHistoryRecord(tempData);
  //   that.setData({
  //     history: formatData
  //   });
  //   console.log("历史记录:", that.data.history);
  },

  /**
   * 格式化历史记录
   */
  formatHistoryRecord: function(historyRecord) {
    // 老师的考勤位置
    const tLatitude = historyRecord.latitude;
    const tLongitude = historyRecord.longitude;
    console.log("考勤位置", tLatitude, tLongitude);
    const presentCount = historyRecord.total - historyRecord.absence.length;
    let tempRecord = {...historyRecord, presentCount};
    tempRecord.bookin_time = util.formatDate(tempRecord.bookin_time);
    // 筛选出位置可疑的（超过50m)的同学
    let dubious = [];
    historyRecord.present.forEach(item => {
      let distance = util.getDistance(tLatitude, tLongitude, item.latitude, item.longitude);
      console.log("距离:", distance);
      if (distance >= 50) {
        dubious.push({ ...item, distance});
      }
    });
    tempRecord = { ...tempRecord, dubious };
    console.log(tempRecord);
    return tempRecord;
  }
})