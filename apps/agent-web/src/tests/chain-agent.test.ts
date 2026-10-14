import { chainAgent } from "@packages/ai-langchain"
import { describe, it, expect } from 'vitest'

console.log("JAVA_QWEN_APIKEY => ", import.meta.env.JAVA_QWEN_APIKEY);


describe('chainAgent', () => {
    it('should return the correct result', async () => {
        await chainAgent(
            import.meta.env.JAVA_QWEN_APIKEY,
            "https://ws-2gcnpdewhflb89dx.cn-beijing.maas.aliyuncs.com/compatible-mode/v1"
        ).catch(console.error);
    })
})
