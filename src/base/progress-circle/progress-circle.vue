<template>
  <div class="progress-circle">
    <svg :width="width" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/sve">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <!--stroke-dasharray 是根据R计算的圆周长-->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <span ref="context"><slot></slot></span>
  </div>
</template>

<script>
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      width: {
        type: Number,
        default: 32
      },
      percent: {
        type: Number,
        default: 0
      }

    },
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    },
    watch: {
      percent(val) {
      }
    },
    mounted() {
      this.$refs.context.style.fontSize = this.width / 6 + 'px'
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  @import 'src/common/scss/variable.scss';

  .progress-circle {
    position:relative;
    display: inline-block;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
    span{
      text-align: center;
      padding:0;
      margin:0;
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -60%);
    }
  }
</style>
