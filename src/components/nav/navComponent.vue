<template>
  <div class="nav">
    <div class="logo">
      <template v-if="path == '/'">
        时间 <a href="javascript:;" @click="toList">去哪了？ </a>
      </template>
      <template v-if="path == '/recordlist' || path == '/report'">
        <a href="javascript:;" @click="toPanel">返回</a>
        <a href="javascript:;" @click="toList" v-if="path == '/report'">列表</a>
        <a href="javascript:;" @click="toReport">报告</a>
      </template>
    </div>
  </div>
</template>

<script>

  export default {
    methods: {
      toList() {
        this.$router.push('recordlist')
      },
      toPanel() {
        this.$router.push('/')
      },
      toReport() {
        this.$router.push('report')
      }
    },
    computed: {
      path() {
        return this.$route.path;
      }
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss'>
  @import './../../common/scss/variable.scss';

  .nav {
    display: flex;
    position: fixed;
    justify-content: center;

    left: 0;
    top: 0;
    background-color: $color-background-d;
    border-bottom: 2px solid $color-background;
    color: #fff;
    box-shadow: 0 15px 10px -10px rgba(0, 0, 0, .22);
    width: 100%;
    line-height: 45px;
    ul {
      justify-content: center;
      li {
        display: inline-block;
      }
    }
    .logo {
      a{
        display: inline-block;
        padding: 0 5px;
      }
    }
  }
</style>
