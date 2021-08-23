Page({
  data: {

  },
  onChangePasswordTap() {
    wx.navigateTo({
      url: '/pages/login/login?mode=change'
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '口令记录器',
      path: '/pages/login/login',//这里是被分享的人点击进来之后的页面
      imageUrl: '/images/share.jpg'//这里是图片的路径
    }
  },
  onIndependentDeployTap() {
    wx.showModal({
      title: '提示',
      content: '请添加微信：xueqian_77_55',
      confirmText: '复制微信',
      success: ({ confirm }) => {
        if (confirm) {
          wx.setClipboardData({
            data: 'nrqzdhlsc_cc',
            success: () => {
              wx.showToast({ title: '复制成功' })
            }
          })
        }
      },
    })
  }
});
