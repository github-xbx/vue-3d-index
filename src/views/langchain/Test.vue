<template>

</template>

<script lang="ts" setup>
import { AliyunModel } from '../../services/langchain/AliyunModel';
import { ref } from 'vue';

const model = new AliyunModel();

model.chat("你好").then((response) => {
  console.log("模型响应:", response);
}).catch((error) => {
  console.error("请求出错:", error);
});

const answer = ref('');
model.chatStream("你好").then(async (resp) => {
    const reader = resp.getReader();

    // 4. 循环读取数据块
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // 读取完毕
      console.log("111 =>",value); // 应该输出 [object Uint8Array]
      // 5. 解码并更新响应式数据
      //const chunk = decoder.decode(value.content, { stream: true });
      console.log("思考 =>",value.additional_kwargs.reasoning_content);
      answer.value += value.content;
      console.log(value.content);
    }




}).catch((error) => {
  console.error("请求出错:", error);
});

</script>