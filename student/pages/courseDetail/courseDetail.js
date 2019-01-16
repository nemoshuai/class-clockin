// student/pages/course-detail/courseDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id:null,
    course: {
      // course_name: '算法设计与分析',
      // class_time: '周三上午',
      // address: '3333',
      // tea_name: '呜呜呜',
    },
    isPicked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      course_id: options.course_id
    });
    that.getCourse();
    that.checkPickedCourse();
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
  
  getCourse: function () {
    const that = this;
    wx.request({
      url: `http://localhost:3000/api/course/${that.data.course_id}`,
      method: 'get',
      // data: {
      //   course_id: that.data.course_id
      // },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          that.setData({
            course: res.data.data
          });
          console.log(that.data.course);
        }
      }
    })
  },

  // 是否是已选课程
  checkPickedCourse: function () {
    const that = this;
    const course_id = that.data.course_id;
    const stu_id = app.globalData.user.stu_id;
    if (app.globalData.useruniq) {
      wx.request({
        url: `http://localhost:3000/api/course/${stu_id}/${course_id}`,
        method: 'get',
        success: function (res) {
          if (res && res.data) {
            // if (res.data.list.find(item => item.course_id === that.data.course_id)){
            //   that.setData({
            //     isPicked: true
            //   })
            // }
            that.setData({
              isPicked: res.data.isPicked ? true : false
            });
          }
        },
      });
    }
  },

  chooseCourse: function () {
    const that = this;
    if (app.globalData.user) {
      console.log("chooseCourse", app.globalData.user.stu_id, that.data.course_id);
      const course_id = that.data.course_id;
      const stu_id = app.globalData.user.stu_id;
      wx.request({
        url: `http://localhost:3000/api/course/${stu_id}/${course_id}`,
        method: 'post',
        // data: {
        //   stu_id: app.globalData.user.stu_id,
        //   course_id: that.data.course_id,
        // },
        success: function (res) {
          if (res.statusCode == 200 && res.data.success) {
            that.setData({
              isPicked: res.data.success ? true : false
            });
            wx.showToast({
              title: '选课成功',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '选课失败',
              icon: 'none'
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '选课失败',
            icon: 'none'
          });
        }
      })
    }
    // test
    // that.setData({
    //   isPicked: true
    // })
  },

})