import * as THREE from 'three';
import { createFolderModel, createProjectModel, createCodeRepoModel, createAppToolsModel } from './GeometricModels';

const BASE_SCALE = 3.0;
const HOVER_SCALE = 3.45;

// 模型条目：存储场景中每个模型的相关状态
interface ModelEntry {
  id: string;
  group: THREE.Group;
  url: string;
  color: THREE.Color;
  hoverTarget: number;
  hoverCurrent: number;
}

export class PortfolioScene {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId = 0;
  private particlesMesh!: THREE.Points;

  // 鼠标交互相关
  private mouseX = 0;
  private mouseY = 0;
  private pointer = new THREE.Vector2();
  private pointerDown = new THREE.Vector2();
  private pointerUp = new THREE.Vector2();

  private models: Map<string, ModelEntry> = new Map();
  private raycaster = new THREE.Raycaster();
  private activeModelId = 'folder';

  // 模型切换回调（通知 Vue 层更新 UI）
  private onModelChange: ((id: string) => void) | null = null;

  // 模型 ID 顺序列表
  private modelOrder = ['folder', 'project', 'code', 'tools'];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /* ------------------------------------------------------------------------ */
  /*  公开方法                                                                  */
  /* ------------------------------------------------------------------------ */

  // 初始化场景、相机、灯光、模型并启动渲染循环
  init(): void {
    this.initThree();
    this.createModels();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.handleMouseMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    this.startLoop();
  }

  // 设置模型切换回调
  setOnModelChange(cb: (id: string) => void): void {
    this.onModelChange = cb;
  }

  // 切换到指定模型
  setActiveModel(id: string): void {
    if (this.activeModelId === id) return;
    this.activeModelId = id;
    this.applyScaleTargets();
    this.onModelChange?.(id);
  }

  // 切换到上一个模型
  prevModel(): void {
    const idx = this.modelOrder.indexOf(this.activeModelId);
    const prev = this.modelOrder[(idx - 1 + this.modelOrder.length) % this.modelOrder.length];
    this.setActiveModel(prev);
  }

  // 切换到下一个模型
  nextModel(): void {
    const idx = this.modelOrder.indexOf(this.activeModelId);
    const next = this.modelOrder[(idx + 1) % this.modelOrder.length];
    this.setActiveModel(next);
  }

  // 获取所有模型 ID（保持顺序）
  getModelIds(): string[] {
    return [...this.modelOrder];
  }

  // 获取当前激活的模型 ID
  getActiveModelId(): string {
    return this.activeModelId;
  }

  // 销毁场景，释放所有资源
  dispose(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
    if (this.renderer) this.renderer.dispose();
    this.disposeScene();
  }

  /* ------------------------------------------------------------------------ */
  /*  内部初始化                                                                */
  /* ------------------------------------------------------------------------ */

  // 初始化 Three.js 核心组件：场景、相机、渲染器、灯光、粒子
  private initThree(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08080c);
    this.scene.fog = new THREE.FogExp2(0x08080c, 0.00025);

    // 透视相机
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    this.camera.position.set(0, 0.8, 12);
    this.camera.lookAt(0, 0, 0);

    // WebGL 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // 环境光
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // 主方向光
    const key = new THREE.DirectionalLight(0xfffaf0, 3);
    key.position.set(8, 12, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 60;
    key.shadow.camera.left = -15;
    key.shadow.camera.right = 15;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    this.scene.add(key);

    // 补光
    const fill = new THREE.DirectionalLight(0x8899cc, 0.6);
    fill.position.set(-5, 2, -4);
    this.scene.add(fill);

    // 背景粒子
    this.createParticles();
  }

