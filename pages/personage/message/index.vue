<template>
  <view class="message-page">
    <uni-nav-bar
      title="消息"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <van-tabs sticky :active="current" :ellipsis="false" @change="onTabChange">
      <van-tab
        v-if="userInfo.swrole == 1"
        name="1"
        title="工作"
        :info="badgeList[1]"
      ></van-tab>
      <van-tab name="2" title="交易" :info="badgeList[2]"></van-tab>
      <van-tab name="3" title="互动" :info="badgeList[3]"></van-tab>
      <van-tab name="4" title="物业" :info="badgeList[4]"></van-tab>
      <van-tab name="5" title="活动" :info="badgeList[5]"></van-tab>
      <van-tab
        v-if="isShowTask"
        name="7"
        title="任务"
        :info="badgeList[7]"
      ></van-tab>
      <van-tab name="6" title="系统" :info="badgeList[6]"></van-tab>
    </van-tabs>
    <view class="tf-p-20">
      <template v-for="(item, index) in listData">
        <interaction-item
          v-if="current == '3'"
          :key="item.id"
          type="interaction"
          :data="item"
          @click.native="handleOperate(index)"
        ></interaction-item>
        <message-item
          v-else
          :key="item.id"
          :type="messageType"
          :data="item"
          @click.native="handleOperate(index)"
        ></message-item>
      </template>
      <uni-load-more :status="loadMoreStatus" />
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import ListMixins from '@/mixins/list';
import MessageItem from './components/MessageItem.vue';
import InteractionItem from './components/InteractionItem.vue';
import {
  getMessageList,
  getCountMessage,
  messageRead
} from '@/api/personage.js';
export default {
  name: 'messageIndex',
  mixins: [ListMixins],
  components: {
    MessageItem,
    InteractionItem
  },
  data() {
    return {
      isShowTask: false,
      badgeList: [],
      current: 0
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    messageType() {
      const value = this.current || '1';
      const typeKeys = {
        1: 'work',
        2: 'transaction',
        3: 'interaction',
        4: 'butler',
        5: 'activity',
        6: 'system',
        7: 'task'
      };
      return typeKeys[value];
    }
  },
  onLoad() {
    this.current = this.userInfo.swrole == 1 ? '1' : '2';
    this.getListData(1, 7).then(({ data }) => {
      this.isShowTask = data && data.length;
    });
  },
  onShow() {
    this.getCountMessage();
  },
  methods: {
    onTabChange(event) {
      this.current = event.detail.name;
      this.refreshLoad();
    },
    getListData() {
      return getMessageList({
        remind_type: this.current,
        pages: this.pageNum
      });
    },
    // 获取统计未读消息
    getCountMessage() {
      getCountMessage().then(res => {
        this.badgeList = res.data;
      });
    },
    // 设置已读消息
    messageRead(data,index) {
      messageRead({
        id: data.id
      }).then(res => {
        this.$set(this.listData[index], 'is_read', '0')
        data.is_read = '1';
      });
    },
    handleOperate(index) {
      const data = this.listData[index]
      const isCredit = data.sub_type == 6 || data.sub_type == 7
      if (data.is_read == 0 && isCredit) {
        this.messageRead(data, index);
      }
      const methodNames = {
        1: 'onWork',
        2: 'toTransaction',
        3: 'toInteraction',
        4: 'toButler',
        5: 'onActivity',
        6: 'onSystem',
        7: 'handleTaskClick'
      };
      const methodName = methodNames[this.current];
      this[methodName](data);
    },
    // 交易操作
    toTransaction(data) {
      const { sub_type } = data;
      switch (sub_type) {
        case '1':
          this.$router.push({
            path: '/order/refund-detail',
            query: {
              type: data.refund_type,
              id: data.source_id
            }
          });
          break;
        case '2':
          this.$router.push({
            path:
              data.order_type == '1'
                ? '/order/detail'
                : '/order/special-detail',
            query: {
              id: data.source_id
            }
          });
          break;
        case '3':
          this.$router.push({
            path: '/store/goods-detail',
            query: {
              id: data.source_id
            }
          });
          break;
        case '4':
          this.$router.push({
            path: '/order/barter-detail',
            query: {
              id: data.source_id
            }
          });
          break;
        case '5':
          this.$router.push({
            path: '/order/refund-detail',
            query: {
              type: data.refund_type,
              id: data.source_id
            }
          });
          break;
        case '20':
          this.$router.push({
            path: 'livePayRecord',
            query: {
              houseId: data.source_id
            }
          });
          break;
        // 观影-电影票订单详情
        case '21':
          this.$router.push({
            path: 'movieTicket',
            query: {
              id: data.source_id
            }
          });
          break;
      }
      // 商户提现详情
      if ([26, 29, 30, 31].includes(+sub_type)) {
        this.$router.push({
          path: 'shopWithdrawDetail',
          query: {
            id: data.source_id,
            idType: data.id_type
          }
        });
      }
      // 幸福币详情
      if (sub_type == 6 || sub_type == 7) {
        this.$router.push(`/pages/credit/creditDetail?id=${data.source_id}`);
      }
    },
    // 互动操作
    toInteraction(data) {
      this.$router.push({
        path: '/pages/neighbours/details',
        query: {
          articleType: data.article_type,
          id: data.source_id
        }
      });
    },
    // 活动操作
    onActivity(data) {
      this.$router.push({
        path: '/pages/neighbours/details',
        query: {
          articleType: '2',
          id: data.source_id
        }
      });
    },
    // 物业操作
    toButler(data) {
      switch (data.sub_type) {
        // 公告通知-详情
        case '13':
          this.$router.push({
            path: '/pages/butler/notice/details',
            query: {
              id: data.source_id
            }
          });
          break;
        // 归还通知-我的免费服务列表
        case '14':
          this.$router.push({
            path: '/pages/butler/freeserver/list'
          });
          break;
        // 投诉表扬-详情
        case '15':
          this.$router.push({
            path: '/pages/butler/compraise/details',
            query: {
              id: data.source_id
            }
          });
          break;
        // 报事报修-详情
        case '16':
          this.$router.push({
            path: '/pages/butler/repairs/details',
            query: {
              id: data.source_id
            }
          });
          break;
        // 报事报修-详情
        case '19':
          this.$router.push({
            path: 'livePayIndex',
            query: {
              id: data.source_id
            }
          });
          break;
        // 生活缴费-充值/缴费页面
        case '22':
          this.$router.push({
            path: 'livemainPay',
            query: {
              genreType: data.genre_type,
              projectId: data.project_id,
              houseId: data.expenses_house_id
            }
          });
          break;
      }
    },
    // 系统操作
    onSystem(data) {
      if (data.sub_type == 8) {
        this.$router.push({
          path: 'sysMsgInfo',
          query: {
            id: data.source_id
          }
        });
      }
      if (data.sub_type == 9) {
        this.$router.push({
          path: '/pages/personage/feedback/details',
          query: {
            id: data.source_id
          }
        });
      }
      if ([27, 28].includes(+data.sub_type)) {
        this.$router.push({
          path: 'shopInformation',
          query: {
            shopId: data.source_id,
            type: 1
          }
        });
      }
    },
    // 工作操作 - 处理员报事报修详情
    onWork(data) {
      this.$router.push({
        path: '/pages/personage/transaction/details',
        query: {
          id: data.source_id
        }
      });
    },
    // 任务操作
    handleTaskClick(data) {
      const routeName = {
        // 接单方 - 任务进度
        23: 'scheduleReceiver',
        // 任务方 - 我的任务详情
        24: 'PersonageTaskDetails',
        // 任务提问
        25: 'operateQuiz'
      };
      this.$router.push({
        path: routeName[data.sub_type],
        query: {
          taskId: data.source_id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.message-page {
  ::v-deep .van-tabs__wrap {
    width: 100%;
    position: fixed;
  }
  .tf-p-20 {
    margin-top: var(--tabs-line-height, 44px);
  }
}
</style>
