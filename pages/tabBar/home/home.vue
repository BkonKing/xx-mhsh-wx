<template>
  <view>
    <uni-nav-bar
      title="美好生活家园"
      leftWidth="0"
      statusBar="true"
      :fixed="true"
      :border="false"
    />
    <view>
      <view
        v-for="(item, index) in specialList"
        :key="index"
        class="mobile-image-box"
      >
        <template v-for="(imgData, i) in item">
          <image
            v-if="imgData.block_img"
            :key="i"
            :src="imgData.block_img"
            class="mobile-image"
            mode="widthFix"
            @click="operate(imgData)"
          />
        </template>
      </view>
    </view>
    <button open-type="share" class="share-btn">
      <image class="share-image" src="@/static/main/home_share.png"></image>
    </button>
    <sign-in-com ref="sign" :show-loading="false"></sign-in-com>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import SignInCom from '@/modules/SignInCom';
import apiConfig from '@/api/config';
import { getHomeSpecial, getSpecial } from '@/api/personage';
import { throttle } from '@/utils/util';

export default {
  name: 'home',
  components: {
    SignInCom
  },
  data() {
    return {
      operate: throttle(this.handleOperate, 1000),
      specialId: '',
      specialData: {},
      specialList: []
    };
  },
  computed: {
    ...mapGetters(['userType', 'userInfo', 'currentProject']),
    projectId() {
      return (this.currentProject && this.currentProject.project_id) || '';
    }
  },
  onShow() {
    this.getHomeSpecial();
  },
  onShareAppMessage({from}) {
    if (from === 'menu') {
      return {
        title: '美好生活 一键抵达',
        path: '/pages/tabBar/home/home',
        imageUrl: `${apiConfig.baseUrl}/library/img/wx/share.jpg`
      };
    }
    if (from === 'button') {
      return {
        title: this.specialData.wechat_title,
        path: '/pages/tabBar/home/home',
        imageUrl: this.specialData.wechat_xcx_img
      }
    }
  },
  methods: {
    async getHomeSpecial() {
      const { thematic_id: specialId } = await getHomeSpecial({
        project_id: this.projectId
      });
      if (specialId) {
        this.specialId = specialId;
        this.getSpecial();
      } else {
        this.specialId = '';
        this.specialData = [];
        this.specialList = [];
      }
    },
    async getSpecial() {
      const { data, child } = await getSpecial({
        thematic_id: this.specialId
      });
      if (+data.state === 1) {
        this.specialData = data;
        this.specialList = child;
      }
    },
    handleOperate(data) {
      if (!this.userInfo) {
        return;
      }
      const { block_type: type } = data;
      if (!+type) {
        return;
      }
      const methodObj = {
        1: 'goGoodsDetail',
        2: 'goPage',
        3: 'feature'
      };
      const methodName = methodObj[type];
      this[methodName](data);
    },
    goGoodsDetail({ goods_id: goodsId }) {
      goodsId &&
        this.$router.push({
          path: 'goodsDetail',
          query: {
            id: goodsId
          }
        });
    },
    goPage({ block_content: url }) {
      if (url) {
        const reg = /^(http|https):\/\//;
        const status = reg.test(url);
        if (status) {
          this.$router.push({
            path: 'activityFrame',
            isApp: true,
            query: {
              frameUrl: url
            }
          });
        } else {
          this.$router.push({
            path: url
          });
        }
      }
    },
    feature({ block_content: type }) {
      if (!type) {
        return;
      }
      const featureObj = {
        1: 'signIn'
      };
      const featureName = featureObj[type];
      this[featureName]();
    },
    signIn() {
      this.$refs.sign.signIn();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .uni-navbar {
  .uni-navbar__header-container {
    padding: 0;
  }
  .uni-navbar__header-container-inner {
    padding: 0;
    justify-content: flex-start;
  }
}
.mobile-image-box {
  display: flex;
  .mobile-image {
    flex: 1;
    width: 0;
  }
  .mobile-image:nth-child(even) {
    height: auto !important;
  }
}
.share-btn {
  width: 88rpx;
  padding: 0;
  position: fixed;
  right: 50rpx;
  bottom: 100rpx;
  background: none;
  .share-image {
    width: 88rpx;
    height: 88rpx;
  }
}
</style>
