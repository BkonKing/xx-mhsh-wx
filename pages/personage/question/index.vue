<template>
  <view>
    <uni-nav-bar
      title="常见问题"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="goBack"
    />
    <scroll-view class="tf-body-container" scroll-y="true">
      <FAQ :data="questionList"></FAQ>
    </scroll-view>
    <view
      v-if="hotline"
      class="question-footer"
      @click="makePhoneCall(hotline)"
    >
      <view>客服热线</view>
      <view class="tf-text-sm tf-text-gray-7">{{ hotline }}</view>
    </view>
  </view>
</template>

<script>
import FAQ from './components/FAQ';
import { getEqList } from '@/api/personage';
export default {
  components: {
    FAQ
  },
  data() {
    return {
      questionList: [],
      hotline: ''
    };
  },
  onLoad() {
    this.getEqList();
  },
  methods: {
    async getEqList() {
      const { data } = await getEqList();
      this.questionList = data.eq;
      this.hotline = data.hotline;
    },
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-body-container {
  padding-bottom: 130rpx;
}

.question-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  text-align: center;
  background: #f2f2f4;
}
</style>
