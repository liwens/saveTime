//判断有没有传入的类名
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}

export function addClass(el, className) {
  //如果有classname则什么也不做
  if (hasClass(el, className)) {
    return
  }
  //将dom的类名分割成数组
  let newClass = el.className.split(' ')

  //数组添加新类名
  newClass.push(className)

  //将类名数组放入字符串，并覆盖dom的className
  el.className = newClass.join(" ")
}

export function removeClass(el, className) {
  if(hasClass(el, className)) {
    let newClass = el.className.split(' ')
    newClass.splice(newClass.indexOf(className), 1)
    el.className = newClass.join(" ")

   }else{
    new Error(`No find className: ${className} in Element` )
  }
}
