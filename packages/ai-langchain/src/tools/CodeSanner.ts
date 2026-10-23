import { DynamicStructuredTool, DynamicTool, tool } from "@langchain/core/tools";
import {vfs, collectFiles} from "../services/vfs/index"


const  vfsBackend =  await vfs();





const globFilesToolFunction = async ({pattern} : {pattern:string}) => {
    console.log("pattern",pattern,"vfs",vfsBackend)
    const result = await vfsBackend.glob(pattern);
    console.log("result",result)
    const files = (result.files ?? []).filter(e => !e.is_dir);
    console.log("files",files)
    return files.map(f => f.path).join("\n");
}
const readFileToolFunction = async ({filePath}: {filePath: string}) => {
    const result = await vfsBackend.read(filePath);
    return result.content;
}
const grepContentToolFunction = async ({ pattern, filePattern }: {pattern: string, filePattern: string}) => {
    const globResult = await vfsBackend.glob(filePattern, "**/*");
    const files = (globResult.files ?? []).filter(e => !e.is_dir)
    const matches: string[] = [];
    const regex = new RegExp(pattern, "g");

    for(const file of files){
        const { content } = await vfsBackend.read(file.path);
        const lines = content.split("\n");
        lines.forEach((line: string, index: string) => {
            if(regex.test(line)){
                matches.push(`${file.path}:${index + 1}: ${line.trim()}`);
            }
            regex.lastIndex = 0 //重置正则状态
        })
    }
    return matches.length > 0 ? matches.join("\n") : "未找到匹配内容。";
}

const globFilesTool = tool(
    globFilesToolFunction,
    {
        name: "globFileTool",
        description: "根据 glob 模式查找文件。支持标准模式如 '**/*.ts' 或 'src/**/*.tsx'。返回匹配的文件路径列表。",
        schema: {
            type:"object",
            properties: {
                pattern: {
                    type: "string",
                }
            }
           
        },
    }
)

const readFileTool = tool(
    readFileToolFunction,
    {
        name:"readFileTool",
        description: "读取指定路径文件的完整内容。",
        schema: {
            type: "object",
            properties: {
                filePath:{ 
                    type: "string"
                }
            }
            
        }
    }
)

const grepContentTool = tool(
    grepContentToolFunction,
    {
        name: "grepContentTool",
        description:"在代码文件内容中搜索匹配指定正则表达式或字符串的行。用于查找函数定义、变量引用等。",
        schema: {
            type: "object",
            properties: {
                pattern: {
                    type: "string",
                    description: "要搜索的正则表达式"
                },
                filePattern: {
                    type: "string",
                    description: "限定搜索的文件 glob，比如 src/**/*.ts"
                }
            }
        }
    }
)

type ToolType = DynamicTool | DynamicStructuredTool




const files = await globFilesToolFunction({pattern: "E:\\code\\vue-3d-index\\apps\\3d-index-web\\"});
console.log(collectFiles("E:\\code\\vue-3d-index\\apps\\3d-index-web\\"));




const codeSannerTools :ToolType[] = [globFilesTool, readFileTool, grepContentTool]


export {codeSannerTools}



