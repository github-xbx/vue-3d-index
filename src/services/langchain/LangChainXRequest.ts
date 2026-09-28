import { AbstractXRequestClass, type XRequestConfigOptions } from "@antdv-next/x-sdk"
import type { LangChainInput, LangChainMessage, LangChainOutput } from "./LangChainChatProvider"



/** 产出 token的方式 由调用方法注入 ChatOpenAI的流式接口 */

// LangChainStreamProducer 是一个函数类型。
// 这个函数接收 LangChainInput 和 AbortSignal，返回一个异步可迭代对象，里面每次产出的是 string。
type LangChainStreamProducer = (
    params: LangChainInput,
    signal: AbortSignal
) => AsyncIterable<LangChainOutput> // => 表示函数类型：左边是参数，右边是返回值类型。


//LangChainXRequestOptions 同时满足 XRequestConfigOptions的属性 和 额外的 produce
type LangChainXRequestOptions = XRequestConfigOptions<
 LangChainInput,LangChainOutput,LangChainMessage
> & { produce: LangChainStreamProducer } //& 是 TypeScript 的交叉类型，表示“并且 / 同时满足”。


/**
 * 自定义 XRequest
 * 
 * XRquest 只会 fetch + 解析 SSE ，而这里是 LangChain SDK 直连的异步迭代器
 * 所以自己实现的AbstractXRequestClass，把token手动喂给 callbacks
 * useXChat 内部只用到了manual/ options.callbacks/run(param)/abort()/ asyncHandler 这几项。
 */
class LangChainXRequest extends AbstractXRequestClass<LangChainInput,LangChainOutput,LangChainMessage> { 

    private readonly produce: LangChainStreamProducer;
    private requesting = false;
    private pending: Promise<void> = Promise.resolve();
    private abortController: AbortController | null = null;


    constructor(baseUrl:string, options:LangChainXRequestOptions){
        super(baseUrl, options);
        this.produce = options.produce;
    }


    /** AbstractChatProvider 构造函数会校验 !request.manual 就抛错，必须为 true */
    get manual(): boolean {
        return true;
    }


    get isRequesting(): boolean {
        return this.requesting;
    }


    get isTimeout(): boolean {
        return false;
    }

    get isStreamTimeout(): boolean {
        return false;
    }

    get state() {
        return {
            isTimeout: false,
            isStreamTimeout: false,
            isRequesting: this.requesting
        }
    }

    get asyncHandler(): Promise<void> { 
        return this.pending;
    }

    run(params?: LangChainInput): void {
        if(!params)
            return;
        this.abortController = new AbortController();
        this.requesting = true;

        const signal = this.abortController.signal;
        //useXChat 的 transformMessage 会读 handler.get('content-type')之类，给个真实 Headers
        const headers = new Headers()
        const callbacks = this.options.callbacks;
        const chunks: LangChainOutput[] = []

        this.pending = (async() => {
            try{
                for await (const token of this.produce(params, signal)){
                    if(!token?.content && !token?.reasoning)
                        continue;
                    console.log(token)
                    //const chunk: LangChainOutput = {content: token, done: false}
                    chunks.push(token);
                    
                    //注： updating阶段 useXChat 只把chunk传下去，chunks 会被丢掉
                    callbacks?.onUpdate?.(token,headers);
                }
                callbacks?.onSuccess?.(chunks,headers)
            }catch(error: any) {
                //name === "AbortError" 时候 useXChat 会把消息状态设置为 abort
                callbacks?.onError?.(
                    error instanceof Error ? error : new Error(String(error)),
                    undefined,
                    headers
                )
            }finally {
                this.requesting = false;
            }

        })()
        
    }

    abort(): void {
        this.abortController?.abort();
    }

    

}



export type {LangChainStreamProducer, LangChainXRequestOptions}
export { LangChainXRequest}
