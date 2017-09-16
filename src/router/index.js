import Vue from 'vue'
import Router from 'vue-router'
import Panel from 'components/panel/panel'
import RecordList from "components/recordList/recordList"
import Report from 'components/report/report'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Panel',
      component: Panel
    },
    {
      path: '/recordlist',
      component:RecordList,
      children: [

      ]
    },
    {
      path: '/panel',
      component:Panel
    },
    {
      path: '/report',
      component: Report
    }
  ]
})
