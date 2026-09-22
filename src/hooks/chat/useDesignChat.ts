import { h, computed, ref } from "vue";
import type {ActionsFeedbackProps, SenderProps, ThoughtChainItemProps } from "@antdv-next/x";

import {DeepSeekFilled, QwenFilled,} from "@antdv-next/icons";
import type {
  DefaultMessageInfo,
  MessageInfo,
  SSEFields,
  XModelMessage,
  XModelParams,
  XModelResponse,
} from "@antdv-next/x-sdk";
import { message } from "ant-design-vue";


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

const userSendMessage = ref<string>('');
const aiSendMessage = ref<string>('');


//方法
const getUserMessage = (): string => {
  return userSendMessage.value;
}
const setUserMessage = (message: string) => {
  userSendMessage.value = message;
}

const getAiMessage = ():string => {
  return aiSendMessage.value;
}
const setAiMessage = (message: string) => {
  aiSendMessage.value = message;
}


export { agentItems, THOUGHT_CHAIN_CONFIG, getAiMessage, getUserMessage, setAiMessage, setUserMessage };
export type { SenderProps, ChatMessage,MessageInfo };
