<template>
    <div>
        <div class="flex flex-col h-screen">
            <!-- 欢迎提示语 -->
            <div class="flex-2 flex justify-center items-center ">
                <DesignChatMessageList class="w-full md:w-2/3 lg:w-3/4 xl:2/3" v-if="isChat"></DesignChatMessageList>
                <DesignChatWelcome class="w-full md:w-2/3 lg:w-3/4 xl:2/3" v-else  />
                
            </div>
            <!-- 消息输入框 -->
            <div class="flex-1 flex justify-center items-center">
                <DesignChatInput class="w-full md:w-2/3 lg:w-3/4 xl:2/3 mb-4"  />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import DesignChatMessageList from '@/components/chat/DesignChatMessageList.vue'
import DesignChatWelcome from "@/components/chat/DesignChatWelcome.vue";
import DesignChatInput from "@/components/chat/DesignChatInput.vue";
import { messages} from "@/hooks/chat/useDesignChat";
import { computed , } from 'vue';



const isChat = computed(() => messages.value.length > 0);









/** 构建 LangChain 消息历史 */
// const buildLangChainMessages = (userQuery: string) => {
//   const history = messages.value
//     .filter((m) => m.status === 'success' && m.message.content)
//     .map((m) => {
//       const msg = m.message as { role: string; content: string }
//       return msg.role === 'user'
//         ? new HumanMessage(msg.content)
//         : new AIMessage(msg.content)
//     })

//   return [
//     new SystemMessage(provider.getSystemPrompt()),
//     ...history,
//     new HumanMessage(userQuery),
//   ]
// }






</script>