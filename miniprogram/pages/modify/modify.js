import SECRET from '../../utils/secret'

const db = wx.cloud.database()
Page({
  data: {},
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.init()
  },
  init() {
    const that = this
    const { id } = this.data
    db.collection('accounts').doc(id).get({
      success: function (res) {
        const { account = '', type = '', describe = '',  password = '' } = res.data
        that.setData({
          account: SECRET.decrypt(account),
          type: type,
          describe: describe,
          password: SECRET.decrypt(password),
        })
      }
    })
  },
  
  onNameInput(e) {
    const { value } = e.detail
    this.setData({ describe: value })
  },
  onTypeInput(e) {
    const { value } = e.detail
    this.setData({ type: value })
  },
  onAccountInput(e) {
    const { value } = e.detail
    this.setData({ account: value })
  },
  onPasswordInput(e) {
    const { value } = e.detail
    this.setData({ password: value })
  },
  onButtonTap() {
    const { describe, account, password, type, id } = this.data
    if (!describe) {
      wx.showToast({ title: '描述不能为空', icon: 'none' })
    } else {
      wx.showLoading({ title: '保存中...' })
      const cloudData = {}
      if (account) {
        cloudData.account = SECRET.encrypt(account)
      }
      if (password) {
        cloudData.password = SECRET.encrypt(password)
      }
      cloudData.type = type
      cloudData.describe = describe
      cloudData.modifiedAt = db.serverDate()
      db.collection('accounts').doc(id).set({
        // data 传入需要局部更新的数据
        data: cloudData,
        success: function (res) {
          wx.hideLoading()
          wx.showToast({ title: '修改成功', mask: true })
          wx.navigateBack({ changed: true });
        },
        fail: function (err) {
          wx.hideLoading()
          wx.showToast({ title: '修改失败', mask: true })
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }
  },
})