<template>
 <Bubble :content="message" :header="userName">
      <template #avatar v-if="props.type === 'assistant'">
        <a-avatar size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </template>
      <template #footer>
        <Actions :items="actionItems">
          <template #icon-render="items">
            <RedoOutlined v-if="items.item.key === 'retry'" />
            <CopyOutlined v-if="items.item.key === 'copy'" />
          </template>
        </Actions>
      </template>
    </Bubble>
</template>

<script setup lang="ts">
import { UserOutlined, RedoOutlined, CopyOutlined } from "@antdv-next/icons";
import { Bubble, Actions } from "@antdv-next/x";

interface Props {
    message: string;  //消息体
    userName: string; // 用户名
    type: "user" | "assistant"; // 消息类型
}

const props = defineProps<Props>()

const actionItems = [
  {
    key: "retry",
    label: "Retry",
  },
  {
    key: "copy",
    label: "Copy",
  },
];




</script>