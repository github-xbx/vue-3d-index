import { defineStore } from 'pinia'   // 导入 defineStor
import type { BubbleItemType, } from "@antdv-next/x";




const useSubmitStore = defineStore('submit', {
    state: () => ({
        latestData: '',
        dataList: [] as BubbleItemType[]
    }),
    actions: {
        submitData(value: string, type: string) {
            this.latestData = value;
            this.dataList.push({
                key: "123",
                role: type,
                content: value
            })
        },
        clearData() {
            // 方式一：推荐，保留原数组引用
            this.dataList.length = 0
            // 方式二：直接替换（也可以）
            // this.dataList = []
            this.latestData = ''
        }
    }
})

export { useSubmitStore }