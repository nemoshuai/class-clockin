// teacher/components/history-view/history-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    historyList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
   bindHistoryDetailTap: function(e) {
      const historyId = e.currentTarget.dataset.historyid;
      wx.navigateTo({
        url: '../historyDetail/historyDetail?history_id=' + historyId,
      });
    }
  }
})
