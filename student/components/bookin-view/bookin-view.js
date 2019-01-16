// student/components/bookin-view/bookin-view.js
const util = require('../../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickedCourseList: {
      type: Array
    },
    user: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColors: [
      'bg-1',
      'bg-2',
      'bg-3',
      'bg-4'
    ],
    hiddenModal: true,
    bookInCode: '',
    bookInCourseId: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    randomBgColor: function() {
      console.log('执行的');
      return 'bg-red';
    },

    // 点击课程
    bookInTap: function(e) {
      const id = e.currentTarget.dataset.id;//获取课程的id
      const that = this;
      that.setData({
        bookInCourseId: id
      });

      console.log('签到课程ID 学生ID', id + ' ' + that.data.user.stu_id);
      let bookInabled = true; // 标志是否签到
      // 判断是否可签到
      wx.request({
        url: 'http://localhost:3000/api/attendance',
        method: 'GET',
        data: {
          course_id: id,
        },
        success: function (res) {
          console.log("12");
          if(res.data) {
            bookInabled = res.data.bookIn;
            
            if (bookInabled) {
              // 可签到
              that.setData({
                hiddenModal: false
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '还未可签到',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            }
          }
        }
      });
      
      // // mock
      // if (bookInabled) {
      //   // 可签到
      //   this.setData({
      //     hiddenModal: false
      //   });
      // } else {
      //   wx.showModal({
      //     title: '提示',
      //     content: '还未可签到',
      //     success(res) {
      //       if (res.confirm) {
      //         console.log('用户点击确定')
      //       } else if (res.cancel) {
      //         console.log('用户点击取消')
      //       }
      //     }
      //   });
      // }
    },

    listenerConfirm: function() {
      console.log('签到码为:', this.data.bookInCode);
      // TODO: 化为毫秒 不需格式化
      let bookin_time = new Date();
      console.log('签到时间为: ', bookin_time);
      // 签到
      wx.request({
        url: 'http://localhost:3000/api/attendance/student',
        method: 'post',
        data: {
            stu_id: this.data.user.stu_id,
            course_id: this.data.bookInCourseId,
            bookin_code: this.data.bookInCode
        },
        success: function(res) {
          if(res.data.success) {
            console.log('签到成功', res.data);
            wx.showToast({
              title: '签到成功',
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: '签到失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '签到失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
      this.setData({
        hiddenModal: true
      });
    },

    listenerCancel: function() {
      this.setData({
        hiddenModal: true
      });
    },

    bookInCodeInput: function(e) {
      this.setData({
        bookInCode: e.detail.value
      });
    }
  }
})
