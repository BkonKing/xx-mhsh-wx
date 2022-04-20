<template>
  <view class="tf-bg tf-body">
    <view class="theme-container"></view>
    <uni-nav-bar
      class="personage-nav-bar"
      statusBar="true"
      :fixed="true"
      style="visibility: hidden;"
    />
    <view class="tf-body-container tf-overflow-auto">
      <view class="theme-header">
        <view class="tf-flex-row tf-p-30" @click="goInformation">
          <image
            v-if="userInfo.avatar"
            class="personage-avatar"
            :src="userInfo.avatar"
          />
          <image
            v-else
            class="personage-avatar"
            src="@/static/main/touxiang.png"
          />
          <view class="personage-info--base">
            <template v-if="hasLogIn">
              <view class="user-info-box">
                <view class="user-name">{{ userInfo.nickname }}</view>
              </view>
              <view class="user-role-box">
                <image
                  v-if="shopData.is_reveal == 1 && isShop"
                  class="user-img"
                  src="@/static/personage/shangjia.png"
                />
                <image
                  v-if="shopData.is_clerk_reveal == 1 && isShopStaff"
                  class="user-img"
                  src="@/static/personage/dianyuan.png"
                />

                <van-tag
                  v-if="userType != '0'"
                  class="user-role"
                  plain
                  :color="userType | houseRoleColor"
                  :text-color="userType | houseRoleColor"
                  :inverted="true"
                  size="small"
                >
                  {{ userType | houseRoleText }}
                </van-tag>
                <van-tag
                  v-if="userInfo.position"
                  class="user-role"
                  plain
                  :color="5 | houseRoleColor"
                  :text-color="5 | houseRoleColor"
                  :inverted="true"
                  size="small"
                >
                  {{ userInfo.position }}
                </van-tag>
              </view>
              <view
                v-if="currentProject && currentProject.fc_info"
                class="user-address"
              >
                {{ currentProject.fc_info }}
              </view>
              <view
                v-else-if="
                  userInfo.bsbx_allots === '1' && userInfo.project_name
                "
                class="user-address"
              >
                {{ userInfo.project_name }}
              </view>
            </template>
            <template v-else>
              <view class="user-info-box">
                <view class="user-name">登录/注册</view>
              </view>
              <view class="user-address">登录后同步您的数据</view>
            </template>
          </view>
        </view>
        <view class="tf-flex-row credit-box">
          <view class="tf-flex-1 tf-flex-col" @click="goCredit">
            <view class="user-text--lg">{{ userInfo.credits || '--' }}</view>
            <view class="user-text--grey">幸福币</view>
          </view>
          <view class="tf-flex-1 tf-flex-col" @click="goCouponList">
            <view class="user-text--lg">{{ orderData.yhq_count || '--' }}</view>
            <view class="user-text--grey">优惠券</view>
          </view>
          <view class="tf-flex-1 tf-column-justify-center">
            <button
              class="tf-flex-center"
              :class="[
                'user-btn',
                userInfo.signin_status === 1
                  ? 'user-btn--unsign'
                  : 'user-btn--signin'
              ]"
              :loading="signLoading"
              @click="sign"
            >
              <image
                v-if="userInfo.signin_status === 0 && !signLoading"
                class="sign-img"
                src="@/static/main/my-sign.png"
              />
              <text class="tf-ml-10">
                {{ userInfo.signin_status | signText }}
              </text>
            </button>
          </view>
        </view>
      </view>
      <view class="functional-box">
        <!-- 列表模式 -->
        <uni-list class="tf-uni-list tf-mb-30" :border="false">
          <uni-list-item
            title="我的资料"
            showArrow="true"
            clickable
            @click="$router.push('/pages/personage/information/index')"
          >
            <template v-slot:header>
              <image
                class="list-item-image"
                src="@/static/personage/personage_ziliao.png"
              />
            </template>
          </uni-list-item>
        </uni-list>
        <uni-list class="tf-uni-list" :border="false">
          <uni-list-item
            title="消息"
            showArrow="true"
            badgeType="error"
            clickable
            :showBadge="userInfo.message_mum != 0"
            :badgeText="userInfo.message_mum"
            @click="$router.push('/pages/personage/message/index')"
          >
            <template v-slot:header>
              <image
                class="list-item-image"
                src="@/static/personage/personage_message.png"
              />
            </template>
          </uni-list-item>
          <uni-list-item
            title="常见问题"
            showArrow="true"
            clickable
            @click="$router.push('/pages/personage/question/index')"
          >
            <template v-slot:header>
              <image
                class="list-item-image"
                src="@/static/personage/personage_wenti.png"
              />
            </template>
          </uni-list-item>
          <uni-list-item
            title="意见反馈"
            showArrow="true"
            clickable
            @click="$router.push('/pages/personage/feedback/index')"
          >
            <template v-slot:header>
              <image
                class="list-item-image"
                src="@/static/personage/personage_fankui.png"
              />
            </template>
          </uni-list-item>
          <uni-list-item
            title="设置"
            showArrow="true"
            clickable
            @click="$router.push('/pages/personage/setting/index')"
          >
            <template v-slot:header>
              <image
                class="list-item-image"
                src="@/static/personage/personage_setting.png"
              />
            </template>
          </uni-list-item>
        </uni-list>
      </view>
      <tf-calendar v-model="showCalendar"></tf-calendar>
      <sign-rule-dialog v-model="signRuleVisible"></sign-rule-dialog>
      <sign-in-alert
        v-model="signAlertVisible"
        :message="signMessage"
        :credits="signOwnerCredits"
      ></sign-in-alert>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import TfCalendar from '@/modules/TfCalendar';
