<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        size="mini"
        round
        type="danger"
        class="edit-btn"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
        ></van-icon>
        <span
          class="text"
          slot="text"
          :class="{ active: index === activeIndex }"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <van-grid class="recomment-grid" :gutter="10">
      <van-grid-item
        icon="add-o"
        class="grid-item"
        v-for="channel in recommendChannele"
        :key="channel.id"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fiexdChannels: [0] // 不需要删除、编辑的频道
    }
  },
  created() {
    this.loadAllChannels()
  },

  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道数据失败')
      }
    },
    // 添加频道的事件函数
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // 数据持久化
      // 已登录接入线上接口
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('操作失败，请重试')
        }
      } else {
        // 未登录,本地存储
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 切换频道
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 删除频道项
        this.myChannels.splice(index, 1)
        // 如果要删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引
        // 参数2：要删除的个数，如果不指定，则从参数 1 开始一直删除
        if (index <= this.activeIndex) {
          // 让激活频道索引 - 1
          this.$emit('update-active', this.activeIndex - 1, true)
        }
      } else {
        // 非编辑状态，指向切换频道
        this.$emit('update-active', index, false)
      }
    },
    // 删除频道
    async deleteChannel(channel) {
      if (this.user) {
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('操作失败，请重试')
          console.log('操作失败' + err)
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannele() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中
      return this.allChannels.filter(channel => {
        // const channel = []
        // 数组的 find 方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0px !important;
      }
      .active {
        color: red;
        font-weight: 600;
      }
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recomment-grid {
    .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-add-o {
          font-size: 22px;
          line-height: 22px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
