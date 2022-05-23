<template>
  <view>
    <uni-nav-bar
      title="购买优惠券"
      statusBar="true"
      left-icon="left"
      :border="false"
      :fixed="true"
      @click-left="goBack"
    />
    <view class="tf-p-30-20">
      <coupon-order-card
        v-for="item in listData"
        :data="item"
        :key="item.id"
      ></coupon-order-card>
      <uni-load-more :status="loadMoreStatus" />
    </view>
  </view>
</template>

<script>
import CouponOrderCard from './components/CouponOrderCard';
import { getOrderList } from '@/api/personage';

export default {
  name: 'purchaseRecord',
  components: {
    CouponOrderCard
  },
  data() {
    return {
      listData: [],
      pageNum: 1,
      isFinish: false,
      loadMoreStatus: '',
    };
  },
  watch: {
    isFinish(newValue) {
      if (newValue) {
        this.loadMoreStatus = 'no-more';
      }
    }
  },
  onLoad() {
    this.handleLoad();
  },
  onReachBottom() {
    if (this.isFinish) {
      return;
    }
    this.pageNum++;
    this.handleLoad();
  },
  onPullDownRefresh() {
    this.refreshLoad();
  },
  methods: {
    async handleLoad() {
      if (this.isFinish) {
        return;
      }
      this.loadMoreStatus = 'loading';
      const { data } = await this.getOrderList();
      const listData = data.order_project_list
      this.loadMoreStatus = '';
      if (listData && listData.length > 0) {
        this.listData.push(...listData);
        this.isFinish = listData.length < 10;
      }
      uni.stopPullDownRefresh()
    },
    refreshLoad() {
      this.pageNum = 1;
      this.listData = [];
      this.isFinish = false;
      this.handleLoad();
    },
    getOrderList() {
      return getOrderList({
        page: this.pageNum,
        order_type: 3
      })
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
