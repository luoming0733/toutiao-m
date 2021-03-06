<template>
  <div class="comment-replay">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>

    <!-- 评论回复列表 -->
    <van-cell title="全部回复" />
    <comment-list :source="comment.com_id" type="c" />
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list.vue'
export default {
  name: '',
  components: { CommentItem, CommentList },
  props: {
    comment: {
      type: Object,
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
  methods: {}
}
</script>

<style scoped lang="less"></style>
