<template>
  <!-- <view> -->
  <view class="tf-mb-20">
    <view class="tf-list-content tf-mb-20 tf-row-justify-center">
      {{ data.ctime }}
    </view>
    <view class="tf-list" @click="handleClick">
      <!-- 商品交易 -->
      <image
        v-if="type == 'transaction' && parseInt(data.sub_type) < 6"
        class="tf-list-image"
        mode="aspectFill"
        :src="data.thumb"
      ></image>
      <!-- 工作 -->
      <template v-else-if="type == 'work'">
        <view class="list-icon-box tf-icon" :class="repairIconClass"></view>
      </template>
      <view
        v-else-if="type === 'system' && [27, 28].includes(+data.sub_type)"
        class="list-icon-box audit-icon"
      >
        <image
          v-if="data.sub_type == 27"
          class="pass-icon"
          src="@/static/personage/pass.png"
        ></image>
        <image
          v-else
          class="un-pass-icon"
          src="@/static/personage/unPass.png"
        ></image>
      </view>
      <template v-else-if="type !== 'system'">
        <view class="list-icon-box tf-icon" :class="iconClass"></view>
      </template>
      <!-- 右边内容 -->
      <view class="tf-column-justify-around">
        <view class="tf-row-items-center">
          <view
            class="tf-list-title"
            :class="{ 'tf-read-after-tag': data.status }"
          >
            {{ data.title }}
          </view>
          <view
            v-if="data.is_read == '0'"
            class="tf-circle-tag--warning"
          ></view>
        </view>
        <view
          class="tf-list-content"
          :class="{ 'system-content': type == 'transaction' }"
        >
          {{ data.content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    iconClass() {
      // 1=交易退款成功、2=订单已发货、3=限时闪购活动开始提醒、4换货寄出提醒、5=退货寄出提醒、6=幸福币使用、7=幸福币获得、8=系统通知、9=意见反馈、10=我收到的赞、11=我发布的文章收到的评论、12=我评论的内容收到回复、13=公告通知、14=归还通知、15=投诉表扬、16=报事报修、17=活动报名通知、18=活动开始通知
      const value = this.data.sub_type;
      const title = this.data.title;
      if (value === '23' || value === '24') {
        const icon = {
          任务已发布: 'tf-icon-renwufabu', // 任务已发布
          任务审核通过: 'tf-icon-renwufabu', // 任务审核通过
          任务已超时: 'tf-icon-renwuchaoshi', // 任务已超时
          任务已交付: 'tf-icon-yijiaofu', // 任务已交付
          任务投诉: 'tf-icon-renwutousu', // 任务投诉
          任务已失效: 'tf-icon-renwushixiao', // 任务已失效
          任务审核失败: 'tf-icon-renwushenhe', // 任务审核失败
          任务已接单: 'tf-icon-yijiedan', // 任务已接单
          任务未完成: 'tf-icon-weiwancheng', // 任务未完成
          任务已完成: 'tf-icon-yiwancheng', // 任务已完成
          任务已淘汰: 'tf-icon-yitaotai', // 任务已淘汰
          任务已放弃: 'tf-icon-yifangqi', // 任务已放弃
          任务提问: 'tf-icon-renwutiwen', // 任务提问
          任务已终止: 'tf-icon-yizhongzhi', // 任务已终止
          任务已延期: 'tf-icon-renwuyanqi', // 任务已延期
          任务已评价: 'tf-icon-renwupingjia', // 任务已评价
          任务已暂停: 'tf-icon-renwuzanting' // 任务已暂停
        };
        return icon[title];
      }
      const icon = {
        6: 'tf-icon-xingfubi1 xingfubi1-use',
        7: 'tf-icon-xingfubi1',
        13: 'tf-icon-gonggao1',
        14: 'tf-icon-guihuan',
        15: 'tf-icon-biaoyangtousu',
        16: 'tf-icon-baoshibaoxiu',
        17: 'tf-icon-huodongbaoming',
        18: 'tf-icon-huodongkaishi',
        19: 'tf-icon-lifepaymessage',
        20: 'tf-icon-lifepaymessage',
        22: 'tf-icon-lifepaymessage',
        25: 'tf-icon-renwutiwen', // 任务提问
        26: 'tf-icon-xingfubi1',
        29: 'tf-icon-xingfubi1',
        30: 'tf-icon-xingfubi1',
        31: 'tf-icon-xingfubi1'
      };
      return `${icon[value]} icon-${value}`;
    },
    repairIconClass() {
      const value = this.data.repairs_status;
      const icon = {
        1: 'tf-icon-daichuli',
        2: 'tf-icon-daifenpai',
        3: 'tf-icon-daijiean',
        4: 'tf-icon-yijiean',
        5: 'tf-icon-baoshibaoxiu'
      };
      return icon[value] || '';
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick() {
      // this.$emit('click', this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.list-icon-box {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 10rpx;
  font-size: 44rpx;
  color: #fff;
  text-align: center;
  margin-right: 20rpx;
}
.tf-column-justify-around {
  flex: 1;
  width: 0;
}
.tf-list {
  display: flex;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.tf-list-title,
.tf-list-content {
  width: 100%;
  @include text-ellipsis;
}
.tf-list-content {
  font-size: 24rpx;
  color: #8f8f94;
}
.tf-circle-tag--warning {
  width: 14rpx;
  height: 14rpx;
  margin-left: 8rpx;
  border-radius: 10rpx;
  background-color: #eb5841;
}
.system-content {
  line-height: 1.4;
  white-space: initial;
}
.empty-session {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  &__img {
    width: 483rpx;
    height: 335rpx;
  }
  &__text {
    font-size: 28rpx;
    text-align: center;
    line-height: 96rpx;
    color: #222;
  }
}
.tf-circle-tag--warning {
  width: 14rpx;
  height: 14rpx;
  margin-left: 8rpx;
}
.tf-icon-daichuli,
.tf-icon-gonggao1,
.tf-icon-huodongbaoming,
.tf-icon-xingfubi1,
.tf-icon-yijiedan,
.tf-icon-weiwancheng,
.tf-icon-yiwancheng,
.tf-icon-renwuyanqi,
.tf-icon-renwupingjia,
.tf-icon-renwuzanting,
.tf-icon-renwufabu,
.tf-icon-yijiaofu,
.tf-icon-renwushixiao {
  background: #ffa110;
}
.tf-icon-daifenpai,
.tf-icon-baoshibaoxiu {
  background: #5c76d8;
}
.tf-icon-yijiean,
.tf-icon-biaoyangtousu {
  background: #4bb192;
}
.tf-icon-daijiean,
.tf-icon-tf-icon-guihuan,
.tf-icon-huodongkaishi,
.audit-icon {
  background: #fd7d6f;
}
.tf-icon-lifepaymessage {
  font-size: 44rpx;
  background: #ff6551;
}
.xingfubi1-use,
.tf-icon-yitaotai,
.tf-icon-yizhongzhi,
.tf-icon-renwuchaoshi,
.tf-icon-renwushenhe,
.tf-icon-renwutousu,
.icon-29 {
  background: #ff6555;
}
.tf-icon-yifangqi,
.icon-30,
.icon-31 {
  background: #cccccc;
}
.tf-icon-renwutiwen {
  background: #00a0e9;
}
.tf-list-image {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
}
.audit-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  .pass-icon {
    width: 38rpx;
    height: 38rpx;
  }
  .un-pass-icon {
    width: 45rpx;
    height: 45rpx;
  }
}
</style>
