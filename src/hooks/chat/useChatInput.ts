import type { SenderProps } from "@antdv-next/x";
import {SearchOutlined, CodeOutlined, EditOutlined,} from "@antdv-next/icons";

interface AgentInfoItem {
  icon: any;
  label: string;
  zh_label: string;
  skill: SenderProps["skill"];
  zh_skill: SenderProps["skill"];
  slotConfig: SenderProps["slotConfig"];
  zh_slotConfig: SenderProps["slotConfig"];
}

const AgentInfo: Record<string, AgentInfoItem> = {
  deep_search: {
    icon: SearchOutlined,
    label: "Deep Search",
    zh_label: "深度搜索",
    skill: {
      value: "deepSearch",
      title: "Deep Search",
      closable: true,
    },
    zh_skill: {
      value: "deepSearch",
      title: "深度搜索",
      closable: true,
    },
    slotConfig: [
      { type: "text", value: "Please help me search for news about " },
      {
        type: "select",
        key: "search_type",
        props: {
          options: ["AI", "Technology", "Entertainment"],
          placeholder: "Please select a category",
        },
      },
      { type: "text", key: "", value: "Please help me search for news about " },
    ],
    zh_slotConfig: [
      { type: "text", value: "请帮我搜索关于" },
      {
        type: "select",
        key: "search_type",
        props: {
          options: ["AI", "技术", "娱乐"],
          placeholder: "请选择一个类别",
        },
      },
      { type: "text", key: "", value: "的新闻。" },
    ],
  },
  ai_code: {
    icon: CodeOutlined,
    label: "AI Code",
    zh_label: "写代码",
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
    slotConfig: [
      { type: "text", value: "Please use " },
      {
        type: "select",
        key: "code_lang",
        props: {
          options: ["JS", "C++", "Java"],
          placeholder: "Please select a programming language",
        },
      },
      { type: "text", value: " to write a mini game." },
    ],
    zh_slotConfig: [
      { type: "text", value: "请使用" },
      {
        type: "select",
        key: "code_lang",
        props: {
          options: ["JS", "C++", "Java"],
          placeholder: "请选择一个编程语言",
        },
      },
      { type: "text", value: "写一个小游戏。" },
    ],
  },
  ai_writing: {
    icon: EditOutlined,
    label: "Writing",
    zh_label: "帮我写作",
    skill: {
      value: "writing",
      title: "Writing Assistant",
      closable: true,
    },
    zh_skill: {
      value: "writing",
      title: "写作助手",
      closable: true,
    },
    slotConfig: [
      { type: "text", value: "Please write an article about " },
      {
        type: "select",
        key: "writing_type",
        props: {
          options: ["Campus", "Travel", "Reading"],
          placeholder: "Please enter a topic",
        },
      },
      { type: "text", value: ". The requirement is " },
      {
        type: "content",
        key: "writing_num",
        props: {
          defaultValue: "800",
          placeholder: "[Please enter the number of words]",
        },
      },
      { type: "text", value: " words." },
    ],
    zh_slotConfig: [
      { type: "text", value: "请帮我写一篇关于" },
      {
        type: "select",
        key: "writing_type",
        props: {
          options: ["校园", "旅行", "阅读"],
          placeholder: "请输入主题",
        },
      },
      { type: "text", value: "的文章。要求是" },
      {
        type: "content",
        key: "writing_num",
        props: {
          defaultValue: "800",
          placeholder: "[请输入字数]",
        },
      },
      { type: "text", value: "字。" },
    ],
  },
};



// 变量
const agentItems = Object.keys(AgentInfo).map(agent => {
    const { icon, label } = AgentInfo[agent];
    return { key: agent, icon, label };
});


//方法
export { agentItems };
export type { SenderProps };
