<template>
  <div class="my-container">
    <!-- 未登录头部 -->
    <div class="header not-login" v-if="!user" @click="$router.push('/login')">
      <div class="login-btn">
        <img class="mobile-img" src="~@/assets/mobile.png" alt />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 已登录头部 -->
    <div class="header user-info" v-else>
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button round size="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">8</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">66</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">88</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">88</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 单元格 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      title="退出登录"
      class="logout-cell"
      v-if="user"
      @click="onLogout"
      clickable
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登录
    onLogout() {
      this.$dialog
        .confirm({ title: '是否确认退出？' })
        .then(() => {
          // 清除登录状态
          this.$store.commit('setUser', '')
        })
        .catch(() => {
          // on cancel
        })
    },
    // 加载用户信息
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        // console.log(data)
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .base-info {
    height: 231px;
    padding: 76px 32px 23px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        margin-right: 23px;
        border: 4px solid #fff;
      }
      .name {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .data-stats {
    // height: 130px;
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      margin-bottom: 9px;
      i.toutiao {
        font-size: 45px;
      }
      .shoucang {
        color: #eb5253;
      }
      span.text {
        font-size: 28px;
      }
      .lishi {
        color: #ff9d1d;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
    font-size: 30px;
    margin-top: 9px;
  }
}
</style>
