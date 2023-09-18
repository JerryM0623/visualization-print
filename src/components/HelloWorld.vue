<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8">
        <div class="grid-content" style="width: 50%;">
          <el-input v-model="canvastext" placeholder="请输入内容"></el-input>
        </div>
      </el-col>
      <!-- 打印内容区域 -->
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <!-- 画布区域 -->
          <div id="printArea" :style="{ width, height } " style="position: relative;">
            <canvas :style="{ backgroundImage }" class="canvasimg" id="canvasId" canvas-id="canvasId" :width="width"
              :height="height">
            </canvas>
            <!-- 拖拽区域 -->
            <VueDragResize @dragging="onDragging" :parent-limitation="true" :w="50" :h="100" :z="1" :x="0" :y="0">
              <div class="resize" :class="{ 'vertical-text': anyway }" :style="{ fontSize: this.slide + 'px' }">
                {{ canvastext }}
              </div>
            </VueDragResize>
          </div>
        </div>
      </el-col>
      <!-- 编辑区域 -->
      <el-col :span="8">
        <div class="grid-content bg-purple3">
          <el-card class="box-card">
            <el-button type="primary" class="elbutton" plain @click="addimg">添加背景图片</el-button>
            <input v-show="false" type="file" name="file" id="file" ref="addimginput" />
            <!-- 字体大小缩放 -->
            <div class="block" style="padding-top: 10px;">
              <span class="demonstration">设置字体大小</span>
              <el-slider v-model="slide" :min="12" :max="40"></el-slider>
            </div>
            <el-switch style="padding-bottom: 10px;" v-model="anyway" active-text="文本竖向" inactive-text="文本横向">
            </el-switch><br>
            <!-- 完成按钮 -->
            <el-button type="primary" class="elbutton" plain @click="finish">完成</el-button>
            <!-- 打印按钮 -->
            <el-button type="primary" class="elbutton" v-print="print" plain>打印</el-button>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import print from 'vue-print-nb'
import VueDragResize from 'vue-drag-resize'
export default {
  name: 'HelloWorld',
  directives: {
    print
  },
  data() {
    return {
      width: '400px',
      height: '900px',
      ctx: null,//2d上下文对象
      slide: 25,//文本默认字体
      canvastext: '',//文本内容
      backgroundImage: 'none',
      anyway: true,//文本竖向
      print: {
        id: "printArea", //打印的区域的id名
        popTitle: "", // 打印配置页上方标题
        extraHead: "", //最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
        extraCss: "",
      },
      //canvas默认位置
      default: {
        left: null,
        top: null
      }
    }
  },
  mounted() {
    this.getCanvasText()
  },
  components: {
    VueDragResize
  },
  methods: {
    //拖拽元素时触发
    onDragging(move) {
      this.default.left = move.left
      this.default.top = move.top
      this.default.width = move.width
      this.default.height = move.height
    },
    //获取唯一标识符
    getCanvasText() {
      let canvas = document.getElementById('canvasId')
      //获取上下文对象
      let gettext = canvas.getContext('2d')
      if (!gettext) {
        this.$message({
          type: 'error',
          message: '获取上下文失败',
          duration: 2000
        })
        return
      }
      //2d上下文
      this.ctx = gettext
    },
    //提示复用
    showMessage(type, message) {
      if (this.messageInstance) {
        this.messageInstance.close()//关闭一个已打开的文件
      }
      this.messageInstance = this.$message({
        type,
        message,
        duration: 2000,
      })
    },
    //上传背景图片
    addimg() {
      this.$refs.addimginput.click()//模拟点击事件
      //添加事件监听
      this.$refs.addimginput.addEventListener('change', (e) => {
        // console.log(e);
        const file = e.target.files[0]
        // console.log(file);

        if (file) {
          // console.log(file);
          const fileName = file.name;
          const fileType = file.type;

          // 校验文件类型是否为图片
          if (fileType.startsWith('image/')) {
            // 获取文件扩展名  拆分文件名.png   移除最后一个元素  小写
            const fileExtension = fileName.split('.').pop().toLowerCase();

            // 校验是否为支持的图片格式
            if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
              this.showMessage('success', '恭喜你，选择了正确的图片格式！')
              const reader = new FileReader()//读取文本文件和二进制文件
              reader.onload = () => {
                this.backgroundImage = `url(${reader.result})`
                this.$refs.addimginput.value = '';
              }
              reader.onerror = () => { }
              reader.readAsDataURL(file)
            } else {
              this.showMessage('error', '图片格式仅支持 jpg 和 png 哦！')
              this.$refs.addimginput.value = '';
            }
          } else {
            this.showMessage('error', '请选择 jpg 或 png 格式的文件！')
            this.$refs.addimginput.value = '';
          }
        }

      })
    },
    //完成按钮
    finish() {
      this.$nextTick(() => {
        const location = {
          left: this.default.left,
          top: this.default.top
        }

        //判断竖向还是横向
        this.anyway ? this.Vertical({
          location,//位置
          text: this.canvastext,//文本内容
          fontSize: this.slide//文字大小
        }) : this.Transverse({
          location,//位置
          text: this.canvastext,//文本内容
          fontSize: this.slide//文字大小
        })
      })
    },
    //竖向
    Vertical(val) {
      const { fontSize = 25, fontFamily = 'Microsoft YaHei', fontColor = '#000000',
        location = { left: 0, top: 0 }, text = '' } = val

      if (this.ctx) {
        this.ctx.fillStyle = fontColor
        this.ctx.font = `${fontSize}px ${fontFamily}`

        //拆分文本
        const decompose = text.split('')

        //逐个绘制
        let left = location.left + (this.default.width / 3.5)
        let top = location.top + (this.default.height / 3.5)

        //遍历文本
        for (let i = 0; i < decompose.length; i++) {
          this.ctx.fillText(decompose[i], left, top)
          top += fontSize + 5
        }
      } else {
        this.$message({
          type: 'error',
          message: '获取上下文失败',
          duration: 2000
        })
      }
    },
    // 横向
    Transverse(val) {
      const { fontSize = 25, fontFamily = 'Microsoft YaHei', fontColor = '#000000',
        location = { left: 0, top: 0 }, text = '' } = val
      if (this.ctx) {
        this.ctx.fillStyle = fontColor
        this.ctx.font = `${fontSize}px ${fontFamily}`
        this.ctx.fillText(text, location.left, location.top)
      } else {
        this.$message({
          type: 'error',
          message: '获取上下文失败',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style media="print" lang="scss">
@page {
  size: auto;

}

@media print {
  html {
    zoom: 76%;
    /* 设置打印页面的缩放，大小 */
    margin: 0 auto;
  }
}

.resize {
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.3);
  text-align: center;
  line-height: 47px;
}

//文本横竖向
.vertical-text {
  writing-mode: vertical-lr;
  text-orientation: upright;
  white-space: nowrap;
}

.el-row {
  /* padding: 20px; */
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.canvasimg {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.bg-purple3 {
  width: 70%;

}

// .grid-content {
//   border-radius: 4px;
//   min-height: 100%;
// }
</style>
