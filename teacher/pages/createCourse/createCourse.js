// teacher/pages/createCourse/createCourse.js
import WxValidate from '../../../utils/WxValidate.js';

const app = getApp();

// 表单验证值
const formValidate = {
  course_name: '',
  address: '',
  class_time: ''
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {}, //验证绑定
    course: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      form: formValidate
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
    rules = {
      course_name: {
        required: true,
      },
      address: {
        required: true,
      },
      class_time: {
        required: true,
      },
    }

    messages = {
      course_name: {
        required: '请填写课程名称',
      },
      address: {
        required: '请填写课程地点',
      },
      class_time: {
        required: '请填写上课时间',
      },
    }

    console.log(rules);
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 信息提示
  showModal(info) {
    wx.showModal({
      content: info.msg,
      showCancel: false,
    });
  },

  /**
    * 表单提交
    */
  formSubmit: function (e) {
    const that = this;
    if (!this.WxValidate.checkForm(e.detail.value)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false;
    } else {
      const tea_id = app.globalData.user.tea_id;
      that.setData({
        course: { ...e.detail.value, tea_id }
      });
      console.log(that.data.course);
      wx.request({
        url: 'http://localhost:3000/api/course',
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        data: {
          course: that.data.course
        },
        success: res => {
          console.log("创建课程成功",res.data);
          that.showModal({ msg: '创建成功' });
          wx.navigateBack({
            delta: 1
          });
        },
        fail: res => {
          console.log(res);
          that.showModal({ msg: '创建失败' });
        }
      });
    }
  },

 /**
  * 表单重设
  */
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      course: null
    });
  }
});