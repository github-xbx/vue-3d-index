import { defineComponent } from 'vue'
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue";
import "@copilotkit/vue/styles.css";


export default defineComponent({
  name: 'ChatPage1',
  setup() {
    //const currentThreadId = ref<string | null>(null)


    return () => (
       <CopilotKitProvider runtime-url="http://127.0.0.1:8080/api/copilotkit">
         <CopilotChat> </CopilotChat>
        </CopilotKitProvider>
    )
  }

  
})