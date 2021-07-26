<template>
<!-- Wrap the image or canvas element with a block element (container) -->
<div>
  <img
    ref="image"
    :src="src"
  >
</div>
</template>

<script>
// 图片裁切工具https://fengyuanchen.github.io/cropperjs/
// https://github.com/fengyuanchen/cropperjs/blob/master/README.md
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'AvatarCropper',
  components: {},
  props: {
    src: {
      type: [String, Object],
      required: true
    },
    cropperOptions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // Dom操作 获取需要裁切的图片
    // const image = document.getElementById('image');
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      // crop (event) {
      //   // 裁切框移动时的坐标信息打印 不需要
      //   console.log(event.detail.x)
      //   console.log(event.detail.y)
      //   console.log(event.detail.width)
      //   console.log(event.detail.height)
      //   console.log(event.detail.rotate)
      //   console.log(event.detail.scaleX)
      //   console.log(event.detail.scaleY)
      // },
      viewMode: 1, // 查看模式
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例
      // autoCropArea: 1, // 自动区域
      cropBoxMovable: false, // 不允许截图区域移动
      cropBoxResizable: false, // 不允许截图区域缩放
      modal: true, // 显示阴影区域
      background: false, // 关闭背景
      movable: true, // 允许移动
      // movable: false
      ...this.cropperOptions
    })
  },
  methods: {
    getCroppedBlob () {
      return new Promise(resolve => {
        // 获取裁切的图像
        this.cropper.getCroppedCanvas().toBlob(
          (blob) => { resolve(blob) })
      })
    }
  }
}
</script>

<style scoped lang="less">
// @import "~cropperjs/dist/cropper.css";
/* Ensure the size of the image fit the container perfectly */
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
div{
  height: 100%;
  background-color: black;
}
</style>
