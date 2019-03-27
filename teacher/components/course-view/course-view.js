// teacher/components/course-view/course-view.js
import util from '../../../utils/util.js';
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // user: {
    //   type: Object,
    //   value: null,
    // },
    // userInfo: {
    //   type: Object,
    //   value: null
    // },
    createdCourseList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bookInCode: '',
    hiddenModal: true,
    isBookIning: false,
    bookInCourseId: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 创建课程
    createdCourse: function() {
      wx.navigateTo({
        url: '../createCourse/createCourse',
      });
    },

    bookInCodeInput: function (e) {
      this.setData({
        bookInCode: e.detail.value
      });
    },

    listenerConfirm: function () {
      const that = this;
      // TODO: 毫秒 时间格式转化方法
      const date = new Date();
      console.log("时间:", util.formatTime(date));
      const bookin_time = date.getTime();
      console.log('发起考勤', bookin_time);
      console.log(util.formatDate(bookin_time));
     // 位置信息获取
      util.getUserLocation().then(result => {
        console.log("result", result.latitude, result.longitude);

        const attendance = {
          course_id: that.data.bookInCourseId,
          tea_id: app.globalData.user.tea_id,
          bookin_time: bookin_time,
          bookin_code: that.data.bookInCode,
          latitude: result.latitude,
          longitude: result.longitude,
        }
        console.log("考勤信息", attendance);
        wx.request({
          url: 'http://localhost:3000/api/attendance',
          method: 'post',
          data: {
            attendance: attendance
          },
          success: function (res) {
            if (res.statusCode = 200 && res.data) {
              console.log('发起考勤成功', res.data);
              wx.showToast({
                title: '考勤启动',
                icon: 'none',
                duration: 2000
              });
            } else {
              wx.showToast({
                title: '发起失败',
                icon: 'none',
                duration: 2000
              });
            }
            that.setData({
              hiddenModal: true,
            });
          },
          fail: function (res) {
            wx.showToast({
              title: '发起失败',
              icon: 'none',
              duration: 2000
            });
            console.log('发起失败', that.data.bookInCode);
            that.setData({
              hiddenModal: true,
            });
          }
        });
      });
    },

    listenerCancel: function () {
      const that = this;
      that.setData({
        hiddenModal: true
      });
    },

    // 发起考勤
    startBookin: function (e) {
      const that = this;
      // 获取课程的id
      const id = e.currentTarget.dataset.id;
      if (!that.isBookIning) {
        that.setData({
          bookInCourseId: id,
          hiddenModal: false,
          bookInCode: ''
        });
      }
    },

    // 结束考勤
    finishBookin: function (e) {
      console.log("结束考勤");
      const id = e.currentTarget.dataset.id;
      const that = this;
      // if (id === that.data.bookInCourseId && that.data.isBookIning) {
        wx.request({
          url: `http://localhost:3000/api/attendance/${id}`,
          method: 'post',
          success: function (res) {
            if (res.data) {
              console.log("取消考勤", res.data);
              wx.showToast({
                title: '取消考勤',
                icon: 'none',
                duration: 2000
              });
              that.setData({
                isBookIning: false,
              });
            }
          },
          fail: function (res) {
            if (res.data) {
              console.log("取消考勤出错", res.data);
            }
          }
        });
      // } else {
      //   wx.showToast({
      //     title: '',
      //     icon: 'none',
      //     duration: 2000
      //   });
      // }
    },

    // 检查是否考勤
    checkIsBookining: function() {
      return new Promise((resolve, reject) => {
        wx.request({
          url: 'http://localhost:3000/attendance/',
          method: 'get',
          
        });
      });
    }
  },
})
