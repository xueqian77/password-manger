import SECRET from '../../utils/secret'

const db = wx.cloud.database()
Page({
  data: {
    describe: '',
    account: '',
    password: '',
    type: ''
  },
  onLoad: function () {

  },
  onTypeInput(e) {
    const {
      value
    } = e.detail
    this.setData({
      type: value
    })
  },
  onNameInput(e) {
    const {
      value
    } = e.detail
    this.setData({
      describe: value
    })
  },
  onAccountInput(e) {
    const {
      value
    } = e.detail
    this.setData({
      account: value
    })
  },
  onPasswordInput(e) {
    const {
      value
    } = e.detail
    this.setData({
      password: value
    })
  },
  onButtonTap() {
    const {
      describe,
      account,
      password,
      type
    } = this.data
    if (!describe) {
      wx.showToast({
        title: '描述不能为空',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '保存中...'
      })
      const cloudData = {}
      if (describe) {
        cloudData.describe = describe
      }
      if (account) {
        cloudData.account = SECRET.encrypt(account)
      }
      if (password) {
        cloudData.password = SECRET.encrypt(password)
      }
      if (type) {
        cloudData.type = type
      }
      cloudData.createdAt = db.serverDate()
      db.collection('accounts')
        .add({
          data: cloudData
        })
        .then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '创建成功'
          })
          this.resetInput()
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '创建失败'
          })
        })
    }
  },
  resetInput() {
    this.setData({
      describe: '',
      account: '',
      password: '',
      type: '',
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '口令记录器',
      path: '/pages/login/login', //这里是被分享的人点击进来之后的页面
      imageUrl: '/images/share.jpg' //这里是图片的路径
    }
  }
})