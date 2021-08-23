 const db = wx.cloud.database()
 const app = getApp()

 Page({
   data: {

   },
   //options(Object)
   onLoad: function (options) {
     wx.stopPullDownRefresh()
     this.init()
   },
   onShow: function (options) {
     wx.stopPullDownRefresh()
     this.init()
   },
   init() {
     const openId = app.globalData.openId
     db.collection('accounts').aggregate()
       .match({ //类似于where，对记录进行筛选
         _openid: openId,
       })
       .group({
         // 按 type 字段分组
         _id: '$type',
         // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
         total: {
           $sum: 1
         },
       })
       .sort({ //类似于orderBy
         _id: 1,
       })
       .end() //注意，end标志聚合操作的完成    
       .then(res => {
         var sum = res.list.reduce(function (total, item) {
           return total + item.total;
         }, 0)
         this.setData({
           accounts: res.list,
           sum: sum
         })
       })
       .catch(err => console.error(err))
   },
   onPullDownRefresh: function () {
     this.onLoad()
   },
   onShareAppMessage: function (res) {
     return {
       title: '口令记录器',
       path: '/pages/login/login', //这里是被分享的人点击进来之后的页面
       imageUrl: '/images/share.jpg' //这里是图片的路径
     }
   }
 });