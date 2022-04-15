<template>
  <view class="tf-bg">
    <uni-nav-bar
      title="协议及声明"
      :fixed="true"
      :border="false"
      left-icon="left"
      statusBar="true"
      @click-left="$router.go(-1)"
    />
    <view class="tf-p-30-20">
      <uni-list :border="false">
        <uni-list-item
          v-for="(item, index) in agreementList"
          :key="index"
          :title="item.title"
          showArrow="true"
          @click="goAgreement(item.article_type)"
        />
      </uni-list>
    </view>
  </view>
</template>

<script>
import { getAllAgreement } from '@/api/user'
export default {
  data () {
    return {
      agreementList: []
    }
  },
  onLoad () {
    this.getAllAgreement()
  },
  methods: {
    getAllAgreement () {
      getAllAgreement().then(({ data }) => {
        this.agreementList = data
      })
    },
    goAgreement (articleType) {
      this.$router.push({
        path: '/pages/index/agreement',
        query: {
          articleType
        }
      })
    }
  }
}
</script>
