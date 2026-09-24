<template>
    <div>
        <Sender v-model:value="senderInput" submitType="shiftEnter" :loading="loading"
            placeholder="给智能体一个提示，或者输入你想要的内容..." :suffix="false" :auto-size="{ minRows: 3, maxRows: 6 }"
            :on-submit="onSubmit" :on-cancel="onCancel">
            <template #header>
                <SenderHeader  :open="true" :closable="false">
                    <a-flex gap="small" wrap="wrap">
                        <a-tag color="blue" v-if="deepThink">深度思考：开启</a-tag>
                        <a-tag color="green">联网搜索</a-tag>
                        <a-tag color="gold">低温度</a-tag>
                    </a-flex>
                </SenderHeader>
            </template>

            <template #footer="{ defaultNode }">

                <a-flex justify="space-between" align="center">
                    <a-flex gap="small" align="center">
                        <a-button class="text-xs" type="text" @click="open = !open">
                            <template #icon>
                                <PaperClipOutlined />
                            </template>
                        </a-button>
                        <SenderSwitch :value="deepThink" :on-change="(checked: boolean) => (deepThink = checked)">
                            <template #icon>
                                <OpenAIOutlined />
                            </template>
                            深度思考
                            <!-- <template #checkedChildren>
                                <div>
                                    深度搜索：
                                    <span class="inline-flex w-7 justify-center items-center">开启</span>
                                </div>
                            </template>
                            <template #unCheckedChildren>
                                <div>
                                    深度搜索：
                                    <span>关闭</span>
                                </div>
                            </template> -->
                        </SenderSwitch>
                        <a-dropdown>

                             <SenderSwitch :value="false">
                                <template #icon>
                                    <AntDesignOutlined />
                                </template>
                                Model
                            </SenderSwitch>

                            <template #overlay>
                                <a-menu 
                                  :select-keys="[activeAgentKey]"
                                  :items="agentItems" 
                                  @click="agentItemClick" 
                                />
                            </template>
                           
                           
                        </a-dropdown>
                        <a-dropdown>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item >
                                        <CloudUploadOutlined />
                                        上传文件
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <SenderSwitch :value="false">
                                <template #icon>
                                    <ProfileOutlined />
                                </template>
                                Files
                            </SenderSwitch>
                        </a-dropdown>



                    </a-flex>
                    <a-flex align="center">
                        <a-button type="text" class="text-xs">
                            <template #icon>
                                <ApiOutlined />
                            </template>
                        </a-button>
                        <a-divider type="vertical" />
                        <component :is="defaultNode" />
                    </a-flex>
                </a-flex>

            </template>
        </Sender>

    </div>

</template>
<script setup lang="ts">
import { ref } from "vue";
import { Sender, SenderSwitch, SenderHeader } from "@antdv-next/x";
import type { MenuProps } from "antdv-next";
import {
    PaperClipOutlined,
    OpenAIOutlined,
    AntDesignOutlined,
    ApiOutlined,
    ProfileOutlined,
    CloudUploadOutlined
} from "@antdv-next/icons";
import { agentItems, type SenderProps, handleLangChainRequest } from "@/hooks/chat/useDesignChat";




//变量
const activeAgentKey = ref("ai_writing");
const loading = ref(false)
const open = ref(false)
const deepThink = ref(false)
const senderInput = ref('');

//方法

/**
 * 消息提交
 */
const onSubmit: SenderProps["onSubmit"] = async (message: string, _, skill) => {
    console.log(skill)
    loading.value = true;
    senderInput.value = '';
    //请求大模型后台
    await handleLangChainRequest(message);

    loading.value = false;
}


const onCancel = () => {
    console.log("取消输入");
}


const agentItemClick: MenuProps["onClick"] = item => {
    activeAgentKey.value = item.key as string;
    console.log(`Agent item clicked: ${item}`);
}





</script>