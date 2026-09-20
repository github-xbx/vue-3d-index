<template>
    <div>
        <Welcome variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="你好，我是智能助手 X" description="基于 Antdv Next 的 AGI 产品界面解决方案，打造更美好的智能愿景~">
            <template #extra>
                <a-flex :gap="8">
                    <a-button>
                        <template #icon>
                            <ShareAltOutlined />
                        </template>
                    </a-button>
                    <a-button>
                        <template #icon>
                            <EllipsisOutlined />
                        </template>
                    </a-button>
                </a-flex>
            </template>
        </Welcome>

        <Prompts class="mt-6 w-full md:w-2/3 lg:w-3/4 xl:2/3" :styles="{
            title: {
                'margin-top': '1em',
                'margin-bottom': '1em',
            }
        }" wrap title="✨ 灵感火花 和 提示。" :items="items">
        </Prompts>
    </div>

</template>
<script  setup lang="ts">
import { EllipsisOutlined, ShareAltOutlined } from "@antdv-next/icons";
import { Welcome, Prompts } from "@antdv-next/x";
import type {PromptsProps } from "@antdv-next/x";
//数据 
let items: PromptsProps['items'] = [
    {
        key: '1',
        label: '🌟 Spark of Inspiration',
        description: 'Discover the wonders of the universe and unlock your creativity.',
        
    },
    {
        key: '2',
        label: '💡 Brilliant Ideas',
        description: 'Explore innovative concepts and bring your visions to life.',
        
    },
    {
        key: '3',
        label: '🚀 Launch Your Dreams',
        description: 'Take your aspirations to new heights and achieve greatness.',
       
    },
     {
        key: '4',
        label: '🚀 Launch Your Dreams',
        description: 'Take your aspirations to new heights and achieve greatness.',
       
    },
     {
        key: '5',
        label: '🚀 Launch Your Dreams',
        description: 'Take your aspirations to new heights and achieve greatness.',
       
    },
];

</script>