<template>
  <uni-list-item
    clickable
    :title="data.title"
    :note="data.ctime"
    :rightText="creditNum"
    :class="{
      'credit-number-primary': parseInt(data.credits) > 0
    }"
    @click="goDetails(data)"
  >
  </uni-list-item>
</template>

<script>
export default {
  name: 'CreditRecordItem',
  // #ifdef MP-WEIXIN
  options: { styleIsolation: 'shared' },
  // #endif
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    creditNum() {
      const value = this.data.credits;
      const symbol = parseInt(value) > 0 && this.type !== 'disabled' ? '+' : '';
      return `${symbol}${value}`;
    }
  },
  methods: {
    goDetails({ id, cash_id: cashId, id_type: idType, data_type: dataType }) {
      if (cashId) {
        // 提现
        this.$router.push({
          path: 'shopWithdrawDetail',
          query: {
            id
          }
        });
      } else if (dataType === 1) {
        // 不可用提现
        this.$router.push({
          path: 'shopWithdrawDetail',
          query: {
            id,
            idType
          }
        });
      } else if (dataType === 2) {
        // 不可用任务
        this.$router.push({
          path: 'taskDetail',
          query: {
            taskId: id
          }
        });
      } else {
        this.$router.push({
          path: '/pages/credit/creditDetail',
          query: {
            id
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .uni-list-item__content-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #000000;
}
::v-deep .uni-list-item__extra-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #000000;
}
.credit-number-primary ::v-deep .uni-list-item__extra-text {
  color: #febf00;
}
</style>
