<template>
  <div class="page">
    <!-- 3D 画布 -->
    <ThreeBackground ref="threeRef" />

    <!-- 导航栏 -->
    <nav class="nav">
      <a href="/" class="nav-logo">3D<span class="dot">.</span>空间</a>
      <div class="nav-links">
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
      </div>
    </nav>

    <!-- ====== 首屏折叠区 ====== -->
    <div class="fold">
      <section class="hero">
        <p class="hero-greeting">欢迎来到</p>
        <h1 class="hero-name">数字空间<span class="dot">.</span></h1>
        <p class="hero-role">全栈开发 · 三维交互</p>
        <p class="hero-tagline">
          在代码与设计的交汇处<br />
          构建沉浸式数字体验。
        </p>
      </section>

      <!-- 毛玻璃模型卡片 -->
      <section
        class="model-bar"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div
          v-for="m in models"
          :key="m.id"
          class="model-card"
          :class="{ active: m.id === activeId }"
          @click="switchTo(m.id)"
        >
          <span class="card-emoji" @click="jumpPage(m.url)">{{ m.emoji }}</span>
          <div>
            <h3 class="card-title">{{ m.title }}</h3>
            <p class="card-desc">{{ m.desc }}</p>
          </div>
          <span class="card-arrow" >&nearr;</span>
        </div>
      </section>

      <!-- 滚动提示 -->
      <div class="scroll-cue">
        <span class="scroll-text">Scroll</span>
        <span class="scroll-line"></span>
      </div>
    </div>

    <!-- === 折叠线以下 === -->
    <section id="about" class="section about">
      <h2 class="section-label">关于</h2>
      <p class="section-body">
        热爱构建沉浸式三维界面与高性能 Web 应用的全栈开发者。
        从后端架构到像素级前端还原，致力于打造有生命力的数字工具。
      </p>
    </section>

    <section id="contact" class="section contact">
      <h2 class="section-label">联系方式</h2>
      <p class="section-body">
        <a href="mailto:hello@example.com">hello@example.com</a>
      </p>
    </section>

    <footer class="footer">
      <span>&copy; 2026 3D 交互空间</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ThreeBackground from '../components/ThreeBackground.vue';

const threeRef = ref<InstanceType<typeof ThreeBackground> | null>(null);
const activeId = ref('folder');
let autoTimer: ReturnType<typeof setInterval> | null = null;
const AUTO_INTERVAL = 4000;

// 模型数据
const models = [
  { id: 'folder',  emoji: '📂', title: '文件服务', desc: '文件存储与分发系统',           url: '/file/' },
  { id: 'project', emoji: '📦', title: '项目作品', desc: '精选项目与案例展示',           url: '/project/' },
  { id: 'code',    emoji: '🔀', title: '代码仓库', desc: '开源项目与私有代码库',         url: '/code/' },
  { id: 'tools',   emoji: '⚙️',  title: '开发工具', desc: '实用工具与开发实验',         url: '/tools/' },
];

// 切换模型
function switchTo(id: string) {
  if (id === activeId.value) return;
  activeId.value = id;
  threeRef.value?.setActiveModel(id);
}


// 跳转 页面
const jumpPage = (url: string): void => {
  window.open(url, '_self');
};


// 自动播放
function startAutoPlay() {
  stopAutoPlay();
  autoTimer = setInterval(() => {
    threeRef.value?.nextModel();
  }, AUTO_INTERVAL);
}

