import { VfsBackend } from "@langchain/node-vfs"

interface ScannedFile {
    path: string;
    content: string;
    size: number;
}
/**
 * 用于填充虚拟文件系统的初始文件。
 *
 * 键是文件路径（相对于虚拟文件系统（VFS）根目录），值是文件内容。
 *
 * @example
 * ```typescript
 * initialFiles: {
 *   "/src/index.js": "console.log('Hello')",
 *   "/package.json": '{"name": "my-app"}',
 * }
 * ```
 */
const exts = ['ts', 'tsx', 'js', 'jsx']

const fileScanning = async (initialFiles: Record<string, string>, scanPattern: string = `**/*`): Promise<ScannedFile[]> => {

    console.log("param => ",initialFiles , scanPattern)
    const backednd = await VfsBackend.create({ initialFiles });

    const scannedFiles: ScannedFile[] = [];



    try {
        //1.用 glob 快速筛选出需要的扫描文件
        const matchResult  = await backednd.glob(scanPattern);
        console.log("matchResult => ",matchResult)
        //2. 遍历匹配结果，读取文件内容
        for (const filePath of matchResult.files) {
            const fileResult = await backednd.read(filePath.path);
            scannedFiles.push({
                path: filePath.path,
                content: fileResult.content?.toString() ?? "",
                size: fileResult.content?.length || 0
            });
        }
        return scannedFiles;
    } catch (erroe){
        throw erroe
    } finally {
        await backednd.stop();
    }
}


const filesToScan = await fileScanning({
  "/src/*": "",
  
});
console.log(`准备扫描 ${filesToScan.length} 个文件`);