import {createAgent,tool} from "langchain"
import {z} from "zod"
import { AliyunModel } from "../AliyunModel"
import { type ToolRun, type ToolMsg } from "@packages/ai-tools"
import {codeSannerTools} from '../../tools/CodeSanner'

// 定义工具
const searchTool = tool(
    ({query} : {query: string}) => {
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
    ({text}:{text: string}) => {
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

const testrun : ToolRun = ({text}) => {
    return `ToolRun output ${text}`
}

const testMesage : ToolMsg = {
    name:"test",
    description:"测试 tool",
    schema: {
        "text": "输出一段字符串"
    }
}

const testTool = tool(testrun, testMesage);


const chainAgent = async (apiKey:string, baseUrl:string) => {

    const agent = createAgent({
        model: new AliyunModel(apiKey, baseUrl).qwen(),
        tools: [searchTool, calculatorTool, testTool, ...codeSannerTools],
        
    });

    const result = await agent.invoke({messages: "扫描 E:\\code\\vue-3d-index\\apps\\3d-index-web 目录下的代码"},{recursionLimit: 50});
    console.log("result => ", result);
    console.log(result.messages.at(-1)?.content);
}







export { chainAgent }