import {createAgent,tool} from "langchain"
import {z} from "zod"
import { AliyunModel } from "../AliyunModel"


// 定义工具
const searchTool = tool(
    async({query} : {query: string}) => {
        return `${query} 35℃`
    },
    {
        name: "search",
        description: "search tool",
        schema: z.object({
            query: z.string().describe("搜索关键词"),
        }),
    }
)

const calculatorTool = tool(
    async ({text}:{text: string}) => {
        return `calculation result for ${text}`
    },
    {
        name: "calculator",
        description: "calculator tool",
        schema: z.object({
            text: z.string().describe("计算表达式 °F = °C * 9 / 5 + 32"),
        }),
    }
)


const chainAgent = async (apiKey:string, baseUrl:string) => {

    const agent = createAgent({
        model: new AliyunModel(apiKey, baseUrl).qwen(),
        tools: [searchTool, calculatorTool],
        
    });

    const result = await agent.invoke({messages: "请帮我计算一下 35℃ 等于多少 °F"});
    console.log("result => ", result);
    console.log(result.messages.at(-1)?.content);
}







export { chainAgent }