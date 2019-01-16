// student/pages/index/index.js
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navbar 设置
    tabs: ["发现", "签到", "我的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    useruniq: {}, // 用户标识信息
    courseList: [], // 课程列表
    user: {}, // 学生信息
    pickedCourseList: [], // 学生所选课程
    userInfo: {}, // 微信用户信息
    // scrollHeight: 0,//滚动页面的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    if (app.globalData.useruniq) {
      that.setData({
        useruniq: app.globalData.useruniq
      });
      console.log("微信标识信息", this.data.useruniq);
    }
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        // hasUserInfo: true
      });
      console.log("微信用户信息", this.data.userInfo);
    }
    that.getCourseList();
    that.getUser();
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
   * 点击tab切换
   */
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    if (this.data.activeIndex == 2 && !this.data.user) {
      this.getUserInfo();
    } else if (this.data.activeIndex == 1) {
      this.getPickedCourseList();
    } else if (this.data.activeIndex == 0) {
      this.getCourseList();
    }
  },

  /**
   * 获取课程列表
   */
  getCourseList: function () {
    const that = this;
    wx.request({
      url: 'http://localhost:3000/api/course',
      method: 'get',
      success: res => {
        console.log("获取课程列表成功", res.statusCode);
        if(res.statusCode == 200) {
          console.log("课程列表",res.data.list);
          if (res.data) {
            this.setData({
              courseList: res.data.list
            });
          }
        }
      },
      fail: error => {
        console.log("获取课程列表失败", error);
      }
    });
    // let data = [
    //   {
    //     "course_id": 1,
    //     "course_name": "网络安全",
    //     "address": "教三409",
    //     "class_time": "周三三四节",
    //     "tea_id": 1,
    //     "tea_name": "无老师"
    //   },
    //   {
    //     "course_id": 2,
    //     "course_name": "网络编程",
    //     "address": "教三409",
    //     "class_time": "周三三四节",
    //     "tea_id": 1,
    //     "tea_name": "无老师"
    //   }
    // ]
    // that.setData({
    //   courseList: data
    // });
    // console.log("课程列表", that.data.courseList);
  },

  /**
   * 获取学生信息
   */
  getUser: function () {
    const that = this;
    if (that.data.useruniq) {
      wx.request({
        url: 'http://localhost:3000/api/student',
        method: 'get',
        data: {
          openid: that.data.useruniq.openid,
        },
        success: res => {
          if(res.statusCode == 200) {
            console.log("获取用户信息成功",res);
            if (res.data) {
              that.setData({
                user: res.data.data,
              });
              app.globalData.user = { ...that.data.user };
            }
          }
        }
      });
    }
    // test
    // const tempData = {
    //   "stu_id": 0,
    //   "stu_name": 'name',
    //   "grade": 2014,
    //   "profession_class": "软工"
    // };

    // that.setData({
    //   user: tempData
    // });
    // app.globalData.user = { ...that.data.user };
    // console.log("app global data ", app.globalData.user);
  },

  /**
   * 获取学生选取的课程
   */
  getPickedCourseList: function () {
 
    const that = this;
    console.log("获取学生选取课程", that.data.user.stu_id);
    if(that.data.useruniq) {
      wx.request({
        url: `http://localhost:3000/api/course/${that.data.user.stu_id}/s`,
        method: 'get',
        // data: {
        //   // openid: that.data.useruniq.openid,
        //   id: that.data.user.stu_id,
        //   usertype: 's'
        // },
        success: res => {
          if(res.statusCode == 200 && res.data) {
            console.log("获取学生选取课程列表");
            that.setData({
              pickedCourseList: res.data.list,
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
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 1,
    //     course_name: "计算机网络dedee",
    //     address: "实验楼6508dededede",
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 2,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 3,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 4,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 5,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     time: "单周周五上午 双周周六下午"
    //   },
    //   {
    //     course_id: 6,
    //     course_name: "计算机网络",
    //     address: "实验楼6508",
    //     time: "单周周五上午 双周周六下午"
    //   },
    // ];
    
    // that.setData({
    //   pickedCourseList: tempData
    // });
    // console.log("学生选取课程列表:", that.data.pickedCourseList);
  }

});