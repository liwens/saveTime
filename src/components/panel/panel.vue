<template>
  <div class="panelContainer">
    <div class="panel">
      <process-circle :width="circleWidth" :percent="hourPercent">{{runTimeData.hour}} <i
        class="circle-inline-text">时</i>
      </process-circle>
      <process-circle :width="circleWidth" :percent="minutePercent">{{runTimeData.minute}} <i
        class="circle-inline-text">分</i></process-circle>
      <process-circle :width="circleWidth" :percent="secondPercent">{{runTimeData.second}} <i
        class="circle-inline-text">秒</i></process-circle>
      <div class="btn">
        <transition name="btn">
          <el-button type="warning" @click="end" v-if="timer !== null" size="large" :key="'end'">结束记录</el-button>
          <el-button type="primary" @click="start" v-if="timer == null && content == ''" size="large" :key="'start'">
            开始记录
          </el-button>
          <el-button type="success" @click="save" v-if="timer ==null && content != ''" size="large" :key="'save'">保存记录
          </el-button>
        </transition>
      </div>
      <transition name="record" mode="out-in">
        <div class="record-area" v-show="isStart">
          <div class="type">
            <span class="minTitle">标签 <i class="el-icon-edit edit" ref="editIcon" @click="edittag"></i></span>
            <tag :close="editSign" @inputTagComplete="_toggleEditTag"></tag>
          </div>
          <span class="minTitle">内容</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="记录你做了什么"
            v-model.trim="content">
          </el-input>
        </div>
      </transition>
    </div>
    <transition name="settlement" mode="out-in">
      <div class="settlement" v-if="!isStart && content">
        <div class="start-time">
          <span class="d">开始</span> {{`${timeData.startTime.hour} : ${timeData.startTime.minute}`}}
        </div>
        <div class="end-time">
          <span class="d">结束</span> {{`${timeData.endTime.hour} : ${timeData.endTime.minute}`}}
        </div>
        <transition name="sele">
          <div class="sele" v-if="changeTimeSign">
            <el-time-select
              placeholder="起始时间"
              v-model="editStartTime"
              class="setST"
              size="mini"
              :clearable=false
              @change="editST"
              :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '23:50'
            }">
            </el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="editEndTime"
              class="setET"
              :clearable=false
              size="mini"
              @change='editET'
              :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '23:50',
              minTime: editStartTime
            }">
            </el-time-select>
          </div>
        </transition>
        <div class="content">
          <p class="d">内容</p>
          {{content}}
        </div>
        <el-tooltip class="item" effect="dark" content="修改时间" placement="top-start">
          <i class="el-icon-edit edit" @click="changeTime"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="取消记录" placement="top-start">
          <i class="el-icon-delete cancel" @click="cancel"></i>
        </el-tooltip>

      </div>
    </transition>
    <comfirm :title="comfirmInfo.title"
             :comfirmText="comfirmInfo.comfirm"
             :closeText="comfirmInfo.close"
             v-if="comfirmVisible"
             @comfirm="recoveryStartCache"
             @close="recoveryStartCache">
    </comfirm>
  </div>
</template>

