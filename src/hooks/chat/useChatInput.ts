import { h } from "vue";
import type { SenderProps } from "@antdv-next/x";
import {DeepSeekFilled, QwenFilled, EditOutlined,} from "@antdv-next/icons";

interface AgentInfoItem {
  icon: any;
  label: string;
  zh_label: string;
  skill: SenderProps["skill"];
  zh_skill: SenderProps["skill"];
  slotConfig?: SenderProps["slotConfig"];
  zh_slotConfig?: SenderProps["slotConfig"];
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






export { agentItems };
export type { SenderProps };
