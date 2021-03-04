<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDleteShow">
        <span @click="$emit('clear-search-histories', [])">全部删除</span>
        &nbsp;
        <span @click="isDleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistoies"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchHistory',
  data() {
    return {
      isDleteShow: false // 控制删除显示状态
    }
  },
  props: {
    searchHistoies: {
      type: Array,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDleteShow) {
        // 删除状态
        this.searchHistoies.splice(index, 1)
      } else {
        // 进入搜索流程
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
