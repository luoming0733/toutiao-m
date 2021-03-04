<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="mobile"
        v-model="user.mobile"
        clearable
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao shouji"></i>
      </van-field>
      <van-field
        name="code"
        v-model="user.code"
        clearable
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="nubmer"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao yanzhengma"></i>
        <template #button>
          <!-- 倒计时组件 -->
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            native-type="button"
            size="small"
            round
            @click="onSendSms"
            v-else
            >获取验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '18612345678',
        code: '246810'
      },
      // 登录表单的验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号码不能为空'
          },
          {
            pattern: /^0?(13|14|15|18)[0-9]{9}$/,
            message: '请输入正确手机号码'
          }
        ],
        code: [
          { required: true, message: '手机号码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit(values) {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证

      // 在组件中必须通过 this.$toast 来调用 Toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$toast.success('登录成功')
        // console.log('登录成功', data.data)
        this.$store.commit('setUser', data.data)
        this.$router.back()
        // console.log(data)
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4.根据响应结果处理后续操作
    },
    async onSendSms() {
      // 1. 校验手机号码
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log(err)
      }
      // 2. 验证通过显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送频繁,请稍后重试')
        } else {
          this.$toast('发送失败,请稍后重试')
        }
      }
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
    // width: 165px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
    background-color: #ededed;
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