import SignRuleDialog from '@/pages/tabBar/credit/components/SignRuleDialog';
import SignInAlert from '@/modules/SignInAlert';
import { signin } from '@/api/personage';
import { throttle } from '@/utils/util';
import { handlePermission } from '@/utils/permission';
export default {
  name: 'PersonagePage',
  components: {
    SignRuleDialog,
    TfCalendar,
    SignInAlert
  },
  data() {
    return {
      signStatus: true, // 签到状态
      showCalendar: false, // 签到日历是否隐藏
      orderData: {}, // 订单数据
      hbBannerData: {}, // 美好红包数据
      signLoading: false, // 签到loading
      signRuleVisible: false, // 签到规则弹窗
      signAlertVisible: false, // 游客认证提醒弹窗
      signMessage: '', // 签到成功提醒
      signOwnerCredits: '', // 业主签到幸福币
      shopData: {},
      sign: throttle(this.handleSign)
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'userType', 'currentProject']),
    // 是否为商户
    isShop() {
      return +this.shopData.is_shops;
    },
    // 是否为商户店员
    isShopStaff() {
      return +this.shopData.is_shops_clerk;
    },
    hasLogIn() {
      return this.userInfo && this.userInfo.id;
    }
  },
  onLoad() {},
  onShow() {
    // 重新获取用户信息
    this.hasLogIn &&
      this.$store
        .dispatch('getMyAccount')
        .then(({ order_data, hb_banner_data, shops_data }) => {
          this.orderData = order_data;
          this.shopData = shops_data || {};
        });
  },
  methods: {
    // 签到
    handleSign() {
      if (!this.hasLogIn) {
        this.goLogin()
        return
      }
      if (this.userInfo.signin_status === 0) {
        // 签到一定要开启定位
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
              this.$store.dispatch('getMyAccount');
            })
            .catch(() => {
              this.signLoading = false;
            });
        });
      } else if (this.userInfo.signin_status === 2) {
        // 不可签到，打开签到规则弹窗
        this.signRuleVisible = true;
      } else {
        // 已签到，弹出签到日历
        this.showCalendar = true;
      }
    },
    goInformation() {
      this.$router.push('/pages/personage/information/index');
    },
    goCredit() {
      uni.switchTab({
        url: '/pages/tabBar/credit/credit'
      });
    },
    goCouponList() {
      this.$router.push('/pages/personage/coupon/list');
    },
    goLogin() {
      this.$router.push('/pages/index/login')
    }
  },
  filters: {
    signText(value) {
      return value === 1 ? '已签到' : '签到';
    }
  }
};
</script>

<style lang="scss" scoped>
.personage-nav-bar {
  background: initial;

  ::v-deep .uni-navbar--fixed {
    z-index: 1;
  }
}

.theme-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 260rpx;
  background-image: linear-gradient(to right, $red, $red-dark);
}

.tf-body {
  .credit-box {
    .tf-flex-col:first-child {
      border-right: 1rpx solid #f0f0f0;
    }

    .user-btn--signin {
      height: 84rpx;
      border-radius: 8rpx;
    }
  }
}

.theme-header {
  position: relative;
  z-index: 9;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background: #fff;
  overflow: hidden;
}

.tf-icon {
  width: 44rpx;
  font-size: 44rpx;
  color: $gray-8;
}

.personage-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-info-box {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 34rpx;
  font-weight: 500;
  color: $text-color;
  line-height: 1;
}

.user-role-box {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  line-height: 1;

  .user-img {
    width: 86rpx;
    height: 36rpx;
    margin-right: 10rpx;
  }
}

.user-role {
  min-height: 36rpx;
  margin-right: 10rpx;
  line-height: 1;
}

.user-address {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8f8f94;
  line-height: 42rpx;
  letter-spacing: 2rpx;
}

.user-text--lg {
  text-align: center;
  font-size: 54rpx;
  line-height: 54rpx;
  margin-bottom: 20rpx;
}

.user-text--grey {
  text-align: center;
  line-height: 24rpx;
  font-size: 24rpx;
  color: $gray-7;
}

.credit-box {
  padding: 10rpx 20rpx 40rpx;
}

.user-btn {
  width: 200rpx;
  height: 66rpx;
  border-radius: 33rpx;
  border-width: 0;
  font-size: 30rpx;
  padding: 0;
  .sign-img {
    width: 36rpx;
    height: 36rpx;
  }
}

.user-btn--signin {
  background-image: linear-gradient(to right, #f9866b, #eb5841);
  color: #fff;
}

.user-btn--unsign {
  background-image: none;
  background-color: #f2f2f4;
  color: #8f8f94;
}

.tf-uni-list {
  width: 710rpx;
}

.functional-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 30rpx 20rpx;
}

.list-item-image {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
}
</style>
