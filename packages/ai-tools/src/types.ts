


interface Tools<I, O> {
    execute: (input: I) => Promise<O>;
}

export type ToolSchema = Record<string, unknown>;

export type ToolMsg = {
    name: string;
    description: string;
    schema: ToolSchema;
}

/**
 * 工具运行方法
 */
export interface ToolRun{
    (text: { text: string }) : string
}

