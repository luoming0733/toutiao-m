<template>
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择生日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      try {
        await updateUserProfile({
          birthday: this.currentDate
        })
        this.$emit('input', currentDate)
        this.$emit('close')
        this.$toast('修改生日成功!')
      } catch (err) {
        this.$toast.fail('修改生日失败,请重试!')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
