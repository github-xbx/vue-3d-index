import { defineComponent } from 'vue'
import { CopilotThreadsDrawer } from "@copilotkit/vue";


const AiDrawer = defineComponent({

    emits: ['threadSelect', 'newThread'],
    props: {

    },

    // 下划线表示有意忽略
    setup(_props, { emit }) {

        /**
         * 新建对话事件
         */
        const handleNewThread = () => {
            console.log("New thread created (welcome screen visible)");
            emit('newThread')
        }

        const handleThreadSelect = (threadId: string) => {
            console.log("11111111:", threadId);
            emit('threadSelect', threadId)
        }

        return () => (
            <CopilotThreadsDrawer 
                agent-id="default" 
                recent-label="历史对话" 
                onThreadSelect={handleThreadSelect}
                onNewThread={handleNewThread}>
            </CopilotThreadsDrawer>
        )
    }

})

export default AiDrawer