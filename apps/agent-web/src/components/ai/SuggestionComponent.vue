<template>

</template>

<script setup lang="ts">
import { useConfigureSuggestions } from '@copilotkit/vue/v2';
import type {StaticSuggestionsConfig} from '@copilotkit/vue/v2';
// ✅ 现在可以安全使用，因为父级已提供上下文


const  config: StaticSuggestionsConfig = {
  suggestions: [
    { title: '写诗', message: '写一首关于秋天的诗' },
    { title: '写代码', message: '写一个计算斐波那契数列的函数' },
    { title: '写文章', message: '写一篇关于人工智能的文章' },
    { title: '翻译', message: '将以下文本翻译成英文：你好，世界！' },
    { title: '讲故事', message: '讲一个童话故事' }
  ],
  available: "always"
};

useConfigureSuggestions(config);
</script>