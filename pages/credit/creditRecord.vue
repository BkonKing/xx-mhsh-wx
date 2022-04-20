<template>
  <view class="credit-record-page">
    <uni-nav-bar
      title="幸福币记录"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="goBack"
    />
    <van-tabs sticky :active="current" @change="onTabChange">
      <van-tab title="全部" name="0"></van-tab>
      <van-tab title="获得" name="1"></van-tab>
      <van-tab title="使用" name="2"></van-tab>
      <van-tab v-if="isShowWithdraw" title="提现" name="3"></van-tab>
      <van-tab title="不可用" name="4"></van-tab>
    </van-tabs>
    <view class="tf-p-30-20">
      <uni-list class="tf-uni-list" :border="false">
        <credit-record-item
          v-for="item in listData"
          :key="item.id"
          :data="item"
          :type="current == 4 ? 'disabled' : ''"
        ></credit-record-item>
      </uni-list>
      <uni-load-more :status="loadMoreStatus" />
    </view>
  </view>
</template>

<script>
import ListMixins from '@/mixins/list';
import { mapGetters } from 'vuex';
import CreditRecordItem from './components/CreditRecordItem';
import { getCreditsLog } from '@/api/personage';
export default {
  name: 'CreditRecord',
  mixins: [ListMixins],
  components: {
    CreditRecordItem
  },
  data() {
    return {
      tabParam: undefined,
      current: 0,
      isShowWithdraw: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad(options) {
    const tab = options.tab;
    if (tab) {
      this.tabParam = tab;
      this.current = tab;
    }
    this.isShowWithdraw = +this.userInfo.is_shops;
    this.getWithdrawList();
  },
  methods: {
    getListData() {
      return getCreditsLog({
        pages: this.pageNum,
        trans_type: this.current
      })
    },
    onTabChange(event) {
      this.current = event.detail.name;
      this.refreshLoad();
    },
    async getWithdrawList() {
      const { data } = await getCreditsLog({
        pages: 1,
        trans_type: 3
      });
      const haveData = data && data.length;
      this.isShowWithdraw = haveData || +this.userInfo.is_shops;
      if (!haveData && this.tabParam) {
        this.current = '0';
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.credit-record-page {
  ::v-deep .van-tabs__wrap {
    width: 100%;
    position: fixed;
  }
  ::v-deep .van-tab--active .tf-ellipsis {
    font-size: 32rpx;
  }
  ::v-deep .van-tabs__line {
    width: 40rpx !important;
    height: 6rpx;
    background: #ff5240;
    border-radius: 3rpx;
  }
  .tf-p-30-20 {
    margin-top: var(--tabs-line-height, 44px);
  }
}
</style>
