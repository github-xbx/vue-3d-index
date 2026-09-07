import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";


export class AliyunModel {



    public qwen(): ChatOpenAI{

        

        // 创建 open ai 实例，使用的模型需兼容 openai 的接口
        const qwenModel = new ChatOpenAI({
            apiKey: import.meta.env.JAVA_QWEN_APIKEY,
            model: "glm-5.2",
            configuration: {
                baseURL: "https://ws-2gcnpdewhflb89dx.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
            },
            temperature: 0.9,
        });

        return qwenModel;

    }

    /**
     * 创建一个聊天请求，返回模型的响应
     * @param prompt 请求消息
     * @returns 
     */
    public async chat(prompt: string): Promise<String> {

        const response = await this.qwen().invoke([
            new HumanMessage(prompt)
        ]);
        console.log("DEBUG => ", response);
        return response.text;

    }


    /**
     * 流式输出
     * @param prompt 
     */
    public async chatStream(prompt: string): Promise<ReadableStream> {
        const messages = [new HumanMessage(prompt)];

        // 1. 调用 .stream() 获取一个异步迭代器
        const stream = await this.qwen().stream(messages);

       return stream;

    }


}