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
    status: ''
  },
  onLoad(options) {
    const { activityId } = options
    this.getData(activityId)
  },
  async getData(id) {
    try {
      $.loading('加载中...')
      const [{ data: activityDetail }, { list, myInfo }] = await Promise.all([
        activityModel.getDetail(id),
        userActivityModel.getGradeRank(id)
      ])
      const { title, rule, headImg, headText, chatCodeImg, chatDesc, shareText, inProgress, _id } = activityDetail[0]
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
        myInfo
      })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { this.onTapBack() })
    }
  },
  onTapBack() { router.toHome() },
  onShareAppMessage() {
    return {
      title: this.shareText,
      path: `/pages/home/home`,
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
