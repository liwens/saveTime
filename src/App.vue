<template>
  <div id="app">
    <nav-component></nav-component>
    <transition name="component" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>

    <div class="background" ref="bg"></div>
    <i ><a href="https://github.com/Lijinwen1994/saveTime"><img  class="github" src="./common/image/github.png" alt=""></a></i>
  </div>
</template>

<script>
  import navComponent from 'components/nav/navComponent'
  import {isPC} from 'common/js/isPC'
  import {mapGetters, mapMutations} from 'vuex'
  import {TIME_DATA_LIST, TAG, FRIST_DAY} from 'common/js/config'
  import timeObject from "./common/js/timeObject";

  export default {
    components: {
      navComponent
    },
    name: 'app',
    computed: {
      ...mapGetters([
        'dataList'
      ])
    },
    created() {
//      localStorage.removeItem(TIME_DATA_LIST)
//      localStorage.removeItem(TAG)
      //电脑端
      this.$nextTick(() => {
        this._setBackground();
      })
      this._getTimeDataListFromLocalStroage()
      this._getTagDatafromLocalStorage()
    },
    methods: {
      //获取列表数据
      _getTimeDataListFromLocalStroage() {
        //有数据
        if (localStorage.getItem(TIME_DATA_LIST) !== null) {
          let obj = JSON.parse(localStorage.getItem(TIME_DATA_LIST))
          this.setDataList(obj)
        }
      },
      //获取tag数据
      _getTagDatafromLocalStorage() {
        let data = []
        if (localStorage.getItem(TAG)) {
          //已有存储
          data = JSON.parse(localStorage.getItem(TAG));
          this.setTag(data)

        } else {
          //第一次打开网页
          let tag = [
            {
              name: '休息',
              type: '',
              'totalMs': 0
            },
            {
              name: '工作',
              type: '',
              'totalMs': 0
            },
            {
              name: '学习',
              type: '',
              'totalMs': 0
            }
          ]
          localStorage.setItem(TAG, JSON.stringify(tag))
          this.setTag(tag);
          this.FristDay();
        }
      },
      FristDay() {
        let firstDay = new timeObject();
        localStorage.setItem(FRIST_DAY, JSON.stringify(firstDay.getNowTime()))
      },
      //设置背景
      _setBackground() {
        if (isPC()) {
          this.$refs.bg.style.backgroundImage = 'url(' + require("./common/image/bg-pc3.jpg") + ')'
        }
        //手机端
        else {
          this.$refs.bg.style.backgroundImage = 'url(' + require("./common/image/bg-molibe.jpg") + ')'
        }
      },
      ...mapMutations({
        setDataList: 'SET_DATALIST',
        setTag: 'SET_TAG',
        setSelectTag: 'SET_SELECT_TAG'
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import './common/scss/variable.scss';

  #app {
    overflow: hidden;
    padding-top: 100px;
    .background {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: fixed;
      background-size: cover;
      filter: blur(15px);
      z-index: -1;
    }
    h1 {
      text-align: center;
      font-size: 40px;
      color: $color-theme;
      font-weight: normal;
      margin-bottom: 25px;
    }
    .github{
      position: absolute;
      bottom:10px;
      right:10px;
      width:40px;
      height:40px;
    }
  }
  .component-leave-active,
  .component-enter-active {
    transition: .4s all;
  }
  .component-enter,
  .component-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0,0)
  }
</style>
