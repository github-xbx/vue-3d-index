import * as THREE from 'three';

/* ========================================================================== */
/*  文件夹模型 — 后板正方形 + 前板矩形倾斜相交 + 底面弧形过渡 + 直角梯形标签页    */
/* ========================================================================== */

/** 构建微圆角矩形 Shape */
function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function createFolderModel(): THREE.Group {
  const group = new THREE.Group();

  // 主体材质 — 暖金色
  const folderMat = new THREE.MeshStandardMaterial({
    color: 0xf0c040,
    metalness: 0.25,
    roughness: 0.2,
    emissive: 0x1a1000,
    emissiveIntensity: 0.25,
  });

  // 暗面材质 — 侧面/底面用
  const sideMat = new THREE.MeshStandardMaterial({
    color: 0xd4a020,
    metalness: 0.25,
    roughness: 0.3,
    emissive: 0x0a0800,
    emissiveIntensity: 0.2,
  });

  const panelExtrudeOpts: THREE.ExtrudeGeometryOptions = {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
  };

  

  // ── 后板：正方形（左上角直角，其余三角微圆角） ──
  const backShape = (() => {
    const bw = 1.3, bh = 1.0, br = 0.05;
    const bx = -bw / 2, by = -bh / 2;
    const s = new THREE.Shape();
    s.moveTo(bx + br, by);
    s.lineTo(bx + bw - br, by);
    s.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    s.lineTo(bx + bw, by + bh - br);
    s.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    // 顶边 → 左上角直角，无圆角
    s.lineTo(bx, by + bh);
    s.lineTo(bx, by + br);
    s.quadraticCurveTo(bx, by, bx + br, by);
    return s;
  })();
  const backGeo = new THREE.ExtrudeGeometry(backShape, panelExtrudeOpts);
  backGeo.translate(0, 0, -0.05);
  group.add(new THREE.Mesh(backGeo, folderMat));

  // ── 前板：矩形，底部与后板底线重合，向前倾斜 ──
  const frontPivot = new THREE.Group();
  frontPivot.position.set(0, -0.5, 0.02);

  const frontShape = roundedRectShape(1.2, 0.68, 0.05);
  const frontGeo = new THREE.ExtrudeGeometry(frontShape, panelExtrudeOpts);
  frontGeo.translate(0, 0.34, 0); // 几何体中心移至 pivot 上方（半高）
  const frontPanel = new THREE.Mesh(frontGeo, [folderMat, sideMat]);
  frontPivot.add(frontPanel);
  frontPivot.rotation.x = 0.38; // 绕底线向前倾斜 ~22°
  group.add(frontPivot);

  // ── 底面弧形过渡：半圆柱连接前后板 ──
  const curveGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.25, 16);
  curveGeo.rotateZ(Math.PI / 2); // 轴线转至 X 轴
  const curveMesh = new THREE.Mesh(curveGeo, sideMat);
  curveMesh.position.set(0, -0.48, 0.05);
  group.add(curveMesh);

  // ── 标签页：直角梯形，位于后板左上角，四角微圆角过渡 ──
  const tabShape = new THREE.Shape();
  const tabY = 0.5;          // 后板顶边
  const tabH = 0.1;          // 梯形高度
  const tabBottomW = 0.5;    // 底边宽
  const tabTopW = 0.4;      // 顶边宽
  const tabX = -0.655;         // 后板左边
  const tr = 0.012;          // 圆角半径

  // 斜边方向（右下→左上）：(-0.1, 0.1) 归一化 ≈ (-0.707, 0.707)
  const sdx = -0.707;
  const sdy = 0.707;

  // 起点：底边左端圆角之后
  tabShape.moveTo(tabX + tr, tabY);

  // 底边 → 右下角圆角前
  tabShape.lineTo(tabX + tabBottomW - tr, tabY);
  // 右下角圆角（底边→斜边）
  tabShape.quadraticCurveTo(
    tabX + tabBottomW, tabY,
    tabX + tabBottomW + sdx * tr, tabY + sdy * tr,
  );

  // 斜边 → 右上角圆角前
  tabShape.lineTo(tabX + tabTopW - sdx * tr, tabY + tabH - sdy * tr);
  // 右上角圆角（斜边→顶边）
  tabShape.quadraticCurveTo(
    tabX + tabTopW, tabY + tabH,
    tabX + tabTopW - tr, tabY + tabH,
  );

  // 顶边 → 左上角圆角前
  tabShape.lineTo(tabX + tr, tabY + tabH);
  // 左上角圆角（顶边→左边）
  tabShape.quadraticCurveTo(tabX, tabY + tabH, tabX, tabY + tabH - tr);

  // 左边 → 起点
  tabShape.lineTo(tabX, tabY + tr);
  // 左下角圆角（左边→底边）
  tabShape.quadraticCurveTo(tabX, tabY, tabX + tr, tabY);

  tabShape.closePath();

  const tabExtrudeOpts: THREE.ExtrudeGeometryOptions = {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  };
  const tabGeo = new THREE.ExtrudeGeometry(tabShape, tabExtrudeOpts);
  tabGeo.translate(0, 0, -0.05);
  group.add(new THREE.Mesh(tabGeo, folderMat));

  // ── 三色文件 — 夹在前板与后板之间（z 在后板前面与前板后面之间） ──
  const paperDefs = [
    { color: 0xffffff, y: -0.06, z: 0.05, ry: 0.02 },
    { color: 0x4a9eff, y: 0.01,  z: 0.03, ry: -0.02 },
    { color: 0x3dd68c, y: 0.08, z: 0.01, ry: 0.04 },
  ];

  paperDefs.forEach((p, i) => {
    const paperGeo = new THREE.BoxGeometry(0.72, 0.5, 0.015);
    const paperMat = new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: -0.5,
      metalness: -0.05,
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.position.set(0, p.y, p.z);
    paper.rotation.y = p.ry;
    paper.userData = { paper: true, baseY: p.y, baseZ: p.z, phase: i * 2.1 };
    group.add(paper);
  });

  // ── 装饰线框 ──
  const outlineGeo = new THREE.BoxGeometry(1.06, 1.16, 0.65);
  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(outlineGeo, outlineMat));

  return group;
}

