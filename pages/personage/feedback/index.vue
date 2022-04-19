<template>
  <view class="feedback-form">
    <uni-nav-bar
      title="意见反馈"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    >
      <template #right></template>
    </uni-nav-bar>
    <view class="link-box" @click="goList">
      历史反馈
      <text class="tf-icon tf-icon-right"></text>
    </view>
    <uni-card title="选择反馈类型">
      <tf-radio-btn v-model="infoType" :data="items"></tf-radio-btn>
    </uni-card>
    <uni-card title="内容描述">
      <textarea
        v-model="content"
        class="uni-input"
        :maxlength="300"
        placeholder="请描述具体内容"
        auto-height
        placeholder-style="color: #8F8F94;"
      />
      <view class="tf-text-sm tf-text-gray-7 tf-text-align-right">
        {{content.length || 0}} / 300
      </view>
    </uni-card>
    <uni-card title="图片上传">
      <tf-uploader v-model="images" max-count="6"></tf-uploader>
    </uni-card>
    <view class="fixed-placeholder">
      <button class="fixed-btn tf-btn-primary" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import TfRadioBtn from '@/components/TfRadioBtn/index'
import TfUploader from '@/components/TfUploader/index'
import { addFeedback } from '@/api/personage.js'
import { validForm, throttle } from '@/utils/util'
export default {
  components: {
    TfRadioBtn,
    TfUploader,
  },
  data() {
    return {
      items: [
        {
          value: 1,
          name: '功能异常',
        },
        {
          value: 2,
          name: '功能改进',
        },
        {
          value: 3,
          name: '产品建议',
        },
        {
          value: 4,
          name: '其他',
        },
      ],
      infoType: '',
      content: '',
      images: [],
      submit: throttle(this.handleSubmit),
    }
  },
  methods: {
    // 表单验证
    handleSubmit() {
      const validator = [
        {
          value: this.infoType,
          message: '请选择类型',
        },
        {
          value: this.content,
          message: '请输入反馈内容',
        },
      ]
      validForm(validator).then((res) => {
        this.submitFeedback()
      })
    },
    async submitFeedback() {
      const { success } = await addFeedback({
        content: this.content,
        images: this.images.join(','),
        info_type: this.infoType,
      })
      if (success) {
        uni.showModal({
          content: '感谢您的反馈',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.$router.go(-1)
            }
          },
        })
      } else {
        uni.showToast({
          title: '提交失败',
          icon: 'error',
        })
      }
    },
    goList() {
      this.$router.push('/pages/personage/feedback/list')
    },
  },
}
</script>

<style lang="scss" scoped>
.link-box {
  padding: 30rpx 20rpx 0;
  text-align: right;
  color: #999;
}

.uni-input {
  width: 100%;
  min-height: 80rpx;
  padding: 0;
  font-size: 28rpx;
  line-height: 32rpx;
}

.fixed-placeholder {
  height: calc(118rpx + env(safe-area-inset-bottom));
  height: calc(118rpx + constant(safe-area-inset-bottom));
}

.fixed-btn {
  width: 710rpx;
  position: fixed;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
  left: 20rpx;
  right: 20rpx;
}

::v-deep .uni-card__header-content-title {
  font-weight: 600;
}

::v-deep .van-uploader__upload,
::v-deep .van-uploader__preview {
  width: 114rpx;
  height: 114rpx;
}

.feedback-form ::v-deep .radio-btn__item {
  margin-bottom: 0;
}
</style>
