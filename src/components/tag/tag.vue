<template>
  <div class="tags">
    <el-tag
      :key="tag.name"
      v-for="tag in tagCopy"
      :closable="close"
      :type="tag.type"
      class="tag"

      @click.native="onselectTag(tag)"
      :close-transition="false"
      @close="handleClose(tag)"
    >
      {{tag.name}}
    </el-tag>
    <!--输入框-->
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      icon="plus"
      @keyup.enter.native.prevent="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>

    <transition name="addBtn">
      <el-button v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput" placeholder="不允许为空"
                 v-show="close">+ 新标签
      </el-button>
    </transition>

    <Comfirm @close="onclose" @comfirm="oncomfirm" v-if="comfirmVisible" title="将删除该标签" comfirmText="删除标签"
             type="info"></Comfirm>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {deepClone} from 'common/js/util'
  import Comfirm from 'base/comfirm/comfirm'
  import {SAME} from 'common/js/config'

  export default {
    components: {
      Comfirm
    },
    props: {
      close: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputVisible: false,
        inputValue: '',
        //tag的副本，避免直接修改vue的值
        tagCopy: [],
        comfirmVisible: false,
        //删除标签时，存放点击的标签数据
        deletetagDom: null
      }
    },
    computed: {
      ...mapGetters([
        'tag',
        'selectTag'
      ])
    },
    methods: {
      //关闭对话框
      onclose() {
        this.comfirmVisible = false
      },
      //对话框点击确认，删除标签
      oncomfirm() {
        if (this.deletetagDom) {
          let ret = this.tagCopy;
          ret.splice(this.tag.indexOf(this.deletetagDom), 1);
          this.setTag(ret)
          this.deletetagDom = null;
          this.comfirmVisible = false;
          this.$message({
            type: 'success',
            message: '标签删除成功!'
          });
        }
      },
      //打开对话框
      handleClose(tag) {
        this.deletetagDom = tag
        this.comfirmVisible = true;
      },


      //按添加新标签，显示输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //确认添加新标签
      handleInputConfirm() {
        let inputValue = this.inputValue.trim();
        if (inputValue == '') {
          return
        }
        let payload = this.tag.concat({
          'name': inputValue,
          'type': '',
          'totalMs': 0
        })
        this.setTag(payload)
        this.inputVisible = false;
        this.inputValue = '';
        this.$emit('inputTagComplete');
        this.$message({
          type: 'success',
          message: '标签添加成功!'
        });
      },
      //选中标签
      onselectTag(tag) {
        //已选中则取消选中
        if (tag.type == 'primary') {
          tag.type = '';
          return
        }
        //设置高亮
        this.tagCopy.forEach(function (item) {
          item.type = ''
          if (item == tag) {
            item.type = 'primary'
          }
        })
        //如果把传入的参数tag直接赋值给selectTag, selectTag就会指向tag的地址,导致上面的两项操作会修改state而报错。
        //localeCompare比较中文name，将state的tag与selectTag建立联系
        this.tag.forEach((item) => {
          if (item.name.localeCompare(tag.name) === SAME) {
            this.setSelectTag(item)
            return
          }
        })
      },
//      //获取tag数据
//      _getTagDatafromLocalStorage() {
//        let data = []
//        if (localStorage.getItem(tag)) {
//          let data = JSON.parse(localStorage.getItem(tag));
//          this.settag(data)
//
//        } else {
//          let tag = [
//            {
//              name: '休息',
//              type: ''
//            },
//            {
//              name: '工作',
//              type: ''
//            },
//            {
//              name: '学习',
//              type: ''
//            }
//          ]
//          localStorage.setItem(tag,JSON.stringify(tag))
//          this.setSelectTag(tag)
//        }
//      },
      ...mapMutations({
        setTag: 'SET_TAG',
        setSelectTag: 'SET_SELECT_TAG'
      })
    },
    mounted() {
      //初始化tagCopy
      this.tagCopy = deepClone(this.tag)
      this.$nextTick(function () {
      })
    },
    watch: {
      //监听tanName变化
      tag(value) {
        //深拷贝，避免浅拷贝导致一系列问题
        this.tagCopy = deepClone(value)
      }
    }

  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/mixin.scss";
  /*@import "./node_modules/vue-msgbox/lib/vue-msgbox.css";*/
  .tags {
    width: 100%;
    @include fix;
    .tag {
      float: left;
      cursor: pointer;
      margin: 0 3px;
    }
    .button-new-tag {
      float: right;
    }
  }

  .addBtn-enter-active,
  .addBtn-leave-active {
    transition: 0.4s all cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }

  .addBtn-enter,
  .addBtn-leave-to {
    opacity: 0;
    transform: translate3d(-200px, 0, 0);
  }
</style>
