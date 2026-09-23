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
import {useSubmitStore} from "@/hooks/chat/useChatMessage"
import { ref , watch, nextTick} from 'vue';

import {AliyunModel} from "@/services/langchain/AliyunModel"
import {LangChainChatProvider, type LangChainMessage} from "@/services/langchain/LangChainChatProvider"
import { useXChat } from '@antdv-next/x-sdk'

const messageStore = useSubmitStore().dataList;
const isChat = ref<boolean>(false);


watch(messageStore, (newVal, oldVal) => {
    if (newVal.length > 0){
        isChat.value = true;
    }else{
        isChat.value = false;
    }
}) 



const provider = new LangChainChatProvider();
const alliyun = new AliyunModel();

// ---- 3. useXChat 管理数据流 ----
const {messages,onRequest,isRequesting,abort,} = useXChat({
  provider,
  requestPlaceholder: (): LangChainMessage => ({
    content: '思考中...',
    role: "assistant",
  }),
  requestFallback: (_, { error }) : LangChainMessage => {
    if (error.name === 'AbortError') {
      return { content: '已取消请求', role: 'assistant' }
    }
    return { content: '请求失败，请检查 API 配置后重试。', role: 'assistant' }
  },
})

// ---- 4. 自定义流式请求（绕过 useXChat 的内部请求，由 LangChain 驱动） ----
const scrollContainer = ref<HTMLElement>()

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

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

/** 手动触发 LangChain 流式调用 */
const handleLangChainRequest = async (userQuery:string) => {
    //先通过 onRequest 把用户消息 和 占位消息加入到useXChat 的消息列表中
    //但实际请求是由下面的LangChain 流式接口驱动
    //这里我们手动管理消息列表更新

    const userMessage = {
        id: `user-${Date.now()}`,
        message: {content: userQuery, role: 'user' as const},
        status: 'success' as const
    }
    const aiMessageId = `ai-${Date.now()}`
    const aiPlaceholder = {
        id: aiMessageId,
        message: {content: '', role: 'assistant' as const },
        status: 'loading' as const
    }

    //直接操作message (useXChat 返回的 ref 是可以写的)
    messages.value =  [...messages.value, userMessage, aiPlaceholder]

    try{
        // const lcMessages = buildLangChainMessages(userQuery)
        // const stream = await model.stream(lcMessages)

        const stream = await alliyun.chatStream(userQuery);

        let accumulated = '';
        for await (const chunk of stream){
            const token = chunk.content as string;
            accumulated += token;

            //实时更新 AI 消息内容 实现打字机效果
            const idx = messages.value.findIndex((m) => m.id === aiMessageId);
            if(idx !== -1){
                messages.value[idx] = {
                    ...messages.value[idx],
                    message: {content: accumulated, role:'assistant'},
                    status: 'updating'
                }

            }

            // 滚动到底部
            scrollToBottom()

        }

        // 标记完成
        const finalIdx = messages.value.findIndex((m) => m.id = aiMessageId)
        if(finalIdx !== -1){
            messages.value[finalIdx] = {
                ...messages.value[finalIdx],
                status: 'success',
            }
        }


    }catch(error: any){
        const errIdx = messages.value.findIndex((m) => m.id = aiMessageId);
        if (errIdx !== -1) {
            messages.value[errIdx] = {
                ...messages.value[errIdx],
                message: { content: '请求失败，请重试。', role: 'assistant' },
                status: 'error',
            }
        }
    }

}




</script>