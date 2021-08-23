// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  let list = await db.collection("users")
    .where({
      _openid: openid
    })
    .get()

  return {
    list,
    openid
  }
}