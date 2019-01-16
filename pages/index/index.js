//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRegister: false, // 是否已注册
    usertype: '', //用户类型 无注册为'' 默认
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }

    this.checkRegister();
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //事件处理函数
  studentSignin: function () {
    wx.navigateTo({
      url: '../signin/signin?usertype=s'
    });
  },

  teacherSignin: function () {
    wx.navigateTo({
      url: '../signin/signin?usertype=t',
    })
  },

  // 获取微信用户信息
  fetchWXUser: function (res_code) {
    wx.request({
      // url: 'https://api.weixin.qq.com/sns/jscode2session',
      url: 'http://localhost:3000/api/openinfo',
      data: {
        code: res_code,
      },
      success: res => {
        // console.log('res', res);
        app.globalData.useruniq = res.data;
        console.log(app.globalData.useruniq);
        this.checkRegister();
      }
    })
  },

  // 检查用户是否注册
  checkRegister: function() {
    const that = this;
    console.log("查询用户注册");
    console.log(wx.getStorageSync('useruniq'));
    // 通过用户openid查询是否注册
    const useruniq = wx.getStorageSync('useruniq');
    if (wx.getStorageSync('useruniq')) {
      wx.request({
        url: 'http://localhost:3000/api/user',
        method: 'get',
        data: {
          openid: useruniq.openid
        },
        success: res => {
          console.log(res);
          if (res.data.data) {
            that.setData({
              isRegister: true,
              usertype: res.data.data.usertype
            });
            app.globalData.usertype = res.data.data.usertype;
          }
        }
      });
    }
  }
})
