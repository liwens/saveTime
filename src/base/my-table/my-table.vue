<template>
  <div id="container">
    <div class="sortable">
      <div class="block">
        <span class="demonstration">日期</span>
        <button class="shortcutBtn" @click="shortcut('left')">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          ref='picker'
          :clearable=false
        >
        </el-date-picker>
        <button class="shortcutBtn" @click="shortcut('right')">
          <i class="el-icon-d-arrow-right"></i>
        </button>
      </div>
    </div>

    <div id="my-table">
      <div v-if="toggle" class="list">
        <div class="header">
          <template v-for="item in columns">
            <div class="header-item cell">
              {{item.label}}
            </div>
          </template>

        </div>
        <transition-group name="lists" tag="div" class="list-container">
          <div :key="index" class="list-item" v-for="(item ,index) in showData[sub]" v-if="showData.length">
            <div class="cell">
              <el-tag
                :key="item.tag.name"
                :close-transition=true
              >
                {{item.tag.name}}
              </el-tag>

            </div>
            <div class="cell">
              {{item.startTime.string_hour_min}} - {{item.endTime.string_hour_min}}
            </div>
            <div class="cell">
              {{item.duration}}
            </div>

            <div class="cell">
              {{item.content}}
            </div>
            <div class="delete-icon" @click="deleteData(item)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </transition-group>
      </div>
      <div>
        <div class="sta" v-if="!toggle">
          <div class="header">
            <template v-for="item in staColumns">
              <div class="header-item cell">
                {{item.label}}
              </div>
            </template>
          </div>
          <div class="list-item" v-for="item in staData"  v-if="item != '0'">
            <div class="cell"><el-tag>{{item.tag}}</el-tag></div>
            <div class="cell">{{item.duration}}</div>
            <div class="cell">{{item.counter}}</div>
          </div>
        </div>
      </div>
    </div>

    <el-button @click="sta" v-if="toggle" class="toggle" size="small" type="info">今日统计</el-button>
    <el-button @click="sta" v-else class="toggle" size="small"  type="success">返回列表</el-button>
    <div class="page">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <div class="noDataTip" v-if="!showData.length">还没有数据，去记录啊老铁</div>
  </div>

</template>


