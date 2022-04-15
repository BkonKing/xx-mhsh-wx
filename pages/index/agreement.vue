<template>
  <view>
    <uni-nav-bar
      :statusBar="true"
      left-icon="left"
      :title="title"
      :fixed="true"
      :border="false"
      @click-left="goBack"
    />
    <view class="tf-p-30-20">
      <rich-text class="tf-text" :nodes="content"></rich-text>
    </view>
  </view>
</template>

<script>
import { getAgreementContent } from '@/api/user';

export default {
  data() {
    return {
      title: '',
      content: ''
    };
  },
  onLoad(options) {
    const { articleType } = options;
    this.getAgreementContent(articleType);
  },
  onUnload() {
    this.content = '';
  },
  methods: {
    // articleType：1、用户协议 2、其他协议 3、内容协议 4、支付协议 5、交易规则 6、隐私政策
    async getAgreementContent(articleType) {
      const { data } = await getAgreementContent({
        article_type: articleType
      });
      const { title, content } = data;
      this.title = title;
      this.content = content;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
