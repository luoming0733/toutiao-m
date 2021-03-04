<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    color="#3296fa"
    type="info"
    :loading="loading"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    color="#3296fa"
    :loading="loading"
    round
    size="small"
    @click="onFollow"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: '',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false // loading 状态显示与否
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 关注和取消关注
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          await deleteFollow(this.userId)
        } else {
          await addFollow(this.userId)
        }
        // 更新视图状态
        // this.isFollowed = !this.isFollowed
        this.$emit('update-is_followed', !this.isFollowed)
        this.$toast(this.isFollowed ? '关注成功' : '取消关注')
      } catch (err) {
        console.log('请求失败：' + err)
        let message = '操作失败,请重新再试'
        if (err.response && err.response.status === 400) {
          message = '不能关注自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
