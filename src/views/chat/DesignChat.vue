<template>
    <div>
        <div class="flex flex-col h-screen">
            <!-- 欢迎提示语 -->
            <div class="flex-2 flex justify-center items-center ">
                <DesignChatMessageList class="w-full md:w-2/3 lg:w-3/4 xl:2/3" v-if="isChat"></DesignChatMessageList>
                <DesignChatWelcome class="w-full md:w-2/3 lg:w-3/4 xl:2/3" v-else  />
                
            </div>
            <!-- 消息输入框 -->
            <div class="flex-1 flex justify-center items-center">
                <DesignChatInput class="w-full md:w-2/3 lg:w-3/4 xl:2/3 mb-4"  />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import DesignChatMessageList from '@/components/chat/DesignChatMessageList.vue'
import DesignChatWelcome from "@/components/chat/DesignChatWelcome.vue";
import DesignChatInput from "@/components/chat/DesignChatInput.vue";


import {useSubmitStore} from "@/hooks/chat/useChatMessage"
import { ref , watch} from 'vue';


const messageStore = useSubmitStore().dataList;
const isChat = ref<boolean>(false);


watch(messageStore, (newVal, oldVal) => {
    if (newVal.length > 0){
        isChat.value = true;
    }else{
        isChat.value = false;
    }
}) 







</script>