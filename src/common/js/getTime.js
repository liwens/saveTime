let date = new Date();

export const year = format(date.getFullYear());

export const month = format((date.getMonth() + 1));

export const day = format(date.getDate())

function format(text) {
  text = Number(text)
  if(text< 10 && text!=0) {
    return `0${text}`
  }else{
    return text.toString();
  }
}
