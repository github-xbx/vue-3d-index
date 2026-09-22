<template>

    <BubbleList :items="bubbleItems" :role="roleConfig">
    </BubbleList>
</template>

<script setup lang="ts">
import {computed,  ref ,h, onMounted } from 'vue';
import { BubbleList, ThoughtChain, Think} from '@antdv-next/x';
import type {BubbleListProps, BubbleItemType, } from "@antdv-next/x";
import { XMarkdown } from "@antdv-next/x-markdown";
import type { ComponentProps } from "@antdv-next/x-markdown";
import {GlobalOutlined} from '@antdv-next/icons'
import {THOUGHT_CHAIN_CONFIG} from "@/hooks/chat/useDesignChat";

import { useSubmitStore} from "@/hooks/chat/useChatMessage";




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

onMounted(() => {
  // bubbleItems.value.push({
  //   key: "12",
  //   role: "assistant",
  //   content: "### 你好",
  // })
  //  bubbleItems.value.push({
  //   key: "12",
  //   role: "user",
  //   content: "### 你也好",
  // })
})


const messageStore =  useSubmitStore();


const bubbleItems = messageStore.dataList;

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
    contentRender: (content: string, info: any) =>
      h(XMarkdown, {
        content: content.replace(/\n\n/g, "<br/><br/>"),
        className: "x-markdown-light",
        paragraphTag: "div",
        components: {
          think: (props: ComponentProps, { slots }) =>
            h(Think, {
              title: props.streamStatus === "loading" ? "思考中..." : "已深度思考",
              loading: props.streamStatus === "loading",
              blink: props.streamStatus === "loading",
              defaultExpanded: props.streamStatus !== "loading",
            }, {
              default: () => slots.default?.(),
            }),
        },
        streaming: {
          hasNextChunk: info.status === "loading" || info.status === "updating",
          enableAnimation: true,
        },
      }),
  },
  user: {
    placement: "end",
  },
}));








// 暴露给父组件
defineExpose({
 
})


</script>