<template>
  <div class="recordList">
    <div class="container">
      <my-table></my-table>
    </div>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import MyTable from '../my-table/my-table'
  export default {
    components: {
      MyTable
    },
    data() {
      return {

      }
    },
    computed: {
      showData() {
        let ret = [];
        for(let year in this.dataList) {
            for(let month in this.dataList[year]) {
              for(let day in this.dataList[year][month]) {
                this.dataList[year][month][day].forEach(function (item) {
                  ret.push(item)
                })
              }
            }
        }
        return ret
      },
      ...mapGetters([
        'dataList'
      ])
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .recordList {
    color: #ffffff;
  }
  .container{
    margin: 0 5px;


  }

  @media screen and (min-width: 700px){
    .container{
      width:65%;
      margin: 0 auto;
    }
  }
</style>
