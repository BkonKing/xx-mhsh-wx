<template>
  <view class="login-page">
    <view class="logo-header">
      <image src="@/static/main/login_header.jpg" mode="aspectFill"></image>
    </view>
    <uni-icons
      type="left"
      size="20"
      color="#fff"
      class="uni-icon-left"
      @click="goBack"
    ></uni-icons>
    <view class="logo-container">
      <image class="logo" src="@/static/main/login_logo.png" />
    </view>
    <view class="form-container">
      <input
        v-model="mobile"
        class="form-input"
        placeholder-class="login-input-placeholder"
        maxlength="11"
        type="digit"
        placeholder="手机号"
      />
      <view v-if="loginType === 1" class="code-cell">
        <input
          v-model="yzm"
          key="code"
          class="form-input tf-flex-1"
          placeholder-class="login-input-placeholder"
          maxlength="4"
          type="digit"
          placeholder="验证码"
        />
        <button
          class="query-code-btn"
          :class="{ 'code-count-down': codeStatus }"
          :disabled="codeStatus"
          @click="verifCode"
        >
          <van-count-down
            v-if="codeStatus"
            :time="countDownTime"
            @finish="countFinish"
          >
            <template v-slot="{ timeData }">
              <text>重发({{ timeData.seconds }}s)</text>
            </template>
          </van-count-down>
          <text v-else>获取验证码</text>
        </button>
      </view>
      <uni-easyinput
        v-if="loginType === 2"
        v-model="pwd"
        class="tf-w-full"
        placeholder-style="font-size: 30rpx;color: #383838;"
        type="password"
        maxlength="16"
        placeholder="密码"
        :inputBorder="false"
      ></uni-easyinput>
      <button class="login-btn" :disabled="loginLoading" @click="submitLogin">
        登 录
      </button>
      <text
        class="login-method__text"
        @click="loginType = loginType === 1 ? 2 : 1"
      >
        {{ loginType === 1 ? '密码登录' : '验证码登录' }}
      </text>
      <view class="agreement">
        <view class="tf-p-10" @click="agree = !agree">
          <view class="agreement-checkbox-input">
            <text
              class="tf-icon checkbox-icon"
              :class="{ 'tf-icon-gou': agree }"
            ></text>
          </view>
        </view>
        <view class="agreement-text">
          <text class="tf-ptb-10" @click="agree = !agree">已阅读并同意</text>
          <navigator
            class="agreement-link"
            url="/pages/index/agreement?articleType=1"
          >
            《{{ userAgreementTitle }}》
          </navigator>
          <navigator
            class="agreement-link"
            url="/pages/index/agreement?articleType=6"
          >
            《{{ privacyAgreementTitle }}》
          </navigator>
        </view>
      </view>
    </view>
    <agree-popup v-model="agreePopup" @handleAgree="handleAgree"></agree-popup>
    <tf-dialog
      v-model="logoutDialog"
      title="账号注销已提交"
      closeIconType="hidden"
      confirmText="我知道了"
      :header-border="false"
      :showCancel="false"
      @confirm="logoutDialog = false"
    >
      <text class="tf-text-sm">
        您的账号注销申请已提交，在30天内请不要登录美好生活家园APP，以确保注销顺利完成。可再次查看
      </text>
      <navigator
        class="tf-text-sm tf-text-link"
        url="/pages/index/agreement?articleType=7"
      >
        《{{ logoutAgreementTitle }}》
      </navigator>
      <template v-slot:footer>
        <view
          class="tf-mt-30 tf-text-sm tf-text-align-center tf-text-gray-7"
          @click="openCancelLogoutDialog"
        >
          取消注销申请
        </view>
      </template>
    </tf-dialog>
    <tf-dialog
      v-model="cancelLogoutDialog"
      title="确定取消账号注销申请"
      content="取消账号注销申请后，不再删除账号的数据，您的账号可正常进行登录。"
      content-class-name="tf-text-sm"
      closeIconType="hidden"
      confirmText="确定取消"
      :header-border="false"
      :showCancel="false"
      @confirm="cancelLogout"
    ></tf-dialog>
  </view>
</template>

<script>
import { yzmLogin, pwdLogin, verifCode, cancelLogout } from '@/api/user';
import { validEmpty, bMapGetLocationInfo } from '@/utils/util';
import { getAllAgreement } from '@/api/user';
import AgreePopup from './components/AgreePopup';
import TfDialog from '@/components/TfDialog/index';

