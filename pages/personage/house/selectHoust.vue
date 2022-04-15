<template>
  <view class="tf-bg tf-body">
    <uni-nav-bar
      title="选择房产"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <view class="tf-p-30-20">
      <house-list
        :mode="mode"
        :addStatus="!mode"
        :entranceStatus="entranceStatus"
        :selectId="id"
        @change="selectHouse"
      ></house-list>
    </view>
  </view>
</template>

<script>
import HouseList from './components/HouseList.vue'
export default {
  components: {
    HouseList
  },
  data () {
    return {
      entranceStatus: false,
      mode: 0,
      id: 0
    }
  },
  onLoad (options) {
    const {status, mode, id} = options
    if (status === '1') {
      this.entranceStatus = true
    }
    if (mode == '2') {
      this.mode = 2
    }
    this.id = id || ''
  },
  methods: {
    selectHouse (id, item) {
      if (this.mode === 2) {
        const obj = {
          project_id: item.project_id,
          project_name: item.project_name,
          building_id: '',
          unit_id: '',
          house_id: item.house_id,
          house_name: item.fc_info
        }
        this.$store.commit('setTempData', obj)
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
