<template>
  <CopilotKitProvider runtime-url="http://127.0.0.1:8080/api/copilotkit" :onError="handleError">
    <div style="display: flex; height: 100vh;">
      <CopilotThreadsDrawer 
        agent-id="default" 
        recent-label="历史对话" 
        @thread-select="handleThreadSelect"
        @new-thread="handleNewThread">
      </CopilotThreadsDrawer>
      <CopilotChat 
        style="flex: 1; height: 100vh;" 
        :labels="MyChatLabels" 
        agent-id="deepseek"
        :thread-id="currentThreadId" 
        :key="chatKey" >
      </CopilotChat>
    </div>
  </CopilotKitProvider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CopilotChat, CopilotKitProvider, CopilotThreadsDrawer } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css";

import { MyChatLabels } from "../../composables/copilotKit/utils.ts";

// 当前对话 threadId
const currentThreadId = ref<string>();
const chatKey = ref(0);

function handleThreadSelect(threadId: string) {
  currentThreadId.value = threadId;
  chatKey.value++;
  console.log("Thread selected:", threadId);
}

/**
 * 新建对话事件
 */
const handleNewThread = () => {
  // undefined → hasExplicitThreadId 为 false → 欢迎界面正常显示
  // :key 递增强制 CopilotChat 重新挂载，内部生成全新 UUID
  // 用户发送第一条消息时后端才会真正创建线程
  currentThreadId.value = undefined;
  chatKey.value++;
  console.log("New thread created (welcome screen visible)");
}


function handleError(event: {
  error: Error;
  code: string;
  context: Record<string, any>;
}) {
  console.error("[CopilotKit Error]", event.code, event.error.message, event.context);
}
</script>

<style scoped>
copilotkit-threads-drawer {
  --cpk-drawer-bg: oklch(0.97 0 0);
}
</style>
