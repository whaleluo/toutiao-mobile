<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell-group>
      <van-cell  class="avatar-cell"  title="头像" is-link  @click="onShowFile">
        <!-- @click="$refs.file.click()" -->
        <van-image
          round
          class="avatar"
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link @click="onEditNameShow" />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isEditGenerShow = true"/>
      <van-cell title="生日" :value="user.birthday" is-link  @click="isEditBirthdayShow = true"/>
    </van-cell-group>

     <!-- 修改昵称 -->
    <van-popup
      style="height: 100%;"
      class="intro-popup"
      v-model="isEditNameShow"
      position="bottom"
      get-container="body"
    >
    <!-- @opened="$refs.name.focus()" -->

      <!-- <van-nav-bar
        title="昵称"
        left-text="取消"
        right-text="完成"
        @click-left="isEditNameShow = false"
        @click-right="onNameConfirm()"
      >
      </van-nav-bar>
      <div class="intro-field-wrap">
        <van-field
          v-model="inputName"
          rows="2"
          autosize
          type="textarea"
          maxlength="7"
          placeholder="请输入昵称"
          show-word-limit
          ref="name"
          id="name"
        />
      </div> -->
      <UpdateName :name="inputName"  @cancel="onEditNameClose" @confirm="onNameConfirm"/>

    </van-popup>
    <!-- /修改昵称 -->
      <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenerShow"
      position="bottom"
      get-container="body"
    >
      <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="isEditGenerShow = false"
        :default-index="user.gender"
        @change="onPickerChange"
        @confirm="saveProfile('gender', selectedGender)"
      />
    </van-popup>
    <!-- <van-action-sheet
      v-model="isEditGenerShow"
      :actions="actions"
      @select="onGenerSelect"
      cancel-text="取消"
    /> -->
    <!-- /修改性别 -->
     <!-- 修改生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        confirm-button-text="完成"
        @confirm="onBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- /修改生日 -->

    <!-- 选择图像 接受只能是图片accept="image/*" -->
    <!-- @change="onFileChange" 图片选择后展示图片预览框
        但是选择相同的图片第二次不会再触发。
        解决：this.$refs.file.value = '' 每次change事件结束后清除file value
    -->
       <input
        type="file"
        hidden
        ref="file"
        accept="image/*"
        @change="onFileChange"
      >
    <!-- 上传头像预览裁切 -->
    <van-popup
      v-model="isPreviewPhotoShow"
      style="height: 100%;"
      position="bottom"
      class="photo-update"
    >
      <div class="crop-bottom">
        <span @click="isPreviewPhotoShow = false">取消</span>
        <span @click="onPhotoConfirm">完成</span>
      </div>
        <img-cropper
          v-if="isPreviewPhotoShow"
          :src="previewImages[0]"
          ref="img-cropper"
        />
      <!-- <van-image-preview
        v-model="isPreviewPhotoShow"
        :images="previewImages"
      >
        <van-nav-bar class="preview-header"
          slot="cover"
          left-text="取消"
          right-text="确定"
          @click-left="isPreviewPhotoShow = false"
          @click-right="onUpdatePhoto"
        />
      </van-image-preview> -->
    </van-popup>

    <!-- /上传头像预览 -->
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserProfile,
  updateUserPhoto
} from '@/api/user'
import globalBus from '@/utils/global-bus'
import dayjs from 'dayjs'
import ImgCropper from '@/components/img-cropper'
import UpdateName from './components/update-name'
export default {
  name: 'UserProfile',
  components: { ImgCropper, UpdateName },
  props: {},
  data() {
    return {
      user: {},
      isEditNameShow: false,
      isNameShow: false,
      inputName: '',
      isEditGenerShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false,
      currentDate: new Date(),
      minDate: new Date(1970, 1, 1),
      isPreviewPhotoShow: false,
      previewImages: [],
      previewImage: '',
      columns: ['男', '女'],
      selectedGender: 0
}
  },
  computed: {},
  watch: {},
  created() {
     this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onEditNameShow () {
      this.inputName = this.user.name
      this.isEditNameShow = true
    },
    onEditNameClose () {
      this.isEditNameShow = false
    },
     onPickerChange (picker, value, index) {
      this.selectedGender = index
    },
     onShowFile () {
      this.$refs.file.click()
    },
    onFileChange () {
      // this.user.photo = window.URL.createObjectURL(this.$refs.file.files[0])
      const fileBlobObj = URL.createObjectURL(this.$refs.file.files[0])
      // 清空数组
      this.previewImages = []
      // 添加预览图片
      this.previewImages.push(fileBlobObj)
      // this.previewImage = fileObj
      // 显示预览
      this.isPreviewPhotoShow = true
      // 解决选择相同文件不触发，手动清空file value
      this.$refs.file.value = ''
    },
    async saveProfile (field, value) {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast.success('保存成功')
        this.user[field] = value
        globalBus.$emit('user-update')
        this.isEditGenerShow = false
      } catch (err) {
        this.$toast.success('保存失败')
        return Promise.reject(err)
      }
    },
     // 接收两个参数 字段名 字段值
     async onNameConfirm (name, value) {
      try {
        // 请求更新
        await this.saveProfile('name', value)
        // 更新视图
        this.user.name = value
        // 关闭弹层
        this.isEditNameShow = false
      } catch ({ response }) {
        if (response.status === 400) {
          this.$toast.fail('昵称必须在1-7个字符之间')
        } else if (response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    },
    async onGenerSelect (item) {
      // 请求更新
      await this.saveProfile('gender', item.value)
      // 更新视图
      this.user.gender = item.value
      // 关闭弹层
      this.isEditGenerShow = false
    },
    async onBirthdayConfirm (value) {
      const birthday = dayjs(value).format('YYYY-MM-DD')
      // 请求更新
      await this.saveProfile('birthday', birthday)
      // 更新视图
      this.user.birthday = birthday
      // 关闭弹层
      this.isEditBirthdayShow = false
    },
    async onUpdatePhoto () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        // 构造包含文件的表单数据对象
        const fd = new FormData()
        // const fileObj = this.$refs.file.files[0]
        const fileObj = this.previewImages[0]
        fd.append('photo', fileObj)
        // 请求更新
        await updateUserPhoto(fd)
        // 更新视图
        // 为了解决file change后相同文件不触发input file 的值已清空，直接使用previewImages中的值
        // this.user.photo = URL.createObjectURL(fileObj)
        this.user.photo = this.previewImages[0]
        // 关闭图片预览
        this.isPreviewPhotoShow = false
        this.$toast.success('保存成功')
        // globalBus.$emit('user-update')
      } catch (err) {
        console.log(err)
        this.$toast.success('保存失败')
      }
    },
    async onPhotoConfirm () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        // 构造包含文件的表单数据对象
        const fd = new FormData()
        const blob = await this.$refs['img-cropper'].getCroppedBlob()
        console.log(blob)
        // const fileObj = this.file.files[0]
        fd.append('photo', blob)
        // 请求更新
        // await updateUserPhoto(fd)
        // 更新视图
        this.user.photo = URL.createObjectURL(blob)
        // 关闭图片预览
        this.isPreviewPhotoShow = false
        this.$toast.success('保存成功')
        globalBus.$emit('user-update')
      } catch (err) {
        console.log(err)
        this.$toast.success('保存失败')
      }
    }
  }

}
</script>
<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .avatar {
      width: 60px;
      height: 60px;
    }
  .crop-bottom{
    display: flex;
    justify-content: space-around;
    z-index: 9;
    width: 100%;
    span{
      color: rgb(73, 142, 233);
      font-size: 37px;
    }
  }
  .preview-header{
        background-color: rgba(0,0,0,.9);;
  }
  .preview-header::after{
        border:none !important

  }
  /deep/.van-image-preview__cover{
    width: 100%;
  }
  .photo-update{
    background-color: black;
  }
}

</style>
