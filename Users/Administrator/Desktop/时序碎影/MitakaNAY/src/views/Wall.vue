<template>
  <div class="wall">
    <h1>留言墙</h1>
    <p>很多事情值得记录，当然也值得回味。</p>
    <div class="tabs">
      <button :class="{ active: activeTab === '全部' }" @click="activeTab = '全部'">全部</button>
      <button :class="{ active: activeTab === '留言' }" @click="activeTab = '留言'">留言</button>
      <button :class="{ active: activeTab === '目标' }" @click="activeTab = '目标'">目标</button>
      <button :class="{ active: activeTab === '理想' }" @click="activeTab = '理想'">理想</button>
      <button :class="{ active: activeTab === '过去' }" @click="activeTab = '过去'">过去</button>
      <button :class="{ active: activeTab === '将来' }" @click="activeTab = '将来'">将来</button>
      <button :class="{ active: activeTab === '爱情' }" @click="activeTab = '爱情'">爱情</button>
      <button :class="{ active: activeTab === '亲情' }" @click="activeTab = '亲情'">亲情</button>
      <button :class="{ active: activeTab === '友情' }" @click="activeTab = '友情'">友情</button>
      <button :class="{ active: activeTab === '秘密' }" @click="activeTab = '秘密'">秘密</button>
      <button :class="{ active: activeTab === '信条' }" @click="activeTab = '信条'">信条</button>
      <button :class="{ active: activeTab === '无题' }" @click="activeTab = '无题'">无题</button>
    </div>
    <div class="messages">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        :class="['message', message.color]"
      >
        <div class="message-header">
          <span>{{ message.date }}</span>
          <span>{{ message.type }}</span>
        </div>
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-footer">
          <span>{{ message.likes }}❤️</span>
          <span>{{ message.comments }}💬</span>
          <span>{{ message.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Message {
  id: number
  date: string
  type: string
  content: string
  likes: number
  comments: number
  author: string
  color: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    date: '01/16 13:50',
    type: '留言',
    content: '哇！好不错！',
    likes: 0,
    comments: 0,
    author: '匿名',
    color: 'green',
  },
  {
    id: 2,
    date: '01/16 08:51',
    type: '留言',
    content: '很好，学习榜样',
    likes: 0,
    comments: 0,
    author: '123',
    color: 'pink',
  },
  {
    id: 3,
    date: '2025/12/20 21:14',
    type: '留言',
    content: '不错不错',
    likes: 2,
    comments: 0,
    author: 'tavian',
    color: 'blue',
  },
  {
    id: 4,
    date: '2025/12/16 15:46',
    type: '无题',
    content: '你好',
    likes: 0,
    comments: 0,
    author: '匿名',
    color: 'red',
  },
  {
    id: 5,
    date: '2025/12/14 14:18',
    type: '留言',
    content: '很好看 学习学习',
    likes: 2,
    comments: 0,
    author: 'fanfan',
    color: 'yellow',
  },
  {
    id: 6,
    date: '2025/11/30 14:15',
    type: '留言',
    content: '用AI搭建了一个和博主样式一样的博客。谢谢博主的博客',
    likes: 5,
    comments: 2,
    author: '匿名',
    color: 'pink',
  },
  {
    id: 7,
    date: '2025/11/26 14:58',
    type: '将来',
    content: '希望以后的我能越来越好，不再有坎坷，一切顺遂。',
    likes: 4,
    comments: 0,
    author: '匿名',
    color: 'pink',
  },
  {
    id: 8,
    date: '2025/11/24 17:17',
    type: '留言',
    content: '好',
    likes: 2,
    comments: 0,
    author: '匿名',
    color: 'pink',
  },
  {
    id: 9,
    date: '2025/11/22 11:36',
    type: '留言',
    content: 'UI设计地像是一个商业网站',
    likes: 1,
    comments: 0,
    author: '友迪',
    color: 'pink',
  },
  {
    id: 10,
    date: '2025/11/20 22:55',
    type: '留言',
    content: '感谢分享！已经在学习博主的项目啦~',
    likes: 1,
    comments: 1,
    author: '匿名',
    color: 'purple',
  },
])

const activeTab = ref('全部')

const filteredMessages = computed(() => {
  if (activeTab.value === '全部') {
    return messages.value
  }
  return messages.value.filter((message) => message.type === activeTab.value)
})
</script>

<style scoped>
.wall {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tabs button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.messages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.message {
  padding: 20px;
  border-radius: 8px;
}

.message.green {
  background-color: lightgreen;
}

.message.pink {
  background-color: lightpink;
}

.message.blue {
  background-color: lightblue;
}

.message.red {
  background-color: lightcoral;
}

.message.yellow {
  background-color: lightyellow;
}

.message-purple {
  background-color: thistle;
}

.message-header,
.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-content {
  margin: 10px 0;
}
</style>
