//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('res.code', res.code);
        // this.globalData.useruniq = { openId: '', sessionKey: '', unionId: '' }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.globalData.code = res.code;
          // 发起网络请求
          this.fetchWXUser(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }   
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 获取微信用户信息
  fetchWXUser: function(res_code) {
    wx.request({
      // url: 'https://api.weixin.qq.com/sns/jscode2session',
      url: 'http://localhost:3000/api/openinfo',
      data: {
        code: res_code,
      },
      success: res => {
        // console.log('res', res);
        wx.setStorageSync('useruniq', res.data);//将获取信息写入本地缓存  
        this.globalData.useruniq = res.data;
        console.log(this.globalData.useruniq);
        // this.checkRegister();
      }
    })
  },
  // 检查用户是否注册
  // checkRegister: function () {
  //   // const that = this;
  //   console.log("查询用户注册");
  //   // 通过用户openid查询是否注册
  //   if (this.globalData.useruniq) {
  //     wx.request({
  //       url: 'http://localhost:3000/api/user',
  //       method: 'get',
  //       data: {
  //         openid: 'wx12ab'
  //       },
  //       success: res => {
  //         console.log(res);
  //         if (res.data) {
  //           this.globalData.usertype = res.data.data.usertype;
  //           this.globalData.isRegister = true;
  //         }
  //       }
  //     });
  //   }
  // },
  globalData: {
    userInfo: null,
    isRegister: false,
    // baseUserInfo: null, // 基础用户信息
    useruniq: null, //用户标识信息
    usertype: '',
    user: null, // 老师或学生信息
    code: null,
  }
})