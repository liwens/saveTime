# 时间去哪了
> vue + vue-router + vuex + localStorage + webpack开发的时间管理软件 
## 初衷
  一：开发这个项目，是为了了解自己的时间分配情况，强化时间概念。
  二：刚学完vue，借此项目熟悉vue使用操作
  三：积累vue-cli模块化，工程化的开发经验。
## 功能
* 标签功能：每项记录能贴上标签，比如“背单词”，“娱乐”。 根据保存的时间戳统计每项标签总的时间。<br>
* 时间不会断： 点击开始后，可关闭页面，localstorage会记录下时间戳，再次打开时，可以接上关闭前的时间。<br>
* 列表展示数据

## 项目信息
###  数据存储和读取
  数据存储使用localStorage存储，打开页面的时候，在created钩子函数获取localStorage数据并使用JSON.parse()解析成对象。存储时JSON.stringify()将对象转成字符串。
###  数据的格式
 <pre>
  {2018（年）: {
    01（月）：{
      1（日）：[{记录}，{记录}]，
      2（日）：[{记录}，{记录}]
      ...
    },
    02（月）：{}
    03（月）：{}
    ...
 }}
  </pre>
  
   这样设计的目的是，获取数据时，可以使用Date对象API拿到当天的日期字符串，根据键名拿数据。避免了循环。
   `data[Date().getFullYear][Date().getMonth][Date().getDate]`<br>
 项目中数据格式截图
 ![图片](https://images2017.cnblogs.com/blog/943101/201801/943101-20180110235859113-21866244.png)
### es6面向对象
在上面的截图可以看到，开始时间和结束时间都是一个对象，里面保存了时间戳，时间戳转换的字符串等信息
![图片](https://images2017.cnblogs.com/blog/943101/201801/943101-20180111005427051-2000831302.png)

我用es6的class语法糖封装了一个对象timeObject，使用timeObject.start()即可拿到截图中的数据。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 预览
![效果](https://github.com/Lijinwen1994/saveTime/blob/master/src/common/image/time1.gif?raw=true)

[点击查看](http://www.lijinwen.cn/time/)
