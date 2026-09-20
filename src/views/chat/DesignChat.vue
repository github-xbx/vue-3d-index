<template>
    <div>
        <div class="flex flex-col h-screen">
            <!-- 欢迎提示语 -->
            <div class="flex-[2] flex justify-center items-center ">
                <DesignChatWelcome class="w-full md:w-2/3 lg:w-3/4 xl:2/3" />
            </div>
            <!-- 消息输入框 -->
            <div class="flex-[1] flex justify-center items-center">
                <DesignChatInput class="w-full md:w-2/3 lg:w-3/4 xl:2/3"  />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

import DesignChatWelcome from "@/components/chat/DesignChatWelcome.vue";
import DesignChatInput from "@/components/chat/DesignChatInput.vue";







</script>