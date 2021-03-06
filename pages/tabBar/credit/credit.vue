<template>
  <view class="credit-page">
    <uni-nav-bar
      title="幸福币"
      class="credit-nav-bar"
      statusBar="true"
      backgroundColor="#f2f2f4"
      :fixed="true"
      :border="false"
    />
    <view class="page-bg">
      <view class="sign-box">
        <view class="coin-box">
          <image
            class="credit-header-bg"
            src="@/static/personage/credits_header.png"
          />
          <view class="tf-icon tf-icon-xingfubi1 coin-icon">
            <text class="coin-number">{{ credits }}</text>
          </view>
          <view v-if="ky_credits || freezeCredit" class="coin-freeze">
            <text>可用{{ ky_credits }}</text>
            <text v-if="freezeCredit">不可用{{ freezeCredit }}</text>
          </view>
          <button
            class="sign-tag tf-flex-center"
            :loading="signLoading"
            :class="{ 'sign-tag--complete': signinToday !== 0 }"
            @click="throttleSignIn"
          >
            <image
              class="sign-img"
              src="@/static/personage/qiandao.png"
              alt=""
            />
            {{ signinToday === 1 ? '已签到' : '签到' }}
          </button>
        </view>
      </view>
      <view class="scan-box">
        <view class="function-box" @click="goScanCode(1)">
          <image
            class="function-box__icon"
            src="@/static/personage/credits_saoyisao.png"
          />
          <view class="function-box__text">扫一扫</view>
        </view>
        <view class="function-box" @click="goScanCode(2)">
          <image
            class="function-box__icon"
            src="@/static/personage/credits_shoukuan.png"
          />
          <view class="function-box__text">付款码</view>
        </view>
        <view class="function-box" @click="goScanCode(3)">
          <image
            class="function-box__icon"
            src="@/static/personage/credits_fukuan.png"
          />
          <view class="function-box__text">收款码</view>
        </view>
        <view class="function-box" @click="goCreditRecord">
          <image
            class="function-box__icon"
            src="@/static/personage/credits_record.png"
          />
          <view class="function-box__text">明细</view>
        </view>
      </view>
    </view>
    <view
      v-if="isShowBanner"
      class="banner-container"
      @click="openCouponCentre"
    >
      <image class="coupon-banner" :src="shopBannerInfo.banner" alt="" />
      <rich-text class="banner-text" :nodes="bannerText"></rich-text>
    </view>
    <view v-if="taskData && taskData.length" class="credit-task-box">
      <task-list
        :data="taskData"
        :signinToday="signinToday"
        :userType="userType"
        :entranceStatus="entranceStatus"
        :show-unfinished="true"
        @signIn="throttleSignIn"
      ></task-list>
    </view>
    <view class="tf-mt-30">
      <van-tabs
        v-if="hasLogIn"
        :active="tabActive"
        class="credit-tabs"
        sticky
        :z-index="2"
        :offset-top="offsetTop"
        :lazy-render="false"
        @change="onTabChange"
      >
        <van-tab v-if="showCouponCentre" title="领券中心" name="1">
          <get-coupon-list
            ref="getCouponList"
            :creditPayVisible.sync="showPayCredit"
            @handleCreditPay="openCreditPay"
            @getSuccess="init"
            @noData="showCouponCentre = false"
          ></get-coupon-list>
        </van-tab>
        <van-tab
          v-if="taskData && taskData.length"
          title="任务中心"
          class="task-tab"
          name="2"
        >
          <task-list
            :data="taskData"
            :signinToday="signinToday"
            :userType="userType"
            :entranceStatus="entranceStatus"
            @signIn="throttleSignIn"
          ></task-list>
        </van-tab>
      </van-tabs>
    </view>
    <tf-calendar v-model="showCalendar"></tf-calendar>
    <sign-rule-dialog v-model="signRuleVisible"></sign-rule-dialog>
    <sign-in-alert
      v-model="signAlertVisible"
      :message="signMessage"
      :credits="signOwnerCredits"
    ></sign-in-alert>
    <tf-popup
      v-model="showPayCredit"
      closeable
      type="bottom"
      class="credit-popup"
      :isMaskClick="true"
    >
      <view class="credit-title">付款</view>
      <view class="credit-content">
        <text class="tf-icon tf-icon-xingfubi1"></text>
        {{ activeCoupon.pay_money }}
      </view>
      <button class="credit-confirm-btn" @click="receiveCoupon">
        确定付款
      </button>
    </tf-popup>
    <mobile-login-popup
      v-model="loginVisible"
      @success="init"
    ></mobile-login-popup>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import apiConfig from '@/api/config';