/* ========================================================================== */
/*  项目模型 — 水晶核心 + 环绕立方体集群（保持不变）                              */
/* ========================================================================== */
export function createProjectModel(): THREE.Group {
  const group = new THREE.Group();

  // 中央二十面体水晶核心
  const coreGeo = new THREE.IcosahedronGeometry(0.45, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x4a9eff,
    metalness: 0.25,
    roughness: 0.12,
    emissive: 0x0d1f3c,
    emissiveIntensity: 0.5,
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // 环绕核心运行的卫星立方体
  const count = 10;
  for (let i = 0; i < count; i++) {
    const s = 0.06 + Math.random() * 0.16;
    const geo = new THREE.BoxGeometry(s, s, s);
    const hue = 0.56 + (Math.random() - 0.5) * 0.06;
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue, 0.75, 0.48 + Math.random() * 0.28),
      metalness: 0.45,
      roughness: 0.22,
      emissive: new THREE.Color().setHSL(hue, 0.8, 0.08),
      emissiveIntensity: 0.4,
    });
    const cube = new THREE.Mesh(geo, mat);
    // 在球面上随机分布
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 0.65 + Math.random() * 0.45;
    cube.position.set(
      Math.cos(theta) * Math.sin(phi) * r,
      Math.sin(theta) * Math.sin(phi) * r,
      Math.cos(phi) * r
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    cube.userData = { orbitR: r, orbitSpeed: 0.15 + Math.random() * 0.35, orbitPhase: Math.random() * Math.PI * 2 };
    group.add(cube);
  }

  // 外层线框壳
  const shellGeo = new THREE.IcosahedronGeometry(0.72, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x5ba4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(shellGeo, shellMat));

  return group;
}

/* ========================================================================== */
/*  代码模型 — 窗口图标 + </> 代码符号                                         */
/* ========================================================================== */
export function createCodeRepoModel(): THREE.Group {
  const group = new THREE.Group();

  // 窗口外框材质 — 深灰蓝色
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2d333b,
    metalness: 0.15,
    roughness: 0.3,
  });

  // 标题栏材质 — 略浅
  const titleBarMat = new THREE.MeshStandardMaterial({
    color: 0x22272e,
    metalness: 0.1,
    roughness: 0.35,
  });

  // 屏幕区域材质 — 深色
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x1a1d23,
    metalness: 0.05,
    roughness: 0.5,
  });

  // 代码符号材质 — 亮绿色发光
  const codeMat = new THREE.MeshStandardMaterial({
    color: 0x3dd68c,
    emissive: 0x1a4a2a,
    emissiveIntensity: 0.8,
    metalness: 0.1,
    roughness: 0.15,
  });

  // 窗口主体外框
  const frameGeo = new THREE.BoxGeometry(1.4, 1, 0.1);
  group.add(new THREE.Mesh(frameGeo, frameMat));

  // 标题栏 — 窗口顶部横条
  const titleGeo = new THREE.BoxGeometry(1.4, 0.15, 0.1);
  const titleBar = new THREE.Mesh(titleGeo, titleBarMat);
  titleBar.position.y = 0.45;
  group.add(titleBar);

  // 三个窗口控制圆点（红/黄/绿）
  const dotColors = [0xff5f57, 0xffbd2e, 0x28ca41];
  const dotStartX = -0.6;
  dotColors.forEach((color, i) => {
    const dotGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.2,
      metalness: 0.1,
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(dotStartX + i * 0.10, 0.45, 0.06);
    group.add(dot);
  });

  // 内部屏幕区域（略微凹陷）
  const screenGeo = new THREE.BoxGeometry(1.4, 0.8, 0.04);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, -0.1, 0.04);
  group.add(screen);

  // === </> 代码符号 ===
  // 笔画的公共几何体
  const armGeo = new THREE.BoxGeometry(0.17, 0.028, 0.02);

  // < 左尖括号 — 左上臂
  const ltUp = new THREE.Mesh(armGeo, codeMat);
  ltUp.position.set(-0.18, 0.035, 0.065);
  ltUp.rotation.z = 0.45;
  group.add(ltUp);

  // < 左尖括号 — 左下臂
  const ltDown = new THREE.Mesh(armGeo, codeMat);
  ltDown.position.set(-0.18, -0.035, 0.065);
  ltDown.rotation.z = -0.45;
  group.add(ltDown);

  // > 右尖括号 — 右上臂
  const gtUp = new THREE.Mesh(armGeo, codeMat);
  gtUp.position.set(0.18, 0.035, 0.065);
  gtUp.rotation.z = -0.45;
  group.add(gtUp);

  // > 右尖括号 — 右下臂
  const gtDown = new THREE.Mesh(armGeo, codeMat);
  gtDown.position.set(0.18, -0.035, 0.065);
  gtDown.rotation.z = 0.45;
  group.add(gtDown);

  // / 斜杠 — 中间分隔
  const slashGeo = new THREE.BoxGeometry(0.2, 0.028, 0.02);
  const slash = new THREE.Mesh(slashGeo, codeMat);
  slash.position.set(0, 0, 0.065);
  slash.rotation.z = 1.3;
  group.add(slash);

  // 符号的微光晕 — 半透明平面衬托
  const glowGeo = new THREE.PlaneGeometry(0.5, 0.2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x3dd68c,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, -0.04, 0.06);
  group.add(glow);

  return group;
}

