import Base from './base'
const collectionName = 'activity'

export function getOneActivity(title, headImg, headText, ruleHtmlSnip, chatCodeImg, chatDesc, shareText, bannerImg, bookDescs) {
  return {
    title, // 顶部标题
    rule: ruleHtmlSnip, // 活动规则
    headImg, // 活动页头图
    headText, // 活动页头部描述
    chatCodeImg, // 客服二维码
    chatDesc, // 客服描述
    shareText, // 分享文案
    bannerImg, // 入口图片
    bookDescs, // 使用哪些书，可以给这个活动增加词力值
    inProgress: false, // 活动是否在收集词力值
    show: true // 是否显示
  }
}

class ActivityModel extends Base {
  constructor() {
    super(collectionName)
  }

  mock() {
    const obj = getOneActivity('我是活动标题', 'https://i.loli.net/2020/09/20/DHZU3ST5Ns9c2GQ.png', '活动时间：2020年09月20日16:43:12', '<h2>我是活动规则</h2>', 'https://i.loli.net/2020/09/20/jt9GxpDbkQ2NTJe.png', '截图扫码加群，领取礼物', '分享给好友看看 ~', 'https://i.loli.net/2020/09/20/jyQEJKgUTGL9PWO.png', ['交通'])
    this.add(obj)
  }

  add(data) {
    this.model.add({ data: { ...data, createTime: this.date } })
  }

  getActivityList() {
    return this.model.where({
      show: true
    }).field({ _id: true, bannerImg: true }).get()
  }

  getDetail(_id) {
    return this.model.where({ _id }).limit(1).get()
  }

  getActivityIdsByBookDesc(bookDesc) {
    return this.model.where({
      bookDescs: this._.all([bookDesc]),
      inProgress: true,
      show: true
    }).field({ _id: true }).get()
  }
}

export default new ActivityModel()
