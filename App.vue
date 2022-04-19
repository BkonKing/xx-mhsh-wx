<script>
export default {
  onLaunch: function() {
    let userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      userInfo =
        userInfo && typeof userInfo === 'string'
          ? JSON.parse(userInfo)
          : userInfo;
      this.$store.commit('setUserInfo', userInfo);
      if (userInfo.user_type != 0) {
        // 获取当前项目
        this.$store.dispatch('getHouse');
      }
    }
  },
  onShow: function() {
    // console.log('App Show');
  },
  onHide: function() {
    // console.log('App Hide');
  }
};
</script>

<style lang="scss">
@import '@/static/iconfont/iconfont.css';
@import '@/styles/common.scss';
@import '@/styles/cover.scss';
</style>
