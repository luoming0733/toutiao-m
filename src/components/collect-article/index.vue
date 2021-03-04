<template>
  <!-- <van-button icon="star-o"></van-button> -->
  <van-icon
    :color="value ? '#ffa500' : '#777777'"
    :name="value ? 'star' : 'star-o'"
    @click="onCollectClick"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/artic'
export default {
  name: 'ClloectArticleIndex',
  components: {},
  props: {
    value: {
      type: Boolean,
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
    async onCollectClick() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
      } catch (err) {
        this.$toast.fail('操作失败,请重试!')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
