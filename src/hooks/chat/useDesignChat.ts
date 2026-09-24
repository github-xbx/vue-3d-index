import { h, computed } from "vue";
import type {ActionsFeedbackProps, SenderProps, ThoughtChainItemProps } from "@antdv-next/x";

import {DeepSeekFilled, QwenFilled,} from "@antdv-next/icons";
import type {
  MessageInfo,
  XModelMessage,
} from "@antdv-next/x-sdk";
import {AliyunModel} from "@/services/langchain/AliyunModel"
import {LangChainChatProvider, type LangChainMessage} from "@/services/langchain/LangChainChatProvider"
import { useXChat } from '@antdv-next/x-sdk'



interface AgentInfoItem {
  icon: any;
  label: string;
  zh_label: string;
  skill: SenderProps["skill"];
  zh_skill: SenderProps["skill"];
  slotConfig?: SenderProps["slotConfig"];
  zh_slotConfig?: SenderProps["slotConfig"];
}

interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback?: ActionsFeedbackProps["value"];
  };
}


const AgentInfo: Record<string, AgentInfoItem> = {
  deep_seek: {
    icon: DeepSeekFilled,
    label: "Deep Search",
    zh_label: "DeepSeek",
    skill: {
      value: "deepSearch",
      title: "Deep Search",
      closable: true,
    },
    zh_skill: {
      value: "deepSearch",
      title: "深度搜索",
      closable: true,
    }
    
  },
  qwen: {
    icon: QwenFilled,
    label: "AI Code",
    zh_label: "Qwen",
    skill: {
      value: "aiCode",
      title: "Code Assistant",
      closable: true,
    },
    zh_skill: {
      value: "aiCode",
      title: "代码助手",
      closable: true,
    },
    
  },
};



// 变量
const agentItems = Object.keys(AgentInfo).map(agent => {
  const { icon, label } = AgentInfo[agent];
  return { key: agent, icon: () => h(icon), label };
});

const THOUGHT_CHAIN_CONFIG = computed<
  Record<string, { title: string; status: ThoughtChainItemProps["status"] }>
>(() => ({
  loading: {
    title: "加载",
    status: "loading",
  },
  updating: {
    title: "更新",
    status: "loading",
  },
  success: {
    title: "成功",
    status: "success",
  },
  error: {
    title: "失败",
    status: "error",
  },
  abort: {
    title: "关于",
    status: "abort",
  },
}));

const provider = new LangChainChatProvider();
const alliyun = new AliyunModel();




//方法



// ---- 3. useXChat 管理数据流 ----
const {messages,onRequest,isRequesting,abort,} = useXChat({
  provider,
  requestPlaceholder: (): LangChainMessage => ({
   
    content: '思考中...',
    role: "assistant",
  }),
  requestFallback: (_, { error }) : LangChainMessage => {
    if (error.name === 'AbortError') {
      return {content: '已取消请求', role: 'assistant' }
    }
    return {content: '请求失败，请检查 API 配置后重试。', role: 'assistant' }
  },
})


/** 手动触发 LangChain 流式调用 */
const handleLangChainRequest = async (userQuery:string) => {
    //先通过 onRequest 把用户消息 和 占位消息加入到useXChat 的消息列表中
    //但实际请求是由下面的LangChain 流式接口驱动
    //这里我们手动管理消息列表更新

    const userMessage = {
       key: Date.now(),
        id: `user-${Date.now()}`,
        message: {content: userQuery, role: 'user' as const},
        status: 'success' as const
    }
    const aiMessageId = `ai-${Date.now()}`
    const aiPlaceholder = {
       key: Date.now(),
        id: aiMessageId,
        message: {content: '', role: 'assistant' as const },
        status: 'loading' as const
    }

    //直接操作message (useXChat 返回的 ref 是可以写的)
    messages.value =  [...messages.value, userMessage, aiPlaceholder]
    console.log(messages.value)
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
        }

        // 标记完成
        const finalIdx = messages.value.findIndex((m) => m.id === aiMessageId)
        console.log("完成=>",finalIdx)
        if(finalIdx !== -1){
            messages.value[finalIdx] = {
                ...messages.value[finalIdx],
                status: 'success',
            }
        }
        console.log(messages.value)


    }catch(error: any){
        const errIdx = messages.value.findIndex((m) => m.id === aiMessageId);
        if (errIdx !== -1) {
            messages.value[errIdx] = {
                ...messages.value[errIdx],
                message: {content: '请求失败，请重试。', role: 'assistant' },
                status: 'error',
            }
        }
    }

}


export { agentItems, THOUGHT_CHAIN_CONFIG, messages, handleLangChainRequest };
export type { SenderProps, ChatMessage,MessageInfo };
