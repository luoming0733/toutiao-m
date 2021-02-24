<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      value: 0
    }
  },
  methods: {
    onChange() {}
  }
}
</script>

<style lang="less"></style>
