export function isPC() {
  let userAgent = navigator.userAgent;
  let Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod","BlackBerry"];
  let flag = true;
  for(let v = 0; v < Agents.length; v++) {
    if(userAgent.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
