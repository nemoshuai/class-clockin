// student/components/explore/explore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //轮播图相关设置
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    imgUrls: [
      '/assets/images/swiper1.jpg',
      '/assets/images/swiper2.jpg',
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDetail: function (e) {
      console.log("clicked");
      const id = e.currentTarget.dataset.id;//获取课程的id
      wx.navigateTo({//跳转到详情页面
        // url: 'detail/detail?id=' + id
        url: '../courseDetail/courseDetail?course_id=' + id
      });
    }
  }
})
