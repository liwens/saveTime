<template>
  <transition name="box">
    <div class="comfirm">
      <div class="background" @click="onclose"></div>
      <div class="comfirm-box" ref="box">
        <div class="icon">
          <i class="el-icon-information" v-if="type=== 'info'"></i>
          <i class="el-icon-circle-check" v-else></i>
        </div>
        <div class="title">{{title}}</div>
        <div class="message"></div>
        <div class="control">
          <button class="comfirmBtn btn" @click="oncomfirm">{{comfirmText}}</button>
          <button class="closeBtn btn" @click="onclose">{{closeText}}</button>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  export default {
    data() {
      return {
        Visible: this.visible
      }
    },
    props: {
      type: {
        type: String,
        default: 'info'
      },
      title: {
        type: String,
        default: '请传入信息'
      },
      comfirmText: {
        type: String,
        default: '确认'
      },
      closeText: {
        type: String,
        default: '取消'
      },
      message: {
        type:String,
        default: ''
      }
    },
    created() {
      let width = window.innerWidth;
      if (width < 400) {
//        this.$refs.box.style.width = '90%'
      }
    },
    methods: {
      oncomfirm() {
        this.$emit('comfirm',true)
      },
      onclose() {
        this.$emit('close', false)
      }
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  @import "../../common/scss/variable.scss";

  $color-hover: #1C86EE;
  $color-normal: #1874CD;
  $color-active: #104E8B;
  .comfirm {
    text-align: center;
    .background {
      left: 0;
      top: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.5;
    }
    .comfirm-box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff !important;
      width: 300px;
      border-radius: 3px;
      padding: 10px;
      box-shadow: 0 0 28px 0px rgba(0, 0, 0, 0.22);
      .title {
        font-size: $font-size-large-x;
        margin-bottom: 10px;
      }
      .icon {
        font-size: 30px;
        .el-icon-information {
          color: $color-normal;
        }
        .el-icon-circle-check {
          color: $color-success;
        }
      }
      & .control {
        .btn {
          padding: 10px 15px;
          /*background-color:#20a0ff;*/
          background-color: $color-normal;
          outline: none;
          border: none;
          border-radius: 3px;
          color: #fff;
          cursor: pointer;
          &:hover {
            background-color: $color-hover;
          }
          &:active {
            background-color: $color-active;
          }
        }
      }
    }
  }

  .box-enter-active,
  .box-leave-active {
    transition: all 0.3s;
  }

  .box-enter,
  .box-leave-to {
    opacity: 0;

  }
</style>
