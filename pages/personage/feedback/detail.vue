<template>
  <view>
    <uni-nav-bar
      title="我的反馈"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <uni-card :title="info_type" :extra="ctime" :is-shadow="false">
      {{ content }}
      <template #actions>
        <tf-image-list
          v-if="images.length"
          mode="show"
          class="tf-mt-20"
          :data="images"
        ></tf-image-list>
      </template>
    </uni-card>
    <uni-card v-if="reply" title="回复" :is-shadow="false">
      {{ reply }}
    </uni-card>
  </view>
</template>

<script>
import tfImageList from '@/components/TfImageList';
import { getFeedbackInfo } from '@/api/personage.js';
export default {
  components: {
    tfImageList
  },
  data() {
    return {
      id: '',
      content: '',
      info_type: '',
      ctime: '',
      reply: '',
      images: []
    };
  },
  onLoad({ id }) {
    this.id = id;
    this.getFeedbackInfo();
  },
  methods: {
    getFeedbackInfo() {
      getFeedbackInfo({
        id: this.id
      }).then(res => {
        if (res.success) {
          const { content, info_type, ctime, reply, images } = res.data;
          this.content = content;
          this.info_type = info_type;
          this.ctime = ctime;
          this.reply = reply;
          this.images = images || [];
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