<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {max, min, format, deepClone, timeToString} from 'common/js/util'
  import {isPC} from 'common/js/isPC'
  import {TIME_DATA_LIST} from 'common/js/config'

  export default {
    data() {
      return {
        selectedDate: "",
        showData: [],
        columns: [
          {
            label: '标签',
            prop: 'tab',
            width: '10%',
          },
          {
            label: '时间',
            prop: 'startTime.string_hour_min',
            width: '25%'
          },
          {
            label: '持续时间',
            prop: 'duration',
            width: '25%',
          },

          {
            label: '内容',
            prop: 'content',
            width: '40%'
          }],
        staColumns: [
          {label: '标签'},
          {label: '持续时间'},
          {label: '次数'}
        ],
        pickerOptions: {
          disabledDate(time) {
            return Error('时间范围设置失败')
          }
        },
        pageSize: 10,
        currentPage: 1,
        total: 0,
        earliest: new Date(),
        last: new Date(),
        staData: {},
        toggle: true
      }
    },
    props: {},
    created() {
      this.selectedDate = new Date();
      this._dataScope()
      this._fittingPageSize()
      this._updateShowData();
      this.toggle = true
    },

    methods: {
      //统计
      sta() {
        if (this.toggle) {
          let year = this.selectedDate.getFullYear();
          let month = format(this.selectedDate.getMonth() + 1);
          let day = format(this.selectedDate.getDate());

          let now = this.dataList[year][month][day];
          let tagobj = this.staData;

          this.tag.forEach(function (e) {
            tagobj[e.name] = 0;
          })
          for (let d in now) {
            let name = now[d].tag.name;
            if (tagobj[name]) {
              tagobj[name].durationMS += now[d].durationMs;
              tagobj[name].counter += 1;
              tagobj[name].duration = timeToString(tagobj[name].durationMS)
            } else {
              let obj = {};
              obj.durationMS = now[d].durationMs;
              obj.tag = now[d].tag.name;
              obj.duration = timeToString(obj.durationMS);
              obj.counter = 1;
              tagobj[name] = obj;
            }

          }
          this.staData = tagobj;
          this.toggle = false;
        } else {
          this.toggle = true;
        }
      },
      //根据存储数据，设置最早数据日期以及最新数据日期范围
      _dataScope() {
        let [yearArr, monthArr, dayArr] = [[], [], []];
        //获取日期数组，年月日
        for (let year in this.dataList) {
          yearArr.push(Number(year))
          for (let month in this.dataList[year]) {
            monthArr.push(Number(month))
            for (let day in this.dataList[year][month]) {
              dayArr.push(Number(day))
            }
          }
        }
        //最早的数据日期
        this.earliest.setFullYear(min(yearArr), min(monthArr) - 1, min(dayArr))
        this.earliest.setHours(0, 0, 0, 0);
        //最新的数据日期
        this.last.setFullYear(max(yearArr), max(monthArr) - 1, max(dayArr))
        this.last.setHours(0, 0, 0, 0);
        //element-ui框架日期选择器禁用选项。调整月份会触发disabledDate。以天为单位，参数time是当天的getTime毫秒数，返回true禁用
        let last = this.last
        let earliest = this.earliest
        let list = this.dataList;
        this.pickerOptions = {
          disabledDate(time) {
            let year = time.getFullYear();
            let month = format(time.getMonth());
            let day = format(time.getDate());
//            console.log(year +": "  +month+" :" +day)
            return time.getTime() > last.getTime() || time.getTime() < earliest.getTime();
          }
        }
        //预选日期： 最新数据那天
        let ms = this.last.getTime();
        this.selectedDate.setTime(ms);
        //更新数据
        this._updateShowData();
      },

      //更新显示数据，接受参数：选择的时间戳，可选，如果不选，就用this.selectedDate
      _updateShowData(selectedDate) {
        selectedDate = selectedDate ? selectedDate : this.selectedDate;
        let [year, month, day] = [selectedDate.getFullYear(), format(selectedDate.getMonth() + 1), format(selectedDate.getDate())];
        this.showData.length = 0;
        //获取对应日期数据，并建立分页数组
        if (this.dataList[year][month][day] !== undefined) {
          //过渡的数组
          let temArr = []

          this.total = this.dataList[year][month][day].length;
          this.dataList[year][month][day].forEach((item, index) => {
            //数据推入过渡数组
            temArr.push(item)
            if ((index + 1) % this.pageSize == 0) {
              //深拷贝过渡数组，推入showData
              this.showData.push(deepClone(temArr))
              temArr.length = 0;
            }
          })
          //把过渡数组中剩余的数据推入showData
          if (temArr.length) {
            this.showData.push(temArr)
          }
        }
      },
      currentChange(nowPage) {
        this.currentPage = nowPage;
      },
      deleteData(data) {
        console.log(data)
        this._cutTagTotalMS(data)
        this.deleteDataList(data)
        this._dataScope()
      },
      _cutTagTotalMS(data) {
        let tag = deepClone(this.tag);
        tag.forEach((item) => {
          if(item.name == data.tag.name) {
            item.totalMs -= data.durationMs;
          }
        })
        console.log(tag)
        this.setTag(tag);
      },
      _fittingPageSize() {
        if (!isPC()) {
          this.pageSize = 5;
        }
      },
      //快捷操作按钮
      shortcut(direction) {
        if (direction !== 'left' && direction !== 'right') {
          new Error('参数必须为left or right')
        }
        //一天的毫秒数
        let oneday = 864e5;
        if (direction == 'left') {
          if (this.selectedDate.getTime() - oneday < this.earliest.getTime()) {
            this.$message({
              type: 'warning',
              message: `${this.earliest.getFullYear()}-${this.earliest.getMonth() + 1}-${this.earliest.getDate()}是最早的数据`
            })
            return
          }
          this.selectedDate.setTime(this.selectedDate.getTime() - oneday)
        }
        else if (direction == 'right') {
          if (this.selectedDate.getTime() + oneday > this.last.getTime()) {
            this.$message({
              type: 'warning',
              message: `${this.earliest.getFullYear()}-${this.last.getMonth() + 1}-${this.last.getDate()}是最新的数据`
            })
            return
          }
          this.selectedDate.setTime(this.selectedDate.getTime() + oneday)
        }

        this._updateShowData();
        //必须创建一个新的Date对象，并以setTime赋值，再赋值给this.$refs.picker.currentValue 以更新状态。不能直接赋值，那是浅拷贝
        let remDate = new Date();

        remDate.setTime(this.selectedDate.getTime())
        this.$refs.picker.currentValue = remDate;
        this.toggle = false;
        this.staData = {};
        this.sta();
      },
      ...mapMutations({
        deleteDataList: 'SELETE_DATALIST',
        setTag: 'SET_TAG'
      })
    },
    computed: {
      //数组下标
      sub() {
        return this.currentPage - 1
      },
      ...mapGetters([
        'dataList',
        "tag"
      ])
    },
    watch: {
      //日期切换时更新相应显示数据
      selectedDate(value) {
        this._updateShowData(value)

      },

      //数据源更新时，更新显示数据
      dataList: {
        handler: function (value) {
          this.toggle = true;
          console.log('matable 监听触发')
          this._updateShowData()
        },
        deep: true
      }
    }
  }
