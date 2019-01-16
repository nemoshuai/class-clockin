// teacher/pages/index/index.js
import util from '../../../utils/util.js';

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["考勤", "历史", "我的"],
    activeIndex: 0,
    user: {}, // 老师信息
    userInfo: {}, // 微信用户信息
    useruniq: {}, // 用户标识信息
    teachedCourseList: [], // 教师所授课程
    historyList: [], // 历史信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
    //     });
    //   }
    // });
    if (app.globalData.useruniq) {
      that.setData({
        useruniq: app.globalData.useruniq
      });
    }
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        // hasUserInfo: true
      });
    }
    that.getUser().then(result => {
      console.log("dede", result);
      that.getCreatedCourseList();
    });
    console.log('userinfo', that.data.userInfo);
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
    const that = this;
    if (that.data.user.tea_id) {
      this.getCreatedCourseList();
    } else {
      that.getUser().then(result => {
        that.getCreatedCourseList();
      });
    }
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
   * 点击tab切换
   */
  tabClick: function (e) {
    
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.log('切换', this.data.activeIndex);
    if (this.data.activeIndex == 0) {
      this.getCreatedCourseList();
    } else if (this.data.activeIndex == 1) {
      // 历史
      this.getBookinHistory();
    } else if (this.data.activeIndex == 2 && !this.data.user) {
      this.getUserInfo();
    } 
  },

  /**
 * 获取教师信息
 */
  getUser: function () {
    return new Promise((resolve, reject)=> {
      const that = this;
      if (that.data.useruniq) {
        wx.request({
          url: 'http://localhost:3000/api/teacher',
          method: 'get',
          data: {
            openid: that.data.useruniq.openid,
          },
          success: res => {
            if (res.statusCode == 200 && res.data) {
              that.setData({
                user: res.data.data,
              });
              app.globalData.user = { ...that.data.user };
              console.log("获取教师用户信息", app.globalData.user);
              resolve(res.data.data);
            }
          }
        });
      }
    });
    // test
    // const tempData = {
    //   'tea_id': 0,
    //   'tea_name': 'name',
    //   'professional_title': '讲师'
    // };

    // that.setData({
    //   user: tempData
    // });
    // app.globalData.user = { ...that.data.user };
    // console.log("app global data ", app.globalData.user);
  },

  /**
  * 获取教师创建课程
  */
  getCreatedCourseList: function () {
    console.log("获取教师创建课程");
    const that = this;
    console.log('user',that.data.user.tea_id);
    if (that.data.useruniq) {
      wx.request({
        url: `http://localhost:3000/api/course/${that.data.user.tea_id}/t`,
        method: 'get',
        // data: {
        //   // openid: that.data.useruniq.openid,
        //   id: that.data.user.tea_id,
        //   usertype: 't'
        // },
        success: res => {
          if (res.statusCode == 200 && res.data) {
            that.setData({
              createdCourseList: res.data.list,
            });
          }
        }
      });
    }

    // mock
    // const tempData = [
    //   {
    //     course_id: 0,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 1,
    //     course_name: "计算机网络dedee",
    //     address: "实验楼6508dededede",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 2,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 3,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 4,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 5,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 6,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     class_time: "单周周五上午 双周周六下午"
    //   },
    // ];

    // that.setData({
    //   createdCourseList: tempData
    // });
    // console.log("教师创建课程列表:", that.data.createdCourseList);
  },

  // 获取历史记录
  getBookinHistory: function() {
    console.log("获取历史数据");
    const that = this;
    wx.request({
      url: `http://localhost:3000/api/attendance/${that.data.user.tea_id}`,
      method: 'get',
      // data: {
      //   tea_id: that.data.user.tea_id,
      // },
      success: function(res) {
        if (res.statusCode == 200 && res.data) {
          that.setData({
            historyList: that.formatHistoryList(res.data.list)
          });
        }
      },
      fail: function(res) {
        console.log('请求历史数据失败', res);
      }
    })

    // const tempData = [
    //   {
    //     history_id: 0,
    //     course_id: 0,
    //     bookin_time: 1546935816129,
    //     course_name: '计算机'
    //   },
    // ];

    // that.setData({
    //   historyList: that.formatHistoryList(tempData)
    // });
    // console.log("修改历史数据", that.data.historyList);
  },

  // 格式化历史数据
  formatHistoryList: function(originHistoryList) {
    const that = this;
    if (originHistoryList && originHistoryList.length) {
      let tempHistoryList = [...originHistoryList];
      tempHistoryList.map(history => {
        if (history.bookin_time) {
          history.bookin_time = util.formatDate(history.bookin_time);
        }
        return history;
      });

      console.log("format temp history ", tempHistoryList);
      return tempHistoryList;
    } else {
      return originHistoryList;
    }
  }
})