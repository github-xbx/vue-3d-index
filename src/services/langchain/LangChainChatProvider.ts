import { AbstractChatProvider,AbstractXRequestClass, type TransformMessage, type XRequestOptions } from "@antdv-next/x-sdk"


/**-------- 类型定义 -------- */
interface LangChainInput {
    query: string,
    history?: Array<LangChainMessage>
}

interface LangChainOutput {
    content: string,
    reasoning?: string,
    done?:boolean,
}

interface LangChainMessage {
  content: string
  role: 'user' | 'assistant',
  reasoning?: string,
}

class LangChainChatProvider extends AbstractChatProvider<LangChainMessage, LangChainInput, LangChainOutput> {


    /** 由外部注入真正的 request（LangChainXRequest），不再自己造占位 XRequest */
    constructor(request: AbstractXRequestClass<LangChainInput, LangChainOutput, LangChainMessage>) {
        
        super({request})
        
    }


    /** 合并外部传入的 request 配置与 onRequest 参数 */
    transformParams(requestParams: Partial<LangChainInput>, options: XRequestOptions<LangChainInput, LangChainOutput, LangChainMessage>): LangChainInput {
       console.log(options)
        return {
            query: requestParams.query || '',
            history: requestParams.history || [],
        }
    }

    /** 将用户输入转为本地展示的消息 */
    transformLocalMessage(requestParams: Partial<LangChainInput>): LangChainMessage {
        
        return {
            content: requestParams.query || '',
            role: 'user'
        }

    }

    /**
     * 关键修正：原来只按 chunks 拼全量，但 useXChat 在 updating 阶段传进来的
     * chunks 恒为 []（见 x-chat/index.js: updateMessage("updating", chunk, [], headers)），
     * 会导致每一跳都把内容刷成空串。
     * 正确做法是像内置的 OpenAIChatProvider 一样，用 originMessage 续写增量。
     */
    transformMessage(info: TransformMessage<LangChainMessage, LangChainOutput>): LangChainMessage {
        const { originMessage, chunk } = info

        const reasoning = `${originMessage?.reasoning ?? ""}${chunk?.reasoning ?? ""}`
        return {
            content: `${originMessage?.content ?? ""}${chunk?.content ?? ""}`,
            reasoning: reasoning || undefined,
            role: "assistant"
        }


    }
}




export type {LangChainInput, LangChainOutput, LangChainMessage};

export {LangChainChatProvider};