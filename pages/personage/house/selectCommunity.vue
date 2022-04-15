<template>
  <view class="select-community-container tf-bg tf-body">
    <view class="select-community-box">
      <uni-nav-bar
        :title="title"
        :fixed="true"
        :border="false"
        statusBar="true"
        left-icon="left"
        @click-left="goback"
      ></uni-nav-bar>
      <view class="tf-bg-white">
        <uni-search-bar
          v-model="searchValue[step]"
          placeholder="请输入关键字搜索"
          cancelButton="none"
        />
      </view>
      <view class="tf-body-container tf-overflow-auto">
        <transition-group tag="div" :name="transitionName">
          <view v-show="step === 0" class="tf-clist" key="0">
            <view
              class="tf-clist-box"
              v-for="(item, i) in projectList"
              v-show="item.project_name.indexOf(searchValue[0]) !== -1"
              :style="
                item.project_name.indexOf(searchValue[0]) !== -1
                  ? ''
                  : 'display:none;'
              "
              @click="handleSelect(item)"
              :key="i"
            >
              <view class="tf-clist-cell-left">{{ item.project_name }}</view>
              <view class="tf-icon tf-icon-right"></view>
            </view>
          </view>
          <view v-show="step === 1" class="tf-clist" key="1">
            <view
              class="tf-clist-box"
              v-for="(item, i) in buildList"
              v-show="item.unit_name.indexOf(searchValue[1]) !== -1"
              :style="
                item.unit_name.indexOf(searchValue[1]) !== -1
                  ? ''
                  : 'display:none;'
              "
              @click="handleSelect(item)"
              :key="i"
            >
              <view class="tf-clist-cell-left">{{ item.unit_name }}</view>
              <view class="tf-icon tf-icon-right"></view>
            </view>
          </view>
          <view v-show="step === 2" class="tf-clist" key="2">
            <view
              class="tf-clist-box"
              v-for="(item, i) in houseList"
              v-show="item.house_name.indexOf(searchValue[2]) !== -1"
              :style="
                item.house_name.indexOf(searchValue[2]) !== -1
                  ? ''
                  : 'display:none;'
              "
              @click="handleSelect(item)"
              :key="i"
            >
              <view class="tf-clist-cell-left">
                {{ `${activeBuild.unit_name}${item.house_name}` }}
              </view>
              <view class="tf-icon tf-icon-right"></view>
            </view>
          </view>
        </transition-group>
      </view>
    </view>
  </view>
</template>

<script>
import {
  searchProject,
  searchBuilding,
  searchUnit,
  searchHouse
} from '@/api/personage';
export default {
  data() {
    return {
      transitionName: '',
      searchValue: ['', '', ''],
      title: '选择小区',
      step: 0,
      projectList: [],
      activeProject: {},
      buildList: [],
      activeBuild: {},
      houseList: []
    };
  },
  onLoad() {
    this.getProject();
  },
  methods: {
    // 触发选中事件，根据不同步骤做相应处理
    handleSelect(item) {
      switch (this.step) {
        // 选择小区
        case 0:
          uni.showLoading({
            title: '加载中'
          });
          this.activeProject = item;
          this.getUnit(item);
          this.nextStep();
          break;
        // 选择楼栋单元
        case 1:
          uni.showLoading({
            title: '加载中'
          });
          this.activeBuild = item;
          this.getHouse(item);
          this.nextStep();
          break;
        // 选择房屋
        case 2:
          this.selectHouse(item);
          break;
      }
    },
    // 点击选中后下一步操作
    nextStep() {
      this.transitionName = 'slide-to-left';
      this.step++;
    },
    // 获取小区（项目）
    getProject() {
      searchProject().then(res => {
        this.projectList = res.data;
        uni.hideLoading();
      });
    },
    // 获取小区下单元
    getUnit(item) {
      searchUnit({
        projectId: item.id
      }).then(res => {
        this.buildList = res.data;
        uni.hideLoading();
      });
    },
    // 获取单元下房屋
    getHouse(item) {
      searchHouse({
        projectId: this.activeProject.id,
        buildingId: item.building_id,
        unitId: item.id
      }).then(res => {
        this.houseList = res.data;
        uni.hideLoading();
      });
    },
    // 选中房屋
    selectHouse(item) {
      const obj = {
        project_id: this.activeProject.id,
        project_name: this.activeProject.project_name,
        building_id: this.activeBuild.building_id,
        // building_name: this.activeBuild.building_name,
        unit_id: this.activeBuild.id,
        // unit_name: this.activeBuild.unit_name,
        house_id: item.id,
        house_name: this.activeBuild.unit_name + item.house_name
      };
      this.$store.commit('setTempData', obj);
      this.$router.go(-1);
    },
    // 获取搜索房屋
    getSearchBuilding() {
      searchBuilding({
        projectId: this.activeProject.id,
        buildingId: this.activeBuild.building_id,
        buildingName: this.searchValue[this.step]
      }).then(({ data }) => {
        console.log(data);
      });
    },
    // 在选择小区页面就返回，否则返回上一步
    goback() {
      if (this.step === 0) {
        this.$router.go(-1);
      } else {
        this.transitionName = 'slide-to-right';
        this.step--;
      }
    }
  },
  watch: {
    // 步骤变换则改变导航栏标题
    step(value) {
      const text = ['选择小区', '选择楼栋单元', '选择房屋'];
      this.title = text[value];
    }
  },
  beforeRouteLeave(to, from, next) {
    this.projectList = [];
    this.buildList = [];
    this.houseList = [];
    this.$nextTick(() => {
      next();
    });
  }
};
</script>

<style lang="scss" scoped>
.tf-clist {
  width: 100%;
  background-color: #fff;
  border-radius: 0;
  .tf-clist-box {
    width: 100%;
    height: 90rpx;
    padding: 20rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tf-clist-cell-left {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      flex: 1;
    }
    .tf-icon-right {
      width: 26rpx;
      font-size: 26rpx;
      color: #aaa;
      margin-left: 10rpx;
    }
  }
}
.select-community-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}
::v-deep .tf-clist {
  border-radius: 0;
}
.slide-to-right-enter-active,
.slide-to-right-leave-active,
.slide-to-left-enter-active,
.slide-to-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
  top: 208rpx;
  left: 0;
  right: 0;
  bottom: auto;
  backface-visibility: hidden;
  perspective: 800;
}
.slide-to-right-enter {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}
.slide-to-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-to-left-enter {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}
.slide-to-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
