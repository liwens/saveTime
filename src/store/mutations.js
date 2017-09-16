import * as types from './mutations-type'
import {year, month, day} from "../common/js/getTime";
import {TIME_DATA_LIST, TAG} from "../common/js/config";

const matutations = {
  //设置标签
  [types.SET_TAG](state, payload) {

    state.tag = payload
    localStorage.setItem(TAG,JSON.stringify(payload))
  },

  //修改当前选中标签
  [types.SET_SELECT_TAG](state, payload) {
    state.selectTag = payload
  },
  [types.TAG_TOTAL_MS](state,payload) {

  },
  //修改列表
  [types.SET_DATALIST](state, payload) {
    // if(payload == undefined) {
    //   state.dataList = {};
    // }
    //初始化
    if (state.dataList[year] === undefined) {
      state.dataList[year] = {};
    }
    if (state.dataList[year][month] === undefined) {
      state.dataList[year][month] = {}
    }
    if (state.dataList[year][month][day] === undefined) {
      state.dataList[year][month][day] = []
    }
    //单个数据存入
    if (payload[year] == undefined) {
      state.dataList[year][month][day].push(payload)
      localStorage.setItem(TIME_DATA_LIST, JSON.stringify(state.dataList))
    }
    //打开网页获取数据存入state
    else {
      state.dataList = payload
    }
  },
  //删除
  [types.SELETE_DATALIST](state, deleteItem){
    let {year, month, day} = deleteItem.startTime
    let index = state.dataList[year][month][day].indexOf(deleteItem)
    state.dataList[year][month][day].splice(index,1)
    if(state.dataList[year][month][day].length == 0) {
      delete state.dataList[year][month][day]
    }
    localStorage.setItem(TIME_DATA_LIST, JSON.stringify(state.dataList))
  }
}
export default matutations
