import {format, timeToString} from "./util";
//私有方法
const [_ObjectIsEmpty] =[Symbol("_ObjectIsEmpty")];

const EMPTY = 0;
export default class timeObject {
  constructor() {
    this.startTime = {};
    this.endTime = {};
    this.tag = {};
    this.duration = 0;
    this.content = '';
    this.durationMs = 0;
  }

  start() {
    this.startTime = this.getNowTime();
    return this.startTime;
  }

  end() {
    this.endTime = this.getNowTime();
    this.countDuration();
    return this.endTime;
  }

  //计算时长
  countDuration() {
    let hasEndTimd = !this[_ObjectIsEmpty](this.endTime);
    if(this.startTime.msfrom1970 > this.endTime.msfrom1970){
    }

    if (hasEndTimd) {
      this.durationMs = this.endTime.msfrom1970 - this.startTime.msfrom1970
       this.duration = timeToString(this.durationMs);
    }else{
      return
    }

  }

  //校验数据是否为空
  verifyEmpty() {
    if (Object.keys(this.tag).length === EMPTY) {
      return ('tagNull')
    }
    if (this.content === '') {
      return ('contentNull')
    }
  }


  //获取当前时间
  getNowTime(options) {
    let ret = null;
    let date = new Date()
    if(options) {
      let {year,hour,month,day,min} = options;
      date = new Date(year,month,day,hour,min);
    }
    ret = {
      source: date,
      msfrom1970: date.getTime(),
      year: date.getFullYear(),
      month: format(date.getMonth() + 1),
      day: format(date.getDate()),
      week: date.getDay() ? date.getDay() : 7,
      hour: format(date.getHours()),
      minute: format(date.getMinutes()),
      second: format(date.getSeconds()),
      string_hour_min: `${format(date.getHours())} : ${format(date.getMinutes())}`,
    }
    return ret;
  }

  [_ObjectIsEmpty](obj) {
    if (obj.constructor === Object) {
      return Object.keys(obj).length === EMPTY;
    } else {
      return Error(`${obj} is not a object`)
    }
  }
  clear() {
    this.setStartTime({})
  }
  setContent(text) {
    this.content = text;
  }

  setTag(tag) {
    this.tag = tag
  }
  setStartTime(time) {
    this.startTime = time
  }
}
