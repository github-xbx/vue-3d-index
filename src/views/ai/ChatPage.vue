<template>
    <CopilotKitProvider runtime-url="http://127.0.0.1:8080/api/copilotkit" agent-id="agentId" >
        <CopilotChat 
            style="height: 100vh; width: 100vw;" 
            :labels="MyChatLabels" 
        />
        <CopilotChatAssistantMessage
    :message="message"
    @thumbs-up="(msg) => console.log('Thumbs up:', msg.id)"
    @thumbs-down="(msg) => console.log('Thumbs down:', msg.id)"
  />
    </CopilotKitProvider>

    
   

</template>

<script setup lang="ts">

//必须引入样式 否则聊天界面没有样式
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css"

import { MyChatLabels } from "../../composables/copilotKit/utils.ts";


import { CopilotChatAssistantMessage } from "@copilotkit/vue/v2";
import type { AssistantMessage } from "@ag-ui/core";
const message: AssistantMessage = {
  id: "1",
  role: "assistant",
  content: "Here is **Markdown** with a `code` sample.",
};








</script>