/* ========================================================================== */
/*  工具模型 — 机械齿轮                                                        */
/* ========================================================================== */

/** 构建齿轮的二维截面形状 */
function createGearShape(
  outerR: number,
  innerR: number,
  teeth: number,
  hubR: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const toothAngle = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const center = i * toothAngle - Math.PI / 2;
    // 齿谷左边缘 → 齿顶左边缘 → 齿顶右边缘 → 齿谷右边缘
    const valleyLeft  = center - toothAngle * 0.32;
    const peakLeft    = center - toothAngle * 0.16;
    const peakRight   = center + toothAngle * 0.16;
    const valleyRight = center + toothAngle * 0.32;

    if (i === 0) {
      shape.moveTo(
        Math.cos(valleyLeft) * innerR,
        Math.sin(valleyLeft) * innerR,
      );
    }
    shape.lineTo(Math.cos(peakLeft) * outerR, Math.sin(peakLeft) * outerR);
    shape.lineTo(Math.cos(peakRight) * outerR, Math.sin(peakRight) * outerR);
    shape.lineTo(Math.cos(valleyRight) * innerR, Math.sin(valleyRight) * innerR);
  }
  shape.closePath();

  // 中心轴孔
  const hole = new THREE.Path();
  hole.absarc(0, 0, hubR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return shape;
}

export function createAppToolsModel(): THREE.Group {
  const group = new THREE.Group();

  // 齿轮金属材质
  const gearMat = new THREE.MeshStandardMaterial({
    color: 0xc0c8d0,
    metalness: 0.8,
    roughness: 0.25,
  });

  // 齿轮侧面材质（略暗，模拟挤出厚度）
  const gearSideMat = new THREE.MeshStandardMaterial({
    color: 0xa0a8b0,
    metalness: 0.75,
    roughness: 0.3,
  });

  // 中心轮毂材质
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0xd0d4d8,
    metalness: 0.85,
    roughness: 0.2,
  });

  // 挤出齿轮主体
  const gearShape = createGearShape(0.5, 0.36, 8, 0.16);
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 3,
  };
  const gearGeo = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
  // ExtrudeGeometry 沿 Z 轴挤出，将齿轮平放在 XY 平面后旋转立起
  gearGeo.translate(0, 0, -0.07);
  const gear = new THREE.Mesh(gearGeo, [gearMat, gearSideMat]);
  group.add(gear);

  // 中心轮毂圆柱
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.16, 24);
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.x = Math.PI / 2; // 对齐齿轮平面
  group.add(hub);

  // 轮毂中心凹孔
  const holeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.17, 16);
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x1a1d23,
    roughness: 0.6,
    metalness: 0.2,
  });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  holeMesh.rotation.x = Math.PI / 2;
  group.add(holeMesh);

  // 辐条 — 连接轮毂与外圈的加强筋
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(0.18, 0.04, 0.08);
    const spoke = new THREE.Mesh(spokeGeo, gearMat);
    spoke.position.set(
      Math.cos(angle) * 0.25,
      Math.sin(angle) * 0.25,
      0,
    );
    spoke.rotation.z = angle;
    group.add(spoke);
  }

  // 外圈装饰环
  const rimGeo = new THREE.TorusGeometry(0.36, 0.02, 8, 48);
  const rim = new THREE.Mesh(rimGeo, hubMat);
  group.add(rim);

  return group;
}
