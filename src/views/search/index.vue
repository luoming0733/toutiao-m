<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />

      <!-- 搜索结果 -->
      <search-result
        v-if="isResultShow"
        :search-text="searchText"
      ></search-result>

      <!-- 联想建议 -->
      <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
      ></search-suggestion>

      <!-- 搜索历史 -->
      <search-history v-else></search-history>
    </form>
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
export default {
  components: { searchHistory, SearchResult, SearchSuggestion },
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      isResultShow: false // 控制搜索结果的展示
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(searchText) {
      this.isResultShow = true
      this.searchText = searchText
      // this.$toast(searchText)
    },
    onCancel() {
      // this.isResultShow = false
      this.$toast('取消搜索')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
