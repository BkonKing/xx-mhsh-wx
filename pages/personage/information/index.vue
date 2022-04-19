<template>
  <view class="information-page">
    <uni-nav-bar
      title="我的资料"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="goBack"
    />
    <van-tabs :active="current" @change="onTabChange">
      <van-tab title="基础信息">
        <view class="info-container">
          <uni-list class="tf-uni-list" :border="false">
            <uni-list-item
              showArrow="true"
              to="/pages/personage/information/personInfo"
            >
              <template #header>
                <view class="title">
                  <view class="left">
                    <image
                      v-if="userInfo.avatar"
                      class="tf-avatar-image"
                      :src="userInfo.avatar"
                    />
                    <image
                      v-else
                      class="tf-avatar-image"
                      src="@/static/main/touxiang.png"
                    />
                  </view>
                  <view class="right">
                    <view class="l-left">
                      <view class="t1">{{ phone }}</view>
                      <view class="t2">
                        <text
                          v-if="userInfo.gender == 2"
                          class="tf-icon tf-icon-xingbie nv"
                        ></text>
                        <text
                          v-if="userInfo.gender == 1"
                          class="tf-icon tf-icon-xingbie1 nan"
                        ></text>
                        {{ userInfo.birthday || '' }}
                      </view>
                    </view>
                    <view class="r-left">
                      <view class="name">
                        {{ userInfo.realname }}
                        <text
                          v-if="userInfo.idcard"
                          class="tf-icon tf-icon-yishiming n1"
                        ></text>
                      </view>
                    </view>
                  </view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </view>
        <!-- <view class="tf-mt-30">
          <uni-list class="tf-uni-list" :border="false">
            <uni-list-item
              title="手机号"
              showArrow="true"
              :rightText="userInfo.mobile"
              to="/pages/personage/information/phone"
            ></uni-list-item>
          </uni-list>
        </view> -->
        <view class="tf-mt-30">
          <uni-list class="tf-uni-list" :border="false">
            <uni-list-item
              showArrow="true"
              :title="`${userInfo.is_setpaypassword ? '修改' : '设置'}支付密码`"
              :to="paymentCodePath"
            ></uni-list-item>
            <!-- <uni-list-item
              clickable="true"
              showArrow="true"
              :title="`${userInfo.is_setpassword ? '修改' : '设置'}登录密码`"
              @click="editLoginPassword"
            ></uni-list-item> -->
          </uni-list>
        </view>
      </van-tab>
      <van-tab v-if="userType != 0 && currentProject" title="房产信息">
        <house-list
          ref="houseList"
          @manClick="toHouseMember"
          @change="bindingId => goAttestation(1, 1, bindingId)"
        ></house-list>
      </van-tab>
      <van-tab
        v-if="userType == 1 && currentProject"
        title="成员信息"
        class="mermber-info"
      >
        <van-dropdown-menu>
          <van-dropdown-item
            ref="dropdown"
            :value="selectedHouseId"
            :options="houselist"
            @change="handleChangeHoust"
            @close="handleClose"
          />
        </van-dropdown-menu>
        <view
          v-for="(item, i) in memberList"
          :key="i"
          class="uni-card-container"
          @click="
            goAttestation(item.house_role === '1' ? 1 : 0, 1, item.id, item)
          "
        >
          <uni-card :title="`${item.project_name} ${item.fc_info}`">
            <view class="tf-flex-row">
              <van-tag
                class="user-role tf-mr-30"
                plain
                :type="houseRoleColor[item.house_role]"
                :inverted="true"
                size="small"
              >
                {{ item.house_role | houseRoleText }}
              </van-tag>
              <view class="tf-mr-30">
                {{ item.realname }}
                <text
                  v-if="item.house_role === '1'"
                  class="tf-text-gray-7 tf-text-sm"
                >
                  (本人)
                </text>
              </view>
              <view class="tf-mr-30">{{ item.gender | sexText }}</view>
              <view>{{ item.mobile }}</view>
            </view>
          </uni-card>
        </view>
        <view class="btn-placeholder">
          <button class="tf-btn tf-btn-primary" @click="addMember">
            新增成员
          </button>
        </view>
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import HouseList from '@/pages/personage/house/components/HouseList';
import { uImages } from '@/api/user';
import { getMemberList, yzHouse } from '@/api/personage';
export default {
  name: 'informationIndex',
  components: {
    HouseList
  },
  data() {
    return {
      showTab: false,
      current: 0,
      selectedHouseId: 0,
      houselist: [], // 成员tab，房屋列表
      faceDialog: false,
      memberList: [], // 成员列表
      houseRoleColor: {
        1: 'danger',
        2: 'warning',
        3: 'primary',
        4: 'primary'
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'userType', 'currentProject']),
    paymentCodePath() {
      const status = this.userInfo.is_setpaypassword;
      return `/pages/personage/information/paymentCode?status=${status}`;
    },
    phone() {
      const value = this.userInfo.mobile || '';
      return `${value.substr(0, 3)}****${value.substr(7)}`;
    }
  },
  onLoad() {
    this.userType == 1 && this.yzHouse(0);
  },
  onShow() {
    if (this.current === 0) {
      this.getMyAccount();
    } else if (this.current === 1) {
      this.$refs.houseList.reload();
    } else if (this.current === 2) {
      this.yzHouse(1);
      this.getMemberList();
      this.$refs.houseList && this.$refs.houseList.reload();
    }
  },
  onReady() {
    this.showTab = true;
  },
  methods: {
    onTabChange(event) {
      this.current = event.detail.name;
    },
    // 获取用户信息
    async getMyAccount() {
      this.$store.dispatch('getMyAccount');
    },
    // 获取业主房产信息
    yzHouse(type) {
      // type: 0 - 默认选中第一个， 1 - 保持当前状态
      yzHouse().then(res => {
        let data = res.data || [];
        let num = 0;
        data = data.map(obj => {
          const { project_name, fc_info, members, house_id, project_id } = obj;
          num += parseInt(members);
          return {
            text: `${project_name}${fc_info}(${members})`,
            value: house_id,
            project_id
          };
        });
        data.unshift({
          text: `全部(${num})`,
          value: ''
        });
        this.houselist = data;
        if (!type) {
          this.selectedHouseId = '';
        }
      });
    },
    handleChangeHoust({ detail }) {
      this.selectedHouseId = detail;
      this.getMemberList();
    },
    handleClose() {
      this.$refs.dropdown.toggle(false);
    },
    // 获取成员列表
    getMemberList() {
      const house =
        this.houselist &&
        this.houselist.find(obj => obj.value === this.selectedHouseId);
      getMemberList({
        house_id: this.selectedHouseId,
        project_id: house && house.project_id
      }).then(res => {
        this.memberList = res.data;
      });
    },
    // 添加成员
    addMember() {
      if (this.memberList.length >= 10) {
        uni.showModal({
          content: '一个房产最多只能绑定10个人（包括业主），超过只能解除后再添加',
          showCancel: false
        })
      } else {
        this.goAttestation(0, 0);
      }
    },
    /**
     * 房屋认证（成员添加修改）
     * @param {number} type 页面类型  0：成员 1：房屋
     * @param {number} mode 模式类型  0：新增 1：修改
     * @param {string} id 当前选中房屋或成员id
     * @param {object} info 当前选中房屋或成员所有信息
     */
    goAttestation(type, mode, id, info) {
      this.$router.push({
        path: '/pages/personage/house/attestation',
        query: {
          type,
          mode,
          id,
          info: JSON.stringify(info)
        }
      });
    },
    // 跳转支付密码设置修改
    editPaymentCode() {
      this.$router.push({
        path: '/pages/personage/information/paymentCode',
        query: {
          status: this.userInfo.is_setpaypassword
        }
      });
    },
    // 跳转登录密码设置修改
    editLoginPassword() {
      this.$router.push({
        path: '/pages/personage/information/loginPassword',
        query: {
          status: this.userInfo.is_setpassword
        }
      });
    },
    // 跳转房产成员信息
    toHouseMember(info) {
      this.selectedHouseId = info.house_id;
      this.current = 2;
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  watch: {
    selectedHouseId(value) {
      this.getMemberList();
    },
    current(val) {
      if (val === 2) {
        !this.houselist.length && this.yzHouse();
      }
    }
  },
  filters: {
    sexText(value) {
      const text = {
        0: '-',
        1: '男',
        2: '女'
      };
      return text[value];
    }
  }
};
</script>

<style lang="scss" scoped>
.info-container {
  .title {
    display: flex;
    align-items: center;

    .left {
      margin-right: 36rpx;
    }

    .right {
      display: flex;

      .l-left {
        margin-right: 20rpx;

        .t1 {
          font-size: 30rpx;
          font-weight: 600;
        }

        .t2 {
          font-size: 26rpx;
          color: #8f8f94;

          .nv {
            font-size: 26rpx;
            color: #e45487;
          }

          .nan {
            font-size: 26rpx;
            color: #448fe4;
          }
        }
      }

      .r-left {
        .name {
          color: #666666;
          display: flex;
          align-items: center;

          .n1 {
            margin-left: 10rpx;
            vertical-align: middle;
            font-size: 33rpx;
            color: #f77e64;
            margin-top: -2rpx;
          }

          .n2 {
            margin-left: 10rpx;
            vertical-align: middle;
            font-size: 33rpx;
            color: gray;
          }
        }
      }
    }
  }
}

.btn-placeholder {
  height: 70rpx;
  margin-top: 30rpx;
  margin-bottom: env(safe-area-inset-bottom);
  margin-bottom: constant(safe-area-inset-bottom);
}

.tf-btn {
  width: 710rpx;
  position: fixed;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
}

.uni-card-container {
  margin-top: 30rpx;
  ::v-deep .uni-card {
    margin: 0 !important;
  }
}
.information-page ::v-deep .van-tabs__wrap {
  width: 100%;
  position: fixed;
}

::v-deep .van-tabs__content .van-tab__pane {
  padding: 30rpx 20rpx;
  margin-top: var(--tabs-line-height, 44px);
}

::v-deep .van-dropdown-menu {
  height: 66rpx;
  border-radius: 33rpx;
}

::v-deep .van-dropdown-menu__item {
  padding-right: 20rpx;
}

::v-deep .van-dropdown-menu__title:after {
  margin-top: -10rpx;
  border-width: 8rpx;
  border-color: transparent transparent #aaa #aaa;
}

::v-deep .van-dropdown-item__option {
  height: 88rpx;
}

::v-deep .uni-list--clickable:active {
  background: $gray-3;
}

::v-deep .van-cell__value {
  flex: initial;
  width: 30rpx;
}

.mermber-info {
  padding-bottom: 108rpx !important;
}

.tf-avatar-image {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  vertical-align: middle;
}
</style>
