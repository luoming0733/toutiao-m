<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchReslut } from '@/api/search'
export default {
  name: 'searchResult',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 15
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getSearchReslut({
          page: this.page,
          per_page: this.per_page, // 每页大小
          q: this.searchText // 查询关键词
        })
        console.log(data.data)
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.$toast('数据加载失败请重试')
        // console.log('数据加载失败请重试', err)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