import { signin, getCreditsAccount } from '@/api/personage';
import { getShopCouponBanner } from '@/api/personage/shop';
import TfPopup from '@/components/TfPopup/index';
import TfCalendar from '@/modules/TfCalendar';
import MobileLoginPopup from '@/modules/MobileLoginPopup/index';
import SignInAlert from '@/modules/SignInAlert';
import { throttle } from '@/utils/util';
import { handlePermission } from '@/utils/permission';
import GetCouponList from './components/GetCouponList';
import TaskList from './components/TaskList';
import SignRuleDialog from './components/SignRuleDialog';

export default {
  components: {
    TfCalendar,
    SignInAlert,
    SignRuleDialog,
    GetCouponList,
    TaskList,
    TfPopup,
    MobileLoginPopup
  },
  data() {
    return {
      showCalendar: false, // 签到日历是否隐藏
      signinToday: 0, // 今日是否签到
      credits: '--', // 当前幸福币
      taskData: [], // 任务列表  task_type： 1: 签到 2：认证成功 3：首次开门 7:朋友到访、购房奖励
      // creditsGoods: [], // 幸福币商品列表
      signLoading: false, // 签到按钮loading
      entranceStatus: true, // 是否有门禁
      signRuleVisible: false,
      sd_credits: '', // 锁定幸福币
      ky_credits: '', // 可用幸福币
      signAlertVisible: false, // 游客认证提醒弹窗
      signMessage: '', // 签到成功提醒
      signOwnerCredits: '', // 业主签到幸福币
      tabActive: '1',
      offsetTop: 0,
      shopBannerInfo: {},
      showCouponCentre: true,
      throttleSignIn: throttle(this.handleSignIn),
      showPayCredit: false,
      activeCoupon: {},
      loginVisible: false
    };
  },
  computed: {
    ...mapGetters(['userType', 'userInfo']), // 1业主、2业主成员、3租户、4租户成员
    shopId() {
      return this.userInfo.shops_id;
    },
    isShowBanner() {
      return +this.shopBannerInfo.z_money;
    },
    bannerText() {
      const bannerText = this.shopBannerInfo.banner_text;
      if (!bannerText) {
        return '';
      }
      const text = bannerText.split('$money$');
      if (text.length < 2) {
        return bannerText;
      }
      const text0 = text[0];
      const text1 = text[1];
      const couponNum = this.shopBannerInfo.z_money;
      return `${text0}<span class="shop-coupon-banner-number">${couponNum}</span>${text1}`;
    },
    freezeCredit() {
      return +this.sd_credits;
    },
    hasLogIn() {
      return this.userInfo && this.userInfo.id;
    }
  },
  onLoad() {
    this.offsetTop = uni.getSystemInfoSync().statusBarHeight;
    !this.hasLogIn && (this.loginVisible = true);
  },
  onShow() {
    this.init();
  },
  onHide() {
    this.loginVisible = false
  },
  onPullDownRefresh() {
    this.init();
  },
  onShareAppMessage() {
    return {
      title: '美好生活 一键抵达',
      path: '/pages/tabBar/credit/credit',
      imageUrl: `${apiConfig.baseUrl}/library/img/wx/share.jpg`
    };
  },
  methods: {
    init() {
      if (this.hasLogIn) {
        this.getCreditsAccount();
        this.getShopCouponBanner();
        this.$refs.getCouponList && this.$refs.getCouponList.init();
      }
    },
    // 获取幸福币信息
    getCreditsAccount() {
      getCreditsAccount().then(({ data }) => {
        this.signinToday = data.signin_status;
        this.taskData = data.task_list;
        this.credits = data.credits;
        this.entranceStatus = !!+data.mj_status;
        this.ky_credits = data.ky_credits;
        this.sd_credits = data.sd_credits;
      });
    },
    async getShopCouponBanner() {
      const { data } = await getShopCouponBanner({
        shops_id: this.shopId
      });
      this.shopBannerInfo = data || {};
      if (!+this.shopBannerInfo.z_money) {
        this.tabActive = '2';
      }
    },
    // 签到事件
    handleSignIn() {
      if (!this.hasLogIn) {
        this.$router.push('/pages/index/login');
        return;
      }
      if (this.signinToday === 1) {
        // 已签到，则打开签到日历
        this.showCalendar = true;
      } else if (this.signinToday === 2) {
        // 不可签到，打开签到规则弹窗
        this.signRuleVisible = true;
      } else {
        this.signin();
      }
    },
    // 签到请求
    signin() {
      handlePermission({
        name: 'userLocation',
        title: '定位服务未开启',
        message: '为了提供更好服务，需要您开启定位'
      }).then(() => {
        this.signLoading = true;
        signin()
          .then(res => {
            this.signLoading = false;
            if (+res.open_box) {
              this.signMessage = res.message;
              this.signOwnerCredits = res.owner_credits;
              this.signAlertVisible = true;
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none'
              });
            }
            this.getCreditsAccount();
          })
          .catch(() => {
            this.signLoading = false;
          });
      });
    },
    openCreditPay(data) {
      this.activeCoupon = data;
    },
    receiveCoupon() {
      this.$refs.getCouponList && this.$refs.getCouponList.receiveCoupon();
    },
    // 扫一扫
    goScanCode(current) {
      this.$router.push({
        path: '/pages/personage/scanCode/index',
        query: {
          current
        }
      });
    },
    goCreditRecord() {
      this.$router.push('/pages/credit/creditRecord');
    },
    onTabChange(event) {
      this.tabActive = event.detail.name;
    },
    // 菜单悬挂顶部，tab切换到“领券中心”
    openCouponCentre() {
      this.tabActive = '1';
      this.$nextTick(() => {
        uni.pageScrollTo({
          selector: '.credit-tabs',
          duration: 300
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.credit-nav-bar {
  ::v-deep .uni-navbar__header {
    display: none;
  }
}

.credit-page {
  background-color: #f7f7f7;
}

.page-bg {
  margin: 30rpx 20rpx 0;
}

.sign-box {
  position: relative;
  z-index: 2;
  width: 710rpx;
  height: 336rpx;
}

.credit-header-bg {
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  width: 710rpx;
  height: 336rpx;
  object-fit: cover;
}

.coin-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70rpx;

  .coin-icon {
    font-size: 56rpx;
    line-height: 1;
    color: #fff;
  }

  .coin-number {
    margin-left: 26rpx;
    font-size: 56rpx;
    line-height: 1;
    font-weight: 500;
    color: #fff;
  }

  .coin-freeze {
    display: flex;
    align-items: center;
    margin-top: 34rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;

    text {
      line-height: 1;
    }

    text + text {
      margin-left: 26rpx;
    }
  }

  .sign-tag {
    width: 200rpx;
    height: 80rpx;
    margin-top: 34rpx;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
    background: linear-gradient(90deg, #ef9237 0%, #ec5850 99%);
    border: none;
    border-radius: 40rpx;

    ::v-deep .van-button__text {
      display: flex;
      align-items: center;
      line-height: 1;
    }
  }

  .sign-img {
    width: 28rpx;
    height: 28rpx;
    margin-right: 16rpx;
  }

  .sign-tag--complete {
    opacity: 0.2;
  }
}

.scan-box {
  display: flex;
  justify-content: space-around;
  width: 710rpx;
  padding: 120rpx 30rpx 60rpx;
  margin-top: -60rpx;
  background: #fff;

  .function-box__text {
    font-size: 26rpx;
    color: #7a7a7e;
    text-align: center;
  }

  .function-box__icon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
  }
}

.banner-container {
  width: 710rpx;
  height: 140rpx;
  margin: 30rpx 20rpx 0;
  position: relative;

  .coupon-banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-text {
    position: absolute;
    top: 42rpx;
    left: 86rpx;
    font-size: 32rpx;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(0deg, #ffe28c 0.2685546875%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.credit-task-box {
  flex: 1;
  margin: 30rpx 20rpx 0;
}

.credit-tabs {
  ::v-deep .van-sticky-wrap--fixed {
    background-color: #ffffff;
    padding-top: env(safe-area-inset-top);
    padding-top: constant(safe-area-inset-top);
  }
  ::v-deep .van-tabs__wrap {
    height: 110rpx;

    .van-tabs__nav {
      background: linear-gradient(0deg, #f7f7f7 0%, #ffffff 100%);
      border-radius: 20rpx 20rpx 0rpx 0rpx;
    }

    .van-tabs__scroll {
      background-color: initial;
    }

    .van-tab {
      flex: initial;
      justify-content: flex-start;
      width: 180rpx;
      padding: 50rpx 20rpx 30rpx;
      line-height: 30rpx;
      text-align: left;
      text {
        line-height: 1.1;
      }
    }

    .van-tabs__line {
      width: 55rpx !important;
      height: 8rpx;
      left: -40rpx;
      background: #ff6555;
      border-radius: 4rpx;
    }

    .van-tab--active .van-tab__text {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  ::v-deep .van-tabs__content {
    margin-top: 50rpx;
  }
}

.task-tab ::v-deep .van-tab__pane {
  padding: 0 20rpx 30rpx;
}

::v-deep .uni-popup .vue-ref {
  z-index: 999;
}

.credit-popup {
  height: 330rpx;

  .credit-title {
    padding: 30rpx;
    font-size: 32rpx;
    color: #000;
    text-align: center;
  }

  ::v-deep .van-icon-cross {
    top: 30rpx;
    right: 30rpx;
    font-size: 34rpx;
  }

  .credit-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .credit-confirm-btn {
    width: 410rpx;
    height: 80rpx;
    line-height: 80rpx;
    margin: 50rpx 170rpx 30rpx;
    background: #ff6555;
    border-radius: 40rpx;
    border: none;
    font-size: 28rpx;
    color: #ffffff;
  }
}
</style>

<style>
.shop-coupon-banner-number {
  font-size: 56rpx;
  line-height: 1;
}
</style>
