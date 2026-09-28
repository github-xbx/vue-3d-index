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
import { LangChainXRequest } from "@/services/langchain/LangChainXRequest";


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

const alliyun = new AliyunModel();

const langchainRequest = new LangChainXRequest("/api.langchain",{
  manual: true,
  produce: async function* (params, signal) {
    const stream = await alliyun.chatStream(params.query,signal);
    for await (const chunk of stream) {
      // 获取思考流式输出
      const rawReasoning = chunk.additional_kwargs?.reasoning_content;

      const reasoning = typeof rawReasoning === "string" ? rawReasoning : "";
      const content = typeof chunk.content === "string"?chunk.content : "";
      if(!reasoning && !content)
        continue;
      yield {
        reasoning: reasoning || undefined,
        content: content || undefined
      }
    }
  },
});

const provider = new LangChainChatProvider(langchainRequest);


//方法



// ---- 3. useXChat 管理数据流 ----
const {messages,onRequest,isRequesting,abort} = useXChat({
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


/** 提交：库自己管 loading → updating → success/error，不需要手写循环 */
const handleLangChainRequest = (userQuery:string) => {
    onRequest({query: userQuery, history: []})

}


export { agentItems, THOUGHT_CHAIN_CONFIG, messages, handleLangChainRequest, isRequesting, abort };
export type { SenderProps, ChatMessage,MessageInfo };
