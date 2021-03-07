<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggestions" :key="index">
      <div
        slot="title"
        @click="$emit('search', text)"
        v-html="highlight(text)"
      ></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
import { debounce } from 'lodash'
export default {
  name: 'searchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  created() {},
  mounted() {},
  watch: {
    searchText: {
      // handler 函数语法是固定的!!!
      // handler(searchText) {
      // console.log(searchText)
      // this.loadSearchSuggestions(searchText)
      // },

      // 做防抖处理
      handler: debounce(function(value) {
        this.loadSearchSuggestions(value)
      }, 800),
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions() {
      try {
        const { data } = await getSearchSuggestions(this.searchText)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取数据失败, 请稍后重试')
      }
    },
    // 添加高亮处理方法
    highlight(text) {
      const highlightStr = `<span style="color: #3296fa">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less"></style>
