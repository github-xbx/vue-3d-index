<template>
  <div ref="canvasContainer" class="three-canvas"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { PortfolioScene } from '../composables/three/PortfolioScene';

const canvasContainer = ref<HTMLDivElement | null>(null);
let scene: PortfolioScene | null = null;

onMounted(() => {
  if (!canvasContainer.value) return;
  scene = new PortfolioScene(canvasContainer.value);
  scene.init();
});

onUnmounted(() => {
  scene?.dispose();
  scene = null;
});

// 切换到指定模型
function setActiveModel(id: string) {
  scene?.setActiveModel(id);
}

// 切换到上一个模型
function prevModel() {
  scene?.prevModel();
}

// 切换到下一个模型
function nextModel() {
  scene?.nextModel();
}

// 获取所有模型 ID
function getModelIds(): string[] {
  return scene?.getModelIds() ?? [];
}

// 获取当前激活模型 ID
function getActiveModelId(): string {
  return scene?.getActiveModelId() ?? 'folder';
}

// 注册模型切换回调
function setOnModelChange(cb: (id: string) => void) {
  scene?.setOnModelChange(cb);
}

defineExpose({ setActiveModel, prevModel, nextModel, getModelIds, getActiveModelId, setOnModelChange });
</script>

<style scoped>
.three-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
}
</style>
