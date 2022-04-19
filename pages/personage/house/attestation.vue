<template>
  <view class="house-attestation">
    <uni-nav-bar
      :title="title"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="goBack"
    />
    <view class="tf-p-30-20 tf-flex-column">
      <view class="tf-mb-30">
        <uni-list class="tf-uni-list" :border="false">
          <uni-list-item
            title="房屋"
            :rightText="houseName"
            :showArrow="isAppend || editMode"
            clickable="true"
            @click="goCheckHouse"
          ></uni-list-item>
        </uni-list>
      </view>
      <view v-if="isAppend || editMode" class="tf-mb-30">
        <uni-card title="认证类型">
          <tf-radio-btn v-model="house_role" :data="items"></tf-radio-btn>
        </uni-card>
      </view>
      <view class="tf-mb-30">
        <uni-list class="tf-uni-list" :border="false">
          <uni-list-item
            v-if="isUpdate && !editMode"
            title="认证类型"
            direction="row"
            :border="false"
            :showArrow="false"
          >
            <template v-slot:footer>
              <view class="tf-text">{{ house_role | houseRoleText }}</view>
            </template>
          </uni-list-item>
          <uni-list-item
            title="真实姓名"
            direction="row"
            :border="false"
            :showArrow="false"
          >
            <template v-slot:footer>
              <view v-if="isUpdate && !editMode" class="tf-text">
                {{ realname }}
              </view>
              <input v-else class="tf-input" v-model="realname" />
            </template>
          </uni-list-item>
          <uni-list-item
            title="手机号"
            direction="row"
            :border="false"
            :showArrow="false"
          >
            <template v-slot:footer>
              <input
                v-if="isMember && ((isUpdate && editMode) || isAppend)"
                v-model="mobile"
                type="number"
                class="tf-input"
                maxlength="11"
              />
              <view v-else class="tf-text">{{ mobile }}</view>
            </template>
          </uni-list-item>
          <uni-list-item
            v-if="isProprietor && isUpdate && !editMode"
            class="default-house-item"
            title="设为当前房屋"
            direction="row"
            :border="false"
            :showArrow="false"
          >
            <template v-slot:footer>
              <switch
                color="#EB5841"
                :checked="checked"
                :disabled="checked"
                style="transform:scale(0.7)"
                @change="bindingDefault"
              />
            </template>
          </uni-list-item>
        </uni-list>
      </view>
      <view class="page-footer-placeholder">
        <view class="page-footer">
          <!-- 新增或者编辑模式 -->
          <template v-if="isAppend || editMode">
            <view v-if="isMember" class="tf-flex-center tf-mb-30">
              <checkbox-group @change="checkboxChange">
                <label class="agreement-checkbox">
                  <checkbox
                    color="#eb5841"
                    :value="1"
                    :checked="agreeValue"
                  ></checkbox>
                  <text>阅读并同意</text>
                </label>
              </checkbox-group>
              <navigator
                class="tf-text-link"
                hover-class="none"
                url="/pages/index/agreement?articleType=2"
              >
                《{{ otherAgreement.title }}》
              </navigator>
            </view>
            <button
              class="tf-w-full tf-btn-primary"
              :loading="submitLoad"
              @click="submit"
            >
              提交
            </button>
          </template>
          <view v-else class="tf-flex-row tf-w-full tf-mt-30">
            <button
              class="tf-flex-1 tf-text-primary tf-mr-20"
              @click="onDelete"
            >
              删除
            </button>
            <button
              v-if="showEditBtn"
              class="tf-flex-1 tf-btn-primary"
              @click="goEdit"
            >
              编辑
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import tfRadioBtn from '@/components/TfRadioBtn/index';
import {
  addMember,
  updateMember,
  roomAttest,
  bindingRoomInfo,
  bindingDefault,
  unBinding,
  deleteMember
} from '@/api/personage';
import { getAgreementContent } from '@/api/user';
import { validForm, throttle } from '@/utils/util';

