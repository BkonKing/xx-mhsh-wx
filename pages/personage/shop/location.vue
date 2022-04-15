<template>
  <view class="map-bg">
    <uni-nav-bar
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <map
      :latitude="mapInfo.latitude"
      :longitude="mapInfo.longitude"
      style="width: 100%;height: 100%;"
    ></map>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      mapInfo: {}
    };
  },
  onLoad(options) {
    this.mapInfo = options;
    uni.showLoading({
      title: '加载中'
    });
    setTimeout(() => {
      uni.hideLoading();
      this.show = true;
    }, 500);
  },
  methods: {
    // getMapInfo () {
    //   this.mapInfo = this.$route.query
    // }
  }
};
</script>

<style lang="scss" scoped>
  .map-bg {
    position: fixed;
    width: 100%;
    height: 100%;
  }
</style>
