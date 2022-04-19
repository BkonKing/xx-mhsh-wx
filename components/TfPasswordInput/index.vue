<template>
  <view class="tf-password-input">
    <password-input
      :value="inputValue"
      :info="info"
      :gutter="gutter"
      :errorInfo="errorInfo"
      :focused="showKeyboard"
      @focus="focusPasswordInput"
    />
    <input
      v-model="inputValue"
      type="number"
      :maxlength="length"
      :focus="showKeyboard"
      :style="{ width: 0 }"
      @blur="showKeyboard = false"
    />
  </view>
</template>

<script>
import PasswordInput from '../PasswordInput'
export default {
  components: {
    PasswordInput,
  },
  props: {
    info: String,
    gutter: {
      type: Number,
      default: 10
    },
    errorInfo: String,
    value: {
      type: String,
      default: '',
    },
    length: {
      type: [Number, String],
      default: 6,
    },
  },
  data() {
    return {
      inputValue: this.value,
      showKeyboard: false
    }
  },
  watch: {
    inputValue(newValue) {
      this.$emit('input', newValue)
    },
    value(newValue) {
      if (newValue !== this.inputValue) {
        this.value = newValue
      }
    },
  },
  methods: {
    focusPasswordInput() {
      !this.showKeyboard && (this.showKeyboard = true)
    },
    focus() {
      this.focusPasswordInput()
    }
  },
}
</script>

<style></style>
