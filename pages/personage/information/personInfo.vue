<template>
  <view class="personInfo">
    <uni-nav-bar
      title="个人信息"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="goBack"
    />
    <view class="tf-p-30-20">
      <view class="tf-uni-list">
        <uni-list-item
          title="头像"
          direction="row"
          clickable
          @click="chooseImage"
        >
          <template v-slot:footer>
            <image
              v-if="userInfo.avatar"
              :src="userInfo.avatar"
              class="avatar-image"
            />
            <image
              v-else
              src="@/static/main/touxiang.png"
              class="avatar-image"
            />
          </template>
        </uni-list-item>
        <uni-list-item title="昵称" direction="row">
          <template v-slot:footer>
            <input
              v-model="nickname"
              class="text-right"
              maxlength="15"
              @change="setNickname"
            />
          </template>
        </uni-list-item>
        <picker :value="gender" :range="genderArray" @change="changeGender">
          <uni-list-item title="性别" clickable showArrow direction="row">
            <template #footer>
              <view class="tf-row-items-center">
                <text
                  v-if="userInfo.gender == 1"
                  class="tf-icon tf-icon-xingbie1 nan"
                ></text>
                <text
                  v-else-if="userInfo.gender == 2"
                  class="tf-icon tf-icon-xingbie nv"
                ></text>
              </view>
            </template>
          </uni-list-item>
        </picker>
      </view>
      <view class="tf-uni-list tf-mt-30">
        <uni-list-item title="姓名" direction="row">
          <template v-slot:footer>
            <view class="tf-row-items-center">
              <input
                v-model="realname"
                class="text-right"
                :disabled="isRealNameAuth"
                @change="setRealname"
              />
              <text
                v-if="isRealNameAuth"
                class="tf-icon tf-icon-yishiming n1"
              ></text>
            </view>
          </template>
        </uni-list-item>
        <picker
          mode="date"
          :value="birthday"
          :start="minDate"
          :end="maxDate"
          :disabled="isRealNameAuth"
          @change="setBirthday"
        >
          <uni-list-item
            title="生日"
            :showArrow="!isRealNameAuth"
            :rightText="birthday || '选择日期'"
          ></uni-list-item>
        </picker>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  editGender,
  editBirthday,
  editAvatar,
  editNickname,
  editRealname
} from '@/api/personage.js';
import { uImages } from '@/api/user';
import TfUploader from '@/components/TfUploader';
import { getDate, chooseImage } from '@/utils/util';
export default {
  components: {
    TfUploader
  },
  data() {
    return {
      genderArray: ['男', '女'],
      maxDate: new Date(getDate()),
      minDate: new Date('1900/1/1'),
      birthday: '',
      nickname: '',
      realname: ''
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    gender() {
      return +this.userInfo.gender - 1;
    },
    isRealNameAuth() {
      return +this.userInfo.idcard
    }
  },
  onLoad() {
    this.$store.dispatch('getMyAccount').then(() => {
      this.birthday = this.userInfo.birthday;
      this.nickname = this.userInfo.nickname;
      this.realname = this.userInfo.realname;
      if (this.userInfo.idcard) {
        this.birthday = this.getBirthdayFromIdCard(this.userInfo.idcard);
        this.editBirthday();
      }
    });
  },
  methods: {
    // 格式化身份证号
    getBirthdayFromIdCard(idCard) {
      var birthday = '';
      if (idCard) {
        if (idCard.length === 15) {
          birthday = '19' + idCard.substr(6, 6);
        } else if (idCard.length === 18) {
          birthday = idCard.substr(6, 8);
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
      }
      return birthday;
    },
    chooseImage() {
      chooseImage({
        count: 1
      }).then((data) => {
        this.editAvatar(data)
      })
    },
    // 头像上传
    async editAvatar(avatar) {
      if (!avatar) {
        return;
      }
      await editAvatar({
        avatar
      });
      uni.showToast({
        title: '头像上传成功',
        icon: 'success'
      });
      this.$store.dispatch('getMyAccount');
    },
    // 设置姓名
    async setRealname() {
      if (this.userInfo.realname === this.realname) {
        return;
      }
      await editRealname({
        realname: this.realname
      });
      if (!this.isRealNameAuth) {
        uni.showToast({
          title: '姓名设置成功',
          icon: 'success'
        });
        this.$store.dispatch('getMyAccount');
      }
    },
    // 设置昵称
    async setNickname() {
      if (this.userInfo.nickname === this.nickname) {
        return;
      }
      await editNickname({
        nickname: this.nickname
      });
      uni.showToast({
        title: '昵称设置成功',
        icon: 'success'
      });
      this.$store.dispatch('getMyAccount');
    },
    // 设置生日
    setBirthday({ detail }) {
      const value = detail.value;
      if (value === this.birthday) {
        return;
      }
      this.birthday = value;
      this.editBirthday()
    },
    async editBirthday() {
      await editBirthday({
        birthday: this.birthday
      });
      if (!this.isRealNameAuth) {
        uni.showToast({
          title: '生日设置成功',
          icon: 'success'
        });
        this.$store.dispatch('getMyAccount');
      }
    },
    // 设置性别
    async changeGender(e) {
      const index = +e.detail.value + 1;
      if (index === +this.userInfo.gender) {
        return;
      }
      await editGender({
        gender: index
      });
      uni.showToast({
        title: '性别设置成功',
        icon: 'success'
      });
      this.$store.dispatch('getMyAccount');
    },
    // 回退
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.personInfo {
  ::v-deep .van-uploader {
    display: block;
    width: 100%;
  }

  ::v-deep .van-uploader__input {
    width: 100% !important;
  }

  ::v-deep .van-uploader__wrapper {
    width: 100% !important;

    ::v-deep .van-uploader__input-wrapper {
      width: 100% !important;
    }
  }

  .tf-uni-list {
    .n1 {
      margin-left: 10rpx;
      vertical-align: middle;
      font-size: 33rpx;
      color: #f77e64;
    }
  }

  .text-right {
    text-align: right;
  }

  ::v-deep .van-uploader__input-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
  }
}
.nan {
  color: #448fe4;
  font-size: 26rpx;
}
.nv {
  color: #ff3366;
  font-size: 26rpx;
}
.avatar-image {
  width: 64rpx;
  height: 64rpx;
}
::v-deep .uni-list-item__content {
  justify-content: center;
}
</style>
