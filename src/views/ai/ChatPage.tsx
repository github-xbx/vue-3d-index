import { defineComponent, ref } from 'vue'
import { CopilotKitProvider } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css";
import AiChat from "../../components/ai/AiChat.tsx";
import AiDrawer from "../../components/ai/AiDrawer.tsx";

export default defineComponent({
  name: 'ChatPage',
  setup() {
    const url = import.meta.env.VITE_AI_URL;
    const currentThreadId = ref<string>();
    const chatKey = ref(0);


    function handleThreadSelect(threadId: string) {
        currentThreadId.value = threadId;
        chatKey.value++;
        console.log("Thread selected:", threadId);
    }

    /**
     * 新建对话事件
     */
    const handleNewThread = () => {
        // undefined → hasExplicitThreadId 为 false → 欢迎界面正常显示
        // :key 递增强制 CopilotChat 重新挂载，内部生成全新 UUID
        // 用户发送第一条消息时后端才会真正创建线程
        currentThreadId.value = undefined;
        chatKey.value++;
        console.log("chatKey:", chatKey.value);
    }

    function handleError(event: {
        error: Error;
        code: string;
        context: Record<string, any>;
    }) {
        console.error("[CopilotKit Error]", event.code, event.error.message, event.context);
    }


    return () => (
       <CopilotKitProvider runtime-url={url} onError={handleError}>
            <div style="display: flex; height: 100vh;">
                <AiDrawer  onThreadSelect={handleThreadSelect} onNewThread={handleNewThread}/>
                <AiChat currentThreadId={currentThreadId.value} chatKey={chatKey.value} />
            </div>
            
        </CopilotKitProvider>
    )
  }

  
})