export default {
  name: 'houseAttestation',
  components: {
    tfRadioBtn
  },
  data() {
    return {
      title: '',
      otherAgreement: {},
      type: 0, // 0：成员 1：房屋
      mode: 0, // 0：新增 1：修改
      select: undefined, // 是否认证完自动选中当前房屋
      editMode: false,
      checked: false,
      agreeValue: false,
      id: '',
      bindingId: '', // 绑定id
      house_id: '',
      project_id: '',
      building_id: '',
      unit_id: '',
      house_name: '',
      project_name: '',
      house_role: '',
      realname: '',
      mobile: '',
      isBinding: 0, // 该成员是否绑定
      items: [
        {
          value: '1',
          name: '业主'
        },
        {
          value: '2',
          name: '业主成员'
        },
        {
          value: '3',
          name: '租户'
        },
        {
          value: '4',
          name: '租户成员'
        }
      ],
      submitLoad: false,
      submit: throttle(this.handleSubmit)
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'currentProject']),
    houseName() {
      const value = this.house_name;
      if (this.isUpdate && !this.editMode) {
        return value;
      }
      console.log('house_name', value);
      return value || '请选择';
    },
    showEditBtn() {
      return (
        this.mode &&
        !this.editMode &&
        !(this.isBinding && this.isMember && this.isUpdate)
      );
    },
    isMember() {
      return this.type === 0;
    },
    isProprietor() {
      return this.type === 1;
    },
    isAppend() {
      return this.mode === 0;
    },
    isUpdate() {
      return this.mode === 1;
    }
  },
  onLoad(options) {
    const { type, mode, select } = options;
    this.type = parseInt(type);
    this.mode = parseInt(mode);
    this.select = parseInt(select);
    if (this.isMember && this.isUpdate) {
      const {
        realname,
        mobile,
        house_role,
        fc_info,
        project_id,
        project_name,
        house_id,
        id,
        is_binding
      } = JSON.parse(options.info);
      this.id = id;
      this.realname = realname;
      this.mobile = mobile;
      this.house_role = house_role;
      this.house_name = project_name + fc_info;
      console.log('onLoad:', this.house_name);
      this.isBinding = is_binding;
      this.project_id = project_id || '';
      this.house_id = house_id || '';
    } else if (this.isProprietor) {
      if (this.isUpdate) {
        this.bindingId = options.id;
        this.bindingRoomInfo();
      } else {
        this.mobile = this.userInfo.mobile;
      }
    }
    // 成员模式
    if (this.isMember) {
      // 成员不需要业主选项
      this.items.shift();
      // 新增成员模式房屋默认值为业主当前房产
      if (this.isAppend) {
        const {
          project_id,
          house_id,
          project_name,
          fc_info
        } = this.currentProject;
        this.project_id = project_id;
        this.house_id = house_id;
        this.house_name = project_name + fc_info;
      }
    }
    this.title = this.isProprietor
      ? '房屋认证'
      : this.isUpdate
      ? '成员'
      : '添加成员';
    this.getAgreement();
  },
  onShow() {
    const { tempData } = this.$store.state;
    console.log(tempData);
    if (tempData) {
      const {
        house_name,
        house_id,
        project_id,
        building_id,
        unit_id
        // project_name
      } = tempData;
      this.house_name = house_name;
      this.house_id = house_id;
      this.project_id = project_id;
      this.building_id = building_id;
      this.unit_id = unit_id;
      this.$store.commit('setTempData', null);
    }
  },
  methods: {
    getAgreement() {
      getAgreementContent({
        article_type: 2
      }).then(({ data }) => {
        this.otherAgreement = data;
      });
    },
    checkboxChange(e) {
      const values = e.detail.value;
      this.agreeValue = values && values.length ? true : false;
    },
    // 提交验证
    handleSubmit() {
      if (!+this.agreeValue && this.isMember) {
        uni.showToast({
          title: '请先阅读并同意会员协议',
          icon: 'none'
        });
        return;
      }
      const validator = [
        {
          value: this.house_id,
          message: '请选择房屋'
        },
        {
          value: this.house_role,
          message: '请选择成员类型'
        },
        {
          value: this.realname,
          message: '请填写姓名'
        },
        {
          value: this.mobile,
          message: '请填写手机号'
        }
      ];
      validForm(validator).then(res => {
        this.submitType();
      });
    },
    // 提交判断
    submitType() {
      if (this.isProprietor) {
        this.roomAttest();
      } else {
        this.isUpdate ? this.updateMember() : this.addMember();
      }
    },
    // 新增成员
    addMember() {
      addMember({
        project_id: this.project_id,
        house_id: this.house_id,
        realname: this.realname,
        mobile: this.mobile,
        house_role: this.house_role
      }).then(res => {
        if (res.success) {
          uni.showModal({
            content: '添加成功',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                this.$router.go(-1);
              }
            }
          });
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'error'
          });
        }
      });
    },
    // 更新成员
    updateMember() {
      updateMember({
        id: this.id,
        project_id: this.project_id,
        house_id: this.house_id,
        realname: this.realname,
        mobile: this.mobile,
        house_role: this.house_role
      }).then(res => {
        if (res.success) {
          uni.showToast({
            title: '修改成功',
            icon: 'success'
          });
          this.$router.go(-1);
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'error'
          });
        }
      });
    },
    // 删除
    onDelete() {
      uni.showModal({
        title: '是否确定删除',
        confirmText: '删除',
        success: res => {
          if (res.confirm) {
            this.isProprietor ? this.unBinding() : this.deleteMember();
          }
        }
      });
    },
    // 房屋认证
    roomAttest() {
      this.submitLoad = true;
      const params = {
        house_id: this.house_id,
        project_id: this.project_id,
        building_id: this.building_id,
        unit_id: this.unit_id,
        house_name: this.house_name,
        realname: this.realname,
        mobile: this.mobile,
        house_role: this.house_role,
        is_default: this.checked ? 1 : 0
      };
      roomAttest(params)
        .then(res => {
          this.submitLoad = false;
          if (res.success) {
            uni.showToast({
              title: '审核成功',
              icon: 'success'
            });
            if (this.userInfo.user_type == 0) {
              this.$store.dispatch('getMyAccount');
            }
            if (this.select == '1') {
              this.$store.dispatch('getHouse');
            }
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
            this.mtjEvent({
              eventId: 24
            });
          } else {
            uni.showToast({
              title: '提交失败',
              icon: 'error'
            });
          }
        })
        .catch(() => {
          this.submitLoad = false;
        });
    },
    // 获取认证房间详情
    bindingRoomInfo() {
      bindingRoomInfo({
        bindingId: this.bindingId
      }).then(res => {
        const {
          realname,
          mobile,
          house_role,
          house_name,
          project_name,
          building_name,
          unit_name,
          house_id,
          project_id,
          building_id,
          unit_id,
          is_default
        } = res.data;
        this.house_id = house_id;
        this.project_id = project_id;
        this.unit_id = unit_id;
        this.building_id = building_id;
        this.realname = realname;
        this.mobile = mobile;
        this.house_role = house_role;
        this.house_name = project_name + building_name + unit_name + house_name;
        this.checked = is_default === '1';
      });
    },
    // 设置当前房间
    bindingDefault(e) {
      const { value } = e.detail;
      if (value) {
        bindingDefault({
          binding_id: this.bindingId
        }).then(res => {
          uni.showToast({
            title: '当前房间设置成功!',
            icon: 'none'
          });
          this.$store.dispatch('getHouse');
        });
      }
    },
    // 解除绑定房间
    unBinding() {
      unBinding({
        binding_id: this.bindingId
      }).then(res => {
        uni.showModal({
          content: '解绑成功！',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.$store.dispatch('getHouse');
              this.$router.go(-1);
            }
          }
        });
      });
    },
    // 删除报备成员
    deleteMember() {
      deleteMember({
        id: this.id
      }).then(res => {
        uni.showModal({
          content: '成员删除成功',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.$router.go(-1);
            }
          }
        });
      });
    },
    // 选择房屋跳转
    goCheckHouse() {
      if (this.isUpdate && !this.editMode) {
        return;
      }
      if (this.isMember) {
        this.$router.push({
          path: '/pages/personage/house/selectHouse',
          query: {
            mode: 2,
            id: this.house_id
          }
        });
      } else {
        this.$router.push('/pages/personage/house/selectCommunity');
      }
    },
    // 查看转编辑
    goEdit() {
      this.agreeValue = '1';
      this.editMode = true;
    },
    goAgreement() {
      this.$router.push('/pages/index/agreement?articleType=2');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-card {
  margin-top: 30rpx;
}

.tf-card-header {
  font-size: 28rpx !important;
  font-weight: bold;
}

.tf-input {
  text-align: right;
  font-size: 28rpx !important;
  padding: 0;
}

.tf-text-primary {
  border: none;
  background-color: #fff;
}

.page-footer-placeholder {
  height: 70rpx;
  margin-bottom: env(safe-area-inset-bottom);
  margin-bottom: constant(safe-area-inset-bottom);

  .page-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 710rpx;
    position: fixed;
    bottom: calc(30rpx + env(safe-area-inset-bottom));
    bottom: calc(30rpx + constant(safe-area-inset-bottom));

    .agreement-checkbox {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #8f8f94;

      ::v-deep .van-checkbox__icon--checked .van-icon {
        color: $red-dark;
        background: none;
        border-color: $red-dark;
      }

      ::v-deep .van-checkbox__icon {
        height: 28rpx;
        line-height: 28rpx;

        .van-icon {
          width: 28rpx;
          height: 28rpx;
          line-height: 28rpx;
        }
      }
    }
  }
}

.house-text {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
}

.default-house-item ::v-deep .tf-clist-cell-left {
  width: auto !important;
}

::v-deep .uni-card {
  margin: 30rpx 0 !important;
  .uni-card__content {
    padding: 20rpx 0 !important;
  }
}

::v-deep .uni-list-item__content {
  justify-content: center;
}
</style>
