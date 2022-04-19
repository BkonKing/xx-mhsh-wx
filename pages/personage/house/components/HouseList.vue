<template>
  <view class="house-container tf-flex-column">
    <view class="tf-item-auto">
      <view
        v-for="(item, i) in houseList"
        :key="i"
        class="house-box"
        :class="{
          'house-owner': i === 0 && mode !== 2,
          'house-select': mode === 2 && selectId === item.house_id
        }"
        @click="handlechange(item, i)"
      >
        <view v-if="i === 0 && mode !== 2" class="tf-row-justify-center">
          <view class="house-owner-current">
            <image
              src="@/static/main/current-house-tag.png"
              mode="aspectFill"
            ></image>
            <view>当前房产</view>
          </view>
        </view>
        <view class="tf-row-justify-between">
          <view class="tf-flex-row">
            <view class="house-user house-user--relation">
              {{ houseRoleText[item.house_role] }}
            </view>
            <view class="tf-column-justify-around tf-flex-1">
              <view class="house-name">{{ item.project_name }}</view>
              <view class="house-address">{{ item.fc_info }}</view>
            </view>
          </view>
          <view
            v-if="mode && item.members && item.house_role == 1"
            class="tf-row-items-center house-people-box"
            @click.stop="manClick(item)"
          >
            <view class="tf-icon tf-icon-renshu"></view>
            <view class="house-people-number">{{ item.members }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="addStatus" class="btn-placeholder">
      <button class="tf-btn tf-btn-primary" @click="goAttestation">
        新增房产
      </button>
    </view>
  </view>
</template>

<script>
import { bindingDefault, bindingHouse } from '@/api/personage';
export default {
  name: 'houseContainer',
  props: {
    // 2:选择房屋，不显示当前房屋，显示选中房屋  1:选择房屋，显示当前房屋 0：显示房屋信息，设置当前房屋
    mode: {
      type: Number,
      default: 1
    },
    // 是否过滤门禁房屋
    entranceStatus: {
      type: Boolean,
      default: false
    },
    addStatus: {
      type: Boolean,
      default: true
    },
    selectId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      houseList: [],
      houseRoleText: {
        1: '业主',
        2: '业主成员',
        3: '租户',
        4: '租户成员'
      }
    };
  },
  created() {
    this.reload();
  },
  methods: {
    reload() {
      this.bindingHouse();
    },
    // 获取房产信息
    bindingHouse() {
      bindingHouse().then(res => {
        this.houseList = res.data || [];
        if (this.entranceStatus) {
          this.houseList = this.houseList.filter(obj => {
            return obj.is_menjin;
          });
        }
      });
    },
    // 新增房产
    goAttestation() {
      this.$router.push({
        path: '/pages/personage/house/attestation',
        query: {
          type: 1,
          mode: 0
        }
      });
    },
    // 房屋点击切换
    handlechange(item, index) {
      const { binding_id: bindingId } = item;
      // mode=1选择房屋触发change事件，mode=0设置当前房屋
      if (this.mode) {
        this.$emit('change', bindingId, item);
      } else {
        this.bindingDefault(bindingId, index);
      }
    },
    // 设置当前房屋
    bindingDefault(bindingId, index) {
      bindingDefault({
        binding_id: bindingId
      }).then(() => {
        const current = this.houseList.splice(index, 1);
        this.houseList.unshift(...current);
        this.$store.commit('setCurrentProject', ...current);
        this.$store.dispatch('getMyAccount');
        this.$router.go(-1);
      });
    },
    // 右边人员模块点击
    manClick(item) {
      this.$emit('manClick', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.house-container {
  width: 100%;
  height: 100%;
}

.house-owner {
  border: 2rpx solid $red-dark;
  padding-top: 0 !important;
}

.house-owner-current {
  position: relative;
  width: 194rpx;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 20rpx;
  color: #fff;
  text-align: center;
  margin-bottom: 20rpx;
  image {
    width: 194rpx;
    height: 40rpx;
  }
  view {
    width: 100%;
    position: absolute;
    top: 0;
    text-align: center;
  }
}

.house-select {
  border: 2rpx solid $red-dark;
}

.house-user {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 88rpx;
  padding: 0 12rpx;
  height: 88rpx;
  margin-right: 20rpx;
  color: #fff;
  font-size: 24rpx;
  text-align: center;
}

.house-user--owner {
  background-image: linear-gradient(to top left, #eb5841, #f9866b);
}

.house-user--relation {
  background-image: linear-gradient(to top left, #ffc017, #ffa110);
}

.house-user--tenant {
  background-image: linear-gradient(to top left, #45d5da, #31b4b9);
}

.house-name {
  font-size: 30rpx;
  color: $text-color;
}

.house-address {
  font-size: 30rpx;
  color: $gray-7;
}

.house-box {
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 8rpx;
}
.house-people-box {
  padding: 0 40rpx;
  border-left: 2rpx dashed #aaa;
}
.tf-column-justify-around {
  padding-right: 10rpx;
}
.house-people-number {
  font-size: 30rpx;
  color: #383838;
  margin-left: 20rpx;
}
.btn-placeholder {
  height: 70rpx;
  margin-top: 30rpx;
  margin-bottom: env(safe-area-inset-bottom);
  margin-bottom: constant(safe-area-inset-bottom);
}
.tf-btn {
  width: 710rpx;
  position: fixed;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
}
.tf-icon-renshu {
  font-size: 36rpx;
}
</style>
