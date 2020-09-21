import $ from './../../utils/Tool'
import router from '../../utils/router'
import { activityModel, userActivityModel } from '../../model/index'
import log from './../../utils/log'
import { rpx2Px } from '../../utils/util'

Page({
  data: {
    listHeight: $.store.get('screenHeight') - $.store.get('CustomBar') - rpx2Px(470),
    rankingList: [],
    myInfo: {},
    ruleHtmlSnip: '',
    chatCodeImg: '',
    chatDesc: '',
    title: '',
    headImg: '',
    headText: '',
    shareText: '',
    id: '',
    status: '',
    page: 1,
    size: 0,
    total: 0,
    onBottom: false
  },
  onLoad(options) {
    const { activityId } = options
    this.getData(activityId)
  },
  async onReachBottom() {
    const { data: { page, size, total, id } } = this
    const pageSize = Math.ceil(total / size)
    if (page < pageSize) {
      this.getListData(id, page + 1)
    } else {
      this.setData({ onBottom: true })
    }
  },
  async getListData(id, page) {
    $.loading('加载中...')
    const { data } = await userActivityModel.getGradeRank(id, page)
    const { data: { rankingList } } = this
    this.setData({ rankingList: rankingList.concat(data.list), page })
    $.hideLoading()
  },
  async getData(id) {
    try {
      $.loading('加载中...')
      const [{ data: activityDetail }, { list, myInfo, data }] = await Promise.all([
        activityModel.getDetail(id),
        userActivityModel.getGradeRank(id)
      ])
      const { title, rule, headImg, headText, chatCodeImg, chatDesc, shareText, inProgress, _id } = activityDetail[0]
      if (data.total <= data.size) { this.setData({ onBottom: true }) }
      this.setData({
        title,
        ruleHtmlSnip: rule,
        headImg,
        headText,
        chatCodeImg,
        chatDesc,
        shareText,
        status: inProgress ? '活动中' : '活动未开始',
        id: _id,
        rankingList: list,
        myInfo,
        size: data.size,
        total: data.total
      })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { this.onTapBack() })
    }
  },
  onTapBack() { router.toHome() },
  onShareAppMessage() {
    const { data: { id } } = this
    return {
      title: this.shareText,
      path: `/pages/activity/activity?activityId=${id}`,
      imageUrl: './../../images/share-default-bg.png'
    }
  },
  onRule() {
    this.selectComponent('#message').show('', 0, () => {}, 620, 560)
  },
  onChat() {
    this.selectComponent('#chatMessage').show('', 0, () => {}, 620, 560)
  }
})
