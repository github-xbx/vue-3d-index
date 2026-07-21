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
      />
      <CopilotChat
        style="flex: 1; height: 100vh;"
        :labels="MyChatLabels"
        :thread-id="currentThreadId"
        :key="currentThreadId"
      />
    </div>
  </CopilotKitProvider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CopilotChat, CopilotKitProvider, CopilotThreadsDrawer } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css";

import { MyChatLabels } from "../../composables/copilotKit/utils.ts";

const currentThreadId = ref<string>("");

function handleThreadSelect(threadId: string) {
  currentThreadId.value = threadId;
}

function handleNewThread() {
  currentThreadId.value = "";
}

function handleError(event: {
  error: Error;
  code: string;
  context: Record<string, any>;
}) {
  console.error("[CopilotKit Error]", event.code, event.error.message, event.context);
}
</script>
