<template>
  <view class="task-box">
    <view class="task-item" v-for="(item, i) in taskListData" :key="i">
      <view class="tf-flex-row tf-flex-1">
        <image
          class="task-item__icon"
          mode="heightFix"
          v-if="item.task_type == 1"
          src="@/static/personage/credits_sign.png"
        />
        <image
          class="task-item__icon"
          mode="heightFix"
          v-else-if="item.task_type == 2"
          src="@/static/personage/credits_renzheng.png"
        />
        <image
          class="task-item__icon"
          mode="heightFix"
          v-else-if="item.task_type == 3"
          src="@/static/personage/credits_yunmenjin.png"
        />
        <image
          class="task-item__icon"
          mode="heightFix"
          v-else-if="item.task_type == 4"
          src="@/static/personage/credits_wenjuan.png"
        />
        <image
          class="task-item__icon"
          mode="heightFix"
          v-else-if="item.task_type == 5"
          src="@/static/personage/credits_toupiao.png"
        />
        <image
          class="task-item__icon"
          mode="heightFix"
          v-else-if="item.task_type == 7"
          src="@/static/personage/credits_goufang.png"
        />
        <view class="tf-space-between">
          <view class="task-item__title">{{ item.task_name }}</view>
          <!-- 朋友到访、购房奖励 -->
          <view v-if="item.task_type == 7">
            <view class="task-item__remarks">
              {{ item.task_type | taskText }}
            </view>
            <view v-if="yxlpNum" class="tf-flex-row task-item__remarks">
              获得
              <view class="task-item__remarks--gold"> {{ item.credits }}幸福币起 </view>
            </view>
          </view>
          <!-- 其他 -->
          <view class="tf-row-items-center" v-else>
            <!-- 签到 -->
            <template v-if="item.task_type === '1'">
              <view class="task-item__remarks">
                <!-- 游客 -->
                <template v-if="userType == 0"> 每日签到获得 </template>
                <!-- 有认证用户 -->
                <template v-else>
                  <text
                    class="tf-icon tf-icon-zhushishuoming"
                    @click="openSignRule"
                  ></text>
                  <!-- 签到幸福币已达上限，不可签到 -->
                  <template v-if="signinToday === 2">明天要早点来哦</template>
                  <template v-else>签到可获得</template>
                </template>
              </view>
              <view v-if="signinToday !== 2" class="task-item__remarks--gold">
                +{{ item.credits }}
              </view>
            </template>
            <!-- 其他 -->
            <template v-else>
              <view class="task-item__remarks"> {{ item.task_type | taskText }}获得 </view>
              <view class="task-item__remarks--gold"> +{{ item.credits }} </view>
            </template>
          </view>
        </view>
      </view>
      <view v-if="item.complete" class="task-item__number"> +{{ item.credits }} </view>
      <button
        v-else
        :loading="signLoading && item.task_type == 1"
        class="task-item__btn"
        :disabled="signinToday === 2 && item.task_type == 1"
        @click="complete(item)"
      >
        {{
          item.task_type == 7
            ? '去推荐'
            : signinToday === 2 && item.task_type == 1
            ? '签到'
            : '去完成'
        }}
      </button>
    </view>
    <sign-rule-v2-dialog v-model="signRuleVisible"></sign-rule-v2-dialog>
  </view>
</template>

<script>
import SignRuleV2Dialog from './SignRuleV2Dialog'
import { getYxlpList } from '@/api/personage'
import { throttle } from '@/utils/util';

export default {
  name: 'TaskList',
  components: {
    SignRuleV2Dialog
  },
  props: {
    showUnfinished: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    signinToday: {
      type: [Number, String],
      default: 1,
    },
    userType: {
      type: [Number, String],
      default: '',
    },
    entranceStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      signLoading: false,
      signRuleVisible: false,
      yxlpNum: 0, // 推荐购房楼盘列表
      complete: throttle(this.handleComplete)
    }
  },
  computed: {
    taskListData() {
      return this.showUnfinished
        ? this.data.filter((obj) => {
            return !+obj.complete
          })
        : this.data
    },
  },
  filters: {
    taskText(value) {
      let text = '参与'
      switch (parseInt(value)) {
        case 1:
          text = '每日签到'
          break
        case 2:
          text = '认证成功'
          break
        case 3:
          text = '首次开门'
          break
        case 7:
          text = '朋友到访、购房奖励'
          break
      }
      return text
    },
  },
  created() {
    this.getYxlpList()
  },
  methods: {
    // 获取推荐购房楼盘
    getYxlpList() {
      getYxlpList().then(({ data }) => {
        this.yxlpNum = (data && data.length) || 0
      })
    },
    openSignRule() {
      this.signRuleVisible = true
    },
    // 幸福币任务去完成跳转
    handleComplete({ task_type: type, source_id: id }) {
      switch (type) {
        case '1':
          this.$emit('signIn')
          break
        case '2':
          this.$router.push('/pages/personage/house/attestation?type=1&mode=0&select=1')
          break
        case '3':
          if (this.entranceStatus) {
            uni.showToast({
              title: '小区暂未开放此功能',
              icon: 'none'
            })
          } else {
            this.authentication('/pages/butler/entrance/index')
          }
          break
        case '7':
          this.$router.push('/pages/credit/recomBuyHouse')
          break
        default:
          this.authentication(`/pages/butler/questionnaire/details?id=${id}`)
          break
      }
    },
    // 认证提醒
    authentication(url) {
      if (+this.userType === 0) {
        uni.showModal({
          title: '提示',
          content: '您尚未认证房间，是否去认证？',
          confirmText: '去认证',
          success: function (res) {
            if (res.confirm) {
              this.$router.push({
                path: '/pages/personage/house/attestation?type=1&mode=0&select=1',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      } else {
        this.$router.push({
          path: url,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.task-box {
  padding: 0 30rpx;
  background: #ffffff;
  border-radius: 10rpx;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 148rpx;
}
.task-item + .task-item {
  border-top: 1rpx solid #eeeeee;
}
.task-item__icon {
  // width: 48rpx;
  height: 48rpx;
  margin-right: 30rpx;
}
.task-item__title {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 1;
  color: #000000;
}
.task-item__remarks {
  font-size: 24rpx;
  line-height: 1;
  color: #bbbbbb;
  + .task-item__remarks {
    margin-top: 10rpx;
  }
  .tf-icon-zhushishuoming {
    padding: 20rpx 10rpx 20rpx 0;
  }
}
.task-item__remarks--gold {
  margin-left: 22rpx;
  font-size: 26rpx;
  line-height: 1;
  color: #febf00;
}
.task-item__number {
  width: 150rpx;
  text-align: center;
  font-size: 38rpx;
  line-height: 90rpx;
  font-weight: 500;
  color: #febf00;
}
.task-item__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 164rpx;
  height: 64rpx;
  background: #febf00;
  border: none;
  border-radius: 32rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #fff;
}
</style>
