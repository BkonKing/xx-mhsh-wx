import apiConfig from '@/api/config';
import {
  getAwardPopupInfo
} from '@/api/award';

// import awardMixin from '@/mixins/award';
// mixins: [awardMixin],
export default {
  data() {
    return {
      baseUrl: apiConfig.baseUrl,
      isHaveAward: false
    }
  },
  onShow() {
    this.getAwardPopupInfo();
  },
  methods: {
    async getAwardPopupInfo() {
      const {
        data,
        state
      } = await getAwardPopupInfo({
        count: this.awardCount // 首页计数次数
      });
      if (+state === 1) {
        this.isHaveAward = true;
        this.getAwardSuccess && this.getAwardSuccess(data)
      } else {
        this.isHaveAward = false;
      }
    },
    goAwardIndex() {
      this.$router.push({
        path: '/pages/activity/award/index'
      });
    }
  }
}
