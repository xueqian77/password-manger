import SHA256 from '../../utils/sha256'

const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    masterPassword: '',
    mode: 'confirm'
  },
  onLoad(options) {
    if (options.mode) {
      this.setData({
        mode: options.mode
      })
    } else {
      let setMode = ''
      if (wx.getStorageSync('master') == 'TUER') {
        setMode = 'confirm'
      } else {
        setMode = 'set'
      }
      this.setData({
        mode: setMode
      })
      this.init()
    }
  },
  init() {
    let that = this;
    wx.cloud.callFunction({
      name: 'init',
      complete: res => {
       if( res&&res.result){
        app.globalData.openId = res.result.openid
       }
        if (res&&res.result&&res.result.list.data.length) {
          that.setData({
            mode: 'confirm',
            openId: res.result.list.data[0]._openid
          })
          app.globalData.userId = res.result.list.data[0]._id
        } else {
          that.setData({
            mode: 'set'
          })
        }
      }
    })
  },
  onInput(e) {
    const { value } = e.detail
    this.setData({ masterPassword: value })
    // console.log(this.data.masterPassword)
  },
  onButtonTap() {
    const { masterPassword, mode } = this.data
    if (!masterPassword) {
      return wx.showToast({ title: '请输入加密密钥', icon: 'none' })
    }
    if (masterPassword.length < 6) {
      return wx.showToast({ title: '密钥不应该少于6位', icon: 'none' })
    }
    if (mode === 'set') {
      this.setKey()
    } else if (mode === 'change') {
      this.resetKey()
    } else if (mode === 'confirm') {
      this.confirmKey()
    }
  },
  // 设置主密码
  setKey() {
    const { masterPassword } = this.data
    const hash = SHA256.sha256_digest(SHA256.sha256_digest(masterPassword) + 'lhg')
    wx.showLoading({ title: 'Loading...' })
    wx.setStorage({
      key: "master",
      data: "TUER"
    })
    db.collection('users')
      .add({
        data: {
          sign: hash
        }
      })
      .then(res => {
        wx.hideLoading()
        wx.showToast({ title: '设置成功', mask: true })
        wx.switchTab({ url: '/pages/index/index' })
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({ title: '加密密钥设置失败' })
      })
  },
  confirmKey() {
    const { masterPassword, openId } = this.data
    const hash = SHA256.sha256_digest(SHA256.sha256_digest(masterPassword) + 'lhg')
    wx.showLoading({ title: 'Loading...' })
    wx.setStorage({
      key: "master",
      data: "TUER"
    })
    db.collection("users")
      .where({
        _openid: openId,
        sign: hash
      })
      .get({
        success: res => {
          if (res.data.length) {
            wx.hideLoading()
            wx.switchTab({ url: '/pages/index/index' })
          } else {
            wx.hideLoading()
            wx.showToast({ title: '加密密钥错误', icon: 'error', })
          }
        }
      })
  },
  resetKey() {
    const { masterPassword } = this.data
    const hash = SHA256.sha256_digest(SHA256.sha256_digest(masterPassword) + 'lhg')
    wx.showLoading({ title: 'Loading...' })
    db.collection('users')
      .doc(app.globalData.userId)
      .update({
        data: {
          sign: hash
        }
      })
      .then(res => {
        wx.hideLoading()
        wx.showToast({ title: '修改成功', mask: true })
        wx.switchTab({ url: '/pages/personal/personal' })
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({ title: '加密密钥修改失败' })
      })
  },
  clearInput: function () {
    this.setData({
      masterPassword: "",
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: '口令记录器',
      path: '/pages/login/login',//这里是被分享的人点击进来之后的页面
      imageUrl: '/images/share.jpg'//这里是图片的路径
    }
  }
});