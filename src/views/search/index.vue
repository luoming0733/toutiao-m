<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        class="search-form"
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
      <search-history
        v-else
        :search-histoies="searchHistoies"
        @clear-search-histories="searchHistoies = []"
        @search="onSearch"
      ></search-history>
    </form>
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  components: { searchHistory, SearchResult, SearchSuggestion },
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistoies: getItem('TOUTIAO_SEARCH_HISTOIES') || []
    }
  },
  created() {},
  mounted() {},
  watch: {
    searchHistoies(val) {
      setItem('TOUTIAO_SEARCH_HISTOIES', val)
    }
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录,要求：不要有重复的历史记录，最新的排在最前面
      const index = this.searchHistoies.indexOf(val)
      if (index !== -1) {
        this.searchHistoies.splice(index, 1)
      }
      this.searchHistoies.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
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
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
