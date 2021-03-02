<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-duration="1500"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
          ><van-cell
            v-for="(article, index) in list"
            :key="index"
            :title="article.title"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
        /></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/artic'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      timestamp: null,
      isreFreshLoading: false, // 控制下拉刷新的 Loading 状态
      refreshSuccessText: '' // 下来刷新成功提示的文本
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false
        this.error = true
      }
    },
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        const { results } = data.data
        this.list.unshift(...results)
        this.isreFreshLoading = false
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79.35vh;
  overflow-y: auto;
}
</style>
