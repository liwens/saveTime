export function format(text) {
  text = Number(text)
  if(text< 10 && text!=0) {
    return `0${text}`
  }else{
    return text.toString();
  }
}

export function max(value) {
  return Math.max.apply(Math,value)
}

export function min(value) {
  return Math.min.apply(Math, value)
}

export function zeroObj(target){
  if(target.constructor = Object){
    for( let item in target) {
      target[item] = 0
    }
  }else {
    new Error('no is object')
  }
  return target
}

//深拷贝方法
export function deepClone(initObj, findObj) {

  let obj = findObj || (initObj.constructor === Array ? [] : {});
  for(var  item in initObj) {

    if(typeof initObj[item] === 'object'){
      obj[item] = initObj[item].constructor === Array ? [] : {}
      deepClone(initObj[item], obj[item])
    }else{
      obj[item] = initObj[item]
    }
  }
  return obj;
}

export function timeToString(time) {
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

  if(day > 0) {
    return `${day}天 ${hour}小时 ${minute}分钟 ${second}秒`
  }else if(hour > 0){
    return `${hour}小时 ${minute}分钟 ${second}秒`
  }else{
    return `${minute}分钟 ${second}秒`
  }
}