  // 创建散布在空间中的粒子背景
  private createParticles(): void {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = 12 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i] = Math.cos(theta) * Math.sin(phi) * r;
      pos[i + 1] = Math.sin(theta) * Math.sin(phi) * r;
      pos[i + 2] = Math.cos(phi) * r * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xc8b898,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particlesMesh = new THREE.Points(geo, mat);
    this.scene.add(this.particlesMesh);
  }

  // 创建四个展示模型，全部置于原点
  private createModels(): void {
    const origin = new THREE.Vector3(0, 0, 0);

    const folderGroup = createFolderModel();
    const projectGroup = createProjectModel();
    const codeGroup = createCodeRepoModel();
    const toolsGroup = createAppToolsModel();

    const configs = [
      { id: 'folder',  group: folderGroup,  color: new THREE.Color(0xc8960c), url: '/file/' },
      { id: 'project', group: projectGroup, color: new THREE.Color(0x4a9eff), url: '/project/' },
      { id: 'code',    group: codeGroup,    color: new THREE.Color(0x3dd68c), url: '/code/' },
      { id: 'tools',   group: toolsGroup,   color: new THREE.Color(0x8b5cf6), url: '/tools/' },
    ];

    configs.forEach((cfg) => {
      cfg.group.position.copy(origin);
      this.scene.add(cfg.group);

      this.models.set(cfg.id, {
        id: cfg.id,
        group: cfg.group,
        url: cfg.url,
        color: cfg.color,
        hoverTarget: 0,
        hoverCurrent: 0,
      });

      // 每模型对应颜色的点光源（排列在周围避免重叠）
      const lightPos = new THREE.Vector3(
        (cfg.group === folderGroup ? -1 : cfg.group === projectGroup ? 1 : cfg.group === codeGroup ? -1 : 1) * 1.2,
        1.2,
        (cfg.group === folderGroup ? 1 : cfg.group === projectGroup ? -1 : cfg.group === codeGroup ? 1 : -1) * 1.2,
      );
      const pt = new THREE.PointLight(cfg.color, 1.5, 6, 2);
      pt.position.copy(lightPos);
      this.scene.add(pt);
    });

    // 中央装饰光环
    const ringGeo = new THREE.TorusGeometry(0.85, 0.015, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc8960c,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.4;
    this.scene.add(ring);

    // 初始状态：folder 显示，其余隐藏
    this.applyScaleTargets();
    const active = this.models.get('folder');
    if (active) active.hoverCurrent = BASE_SCALE;
  }

  // 根据 activeModelId 设置各模型的缩放目标
  private applyScaleTargets(): void {
    this.models.forEach((entry, id) => {
      entry.hoverTarget = id === this.activeModelId ? BASE_SCALE : 0;
    });
  }

  /* ------------------------------------------------------------------------ */
  /*  动画循环                                                                  */
  /* ------------------------------------------------------------------------ */

  private startLoop(): void {
    const clock = new THREE.Clock();
    const animate = (): void => {
      this.animationId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // 背景粒子缓慢旋转
      if (this.particlesMesh) {
        this.particlesMesh.rotation.y += dt * 0.03;
      }

      // 所有模型的缩放与浮动动画
      this.models.forEach((entry) => {
        const g = entry.group;
        if (!g) return;

        // 缩放平滑过渡
        entry.hoverCurrent += (entry.hoverTarget - entry.hoverCurrent) * 0.08;
        g.scale.setScalar(entry.hoverCurrent);

        // 仅激活模型自转和浮动
        if (entry.id === this.activeModelId) {
          g.rotation.y += dt * 0.2;
          g.position.y = Math.sin(elapsed * 0.8) * 0.3;
        }
      });

      // 子动画：仅处理激活模型
      this.animateSubModels(dt, elapsed);

      // 相机视差效果
      this.camera.position.x += (this.mouseX * 3.5 - this.camera.position.x) * 0.025;
      this.camera.position.y += (this.mouseY * 1.5 + 0.8 - this.camera.position.y) * 0.025;
      this.camera.lookAt(0, 0, 0);

      // 射线检测：仅检测激活模型
      this.pointer.set(this.mouseX, this.mouseY);
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const activeEntry = this.models.get(this.activeModelId);
      let isHovering = false;
      if (activeEntry && activeEntry.hoverCurrent > 0.3) {
        const hits = this.raycaster.intersectObject(activeEntry.group, true);
        if (hits.length > 0) {
          isHovering = true;
        }
      }

      // 悬停时微放大
      if (activeEntry) {
        if (isHovering) {
          activeEntry.hoverTarget = HOVER_SCALE;
          document.body.style.cursor = 'pointer';
        } else {
          activeEntry.hoverTarget = BASE_SCALE;
          document.body.style.cursor = 'default';
        }
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  // 处理各模型内部的子元素动画
  private animateSubModels(dt: number, elapsed: number): void {
    // 项目模型：卫星立方体公转
    const projectEntry = this.models.get('project');
    if (projectEntry && projectEntry.hoverCurrent > 0.3) {
      projectEntry.group.children.forEach((child) => {
        if (child.userData?.orbitR !== undefined) {
          child.userData.orbitPhase += dt * child.userData.orbitSpeed;
          const phase = child.userData.orbitPhase;
          const r = child.userData.orbitR;
          child.position.x = Math.cos(phase) * r;
          child.position.z = Math.sin(phase) * r;
        }
      });
    }

    // 文件夹模型：文档浮动
    const folderEntry = this.models.get('folder');
    if (folderEntry && folderEntry.hoverCurrent > 0.3) {
      folderEntry.group.children.forEach((child) => {
        if (child.userData?.paper) {
          const p = child.userData;
          child.position.y = p.baseY + Math.sin(elapsed * 0.9 + p.phase) * 0.035;
          child.position.z = (p.baseZ ?? 0.11) + Math.sin(elapsed * 0.7 + p.phase) * 0.015;
        }
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /*  事件处理                                                                  */
  /* ------------------------------------------------------------------------ */

  // 鼠标移动：记录归一化坐标
  private handleMouseMove = (event: MouseEvent): void => {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  // 鼠标按下
  private onPointerDown = (event: PointerEvent): void => {
    this.pointerDown.set(event.clientX, event.clientY);
  };

  // 鼠标释放：判断点击并导航
  private onPointerUp = (event: PointerEvent): void => {
    this.pointerUp.set(event.clientX, event.clientY);
    if (this.pointerDown.distanceTo(this.pointerUp) > 3) return;

    // 仅检测激活模型的点击
    const activeEntry = this.models.get(this.activeModelId);
    if (!activeEntry || activeEntry.hoverCurrent < 0.3) return;

    this.pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObject(activeEntry.group, true);

    if (hits.length > 0 && activeEntry.url) {
      window.open(activeEntry.url, '_self');
    }
  };

  // 窗口尺寸变化
  private onWindowResize = (): void => {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // 递归清理场景
  private disposeScene(): void {
    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0];
      this.scene.remove(obj);
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else if (m.material) {
            m.material.dispose();
          }
        }
      });
    }
  }
}
