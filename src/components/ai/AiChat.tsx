import { defineComponent } from 'vue'
import { CopilotChat } from "@copilotkit/vue";
import type { CopilotChatLabels } from "@copilotkit/vue";



// 定义你的对象（不加类型约束，让 TS 推导字面量）
const ChatLabels = {
  chatInputPlaceholder: "请输入内容......",
  chatInputToolbarStartTranscribeButtonLabel: "Transcribe",
  chatInputToolbarCancelTranscribeButtonLabel: "Cancel",
  chatInputToolbarFinishTranscribeButtonLabel: "Finish",
  chatInputToolbarAddButtonLabel: "Add photos or files",
  chatInputToolbarToolsButtonLabel: "Tools",
  assistantMessageToolbarCopyCodeLabel: "Copy",
  assistantMessageToolbarCopyCodeCopiedLabel: "Copied",
  assistantMessageToolbarCopyMessageLabel: "Copy",
  assistantMessageToolbarThumbsUpLabel: "Good response",
  assistantMessageToolbarThumbsDownLabel: "Bad response",
  assistantMessageToolbarReadAloudLabel: "Read aloud",
  assistantMessageToolbarRegenerateLabel: "Regenerate",
  userMessageToolbarCopyMessageLabel: "Copy",
  userMessageToolbarEditMessageLabel: "Edit",
  chatDisclaimerText:"人工智能可能会出错。请核实重要信息。",
  chatToggleOpenLabel: "Open chat",
  chatToggleCloseLabel: "Close chat",
  modalHeaderTitle: "CopilotKit Chat",
  welcomeMessageText: "欢迎使用 CopilotKit 聊天。",
}  as unknown as CopilotChatLabels;

export default defineComponent({
  name: 'AiChat',
  props: {
    currentThreadId: String,
    chatKey: Number
  },
  setup(props) {

    return () => (
      <CopilotChat 
        style="flex: 1; height: 100vh;" 
        labels={ ChatLabels } 
        agent-id="deepseek"
        thread-id={ props.currentThreadId } 
        key={ props.chatKey } >
      </CopilotChat>
    )
  }
})