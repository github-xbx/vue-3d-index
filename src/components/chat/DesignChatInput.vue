<template>
    <div>
        <Sender v-model:value="senderInput" submitType="shiftEnter" :loading="loading"
            placeholder="给智能体一个提示，或者输入你想要的内容..." :suffix="false" :auto-size="{ minRows: 3, maxRows: 6 }"
            :on-submit="onSubmit" :on-cancel="onCancel">
            <template #header>
                <SenderHeader title="Upload Sample" :open="open">
                    <a-flex vertical align="center" gap="small" :style="{ marginBlock: '24px' }">
                        <CloudUploadOutlined :style="{ fontSize: '4em' }" />
                        <a-typography-title :level="5" :style="{ margin: 0 }">
                            将文件拖至此处
                        </a-typography-title>
                        <a-typography-text type="secondary">
                            Support pdf, doc, xlsx, ppt, txt, image file types
                        </a-typography-text>
                        <a-button @click="console.log('Mock select file')">
                            Select File
                        </a-button>
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
                        <SenderSwitch :value="false">
                            <template #icon>
                                <OpenAIOutlined />
                            </template>
                            <template #checkedChildren>
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
                            </template>
                        </SenderSwitch>
                        <a-dropdown :menu="{
                            selectedKeys: [activeAgentKey],
                            // onClick: agentItemClick,
                            items: agentItems,
                        }">
                            <template #iconRender="{ key }">

                                <SearchOutlined v-if="key === 'deep_search'" />
                                <CodeOutlined v-else-if="key === 'ai_code'" />
                                <EditOutlined v-else-if="key === 'ai_writing'" />
                            </template>
                            <SenderSwitch :value="false">
                                <template #icon>
                                    <AntDesignOutlined />
                                </template>
                                Agent
                            </SenderSwitch>
                        </a-dropdown>
                        <a-dropdown>
                            <template #iconRender="{ key }">
                                <FileImageOutlined v-if="key === 'file_image'" />
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
import {
    PaperClipOutlined,
    OpenAIOutlined,
    CodeOutlined,
    EditOutlined,
    SearchOutlined,
    AntDesignOutlined,
    ApiOutlined,
    FileImageOutlined,
    ProfileOutlined,
    CloudUploadOutlined
} from "@antdv-next/icons";
import { agentItems, type SenderProps } from "@/hooks/chat/useChatInput.ts";



//变量
const activeAgentKey = ref("ai_writing");
const loading = ref(false)
const open = ref(false)
const senderInput = ref('');

//方法

/**
 * 消息提交
 */
const onSubmit: SenderProps["onSubmit"] = (message: string, _, skill) => {
    loading.value = true;
    console.log(`Send message: ${skill?.value} | ${message}`);
    senderInput.value = '';
    //请求大模型后台
    loading.value = false;
}
const onCancel = () => {
    console.log("取消输入");
}






</script>