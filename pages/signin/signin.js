// pages/signin/signin.js
import WxValidate from '../../utils/WxValidate.js';

const app = getApp();

// 表单验证值
const studentValidate = {
  stu_id: '',
  stu_name: '',
  grade: '',
  profession_class: ''
};

const teacherValidate = {
  tea_id: '',
  tea_name: '',
  professional_title: ''
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usertype: '',
    student: null,
    teacher: null,
    form: {}, //验证绑定
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      usertype: options.usertype,
      form: options.usertype == 's' ? studentValidate : teacherValidate
    });
    this.initValidate()//验证规则函数
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
  //验证函数
  initValidate() {
    let rules = {};
    let messages = {}
    if (this.data.usertype == 's') {
      // console.log('dede');
      rules = {
        stu_id: {
          required: true,
          digits: true,
        },
        stu_name: {
          required: true,
        },
        grade: {
          required: true,
          minlength: 4
        },
        profession_class: {
          required: true,
        },
      }

      messages = {
        stu_id: {
          required: '请填写学号',
          digits: '学号为数字格式'
        },
        stu_name: {
          required: '请填写姓名',
        },
        grade: {
          required: '请填写年级',
          minlength: '请填写入学年份4位'
        },
        profession_class: {
          required: '请填写专业班级',
        },
      }
    }

    else {
      rules = {
        tea_id: {
          required: true,
          digits: true,
        },
        tea_name: {
          required: true,
        },
        professional_title: {
          required: true
        }
      }

      messages = {
        tea_id: {
          required: '请填写教工号',
          digits: '教工号为数字'
        },
        tea_name: {
          required: '请填写姓名',
        },
        professional_title: {
          required: "请输入职称"
        }
      }
    }
   
  //  console.log("表单验证规则: ",rules);
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 信息提示
  showModal(info) {
    wx.showModal({
      content: info.msg,
      showCancel: false,
    });
  },

  showToast(info) {
    wx.showToast({
      title: info.msg,
      icon: info.status,
      duration: 0,
      mask: true,
    });
  },
  /**
   * 事件处理
   */
  formSubmit: function(e) {
    const that = this;
    if (!this.WxValidate.checkForm(e.detail.value)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      if (that.data.usertype == 's') {
        that.setData({
          student: { ...e.detail.value }
        });
        console.log(that.data.student);
        wx.request({
          url: 'http://localhost:3000/api/register',
          method: 'post',
          header: {
            'content-type': 'application/json'
          },
          data: {
            usertype: that.data.usertype,
            useruniq: app.globalData.useruniq,
            userdata: that.data.student,
          },
          success: res => {
            console.log("注册成功", res.statusCode);
            if(res.statusCode=='200') {
              // that.showModal({ msg: '注册成功' })
              that.showToast({msg: '注册成功', status: 'success'});
              wx.navigateTo({
                url: '/student/pages/index/index',
              });
            }
          },
          fail: res => {
            console.log("注册失败");
            that.showModal({ msg: '注册失败' });
          }
        });
      }
      else {
        that.setData({
          teacher: { ...e.detail.value, ...app.useruniq }
        });
        console.log(that.data.teacher)
        wx.request({
          url: 'http://localhost:3000/api/register',
          method: 'post',
          header: {
            'content-type': 'application/json'
          },
          data: {
            usertype: that.data.usertype,
            useruniq: app.globalData.useruniq,
            userdata: that.data.teacher,
          },
          success: res => {
            console.log(res.data);
            // that.showModal({msg: '注册成功'})
            that.showToast({ msg: '注册成功', status: 'success' });
            wx.navigateTo({
              url: '/teacher/pages/index/index',
            });
          },
          fail: res => {
            console.log(res);
            that.showModal({ msg: '注册失败' })
          }
        });
      }
    }
  },

  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      student: null,
      teacher: null
    });
  }
})