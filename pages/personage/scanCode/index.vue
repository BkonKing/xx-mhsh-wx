<template>
  <view class="tf-bg">
    <uni-nav-bar
      statusBar="true"
      left-icon="clear"
      color="#000"
      backgroundColor="#f2f2f4"
      :fixed="true"
      :border="false"
      @click-left="goBack"
    ></uni-nav-bar>
    <view class="tab-content">
      <template v-if="current === 1"></template>
      <view class="tab-container" v-if="current === 2">
        <image
          class="tab-container-bg"
          src="@/static/main/fukuan_bg.png"
          mode="aspectFill"
        ></image>
        <view class="tab-title">付款码</view>
        <view class="tab-content__box">
          <view class="qrcode-box">
            <image class="qrcode-image" :src="paymentCodeImg" />
          </view>
        </view>
      </view>
      <view class="tab-container" v-if="current === 3">
        <image
          class="tab-container-bg"
          src="@/static/main/fukuan_bg.png"
          mode="aspectFill"
        ></image>
        <view class="tab-title">收款码</view>
        <view class="tab-content__box">
          <view class="qrcode-box">
            <image class="qrcode-image" :src="collectCodeImg" />
          </view>
        </view>
      </view>
    </view>
    <view class="tabs">
      <view
        class="tab"
        v-for="(item, i) in tabs"
        :key="i"
        @click="switchTab(item.value)"
      >
        <view class="tab-text">{{ item.name }}</view>
        <view v-if="item.value === current" class="tab-active"></view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  paymentScan,
  collectScan,
  getPaymentCode,
  getCollectCode,
  paymentStatus,
  collectStatus
} from '@/api/personage';
import { getShopScanPermission } from '@/api/personage/shop.js';
import { handlePermission } from '@/utils/permission';
import { getAwardScan } from '@/api/award.js';
export default {
  data() {
    return {
      codeId: '',
      current: 0,
      tabs: [
        {
          value: 1,
          name: '扫一扫'
        },
        {
          value: 2,
          name: '付款码'
        },
        {
          value: 3,
          name: '收款码'
        }
      ],
      paymentCodeImg: '',
      collectCodeImg: '',
      timer: null
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    shopId() {
      return this.userInfo.shops_id;
    }
  },
  onLoad(options) {
    this.current = parseInt(options.current) || 1;
  },
  onUnload() {
    this.timer && clearTimeout(this.timer);
  },
  methods: {
    // 切换tab
    switchTab(value) {
      this.current = value;
      this.timer && clearTimeout(this.timer);
    },
    scanCode() {
      // 只允许通过相机扫码
      uni.scanCode({
        onlyFromCamera: true,
        success: res => {
          const result = res.result;
          if (result) {
            this.scanSuccess(result);
          }
        }
      });
    },
    // 扫码成功
    scanSuccess(value) {
      console.log(value);
      const valueArray = value.split('|');
      const key = valueArray[0];
      const methodNames = {
        shoukuan: 'collectScan',
        fukuan: 'paymentScan',
        shangpuyhq: 'getShopScanPermission',
        awardLogCode: 'getAwardScan',
      };
      const methodName = methodNames[key];
      methodName && this[methodName](value, valueArray);
    },
    getShopScanPermission(codeInfo) {
      this.shopId &&
        getShopScanPermission({
          shops_id: this.shopId
        })
          .then(({ data }) => {
            if (+data.is_scan) {
              this.goShopCouponVerification(codeInfo);
            }
          })
          .catch(() => {
            uni.showToast({
              title: '您没有核销权限',
              icon: 'none'
            });
          });
    },
    goShopCouponVerification(codeInfo) {
      this.$router.push({
        path: '/pages/personage/shop/verification',
        query: {
          codeInfo
        }
      });
    },
    async getAwardScan(value, valueArray) {
      const id = valueArray[1]
      const { data } = await getAwardScan({
        award_log_id: id
      });
      if (data.is_power) {
        this.goAwardVerification(id)
      }
    },
    goAwardVerification(id) {
      this.$router.push({
        path: '/pages/activity/award/verification',
        query: {
          id
        }
      })
    },
    // 获取付款码二维码
    getPaymentCode() {
      getPaymentCode().then(res => {
        const { url, code_id } = res.data;
        this.paymentCodeImg = url;
        this.codeId = code_id;
        this.pollingPayment();
      });
    },
    // 获取收款码二维码
    getCollectCode() {
      getCollectCode().then(res => {
        const { url, old_code_id } = res.data;
        this.collectCodeImg = url;
        this.codeId = old_code_id;
        this.pollingCollect();
      });
    },
    // 轮询付款码当前状态
    pollingPayment() {
      if (this.current !== 2) {
        return;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.paymentStatus();
      }, 3000);
    },
    // 轮询收款码当前状态
    pollingCollect() {
      if (this.current !== 3) {
        return;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.collectStatus();
      }, 3000);
    },
    // 出示付款码请求获取码当前状态
    paymentStatus() {
      paymentStatus({
        code_id: this.codeId
      }).then(({ data }) => {
        const { is_pay, credits, avatar, realname, mobile, remarks } = data;
        if (is_pay != '1') {
          if (credits && credits != '0') {
            this.$router.push({
              path: '/pages/credit/payment',
              query: {
                type: '3',
                value: this.codeId,
                avatar,
                realname,
                mobile,
                credits,
                remarks
              }
            });
          } else {
            this.pollingPayment();
          }
        } else {
          uni.showModal({
            title: '支付成功',
            showCancel: false
          });
        }
      });
    },
    // 出示收款码请求获取码当前状态
    collectStatus() {
      collectStatus({
        old_code_id: this.codeId
      }).then(({ data }) => {
        if (!data || data.is_pay != '1') {
          this.pollingCollect();
        } else {
          uni.showModal({
            content: `获得${data.credits}幸福币`,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                this.getCollectCode();
              }
            }
          });
        }
      });
    },
    // 付款人扫了收款码
    collectScan(value, values) {
      collectScan({
        code_info: value
      })
        .then(res => {
          const {
            check_status,
            is_pay,
            avatar,
            realname,
            mobile,
            code_id
          } = res.data;
          if (check_status) {
            this.$router.push({
              path: '/pages/credit/payment',
              query: {
                type: '1',
                value: code_id,
                avatar,
                realname,
                mobile
              }
            });
          }
        })
        .catch(err => {
          uni.showModal({
            title: err.message,
            showCancel: false
          });
        });
    },
    // 收款人扫了付款码
    paymentScan(value, values) {
      paymentScan({
        code_info: value
      })
        .then(res => {
          const { check_status, is_pay, avatar, realname, mobile } = res.data;
          if (check_status) {
            if (is_pay == 0) {
              this.$router.push({
                path: '/pages/credit/payment',
                query: {
                  type: '2',
                  value: values[1],
                  avatar,
                  realname,
                  mobile
                }
              });
            } else {
              uni.showToast({
                title: '对方已付款',
                icon: 'none',
                duration: 2000
              });
            }
          } else {
            uni.showToast({
              title: '扫码失败，二维码可能过期',
              icon: 'none',
              duration: 2000
            });
          }
        })
        .catch(err => {
          uni.showModal({
            title: err.message,
            showCancel: false
          });
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  watch: {
    current(value) {
      if (value === 1) {
        handlePermission({
          name: 'camera',
          title: '摄像头未开启',
          message: '为了提供更好服务，需要您摄像头'
        }).then(() => {
          this.scanCode();
        });
      } else {
        if (value === 2) {
          this.getPaymentCode();
        } else if (value === 3) {
          this.getCollectCode();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.barcode {
  width: 750rpx;
  flex: 1;
  background-color: #808080;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600rpx;
  height: 760rpx;
  margin-top: 142rpx;
  position: relative;
}

.tab-container-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.tab-title {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  text-align: center;
  color: #fff;
  font-size: 38rpx;
}

.tab-content__box {
  width: 100%;
  padding: 70rpx 50rpx;
  justify-content: center;
  align-items: center;
}

.qrcode-box {
  width: 500rpx;
  height: 500rpx;
  padding: 14rpx;
  border: 2rpx solid $red-dark;
}

.qrcode-image {
  width: 472rpx;
  height: 472rpx;
}

.tabs {
  display: flex;
  width: 750rpx;
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
  background-color: #383838;
}

.tab {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  height: 98rpx;
}

.tab-text {
  height: 76rpx;
  line-height: 98rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

.tab-active {
  width: 66rpx;
  height: 3rpx;
  background-color: $red-dark;
  border-radius: 2rpx;
}
</style>
