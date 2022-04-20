<template>
  <!-- 签到start -->
  <view
    v-if="value"
    class="calendar-mask-container sign-mask"
    catchtouchmove="true"
  >
    <view class="calendar-mask-block" @click="toggleFunc"></view>
    <view class="sign-mask-block" style="position: relative;z-index: 1000;">
      <view class="sign-block" data-show="show">
        <view class="mask-header">
          <view class="calendar-mask-tit">签到</view>
          <view class="mask-icon mask-icon-left"></view>
          <view class="mask-icon mask-icon-right"></view>
        </view>
        <view class="sign-cont">
          <view class="mask-bar">
            <view
              class="bar-btn bar-prev tf-icon tf-icon-caret-left"
              @click.stop="handlePrev"
              data-handle="prev"
            ></view>
            <view class="bar-month">{{ curYear }}年{{ curMonth }}月</view>
            <template v-if="year != curYear || month != curMonth">
              <view
                class="bar-btn bar-next tf-icon tf-icon-caret-right"
                @click.stop="handleNext"
                data-handle="next"
              ></view>
            </template>
            <template v-else>
              <view class="bar-btn bar-next"></view>
            </template>
          </view>
          <view class="mask-week">
            <view class="week-day">日</view>
            <view class="week-day">一</view>
            <view class="week-day">二</view>
            <view class="week-day">三</view>
            <view class="week-day">四</view>
            <view class="week-day">五</view>
            <view class="week-day">六</view>
          </view>
          <view class="mask-days">
            <template>
              <view
                v-for="(item, index) in data"
                :key="index"
                :class="[
                  'date-num',
                  item.is_prev || item.is_next ? 'gray-month' : '',
                  item.is_sign ? 'days-sign' : '',
                  item.is_start ? 'start-sign' : '',
                  item.is_end ? 'end-sign' : '',
                  item.is_start && item.is_end ? 'only-sign' : ''
                ]"
              >
                {{ item.date }}
              </view>
            </template>
          </view>
        </view>
      </view>
      <view class="mask-close-block">
        <text class="tf-icon tf-icon-guanbi1" @click="toggleFunc"></text>
      </view>
    </view>
  </view>
  <!-- 签到end -->
</template>

<script>
import { signinCalendar } from '@/api/personage';
export default {
  name: 'tf-calendar',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      year: 2020, // 当天的年份
      month: 7, // 当天的月份
      curYear: 0,
      curMonth: 0,
      data: []
    };
  },
  created() {
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.curYear = date.getFullYear();
    this.curMonth = date.getMonth() + 1;
    // this.getSigninCalendar()
  },
  methods: {
    /* 签到日历数据 */
    getSigninCalendar() {
      signinCalendar({
        year: this.curYear,
        month: this.curMonth
      }).then(res => {
        this.data = res.data.calendar;
      });
    },
    toggleFunc() {
      this.$emit('input', !this.value);
    },
    handleCalendar() {
      this.$emit('input', false);
    },
    handlePrev() {
      if (this.curMonth > 1) {
        this.curMonth--;
      } else {
        this.curYear--;
        this.curMonth = 12;
      }
      this.getSigninCalendar();
    },
    handleNext() {
      if (this.curMonth < 12) {
        this.curMonth++;
      } else {
        this.curYear++;
        this.curMonth = 1;
      }
      this.getSigninCalendar();
    },
    /**
     * 日历
     */
    DayNumOfMonth: function(year, month) {
      var oldmonth = month; // 原参数
      var dys_array = [];
      month--;
      var d = new Date(year, month, 1); // 获取当月1号的时间
      d.setDate(d.getDate() + 32 - d.getDate());
      var days = 32 - d.getDate(); // 计算当月有多少天
      var new_d = new Date(year, month, 1); // 重新获取当月1号的时间
      // var get_s_w = new_d.getDay();
      var get_week = new_d.getDay(); // 重新获取当月1号星期几
      if (get_week > 0) {
        // 如果大于0，那么要取出上个月最后的几天
        var s_month = month - 1;
        var s_ds = new Date(year, s_month, 1); // 获取上个月1号的时间
        s_ds.setDate(s_ds.getDate() + 32 - s_ds.getDate());
        var s_days = 32 - s_ds.getDate(); // 计算上个月有多少天

        var start_dys = s_days - get_week + 1; // 需要从上个月哪一号开始补
        for (var i = start_dys; i <= s_days; i++) {
          // dys_array.push(i);
          dys_array.push({
            date: i,
            is_prev: true,
            is_next: false,
            is_start: false,
            is_end: false,
            is_sign: false
          });
        }
      }
      for (var n = 1; n <= days; n++) {
        // 当月的所有天数
        dys_array.push({
          date: n,
          is_prev: false,
          is_next: false,
          is_start: false,
          is_end: false,
          is_sign: false
        });
      }
      var e_ds = new Date(year, month, days); // 当月的最后一天
      var get_e_week = e_ds.getDay(); // 当月的最后一天星期几
      var s_mot = 6 - parseInt(get_e_week); // 计算还需补充下一个月的天数
      if (s_mot) {
        for (var t = 1; t <= s_mot; t++) {
          dys_array.push({
            date: t,
            is_prev: false,
            is_next: true,
            is_start: false,
            is_end: false,
            is_sign: false
          });
        }
      }
      console.log(dys_array);
      this.setData({
        sign_arr: dys_array
      });
    }
  },
  watch: {
    value(val) {
      val && this.getSigninCalendar();
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar-mask-container {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.calendar-mask-block {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.mask-close-block {
  height: 120rpx;
  padding-top: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  .tf-icon {
    font-size: 40rpx;
  }
}
.sign-block {
  width: 624rpx;
  // min-height: 784rpx;
  border-radius: 10rpx;
}
.sign-cont {
  padding: 30rpx 0;
  background-color: #fff;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
}
.mask-header {
  height: 140rpx;
  position: relative;
}
.calendar-mask-tit {
  height: 98rpx;
  line-height: 98rpx;
  font-size: 34rpx;
  color: #fff;
  text-align: center;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  background-image: -webkit-linear-gradient(to right, $orange, $orange-dark);
  background-image: linear-gradient(to right, $orange, $orange-dark);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.mask-icon {
  position: absolute;
  top: 0;
  width: 24rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}
.mask-icon-left {
  left: 80rpx;
}
.mask-icon-right {
  right: 80rpx;
}
.mask-bar {
  display: flex;
  width: 570rpx;
  height: 60rpx;
  background-color: $divider-color;
  border-radius: 30rpx;
  margin: 0 0 0 30rpx;
  justify-content: space-between;
}
.bar-btn {
  width: 70rpx;
  height: 60rpx;
  position: relative;
  line-height: 60rpx;
  text-align: center;
  color: $gray-6;
}
.bar-month {
  width: 216rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 30rpx;
  color: $text-color;
}
.mask-week {
  height: 80rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
}
.week-day {
  width: 82rpx;
  text-align: center;
  line-height: 80rpx;
  font-size: 22rpx;
  color: $gray-7;
}
.mask-days {
  width: 574rpx;
  margin-left: 24rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
  // margin-bottom: 60rpx;
}
.date-num {
  width: 82rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  margin-bottom: 25rpx;
  color: $text-color;
  font-size: 24rpx;
}
.only-sign {
  width: 36rpx;
  margin: 0 23rpx;
}
.gray-month {
  color: #222;
}
.days-sign {
  background-color: #ffae00;
}
.start-sign {
  border-top-left-radius: 36rpx;
  border-bottom-left-radius: 36rpx;
}
.end-sign {
  border-top-right-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
}
</style>
