<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="明日头条">
      <van-icon slot="left" name="arrow-left" @click="$router.back()" />
    </van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注和取消组件 -->
          <follow-user
            :is-followed="article.is_followed"
            class="follow-btn"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
          ></follow-user>
        </van-cell>

        <!-- 文章内容 -->
        <div
          ref="article-content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          class="comment-list"
          :list="commentList"
          :source="article.art_id"
          @replay-click="onRplayClick"
          @onload-success="totalCommentCount = $event.total_count"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 评论组件 -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-badge :content="totalCommentCount">
            <van-icon name="comment-o" color="#777" />
          </van-badge>
          <!-- 收藏 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>
          <!-- 点赞 -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>
          <!-- 转发 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- 发布评论的弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadingAgain"
          >点击重试</van-button
        >
      </div>
    </div>
    <!-- 评论回复 -->
    <van-popup v-model="isReplayShow" position="bottom" style="height:90%">
      <comment-replay
        :comment="currentComment"
        @close="isReplayShow = false"
      ></comment-replay>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/artic.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReplay from './components/comment-replay'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReplay
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true,
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0, // 评论数量
      isPostShow: false,
      commentList: [], // 评论列表
      isReplayShow: false, // 回复评论
      currentComment: {} // 点击回复的评论项
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    async loadArticle() {
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        this.article = data.data
        setTimeout(() => {
          this.previewImage()
        })
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // console.log('数据加载失败', err)
      }
      this.loading = false
    },
    loadingAgain() {
      this.loadArticle()
    },
    // 预览图片
    previewImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []

      imgs.forEach((item, index) => {
        images.push(item.src)

        item.onclick = () => {
          ImagePreview({
            images: images,
            startPosition: index
          })
        }
      })
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      this.totalCommentCount++
      this.commentList.unshift(data.new_obj)
    },
    onRplayClick(comment) {
      this.isReplayShow = true // 显示评论回复弹出层
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.page-nav-bar {
  .van-icon {
    font-size: 30px;
  }
}
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-badge {
      top: 16px;
      font-size: 8px;
    }
    .van-icon {
      font-size: 40px;
    }
    /deep/ .badge-info {
      font-size: 16px;
      .van-badge {
        font-size: 16px;
        top: -2px;
      }
    }
  }
}
</style>
