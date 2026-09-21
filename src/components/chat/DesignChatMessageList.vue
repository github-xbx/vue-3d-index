<template>

    <BubbleList :items="bubbleItems" :role="roleConfig" >

    </BubbleList>
</template>

<script setup lang="ts">
import {computed, h, shallowRef} from 'vue';
import { BubbleList } from '@antdv-next/x';
import type {BubbleListProps} from "@antdv-next/x";









const bubbleItems = computed<BubbleListProps["items"]>(() => []);

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
    footer: (content: string, info: any) => {
      const items = footerItems(info.key, content, info.status, info.extraInfo);

      if (!items.length) {
        return null;
      }

      return h("div", { style: { display: "flex" } }, [h(Actions, { items })]);
    },
    contentRender: (content: string, info: any) =>
      h(XMarkdown, {
        content: content.replace(/\n\n/g, "<br/><br/>"),
        className: markdownClass.value,
        paragraphTag: "div",
        components: {
          think: (props: ComponentProps) =>
            h(thinkComponent, {
              ...props,
              chatStatus: info.status,
            }),
        },
        streaming: {
          hasNextChunk: info.status === "updating",
          enableAnimation: true,
        },
      }),
  },
  user: {
    placement: "end",
  },
}));


</script>