export default {
  name: 'login',
  components: {
    AgreePopup,
    TfDialog
  },
  data() {
    return {
      firstStatus: false, // 是否第一次登录
      mobile: undefined,
      yzm: undefined, // 验证码
      pwd: undefined, // 密码
      loginType: 1, // 1:验证码登录 2：密码登陆
      agree: false, // 同意协议
      // showPassword: false,
      codeStatus: false, // 验证码发送状态
      countDownTime: 60000,
      status: 0, // 1：换个账号登录 0：登录
      loginLoading: false, // 登录loading状态
      userAgreementTitle: '用户协议', // 用户协议标题
      privacyAgreementTitle: '隐私协议', // 隐私协议标题
      logoutAgreementTitle: '注销重要提示', // 注销协议标题
      agreePopup: false, // 登录协议弹窗
      logoutDialog: false,
      cancelLogoutDialog: false,
      loginData: {}, // 注销用户保护期登录保存登录成功数据,确认取消申请后登录使用
      isCanBack: false
    };
  },
  onLoad(options) {
    // this.firstStatus = uni.getStorageSync('first-login')
    // if (!this.firstStatus) {
    //   this.agreePopup = true
    // }
    // this.status = options.status
    // 换个账号登录则默认同意协议
    // if (this.status) {
    //   this.agree = true
    // }
    this.isCanBack = getCurrentPages().length > 1;
    this.getAllAgreement();
  },
  methods: {
    // 获取协议名称
    getAllAgreement() {
      getAllAgreement().then(({ data }) => {
        data.forEach(obj => {
          obj.article_type === '1' && (this.userAgreementTitle = obj.title);
          obj.article_type === '6' && (this.privacyAgreementTitle = obj.title);
          obj.article_type === '7' && (this.logoutAgreementTitle = obj.title);
        });
      });
    },
    // 同意协议
    handleAgree() {
      this.agree = true;
    },
    openCancelLogoutDialog() {
      this.logoutDialog = false;
      this.cancelLogoutDialog = true;
    },
    // 提交登录验证
    submitLogin() {
      if (!this.agree) {
        this.agreePopup = true;
        return;
      }
      let params;
      if (this.loginType === 1) {
        // 验证码登录
        if (
          validEmpty(this.mobile, '请输入手机号码') ||
          validEmpty(this.yzm, '请输入验证码')
        ) {
          return;
        }
        params = {
          mobile: this.mobile,
          yzm: this.yzm
        };
      } else if (this.loginType === 2) {
        // 密码登录
        if (
          validEmpty(this.mobile, '请输入手机号码') ||
          validEmpty(this.pwd, '请输入密码')
        ) {
          return;
        }
        params = {
          mobile: this.mobile,
          pwd: this.pwd
        };
      }
      this.login(params);
    },
    // 获取地址登录
    async login(params) {
      this.loginLoading = true;

      uni.showLoading({
        title: '正在登录中'
      });

      // 获取当前地址
      let newParams = params;
      try {
        const ret = await bMapGetLocationInfo();
        const locationInfo = {
          lon: ret.longitude, // 数字类型；经度
          lat: ret.latitude // 数字类型；纬度
        };
        newParams = {
          ...locationInfo,
          ...params,
          is_xcx: 1
        };
      } catch (error) {}
      this.requestLogin(newParams);
    },
    // 登录请求
    requestLogin(newParams) {
      const loginUrl = this.loginType === 1 ? yzmLogin : pwdLogin;
      loginUrl(newParams)
        .then(res => {
          uni.hideLoading();
          const { data, success } = res;
          if (success) {
            if (+data.is_popup) {
              // 弹出注销提交
              this.logoutDialog = true;
              this.loginData = data;
            } else {
              // 登录成功
              this.loginSuccess(data);
            }
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            });
          }
        })
        .catch(res => {
          uni.hideLoading();
          uni.showToast({
            title: res.message,
            icon: 'none'
          });
        })
        .finally(() => {
          this.loginLoading = false;
        });
    },
    // 成功登录
    async loginSuccess(data) {
      // 保存token和tokenList(多账号切换)
      this.setToken(data);

      this.$store.commit('setUserInfo', data);
      this.$store.dispatch('getMyAccount');
      await this.$store.dispatch('getHouse');
      // 第一次登录成功后，下次不进入自动勾选协议
      // if (!this.firstStatus) {
      //   api.setPrefs({
      //     key: 'first-login',
      //     value: 1
      //   });
      // }
      this.loginJump();
    },
    // 保存token和tokenList(多账号切换)
    setToken(data) {
      // console.log(data.access_token);
      uni.setStorageSync('access_token', data.access_token);
      uni.setStorageSync('refresh_token', data.refresh_token);
      // let tokenList = uni.getStorageSync('tokenList') || {};
      // tokenList =
      //   typeof tokenList === 'string' ? JSON.parse(tokenList) : tokenList;
      // tokenList[data.id] = data.access_token;
      // uni.setStorageSync('tokenList', tokenList);
    },
    // 登录跳转，判断是否通过分享进入未登录情况下吗，登录成功后跳转到分享页面，否则跳转到首页
    loginJump() {
      uni.switchTab({
        url: '/pages/tabBar/personage/personage'
      });
    },
    // 确定取消注销申请
    cancelLogout() {
      cancelLogout({
        mobile: this.mobile
      }).then(({ success }) => {
        if (success) {
          this.loginSuccess(this.loginData);
        }
      });
    },
    // 发送验证码
    verifCode() {
      if (this.mobile.length < 11) {
        uni.showToast({
          title: '请正确输入手机号',
          icon: 'none'
        })
        return
      }
      verifCode({
        mobile: this.mobile
      })
        .then(res => {
          uni.showToast({
            title: '验证码发送成功，请注意查收',
            icon: 'none'
          });
          this.codeStatus = true;
        })
        .catch(err => {
          if (!err) {
            uni.showToast({
              title: '获取失败，请重试',
              icon: 'none'
            });
          }
          this.codeLoading = false;
        });
    },
    // 倒计时结束
    countFinish() {
      this.countDownTime = 60000;
      this.codeStatus = false;
    },
    goBack() {
      if (this.isCanBack) {
        this.$router.go(-1);
      } else {
        this.$router.push('/pages/tabBar/home/home');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;

  .uni-icon-left {
    position: fixed;
    left: 20rpx;
    top: 52rpx;
    margin-top: var(--status-bar-height);
  }

  .logo-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 339rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 190rpx;
    height: 190rpx;
    z-index: 1;
    margin-top: 244rpx;
    background: #ffffff;
    box-shadow: 0rpx 15rpx 21rpx 0rpx rgba(199, 0, 23, 0.2);
    border-radius: 50%;

    .logo {
      width: 140rpx;
      height: 140rpx;
    }
  }
  
  .tf-ptb-10 {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 560rpx;
  margin-top: 86rpx;

  .code-cell {
    display: flex;
    width: 100%;
  }

  .form-input,
  ::v-deep .uni-easyinput {
    align-items: center;
    width: 100%;
    height: 86rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    margin-bottom: 60rpx;
    border: none;
    border-bottom: 1rpx solid $red;
    font-size: 42rpx;
    background-color: rgba(255, 255, 255, 0.4);

    .tf-icon {
      display: flex;
      line-height: 80rpx;
      padding-left: 10rpx;
      padding-right: 10rpx;
      font-size: 36rpx;
    }
  }

  ::v-deep .uni-easyinput__content-input {
    padding-left: 0 !important;
  }

  .query-code-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 88rpx;
    padding: 0;
    margin-left: 40rpx;
    border: 2rpx solid $red;
    border-radius: 4rpx;
    font-size: 24rpx;
    color: $red;
    background-color: #fff;
    &::after {
      content: initial;
    }
  }

  .code-count-down {
    background: #f2f2f4;
    color: #8f8f94;
    border-color: #f2f2f4;
  }

  .login-btn {
    width: 560rpx;
    height: 88rpx;
    line-height: 88rpx;
    margin-top: 36rpx;
    margin-bottom: 40rpx;
    background-image: linear-gradient(to right, $red, $red-dark);
    border-radius: 44rpx;
    border-width: 0;
    font-size: 30rpx;
    color: #fff;
    text-align: center;
  }

  .login-method__text {
    font-size: 26rpx;
    color: #8f8f94;
    text-decoration: underline;
  }
}

::v-deep .uni-easyinput .content-clear-icon {
  padding: 0;
  .uni-icons {
    padding: 10rpx 0;
  }
}

.agreement {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  margin-top: 160rpx;

  .agreement-checkbox-input {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 30rpx;
    height: 28rpx;
    margin-top: 2rpx;
    border: 2rpx solid #aaa;

    .tf-icon-gou {
      font-size: 24rpx;
      color: #aaa;
    }
  }

  .agreement-text {
    font-size: 24rpx;
    color: #8f8f94;
    text-align: center;

    .agreement-link {
      color: #8f8f94;
    }
  }
}
</style>

<style>
.login-input-placeholder {
  font-size: 30rpx;
  color: #383838;
}
</style>
