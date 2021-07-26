<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登陆表单   -->
    <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form
     :show-error="false"
      :show-error-message="false"
      validate-first
       @submit="onLogin"
      @failed="onFailed"
      ref="login-form"
       >
      <van-field
        v-model="user.mobile"
        name="mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- <i slot="left-icon" class="toutiao toutiao-shouji"></i> -->
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <template #button>
          <!-- time 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="mini"
            type="default"
            native-type="button"
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant' // Toast的使用需要单独加载,组件内调用可以不需要导入
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
       user: {
        mobile: '13466887489', // 手机号
        code: '321210' // 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false, // 是否展示倒计时 短信发送后秒的展示
      isSendSmsLoading: false // 发送短信中的loading
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    async onLogin() {
        console.log('login')
      // Toast.loading({
      this.$toast.loading({
        message: '登录中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      //  1. 获取表单数据
      //  2. 表单验证
      //  3. 提交表单那请求记录
      try {
        const { data } = await login(this.user)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        // 4. 处理响应结果
        this.$toast.success('登录成功')
       // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
        this.$store.commit('setUser', data.data)
        // 登陆成功，跳转会原来的页面
        // back 的方式不严谨 ，后面讲
        this.$router.back()
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed (error) {
      console.log('验证失败', error)
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    // 发送验证码之前需要校验手机号是否有效，而不是校验整个表单。
    // 通过查阅文档可以看到 Form 组件的实例方法 validate 可以用来手动触发表单验证，并且支持传入 name 来验证单个表单项。
    // 给 Form 添加 ref 属性用来获取组件实例
    // 给 Field 添加 name 属性用来验证单个表单项
    // 监听发送按钮的点击事件
    // 由于 Form 中的任何按钮点击都会触发表单的默认提交行为，所以这里使用 .prevent 修饰符阻止默认行为
    async onSendSms() {
      try {
        // 1 校验手机号
        await this.$refs['login-form'].validate('mobile')
        // 2. 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
        // 3.发送验证码 显示倒计时
        await sendSms(this.user.mobile)
        // 短信发出去了,显示倒计时，关闭发送按钮
        this.isCountDownShow = true // 倒计时结束 -> 隐藏倒计时，显示发送按钮（监视倒计时的 finish 事件处理）
        this.$toast('发送成功')
      } catch (err) {
          console.log(err)
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
        // 发送失败，显示发送按钮，关闭倒计时
        this.isCountDownShow = false
      }
      // 无论发送验证码成功还是失败，最后都要关闭发送按钮的 loading 状态
      this.isSendSmsLoading = false
    }

  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: fit-content;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
