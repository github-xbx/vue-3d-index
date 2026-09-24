import { AbstractChatProvider,XRequest, type TransformMessage, type XRequestOptions } from "@antdv-next/x-sdk"


/**-------- 类型定义 -------- */
interface LangChainInput {
    query: string,
    history?: Array<LangChainMessage>
}

interface LangChainOutput {
    content: string,
    done?:boolean,
}

interface LangChainMessage {
  content: string
  role: 'user' | 'assistant'
}

class LangChainChatProvider extends AbstractChatProvider<LangChainMessage, LangChainInput, LangChainOutput> {


    constructor() {
        // 传入一个空的 XRequest（manual 模式），实际请求由 LangChain 接管
       // 占位请求：manual 模式下不会 init()，永远不会真的发出去
        super({
            request: XRequest<LangChainInput, LangChainOutput, LangChainMessage>(
                '/api/langchain-placeholder',
                { manual: true },
            ),
        })
        
    }


    /** 合并外部传入的 request 配置与 onRequest 参数 */
    transformParams(requestParams: Partial<LangChainInput>, options: XRequestOptions<LangChainInput, LangChainOutput, LangChainMessage>): LangChainInput {
        console.debug('DEBUG => ',options)
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
     * 处理 LangChain 的流式回调
     * info.chunk 是 LangChain 每次 onLLMNewToken 返回的 token增量 
     * info.chunks 是已积累的所有chunk
     * info.ststus 是当前的请求状态
     * @param info 
     */
    transformMessage(info: TransformMessage<LangChainMessage, LangChainOutput>): LangChainMessage {
        const { originMessage, chunks, status } = info

        console.debug(originMessage, status)
        //将所有的 chunk 的 content 拼接成完整的文本
        const fullContent = chunks.map((c) => c?.content || '').join('');

        return {
            content: fullContent,
            role: "assistant"
        }


    }
}




export type {LangChainInput, LangChainOutput, LangChainMessage};

export {LangChainChatProvider};