</script>


<style rel='stylesheet/scss' lang='scss' scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  @mixin cell {
    word-wrap: break-word;
    vertical-align: center;
    line-height: 35px;
    padding: 0 5px;
    box-sizing: border-box;
    color: #000;
    float: left;
    font-size: $font-size-medium;
  }

  #container {
    background-color: $color-grey-ll;
    color: #000;
    overflow: hidden;
    border-radius: 4px;
    .sortable {
      margin: 10px;
      .shortcutBtn {
        border: none;
        background-color: inherit;
        outline: none;
        text-align: center;
        cursor: pointer;
        padding: 9px 3px;
        transition: all .3s;
        &:hover {
          border-radius: 3px;
          background-color: $color-grey-l;
          box-shadow: 1px 1px 1px $color-grey;
        }
      }
    }
    #my-table {
      .header {
        border-bottom: 2px solid $color-grey;
        @include fix;
        .header-item {
          display: inline-block;
          font-weight: 600;
        }
        .cell {
          @include cell
        }
      }
      .list {
        & .header .header-item:nth-child(1), & .list-item div:nth-child(1) {
          width: 15%;
        }
        & .header .header-item:nth-child(2), & .list-item div:nth-child(2) {
          width: 25%;
        }
        & .header .header-item:nth-child(3), & .list-item div:nth-child(3) {
          width: 25%;
        }
        & .header .header-item:nth-child(4), & .list-item div:nth-child(4) {
          width: 30%;
        }
      }
      .sta {
        & .header .header-item:nth-child(1), & .list-item div:nth-child(1) {
          width: 20%;
        }
        & .header .header-item:nth-child(2), & .list-item div:nth-child(2) {
          width: 35%;
        }
        & .header .header-item:nth-child(3), & .list-item div:nth-child(3) {
          width: 35%;
        }
        & .list-item {
          border-bottom: 1px solid $color-grey;
          display: flex;
          align-items: center;
          @include fix;
          & .cell {
            @include cell
          }
        }
      }
      .list-container {
        .list-item {
          border-bottom: 1px solid $color-grey;
          display: flex;
          align-items: center;
          @include fix;
          & .cell {
            @include cell
          }
        }
        .list-item:hover .delete-icon {
          opacity: 1;
        }

        .list-item .delete-icon {
          opacity: 0;
          color: $color-grey;
          cursor: pointer;
          &:hover {
            color: $color-background;
          }
        }
      }
    }
    .page {
      margin: 10px;
      float: right;
    }
    .toggle{
      margin: 10px;
    }
    .noDataTip {
      padding-left: 10px;
    }
  }


</style>
