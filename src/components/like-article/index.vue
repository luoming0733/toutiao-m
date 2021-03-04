<template>
  <van-icon
    :color="value === 1 ? '#ffa500' : '#777777'"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onLikeClick"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/artic'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: [Number, Boolean],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLikeClick() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: false // 是否禁止背景点击
      })
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
          // 点赞文章
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败,请重试!')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
