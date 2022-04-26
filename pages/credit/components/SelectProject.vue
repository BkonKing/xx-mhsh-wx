<template>
  <tf-popup v-model="visible" type="bottom">
    <view class="select-project-popup">
      <template v-if="yxlpList && yxlpList.length">
        <uni-search-bar v-if="yxlpList.length >= 10" v-model="searchValue" />
        <scroll-view class="content" scroll-y="true">
          <uni-list>
            <uni-list-item
              v-for="(item, index) in searchList"
              :key="index"
              class="project-item"
              clickable="true"
              @click="selectHome(item, index)"
            >
              <template #header>
                <view class="title">
                  <view>{{ item.project }}</view>
                  <i
                    class="tf-icon"
                    :class="{ 'tf-icon-gou': currentIndex === index }"
                  ></i>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </scroll-view>
        <view class="btn" v-if="visible === true">
          <button class="tf-btn-primary" @click="confirm">确定</button>
        </view>
      </template>
      <van-empty
        v-else
        image="search"
        description="暂无楼盘"
        style="margin-top: 30%;"
      ></van-empty>
      <text
        v-if="visible === true"
        @click="visible = false"
        class="tf-icon tf-icon-guanbi1 guanbi"
      ></text>
    </view>
  </tf-popup>
</template>

<script>
import TfPopup from '@/components/TfPopup/index';
import { getYxlpList } from '@/api/personage';

export default {
  components: {
    TfPopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: undefined,
      searchValue: '',
      visible: this.value,
      houseActive: '',
      yxlpList: [], // 意向楼盘列表
      yxlpIndex: 0, // 意向楼盘索引
      searchBol: true // 控制是否显示搜索数据
    };
  },
  computed: {
    searchList() {
      const value = this.searchValue;
      if (!value) {
        return this.yxlpList;
      }
      return this.yxlpList.filter(item => {
        return item.project.includes(value);
      });
    }
  },
  watch: {
    value(val) {
      if (this.visible !== val) {
        this.visible = val;
      }
    },
    visible(val) {
      this.$emit('input', val);
    }
  },
  async created() {
    const res = await getYxlpList();
    this.yxlpList = res.data;
  },
  methods: {
    // 选择楼盘
    selectHome(item, index) {
      this.currentIndex = index;
      this.yxlpIndex = index;
      this.houseActive = item;
    },
    // 确定
    confirm() {
      this.visible = false;
      this.$emit('confirm', this.houseActive);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-project-popup {
  width: 750rpx;
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;

  .content {
    width: 100%;
    max-height: 800rpx;
    margin-bottom: 100rpx;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40rpx;

      .tf-icon-gou {
        font-size: 40rpx;
        font-weight: 600;
        color: black;
      }
    }
  }

  .btn {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 20rpx;
    width: 100%;

    button {
      border-radius: 10rpx;
      font-size: 34rpx;
    }
  }
  .guanbi {
    font-size: 50rpx;
    position: absolute;
    top: -90rpx;
    right: 30rpx;
    color: white;
    z-index: 999999999;
  }
}
.project-item ::v-deep .uni-list-item__container {
  padding: 24rpx 0;
}
</style>
