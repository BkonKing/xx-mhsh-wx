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
      :markers="markers"
      style="width: 100%;height: calc(100% - 258rpx);"
    ></map>
    <view class="bottom-fixed">
      <view class="footer-box">
        <view class="location-name">{{ mapInfo.name }}</view>
        <view class="location-address">{{ mapInfo.address }}</view>
      </view>
    </view>
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
  computed: {
    markers() {
      return [
        {
          id: 1,
          longitude: this.mapInfo.longitude,
          latitude: this.mapInfo.latitude,
          width: 20,
          height: 20,
          iconPath: '/static/main/annotation.png'
        }
      ]
    }
  },
  onLoad(options) {
    this.mapInfo = options;
    Object.assign(this.mapInfo, this.convert2TecentMap(this.mapInfo))
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
    convert2TecentMap({longitude, latitude}){
    	if (longitude == '' && latitude == '') {
    		return {
    			longitude: '',
    			latitude: ''
    		}
    	}
    	var x_pi = 3.14159265358979324 * 3000.0 / 180.0
    	var x = longitude - 0.0065
    	var y = latitude - 0.006
    	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    	var qqLongitude = z * Math.cos(theta)
    	var qqLatitude = z * Math.sin(theta)
      return {
        longitude: qqLongitude,
        latitude: qqLatitude
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map-bg {
  position: fixed;
  width: 100%;
  height: 100%;
}
.bottom-fixed {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 170rpx;
  position: fixed;
  bottom: 0;
  .footer-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 30rpx;
    background: #fff;
    color: #222;
    box-shadow: 0 0 18rpx 0 rgba(0, 0, 0, 0.25);
    border-radius: 20rpx 20rpx 0 0;
  }
  .location-name {
    font-size: 32rpx;
    font-weight: bold;
    line-height: 1;
    color: #000;
  }
  .location-address {
    padding-top: 25rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    color: #8f8f94;
    @include text-multiple-ellipsis;
  }
}
</style>
