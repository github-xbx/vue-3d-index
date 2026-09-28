<template>
  <div>
    <BubbleList :items="bubbleItems" :role="roleConfig">
    </BubbleList>
  </div>

</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from 'vue';
import { BubbleList, ThoughtChain, Think, type BubbleItemType } from '@antdv-next/x';
import type { BubbleListProps, } from "@antdv-next/x";
import { XMarkdown } from "@antdv-next/x-markdown";
// x-markdown-light 这个 class 的样式来自主题包，不引入的话标题/表格/代码块/段落间距全都不生效
import "@antdv-next/x-markdown/themes/light.css";
import { GlobalOutlined } from '@antdv-next/icons'
import { THOUGHT_CHAIN_CONFIG, messages } from "@/hooks/chat/useDesignChat";






// function footerItems(
//   id?: string | number,
//   content = "",
//   status?: MessageInfo<ChatMessage>["status"],
//   extraInfo?: ChatMessage["extraInfo"],
// ) {
//   if (!id || status === "loading" || status === "updating") {
//     return [];
//   }

//   return [
//     // {
//     //   key: "pagination",
//     //   actionRender: () =>
//     //     h(Pagination, {
//     //       simple: true,
//     //       total: 1,
//     //       pageSize: 1,
//     //     }),
//     // },
//     {
//       key: "retry",
//       label: locale.value.retry,
//       icon: h(SyncOutlined),
//       onItemClick: () => {
//         onReload(id, {
//           userAction: "retry",
//         });
//       },
//     },
//     {
//       key: "copy",
//       actionRender: () => h(ActionsCopy, { text: content }),
//     },
//     {
//       key: "audio",
//       actionRender: () =>
//         h(ActionsAudio, {
//           onClick: () => {
//             message.info(locale.value.isMock);
//           },
//         }),
//     },
//     {
//       key: "feedback",
//       actionRender: () =>
//         h(ActionsFeedback, {
//           value: extraInfo?.feedback || "default",
//           styles: {
//             liked: {
//               color: "#f759ab",
//             },
//           },
//           onChange: (value: ActionsFeedbackProps["value"]) => {
//             setMessage(id, {
//               extraInfo: {
//                 feedback: value,
//               },
//             });
//             message.success(`${id}: ${value}`);
//           },
//         }),
//     },
//   ];
// }




/**
 * 流式过程中「还没闭合」的 token（**粗体、[链接、`行内码、表格等）会被 XMarkdown 扣留，
 * 只有 components 里存在同名组件时才会把这段渲染出来，否则整段直接消失（表现为"解析不全"）。
 * 这里统一按纯文本渲染，保证边打字边补全时内容不丢。
 * 注意 data-raw 是 URI 编码的，属性名 data-raw 会被 Vue camelize 成 dataRaw。
 */
const IncompleteToken = defineComponent({
  name: "IncompleteToken",
  props: {
    dataRaw: { type: String, default: "" },
  },
  setup(props) {
    return () => {
      let text = props.dataRaw;
      try {
        text = decodeURIComponent(props.dataRaw);
      } catch {
        // data-raw 不是合法 URI 编码时按原样展示
      }
      return h("span", { class: "x-markdown-incomplete" }, text);
    };
  },
});

/** 思考块：必须是稳定引用，否则每次重渲染都会重新挂载（会丢掉展开状态和动画） */
const ThinkBlock = defineComponent({
  name: "ThinkBlock",
  props: {
    reasoning: { type: String, default: "" },
    thinking: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const expanded = ref(true);
    // 思考结束 → 自动收起；开始新一轮 → 重新展开
    watch(
      () => props.thinking,
      (t) => {
        expanded.value = t;
      },
    );
    return () =>
      h(
        Think,
        {
          title: props.thinking ? "思考中..." : "已深度思考",
          loading: props.thinking,
          blink: props.thinking,
          // 受控，才能程序化收起
          expanded: expanded.value,
          "onUpdate:expanded": (v: boolean) => {
            expanded.value = v;
          },
          style: { marginBottom: "8px" },
        },
        {
          default: () =>
            h(XMarkdown, {
              content: props.reasoning,
              // 可选：针对流式输出优化体验
              streaming: {
                hasNextChunk: props.thinking,
                enableAnimation: true,
                tail: true,
              },
            }
            )
        },
      );
  },
});

/**
 * 组件表必须定义在 contentRender 之外并保持引用稳定：
 * 写在 contentRender 函数体里会导致每次渲染都是新对象/新函数，
 * 触发 XMarkdown 内部 watch(components, {deep:true}) → setOptions + 子组件卸载重挂载。
 */
const MARKDOWN_COMPONENTS = {
  think: ThinkBlock,
  "incomplete-token": IncompleteToken,
};

/** 未闭合 token 类型 → 组件名（键取自 StreamCacheTokenType） */
const INCOMPLETE_COMPONENT_MAP = {
  link: "incomplete-token",
  image: "incomplete-token",
  html: "incomplete-token",
  emphasis: "incomplete-token",
  list: "incomplete-token",
  table: "incomplete-token",
  "inline-code": "incomplete-token",
};


/** 解析 并封装 ai模型返回的数据 */
const bubbleItems = computed<BubbleItemType[]>(() => {
  return messages.value.map((info) => ({

    key: info.id,
    role: info.message.role,
    content: info.message.content,
    status: info.status,
    extraInfo: { reasoning: info.message.reasoning }
  }))
})


const roleConfig = computed<BubbleListProps["role"]>(() => ({
  assistant: {
    placement: "start",
    header: (_: unknown, info: any) => {
      const config = THOUGHT_CHAIN_CONFIG.value[info.status];

      if (!config) {
        return null;
      }

      return h(ThoughtChain.Item, {
        style: {
          marginBottom: "8px",
        },
        status: config.status,
        variant: "solid",
        icon: h(GlobalOutlined),
        title: config.title,
      });
    },
    // footer: (content: string, info: any) => {
    //   const items = footerItems(info.key, content, info.status, info.extraInfo);

    //   if (!items.length) {
    //     return null;
    //   }

    //   return h("div", { style: { display: "flex" } }, [h(Actions, { items })]);
    // },
    contentRender: (content: string, info: any) => {
      const reasoning: string | undefined = info.extraInfo?.reasoning;

      //思考阶段 = 还没开始输出正文 且请求还在继续
      const stillThinking = !content && (info.status === "loading" || info.status === "updating");

      return h("div", {}, [
        reasoning ? h(ThinkBlock, { reasoning, thinking: stillThinking }) : null,
        h(XMarkdown, {

          content,
          className: "x-markdown-light",
          // 主题样式挂在 p / li 上，用 div 会拿不到段间距，需要换行效果请用 config.breaks
          paragraphTag: "p",
          config: { gfm: true, breaks: true },
          // 组件引用提到外面，避免每帧重建导致重复挂载
          components: MARKDOWN_COMPONENTS,
          streaming: {
            hasNextChunk: info.status === "loading" || info.status === "updating",
            enableAnimation: true,
            incompleteMarkdownComponentMap: INCOMPLETE_COMPONENT_MAP,
          },
        }),

      ])


    }

  },
  user: {
    placement: "end",
  },
}));








// 暴露给父组件
defineExpose({

})


</script>