<script>
  import ProcessCircle from 'base/progress-circle/progress-circle'
  import Tag from 'components/tag/tag'
  import Comfirm from 'base/comfirm/comfirm'
  import * as $$ from 'common/js/dom'
  import {mapGetters, mapMutations} from 'vuex'
  import {isPC} from 'common/js/isPC'
  import timeObject from 'common/js/timeObject'
  import {deepClone, zeroObj} from 'common/js/util'
  import {TIME_DATA_LIST, START_CACHE,oneSecond, oneMinute, oneHour} from 'common/js/config';

  export default {
    created() {
      this._setCircleSize();
      this._onresize();
      this.recoveryStartCache();
    },
    mounted() {
      this.timeData = new timeObject();
    },
    components: {
      ProcessCircle,
      Tag,
      Comfirm
    },
    data() {
      return {
        //timeObject 实例
        timeData: null,
        circleWidth: 100,
        isStart: false,
        timer: null,
        //运行中时间数据
        runTimeData: {
          hour: 0,
          minute: 0,
          second: 0
        },
        editSign: false,
        durationMS: 0,
        content: '',
        comfirmVisible: false,
        comfirmInfo: {
          title: '',
          comfirm: '',
          close: ''
        },
        changeTimeSign: false,
        editStartTime: '',
        editEndTime: ''
      }
    },
    computed: {
      //秒百分比，供圆形进度条使用
      secondPercent() {
        return this.runTimeData.second / 60
      },
      //分钟百分比，供圆形进度条使用
      minutePercent() {
        return this.runTimeData.minute / 60
      },
      //小时百分比，供圆形进度条使用
      hourPercent() {
        return this.runTimeData.hour / 24
      },
      ...mapGetters([
        'selectTag',
        'dataList',
        'tag'
      ])
    },
    methods: {
      start() {
        //
        let nowTime = this.timeData.start();
        if (localStorage.getItem(START_CACHE) == null) {
          localStorage.setItem(START_CACHE, JSON.stringify(nowTime))
        }
        this.isStart = true;
        this._timepiece(nowTime.source.getTime());
        this.editStartTime = this.timeData.startTime.hour + ":" + this.timeData.startTime.minute;
      },
      end() {
        //校验
        if (this.timeData.verifyEmpty() == 'tagNull') {
          this.$message('请选择标签');
          return
        }
        if (this.timeData.verifyEmpty() == 'contentNull') {
          this.$message('填写内容才能结束');
          return
        }
        this.timeData.end();
        this.isStart = false;
        //清除定时器
        window.clearInterval(this.timer);
        this.editEndTime = this.timeData.endTime.hour + ":" + this.timeData.endTime.minute;
        this.timer = null
      },
      save() {
        //清空运行时间（圆环）
        zeroObj(this.runTimeData)
        //数据保存到DataList
        this.setDataList(deepClone(this.timeData));
        this.$message('保存成功');
        this.content = '';
        this._saveTagTotalMS();

        localStorage.removeItem(START_CACHE)
      },
      //存储标签总时间
      _saveTagTotalMS() {
        let tag = deepClone(this.tag);
        tag.forEach((item) => {
          if(item.name == this.timeData.tag.name) {
            item.totalMs += this.timeData.durationMs;
          }
        })
        this.setTag(tag);
      },
      cancel() {
        zeroObj(this.runTimeData)
        this.timeData.clear()
        localStorage.removeItem(START_CACHE)
        this.content = ''
        this.$message({
          type: 'success',
          message: '已取消记录'
        })
      },
      edittag() {
        this._toggleEditTag();
        if (this.editSign) {
          $$.addClass(this.$refs.editIcon, 'selectd');
        } else {
          $$.removeClass(this.$refs.editIcon, 'selectd');
        }
      },
      _toggleEditTag() {
        this.editSign = !this.editSign
      },
      //返回开始时间到现在的毫秒数， 接受值：开始时间毫秒数，时间戳
      _timepiece(optionDate) {
        this.timer = setInterval(() => {
          let newDate = new Date()
          //持续毫秒数 = 现在毫秒数 - 传入的毫秒数
          this.durationMS = Math.floor((newDate.getTime() - optionDate));
          //计算圆环时间
          this.setRunTime();
        }, 1000)
      },
      setRunTime() {
        let val = this.durationMS;
        this.runTimeData.second = Math.floor(val % oneHour % oneMinute / oneSecond);
        this.runTimeData.minute =  Math.floor(val % oneHour / oneMinute);
        this.runTimeData.hour =  Math.floor(val / oneHour);
      },
      //设置圆环大小
      _setCircleSize() {
        //电脑版
        if (isPC()) {
          this.circleWidth = 180;
        }
        //手机端
        else {
          let ScreenWidth = window.innerWidth;
          //设置圆圈的直径，屏幕宽度与适合的圆圈直接为向上抛物线， 320宽度适合直接100，768宽度合适宽度150左右。
          //计算出方程 y = 0.04^2X - 0.8X,  y为屏幕宽度， x 为圆圈直径。 方程反向推演x = 10 + 5 * √(y+4)
          let circleWidth = 10 + 5 * Math.sqrt(ScreenWidth + 4)
          this.circleWidth = circleWidth;
        }
      },
      recoveryStartCache(sign) {
        let cache = JSON.parse(localStorage.getItem(START_CACHE));
        //判断是否有缓存
        if (sign == undefined) {
          if (cache) {
            this.comfirmInfo.title = '你有未结束的记录'
            this.comfirmInfo.comfirm = '继续'
            this.comfirmInfo.close = '不要了'
            this.comfirmVisible = true;
          }
        } else {
          //继续
          if (sign) {
            cache = JSON.parse(localStorage.getItem(START_CACHE));
            this.timeData.setStartTime(cache)
            this._countTimetoRunTimeData(cache.msfrom1970)
            this.isStart = true;
            this._timepiece(cache.msfrom1970);
            this.comfirmVisible = false;
            this.editStartTime = this.timeData.startTime.hour + ":" + this.timeData.startTime.minute;
          }
          //不要了
          else {
            localStorage.removeItem(START_CACHE);
            this.comfirmVisible = false;
            this.$message({
              type: "success",
              message: '已清除这条记录'
            })
          }
        }

      },
      //恢复未完成记录时计算运行时间的小时和分钟
      _countTimetoRunTimeData(optionDate) {
        let minute = 60;
        let hour = minute * 60;
        let duration = Math.floor((Date.now() - optionDate) / 1000);
        console.log(duration)
        this.runTimeData.hour = Math.floor(duration / hour);
        this.runTimeData.minute = Math.floor(duration % hour / minute);
      },
      //窗口大小被改变，重新计算圆环大小
      _onresize() {
        window.onresize = () => {
          this._setCircleSize()
        }
      },
      changeTime() {
        this.changeTimeSign = !this.changeTimeSign;
      },

      //保存面板-编辑开始时间
      editST(t) {
        let date = new Date();
        let [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
        //element-ui的时间选择插件需要 01 : 10格式时间的字符串
        let hour = t.match(/(\w*):/)[1];
        let min = t.match(/:(\w*)/)[1];

        this.timeData.startTime = this.timeData.getNowTime({
          year,
          month,
          day,
          hour,
          min
        })
        this.timeData.countDuration();
        this._countRuntimeData(this.timeData.durationMs)
        this.$message('修改成功')

      },

      //保存面板-编辑结束时间
      editET(t) {
        let date = new Date();
        let [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
        let hour = t.match(/(\w*):/)[1];
        let min = t.match(/:(\w*)/)[1];

        this.timeData.endTime = this.timeData.getNowTime({
          year,
          month,
          day,
          hour,
          min
        })
        this.timeData.countDuration();
        this._countRuntimeData(this.timeData.durationMs)
        this.$message('修改成功')
      },
      _countRuntimeData(ms) {
        let second = 1000;
        let minute = second * 60;
        let hour = minute * 60;

        this.runTimeData.hour = Math.floor(ms / hour);
        this.runTimeData.minute = Math.floor(ms % hour / minute);
        this.runTimeData.second = Math.floor(ms % hour % minute / second);
      },

      ...mapMutations({
        setDataList: 'SET_DATALIST',
        setTag: 'SET_TAG'
      })
    },

    watch: {
      //保存标签到对象中
      selectTag(tag) {
        this.timeData.setTag(tag);
      },
      //保存记录内容
      content(text) {
        if (text) {
          this.timeData.setContent(text)
        }
      }
    },

  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  $padding: 5px 10px;
  .panelContainer {
    .panel {
      height: auto;
      transition: .4s all cubic-bezier(0.86, 0.18, 0.82, 1.32);
      text-align: center;
      margin: 0 5px;
      box-sizing: border-box;
      padding: 20px 0;
      background-color: rgba($color-highlight-background, 0.5);
      border-radius: 5px;
      color: #ffcd32;
      box-shadow: 0px 5px 30px $color-background;
      .btn {
        button {
          transform: translateX(0px)
        }
      }
      p {
        font-size: 40px;
      }
      .record-area {
        padding: $padding;
        .type {
        }
        .minTitle {
          display: block;
          text-align: left;
          color: #8391a5;;
          font: {
            size: $font-size-medium-x;
          }
          margin-top: 10px;
          .edit:hover {
            cursor: pointer;
            color: $color-theme
          }
        }
      }
    }
    .settlement {
      color: $color-text-ll;
      background-color: $color-background-d;
      padding: 20px;
      margin-top: 10px;
      position: relative;
      padding-bottom: 40px;
      .sele {
        @include fix;
        .setST {
          float: left;
          width: 40%;
        }
        .setET {
          width: 40%;
          float: right;

        }
        .sele-leave-active,
        .sele-enter-active {
          transition: .3s all;
        }
        .sele-enter,
        .sele-leave-to {
          opacity: 0;
          transform: translateY(-100px);
        }
      }

      .start-time {
        display: inline-block;
      }
      .end-time {
        display: inline-block;
        float: right;
        @include fix;
      }
      .d {
        color: $color-text-d
      }
      .cancel {
        font-size: $font-size-large-x;
        cursor: pointer;
        text-align: right;
        position: absolute;
        right: 20px;
        bottom: 10px;
      }
      .edit {
        font-size: $font-size-large;
        cursor: pointer;
        text-align: right;
        position: absolute;
        right: 60px;
        bottom: 12px;
      }
    }
  }

  .selectd {
    color: $color-theme
  }

  .circle-inline-text {
    font-size: $font-size-medium
  }

  .btn-enter-active,
  .btn-leave-active {
    transition: .4s all linear;
  }

  .btn-enter {
    opacity: 0;
    transform: translate3d(200px, 0, 0)
  }

  .btn-leave-to {
    opacity: 0;
    transform: translate3d(-200px, 0, 0)
  }

  //记录控制台动画
  .record-enter-active {
    transition: .4s all cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }

  .record-leave-active {
    transition: .4s all
  }

  .record-enter,
  .record-leave-to {
    opacity: 0;
    transform: translate3d(0, -100px, 0)
  }

  //结算部分动画
  .settlement-enter-active,
  .settlement-leave-active {
    transition: .4s all;
  }

  .settlement-enter,
  .settlement-leave-to {
    opacity: 0;
    transform: translate3d(0, -200px, 0)
  }

  @media screen and (min-width: 700px) {
    .panelContainer {
      margin: 0 auto;
      width: 600px;
    }

  }
</style>
