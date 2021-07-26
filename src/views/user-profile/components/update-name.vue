<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('cancel')"
      @click-right="$emit('confirm', 'name', inputName)"
    >
    <!--$emit('confirm', 'name', inputName)传递两个参数 字段名 字段值 -->
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
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateName',
  components: {},
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      inputName: this.name
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
