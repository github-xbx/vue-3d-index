<template>
  <CopilotKitProvider
    runtime-url="http://127.0.0.1:8080/api/copilotkit"
    :onError="handleError"
  >
    <div style="display: flex; height: 100vh;">
      <CopilotThreadsDrawer
        agent-id="default"
        recent-label="历史对话"
        @thread-select="handleThreadSelect"
        @new-thread="handleNewThread"
      ></CopilotThreadsDrawer>
      <CopilotChat
        style="flex: 1; height: 100vh;"
        :labels="MyChatLabels"
        agent-id="deepseek"
        :thread-id="currentThreadId"
      />
    </div>
  </CopilotKitProvider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CopilotChat, CopilotKitProvider, CopilotThreadsDrawer } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css";

import { MyChatLabels } from "../../composables/copilotKit/utils.ts";

const currentThreadId = ref<string>();

function handleThreadSelect(threadId: string) {
  currentThreadId.value = threadId;
  console.log("Thread selected:", threadId);
}

function handleNewThread() {
  // 设为 undefined：
  // hasExplicitThreadId 为 false → 欢迎界面正常显示
  // CopilotChat 内部会用 generatedThreadId 作为临时 ID
  // 用户发送第一条消息时后端才会真正创建线程
  currentThreadId.value = undefined;
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
