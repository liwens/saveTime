<script src="../../../dist/static/js/app.a773811f46f99afc3ac7.js"></script>
<template>
  <div class="report">
    <div class="day">从 <span class="highLight">{{firstDay}}</span> 第一次使用开始，过去的 <span class="highLight">{{totalDay}}</span> 天里</div>
    <div v-for="item in tag">
      <el-tag>{{item.name}}</el-tag>
      累计时间 <span class="highLight">{{timeToStringNoDay(item.totalMs)}}</span>
    </div>
  </div>

</template>

<script>
  import {FRIST_DAY} from 'common/js/config.js';
  import {mapGetters} from 'Vuex'

  export default {
    data() {
      return {
        firstDay: " "
      }
    },
    computed: {
      totalDay() {
        const day = 864e5;
        let first = JSON.parse(localStorage.getItem(FRIST_DAY));
        console.log(first)
        let taday = new Date();
        return Math.floor((taday.getTime() - first.msfrom1970) / day)

      },
      ...mapGetters([
        'tag'
      ])

    },
    methods: {
      _firstDay() {
        let first = JSON.parse(localStorage.getItem(FRIST_DAY));
        console.log(first)
        this.firstDay = `${first.year} 年 ${first.month} 月 ${first.day}日`
      },
      timeToStringNoDay(time) {
        const oneSecond = 1000;
        const oneMinute = oneSecond * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;
        let second, minute, hour, day;

        if (time < oneMinute) {
          return '少于一分钟'
        } else {
          day = Math.floor(time / oneDay)
          hour = Math.floor(time % oneDay / oneHour)
          minute = Math.floor(time % oneDay % oneHour / oneMinute)
          second = Math.floor(time % oneDay % oneHour / oneMinute % oneSecond)
        }

        if(hour > 0){
          return `${hour}小时 ${minute}分钟 ${second}秒`
        }else{
          return `${minute}分钟 ${second}秒`
        }
      }

    },
    created() {
      this._firstDay()
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  @import "../../common/scss/variable.scss";
  .report{
    color: $color-text-ll;
    margin: 10px;
  }
  .highLight {
    color: $color-theme;
  }
</style>