function stopAutoPlay() {
  if (autoTimer !== null) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function pauseAutoPlay() {
  stopAutoPlay();
}

function resumeAutoPlay() {
  startAutoPlay();
}

onMounted(() => {
  // 等待 ThreeBackground 挂载后注册回调并启动自动播放
  if (threeRef.value) {
    threeRef.value.setOnModelChange((id: string) => {
      activeId.value = id;
    });
    startAutoPlay();
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
/* ================================================================== */
/*  页面框架                                                              */
/* ================================================================== */
.page {
  position: relative;
  min-height: 100vh;
  color: var(--text-primary, #e8e6e3);
  font-family: var(--body-font, 'DM Sans', system-ui, sans-serif);
  overflow-x: hidden;
}

/* ================================================================== */
/*  导航栏                                                                */
/* ================================================================== */
.nav {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 6%;
  box-sizing: border-box;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.nav-logo,
.nav-links a {
  pointer-events: auto;
}
.nav-logo {
  font-family: var(--display-font, 'Playfair Display', Georgia, serif);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-primary, #e8e6e3);
  text-decoration: none;
}
.dot {
  color: var(--accent, #c8960c);
}
.nav-links {
  display: flex;
  gap: 2rem;
}
.nav-links a {
  color: var(--text-secondary, #8a8780);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  transition: color 0.25s;
}
.nav-links a:hover {
  color: var(--text-primary, #e8e6e3);
}

/* ================================================================== */
/*  首屏折叠区                                                            */
/* ================================================================== */
.fold {
  position: relative;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
}

/* ================================================================== */
/*  主视觉区                                                              */
/* ================================================================== */
.hero {
  position: absolute;
  top: 42%;
  left: 6%;
  transform: translateY(-50%);
  z-index: 2;
  max-width: 480px;
  pointer-events: none;
  user-select: none;
}
.hero-greeting {
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-secondary, #8a8780);
  margin: 0 0 8px;
}
.hero-name {
  font-family: var(--display-font, 'Playfair Display', Georgia, serif);
  font-size: clamp(2.8rem, 6vw, 4.8rem);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text-primary, #e8e6e3);
  margin: 0 0 12px;
}
.hero-role {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--accent, #c8960c);
  margin: 0 0 20px;
  letter-spacing: 0.3px;
}
.hero-tagline {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary, #8a8780);
  margin: 0;
  max-width: 360px;
}

/* ================================================================== */
/*  模型卡片（毛玻璃）                                                      */
/* ================================================================== */
.model-bar {
  position: absolute;
  bottom: 10%;
  inset-inline: 6%;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.model-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
  pointer-events: auto;
}
.model-card:hover {
  background: rgba(255, 255, 255, 0.065);
  border-color: rgba(255, 255, 255, 0.13);
  transform: translateY(-3px);
}
.model-card.active {
  border-color: var(--accent, #c8960c);
  background: rgba(200, 150, 12, 0.06);
}

.card-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
}
.card-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 3px;
  color: var(--text-primary, #e8e6e3);
  letter-spacing: 0.2px;
}
.card-desc {
  font-size: 0.72rem;
  color: var(--text-secondary, #8a8780);
  margin: 0;
  line-height: 1.35;
}
.card-arrow {
  margin-left: auto;
  font-size: 1rem;
  color: var(--text-secondary, #8a8780);
  opacity: 0.5;
  transition: opacity 0.3s, transform 0.3s;
}
.model-card:hover .card-arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

/* ================================================================== */
/*  滚动提示                                                              */
/* ================================================================== */
.scroll-cue {
  position: absolute;
  bottom: 3%;
  right: 6%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  user-select: none;
}
.scroll-text {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary, #8a8780);
}
.scroll-line {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, var(--text-secondary, #8a8780), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 0.8; transform: scaleY(1.3); }
}

/* ================================================================== */
/*  内容区域                                                              */
/* ================================================================== */
.section {
  position: relative;
  z-index: 1;
  padding: 80px 6% 60px;
  background: linear-gradient(to bottom, rgba(8, 8, 12, 0.92), rgba(12, 12, 18, 1));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.section-label {
  font-family: var(--display-font, 'Playfair Display', Georgia, serif);
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: var(--text-primary, #e8e6e3);
}
.section-label::after {
  content: '';
  display: block;
  width: 48px;
  height: 2px;
  background: var(--accent, #c8960c);
  margin-top: 12px;
}
.section-body {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary, #8a8780);
  max-width: 600px;
  margin: 0;
}
.section-body a {
  color: var(--accent, #c8960c);
  text-decoration: none;
}

/* 联系方式 */
.contact {
  padding-bottom: 140px;
}

/* 页脚 */
.footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 32px 6%;
  font-size: 0.7rem;
  color: var(--text-secondary, #8a8780);
  letter-spacing: 0.5px;
  background: rgba(12, 12, 18, 1);
}

/* ================================================================== */
/*  响应式布局                                                            */
/* ================================================================== */

/* ── 平板 (≤1024px) ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .model-bar {
    grid-template-columns: repeat(2, 1fr);
    bottom: 8%;
    gap: 12px;
  }
  .hero {
    top: 38%;
    left: 6%;
    right: 6%;
    max-width: none;
  }
  .hero-name {
    font-size: clamp(2.2rem, 5vw, 3.6rem);
  }
  .hero-role {
    font-size: 0.95rem;
  }
  .hero-tagline {
    font-size: 0.82rem;
    max-width: 320px;
  }
  .section {
    padding: 60px 5% 48px;
  }
  .section-label {
    font-size: 1.8rem;
  }
}

/* ── 大屏手机 (≤640px) ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .nav {
    padding: 18px 5%;
  }
  .nav-logo {
    font-size: 1.15rem;
  }
  .nav-links {
    gap: 1rem;
  }
  .nav-links a {
    font-size: 0.75rem;
  }
  .hero {
    top: 34%;
  }
  .hero-greeting {
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
  }
  .hero-name {
    font-size: clamp(1.9rem, 8vw, 2.8rem);
    margin-bottom: 8px;
  }
  .hero-role {
    font-size: 0.85rem;
    margin-bottom: 14px;
  }
  .hero-tagline {
    font-size: 0.78rem;
    max-width: 280px;
  }
  .model-bar {
    bottom: 6%;
    gap: 8px;
  }
  .model-card {
    padding: 14px 16px;
    gap: 10px;
    border-radius: 12px;
  }
  .card-emoji {
    font-size: 1.25rem;
  }
  .card-title {
    font-size: 0.78rem;
  }
  .card-desc {
    font-size: 0.68rem;
  }
  .card-arrow {
    font-size: 0.85rem;
  }
  .scroll-cue {
    bottom: 2%;
  }
  .scroll-text {
    font-size: 0.6rem;
  }
  .scroll-line {
    height: 24px;
  }
  .section {
    padding: 48px 5% 40px;
  }
  .section-label {
    font-size: 1.55rem;
    margin-bottom: 18px;
  }
  .section-label::after {
    width: 36px;
    margin-top: 8px;
  }
  .section-body {
    font-size: 0.9rem;
    max-width: 100%;
  }
  .contact {
    padding-bottom: 100px;
  }
  .footer {
    padding: 24px 5%;
    font-size: 0.65rem;
  }
}

/* ── 小屏手机 (≤420px) ──────────────────────────────────────────── */
@media (max-width: 420px) {
  .nav {
    padding: 14px 4%;
  }
  .nav-logo {
    font-size: 1.05rem;
  }
  .nav-links {
    display: none;
  }
  .hero {
    top: 30%;
    left: 5%;
    right: 5%;
  }
  .hero-greeting {
    font-size: 0.65rem;
    letter-spacing: 1.2px;
  }
  .hero-name {
    font-size: clamp(1.6rem, 9vw, 2.2rem);
  }
  .hero-role {
    font-size: 0.78rem;
  }
  .hero-tagline {
    font-size: 0.72rem;
    max-width: 240px;
  }
  .model-bar {
    grid-template-columns: 1fr;
    bottom: 4%;
    inset-inline: 5%;
    gap: 6px;
  }
  .model-card {
    padding: 12px 14px;
    gap: 8px;
    border-radius: 10px;
  }
  .card-emoji {
    font-size: 1.15rem;
  }
  .card-title {
    font-size: 0.75rem;
  }
  .card-desc {
    font-size: 0.65rem;
  }
  .scroll-cue {
    display: none;
  }
  .section {
    padding: 40px 4% 32px;
  }
  .section-label {
    font-size: 1.35rem;
    margin-bottom: 14px;
  }
  .section-label::after {
    width: 28px;
    height: 1.5px;
    margin-top: 6px;
  }
  .section-body {
    font-size: 0.82rem;
    line-height: 1.6;
  }
  .contact {
    padding-bottom: 80px;
  }
  .footer {
    padding: 20px 4%;
    font-size: 0.6rem;
  }
}

/* ── 横屏手机 / 矮视口 (≤480px 高) ──────────────────────────────── */
@media (max-height: 480px) {
  .hero {
    top: 50%;
  }
  .hero-greeting {
    margin-bottom: 2px;
  }
  .hero-name {
    font-size: clamp(1.4rem, 5vw, 2rem);
    margin-bottom: 4px;
  }
  .hero-role {
    margin-bottom: 6px;
  }
  .hero-tagline {
    display: none;
  }
  .model-bar {
    bottom: 2%;
    gap: 6px;
  }
  .model-card {
    padding: 8px 10px;
  }
  .scroll-cue {
    display: none;
  }
}
</style>
