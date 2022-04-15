<template>
  <uni-file-picker
    v-model="fileList"
    file-mediatype="image"
    multiple
    :limit="maxCount"
    @select="afterRead"
    @delete="hanldeDelete"
  />
</template>

<script>
import { uImages } from '@/api/user';

export default {
  name: 'tf-uploader',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      fileList: [],
      images: this.value,
      uploadStatus: 0 // 图片的上传状态，0则为没有文件在上传中的状态
    };
  },
  computed: {
    delIconClass() {
      const className = {
        1: 'mh-upload',
        2: 'default-upload'
      };
      return className[this.delIconType];
    }
  },
  created() {
    if (this.value && this.value.length > 0) {
      this.fileList = this.value.map(obj => ({
        url: obj
      }));
    }
  },
  methods: {
    afterRead(file) {
      const filePaths = file.tempFilePaths;
      if (filePaths && filePaths.length) {
        filePaths.forEach((filePath, index) => {
          this.uploadImage(filePath, index);
        });
      }
    },
    uploadImage(filePath, index) {
      const baseUrl = 'https://develop.mhshjy.com';
      const that = this;
      wx.uploadFile({
        url: `${baseUrl}/app/api/v1/ulogin/login/upload_img`,
        filePath,
        name: 'img',
        formData: {
          num: index,
          uid: 1
        },
        header: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
          Authorization: uni.getStorageSync('access_token') //若有token，此处换上你的token，没有的话省略
        },
        success: ({ data }) => {
          data = data.replace(' ', '');
          if (typeof data !== 'object') {
            data = data.replace(/\ufeff/g, '');
            data = JSON.parse(data);
          }
          this.images.push(baseUrl + data.data)
        }
      });
    },
    hanldeDelete(file) {
      const { tempFilePath } = file;
      console.log(this.fileList, tempFilePath);
      const index = this.fileList.findIndex(obj => {
        return obj.url === tempFilePath;
      });
      index > -1 && this.images.splice(index, 1);
    }
  },
  watch: {
    value(val) {
      this.images = val || [];
      if (!val) return;
      this.fileList = val.map(obj => ({
        url: obj
      }));
    },
    images(value) {
      this.$emit('input', value);
    }
  }
};
</script>
