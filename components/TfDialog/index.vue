<template>
  <uni-popup
    ref="tf-dialog"
    :class="['tf-van-popup', popupClass]"
    is-mask-click="isMaskClick"
    @click-overlay="close"
  >
    <view class="tf-dialog__wrapper-box">
      <text
        v-if="closeIconType === 'outer'"
        class="tf-icon tf-icon-guanbi1"
        @click="handleClose"
      ></text>
      <view class="tf-dialog">
        <view
          v-if="title"
          class="tf-dialog-header"
          :class="{ 'tf-dialog-header-border': headerBorder }"
        >
          <view class="tf-dialog-header__title">{{ title }}</view>
        </view>
        <view
          class="tf-dialog-content"
          :class="[{ 'tf-pt-0': !headerBorder }, contentClassName]"
        >
          <slot>{{ content }}</slot>
        </view>
        <view v-if="showFooter" class="tf-dialog-footer">
          <view class="tf-flex-row">
            <view
              v-if="showCancel"
              class="tf-dialog-footer__btn tf-dialog-footer__btn--grey"
              style="margin-right: 30rpx;"
              @click="cancel"
            >
              {{ cancelText }}
            </view>
            <view
              class="tf-dialog-footer__btn tf-dialog-footer__btn--orange"
              @click="confirm"
            >
              {{ confirmText }}
            </view>
          </view>
          <slot name="footer"></slot>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'center'
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    contentClassName: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    popupClass: {
      type: String,
      default: ''
    },
    isMaskClick: {
      type: Boolean,
      default: false
    },
    closeIconType: {
      type: String,
      default: 'outer' // hidden, inside
    },
    headerBorder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  mounted() {
    this.operate(this.visible);
  },
  methods: {
    cancel() {
      this.$emit('cancel');
      this.handleClose();
    },
    handleClose() {
      this.visible = false;
    },
    operate(val) {
      if (val) {
        this.open();
      } else {
        this.close();
      }
    },
    open() {
      this.$refs['tf-dialog'].open(this.type);
    },
    close() {
      this.$refs['tf-dialog'].close();
      this.$emit('closed');
    },
    confirm() {
      this.$emit('confirm');
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
      this.operate(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-van-popup {
  background: none;
}

.tf-dialog__wrapper-box {
  width: 560rpx;
}

.tf-icon {
  display: block;
  text-align: right;
  font-size: 50rpx;
  color: #fff;
  margin: 0 30rpx 30rpx 0;
}

.tf-dialog {
  width: 100%;
  padding: 0 30rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.tf-dialog-header {
  height: 90rpx;
}

.tf-dialog-header-border {
  border-bottom: 2rpx solid $divider-color;
}

.tf-dialog-header__title {
  line-height: 90rpx;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
  color: #000;
}

.tf-dialog-content {
  padding: 30rpx 0;
}
.tf-pt-0 {
  padding-top: 0;
}

.tf-dialog-footer {
  padding-bottom: 30rpx;
}

.tf-dialog-footer__btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
  text-align: center;
}

.tf-dialog-footer__btn--grey {
  border: 2rpx solid #aaa;
  color: $gray-7;
}

.tf-dialog-footer__btn--orange {
  border: 2rpx solid $red-dark;
  color: #fff;
  background-color: $red-dark;
}
</style>
